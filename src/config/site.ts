/**
 * Informações da MB Style.
 * Fonte: perfil @mb.style01 e página de agendamento atual (BarberCode).
 * Troque aqui sempre que algo mudar — o site inteiro lê deste arquivo.
 */
export const site = {
  name: "MB Style",
  tagline: "Produtor de autoestima",
  slogan: "Você merece seu melhor estilo.",
  city: "Itapeva — SP",
  address: {
    street: "Rua Iperó, 219",
    district: "Vila Nova",
    city: "Itapeva — SP",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Rua+Iper%C3%B3%2C+219%2C+Vila+Nova%2C+Itapeva+SP",
    mapsEmbed:
      "https://www.google.com/maps?q=Rua+Iper%C3%B3,+219,+Vila+Nova,+Itapeva+-+SP&output=embed",
  },
  instagram: {
    handle: "@mb.style01",
    url: "https://www.instagram.com/mb.style01/",
  },
  /**
   * WhatsApp da barbearia — PENDENTE.
   * Formato internacional só com números: 55 + DDD + número (ex.: 5515999999999).
   */
  whatsapp: "5515000000000",
  whatsappMessage: "Olá! Vim pelo site da MB Style e tenho uma dúvida.",
  /**
   * Foto de fundo do hero (aparece translúcida, em preto e branco).
   * Provisória: foto de Redd Francisco no Unsplash (licença livre).
   * Troque por uma foto da MB Style: salve em /public/fotos/hero.jpg e use "/fotos/hero.jpg".
   */
  heroImage: "https://images.unsplash.com/photo-1672642150228-3fcd5826ec26?auto=format&fit=crop&w=2400&q=80",
  /** Horário geral exibido no site (o de cada barbeiro é configurado no painel). */
  hours: [
    { days: "Segunda a quinta", time: "09h – 19h30" },
    { days: "Sexta", time: "08h – 23h" },
    { days: "Sábado", time: "07h – 18h" },
    { days: "Domingo", time: "Fechado" },
  ],
  /** Quantos dias à frente o cliente pode agendar. */
  bookingWindowDays: 30,
  /** Tamanho do bloco da agenda, em minutos. */
  slotMinutes: 30,
} as const;

export function whatsappLink(text: string = site.whatsappMessage) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}
