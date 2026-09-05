# Turath Web — Page Map & Screen Contents

Read this file **before creating or changing any route, layout, or sidebar**.
It is the source of truth for **routes and screen contents** until the backend RBAC API exists.

**Copy vs this map:** this file may still use domain words (KYC, ledger, taxonomy, provider, tourist, CMS) when describing what a screen does. **User-facing text** (nav, titles, subtitles, buttons, empty/error states) lives in `messages/en.json` and `messages/ar.json` and must stay everyday language even when this file uses a different name. **URLs follow the user-facing names.** Admin slugs live in `config/adminRoutes.ts` — do not hardcode `/admin/...` paths in components.

- **Stack:** Next.js App Router (`app/`), Tailwind CSS, TypeScript.
- **Design:** Glassmorphism (frosted panels, backdrop blur, thin light borders, large radii) on dark heritage photography. Bilingual AR (RTL) / EN (LTR). Amounts stored conceptually in SYP; show USD beside them.
- **Auth for now:** Mock session with a role switcher in dev. Do **not** build a real permission engine. Do **not** mix all roles into one sidebar.
- **Auth later:** NestJS JWT (15-min access + rotating refresh cookie). Middleware + API enforce access. Sidebar only mirrors the current role.

---

## 1. Route groups (do this from day one)

| Group | Audience | Layout | Sidebar |
|---|---|---|---|
| `app/(auth)` | Unauthenticated | Centered glass card, no app chrome | None |
| `app/(public)` | Tourist (and anyone browsing) | Public header + optional tourist bottom/side nav | Tourist nav |
| `app/(provider)` | `PROVIDER_OWNER`, `PROVIDER_STAFF` | Provider shell | Provider nav (filtered by mock role) |
| `app/(admin)` | `SUPER_ADMIN` | Admin shell | Admin nav |

Mock roles: `TOURIST` | `PROVIDER_STAFF` | `PROVIDER_OWNER` | `SUPER_ADMIN`.

**Coarse access (now):** each portal is a separate layout. Visiting another group's URL in dev is allowed.

**Fine access (later):** backend + middleware. Staff never sees ledger in the sidebar even now (nav `roles` array).

Flutter owns: offline QR wallet, camera scanner. Web still shows the voucher image and backup code, and providers check in with the 6-character code.

---

## 2. Brand assets (`public/`)

Pick by **theme** (light vs dark) and **space** (full lockup vs compact mark). Never mix a light-mode logo onto a dark surface, or the reverse.

| File | When to use |
|---|---|
| `/main-logo.png` | **Primary lockup, light mode.** Expanded sidebar, public header, light landing/auth if the surface is light. Icon + **Turath** / **تراث**. |
| `/dark-main-logo.png` | **Primary lockup, dark mode.** Same places as `main-logo`, on dark/glass/black surfaces (dark sidebar, dark header, dark hero). |
| `/simple-logo.png` | **Compact mark, light mode.** Collapsed sidebar, tight headers, small chips, places with no room for the wordmark. |
| `/dark-simple-logo.png` | **Compact mark, dark mode.** Same as `simple-logo`, on dark surfaces. |
| `/app-logo.png` | **App favicon / PWA icon only** (white squircle plate). Browser tab, `apple-touch-icon`, install icon. Not used inside page chrome. |
| `/reciept-logo.png` | **Receipts and booking invoices only.** Voucher page, printable invoice, QR ticket PDF. Filename spelling is `reciept-logo.png` — keep it. |

**Rules**

- Expanded nav/header → `main-logo` or `dark-main-logo`.
- Sidebar collapsed (icon rail) → `simple-logo` or `dark-simple-logo`.
- `<link rel="icon">` / metadata icons → `app-logo.png` only.
- `/bookings/[id]` voucher and any invoice print → `reciept-logo.png` only.
- A `Logo` component should take `variant: "main" | "simple"` and follow the active theme (or `prefers-color-scheme` until a theme toggle exists).

---

## 3. Nav items (filter by current mock role)

### Public / tourist

