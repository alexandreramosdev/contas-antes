# SPEC — Conta Antes

**Versão:** 1.0
**Status:** ativa — fonte de verdade para a conclusão do projeto
**Escopo:** MVP funcional + itens de roadmap sem backend

> **Como usar:** os agentes (`frontend-dev`, `qa-tester`, `code-reviewer`) seguem o ciclo desta SPEC: ler o próximo item não marcado da seção 12 → implementar → rodar verificações (`npm run lint`, `npx tsc --noEmit`, `npm test`; `npm run build` para fechar fase) → marcar o checklist somente após os critérios de aceite serem comprovados. Regras operacionais do repositório ficam em `AGENTS.md` e na skill `contas-antes` (`.opencode/skill/contas-antes/SKILL.md`).

---

## 1. Visão geral

O Conta Antes é um web app mobile-first para planejar e controlar os gastos de compras de supermercado em tempo real. O usuário monta a lista em casa e, no mercado, marca os itens que coloca no carrinho informando preço e quantidade. O app calcula o total do carrinho em tempo real e estima o valor total planejado da compra.

Princípios do produto:

- 100% client-side: nenhum dado sai do dispositivo (localStorage).
- Uso com uma mão: o usuário segura o celular enquanto empurra o carrinho.
- Estética "Dark & Clean" (zinc/emerald), sem distrações.

## 2. Persona e fluxo principal

**Persona:** comprador de supermercado que quer evitar surpresas na hora de passar no caixa.

**Fluxo principal:**

1. **Planejamento (em casa):** adiciona os itens que pretende comprar, sem preço.
2. **Modo Carrinho (no mercado):** ao colocar um item no carrinho, toca no checkbox. O bottom-sheet abre com o último preço pago sugerido (histórico) e a quantidade (padrão 1).
3. **Confirmação:** o item passa a contar no total do carrinho, exibido em tempo real na barra fixa inferior. O header mostra o "Planejado" — estimativa do total da compra (itens comprados pelo preço real + pendentes pelo último preço conhecido).
4. **Finalização:** "Nova Compra" remove os itens comprados, mantendo a lista de pendentes e o histórico de preços para a próxima ida ao mercado.

## 3. Escopo

### Dentro do escopo

- RF-01 a RF-12 (seção 7) e RN-01 a RN-11 (seção 6).
- Infra de testes com Vitest para a lógica pura (seção 10).
- Correções de consistência obrigatórias (seção 11).

### Fora do escopo (não implementar)

- Backend, sincronização em nuvem, contas de usuário.
- PWA/offline instalável.
- Testes E2E (Playwright).
- Quantidade decimal/por peso (kg).
- Múltiplas listas, compartilhamento, i18n (app é pt-BR apenas).
- Toggle claro/escuro (dark fixo).

## 4. Modelo de dados

```ts
type Category =
  | "Hortifruti"
  | "Carnes e Peixes"
  | "Padaria"
  | "Laticínios e Ovos"
  | "Mercearia"
  | "Bebidas"
  | "Congelados"
  | "Limpeza"
  | "Higiene e Beleza"
  | "Outros";

interface Item {
  id: string; // crypto.randomUUID()
  name: string; // nome exibido (trim)
  nameKey: string; // nome normalizado (ver abaixo)
  category: Category; // inferida ou escolhida manualmente
  categorySource: "auto" | "manual";
  quantity: number; // inteiro, 1..999
  priceCents: number | null; // preço real pago, em centavos
  checked: boolean; // true = no carrinho
  updatedAt: number; // Date.now()
}

interface PriceHistoryEntry {
  priceCents: number; // em centavos
  updatedAt: number;
}

type PriceHistory = Record<string, PriceHistoryEntry>; // chave = nameKey
```

Regras do modelo:

- **Dinheiro:** `priceCents` e o histórico guardam sempre inteiros em centavos. Nunca armazenar float.
- **`nameKey`:** `name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/\s+/g, " ")`. É a chave do histórico de preços e da detecção de duplicatas.
- **`id`:** `crypto.randomUUID()` (contexto seguro). O `Math.random()` atual é proibido.
- **`categorySource`:** vira `"manual"` a partir do primeiro override do usuário e nunca é sobrescrita pela inferência automática.
- **`quantity`:** inteiro entre 1 e 999.

## 5. Persistência (localStorage)

| Chave                        | Conteúdo       |
| ---------------------------- | -------------- |
| `conta-antes:v1:items`       | `Item[]`       |
| `conta-antes:v1:price-history` | `PriceHistory` |

Regras:

- Acesso somente no client (guard contra SSR; nenhum `window`/`localStorage` durante render no servidor).
- **Leitura tolerante:** JSON inválido → retorna default (`[]` / `{}`); itens estruturalmente inválidos são filtrados individualmente, sem derrubar o app.
- Gravação a cada mutação de estado.
- Migrações futuras usam nova versão de chave (`v2`) e migram a partir da `v1`; a chave antiga só é removida após migração bem-sucedida.

