# Say It — Plateforme de dédicaces TikTok

Application web pour une émission TikTok en live chaque samedi. Les spectateurs envoient une dédicace, l’hôte contacte le destinataire sur WhatsApp pendant le live, puis lit le message à voix haute. Les dons sont optionnels et n’empêchent jamais l’envoi.

**Écrire → Envoyer → Donner → Attendre la surprise en live**

## Stack technique

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion
- React Hook Form + Zod
- Neon PostgreSQL + Drizzle ORM
- Auth.js (identifiants, cookies HTTP-only, mots de passe hashés)
- Architecture compatible Vercel

## Installation

```bash
npm install
cp .env.example .env.local
```

Renseigne les variables dans `.env.local`, puis :

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Variables d’environnement

| Variable | Rôle |
| --- | --- |
| `DATABASE_URL` | Chaîne de connexion Neon PostgreSQL |
| `NEXT_PUBLIC_SITE_URL` | URL canonique du site |
| `NEXT_PUBLIC_TIKTOK_URL` | Profil TikTok public ou URL du live |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Numéro de contact public optionnel |
| `PAYPAL_DONATION_URL` | Lien de don après l’envoi (Zelle par défaut) |
| `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` | Réservé pour une confirmation PayPal future |
| `CRON_SECRET` | Protège le cron de conservation sur Vercel |
| `AUTH_SECRET` | Secret Auth.js (`openssl rand -base64 32`) |
| `ADMIN_SECRET` | Secret optionnel pour hasher les clés de rate-limit |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Compte de seed local uniquement |
| `TURNSTILE_SECRET_KEY` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile optionnel |

Ne jamais mettre les identifiants de base, secrets Auth ou secrets PayPal dans le code client.

## Base Neon

1. Crée un projet sur [neon.tech](https://neon.tech).
2. Copie la chaîne de connexion pooled dans `DATABASE_URL`.
3. Applique le schéma avec :

```bash
npm run db:push
```

ou colle `drizzle/migrations/0000_init.sql` dans l’éditeur SQL Neon.

4. Crée le compte admin et les réglages par défaut :

```bash
npm run db:seed
```

## Drizzle

```bash
npm run db:generate   # générer les migrations après un changement de schéma
npm run db:push       # pousser le schéma vers Neon (plus simple au premier setup)
npm run db:migrate    # appliquer les migrations SQL
npm run db:studio     # parcourir les données
npm run db:seed       # créer/mettre à jour l’admin local
```

Le schéma est dans `drizzle/schema.ts`.

## Développement local

1. `npm install`
2. Configure `.env.local`
3. `npm run db:push`
4. `npm run db:seed`
5. `npm run dev`

Les pages publiques s’affichent sans base (compte à rebours, textes, layout). L’envoi d’une dédicace et le tableau de bord admin nécessitent `DATABASE_URL`.

## Compte admin

Le script de seed crée **un** admin à partir de `ADMIN_EMAIL` et `ADMIN_PASSWORD`. Les mots de passe sont hashés avec bcrypt. Aucun mot de passe n’est stocké en clair.

Connexion : `/admin/login`.

Ne réutilise pas le mot de passe de seed en production. Crée un admin unique après le déploiement et fais tourner les secrets.

## Dons (Zelle)

Les dons sont optionnels. La dédicace est enregistrée **avant** l’écran de don.

Le lien de don par défaut est l’URL QR Zelle :

`https://zellepay.com/qr/8036ce78-68f7-43c3-8833-2a40e4f93798`

Tu peux le remplacer avec `PAYPAL_DONATION_URL` ou dans les réglages admin. L’app ne marque un don comme confirmé que si un admin le valide.

## Déploiement Vercel

1. Pousse le dépôt et importe-le dans Vercel.
2. Définis toutes les variables d’environnement dans le projet Vercel.
3. `AUTH_SECRET` est obligatoire en production.
4. Lance `db:push` / la migration SQL sur la base Neon de production.
5. Seed un admin de production avec un mot de passe unique et fort, puis retire les identifiants de seed de l’environnement s’ils n’ont servi qu’une fois.

Checklist production :

- [ ] `DATABASE_URL` pointe vers Neon
- [ ] `AUTH_SECRET` est unique et long
- [ ] `NEXT_PUBLIC_SITE_URL` est le domaine live
- [ ] `NEXT_PUBLIC_TIKTOK_URL` est l’URL de l’émission
- [ ] L’URL de don est définie (Zelle par défaut)
- [ ] Le mot de passe admin n’est pas le défaut local
- [ ] Confidentialité et Conditions ont été relues
- [ ] Les numéros WhatsApp des destinataires n’apparaissent jamais sur les pages publiques
- [ ] `CRON_SECRET` est défini si tu utilises le job de conservation hebdomadaire

Conservation : les dédicaces terminées, lues en live ou refusées plus anciennes que la fenêtre définie dans Réglages sont archivées par le cron Vercel du samedi (`/api/cron/retention`) ou le bouton **Archiver les dédicaces expirées** dans Réglages.

## Confidentialité

Les numéros WhatsApp des destinataires sont réservés à l’admin. Les APIs publiques et les cartes de dédicace n’incluent jamais de numéros, de hash IP ou de notes internes.

## Routes

- `/` accueil
- `/dedicate` formulaire de dédicace en 4 étapes
- `/success` confirmation + don optionnel
- `/live` page de l’émission + compte à rebours
- `/dedication/[public_id]` confirmation publique (sans WhatsApp ni notes)
- `/faq` `/privacy` `/terms`
- `/admin` tableau de bord
- `/admin/dedications` gestion
- `/admin/live` file glisser-déposer
- `/admin/live/mode` vue hôte
- `/admin/donations`
- `/admin/users` accès équipe (propriétaire uniquement)
- `/admin/settings`
