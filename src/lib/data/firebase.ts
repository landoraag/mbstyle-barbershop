"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  deleteDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { busyId, slotRange } from "../time";
import type { Appointment, Barber, BusySlot, Service } from "../types";
import { SlotTakenError, type DataSource, type Profile } from "./types";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const hasFirebaseConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

function fb() {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return { auth: getAuth(app), db: getFirestore(app) };
}

const withId = <T,>(id: string, data: unknown) => ({ id, ...(data as object) }) as T;

async function loadProfile(uid: string): Promise<Profile | null> {
  const snap = await getDoc(doc(fb().db, "users", uid));
  return snap.exists() ? ({ uid, ...snap.data() } as Profile) : null;
}

export const firebaseSource: DataSource = {
  mode: "firebase",

  async listBarbers() {
    const snap = await getDocs(query(collection(fb().db, "barbers"), where("active", "==", true)));
    return snap.docs.map((d) => withId<Barber>(d.id, d.data())).sort((a, b) => a.order - b.order);
  },
  async listServices() {
    const snap = await getDocs(collection(fb().db, "services"));
    return snap.docs.map((d) => withId<Service>(d.id, d.data())).sort((a, b) => a.order - b.order);
  },

  watchBusy(barberId, date, cb) {
    const q = query(collection(fb().db, "busy"), where("barberId", "==", barberId), where("date", "==", date));
    return onSnapshot(q, (s) => cb(s.docs.map((d) => withId<BusySlot>(d.id, d.data()))));
  },

  async createBooking(b, profile) {
    const { db } = fb();
    const svcSnap = await getDoc(doc(db, "services", b.serviceId));
    if (!svcSnap.exists()) throw new Error("Serviço não encontrado.");
    const svc = withId<Service>(svcSnap.id, svcSnap.data());
    const range = slotRange(b.time, svc.duration);
    const ref = doc(collection(db, "appointments"));
    const appt: Appointment = {
      id: ref.id,
      ...b,
      notes: b.notes ?? "",
      serviceName: svc.name,
      price: svc.price,
      duration: svc.duration,
      slots: range,
      clientUid: profile?.role === "client" ? profile.uid : null,
      status: profile?.role === "client" ? "confirmed" : "pending",
      createdAt: Date.now(),
    };
    const batch = writeBatch(db);
    const { id: _id, ...data } = appt;
    void _id;
    batch.set(ref, data);
    // Criar um "busy" que já existe vira update → as regras recusam → sem conflito de horário.
    range.forEach((t) =>
      batch.set(doc(db, "busy", busyId(b.barberId, b.date, t)), {
        barberId: b.barberId,
        date: b.date,
        time: t,
        appointmentId: ref.id,
      }),
    );
    try {
      await batch.commit();
    } catch (e) {
      if ((e as { code?: string }).code === "permission-denied") throw new SlotTakenError();
      throw e;
    }
    return appt;
  },

  onAuth(cb) {
    return onAuthStateChanged(fb().auth, async (u) => cb(u ? await loadProfile(u.uid) : null));
  },
  async signIn(email, password) {
    try {
      const cred = await signInWithEmailAndPassword(fb().auth, email.trim(), password);
      const p = await loadProfile(cred.user.uid);
      if (!p) throw new Error("Conta sem perfil cadastrado.");
      return p;
    } catch (e) {
      const code = (e as { code?: string }).code ?? "";
      if (code.includes("invalid") || code.includes("wrong") || code.includes("not-found"))
        throw new Error("E-mail ou senha incorretos.");
      throw e;
    }
  },
  async signUpClient({ name, phone, email, password }) {
    const { auth, db } = fb();
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password).catch((e) => {
      if (e.code === "auth/email-already-in-use") throw new Error("Já existe uma conta com esse e-mail.");
      if (e.code === "auth/weak-password") throw new Error("A senha precisa ter pelo menos 6 caracteres.");
      throw e;
    });
    const profile: Profile = { uid: cred.user.uid, role: "client", name, phone, email: email.trim() };
    await setDoc(doc(db, "users", cred.user.uid), { role: "client", name, phone, email: email.trim(), barberId: null });
    return profile;
  },
  async signOut() {
    await fbSignOut(fb().auth);
  },

  watchMyAppointments(uid, cb) {
    const q = query(collection(fb().db, "appointments"), where("clientUid", "==", uid));
    return onSnapshot(q, (s) => cb(s.docs.map((d) => withId<Appointment>(d.id, d.data()))));
  },
  async cancelMyAppointment(a) {
    await this.setAppointmentStatus(a, "cancelled");
  },

  watchBarberAppointments(barberId, from, to, cb) {
    const q = query(
      collection(fb().db, "appointments"),
      where("barberId", "==", barberId),
      where("date", ">=", from),
      where("date", "<=", to),
    );
    return onSnapshot(q, (s) => cb(s.docs.map((d) => withId<Appointment>(d.id, d.data()))));
  },
  watchBarberBusy(barberId, from, to, cb) {
    const q = query(
      collection(fb().db, "busy"),
      where("barberId", "==", barberId),
      where("date", ">=", from),
      where("date", "<=", to),
    );
    return onSnapshot(q, (s) => cb(s.docs.map((d) => withId<BusySlot>(d.id, d.data()))));
  },
  async setAppointmentStatus(a, status) {
    const { db } = fb();
    const batch = writeBatch(db);
    batch.update(doc(db, "appointments", a.id), { status });
    if (status === "rejected" || status === "cancelled")
      a.slots.forEach((t) => batch.delete(doc(db, "busy", busyId(a.barberId, a.date, t))));
    await batch.commit();
  },
  async toggleBlock(barberId, date, time, blocked) {
    const ref = doc(fb().db, "busy", busyId(barberId, date, time));
    if (blocked) await setDoc(ref, { barberId, date, time, appointmentId: null });
    else await deleteDoc(ref);
  },
  async updateBarber(barberId, patch) {
    const { id: _id, uid: _uid, ...rest } = patch;
    void _id;
    void _uid;
    await updateDoc(doc(fb().db, "barbers", barberId), rest);
  },
};
