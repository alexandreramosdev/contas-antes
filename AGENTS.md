# AGENTS.md — Conta Antes

Mobile-first supermarket shopping list app that computes the cart total in real time. 100% client-side (localStorage), no backend. UI strings are pt-BR; code identifiers are English.

**Source of truth: `docs/SPEC.md`.** Read it before implementing anything — requirements (RF-xx), business rules (RN-xx), acceptance criteria, phases (F0–F3) and the execution checklist live there.

## Commands

| Command              | Purpose                              |
| -------------------- | ------------------------------------ |
| `npm run dev`        | Dev server at http://localhost:3000  |
| `npm run lint`       | ESLint                               |
| `npx tsc --noEmit`   | Typecheck                            |
| `npm test`           | Vitest (single run)                  |
| `npm run test:watch` | Vitest watch mode                    |
| `npm run build`      | Production build                     |

Before marking any task done: `npm run lint`, `npx tsc --noEmit`, `npm test`. Before phase sign-off: also `npm run build`.

## Conventions and workflow

Load the project skill `contas-antes` (`.opencode/skill/contas-antes/SKILL.md`) whenever working on this repo — it covers design tokens, data invariants, the file map and the spec-driven workflow.

## Agents

- `frontend-dev` (primary) — implements SPEC checklist items.
- `qa-tester` (subagent) — writes/runs Vitest tests, verifies acceptance criteria; never edits app code.
- `code-reviewer` (subagent) — read-only review against the SPEC; reports severity-ranked findings.

## Gotchas

- The README claims Next.js 14; the project actually runs Next 16 (App Router), React 19 and Tailwind v4. Trust `package.json` and `components.json`.
- All money is stored as integer cents. Never use floats; always go through `src/lib/currency.ts`.
- `localStorage` may only be touched in client components (SSR guard required) — keep persistence inside `src/lib/storage.ts` + `src/hooks/useShoppingList.ts`.
- Path alias is `@/*` → project root, so imports look like `@/src/components/...`. This is intentional — do not "fix" it to `@/components`.
- No comments in code (repo convention).
- Never commit unless the user explicitly asks.
