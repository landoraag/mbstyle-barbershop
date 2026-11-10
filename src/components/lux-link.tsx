"use client";

import Link from "next/link";
import { clsx } from "clsx";
import { Magnetic, RollText } from "./fx";

/** CTA principal: magnético, texto que rola e preenchimento dourado subindo. */
export function LuxLink({
  href,
  children,
  variant = "solid",
  className,
  cursor,
}: {
  href: string;
  children: string;
  variant?: "solid" | "outline";
  className?: string;
  cursor?: string;
}) {
  return (
    <Magnetic strength={0.25}>
      <Link
        href={href}
        data-cursor={cursor}
        className={clsx(
          "group relative inline-flex h-14 items-center overflow-hidden px-9 text-[0.76rem] font-medium uppercase tracking-[0.24em] transition-colors duration-500",
          variant === "solid" ? "bg-bone text-ink" : "border border-bone/25 text-bone hover:text-ink",
          className,
        )}
      >
        <span className="absolute inset-0 translate-y-[101%] bg-gold-soft transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0" />
        <span className="relative">
          <RollText>{children}</RollText>
        </span>
      </Link>
    </Magnetic>
  );
}
