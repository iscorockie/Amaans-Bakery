# Amaan’s Bakery 🍰

> **Freshly Baked, Perfectly Tasty** — Kira Bulindo, Kampala, Uganda
> WhatsApp: +256 772 606296 · +256 744 850346

A production-ready online bakery storefront: homepage, categorized shop with a
product **Customize & Order** flow, and the flagship **“Bake Your Own Cake”**
six-step special-order builder with a live visual summary and dynamic UGX price
estimate. Built with **React 18 + Vite, Tailwind CSS, Framer Motion v11,
React Hook Form + Zod**.

---

## 1 · Architecture

| Concern            | Approach |
|--------------------|----------|
| Routing            | `react-router-dom` — `/` (home), `/shop`, `/order` |
| Styling            | Tailwind with a brand theme (`primary #7B1E1E`, `cream #F8F1E3`, `gold #D4A373`, `cocoa #3E2723`) |
| Animation          | Framer Motion v11 — `layout`, `layoutId`, `AnimatePresence mode="wait"`, springs, `useReducedMotion()` everywhere |
| Forms              | **One** `useForm` per flow, `zodResolver`, per-step Zod schemas + a combined schema |
| Cart               | React context; confirmed over **WhatsApp** deep links (the bakery’s real workflow) |
| Data               | Plain JS modules (`data/products.js`, `data/orderOptions.js`) — UGX prices |
| Pricing            | Pure functions in `lib/pricing.js`, consumed by `useWatch`-driven summaries |

### Multi-step form strategy (React Hook Form + Zod)

Both flows keep **a single `useForm` instance** for the whole wizard:

1. **Combined schema** → `zodResolver(specialOrderSchema)` so the *final* submit validates everything.
2. **Per-step schemas** (`STEP_SCHEMAS`) → `safeParse` over `useWatch` values gives an *instant* `stepValid`
   that enables/disables **Next / Submit**.
3. **`trigger(STEP_FIELDS[step])`** on “Next” → validates only the current step and surfaces inline errors.
4. **Persistence** → values live in one form, so navigating back/forward never resets anything
   (`isDirty` drives the “draft in progress” pill).
5. **Live summary & price** → `useWatch({ control })` in `SummaryCard` / `LiveSummary` +
   pure `priceSpecialOrder()` / `priceCustomization()` recompute on every change.
6. **Controls** → `register` for plain inputs/textareas; `Controller` for every custom UI
   (option cards, chips, steppers, the ingredient `Record<id, qty>` map).
7. **States** → `isSubmitting` guards double submits (plus disabled buttons), `isValid` is the
   final whole-form guard on submit, errors clear live (`mode: "onChange"`).
8. **Soft rules** → empty fillings/frosting never block “Next”; the UI shows gentle encouragement instead.

Validation encoded in Zod: size & shape required · flavor required (custom flavor needs detail) ·
cake message ≤ 100 chars · date must be **tomorrow or later** · Ugandan phone (`+256 7…` / `07…`) ·
name/contact required · delivery requires an address (`superRefine`).

### Framer Motion notes (v11)

- Modern named imports from `framer-motion`; explicit spring configs (`{ type: "spring", stiffness, damping }`).
- Shared elements via `layoutId`: navbar underline, shop category pill, option-card selection halo.
- `layout` animations: summary chips, price lines, cart items, product grid.
- Step transitions: `AnimatePresence mode="wait"` with direction-aware slide variants (opacity/transform only).
- Micro-interactions: button `whileTap`, error **shake** keyframes, spring price counter, success entrance.
- Every animation respects `useReducedMotion()`.

---

## 2 · File structure

```
├── index.html                     # fonts, meta, favicon
├── package.json / vite.config.js / tailwind.config.js / postcss.config.js
├── public/images/                 # self-contained product & hero imagery
└── src/
    ├── main.jsx / App.jsx         # providers + routes
    ├── index.css                  # Tailwind layers, base styles
    ├── data/
    │   ├── products.js            # catalogue (UGX) + categories
    │   └── orderOptions.js        # ingredients, sizes, flavors, pricing options
    ├── lib/
    │   ├── format.js              # UGX + date helpers
    │   ├── pricing.js             # pure quote calculators
    │   └── whatsapp.js            # wa.me deep links + brand contact
    ├── schemas/
    │   ├── specialOrderSchemas.js # step schemas + combined + STEP_FIELDS
    │   └── customizationSchema.js
    ├── context/CartContext.jsx
    ├── components/
    │   ├── ui/                    # Button, ErrorText, QtyStepper, SmartImage, SectionHeading
    │   ├── layout/                # Navbar (layoutId underline), Footer, CartDrawer, Layout
    │   ├── home/                  # Hero, Featured, About
    │   ├── shop/ProductCard.jsx
    │   ├── customize/CustomizeModal.jsx   # provider + RHF/Zod modal + live summary
    │   └── order/                 # controls.jsx, steps.jsx (6 steps), ProgressBar,
    │                              #   SummaryCard, SuccessPanel
    └── pages/                     # HomePage, ShopPage, SpecialOrderPage
```

---

## 3 · Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve the build
```

No environment variables required. Orders open WhatsApp deep links — no backend needed.

---

## 4 · Using the flows

- **Shop** → filter by category → *Customize & Order* → tick ingredients (qty steppers appear),
  add chef notes, quantity → **Add to Cart** → basket drawer → *Confirm on WhatsApp*.
- **Bake Your Cake** (`/order`) → six steps with progress bar → live cake card + UGX estimate on
  the right → **Submit Special Order** → success panel with reference code and a pre-filled
  *Confirm on WhatsApp* button.

---

## 5 · Notes on RHF + Zod ↔ live summary ↔ Framer Motion

- The summary cards are **pure consumers of `useWatch`** — they re-render on form change but never
  write to the form, so there is no render loop and no conflict with Framer Motion’s
  `AnimatePresence` (controlled inputs stay mounted; only presentation nodes animate in/out).
- Price counters animate with a keyed `motion.span` (`key={total}`) spring — cheap, transform-only.
- Chip/card lists use `layout` + `layoutId`; because RHF state changes are ordinary React state,
  Framer’s layout measurement runs after commit and never fights the resolver.
- Errors render via `formState.errors` with `role="alert"` + `aria-describedby`; the navigation row
  remounts (`key={nav-${shake}}`) to replay the invalid-attempt shake without touching form state.

Made with ❤️ (and a lot of butter) in Kira Bulindo.
