import type { Barber, DaySchedule, Service, Weekday } from "./types";

/**
 * Dados iniciais — equipe, serviços, preços e horários vêm da agenda atual da MB Style.
 * Bios e especialidades são textos provisórios: o próprio barbeiro edita no painel.
 */

const d = (open: boolean, start = "09:00", end = "19:30"): DaySchedule => ({
  open,
  start,
  end,
  breakStart: null,
  breakEnd: null,
});

const week = (w: Partial<Record<Weekday, DaySchedule>>): Record<Weekday, DaySchedule> => ({
  0: d(false),
  1: d(true),
  2: d(true),
  3: d(true),
  4: d(true),
  5: d(true),
  6: d(true),
  ...w,
});

export const seedServices: Service[] = [
  { id: "corte", name: "Corte", price: 35, duration: 30, category: "corte", featured: true, order: 1, description: "Degradê, tesoura ou social — do seu jeito, com acabamento na navalha." },
  { id: "corte-sobrancelha", name: "Corte + Sobrancelha", price: 40, duration: 30, category: "combo", order: 2, description: "Corte completo com alinhamento da sobrancelha." },
  { id: "corte-barba", name: "Corte + Barba", price: 60, duration: 60, category: "combo", featured: true, order: 3, description: "O combo clássico: corte e barba desenhada." },
  { id: "corte-barba-sobrancelha", name: "Corte + Barba + Sobrancelha", price: 65, duration: 60, category: "combo", featured: true, order: 4, description: "O pacote completo para sair renovado." },
  { id: "corte-lavagem", name: "Corte + Lavagem + Finalização", price: 50, duration: 60, category: "combo", order: 5, description: "Corte, lavagem e finalização com produto." },
  { id: "barba", name: "Barba", price: 30, duration: 30, category: "barba", order: 6, description: "Desenho, alinhamento e acabamento na navalha." },
  { id: "barba-toalha", name: "Barba com toalha quente", price: 35, duration: 30, category: "barba", featured: true, order: 7, description: "O ritual completo com toalha quente." },
  { id: "pigmentacao", name: "Pigmentação", price: 30, duration: 30, category: "extra", order: 8, description: "Preenchimento de falhas para um visual uniforme." },
  { id: "alisamento", name: "Alisamento", price: 30, duration: 30, category: "quimica", order: 9 },
  { id: "luzes", name: "Luzes (mechas)", price: 100, duration: 30, category: "quimica", order: 10 },
  { id: "platinado", name: "Platinado", price: 150, duration: 180, category: "quimica", order: 11, description: "Leva em torno de 3 horas para finalizar." },
  { id: "pezinho", name: "Pezinho", price: 10, duration: 30, category: "extra", order: 12 },
  { id: "cavanhaque", name: "Cavanhaque", price: 10, duration: 30, category: "extra", order: 13 },
  { id: "depilacao-nasal", name: "Depilação nasal", price: 10, duration: 30, category: "extra", order: 14 },
];

const allServices = seedServices.map((s) => s.id);
const withoutPigment = allServices.filter((id) => id !== "pigmentacao");

export const seedBarbers: Barber[] = [
  {
    id: "marcos",
    name: "Marcos Antunes",
    role: "Barbeiro",
    bio: "Precisão no degradê e olhar de quem entende de estilo. Aqui o corte é sobre autoestima.",
    specialties: ["Degradê", "Barba", "Visagismo"],
    serviceIds: withoutPigment,
    weekly: week({ 3: d(true, "09:00", "18:00"), 1: d(true, "09:00", "19:00"), 2: d(true, "09:00", "19:00"), 4: d(true, "09:00", "19:00"), 5: d(true, "08:00", "23:30"), 6: d(true, "07:00", "12:00") }),
    daysOff: [],
    active: true,
    order: 1,
  },
  {
    id: "lucas",
    name: "Lucas Deniz",
    role: "Barbeiro",
    bio: "Atento aos detalhes e às tendências. Do social ao fade mais marcado, com acabamento limpo.",
    specialties: ["Taper fade", "Corte social", "Sobrancelha"],
    serviceIds: withoutPigment,
    weekly: week({ 5: d(true, "08:00", "23:30"), 6: d(true, "07:00", "15:00") }),
    daysOff: [],
    active: true,
    order: 2,
  },
  {
    id: "mateus",
    name: "Mateus Henrique",
    role: "Barbeiro",
    bio: "Tesoura e máquina em sintonia. Cortes com textura e finalização que dura a semana inteira.",
    specialties: ["Texturizado", "Luzes", "Platinado"],
    serviceIds: withoutPigment,
    weekly: week({ 5: d(true, "07:00", "23:00"), 6: d(true, "07:00", "18:00") }),
    daysOff: [],
    active: true,
    order: 3,
  },
  {
    id: "david",
    name: "David",
    nickname: "Dedé",
    role: "Barbeiro",
    bio: "Especialista em barba e pigmentação. Paciência de artesão para cada detalhe.",
    specialties: ["Pigmentação", "Barba", "Freestyle"],
    serviceIds: allServices,
    weekly: week({ 5: d(true, "09:00", "23:00"), 6: d(true, "09:00", "16:00") }),
    daysOff: [],
    active: true,
    order: 4,
  },
];
