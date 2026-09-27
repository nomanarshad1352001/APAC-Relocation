# APAC Relocation — LuxeMigrate Platform

> **A luxury, conversion-focused relocation website with a built-in CMS, live sync engine, CRM and full SaaS operations dashboard — for premium moving companies operating the Singapore → USA corridor.**

---

## 1. Project Title

**APAC Relocation — LuxeMigrate** (codename: *The Atelier*)

A white-label, ready-to-sell digital platform for international relocation, moving, and logistics companies. It combines a high-end marketing website, real-time pricing tools, an inline Content Management System (CMS), a CRM, and an operations dashboard into a single self-contained web application — with **zero backend, zero database, and zero DevOps required** (demo data persisted in-browser).

---

## 2. What the Platform Does

LuxeMigrate lets a relocation company launch a complete digital presence *and* run their operations in one place:

| Area | Capabilities |
|---|---|
| **Marketing Website** | Luxury editorial landing page, animated hero, service showcase, visa guide, destination explorer, pet-travel concierge, testimonials-level stats, FAQs, contact & enquiry capture |
| **Interactive Sales Tools** | Instant quote calculator with dynamic pricing, shipment builder (5 freight modes, volume slider, add-ons), transparent cost-breakdown visualization, live move timeline |
| **Inline CMS** | *Every text, image, card, list, stat and section on the site is editable in-place* — hover → pencil → save. 9 content collections + 60+ individual text fields |
| **Live Sync Engine** | Changes made anywhere (inline on the site OR inside the dashboard) instantly reflect everywhere — one shared data store, persisted via localStorage |
| **SaaS Dashboard** | Overview analytics, Website CMS, Shipment pipeline (Kanban + list), Client CRM with lead conversion, Invoicing, Calendar/Scheduling, Team management, Settings |
| **Auth & Access** | Animated full-screen login page with demo credentials + typing-style autofill, authenticated admin session, gated dashboard |

---

## 3. Who Buys It (Target Clients)

1. **International relocation & moving companies** — the primary buyer. They receive a premium site + operational tooling in one purchase, instead of paying agencies $50k+ for a website and subscribing to separate CRM/freight tools.
2. **Freight forwarders & NVOCC/OTI movers** (FMC-licensed operators) — shipment pipeline, invoicing and client records out of the box.
3. **Corporate mobility & HR consultancies** — manage employee relocations end-to-end and present clients a luxurious digital front-door.
4. **Relocation brokers & franchise operators** — reusability: rebrand (colors, copy, services) directly through the CMS without developers.
5. **High-net-worth concierge & lifestyle agencies** — the luxury aesthetic sells private-client, white-glove services (pet travel, fine art, vehicles).
6. **Solo move managers / independent consultants** — professional presence + lead capture + simple pipeline, affordable and maintenance-free.
7. **Web agencies** — resell as a white-label starter kit for logistics clients.

### Ideal Customer Profile (ICP)

- 5–100 person moving/logistics business doing **cross-border moves**, $1M–$30M revenue
- Currently runs on WhatsApp + spreadsheets + a dated WordPress theme
- Wants to look as premium as their service actually is — and capture + convert leads faster

---

## 4. Platform Qualities (What Makes It Special)

- **Luxury-first design** — Fraunces editorial serif + Inter, warm ivory/ink/champagne-gold palette, hairline details, grain textures, cinematic imagery (Pexels). Competes with Awwwards-grade hotel/interior brands, *not* dated logistics templates
- **Emotion through motion** — staggered blur-reveal storytelling, ken-burns imagery, floating gold particles, typing-style autofill, animated success ceremony, physics-based transitions (Framer Motion)
- **Actually interactive** — real pricing engines with live recomputation, sliders, toggles, expandable timelines, city map, accordions — visitors *play*, and playing converts
- **The "everything is editable" rule** — no hard-coded copy. Admin edits the brand the way they'd edit a doc
- **True live sync** — one reducer-driven global store; dashboard edits are visible on the site the same frame, and vice-versa; survives reloads (localStorage)
- **Zero infrastructure** — no database, no server, ships as **one single HTML file** (~280KB gzipped) deployable to any static host in seconds
- **No emojis anywhere** — hand-built 30+ SVG icon system; real photography instead of glyphs
- **Fully responsive & conversion-driven** — CTAs on every scroll length, trust markers everywhere, mobile-first layouts

