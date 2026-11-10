"use client";

import { addDays } from "date-fns";
import { seedBarbers, seedServices } from "../seed";
import { busyId, dateKey, slotRange, workingSlots } from "../time";
import type { Appointment, Barber, BusySlot, Service } from "../types";
import { SlotTakenError, type DataSource, type Profile } from "./types";

/**
 * Modo demonstração: tudo fica no localStorage deste navegador.
 * Contas de barbeiro de exemplo: <id>@mbstyle.demo / mbstyle (ex.: marcos@mbstyle.demo).
 */

const KEY = "mbstyle-demo-v1";
const DEMO_PASSWORD = "mbstyle";

interface Account {
  uid: string;
  email: string;
  password: string;
  profile: Profile;
}
interface Store {
  barbers: Barber[];
  services: Service[];
  appointments: Appointment[];
  busy: BusySlot[];
  accounts: Account[];
  session: string | null;
}

const listeners = new Set<() => void>();
let cache: Store | null = null;

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

const firstNames = ["Gabriel", "Rafael", "João", "Pedro", "Arthur", "Enzo", "Miguel", "Bruno", "Caio", "Vitor", "Heitor", "Davi"];
const lastNames = ["Silva", "Souza", "Oliveira", "Lima", "Almeida", "Rocha", "Prado", "Moraes"];

function rand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function seedStore(): Store {
  const barbers = structuredClone(seedBarbers);
  const appointments: Appointment[] = [];
  const busy: BusySlot[] = [];
  const r = rand(42);
  const today = new Date();
  barbers.forEach((b, bi) => {
    for (let day = 0; day < 14; day++) {
      const key = dateKey(addDays(today, day));
      const slots = workingSlots(b, key);
      slots.forEach((time) => {
        if (busy.some((x) => x.barberId === b.id && x.date === key && x.time === time)) return;
        const roll = r();
        const density = day < 2 ? 0.45 : day < 6 ? 0.3 : 0.15;
        if (roll > density) return;
        const svc = seedServices[Math.floor(r() * 7)];
        const range = slotRange(time, svc.duration).filter((t) => slots.includes(t));
        if (range.some((t) => busy.some((x) => x.barberId === b.id && x.date === key && x.time === t))) return;
        const id = uid();
        const status = r() < 0.18 && day > 0 ? "pending" : "confirmed";
        appointments.push({
          id,
          barberId: b.id,
          serviceId: svc.id,
          serviceName: svc.name,
          price: svc.price,
          duration: svc.duration,
          date: key,
          time,
          slots: range,
          clientName: `${firstNames[Math.floor(r() * firstNames.length)]} ${lastNames[Math.floor(r() * lastNames.length)]}`,
          clientPhone: `(15) 9${Math.floor(1000 + r() * 8999)}-${Math.floor(1000 + r() * 8999)}`,
          status,
          createdAt: Date.now() - Math.floor(r() * 4e8),
        });
        range.forEach((t) => busy.push({ id: busyId(b.id, key, t), barberId: b.id, date: key, time: t, appointmentId: id }));
      });
    }
    void bi;
  });
  const accounts: Account[] = barbers.map((b) => ({
    uid: `barber-${b.id}`,
    email: `${b.id}@mbstyle.demo`,
    password: DEMO_PASSWORD,
    profile: {
      uid: `barber-${b.id}`,
      role: b.id === "marcos" ? "admin" : "barber",
      name: b.name,
      email: `${b.id}@mbstyle.demo`,
      barberId: b.id,
    },
  }));
  return { barbers, services: structuredClone(seedServices), appointments, busy, accounts, session: null };
}

