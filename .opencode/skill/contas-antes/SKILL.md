---
name: contas-antes
description: Use when working on the Conta Antes app — supermarket shopping list, cart mode, price bottom-sheet, real-time cart totals, price history, localStorage persistence, auto-categorization. Covers project conventions, data invariants, commands and the spec-driven workflow defined in docs/SPEC.md.
---

# Conta Antes — project skill

Mobile-first supermarket shopping list app: plan items at home, check them into the cart at the store with price + quantity, track the cart total in real time and the estimated total of the whole list. 100% client-side, no backend, UI in pt-BR.

## Source of truth and workflow

`docs/SPEC.md` defines requirements (RF-01..RF-12), business rules (RN-01..RN-11), acceptance criteria, target architecture, phases (F0–F3) and the execution checklist.

Workflow for every feature:

1. Pick the next unchecked item in the SPEC "Checklist de execução" (respect F0 → F3 order; dependencies first).
2. Re-read the referenced RF/RN and their acceptance criteria.
3. Implement following the conventions below.
4. Verify: `npm run lint`, `npx tsc --noEmit`, `npm test`; run `npm run build` before closing a phase. Test the UI manually when the change is visual.
5. Only then mark the checklist item `[x]` and report the evidence in the task summary.

Never mark a checklist item without running the checks. Fix failures before moving on. If a requirement is ambiguous or conflicts with the codebase, ask instead of guessing.

## Stack

Next 16 App Router · React 19 · TypeScript strict · Tailwind v4 · shadcn/ui (new-york, zinc, lucide) · vaul drawer · Vitest. Persistence via localStorage only.

## Commands

- `npm run dev` — dev server (http://localhost:3000)
- `npm run lint` — ESLint
- `npx tsc --noEmit` — typecheck
- `npm test` / `npm run test:watch` — Vitest
- `npm run build` — production build

## Design tokens & UX

- Background `zinc-950`; cards `zinc-900` with `zinc-800` borders.
- `emerald-500` is reserved for money and positive/completion actions (sole exception: the decorative dot in the title, the app brand mark). Never otherwise use it for decoration.
- Dark only — no light theme toggle.
- Mobile-first: touch targets ≥ 44×44px, primary actions within thumb reach (bottom bar), no horizontal scroll at 360px.
- UI strings in pt-BR; money always via `formatBRL` from `src/lib/currency.ts`.

## Data invariants

- Money: integer **cents** everywhere (`priceCents`, `priceHistory`). Parse/format only through `src/lib/currency.ts`.
- `nameKey`: `name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/\s+/g, " ")` — the price-history key and duplicate-check key.
- localStorage keys: `conta-antes:v1:items`, `conta-antes:v1:price-history`. Load tolerantly (corrupted JSON → defaults; invalid entries filtered individually). Never touch localStorage during SSR.
- `item.id`: `generateId()` from `src/lib/utils.ts` (crypto.randomUUID when available, UUID v4 via crypto.getRandomValues fallback for non-secure contexts like LAN HTTP). `quantity`: integer 1..999.
- `categorySource: "auto" | "manual"` — auto-categorization only runs on add/rename when the source is `auto`; a manual override is never overwritten.
- Totals (RN-11): cart = Σ(priceCents × quantity) of checked items with price; estimate = cart + history price × quantity of unchecked items that have history.

## Code conventions

- TypeScript strict; no `any`, no `@ts-ignore`.
- Named exports only; components in PascalCase files under `src/components/`.
- `cn()` from `src/lib/utils.ts` for class merging; lucide-react for icons.
- shadcn components live in `src/components/ui/` — reuse them; only add a new one if the SPEC requires it.
- Icons/logic split: pure logic in `src/lib/` (tested), state and persistence in `src/hooks/useShoppingList.ts`, components stay presentational and receive props/handlers.
- No comments in code.
- Alias `@/*` maps to the project root, so imports are `@/src/...`. Keep the existing import style.
- UI strings pt-BR; identifiers, filenames and test names in English.

## File map

- `src/lib/currency.ts` — `parsePriceToCents`, `formatBRL`.
- `src/lib/categories.ts` — `CATEGORIES`, `inferCategory`.
- `src/lib/storage.ts` — versioned load/save for items and price history, tolerant parsing.
- `src/lib/totals.ts` — `getCartTotalCents`, `getEstimatedTotalCents`, `getCartCount`.
- `src/hooks/useShoppingList.ts` — single source of state, actions and persistence.
- `src/components/` — `Header`, `AddItemInput`, `ProductCard`, `ItemSheet`, `CartSummaryBar`, `EmptyState`.
- `src/types/index.ts` — shared types.

## Testing

- Vitest, node environment, colocated `src/lib/*.test.ts`. Pure logic only — no component/DOM tests in this phase.
- Every exported function: at least 1 happy path + 1 edge/error case.
- Required cases: RN-02 parsing table, RN-11 totals, RF-03 categories (≥ 3 examples each; `creme de leite` vs `creme dental`; accent handling), storage corruption and invalid-entry filtering (mock localStorage).
- Keep tests deterministic; `describe`/`it` names in English.
