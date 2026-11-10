"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { clsx } from "clsx";
import type { ReactNode } from "react";

export const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  ...rest
}: { children: ReactNode; delay?: number; y?: number; className?: string } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Título com palavras subindo uma a uma. */
export function SplitHeading({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={clsx("inline", className)} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom" aria-hidden>
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: delay + i * 0.06, ease }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={clsx("flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.35em] text-gold", className)}>
      <span className="h-px w-8 bg-gold/60" />
      {children}
    </p>
  );
}

export function Avatar({ name, photo, className }: { name: string; photo?: string | null; className?: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
  if (photo)
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={photo} alt={name} className={clsx("object-cover", className)} />;
  return (
    <div
      className={clsx(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-smoke via-graphite to-ink font-display text-gold-soft",
        className,
      )}
      aria-label={name}
    >
      <span className="absolute inset-0 opacity-[0.025] pole-stripes" />
      <span className="relative">{initials}</span>
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={clsx("inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent", className)}
    />
  );
}

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | null;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-mute">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-xs text-bad">{error}</span>}
    </label>
  );
}

export const inputCls =
  "h-13 w-full rounded-2xl border border-line bg-graphite/70 px-4 text-[0.95rem] text-bone placeholder:text-mute/60 outline-none transition focus:border-gold/70 focus:bg-graphite focus:ring-4 focus:ring-gold/10";

/** Nome de serviço com o "+" em fonte legível (a serifada deixa o + quase invisível). */
export function ServiceName({ name }: { name: string }) {
  const parts = name.split(" + ");
  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-1.5 font-sans text-[0.75em] font-light text-gold not-italic">+</span>}
          {p}
        </span>
      ))}
    </>
  );
}