function load(): Store {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      cache = JSON.parse(raw) as Store;
      return cache;
    }
  } catch {
    /* sem storage: segue em memória */
  }
  cache = seedStore();
  save();
  return cache;
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  fn();
  return () => {
    listeners.delete(fn);
  };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const demoSource: DataSource = {
  mode: "demo",

  async listBarbers() {
    return load().barbers.filter((b) => b.active).sort((a, b) => a.order - b.order);
  },
  async listServices() {
    return load().services.sort((a, b) => a.order - b.order);
  },

  watchBusy(barberId, date, cb) {
    return subscribe(() => cb(load().busy.filter((b) => b.barberId === barberId && b.date === date)));
  },

  async createBooking(b, profile) {
    await sleep(900);
    const s = load();
    const svc = s.services.find((x) => x.id === b.serviceId)!;
    const range = slotRange(b.time, svc.duration);
    if (range.some((t) => s.busy.some((x) => x.id === busyId(b.barberId, b.date, t)))) throw new SlotTakenError();
    const id = uid();
    const appt: Appointment = {
      id,
      ...b,
      serviceName: svc.name,
      price: svc.price,
      duration: svc.duration,
      slots: range,
      clientUid: profile?.role === "client" ? profile.uid : null,
      status: profile ? "confirmed" : "pending",
      createdAt: Date.now(),
    };
    s.appointments.push(appt);
    range.forEach((t) => s.busy.push({ id: busyId(b.barberId, b.date, t), barberId: b.barberId, date: b.date, time: t, appointmentId: id }));
    save();
    return appt;
  },

  onAuth(cb) {
    return subscribe(() => {
      const s = load();
      cb(s.accounts.find((a) => a.uid === s.session)?.profile ?? null);
    });
  },
  async signIn(email, password) {
    await sleep(500);
    const s = load();
    const acc = s.accounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
    if (!acc || acc.password !== password) throw new Error("E-mail ou senha incorretos.");
    s.session = acc.uid;
    save();
    return acc.profile;
  },
  async signUpClient({ name, phone, email, password }) {
    await sleep(600);
    const s = load();
    if (s.accounts.some((a) => a.email.toLowerCase() === email.trim().toLowerCase()))
      throw new Error("Já existe uma conta com esse e-mail.");
    const id = uid();
    const profile: Profile = { uid: id, role: "client", name, phone, email };
    s.accounts.push({ uid: id, email: email.trim(), password, profile });
    s.session = id;
    save();
    return profile;
  },
  async signOut() {
    load().session = null;
    save();
  },

  watchMyAppointments(u, cb) {
    return subscribe(() => cb(load().appointments.filter((a) => a.clientUid === u)));
  },
  async cancelMyAppointment(a) {
    await this.setAppointmentStatus(a, "cancelled");
  },

  watchBarberAppointments(barberId, from, to, cb) {
    return subscribe(() =>
      cb(load().appointments.filter((a) => a.barberId === barberId && a.date >= from && a.date <= to)),
    );
  },
  watchBarberBusy(barberId, from, to, cb) {
    return subscribe(() => cb(load().busy.filter((b) => b.barberId === barberId && b.date >= from && b.date <= to)));
  },
  async setAppointmentStatus(a, status) {
    const s = load();
    const ap = s.appointments.find((x) => x.id === a.id);
    if (!ap) return;
    ap.status = status;
    if (status === "rejected" || status === "cancelled") s.busy = s.busy.filter((b) => b.appointmentId !== a.id);
    save();
  },
  async toggleBlock(barberId, date, time, blocked) {
    const s = load();
    const id = busyId(barberId, date, time);
    if (blocked) {
      if (!s.busy.some((b) => b.id === id)) s.busy.push({ id, barberId, date, time, appointmentId: null });
    } else {
      s.busy = s.busy.filter((b) => !(b.id === id && b.appointmentId === null));
    }
    save();
  },
  async updateBarber(barberId, patch) {
    const s = load();
    const b = s.barbers.find((x) => x.id === barberId);
    if (b) Object.assign(b, patch);
    save();
  },
};

export function resetDemo() {
  cache = seedStore();
  save();
}
