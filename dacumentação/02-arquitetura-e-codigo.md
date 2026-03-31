# 2. Arquitetura e Código

## Estrutura de pastas (resumo)

```txt
src/
  components/
    Login.jsx
    Modal.jsx
    Navbar.jsx
    ProductForm.jsx
    ProductList.jsx
    ProtectedRoute.jsx
    Register.jsx
  utils/
    storage.js
  App.jsx
  main.jsx
  index.css
```

## Responsabilidade por arquivo

### `src/main.jsx`

- Ponto de entrada da aplicação.
- Renderiza `App` dentro de `BrowserRouter`.

### `src/App.jsx`

- Define as rotas públicas e protegidas.
- Exibe `Navbar` somente nas telas de produtos.
- Redireciona rota raiz conforme status de login.

### `src/components/ProtectedRoute.jsx`

- Bloqueia acesso a rotas privadas quando não há usuário logado.
- Usa `Navigate` para redirecionar para `/login`.

### `src/components/Register.jsx`

- Formulário de cadastro.
- Valida campos obrigatórios e e-mail duplicado.
- Salva usuário e sessão no `localStorage`.
- Mostra feedback com `Modal`.

### `src/components/Login.jsx`

- Formulário de login.
- Valida credenciais (e-mail e senha).
- Persiste sessão do usuário.
- Mensagens de sucesso/erro via `Modal`.

### `src/components/Navbar.jsx`

- Cabeçalho das páginas privadas.
- Exibe nome do usuário logado.
- Botão de logout com limpeza da sessão.

### `src/components/ProductList.jsx`

- Carrega produtos do usuário logado.
- Busca, filtro e ordenação.
- Cards de produto com imagem padronizada.
- Exclusão com confirmação.
- Estados vazios.
- Lightbox de imagem com zoom:
  - botões (`+`, `-`, reset);
  - scroll do mouse;
  - pinch em touch.

### `src/components/ProductForm.jsx`

- Formulário de criação/edição de produto.
- Validações:
  - obrigatórios;
  - preço > 0;
  - quantidade inteira >= 0.
- Preview da imagem.
- Visualização em tela cheia com zoom.

### `src/components/Modal.jsx`

- Componente reutilizável para mensagens e confirmações.
- Suporta tipos visuais: `info`, `success`, `error`.

### `src/utils/storage.js`

- Centraliza acesso ao `localStorage`.
- Funções de leitura/escrita:
  - usuários;
  - sessão;
  - produtos.
- Funções utilitárias:
  - categoria fixa;
  - formatador de preço BRL.

## Fluxo de dados

- O estado local dos formulários é controlado por `useState`.
- A persistência é feita por funções utilitárias em `storage.js`.
- As páginas leem e gravam os dados conforme ação do usuário.
- As mudanças refletem na UI de forma imediata.

## Padrões aplicados

- Componentização por responsabilidade.
- Rotas protegidas para segurança de navegação.
- Reuso de modal para feedback consistente.
- Estilo visual padronizado via Tailwind.
- Texto e código em UTF-8 com `.editorconfig`.
