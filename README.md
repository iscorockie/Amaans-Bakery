# Amaan’s Bakery 🍰

> **Freshly Baked, Perfectly Tasty** — Kira Bulindo, Kampala, Uganda
> WhatsApp: +256 772 606296 · +256 744 850346

A production-ready online bakery storefront: homepage, categorized shop with a
**Customize & Order** flow, and the flagship **“Bake Your Own Cake”** six-step
wizard with a live visual summary and dynamic UGX price estimate.

Stack: **React 18 + Vite · Tailwind CSS · Framer Motion v11 · React Hook Form + Zod**.

> **Fonts (per owner instruction):** headings/display use **Sora**, body uses
> **Nunito Sans** — intentionally *not* Playfair/Inter. Do not change.

---

## 1 · Architecture

| Concern   | Approach |
|-----------|----------|
| Routing   | `react-router-dom` — `/` (home), `/shop`, `/order` |
| Styling   | Tailwind theme: `primary #7B1E1E`, `cream #F8F1E3`, `gold #D4A373`, `cocoa #3E2723`, soft shadows + warm brand gradients (`warm-glow`, `berry-gold`, `cocoa-fade`) |
| Animation | **Framer Motion v11** (see decision below) |
| Forms     | One `useForm` per flow · `zodResolver` · per-step schemas + combined schema · `trigger()` gating · `useWatch` summaries |
| Cart      | React context; confirmed via **WhatsApp** deep links |
| Perf      | `React.memo` presentational primitives (`ProductCard`, `SelectionCard`, `IngredientChip`, `CategoryFilter`), scoped `useWatch`, `useMemo` price math, transform/opacity-only animations |

### Multi-step form strategy (RHF + Zod)

1. **Combined schema** → `zodResolver(specialOrderSchema)` validates the final submit.
2. **Per-step schemas** (`STEP_SCHEMAS`) + `safeParse` over `useWatch` → instant `stepValid`
   enabling/disabling **Next / Submit**.
3. **`trigger(STEP_FIELDS[step])`** on “Next” → current-step-only validation + inline errors.
4. Values live in one form → nothing resets between steps (`isDirty` shows a draft pill).
   The draft (values **and** current step) also autosaves to `sessionStorage`, so an
   accidental refresh resumes exactly where you left off; it clears on submit/reset.
   Completed progress dots are clickable to jump back.
5. `isSubmitting` guards double submits; `isValid` is the whole-form final guard;
   `mode: "onChange"` clears errors as fields correct.
6. Soft rules: empty fillings/frosting never block — gentle encouragement instead.
7. Zod rules: size/shape/flavor required · message ≤100 chars · date ≥ tomorrow ·
   Ugandan phone (`+256 7…` / `07…`) · name/contact required · delivery ⇒ address (`superRefine`).

---

## 2 · Animation Library Decision — **Framer Motion** (not Motion One)

**Investigation summary** (npm metadata + current docs/guides):

| Criterion | Motion One (`@motionone/*`) | Framer Motion v11+ (`framer-motion` / `motion`) |
|---|---|---|
| Bundle | ~3.8 kB (WAAPI-only core) | ~30 kB gzip full, ~15 kB lazy-loaded |
| API style | Imperative (`animate(el, …)`) | Declarative React (`<motion.div>`) |
| **Layout animations / reflow** | ❌ not supported [1] | ✅ `layout` prop |
| **Shared element transitions** | ❌ [1] | ✅ `layoutId` |
| **Exit/presence orchestration** | manual only [1] | ✅ `AnimatePresence mode="wait"` |
| Wizard step transitions | hand-rolled | variants + custom direction |
| Springs & micro-interactions | `spring()` manual | `whileTap/whileHover` + spring configs |
| Reduced motion | manual media query | ✅ `useReducedMotion()` |
| React integration | thin wrapper, **archived 2023-09** (npm) | first-class, actively maintained |
| Perf model | pure WAAPI (off-main-thread) | hybrid: WAAPI for transform/opacity + JS where needed [2] |

**Why this project needs Framer Motion’s exclusive strengths:**
- *Live summary card reflow & chip reordering* → `layout` animations.
- *Shared-element transitions* → navbar underline, category pill, selection-card halo (`layoutId`).
- *Wizard + modal + cart enter/exit choreography* → `AnimatePresence`.

