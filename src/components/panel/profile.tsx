"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { clsx } from "clsx";
import { useApp } from "../providers";
import { Avatar, Field, Spinner, inputCls } from "../ui";
import { data } from "@/lib/data";
import type { Barber } from "@/lib/types";

export function ProfileView({ barber }: { barber: Barber }) {
  const { services, refreshCatalog } = useApp();
  const [form, setForm] = useState({
    nickname: barber.nickname ?? "",
    role: barber.role,
    bio: barber.bio,
    photoURL: barber.photoURL ?? "",
    specialties: barber.specialties,
    serviceIds: barber.serviceIds,
  });
  const [tag, setTag] = useState("");
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);

  async function save() {
    setSaving(true);
    await data.updateBarber(barber.id, {
      ...form,
      nickname: form.nickname.trim(),
      photoURL: form.photoURL.trim() || null,
    });
    await refreshCatalog();
    setSaving(false);
    setOk(true);
    setTimeout(() => setOk(false), 2000);
  }

  return (
    <div className="max-w-3xl">
      <p className="text-[0.7rem] uppercase tracking-[0.35em] text-gold">Perfil</p>
      <h1 className="mt-2 font-display text-4xl">Como você aparece no site</h1>

      <div className="mt-8 flex items-center gap-5 rounded-3xl border border-line bg-coal p-5">
        <Avatar name={barber.name} photo={form.photoURL || null} className="h-24 w-24 rounded-2xl text-3xl" />
        <div className="flex-1">
          <p className="font-display text-2xl">
            {barber.name} {form.nickname && <span className="italic text-gold">“{form.nickname}”</span>}
          </p>
          <p className="text-sm text-mute">{form.role}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="Apelido (opcional)">
          <input className={inputCls} value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} />
        </Field>
        <Field label="Função">
          <input className={inputCls} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Link da foto">
            <input
              className={inputCls}
              value={form.photoURL}
              placeholder="https://… ou /fotos/seu-nome.jpg"
              onChange={(e) => setForm({ ...form, photoURL: e.target.value })}
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Sobre você">
            <textarea
              className={clsx(inputCls, "h-28 resize-none py-3")}
              value={form.bio}
              maxLength={220}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Especialidades">
            <div className="flex flex-wrap gap-2 rounded-2xl border border-line bg-graphite/70 p-2.5">
              {form.specialties.map((s) => (
                <span key={s} className="flex items-center gap-1 rounded-full bg-gold/15 py-1 pl-3 pr-1.5 text-sm text-gold-soft">
                  {s}
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, specialties: form.specialties.filter((x) => x !== s) })}
                    className="rounded-full p-0.5 hover:bg-gold/20"
                    aria-label={`Remover ${s}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <input
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && tag.trim()) {
                    e.preventDefault();
                    if (!form.specialties.includes(tag.trim()))
                      setForm({ ...form, specialties: [...form.specialties, tag.trim()].slice(0, 5) });
                    setTag("");
                  }
                }}
                placeholder="Digite e Enter"
                className="min-w-28 flex-1 bg-transparent px-2 text-sm outline-none"
              />
            </div>
          </Field>
        </div>
      </div>

      <h2 className="mt-10 font-display text-2xl">Serviços que você faz</h2>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {services.map((s) => {
          const on = form.serviceIds.includes(s.id);
          return (
            <button
              key={s.id}
              onClick={() =>
                setForm({ ...form, serviceIds: on ? form.serviceIds.filter((x) => x !== s.id) : [...form.serviceIds, s.id] })
              }
              className={clsx(
                "flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition",
                on ? "border-gold/50 bg-gold/[0.06]" : "border-line text-mute",
              )}
            >
              {s.name}
              <span className={clsx("flex h-5 w-5 items-center justify-center rounded-md border", on ? "border-gold bg-gold text-ink" : "border-line")}>
                {on && <Check className="h-3.5 w-3.5" />}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="mt-10 flex h-13 items-center gap-2 rounded-full bg-gold px-8 font-semibold text-ink hover:bg-gold-soft"
      >
        {saving ? <Spinner /> : <Check className="h-4 w-4" />} {ok ? "Salvo!" : "Salvar perfil"}
      </button>
    </div>
  );
}
