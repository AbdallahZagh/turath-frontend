# Turath frontend

Next.js web app for **Turath (تراث)** — Syria tourism, heritage, and hospitality.

Public site: stays, tables, trips, events, and licensed guides. Cash on arrival. Arabic and English. The provider portal and admin command center live in this same app.

Repository: [AbdallahZagh/turath-frontend](https://github.com/AbdallahZagh/turath-frontend)

## Branches (read this before you push)

| Branch | What belongs here |
| --- | --- |
| `main` | **This README only.** GitHub landing page. No app source, no `app/`, no `components/`. |
| `frontend` | Shared product branch. Do not push here unless a human asked. |
| `chester` | **Agent branch.** Fast-forwarded from `frontend`, then bot work is committed on top. Current product work. |

Merges into this repo go onto **`frontend`** after review. Before new agent work, `chester` is fast-forwarded to `frontend` (no rebase, no force-push). Do not merge the app into `main`. Never push application work onto `main` or `frontend` from a bot workspace unless a human asked.

## For Grok / coding bots

Do **not** treat `main` as a working branch. It is documentation only.

Do **not** push application code onto `main` or `frontend` unless a human asked you to.

When you are told to work on Turath frontend:

1. Use the **`chester`** branch of this repo as the current product checkout unless a human names another branch.
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

Checkout **`chester`**, then:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| URL | What you get |
| --- | --- |
| `/` | Public landing |
| `/login`, `/register`, `/verify-otp`, `/forgot-password`, `/reset-password` | Auth stubs (mock OTP / reset) |
| `/hotels`, `/hotels/[id]` | Stay catalog and detail |
| `/bookings/new`, `/bookings/[id]` | Hotel checkout and voucher |
| `/explore`, `/search`, `/attractions` | Map, search, and heritage directory |
| `/restaurants`, `/trips`, `/events`, `/guides` | Other catalogs and details |
| `/legal/terms`, `/legal/privacy`, `/legal/provider-licensing` | Legal pages |
| `/user`, `/user/bookings`, `/user/saved`, `/user/profile` | Signed-in user area (old `/account` redirects here) |
| `/contact` | Public contact |
| `/admin` | Admin. Needs a signed-in admin; in `npm run dev` the sign-in card offers “Preview as admin” |
| `/provider/register`, `/provider/pending` | Provider signup |
| `/provider` | Business portal (dashboard, bookings, check-in, inventory, ledger, staff, settings). Dev preview as owner or staff |
| `/theme` | Token lab |

## What’s on `chester` today

- Public landing (glass marketing home) and `/contact`
- Auth layout + login / register / verify-otp / forgot-password / reset-password (mock services + authStore)
- Stays: `/hotels` catalog, `/hotels/[id]` detail
- Booking: `/bookings/new` checkout, `/bookings/[id]` voucher (QR + 6-character backup code)
- Discovery: `/explore` map, `/search`, `/attractions`, and the dining / trips / events / guides catalogs with details
- Legal: `/legal/terms`, `/legal/privacy`, `/legal/provider-licensing`
- User area: `/user` dashboard, `/user/bookings`, `/user/saved`, `/user/profile`, `/user/reliability`, notifications
- Admin: guests, businesses, bookings, reviews, no-shows, accounts, heritage sites, fees, lists, featured, discount codes, audit logs, settings
- Provider signup: `/provider/register` and `/provider/pending`
- Provider portal: dashboard, bookings, check-in, reviews, inventory (staff read-only), ledger, staff, settings, profiles

Routes follow `docs/PAGES.md`. Do not invent pages.