---

## 5. Features Inventory

### 5.1 Public Website (14 sections)

1. **Hero** — animated editorial headline, route chip (SIN→USA), dual imagery collage, stats strip, trust badges, scrolling service marquee
2. **Instant Quote Calculator** — dynamic estimate by destination + move type, cost-split breakdown, save/load/edit/delete quotes
3. **Process (4-step)** — Pre-Move Survey → Packing → Freight & Customs → Delivery (full CRUD)
4. **Shipping Calculator** — 5 transport modes, home-size slider, 5 add-on options, real-time total + dark summary panel with price lock CTA
5. **Estimate Breakdown** — animated cost bars, editable line items, editable stage-by-stage move timeline
6. **Services Grid** — packing, freight, customs, delivery, insurance, vehicles (full CRUD with icon picker)
7. **Relocation Timeline** — T-12 weeks → move-in, expandable milestones (full CRUD)
8. **Visa Guide** — 8 US visa types (H-1B, L-1, O-1, EB-5, E-2, F-1, EB-1A, IR/CR-1) with lead time, cost, cap, GC path (full CRUD)
9. **Destinations** — interactive US map + 6 city profiles: cost, transit days, neighborhoods, climate, community (full CRUD incl. map coordinates)
10. **Pet Relocation** — real photo pet cards, features, incident record, live-editable sample estimate (full CRUD)
11. **Company Stats** — animated counters (families moved, rating, on-time %, ports, $0 hidden fees, quote speed) (full CRUD)
12. **FAQ** — accordion with 8 detailed answers (full CRUD)
13. **Contact Hub** — phone/email/WhatsApp/response-time cards (full CRUD with icon picker)
14. **Lead Enquiry Form** — 9 fields + preferred contact method; submissions become **dashboard leads instantly**

### 5.2 Auth & Admin

- Full-screen split login (cinematic imagery +loating particle form panel)
- Demo account chips: `admin@apac.com` / `admin123`
- **Autofill demo** (types credentials character-by-character) + **One-click login**
- Validation, error states, loading spinner, success ring ceremony
- Post-login: admin micro-bar, inline editing enabled, dashboard access, sign-out

### 5.3 SaaS Dashboard (8 tabs)

| Tab | Features |
|---|---|
| **Overview** | 6 KPI cards, revenue area chart (Recharts), lead funnel, active shipments tracker, destination bar chart, activity feed, recent clients table |
| **Website CMS** | Manage all 9 live site collections (services, process, timeline, FAQs, visas, cities, pets, contacts, stats) — edits go live instantly |
| **Shipments** | Kanban pipeline (Survey→Packing→Transit→Customs→Delivered) + list view, detail modal, inline status transitions, progress bars, CRUD |
| **Clients** | CRM cards with search & status filters, pipeline value stats, **Website Leads inbox** (enquiries + quotes from the public site, with one-click Convert-to-Client), CRUD |
| **Invoices** | Revenue stats, status filters, line-item detail receipts, inline status dropdowns, CRUD |
| **Calendar** | Date-grouped schedule, 5 color-coded event types, CRUD |
| **Team** | Department-grouped members, presence dots, workload counts, CRUD |
| **Settings** | Company info, 6 notification toggles, 6 integrations panel, danger zone, save feedback |

---

## 6. Tech Stack

### Core
| Technology | Version / Usage |
|---|---|
| **React** | 19 — component architecture, hooks, context |
| **TypeScript** | 5.9 — fully typed stores, collections, props |
| **Vite** | 7 — build tooling; `vite-plugin-singlefile` — ships one HTML file |
| **Tailwind CSS** | 4 (via `@tailwindcss/vite`) — design system via `@theme` tokens |

