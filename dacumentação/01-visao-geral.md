# 1. Visão Geral

## Objetivo

Construir uma aplicação web para gerenciamento de produtos com autenticação simples de usuário, focada em:

- cadastro e login;
- listagem de produtos em cards;
- criação, edição e exclusão de produtos;
- filtros e ordenação;
- experiência visual moderna e responsiva.

## Escopo funcional

### Autenticação

- Cadastro (`/register`) com validação de e-mail duplicado.
- Login (`/login`) com validações:
  - e-mail inexistente;
  - senha incorreta.
- Login automático após cadastro.
- Logout com retorno à tela de login.
- Rotas protegidas para páginas de produtos.

### Produtos

- Listagem (`/products`) com:
  - imagem;
  - nome;
  - categoria;
  - preço;
  - quantidade;
  - descrição curta;
  - status.
- Cadastro (`/products/new`).
- Edição (`/products/:id/edit`).
- Exclusão com confirmação via modal.
- Busca por nome, filtro por categoria e ordenação por nome/preço/quantidade.

### Experiência do usuário

- Substituição de `alert()` por modais.
- Estados vazios com mensagem amigável.
- Placeholder quando imagem é inválida ou ausente.
- Lightbox para visualização ampliada da imagem.
- Zoom com botões, roda do mouse e gesto de pinça (touch).

## Persistência de dados

Todos os dados são armazenados no `localStorage`:

- usuários: `users`;
- sessão atual: `currentUser`;
- produtos: `products`.

## Público-alvo

- Projeto acadêmico / portfólio.
- Cenários de pequeno porte sem backend dedicado.
