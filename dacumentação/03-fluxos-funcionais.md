# 3. Fluxos Funcionais

## 3.1 Cadastro de usuário

1. Usuário acessa `/register`.
2. Informa nome, e-mail e senha.
3. Sistema valida:
   - campos obrigatórios;
   - duplicidade de e-mail.
4. Se válido:
   - salva novo usuário em `users`;
   - salva sessão em `currentUser`;
   - redireciona para `/products`.

## 3.2 Login

1. Usuário acessa `/login`.
2. Informa e-mail e senha.
3. Sistema valida:
   - e-mail existente;
   - senha correta.
4. Se válido:
   - atualiza `currentUser`;
   - redireciona para `/products`.

## 3.3 Proteção de rotas

- Rotas privadas:
  - `/products`
  - `/products/new`
  - `/products/:id/edit`
- Sem sessão ativa, o usuário é redirecionado para `/login`.

## 3.4 Cadastro de produto

1. Usuário acessa `/products/new`.
2. Preenche dados obrigatórios:
   - nome;
   - categoria;
   - preço;
   - quantidade;
   - descrição;
   - status.
3. URL de imagem é opcional (placeholder em caso vazio/erro).
4. Produto é salvo com `ownerEmail` do usuário logado.

## 3.5 Edição de produto

1. Usuário acessa `/products/:id/edit`.
2. Sistema busca o produto por ID.
3. Valida se o produto pertence ao usuário logado.
4. Salva alterações no mesmo registro.

## 3.6 Exclusão de produto

1. Usuário clica em **Excluir** no card.
2. Modal pede confirmação.
3. Confirmando, o produto é removido do `localStorage`.
4. Lista é atualizada em tela.

## 3.7 Busca, filtro e ordenação

- Busca textual por nome.
- Filtro por categoria.
- Ordenação por:
  - nome;
  - preço;
  - quantidade.
- Direção:
  - crescente;
  - decrescente.

## 3.8 Experiência com imagens

- Card com proporção fixa para padronização visual.
- Imagem completa no card (`object-contain`).
- Clique para abrir visualizador ampliado (lightbox).
- Zoom no visualizador:
  - botões na interface;
  - roda do mouse;
  - gesto de pinça em telas touch.

## 3.9 Estados vazios

- Sem produtos: mensagem central com CTA para criar o primeiro item.
- Sem resultados nos filtros: mensagem específica.
- Tentativa de exclusão sem itens: modal informativo.
