# MB Style — site e agendamento

Site da **MB Style Barbearia** (Rua Iperó, 219 · Vila Nova · Itapeva-SP · [@mb.style01](https://www.instagram.com/mb.style01/)) com agendamento online por barbeiro.

Next.js 15 · TypeScript · Tailwind CSS 4 · Framer Motion · Firebase (Auth + Firestore)

## O que tem

| Página | Para quem | O que faz |
|---|---|---|
| `/` | todos | Tela de carregamento com poste de barbeiro, hero, serviços e preços, catálogo de barbeiros com "próximo horário livre" em tempo real, o espaço, contato com mapa, WhatsApp flutuante |
| `/agendar` | clientes | Barbeiro → serviço → dia e horário → nome e celular. Mostra só **livre/ocupado**. Aceita `?barbeiro=marcos&servico=corte` |
| `/entrar` | clientes e barbeiros | Login único; o perfil decide para onde vai |
| `/conta` | cliente logado | Próximos horários, histórico, cancelar |
| `/painel` | barbeiros | Agenda do dia (linha do "agora"), aceitar/recusar pedidos, bloquear horários, horários da semana, intervalo, folgas, perfil |

### Regras de agendamento

- **Sem login:** só nome e celular → fica **aguardando** até o barbeiro aceitar. O horário já fica reservado.
- **Com login:** confirmado na hora.
- Recusar ou cancelar libera o horário no site imediatamente.
- Dois clientes não conseguem pegar o mesmo horário (garantido pelo banco, não só pela tela).
- O cliente nunca vê quem marcou nem o motivo de um horário estar ocupado.

## Rodar no computador

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

Sem configurar o Firebase, o site roda em **modo demonstração**: tudo funciona, mas os dados ficam só no navegador. Logins de teste do painel: `marcos@mbstyle.demo`, `lucas@mbstyle.demo`, `mateus@mbstyle.demo`, `david@mbstyle.demo`, todos com a senha `mbstyle`.

## Ligar o Firebase

1. Crie um projeto em https://console.firebase.google.com
2. **Authentication → Método de login →** ative *E-mail/senha*.
3. **Firestore Database →** crie o banco (região `southamerica-east1`, São Paulo).
4. **Configurações do projeto → Seus apps →** adicione um app Web e copie a configuração para um arquivo `.env.local` (modelo em `.env.example`).
5. Publique as regras e os índices:
   ```bash
   npx firebase-tools login
   npx firebase-tools use --add      # escolha o projeto
   npx firebase-tools deploy --only firestore
   ```
6. Popule serviços e barbeiros e crie os logins da equipe:
   - **Configurações → Contas de serviço → Gerar nova chave privada** → salve como `service-account.json` na raiz (fica fora do git).
   - Coloque os e-mails reais da equipe em `scripts/seed.ts`.
   - `npm run seed` (mostra uma senha provisória para cada barbeiro).

### Estrutura do banco

| Coleção | Leitura | Conteúdo |
|---|---|---|
| `services` | pública | nome, preço, duração |
| `barbers` | pública | perfil, horários da semana, folgas |
| `busy` | pública | **só** `barberId`, `date`, `time` — id `barbeiro_data_HHmm` |
| `appointments` | barbeiro dono / cliente dono | nome, celular, serviço, status |
| `users` | o próprio usuário | papel (`client`, `barber`, `admin`) |

## Onde mudar as coisas

- **Endereço, horários, WhatsApp, Instagram:** `src/config/site.ts` — ⚠️ o número do WhatsApp ainda é provisório.
- **Serviços, preços e equipe iniciais:** `src/lib/seed.ts`.
- **Fotos do espaço:** coloque em `public/fotos/` e preencha `src/config/gallery.ts`.
- **Foto de cada barbeiro:** o próprio barbeiro coloca o link em *Painel → Perfil*.
- **Logo oficial:** salve em `public/brand/` e troque o componente `Monogram` em `src/components/brand.tsx`. O atual é uma versão vetorial provisória.
- **Cores e fontes:** `src/app/globals.css` (bloco `@theme`).

## Publicar

O jeito mais simples é a [Vercel](https://vercel.com): importe o repositório, cole as variáveis do `.env.local` em *Environment Variables* e publique.
