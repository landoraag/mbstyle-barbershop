import { clsx } from "clsx";
import type { AppointmentStatus } from "@/lib/types";

const map: Record<AppointmentStatus, { label: string; cls: string }> = {
  pending: { label: "Aguardando", cls: "border-warn/40 bg-warn/10 text-warn" },
  confirmed: { label: "Confirmado", cls: "border-ok/40 bg-ok/10 text-ok" },
  rejected: { label: "Recusado", cls: "border-bad/40 bg-bad/10 text-bad" },
  cancelled: { label: "Cancelado", cls: "border-line bg-white/5 text-mute" },
  done: { label: "Concluído", cls: "border-gold/40 bg-gold/10 text-gold" },
};

export function StatusChip({ status, className }: { status: AppointmentStatus; className?: string }) {
  const s = map[status];
  return (
    <span className={clsx("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.7rem] font-medium", s.cls, className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
}
