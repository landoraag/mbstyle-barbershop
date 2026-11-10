/**
 * Popula o Firestore com serviços e barbeiros e cria os logins da equipe.
 *
 * Uso:
 *   1. Console do Firebase → Configurações → Contas de serviço → "Gerar nova chave privada"
 *      e salve como service-account.json na raiz do projeto (já está no .gitignore).
 *   2. Edite os e-mails da equipe em TEAM abaixo.
 *   3. npm run seed
 *
 * Pode rodar de novo sem duplicar nada (ele atualiza o que já existe).
 */
import { readFileSync } from "node:fs";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { seedBarbers, seedServices } from "../src/lib/seed";

// barberId → e-mail de login. Quem estiver como "admin" pode gerenciar toda a barbearia.
const TEAM: Record<string, { email: string; role: "barber" | "admin" }> = {
  marcos: { email: "marcos@exemplo.com", role: "admin" },
  lucas: { email: "lucas@exemplo.com", role: "barber" },
  mateus: { email: "mateus@exemplo.com", role: "barber" },
  david: { email: "david@exemplo.com", role: "barber" },
};

const sa = JSON.parse(readFileSync(process.env.SERVICE_ACCOUNT ?? "service-account.json", "utf8"));
initializeApp({ credential: cert(sa) });
const db = getFirestore();
const auth = getAuth();

async function main() {
  for (const s of seedServices) {
    const { id, ...data } = s;
    await db.doc(`services/${id}`).set(data, { merge: true });
  }
  console.log(`✓ ${seedServices.length} serviços`);

  for (const b of seedBarbers) {
    const { id, ...data } = b;
    const member = TEAM[id];
    let uid: string | null = null;
    if (member) {
      const tempPassword = Math.random().toString(36).slice(2, 10);
      const user = await auth.getUserByEmail(member.email).catch(() =>
        auth.createUser({ email: member.email, password: tempPassword, displayName: b.name }).then((u) => {
          console.log(`  ↳ login criado: ${member.email}  senha provisória: ${tempPassword}`);
          return u;
        }),
      );
      uid = user.uid;
      await db.doc(`users/${uid}`).set({ role: member.role, name: b.name, email: member.email, barberId: id });
    }
    const ref = db.doc(`barbers/${id}`);
    const exists = (await ref.get()).exists;
    // não sobrescreve horários/bio que o barbeiro já tenha editado no painel
    await ref.set(exists ? { uid, active: data.active, order: data.order } : { ...data, uid }, { merge: true });
    console.log(`✓ barbeiro ${b.name}${exists ? " (atualizado)" : ""}`);
  }
}

main().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
