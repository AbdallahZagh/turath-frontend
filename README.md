# Turath frontend

Next.js web app for **Turath (تراث)** — Syria tourism, heritage, and hospitality.

Public site: stays, tables, trips, events, and licensed guides. Cash on arrival. Arabic and English. The provider portal and admin command center live in this same app.

Repository: [AbdallahZagh/turath-frontend](https://github.com/AbdallahZagh/turath-frontend)

## Branches (read this before you push)

| Branch | What belongs here |
| --- | --- |
| `main` | **This README only.** GitHub landing page. No app source, no `app/`, no `components/`. |
| `frontend` | **The full Next.js project.** All product work lands here. |

Merges into this repo go onto **`frontend`**. Do not merge the app into `main`.

## For Grok / coding bots

Do **not** treat `main` as a working branch. It is documentation only.

Do **not** push application code straight onto this repository unless a human asked you to. Autonomous bots work in a **separate bot workspace repo**, then a human reviews and merges into **`frontend`**.

When you are told to work on Turath frontend:

1. Use the **`frontend`** branch of this repo as the source of truth for the product.
2. Keep `en` and `ar` copy in `messages/` together.
3. Follow `docs/PAGES.md` for routes. Do not invent pages.
4. Admin URLs live in `config/adminRoutes.ts`. Do not hardcode `/admin/...` slugs.

## Stack

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS v4, custom glass UI (no component kit)
- `next-intl` (English + Arabic, RTL)
- TanStack Query + `fetch` (no axios)
- Zustand for client state
- Mock data through `services/` until the NestJS API exists

## Run the app

Checkout **`frontend`**, then:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| URL | What you get |
| --- | --- |
| `/` | Public landing |
| `/login`, `/register`, `/verify-otp`, `/forgot-password`, `/reset-password` | Auth stubs (mock OTP / reset) |
| `/admin` | Admin (mock role switcher in the shell) |
| `/theme` | Token lab |

## What’s in `frontend` today

- Public landing (glass marketing home)
- Auth layout + login / register / verify-otp / forgot-password / reset-password (mock services + authStore)
- Admin: guests, businesses, bookings, reviews, no-shows, accounts, heritage sites, fees, lists, featured, discount codes, audit logs, settings

Not in this repo yet (see `docs/PAGES.md` §10): provider portal, listings, booking/voucher, tourist account.