## 6. Regras de negócio

- **RN-01** — Dinheiro sempre em centavos; entrada e exibição passam exclusivamente por `src/lib/currency.ts`.
- **RN-02** — `parsePriceToCents` aceita: `"15,99"`, `"15.99"`, `"R$ 1.234,56"`, `"10"` (→ 1000), `"0,5"` (→ 50); retorna `null` para vazio/inválido. Se contém `,`, o texto após a última vírgula (até 2 dígitos) é decimal e os pontos são separador de milhar; senão, ponto seguido de exatamente 2 dígitos é decimal.
- **RN-03** — `formatBRL` usa `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })` → `"R$ 15,99"`.
- **RN-04** — Quantidade é inteira, mínima 1, máxima 999.
- **RN-05** — Duplicata pendente: não permitir adicionar item com mesmo `nameKey` de um item existente com `checked: false`; exibir feedback "Este item já está na lista" (aria-live).
- **RN-06** — Preço é obrigatório para confirmar no modo carrinho; valor inválido mantém o sheet aberto com mensagem de erro.
- **RN-07** — Confirmar no modo carrinho grava `priceCents` e `quantity` no item e atualiza o histórico do `nameKey` com o preço.
- **RN-08** — Desmarcar um item mantém `priceCents` e `quantity` registrados; re-marcar sugere o preço atual do item (histórico como fallback).
- **RN-09** — "Nova Compra" remove apenas itens com `checked: true`; pendentes e histórico permanecem.
- **RN-10** — Categorização automática roda em `addItem` e em `renameItem` somente quando `categorySource === "auto"`.
- **RN-11** — Totais:

  ```
  cartTotalCents      = Σ (priceCents × quantity) para itens com checked === true && priceCents != null
  estimatedTotalCents = cartTotalCents + Σ (priceHistory[nameKey].priceCents × quantity)
                        para itens com checked === false que tenham histórico
  cartCount           = quantidade de itens com checked === true
  ```

  Itens sem preço e sem histórico não contribuem para a estimativa.

## 7. Requisitos funcionais

### RF-01 — Adicionar item à lista (F2)

O usuário digita o nome no input sticky do topo e envia pelo botão "+" ou Enter.

Critérios de aceite:

- Trim do nome; entradas vazias/só espaços são bloqueadas sem efeito.
- Item criado com `checked: false`, `quantity: 1`, `priceCents: null`, `category` inferida e `categorySource: "auto"`.
- Duplicata pendente bloqueada com feedback acessível (RN-05).
- Input limpo e com foco mantido após adicionar.
- Item aparece imediatamente na lista e sobrevive a reload (RF-08).

### RF-02 — Lista de itens e estados vazios (F2)

Cada item é renderizado por `ProductCard`.

Critérios de aceite:

- Card mostra: checkbox, nome, badge de categoria e badge de preço.
- Badge de preço: preço real formatado quando registrado; senão último preço do histórico com opacidade reduzida; senão oculto.
- Item marcado: nome com `line-through` e cor atenuada.
- Lista vazia exibe `EmptyState` com dica de uso; quando todos os itens estão marcados, variante "Tudo comprado!".

### RF-03 — Categorização automática (F2)

Dicionário pt-BR em `src/lib/categories.ts`.

Critérios de aceite:

- Cobre as 9 categorias + fallback `"Outros"`.
- Normalização de acentos e caixa (`AÇÚCAR` → Mercearia).
- Match: palavra-chave multi-palavra tem prioridade; entre matches, vence a palavra-chave mais longa; ordem de declaração é o desempate final.
- Casos obrigatórios: `banana` → Hortifruti; `creme de leite` → Laticínios e Ovos (não Higiene); `sabão em pó` → Limpeza; `xyzabc` → Outros.
- Testes unitários com ≥3 exemplos por categoria.

### RF-04 — Marcar item abre bottom-sheet (F1)

Critérios de aceite:

- Toque no checkbox de item **não marcado** abre o `ItemSheet` (drawer vaul) — não marca direto.
- Modo carrinho: título com o nome do item, input de preço (`inputMode="decimal"`) pré-preenchido com o preço atual ou o último do histórico, stepper de quantidade (- / +, 1..999), botão primário "Adicionar ao carrinho".
- Fechar/cancelar sem confirmar não altera o item.
- Confirmar válido aplica RN-07 e fecha o sheet; inválido aplica RN-06.

### RF-05 — Total em tempo real (F1)

Critérios de aceite:

