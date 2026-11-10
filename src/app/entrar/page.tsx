"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { clsx } from "clsx";
import { Monogram, BarberPole } from "@/components/brand";
import { useApp } from "@/components/providers";
import { Field, Spinner, ease, inputCls } from "@/components/ui";
import { data } from "@/lib/data";
import { maskPhone, validPhone } from "@/lib/time";

function EntrarInner() {
  const router = useRouter();
  const params = useSearchParams();
  const back = params.get("voltar");
  const { profile, authReady } = useApp();
  const [mode, setMode] = useState<"login" | "signup">(params.get("modo") === "criar" ? "signup" : "login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authReady || !profile) return;
    router.replace(profile.role === "client" ? back ?? "/conta" : "/painel");
  }, [authReady, profile, router, back]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (mode === "signup") {
      if (name.trim().length < 2) return setError("Informe seu nome.");
      if (!validPhone(phone)) return setError("Informe um celular com DDD.");
      if (password.length < 6) return setError("A senha precisa ter pelo menos 6 caracteres.");
    }
    setBusy(true);
    try {
      if (mode === "login") await data.signIn(email, password);
      else await data.signUpClient({ name: name.trim(), phone, email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo deu errado. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-coal lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(201,163,92,0.18),transparent_60%)]" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-mute hover:text-bone">
            <ArrowLeft className="h-4 w-4" /> Voltar ao site
          </Link>
          <div className="flex items-end gap-10">
            <BarberPole className="h-64 w-auto" />
            <div>
              <h2 className="font-display text-5xl leading-tight">
                Sua cadeira,
                <br />
                <span className="italic text-gold">sem espera.</span>
              </h2>
              <p className="mt-4 max-w-xs text-bone/60">
                Com conta, seus agendamentos são confirmados na hora e ficam todos num só lugar.
              </p>
            </div>
          </div>
          <p className="text-xs text-mute">Barbeiros: entrem com o e-mail da equipe para acessar o painel.</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="w-full max-w-sm"
        >
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-mute lg:hidden">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>
          <Monogram className="h-16 w-16" />
          <h1 className="mt-6 font-display text-4xl">{mode === "login" ? "Entrar" : "Criar conta"}</h1>
          <p className="mt-2 text-sm text-mute">
            {mode === "login" ? "Clientes e barbeiros usam o mesmo acesso." : "Leva menos de um minuto."}
          </p>

          <div className="mt-8 grid grid-cols-2 rounded-full border border-line p-1">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setError(null);
                }}
                className={clsx("relative h-10 rounded-full text-sm transition", mode === m ? "text-ink" : "text-bone/60")}
              >
                {mode === m && (
                  <motion.span layoutId="auth-tab" className="absolute inset-0 rounded-full bg-gold" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
                )}
                <span className="relative">{m === "login" ? "Entrar" : "Criar conta"}</span>
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <AnimatePresence initial={false}>
              {mode === "signup" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease }}
                  className="space-y-4 overflow-hidden"
                >
                  <Field label="Nome">
                    <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                  </Field>
                  <Field label="Celular (WhatsApp)">
                    <input
                      className={inputCls}
                      value={phone}
                      onChange={(e) => setPhone(maskPhone(e.target.value))}
                      inputMode="tel"
                      placeholder="(15) 99999-9999"
                      autoComplete="tel"
                    />
                  </Field>
                </motion.div>
              )}
            </AnimatePresence>
            <Field label="E-mail">
              <input
                className={inputCls}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </Field>
            <Field label="Senha">
              <input
                className={inputCls}
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </Field>

            {error && <p className="rounded-[3px] border border-bad/30 bg-bad/10 px-4 py-2.5 text-sm text-bad">{error}</p>}

            <button
              disabled={busy}
              className="flex h-13 w-full items-center justify-center gap-2 rounded-[3px] bg-gold font-semibold text-ink transition hover:bg-gold-soft disabled:opacity-60"
            >
              {busy && <Spinner />}
              {mode === "login" ? "Entrar" : "Criar conta"}
            </button>
          </form>

          {data.mode === "demo" && (
            <div className="mt-8 rounded-[4px] border border-dashed border-gold/30 p-4 text-xs leading-relaxed text-mute">
              <p className="mb-1 font-semibold uppercase tracking-widest text-gold">Modo demonstração</p>
              Painel do barbeiro: <code className="text-bone">marcos@mbstyle.demo</code> (ou lucas, mateus, david) com a senha{" "}
              <code className="text-bone">mbstyle</code>. Contas de cliente criadas aqui ficam só neste navegador.
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}

export default function EntrarPage() {
  return (
    <Suspense>
      <EntrarInner />
    </Suspense>
  );
}
