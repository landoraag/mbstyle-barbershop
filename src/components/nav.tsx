"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CalendarDays, Menu, UserRound, X } from "lucide-react";
import { clsx } from "clsx";
import { Wordmark } from "./brand";
import { useApp } from "./providers";

const links = [
  { href: "/#servicos", label: "Serviços" },
  { href: "/#barbeiros", label: "Barbeiros" },
  { href: "/#espaco", label: "O espaço" },
  { href: "/#contato", label: "Contato" },
];

export function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const { profile } = useApp();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setCompact(y > 40);
    setHidden(y > 400 && y > prev && !open);
  });

  const accountHref = profile ? (profile.role === "client" ? "/conta" : "/painel") : "/entrar";

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -110 : 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
      >
        <nav
          className={clsx(
            "glass flex w-full max-w-6xl items-center justify-between rounded-full pl-4 pr-2 transition-all duration-500",
            compact ? "py-1.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]" : "py-2.5",
          )}
        >
          <Link href="/" aria-label="MB Style — início" className="shrink-0">
            <Wordmark />
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group relative rounded-full px-4 py-2 text-sm text-bone/75 transition hover:text-bone"
                >
                  {l.label}
                  <span className="absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5">
            <Link
              href={accountHref}
              aria-label={profile ? "Minha conta" : "Entrar"}
              className="hidden h-10 items-center gap-2 rounded-full px-3 text-sm text-bone/75 transition hover:bg-white/5 hover:text-bone sm:flex"
            >
              <UserRound className="h-4 w-4" />
              <span className="max-w-24 truncate">{profile ? profile.name.split(" ")[0] : "Entrar"}</span>
            </Link>
            {pathname !== "/agendar" && (
              <Link
                href="/agendar"
                className="group relative flex h-10 items-center gap-2 overflow-hidden rounded-full bg-gold px-3.5 min-[400px]:px-5 text-sm font-semibold text-ink transition hover:bg-gold-soft"
              >
                <CalendarDays className="h-4 w-4" />
                <span className="hidden min-[400px]:inline">Agendar</span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Link>
            )}
            <button
              onClick={() => setOpen(true)}
              aria-label="Abrir menu"
              className="flex h-10 w-10 items-center justify-center rounded-full text-bone hover:bg-white/5 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] bg-ink/95 backdrop-blur-xl md:hidden"
            initial={{ clipPath: "circle(0% at 92% 6%)" }}
            animate={{ clipPath: "circle(150% at 92% 6%)" }}
            exit={{ clipPath: "circle(0% at 92% 6%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex items-center justify-between px-6 pt-6">
              <Wordmark />
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="mt-14 space-y-2 px-6">
              {[...links, { href: accountHref, label: profile ? "Minha conta" : "Entrar" }].map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 border-b border-line py-4 font-display text-4xl"
                  >
                    <span className="font-sans text-xs text-gold">0{i + 1}</span>
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="absolute inset-x-6 bottom-8"
            >
              <Link
                href="/agendar"
                onClick={() => setOpen(false)}
                className="flex h-14 items-center justify-center gap-2 rounded-full bg-gold font-semibold text-ink"
              >
                <CalendarDays className="h-5 w-5" /> Agendar horário
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
