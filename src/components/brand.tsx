import { clsx } from "clsx";

/**
 * Monograma MB — versão vetorial provisória inspirada na marca.
 * Quando tiver o arquivo oficial, salve em /public/brand/logo.svg (ou .png)
 * e troque este componente por <img src="/brand/logo.svg" />.
 */
export function Monogram({ className, withRing = true }: { className?: string; withRing?: boolean }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-label="MB Style" role="img">
      <defs>
        <linearGradient id="mb-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0d9a6" />
          <stop offset=".5" stopColor="#c9a35c" />
          <stop offset="1" stopColor="#8f6f33" />
        </linearGradient>
      </defs>
      {withRing && (
        <>
          <path d="M 42 14 A 48 48 0 1 0 78 14" fill="none" stroke="url(#mb-gold)" strokeWidth="1.4" />
          {/* mini poste no topo */}
          <g transform="translate(55 4)">
            <rect x="1" y="3" width="8" height="18" rx="2" fill="#0b0b0c" stroke="url(#mb-gold)" strokeWidth="1" />
            <path d="M2 7l6-3M2 11l6-3M2 15l6-3M2 19l6-3" stroke="url(#mb-gold)" strokeWidth="1.2" />
            <circle cx="5" cy="2" r="2" fill="url(#mb-gold)" />
          </g>
        </>
      )}
      <text
        x="60"
        y="74"
        textAnchor="middle"
        fontFamily="Bodoni Moda, Didot, serif"
        fontSize="44"
        fontWeight="500"
        letterSpacing="-2"
      >
        <tspan fill="#eee7da">M</tspan>
        <tspan fill="url(#mb-gold)">B</tspan>
      </text>
      <text
        x="60"
        y="90"
        textAnchor="middle"
        fontFamily="Manrope, sans-serif"
        fontSize="7"
        letterSpacing="5"
        fill="url(#mb-gold)"
      >
        STYLE
      </text>
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={clsx("inline-flex items-center gap-2.5", className)}>
      <Monogram className="h-9 w-9" />
      <span className="leading-none">
        <span className="block font-display text-[1.05rem] tracking-tight text-bone">
          MB <span className="text-gold">Style</span>
        </span>
        <span className="mt-0.5 block text-[0.58rem] uppercase tracking-[0.32em] text-mute">Barbearia</span>
      </span>
    </span>
  );
}

/** Poste de barbeiro animado (tela de carregamento e detalhes). */
export function BarberPole({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 220" className={className} aria-hidden>
      <defs>
        <linearGradient id="pole-metal" x1="0" x2="1">
          <stop offset="0" stopColor="#5e4a22" />
          <stop offset=".35" stopColor="#f0d9a6" />
          <stop offset=".6" stopColor="#c9a35c" />
          <stop offset="1" stopColor="#4a3a1a" />
        </linearGradient>
        <radialGradient id="pole-ball" cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#fff4d6" />
          <stop offset=".35" stopColor="#d9b56e" />
          <stop offset="1" stopColor="#5e4a22" />
        </radialGradient>
        <linearGradient id="pole-glass" x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity=".55" />
          <stop offset=".25" stopColor="#fff" stopOpacity=".18" />
          <stop offset=".4" stopColor="#fff" stopOpacity="0" />
          <stop offset=".85" stopColor="#000" stopOpacity=".2" />
          <stop offset="1" stopColor="#000" stopOpacity=".6" />
        </linearGradient>
        <pattern id="pole-bands" width="200" height="48" patternUnits="userSpaceOnUse">
          <rect width="200" height="12" y="0" fill="#eee7da" />
          <rect width="200" height="12" y="12" fill="#111113" />
          <rect width="200" height="12" y="24" fill="#c9a35c" />
          <rect width="200" height="12" y="36" fill="#111113" />
        </pattern>
        <clipPath id="pole-clip">
          <rect x="18" y="46" width="44" height="128" rx="6" />
        </clipPath>
      </defs>
      <circle cx="40" cy="18" r="14" fill="url(#pole-ball)" />
      <rect x="22" y="30" width="36" height="6" rx="2" fill="url(#pole-metal)" />
      <rect x="14" y="36" width="52" height="10" rx="3" fill="url(#pole-metal)" />
      <g clipPath="url(#pole-clip)">
        <g transform="rotate(-28 40 110)">
          <g>
            <rect x="-60" y="-96" width="200" height="384" fill="url(#pole-bands)" />
            <animateTransform attributeName="transform" type="translate" from="0 0" to="0 48" dur="1.1s" repeatCount="indefinite" />
          </g>
        </g>
        <rect x="18" y="46" width="44" height="128" fill="url(#pole-glass)" />
      </g>
      <rect x="14" y="174" width="52" height="10" rx="3" fill="url(#pole-metal)" />
      <rect x="22" y="184" width="36" height="8" rx="2" fill="url(#pole-metal)" />
      <rect x="28" y="192" width="24" height="20" rx="3" fill="url(#pole-metal)" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden>
      <path d="M16.04 3C9.4 3 4 8.36 4 14.97c0 2.11.56 4.17 1.62 5.98L4 29l8.27-1.58a12.1 12.1 0 0 0 3.77.6C22.68 28 28 22.64 28 16.03 28 9.4 22.68 3 16.04 3Zm0 22.83c-1.21 0-2.4-.22-3.52-.66l-.25-.1-4.9.94.96-4.76-.17-.27a9.7 9.7 0 0 1-1.49-5.01c0-5.42 4.42-9.82 9.37-9.82 5.43 0 9.67 4.4 9.67 9.82 0 5.43-4.24 9.86-9.67 9.86Zm5.3-7.36c-.29-.15-1.72-.85-1.99-.94-.27-.1-.46-.15-.66.14-.19.29-.75.94-.92 1.13-.17.2-.34.22-.63.07-.29-.15-1.22-.45-2.32-1.43-.86-.76-1.44-1.7-1.6-1.99-.17-.29-.02-.45.13-.59.13-.13.29-.34.44-.51.14-.17.19-.29.29-.48.1-.2.05-.37-.03-.51-.07-.15-.65-1.57-.9-2.15-.23-.56-.47-.48-.65-.49h-.55c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.42s1.05 2.8 1.19 3c.15.2 2.06 3.14 4.99 4.4.7.3 1.24.48 1.67.62.7.22 1.34.19 1.84.12.56-.08 1.72-.7 1.97-1.38.24-.68.24-1.26.17-1.38-.07-.12-.27-.2-.56-.34Z" />
    </svg>
  );
}

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
