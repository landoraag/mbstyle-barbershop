"use client";

import {
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "framer-motion";
import Lenis from "lenis";
import { clsx } from "clsx";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ease } from "./ui";

/* ───────── Rolagem suave ───────── */

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    // âncoras internas (#servicos etc.) com rolagem suave
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a[href*='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const url = new URL(a.href);
      if (url.pathname !== location.pathname || !url.hash) return;
      const el = document.querySelector(url.hash);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -20 });
    };
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);
  return null;
}

/* ───────── Cursor personalizado (só mouse) ───────── */

export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const rx = useSpring(x, { stiffness: 150, damping: 20, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 150, damping: 20, mass: 0.6 });
  const [label, setLabel] = useState<string | null>(null);
  const [hover, setHover] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");
    let last = { x: -100, y: -100 };
    const check = (el: Element | null) => {
      const t = (el as HTMLElement | null)?.closest<HTMLElement>("[data-cursor], a, button");
      setHover(!!t);
      setLabel(t?.dataset.cursor ?? null);
    };
    const move = (e: PointerEvent) => {
      last = { x: e.clientX, y: e.clientY };
      x.set(e.clientX);
      y.set(e.clientY);
      check(e.target as Element);
    };
    // ao rolar, o elemento sob o cursor muda sem pointermove
    const onScroll = () => check(document.elementFromPoint(last.x, last.y));
    window.addEventListener("pointermove", move);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;
  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[200] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-soft mix-blend-difference"
        style={{ x: sx, y: sy }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[199] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold/50"
        style={{ x: rx, y: ry }}
        animate={{
          width: label ? 96 : hover ? 56 : 34,
          height: label ? 96 : hover ? 56 : 34,
          backgroundColor: label ? "rgba(214,189,140,0.95)" : "rgba(214,189,140,0)",
          borderColor: label ? "rgba(214,189,140,0)" : hover ? "rgba(214,189,140,0.8)" : "rgba(184,149,90,0.45)",
        }}
        transition={{ duration: 0.35, ease }}
      >
        {label && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-ink"
          >
            {label}
          </motion.span>
        )}
      </motion.div>
    </>
  );
}

/* ───────── Botão magnético ───────── */

export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 220, damping: 15, mass: 0.3 });
  const y = useSpring(0, { stiffness: 220, damping: 15, mass: 0.3 });
  return (
    <motion.div
      ref={ref}
      className={clsx("inline-block", className)}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ───────── Texto revelado letra a letra ───────── */

export function CharReveal({
  text,
  delay = 0,
  stagger = 0.028,
  className,
  inView = false,
}: {
  text: string;
  delay?: number;
  stagger?: number;
  className?: string;
  inView?: boolean;
}) {
  const words = text.split(" ");
  let idx = 0;
  const anim = inView
    ? { whileInView: { y: 0, opacity: 1, rotate: 0, filter: "blur(0px)" }, viewport: { once: true, margin: "-60px" } }
    : { animate: { y: 0, opacity: 1, rotate: 0, filter: "blur(0px)" } };
  return (
    <span className={clsx("inline-block", className)} aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap" aria-hidden>
          {[...w].map((c) => {
            const i = idx++;
            return (
              <span key={i} className="inline-block overflow-hidden pb-[0.14em] align-bottom">
                <motion.span
                  className="inline-block origin-bottom-left"
                  initial={{ y: "110%", opacity: 0, rotate: 6, filter: "blur(6px)" }}
                  {...anim}
                  transition={{ delay: delay + i * stagger, duration: 1.1, ease }}
                >
                  {c}
                </motion.span>
              </span>
            );
          })}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

/* ───────── Faixa que corre e reage à velocidade da rolagem ───────── */

export function VelocityMarquee({ items, baseVelocity = -2.2, className }: { items: string[]; baseVelocity?: number; className?: string }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [0, 1000], [0, 5], { clamp: false });
  const skew = useTransform(velocity, [-2000, 2000], [8, -8]);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    let move = dir.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * move * f;
    baseX.set(baseX.get() + move);
  });

  const row = (
    <>
      {items.map((t, i) => (
        <span key={i} className="flex items-center">
          <span className={i % 2 ? "font-display italic text-gold-soft" : "font-display text-outline"}>{t}</span>
          <Diamond className="mx-[0.45em] h-[0.18em] w-[0.18em] text-gold" />
        </span>
      ))}
    </>
  );

  return (
    <div className={clsx("overflow-hidden whitespace-nowrap", className)}>
      <motion.div className="flex w-max" style={{ x, skewX: skew }}>
        {row}
        {row}
        {row}
        {row}
      </motion.div>
    </div>
  );
}

export function Diamond({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 10 10" className={className} aria-hidden>
      <path d="M5 0L10 5L5 10L0 5Z" fill="currentColor" />
    </svg>
  );
}

/* ───────── Ornamento art déco que se desenha ───────── */

export function Ornament({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const draw = (d = 0) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: inView ? { pathLength: 1, opacity: 1 } : {},
    transition: { duration: 1.6, delay: d, ease },
  });
  return (
    <svg ref={ref} viewBox="0 0 240 20" className={clsx("h-5 w-60 text-gold", className)} fill="none" stroke="currentColor" aria-hidden>
      <motion.path d="M0 10H100" strokeWidth="0.75" {...draw(0)} />
      <motion.path d="M240 10H140" strokeWidth="0.75" {...draw(0)} />
      <motion.path d="M120 2L128 10L120 18L112 10Z" strokeWidth="0.9" {...draw(0.5)} />
      <motion.path d="M104 10L110 7V13Z M136 10L130 7V13Z" strokeWidth="0.75" {...draw(0.8)} />
    </svg>
  );
}

/* ───────── Número que conta ───────── */

export function Counter({ to, className, suffix = "" }: { to: number; className?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const c = animate(0, to, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => c.stop();
  }, [inView, to, suffix]);
  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}

/* ───────── Imagem com parallax dentro da moldura ───────── */

export function ParallaxImage({ src, alt, className, amount = 14 }: { src: string; alt: string; className?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, `${amount}%`]);
  return (
    <div ref={ref} className={clsx("relative overflow-hidden", className)}>
      <motion.div className="absolute -inset-y-[18%] inset-x-0" style={{ y }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
      </motion.div>
    </div>
  );
}

/* ───────── Revelação por cortina ───────── */

export function MaskReveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={clsx("relative overflow-hidden", className)}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.4, delay, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div
        className="h-full w-full"
        initial={{ scale: 1.25 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.8, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ───────── Botão com texto que rola e fundo que preenche ───────── */

export function RollText({ children }: { children: string }) {
  return (
    <span className="relative inline-flex overflow-hidden">
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}
