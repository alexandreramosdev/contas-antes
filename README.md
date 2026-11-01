# 🛒 Conta Antes

![Project Status](https://img.shields.io/badge/status-MVP-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

> Uma aplicação web mobile-first para planejamento e controle financeiro de compras de supermercado em tempo real.

## 💡 Sobre o Projeto

O **Conta Antes** nasceu da necessidade de evitar surpresas na hora de passar no caixa. Diferente de listas de tarefas comuns, este web app atua como uma calculadora de carrinho inteligente.

O usuário pode criar sua lista em casa e, durante as compras, inserir preços e quantidades. O app calcula o total em tempo real, permitindo um controle orçamentário preciso antes mesmo de finalizar a compra.

### ✨ Funcionalidades Principais

- [x] **Lista de Planejamento:** Adicionar itens que você pretende comprar.
- [x] **Modo Carrinho:** Check-in de itens em um bottom-sheet com **Preço** e **Quantidade**.
- [x] **Cálculo em Tempo Real:** Total do carrinho e estimativa da compra ("Planejado") atualizados a cada item marcado.
- [x] **Histórico Inteligente:** O app salva o último preço pago em um produto (via LocalStorage) e sugere esse valor na próxima compra.
- [x] **Categorização Automática:** Itens classificados por categoria (Hortifruti, Limpeza, etc.) com ajuste manual.
- [x] **Nova Compra:** Limpa apenas os itens marcados, mantendo a lista de pendentes e o histórico de preços.
- [x] **Design Dark Moderno:** Interface focada em usabilidade com pouca luz e economia de bateria.

---

## 🛠️ Tecnologias Utilizadas

Este projeto faz parte do meu portfólio e foi construído com foco em performance e código limpo:

- **[Next.js 16](https://nextjs.org/)** (App Router + Turbopack) - Framework React para produção.
- **[React 19](https://react.dev/)** - Biblioteca para interfaces.
- **[TypeScript](https://www.typescriptlang.org/)** - Para tipagem estática e robustez do código.
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Para estilização ágil e responsiva.
- **[shadcn/ui](https://ui.shadcn.com/)** + **[Vaul](https://vaul.emilkowal.ski/)** - Componentes acessíveis e bottom-sheet.
- **[Lucide React](https://lucide.dev/)** - Ícones leves e vetoriais.
- **[Vitest](https://vitest.dev/)** - Testes unitários da lógica (moeda, categorias, armazenamento e totais).
- **LocalStorage API** - Persistência de dados no navegador (Client-side).

---

## 🎨 UX/UI Design

O projeto segue uma estética **"Dark & Clean"** (inspirada em interfaces modernas como Linear/Vercel):

1.  **Fundo Zinc-950:** Reduz o cansaço visual e economiza bateria em telas OLED.
2.  **Acentos Emerald-500:** A cor verde é usada exclusivamente para indicar dinheiro e ações de conclusão, guiando o olhar do usuário.
3.  **Mobile First:** Interface otimizada para uso com uma mão (polegar), ideal para o contexto de uso (segurando o celular enquanto empurra o carrinho).

---

## 🚀 Como rodar o projeto

### Pré-requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.

### Passo a passo

1. Clone o repositório e entre na pasta:

```bash
git clone https://github.com/alexandreramosdev/contas-antes.git
cd contas-antes
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse http://localhost:3000.

### Testes e qualidade

```bash
npm test           # testes unitários (Vitest)
npm run test:watch # testes em modo watch
npm run lint       # ESLint
npx tsc --noEmit   # verificação de tipos
npm run build      # build de produção
```

## 🔜 Roadmap (Futuro)

- [ ] Sincronização em nuvem (Backend).
- [ ] Quantidade por peso (kg) para itens de hortifruti.
- [ ] PWA instalável com suporte offline.

## 📝 Licença

Este projeto está sob a licença MIT.

Desenvolvido por Alexandre Ramos
