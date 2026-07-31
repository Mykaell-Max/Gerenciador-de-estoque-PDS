# Backend – Gerenciador de Estoque PDS

API REST do sistema de gestão de estoque, desenvolvida em Python com FastAPI e persistência em PostgreSQL.

> Para executar o sistema completo (frontend + backend), use os scripts na raiz do repositório. Consulte o [README principal](../README.md).

## Tecnologias

- [Python 3.10+](https://python.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Uvicorn](https://www.uvicorn.org/)
- [PostgreSQL](https://www.postgresql.org/) via `psycopg2`
- [bcrypt](https://pypi.org/project/bcrypt/) para hash de senhas
- [Pydantic](https://docs.pydantic.dev/) para validação de dados

## Pré-requisitos

- Python 3.10+
- PostgreSQL instalado e rodando

## Instalação manual

```bash
# Criar e ativar ambiente virtual
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/macOS

# Instalar dependências
pip install -r requirements.txt
```

## Execução

```bash
uvicorn backend.main:app --reload
```

A API ficará disponível em `http://localhost:8000`.
Documentação interativa (Swagger): `http://localhost:8000/docs`.

## Configuração

As configurações são feitas via variáveis de ambiente (arquivo `.env` na raiz do repositório):

| Variável | Descrição | Padrão |
|---|---|---|
| `ALLOWED_ORIGINS` | Origens permitidas no CORS (separadas por vírgula) | `http://localhost:5173,...` |
| `DB_PASSWORD` | Senha do banco de dados | `""` (vazia) |

## Endpoints principais

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/login` | Autenticação |
| `POST` | `/registrar` | Autocadastro de conta |
| `GET` | `/produtos` | Listar produtos |
| `POST` | `/cadastrarProduto` | Cadastrar produto |
| `PUT` | `/produtos/{cod}` | Editar produto |
| `DELETE` | `/produtos/{cod}` | Remover produto |
| `POST` | `/movimentacoes` | Registrar entrada/saída de estoque |
| `GET` | `/movimentacoes` | Histórico de movimentações |
| `POST` | `/vendas` | Registrar venda |
| `GET` | `/usuarios` | Listar usuários |
| `PUT` | `/usuarios/{id}/role` | Alterar perfil de usuário |
| `PUT` | `/usuarios/{id}/bloquear` | Bloquear usuário |
| `GET` | `/logs` | Log de auditoria |
| `GET` | `/dashboard` | KPIs e dados para gráficos |
| `GET` | `/health` | Status da API e do banco de dados |

## Estrutura

```
backend/
├── rotas/
│   ├── auth.py           # Login e cadastro
│   ├── usuarios.py       # Gestão de usuários
│   ├── produtos.py       # CRUD de produtos
│   ├── movimentacoes.py  # Entradas e saídas de estoque
│   ├── vendas.py         # Registro de vendas
│   ├── dashboard.py      # KPIs e séries temporais
│   └── logs.py           # Log de auditoria
├── main.py               # Ponto de entrada (FastAPI app)
├── models.py             # Modelos Pydantic
├── dependencias.py       # RBAC, hash, log de auditoria
├── conexao.py            # Conexão com o PostgreSQL
├── schema.sql            # Schema do banco de dados
└── requirements.txt
```
