/**
 * Fotos da seção "O espaço".
 * PROVISÓRIAS: fotos livres do Unsplash (Redd Francisco, Hair Spies, Joshua Lawrence).
 * Troque pelas fotos da MB Style: salve em /public/fotos/ e use "/fotos/nome.jpg".
 */
const u = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=75`;

export const gallery: { src?: string; alt: string }[] = [
  { src: u("1702865272115-5afdbae975af"), alt: "O salão" },
  { src: u("1634480257305-7f4ca3582e6a"), alt: "Acabamento" },
  { src: u("1621645582931-d1d3e6564943"), alt: "A cadeira" },
];