Motion One cannot do any of these declaratively; we’d hand-roll exit timing and layout
measurement, losing correctness for ~25 kB. Its perf advantage (pure WAAPI) is largely
neutralized because Framer Motion also hardware-accelerates transform/opacity via WAAPI [2],
and our animations are transform/opacity-only by design.

**Hybrid considered & rejected:** adding Motion One just for micro-interactions would save
≈3 kB while introducing a second imperative mental model; Framer’s `whileTap/whileHover`
already cover those for free.

**Final recommendation: Framer Motion v11, single library.** [1][2]
(If a future hard bundle budget appears, `LazyMotion` + `domAnimation` halves FM’s cost
before ever reaching for Motion One.)

[1](https://www.pkgpulse.com/guides/framer-motion-vs-motion-one-vs-autoanimate-2026) ·
[2](https://motion.dev/magazine/should-i-use-framer-motion-or-motion-one)

---

## 3 · File structure

```
├── index.html                        # Sora + Nunito Sans, meta, favicon
├── package.json · vite.config.js · tailwind.config.js · postcss.config.js
├── public/images/                    # self-contained product & hero imagery (20)
└── src/
    ├── main.jsx · App.jsx            # providers + routes
    ├── index.css
    ├── data/        products.js · orderOptions.js
    ├── lib/         format.js · pricing.js · whatsapp.js
    ├── schemas/     specialOrderSchemas.js · customizationSchema.js
    ├── context/     CartContext.jsx
    ├── components/
    │   ├── ui/          Button · ErrorText · QtyStepper · SmartImage · SectionHeading
    │   ├── layout/      Header · Footer · CartDrawer · Layout
    │   ├── home/        Hero · Featured · About
    │   ├── shop/        ProductCard (memo) · CategoryFilter (memo)
    │   ├── customize/   CustomizeModal (+provider) — RHF/Zod, live summary
    │   └── order/       SpecialOrderWizard · LiveCakeSummary · StepProgressBar
    │                    · SuccessPanel · steps.jsx · controls.jsx
    │                    · SelectionCard (memo) · IngredientChip (memo)
    └── pages/       HomePage · ShopPage · SpecialOrderPage
```

---

## 4 · Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build && npm run preview
npm test           # jsdom smoke tests: full wizard walk + shop/cart flows
```

No env vars. Orders open WhatsApp deep links — no backend required.

---

## 5 · How layout-style animations were implemented (Framer Motion)

- **LiveCakeSummary** consumes `useWatch({ control })`; rows/chips carry `layout` so the card
  reflows elegantly as ingredients appear; the price counter is a keyed spring `motion.span`.
- **IngredientChip** uses `layout` + `whileTap`; siblings reflow when one is removed.
- **SelectionCard** halo uses `layoutId` per group → the gold ring *slides* between cards.
- **Wizard steps**: `AnimatePresence mode="wait"` + direction-aware variants
  (opacity/transform only); progress fill is a spring width; dots flip to checks with springs.
- **Micro-interactions**: `whileTap`/`whileHover` springs on buttons/cards; invalid attempts
  replay a keyframe shake via keyed remount (`key={nav-${shake}}`).
- **Reduced motion**: every component checks `useReducedMotion()` and collapses to
  opacity-only or instant states.
- **Performance**: transform/opacity-only animations, memoized leaf components, scoped
  `useWatch` per field, `useMemo` quotes — mobile stays at 60 fps.

---

## 6 · Deployment (GitHub Pages)

Live at **https://iscorockie.github.io/Amaans-Bakery/**.

- **Current setup:** GitHub Pages → *Deploy from a branch* → publishing branch + `/docs`.
  The production build lives in `docs/` (with `docs/404.html` as the SPA fallback so
  `/shop` and `/order` survive refresh). To publish changes run:

  ```bash
  npm run deploy:pages   # vite build + sync dist → docs/ (incl. 404.html + .nojekyll)
  git add docs && git commit -m "Rebuild docs/" && git push
  ```

  Pages rebuilds automatically on push.

- **Routing note:** `vite.config.js` sets `base: /Amaans-Bakery/` and the router uses that
  base, so the app works in the project-site subpath.

- **Actions-based deploy (ready, pending permissions):** a `.github/workflows/deploy.yml`
  that builds, tests and deploys with `actions/deploy-pages` (no `docs/` needed) is kept on
  the working branch until the GitHub app used for pushes is granted *Actions (workflows)*
  write permission. Once pushed, set the Pages source to **GitHub Actions** in repo settings.

Made with ❤️ (and a lot of butter) in Kira Bulindo.