- Home `/`
- Explore `/explore`
- Attractions `/attractions`
- Stays `/hotels`
- Dining `/restaurants`
- Trips `/trips`
- Events `/events`
- Guides `/guides`
- Contact `/contact` (footer Company → Contact; also the Home **Contact Us** band)

Logged-in extras: My bookings `/account/bookings`, Profile `/account`.

Dev-only (not in tourist nav): theme lab `/theme` (same screen as `/` until the tourist home exists).

### Provider — `PROVIDER_OWNER` + `PROVIDER_STAFF`

- Dashboard `/provider`
- Bookings `/provider/bookings`
- Check-in `/provider/check-in`
- Reviews `/provider/reviews`

### Provider — `PROVIDER_OWNER` only

- Profile `/provider/profile`
- Inventory `/provider/inventory`
- Ledger `/provider/ledger`
- Staff `/provider/staff`
- Settings `/provider/settings`

Unapproved owners: only onboarding / pending (no main sidebar).

### Admin

Nav labels and URLs use everyday names. Domain terms in §7 describe the same screens.

- Home `/admin`
- Guests `/admin/guests`
- Businesses `/admin/businesses`
- Bookings `/admin/bookings`
- Reviews `/admin/reviews`
- No-shows `/admin/no-shows`
- Accounts `/admin/accounts`
- Heritage sites `/admin/heritage-sites`
- Fees `/admin/fees`
- Lists `/admin/lists`
- Featured `/admin/featured`
- Discount codes `/admin/discount-codes`
- Audit logs `/admin/audit-logs`
- Settings `/admin/settings`

Old slugs (`/admin/users`, `/admin/providers`, `/admin/disputes`, `/admin/ledger`, `/admin/attractions`, `/admin/taxonomy`, `/admin/commissions`, `/admin/promotions`, `/admin/coupons`) redirect to the names above.

---

## 4. Auth pages — `app/(auth)`

**Stub status:** Login and register submit through mock `services/auth` → `/verify-otp` (phone or email kept in `authStore`). OTP success signs in and routes to the role home (`/` tourist, `/provider` provider, `/admin` admin). Provider signup lives at `/provider/register` (AuthLayout, four-step form including papers and photos) and mock-submits to `/provider/pending`. Forgot password → `/reset-password?token=…` (mock). Reset success → `/login`. No real SMS/email yet.

### `/login`

- Logo: `main-logo` (light) or `dark-main-logo` (dark)
- Tabs or toggle: **Phone OTP** (primary) | **Email + password**
- Phone: **Syrian numbers only** (`+963`), Syrian flag shown, no other country codes. Send code → `/verify-otp`
- Email: email, password, submit
- Links: register, forgot password
- Language switch AR/EN

### `/register`

- Full name, date of birth, nationality (searchable list of every country; flag + localized AR/EN name)
- Phone: searchable country list with flags and localized names; any country calling code
- Email, password
- Terms checkbox
- Submit → OTP
- Link back to login
- Note: this is **tourist** signup. Providers use `/provider/register`

### `/verify-otp`

- Masked destination (phone / WhatsApp)
- 6-digit OTP inputs
- Countdown + resend
- Success → role home (`/` tourist, `/provider` provider, `/admin` admin)

### `/forgot-password`

- Phone or email
- Submit → OTP / reset mail copy

### `/reset-password`

- New password + confirm
- Token from URL (10-minute window in the real API)
- Success → login

---

## 5. Public / tourist pages — `app/(public)`

### `/` Home

Flagship marketing landing (`components/landing/*`), composed in order:

1. Hero — full-bleed cinematic scene (AI-generated Damascus photography).
   Headline, lead, and a single CTA into the search band. No booking form
   on the photo.
2. Omni-search (`#search`) — 5-pillar widget (Hotels, Tables, Trips, Events,
   Tour Guides)
3. Persona explorer — "Experience Turath through the eyes of a..." pill
   switcher (first-time visitor, heritage seeker, foodie, family, provider)
   over a rail of photo-tile interest cards
4. Trust bar — cash on arrival, offline QR passes, licensed providers,
   dual-currency pricing
