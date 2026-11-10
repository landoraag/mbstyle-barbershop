import type {
  Appointment,
  AppointmentStatus,
  Barber,
  BusySlot,
  NewBooking,
  Service,
} from "../types";

export type Role = "client" | "barber" | "admin";

export interface Profile {
  uid: string;
  role: Role;
  name: string;
  phone?: string;
  email?: string;
  /** Preenchido quando role = barber/admin. */
  barberId?: string | null;
}

export type Unsubscribe = () => void;

/**
 * Camada de dados do site. Há duas implementações:
 * - `demo`: tudo no navegador (localStorage), para ver o site funcionando sem backend;
 * - `firebase`: Firestore + Auth, ativada automaticamente quando as variáveis
 *   NEXT_PUBLIC_FIREBASE_* existem.
 */
export interface DataSource {
  mode: "demo" | "firebase";

  listBarbers(): Promise<Barber[]>;
  listServices(): Promise<Service[]>;

  /** Ocupação pública (sem dados de cliente) de um barbeiro em um dia. */
  watchBusy(barberId: string, date: string, cb: (slots: BusySlot[]) => void): Unsubscribe;

  /**
   * Cria um agendamento. Visitante → "pending" (barbeiro aprova).
   * Cliente logado → "confirmed" na hora.
   */
  createBooking(b: NewBooking, profile: Profile | null): Promise<Appointment>;

  // ── Autenticação (clientes e barbeiros usam o mesmo login) ──
  onAuth(cb: (p: Profile | null) => void): Unsubscribe;
  signIn(email: string, password: string): Promise<Profile>;
  signUpClient(data: { name: string; phone: string; email: string; password: string }): Promise<Profile>;
  signOut(): Promise<void>;

  // ── Cliente logado ──
  watchMyAppointments(uid: string, cb: (a: Appointment[]) => void): Unsubscribe;
  cancelMyAppointment(a: Appointment): Promise<void>;

  // ── Barbeiro ──
  watchBarberAppointments(
    barberId: string,
    from: string,
    to: string,
    cb: (a: Appointment[]) => void,
  ): Unsubscribe;
  watchBarberBusy(barberId: string, from: string, to: string, cb: (s: BusySlot[]) => void): Unsubscribe;
  setAppointmentStatus(a: Appointment, status: AppointmentStatus): Promise<void>;
  toggleBlock(barberId: string, date: string, time: string, blocked: boolean): Promise<void>;
  updateBarber(barberId: string, patch: Partial<Barber>): Promise<void>;
}

export class SlotTakenError extends Error {
  constructor() {
    super("Esse horário acabou de ser reservado. Escolha outro, por favor.");
  }
}
