/** Dia da semana: 0 = domingo … 6 = sábado (igual a Date.getDay()). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface DaySchedule {
  open: boolean;
  /** "HH:mm" */
  start: string;
  end: string;
  /** Intervalo opcional (almoço etc.). */
  breakStart?: string | null;
  breakEnd?: string | null;
}

export interface Barber {
  id: string;
  name: string;
  nickname?: string;
  role: string;
  bio: string;
  specialties: string[];
  photoURL?: string | null;
  /** Serviços que o barbeiro faz (ids). */
  serviceIds: string[];
  weekly: Record<Weekday, DaySchedule>;
  /** Datas de folga "yyyy-MM-dd". */
  daysOff: string[];
  active: boolean;
  order: number;
  /** uid do Firebase Auth do barbeiro. */
  uid?: string | null;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  /** minutos */
  duration: number;
  category: "corte" | "barba" | "combo" | "quimica" | "extra";
  featured?: boolean;
  order: number;
}

export type AppointmentStatus = "pending" | "confirmed" | "rejected" | "cancelled" | "done";

/** Dados privados — só o barbeiro (e o próprio cliente logado) leem. */
export interface Appointment {
  id: string;
  barberId: string;
  serviceId: string;
  serviceName: string;
  price: number;
  duration: number;
  /** "yyyy-MM-dd" */
  date: string;
  /** "HH:mm" */
  time: string;
  /** Blocos ocupados ("HH:mm") — derivado da duração. */
  slots: string[];
  clientName: string;
  clientPhone: string;
  clientUid?: string | null;
  notes?: string;
  status: AppointmentStatus;
  createdAt: number;
}

/**
 * Marca pública de horário ocupado. NÃO contém dados do cliente.
 * id = `${barberId}_${date}_${HHmm}` → impede dois agendamentos no mesmo bloco.
 */
export interface BusySlot {
  id: string;
  barberId: string;
  date: string;
  time: string;
  /** Agendamento que ocupa o bloco, ou null para bloqueio manual do barbeiro. */
  appointmentId: string | null;
}

export interface ClientUser {
  uid: string;
  name: string;
  phone: string;
  email?: string;
}

export interface BarberSession {
  uid: string;
  barberId: string;
  email: string;
}

export interface NewBooking {
  barberId: string;
  serviceId: string;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  notes?: string;
}