- `CartSummaryBar` fixa na base exibe `cartTotalCents` (RN-11) e a contagem de itens marcados; atualiza a cada confirmação/desmarcação.
- Header exibe "Planejado: {formatBRL(estimatedTotalCents)}" em tempo real (RN-11), sem valores hardcoded.
- Barra visível apenas quando há itens marcados; respeita `safe-area-inset-bottom`.
- Total com `aria-live="polite"`.

### RF-06 — Editar item (F2)

Critérios de aceite:

- Toque no corpo do card abre o mesmo `ItemSheet` em modo edição: campo nome, chips de categoria (9 categorias + Outros) e botão "Remover item" (destructive).
- Alterar categoria define `categorySource: "manual"`.
- Renomear recalcula `nameKey` e re-infere categoria apenas se `categorySource === "auto"` (RN-10).
- Nome vazio é bloqueado.

### RF-07 — Remover item (F2)

Critérios de aceite:

- Remoção pelo botão no sheet de edição; fecha o sheet e remove da lista.
- Histórico de preços não é afetado.

### RF-08 — Persistência (F0)

Critérios de aceite:

- Estado carregado do localStorage no mount e salvo a cada mutação.
- Reload restaura itens, preços, quantidades, categorias e checks.
- Dados corrompidos → defaults sem crash (seção 5).
- Nenhum acesso a `window`/`localStorage` durante SSR (build limpo).

### RF-09 — Histórico inteligente de preços (F1)

Critérios de aceite:

- Último preço sugerido no sheet (RF-04) e no badge do card (RF-02).
- Confirmar no carrinho atualiza o histórico do `nameKey` (RN-07).
- Histórico nunca é apagado por remoção de item ou "Nova Compra".

### RF-10 — Nova Compra (F2)

Critérios de aceite:

- Botão na `CartSummaryBar` visível quando há itens marcados; ao tocar, remove somente os marcados (RN-09), sem confirmação.
- Itens pendentes permanecem; histórico permanece; a barra some se não houver mais marcados.

### RF-11 — Desmarcar item (F1)

Critérios de aceite:

- Toque no checkbox de item **marcado** desmarca imediatamente (sem sheet), removendo-o do total.
- `priceCents` e `quantity` são mantidos (RN-08).

### RF-12 — Formatação BRL (F0)

Critérios de aceite:

- Toda exibição de dinheiro usa `formatBRL`; nenhum valor monetário hardcoded na UI (fim de "R$ 15,99" e "R$ 200,00" fixos).

## 8. Requisitos não-funcionais

- **RNF-01 Mobile-first:** alvos de toque ≥ 44×44px; ações primárias na zona do polegar (barra inferior); sem scroll horizontal em 360px.
- **RNF-02 Design:** fundo zinc-950, cards zinc-900 com borda zinc-800, emerald-500 exclusivo para dinheiro/ações positivas; dark fixo.
- **RNF-03 Acessibilidade:** checkbox com label acessível, sheet com título/descrição (Radix/vaul), foco visível, total e feedbacks com `aria-live`.
- **RNF-04 Qualidade de código:** TypeScript strict, sem `any`/`@ts-ignore`; `npm run lint`, `npx tsc --noEmit` e `npm run build` limpos.
- **RNF-05 Performance:** estado local e totais memoizados; nenhuma chamada de rede.
- **RNF-06 Privacidade:** 100% local; nada sai do dispositivo.
- **RNF-07 Compatibilidade:** Chrome/Safari/Firefox modernos (mobile e desktop); `crypto.randomUUID()` em contexto seguro.
- **RNF-08 Convenções:** identificadores em inglês, texto de UI em pt-BR, sem comentários, exports nomeados, alias `@/src`.

## 9. Arquitetura alvo

```
src/
├── app/
│   ├── layout.tsx          # lang pt-BR, metadata real, fontes
│   ├── page.tsx            # composição da tela (client)
│   └── globals.css         # tokens (existente)
├── components/
│   ├── Header.tsx          # título + Planejado (dinâmico)
│   ├── AddItemInput.tsx    # form sticky + feedback de duplicata
│   ├── ProductCard.tsx     # item: checkbox, badges, abre sheet
│   ├── ItemSheet.tsx       # drawer vaul: modos carrinho e edição
│   ├── CartSummaryBar.tsx  # barra fixa: total + Nova Compra
│   ├── EmptyState.tsx      # lista vazia / tudo comprado
│   └── ui/                 # shadcn (reutilizar; alterar só se indispensável)
├── hooks/
│   └── useShoppingList.ts  # estado, ações e persistência
├── lib/
│   ├── currency.ts         # parsePriceToCents, formatBRL
│   ├── categories.ts       # CATEGORIES, inferCategory
│   ├── storage.ts          # load/save de itens e histórico, upsert do histórico
│   ├── totals.ts           # getCartTotalCents, getEstimatedTotalCents, getCartCount
│   └── utils.ts            # cn (existente)
└── types/
    └── index.ts            # Item, Category, PriceHistory, props
```