5. Bento grid — one tile per pillar with amenity/language tags
6. Governorate map explorer preview (stylized, not MapLibre — that's `/explore`)
7. Heritage spotlight — drag-scroll reel of landmark cards
8. How it works — 3-step reserve → QR pass → check-in path
9. App download banner — **teaser / coming soon** for the Flutter app
   (offline QR + offline map). No live App Store / Google Play links.
10. Provider CTA (`#grow-with-turath`) — "Grow with Turath"
11. Verified testimonials — equal glass cards in a 3-up grid
12. Contact Us — short glass band → `/contact` (last section before the footer)

**Home CTA policy (MVP):** Omni-search, bento tiles, persona interest cards,
and the map preview may link real tourist routes (`/hotels`, `/restaurants`,
`/trips`, `/events`, `/guides`, `/explore`, `/attractions/...`). Those
destinations may be empty or “coming soon” — **do not invent fake inventory
cards, prices, or live store badges on Home**. Copy stays honest: cash on
arrival, licensed providers, dual currency (SYP + USD), glass UI, AR/EN RTL.

`PublicHeader` / `PublicFooter` (`components/layout/`) provide the shared
`(public)` chrome; pages under this route group don't rebuild it.
Tourist **Log in** and **Register** live in the header. Providers join from
`#grow-with-turath` (footer “Partner” and the Grow with Turath band), not the header.
Footer **Contact** links to `/contact` — **not** `mailto:hello@turath.sy`.

### `/theme`

Same theme lab as `/`.

### `/contact`

Public contact page (inside `(public)` shell):

- Centered page header (title & subtitle)
- Side-by-side layout:
  - Contact Information card: Direct phone, WhatsApp, email, office location (Bab Sharqi, Old Damascus), and working hours
  - Contact Form: Clean glass form with name, email, phone, topic, and message
- Success state after mock submit (no backend yet)
- AR / EN copy via `messages/`
- Linked from footer Company → Contact and from the Home Contact Us band

### `/legal/[slug]`

Static content pages linked from the public footer (`terms`, `privacy`,
`provider-licensing`). Not yet built.

### `/explore`

- Full-bleed MapLibre map (placeholder map until PMTiles)
- Glass filter drawer: category (attraction, hotel, restaurant, trip, event, guide), governorate, radius, price, amenities (generator, Wi-Fi, AC), smoking, accessibility
- Clustered pins
- Tapping a pin → mini glass card → detail route

### `/search`

- Query + the same filters as explore (list, not map)
- Result cards: photo, AR/EN name, governorate, price SYP (~USD), rating
- Empty / loading / error states

### `/attractions`

- Heritage directory grid
- Filters: governorate, open now
- Card: photo, name AR/EN, short blurb, governorate

### `/attractions/[slug]`

- Photo gallery
- Title AR/EN, historical narrative
- Opening hours, entry fee SYP/USD
- Embedded map + “navigate” deep link
- Nearby hotels / restaurants / guides

### Category indexes

`/hotels` · `/restaurants` · `/trips` · `/events` · `/guides`

Each page:

- Title + count
- Filters (price, governorate, capacity, amenities — category-specific extras below)
- Card grid → matching `[id]` detail

**Hotels extra filters:** room type, occupancy, generator / Wi-Fi / AC  
**Restaurants:** zone (indoor, terrace, VIP, smoking), party size  
**Trips:** date, seats left, duration  
**Events:** date, ticket tier  
**Guides:** language, specialty, full/half day

### Detail pages

`/hotels/[id]` · `/restaurants/[id]` · `/trips/[id]` · `/events/[id]` · `/guides/[id]`

Shared:

- Gallery
- Name AR/EN, rating, governorate, verified-provider badge
- Description AR/EN
- Amenities / specs as glass icon grid
- Embedded map + navigate
- Price SYP (~USD)
- Primary CTA: Book
- Reviews (verified check-in only). Two directions, not reliability and not ledger:
  - Tourist rates the provider (1–5 + comment) — listing cards, provider detail, `/provider/reviews`
  - Provider rates the tourist (1–5 + comment) — tourist profile. Desk UI is later; admin people pages show both.

**Hotel extra:** room types, occupancy, check-in/out policy, generator hours  
**Restaurant extra:** zones, time slots, party size selector  
**Trip extra:** itinerary milestones, pickup points, seat cap, gear  
**Event extra:** session, ticket tiers (Standard / VIP), remaining, max 6 per user  
**Guide extra:** languages, specialties, hourly / full-day rates, calendar

### Booking — `/bookings/new` (query: `type` + `id`) or nested under the listing

Category-specific form on a glass sheet:

| Type | Fields |
|---|---|
| Hotel | Check-in / check-out, room type, guest count, special bed notes |
| Restaurant | Date, time slot, party size, zone |
| Trip | Date, seat qty, pickup, emergency contact |
| Event | Session, ticket tier, qty (max 6) |
| Guide | Date(s), duration (hourly / half / full), language, focus area |

- Optional **discount code** (from `/admin/discount-codes`). Applies only if the code is live, in date, and allowed for this listing / category / business. Invalid, expired, or wrong-listing codes show an error
- 10-minute hold copy (“room/seats held”)
- Reliability warning if mock score &lt; 50 (needs provider acceptance)
- Summary: list price SYP (~USD), discount if a coupon applied, **amount due cash on arrival**. Commission later accrues on the collected (discounted) total, not the pre-coupon price
- Confirm → `/bookings/[id]`

### `/bookings/[id]` Confirmation / voucher

- Status chip: Pending / Confirmed / Checked-in / Cancelled / No-show
- Provider name, when, guests
- Total + COA notice. If a coupon was used: code, discount, amount due (that is what the desk collects)
- **QR image** + **6-character backup code**
- Use `reciept-logo.png`
- Download / print
- If `CHECKED_IN`: CTA to write a review

### `/bookings/[id]/review`

- Only after check-in (UI gated; API later)
- Tourist: 1–5 stars + comment about the provider
- Submit → thank you
- The provider’s rating of this guest is a separate post-check-in review (not this tourist page)

### `/account`

- Avatar/initials, full name, phone, email
- Language, currency display preference
- Reliability score (0–100) + tier label (VIP / Standard / Restricted / Suspended)
- Link to bookings

### `/account/bookings`

- Tabs: Upcoming / Past / Cancelled
- Row: provider, date, status, amount, “Open voucher”

### `/account/reliability`

- Score, history of check-ins vs no-shows (−30 copy)
- What each tier allows (instant booking, concurrent caps)

---

## 6. Provider pages — `app/(provider)`

### `/provider/register`

- AuthLayout (unauthenticated glass card; not the approved provider shell)
- Stepped application (one form, four steps — do not skip):
  1. **Owner account** — full name, date of birth, nationality, Syrian phone, email, password
  2. **Business** — names AR/EN, category (Hotel | Restaurant | Trip agency | Event manager | Tour guide), governorate, address AR/EN, short descriptions AR/EN, operating hours, map pin (latitude / longitude). Tour guides also enter a license number
  3. **Documents** — commercial registration, ministry license, owner ID (PDF or photo)
  4. **Photos** — logo, gallery, partner terms
- Submit → `/provider/pending` (mock approval queue)

### `/provider/onboarding`

- Same papers, photos, address, and hours if a listing was started without them (not a separate signup). New applications use `/provider/register`.
- Submit → `/provider/pending`

### `/provider/pending`

- Status: Waiting for approval
- What happens next (team reviews the details and papers already sent)
- No access to dashboard

### `/provider` Dashboard (approved)

- Revenue (SYP / USD)
- Upcoming guests
- Occupancy / tables / seats (by category)
- Recent check-ins
- Cancellations / no-shows
- Commission owed vs credit ceiling (owner)

### `/provider/profile`

- Names AR/EN, descriptions AR/EN
- Location, hours, contact
- Gallery, logo
- Amenities (electricity/generator, Wi-Fi, AC, …)

### `/provider/inventory`

Switch body by `provider.category`:

**Hotel:** room types, price/night, occupancy, amenities JSON, quantity  
**Restaurant:** tables (label, capacity, zone indoor/terrace/VIP/smoking), slot templates  
**Trip:** title AR/EN, dates, pickup, capacity, seats left, itinerary, price  
**Event:** sessions, ticket tiers, capacity, max 6/user  
**Guide:** license number, languages, hourly/full-day rates, specialties, calendar blocks

Staff: **read-only**. Owner: full edit.

### `/provider/bookings`

- Filters: date, status
- Table: tourist name, phone, party size, notes, amount, status
- Row → `/provider/bookings/[id]`

### `/provider/bookings/[id]`

- Full booking + guest contact
- Status actions (owner): no-show / cancel (later triggers tourist handshake)
- Check-in shortcut
- QR / backup code display for the desk. If the booking used a coupon: show the code, discount, and cash due so the desk does not collect the pre-offer price

### `/provider/check-in`

- Big input: 6-character backup code
- Optional webcam QR later (not required for MVP web)
- Result: success (mark CHECKED_IN, cash due) | already used (timestamp + staff) | invalid
- Today’s remaining arrivals list

### `/provider/ledger` (owner only)

- Commission accrued vs paid
- Credit ceiling + % used
- Statements (weekly / bi-weekly / monthly by tier)
- Warning at 75%, grace copy at 100%

### `/provider/reviews`

- Verified reviews list
- Rating breakdown

### `/provider/staff` (owner only)

- List staff (name, phone, role scanner/read-only)
- Invite / deactivate

### `/provider/settings`

- Notifications, language
- Org timezone / currency display

---

## 7. Super admin pages — `app/(admin)`

UI titles are in `messages/` (Home, Guests, Businesses, …). Headings below are the **URL**.

### `/admin` Home

- Gross bookings, completed, no-show rate by city
- Date range filter switcher: Last 7 days, 30 days, 90 days
- Clickable KPI cards linking directly to Bookings, No-shows, Businesses, and Accounts
- Guest origins
- Top heritage sites
- Fee revenue
- Charts on glass cards

### `/admin/businesses`

- Search; filter popover (status, category, region) with removable pills
- Table includes guest rating (verified check-in reviews of this business) — not license status, not account standing
- Row → `/admin/businesses/[id]`

### `/admin/businesses/[id]`

- Scroll the page. Header title is static (“Business”); the business name lives in the profile card
- Profile (glass): names AR/EN, owner, category, governorate, phone, email, address, submitted date, status, guest rating (stars + count). KYC actions by status — pending: Approve / Reject; approved: Suspend; suspended: Reinstate; rejected: no further action (mock for the session)
- Documents (glass): commercial registration, ministry license, owner ID as placeholder files
- Listing snapshot changes with pillar (not a full inventory editor):
  - Hotel: room types (occupancy, quantity, price/night, amenities)
  - Dining: tables (label, capacity, zone) and slot templates
  - Trip: dates, pickup, capacity / seats left, itinerary, price
  - Event: sessions, ticket tiers, capacity, max 6 / user
  - Guide: license number, languages, hourly / full-day rates, specialties
- Finance: commission % override (empty = pillar default), credit ceiling (empty = tier default), ledger snapshot when one exists
- Reviews from guests (verified check-in only): several mock rows so the section is a list — date · stars · guest name · comment. Empty if nobody has rated yet
- Activity (timeline, newest first): chips on this card only — All / Bookings / Money / Account. Rows: date · type chip · one line (guest or action) · SYP when it is money. Cash-on-arrival: money = booking status (completed / no-show / disputed) plus ledger settlements. Types: booking placed / confirmed / checked-in / completed / cancelled; money completed / no-show / disputed / settled; account submitted / approved / rejected / suspended / reinstated / finance updated

### `/admin/guests`

- Guests + show-up score (show-up vs no-show) and guest rating (businesses rating this guest after check-in) — two different scores
- Search by phone / name; filter popover (account, show-up) with removable pills
- Row → `/admin/guests/[id]`

### `/admin/guests/[id]`

- Scroll the page (no table/cards/map switch). Header title is static (“Guest”); the guest’s name lives in the profile card
- Profile (glass): initials, names AR/EN, phone, email, joined, guest rating from providers, Locked badge, Lock / Unlock (mock for the session)
- Reliability (glass): score + band from Settings cutoffs (`atRiskBelow` / `watchBelow`), completed check-ins vs no-shows, short band hint — not a settings editor, not a star rating
- Bookings (ops table for this guest, match by phone): same search + filter + pills as `/admin/bookings`. Columns: provider (with average guest rating of that business), when, amount, status, backup code. Row opens booking details in a side `Drawer` (no booking-detail route yet)
- Reviews from providers (verified check-in only): several mock rows so the section is a list — date · stars · provider name · comment. Empty if nobody has rated yet
- Activity (timeline, newest first): chips on this card only — All / Bookings / Money / Account. Rows: date · type chip · one line (provider or action) · SYP when it is money. Cash-on-arrival: money = booking status (completed / no-show / disputed), not cards. Types: booking placed / confirmed / checked-in / completed / cancelled; money completed / no-show / disputed; account locked / unlocked

### `/admin/bookings`

- Global table, all categories with CSV data export
- Admin bypass / status override in drawer (Manual check-in, completion, cancellation, no-show, reopening)
- Search; filter popover (category, status) with removable pills
- Guest and provider cells show average rating (post-check-in reviews of that person / business) — not reliability, not ledger
- Row opens booking details in a side `Drawer` (no booking-detail route yet) — same panel as `/admin/guests/[id]`
- Drawer features: coupon discount breakdown, direct navigation links to Guest and Business profile pages, backup check-in code copy, full schedule, and live status manipulation actions

### `/admin/reviews`

- Complete moderation desk for verified check-in reviews across guests and businesses
- Search author, subject, or review text; filter by target type (guest / business), star rating, and moderation status
- Actions in a row ⋯ menu: approve/publish, flag for scrutiny, or hide abusive content
- CSV export for reporting

### `/admin/no-shows`

- Missed-arrival cases (`DISPUTED_COMPLETION`)
- Business vs guest claim
- Search; filter popover (decision, category) with removable pills
- Row → `/admin/no-shows/[id]`

### `/admin/no-shows/[id]`

- Scroll the page. Header title is static (“No-show”); the backup code lives in the case card
- Case (glass): backup code, opened date, category, amount (cash on arrival), status, guest average rating, provider average rating. Links to guest and provider when matches exist. Open booking in the same side `Drawer` as `/admin/bookings`
- Claims (two glass cards): provider claim vs tourist claim, bilingual
- Resolve (open cases): notes AR/EN + For guest / For provider (mock for the session). Resolved cases show the decision and notes, read-only

### `/admin/heritage-sites`

- Heritage catalog with 3 layouts: Table, Cards, and Syria map (`SegmentSwitch`)
- Map plots sites by coordinates with pin selection and a preview card
- Cards use infinite scroll; table uses pagination
- Search; filter popover (region, published / draft) with removable pills
- Add/edit modal: names AR/EN, story AR/EN, cover image, extra gallery images, hours, fees, map pin, publish
- Row / card → `/admin/heritage-sites/[id]`
- Row and card ⋯ menu: Edit (same modal, pre-filled) and Delete (confirm, then stay on the list)

### `/admin/heritage-sites/[id]`

- Scroll the page. Header title is static (“Heritage site”).
- Top Actions: Back to heritage sites link, Edit button (reopens modal with pre-filled fields to update), Delete button (confirmation modal, removes site and redirects to list).
- Hero (glass): panoramic cover backdrop, bilingual titles AR/EN, badges for governorate, status (published/draft), hours, entry fee, slug.
- Gallery (glass): interactive photo showcase with main preview and thumbnail strip of cover and extra gallery photos.
- Narrative (glass): bilingual historical narrative AR/EN.
- Visitor guide (glass): opening hours, admission fee SYP (~USD) or Free, governorate.
- Location (glass): latitude and longitude, copy coordinates helper, links to Explore map and Google Maps.

### `/admin/lists`

- Segment: Categories / Amenities / Regions
- Table only (add / edit modal, reorder in-row, delete with confirm)
- No search/filter toolbar — these lists stay short

### `/admin/fees`

- Table of default % per booking category
- Preferred / standard / high-risk tier chips (8.5% / 12% / 18%)
- Platform SYP-per-USD rate field + save (mock)

### `/admin/accounts`

- All business receivables
- Settlements
- Search; filter popover (standing, category) with removable pills
- Table includes guest rating average for that business (verified check-in reviews) — not standing, not credit use
- Row → `/admin/accounts/[id]`

### `/admin/accounts/[id]`

- Scroll the page. Header title is static (“Account”); the business name lives in the account card
- Account (glass): names AR/EN, guest rating average, category, cadence, last settled, standing. Actions by standing — watch or grace: Suspend; suspended: Reinstate; healthy: no standing action. Record settlement when outstanding is above zero (mock for the session)
- Balance: accrued, paid, outstanding. Credit used vs ceiling with warning copy at 75% and grace copy at 100%
- Statements: recent settlement periods for this cadence — period, accrued, paid, status (paid / due / overdue)
- Link to the business profile when a matching business exists

### `/admin/featured`

Homepage / discovery merchandising only — not discount codes. Discount codes are a separate page (`/admin/discount-codes`).

- **Featured listing:** pin one provider or attraction in a featured slot for a date window
- **Home campaign:** a themed band on `/` (e.g. Heritage week, Ramadan tables) aimed at a pillar or the attractions rail, not one property
- Target preset quick selector for popular sites, categories, and hotels, plus custom text
- Status is scheduled / live / ended from the start / end dates
- Delete action with confirmation dialog
- Add / edit in a modal
- Row ⋯ menu: Edit and Delete

### `/admin/audit-logs`

- Comprehensive event timeline of administrative operations across the platform
- Filter by module (Bookings, Guests, Businesses, Reviews, Promotions, Lists, Settings)
- Search actor, action type, or target entity; CSV export capability

### `/admin/discount-codes`

Admin-owned cash-on-arrival discount codes. Businesses do not self-serve codes in MVP — the admin agrees the deal with the business, then publishes it here.

- Fields: names AR/EN, **code** (e.g. `RAMADAN15`), discount as **percent** or **fixed SYP**, who it applies to (one provider / one listing / one pillar / whole platform), start / end, optional max redemptions and per-guest cap, enabled / disabled
- Live codes can be entered on `/bookings/new`. The voucher and provider desk show the **discounted cash due**. Ledger commission uses that collected total
- No card checkout — a coupon never “charges” anyone; it only changes the SYP printed on the voucher
- Search; filter popover (scope, status: scheduled / live / ended / disabled) with removable pills
- Table: title, code, discount, scope, start / end, status
- Add / edit in a modal. Row ⋯ menu: Edit and Delete with confirm

### `/admin/settings`

- Save form (no search/filter table)
- Credit-limit defaults by provider tier (preferred / standard / high-risk)
- Reliability cutoffs (at-risk / watch) and lock-at-risk toggle
- Login codes (SMS / WhatsApp) and platform switches (placeholders), including featured-listing slots from Featured (spotlight only — discount codes stay on `/admin/discount-codes`)

---

## 8. Shared UI states every page should have

- Loading (glass skeleton)
- Empty
- Error / retry
- RTL-safe layout (logical CSS: `ms`/`me`/`ps`/`pe`, not `ml`/`mr`)
- Dual currency: `150,000 SYP (~$10.50)`
- Mobile + desktop; glassmorphism must stay readable on photos

---

## 9. Out of scope for this web app

- Flutter tourist offline wallet
- Flutter camera scanner + on-device Ed25519
- NestJS, Redis locks, PMTiles pipeline (web uses placeholders / later API)
- Real SMS / WhatsApp OTP
- Mixing Admin + Provider + Tourist links in one sidebar

---

## 10. Implementation order (when building)

1. Shells: `(auth)` `(public)` `(provider)` `(admin)` layouts + mock role switcher  
2. Auth screens  
3. Public home, listings, details (static mock data)  
4. Booking + voucher  
5. Tourist account  
6. Provider dashboard → inventory → check-in → ledger  
7. Admin license review → heritage catalog → finance (including `/admin/discount-codes`)  

Wire real APIs and middleware only after the backend exists. Keep this file updated if a route is added or dropped.
