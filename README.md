# 🛒 Conta Antes

![Project Status](https://img.shields.io/badge/status-em_desenvolvimento-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

> Uma aplicação web mobile-first para planejamento e controle financeiro de compras de supermercado em tempo real.

## 💡 Sobre o Projeto

O **Conta Antes** nasceu da necessidade de evitar surpresas na hora de passar no caixa. Diferente de listas de tarefas comuns, este web app atua como uma calculadora de carrinho inteligente.

O usuário pode criar sua lista em casa e, durante as compras, inserir preços e quantidades. O app calcula o total em tempo real, permitindo um controle orçamentário preciso antes mesmo de finalizar a compra.

### ✨ Funcionalidades Principais

- [x] **Lista de Planejamento:** Adicionar itens que você pretende comprar.
- [x] **Modo Carrinho:** Check-in de itens com inserção de **Preço** e **Quantidade**.
- [x] **Cálculo em Tempo Real:** O valor total da compra é atualizado instantaneamente a cada item marcado.
- [x] **Histórico Inteligente:** O app salva o último preço pago em um produto (via LocalStorage) e sugere esse valor na próxima compra.
- [x] **Design Dark Moderno:** Interface focada em usabilidade com pouca luz e economia de bateria.

---

## 🛠️ Tecnologias Utilizadas

Este projeto faz parte do meu portfólio e foi construído com foco em performance e código limpo:

- **[Next.js 14](https://nextjs.org/)** (App Router) - Framework React para produção.
- **[TypeScript](https://www.typescriptlang.org/)** - Para tipagem estática e robustez do código.
- **[Tailwind CSS](https://tailwindcss.com/)** - Para estilização ágil e responsiva.
- **[Lucide React](https://lucide.dev/)** - Ícones leves e vetoriais.
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

1. Clone o repositório:

```bash
git clone [https://github.com/alexandreramosdev/contas-antes.git](https://github.com/alexandreramosdev/contas-antes.git)
```

Entre na pasta do projeto:

Bash

cd contas-antes
Instale as dependências:

```Bash

npm install
# ou
yarn install
```

Rode o servidor de desenvolvimento:

```Bash

npm run dev
```

Abra http://localhost:3000 no seu navegador para ver o resultado.

## 🔜 Roadmap (Futuro)

[ ] Implementar separação por Categorias (Hortifruti, Limpeza, etc).

[ ] Adicionar opção de limpar apenas os itens marcados ("Nova Compra").

[ ] Sincronização em nuvem (Backend).

## 📝 Licença

Este projeto está sob a licença MIT.

Desenvolvido por Alexandre Ramos