### UI & Motion
| Technology | Usage |
|---|---|
| **Framer Motion** | 11 — scroll reveals, page transitions, layout animation, success ceremonies, micro-interactions |
| **Recharts** | Revenue area chart, destination bar chart, funnel bars |
| **Custom SVG Icon System** | 30+ hand-defined stroke icons + picker grids (`Icon.tsx`) |
| **Google Fonts** | `Fraunces` (display serif) + `Inter` (UI sans) — optically-sized luxury pairing |

### State & Data (dummy-data architecture — **no database**)
| Technology | Usage |
|---|---|
| **React Context + useReducer** | `SiteDataContext` — global collections store powering the entire app |
| **`useCollection(key, seed)` hook** | Shared CRUD collections consumed identically by site + dashboard — the sync engine |
| **localStorage** | Persists all CMS edits (`apac_site_data_v1`) and inline text overrides (`apac_site_content_v1`) across reloads |
| **`EditableText` component** | Inline editing over any copy on the page (hover → pencil → modal) |
| **Seed data** | Realistic dummy data for shipments, clients, invoices, team, events, analytics |

### Imagery
| Source | Usage |
|---|---|
| **Pexels** (Hot-linked CDN) | Luxury interiors, lifestyle, pet photography — hero, login, pets, overlays |

### Notably absent (by design)
- No backend, no database, no auth server — the platform is a portable **demo-to-production starter**: the data layer is designed to be swapped for REST/GraphQL endpoints later with zero component changes
- No emojis — icon system instead
- No jQuery/Bootstrap legacy stack

---

## 7. Architecture

```
src/
├── App.tsx                      # View router (landing ⇄ login ⇄ dashboard) + providers
├── store/
│   ├── SiteDataContext.tsx      # ★ Global reducer store — the live-sync engine
│   ├── siteContent.tsx          # Inline EditableText registry (localStorage-persisted)
│   ├── useStore.ts              # useCrud factory + id generator
│   └── dashboardData.ts         # Seed data (shipments, clients, invoices, team…)
├── components/
│   ├── ui/                      # Icon, EditableText, Modal, ConfirmDialog,
│   │                            #   CrudActions, AddButton, Toast
│   ├── Navbar, Hero, QuoteCalculator, Process, ShippingCalculator,
│   │   EstimateBreakdown, Services, Timeline, VisaOptions, Destinations,
│   │   PetRelocation, Stats, FAQ, Contact, LeadForm, Footer
│   ├── LoginPage.tsx            # Animated split login w/ autofill demo
│   └── dashboard/               # Shell + Overview, Website, Shipments, Clients,
│                                #   Invoices, Calendar, Team, Settings
└── hooks/                       # useAnimateOnScroll, useCounter
```

**Data flow:** `UI → useCollection(key) → dispatch → reducer → state + localStorage → all subscribers re-render` (site + dashboard instantly).

---

## 8. Getting Started

```bash
npm install        # install dependencies
npm run dev        # local dev server
npm run build      # production build → single dist/index.html
```

**Demo admin access:** `admin@apac.com` / `admin123` (via "Private Login" in the navbar — autofill key provided on the login screen).

---

## 9. Roadmap (Production Path)

1. Swap `localStorage` for REST/Supabase/Firebase adapters (interface already isolated in `SiteDataContext`)
2. Real auth (JWT/OAuth) + role-based access (admin / move-manager / client portal)
3. Stripe payments for price-lock deposits (UI already present)
4. Email automation (enquiry receipts, survey confirmations)
5. Multi-company white-label theming (the CSS token system in `@theme` is ready)
6. Public shipment-tracking page per tracking code

---

## 10. Deliverables Recap

- ✅ Luxury responsive marketing website (14 sections)
- ✅ 60+ inline-editable text fields + 9 CRUD content collections
- ✅ Animated login with demo autofill
- ✅ 8-tab SaaS operations dashboard
- ✅ Website CMS with instant live sync
- ✅ CRM with website-lead inbox + lead conversion
- ✅ Quote & shipment pricing engines
- ✅ Zero-emoji custom iconography + premium photography
- ✅ No database required — fully dummy-data driven, persistence via browser storage
- ✅ Single-file production build
