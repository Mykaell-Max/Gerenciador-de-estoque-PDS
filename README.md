# Gerenciador de Estoque PDS

Sistema web de gestão de estoque e ponto de venda voltado para supermercados. Desenvolvido como trabalho final da disciplina de **Processo de Desenvolvimento de Software** (Bacharelado em Sistemas de Informação).

> **Documentação completa:** [Wiki do projeto](../../wiki)

---

## Sobre o sistema

O sistema permite:

- Cadastrar, editar e remover produtos (código, nome, descrição, lote, quantidade e preço)
- Registrar entradas e saídas de estoque com histórico completo de movimentações
- Registrar vendas no caixa com carrinho, desconto, múltiplas formas de pagamento e emissão de comprovante
- Gerenciar usuários com controle de acesso por perfil (Administrador, Estoque e Caixa)
- Auditar o uso do sistema via log de ações
- Visualizar dashboard com KPIs e gráficos de vendas e movimentações

## Tecnologias

| Camada | Tecnologias |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS |
| Backend | Python, FastAPI, Uvicorn |
| Banco de dados | PostgreSQL |
| Gestão do projeto | Jira (Scrum) |

## Equipe

| Integrante | Papel |
|---|---|
| Mateus | Product Owner |
| Guilherme | Scrum Master |
| Mykaell | Desenvolvedor |
| Flávio | Desenvolvedor |
| Gabriel | Desenvolvedor |

## Estrutura do repositório

```
├── backend/          # API REST em Python/FastAPI
│   ├── rotas/        # Endpoints organizados por domínio
│   ├── models.py     # Modelos Pydantic (contratos da API)
│   ├── dependencias.py  # RBAC, hash de senha, log de auditoria
│   ├── schema.sql    # Schema do banco de dados
│   └── requirements.txt
├── frontend/         # SPA em React + Vite
│   └── src/
│       ├── screens/      # Telas da aplicação
│       ├── components/   # Componentes reutilizáveis
│       └── services/     # Integração com a API
├── wiki/             # Documentação do projeto (espelhada da GitHub Wiki)
├── install.py        # Script de instalação
└── run.py            # Script de execução
```

## Como executar localmente

### Pré-requisitos

- [Python 3.10+](https://python.org/)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/download/)

> Por padrão, o sistema conecta ao PostgreSQL com usuário `postgres` e senha vazia.
> Para usar outra senha, edite a variável `password` em `backend/conexao.py` antes de instalar.

### Instalação

```bash
python install.py
```

Esse comando cria o ambiente virtual Python, instala as dependências do backend e do frontend, e inicializa o banco de dados.

### Execução

```bash
python run.py
```

O sistema abrirá automaticamente em `http://localhost:5173`.
A API ficará disponível em `http://localhost:8000`.

## Documentação

A documentação completa do projeto está na [Wiki](../../wiki), organizada nas seguintes seções:

- **[Home](../../wiki/Home)** — Descrição geral do sistema, motivação e prints das telas
- **[Requisitos](../../wiki/Requisitos)** — Histórias de usuário, requisitos não-funcionais e status de entrega
- **[Gestão do Projeto](../../wiki/Gestão-do-Projeto)** — Metodologia Scrum, papéis da equipe, sprints e backlog
- **[Análise e Projeto do Software](../../wiki/Análise-e-Projeto-do-Software)** — Arquitetura, diagramas UML e fluxos do sistema