API sugerida do hook (nomes podem evoluir; responsabilidades não):

```ts
const {
  items,
  priceHistory,
  addItem,
  removeItem,
  renameItem,
  setCategory,
  checkItem,
  uncheckItem,
  clearChecked,
  getSuggestedPrice,
  cartTotalCents,
  estimatedTotalCents,
  cartCount,
} = useShoppingList();
```

## 10. Testes (Vitest)

- **Setup (F0):** devDependency `vitest`; scripts `"test": "vitest run"` e `"test:watch": "vitest"`; `vitest.config.mts` com alias `@` → raiz do projeto e ambiente `node`.
- Testes colocados em `src/lib/*.test.ts` (currency, categories, storage, totals). Apenas lógica pura — sem jsdom/componentes.
- Piso mínimo: cada função exportada tem ≥ 1 caso feliz e ≥ 1 caso de borda/erro.
- Casos obrigatórios: tabela de parsing da RN-02, totais da RN-11 (marcado/desmarcado/com histórico/sem preço), categorias do RF-03 (≥ 3 por categoria), corrupção e filtragem de dados inválidos no storage (seção 5).
- `localStorage` deve ser mockado nos testes de storage.
- `npm test` precisa passar antes de marcar qualquer item do checklist como concluído.

## 11. Correções de consistência obrigatórias

- [ ] `src/app/layout.tsx`: `lang="en"` → `"pt-BR"`; `description: "..."` → texto real do app.
- [ ] `README.md`: Next.js 14 → 16 (conferir `package.json`); documentar scripts de teste; sincronizar funcionalidades/roadmap com a realidade.
- [ ] `src/components/ProductCard.tsx`: classe inválida `itens-center` → `items-center`; remover `key` redundante no `<Card>`; `flex-between` não existe no Tailwind — ajustar.
- [ ] `src/app/page.tsx`: remover `generateId` com `Math.random` (substituído por `crypto.randomUUID` via hook).
- [ ] Remover valores hardcoded: `"R$ 15,99"` (ProductCard) e `"R$ 200,00"` (Header).
- [ ] `metadata.title`/`metadata.description` definitivos.

## 12. Checklist de execução

> O `frontend-dev` marca `[x]` somente após os critérios de aceite estarem comprovados (ver seção 13). O `qa-tester` e o `code-reviewer` nunca marcam itens.

### F0 — Fundação (infra + lógica)

- [x] Instalar/configurar Vitest + scripts (seção 10)
- [x] `types/index.ts` completo (seção 4)
- [x] `lib/currency.ts` + testes (RN-02, RN-03, RF-12)
- [x] `lib/categories.ts` + testes (RF-03)
- [x] `lib/storage.ts` + testes (seção 5)
- [x] `lib/totals.ts` + testes (RN-11)
- [x] `hooks/useShoppingList.ts` (RF-08)

### F1 — Modo Carrinho

- [ ] `ItemSheet` modo carrinho: preço sugerido + stepper (RF-04, RF-09)
- [ ] Checkbox funcional no `ProductCard` (RF-04, RF-11)
- [ ] `CartSummaryBar` com total em tempo real (RF-05)
- [ ] Header com "Planejado" dinâmico (RF-05)
- [ ] Badge de preço do card com preço real/sugerido (RF-02, RF-09)

### F2 — Lista completa

- [ ] Categorização automática exibida + override manual (RF-03, RF-06)
- [ ] `ItemSheet` modo edição: renomear, categoria, remover (RF-06, RF-07)
- [ ] Nova Compra na barra inferior (RF-10)
- [ ] `EmptyState` (lista vazia e tudo comprado) (RF-02)
- [ ] Bloqueio de duplicata pendente com feedback (RF-01, RN-05)

### F3 — Polimento

- [ ] Correções de consistência (seção 11)
- [ ] Acessibilidade: aria-live, labels, foco, touch targets (RNF-01, RNF-03)
- [ ] Revisão final do `code-reviewer` sem achados críticos/altos abertos
- [ ] `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build` verdes
- [ ] Teste manual do fluxo completo (seção 2) em viewport ~390px

## 13. Definition of Done

**Um requisito está concluído quando:**

1. Todos os critérios de aceite são verdadeiros.
2. `npm run lint`, `npx tsc --noEmit` e `npm test` passam.
3. O item correspondente do checklist (seção 12) é marcado com a evidência reportada (comandos/resultados no resumo da tarefa).

**O projeto está finalizado quando:**

1. O checklist F0–F3 está 100% marcado.
2. O build de produção está limpo e o fluxo completo foi validado manualmente em mobile.
3. A revisão do `code-reviewer` não tem achados crítico/alto abertos.
4. README e metadata estão coerentes com o app real.
