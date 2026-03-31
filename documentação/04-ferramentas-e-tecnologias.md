# 4. Ferramentas e Tecnologias

## Stack principal

- **React**: construção da interface por componentes.
- **Vite**: servidor de desenvolvimento e build.
- **JavaScript (ESM)**: linguagem da aplicação.
- **React Router DOM**: navegação e rotas protegidas.
- **Tailwind CSS**: estilização utilitária e responsiva.
- **Lucide React**: ícones da interface.
- **localStorage**: persistência local sem backend.

## Ferramentas de estilo e build

- **PostCSS**: pipeline de CSS.
- **Autoprefixer**: compatibilidade automática de propriedades CSS.
- **@tailwindcss/postcss**: integração do Tailwind v4 com PostCSS.

## Qualidade e padronização

- **ESLint**: linting de JavaScript/React.
- **.editorconfig**:
  - `utf-8`
  - `LF`
  - indentação com 2 espaços
  - newline no final do arquivo

## Convenções adotadas no projeto

- Componentes separados por responsabilidade.
- Funções de persistência centralizadas em `storage.js`.
- Reuso de `Modal` para feedback de erro/sucesso/confirm.
- Strings de interface em português.
- Layout responsivo com abordagem mobile-first.

## Scripts úteis

- `npm run dev`: roda ambiente de desenvolvimento.
- `npm run build`: gera build de produção.
- `npm run preview`: visualiza build localmente.
- `npm run lint`: verifica padrões de código.
