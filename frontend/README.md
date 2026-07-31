# Frontend – Gerenciador de Estoque PDS

Interface web do sistema de gestão de estoque, desenvolvida em React 19 com Vite e Tailwind CSS.

> Para executar o sistema completo (frontend + backend), use os scripts na raiz do repositório. Consulte o [README principal](../README.md).

## Tecnologias

- [React 19](https://react.dev/)
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## Pré-requisitos

- [Node.js 18+](https://nodejs.org/)

## Instalação

```bash
npm install
```

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento em `http://localhost:5173` |
| `npm run build` | Gera o build de produção em `dist/` |
| `npm run preview` | Pré-visualiza o build de produção localmente |
| `npm run lint` | Executa o ESLint |

## Configuração da API

A URL da API é definida pela variável de ambiente `VITE_API_URL`.
Se não definida, o frontend aponta para a API em produção (`https://gerenciador-de-estoque-pds.onrender.com`).

Para usar uma API local, crie um arquivo `.env` na raiz desta pasta:

```env
VITE_API_URL=http://localhost:8000
```

## Telas e perfis de acesso

| Tela | Administrador | Estoque | Caixa |
|---|:---:|:---:|:---:|
| Login / Cadastro | ✅ | ✅ | ✅ |
| Dashboard | ✅ | ✅ | ✅ |
| Estoque | ✅ | ✅ | ❌ |
| Caixa | ✅ | ❌ | ✅ |
| Usuários | ✅ | ❌ | ❌ |
| Logs de auditoria | ✅ | ❌ | ❌ |
