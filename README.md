# Gerenciador de Estoque PDS

Sistema web de gestão de estoque e ponto de venda para supermercados, desenvolvido como trabalho final da disciplina de Processo de Desenvolvimento de Software (Bacharelado em Sistemas de Informação).

## Acesso rápido

O sistema está publicado e pode ser usado sem instalar nada:

| | |
|---|---|
| **Aplicação** | https://gerenciador-de-estoque-pds.vercel.app |
| **API** | https://gerenciador-de-estoque-pds-k4ou.onrender.com |
| **Status da API** | https://gerenciador-de-estoque-pds-k4ou.onrender.com/health |
| **Documentação (Wiki)** | https://github.com/Mykaell-Max/Gerenciador-de-estoque-PDS/wiki |

**Credenciais de teste (perfil Administrador):**

```
usuário: admin
senha:   PDS20261
```

O perfil Administrador tem acesso a todas as telas. Pela tela de cadastro também é possível criar contas com os perfis Estoque e Caixa para testar as permissões de cada um.

> A API está hospedada em um plano gratuito da Render, que hiberna após um período sem uso. A primeira requisição pode levar cerca de 30 segundos para responder enquanto o serviço reinicia.

## Funcionalidades

- Cadastro, edição, consulta e remoção de produtos
- Registro de entradas e saídas de estoque, com histórico completo de movimentações e o saldo antes e depois de cada operação
- Venda no caixa, com carrinho, desconto, formas de pagamento (dinheiro, crédito, débito, PIX), cancelamento antes da finalização e emissão de comprovante
- Gestão de usuários e permissões por perfil (Administrador, Estoque e Caixa)
- Bloqueio e desbloqueio temporário de usuários, com motivo e data de desbloqueio
- Log de auditoria de todas as operações de escrita
- Dashboard com indicadores e gráficos de vendas e movimentações

## Tecnologias

**Frontend:** React 19, Vite, Tailwind CSS, Recharts
**Backend:** Python, FastAPI, Pydantic, psycopg2, bcrypt
**Banco de dados:** PostgreSQL

## Executando localmente

### Pré-requisitos

- [Python 3.11](https://python.org/) ou superior
- [Node.js 20](https://nodejs.org/) ou superior
- PostgreSQL, via Docker (mais simples) ou instalado na máquina

### 1. Subir o banco de dados

**Opção A: via Docker (recomendado)**

O arquivo `docker-compose.yml` já sobe o PostgreSQL com o usuário, a senha e a porta que o projeto espera:

```bash
docker compose up -d
```

**Opção B: PostgreSQL instalado na máquina**

O projeto usa por padrão a porta `5433`, o usuário `postgres` e a senha `postgres`. Se a sua instalação usa valores diferentes (a instalação padrão do PostgreSQL usa a porta `5432`), defina as variáveis de ambiente antes de executar:

```bash
DB_PORT=5432
DB_PASSWORD=sua_senha
```

No PowerShell, use `$env:DB_PORT = "5432"`.

### 2. Instalar as dependências

```bash
python install.py
```

O script cria o ambiente virtual do Python em `backend/venv`, instala as bibliotecas e prepara o banco (cria o schema e o usuário administrador padrão).

Em seguida, instale as dependências do frontend:

```bash
cd frontend
npm install
```

### 3. Apontar o frontend para a API local

Por padrão o frontend usa a API publicada. Para que ele use o backend rodando na sua máquina, crie o arquivo `frontend/.env`:

```
VITE_API_URL=http://127.0.0.1:8000
```

### 4. Executar

```bash
python run.py
```

O sistema abre em http://localhost:5173 e a API responde em http://127.0.0.1:8000.

**No Windows**, o `run.py` pode falhar ao iniciar o frontend (o script chama `npm` de uma forma que o Windows não resolve). Nesse caso, use o atalho `start.ps1`, que abre as duas janelas:

```powershell
.\start.ps1
```

Ou execute os dois serviços manualmente, em terminais separados:

```powershell
.\backend\venv\Scripts\python.exe -m uvicorn backend.main:app --reload
```

```powershell
cd frontend
npm run dev
```

## Variáveis de ambiente

Todas são opcionais em desenvolvimento; os valores padrão atendem ao ambiente local com Docker.

| Variável | Padrão | Descrição |
|---|---|---|
| `DATABASE_URL` | *(vazio)* | String de conexão completa. Quando definida, tem prioridade sobre as variáveis abaixo. Usada em produção. |
| `DB_HOST` | `localhost` | Endereço do banco |
| `DB_PORT` | `5433` | Porta do banco |
| `DB_USER` | `postgres` | Usuário do banco |
| `DB_PASSWORD` | `postgres` | Senha do banco |
| `ALLOWED_ORIGINS` | localhost e domínio de produção | Origens liberadas no CORS, separadas por vírgula |
| `VITE_API_URL` | API publicada | URL da API usada pelo frontend. Definir em `frontend/.env`. |

## Estrutura do projeto

```
backend/          API FastAPI
  rotas/          Endpoints por domínio (auth, usuarios, produtos,
                  movimentacoes, vendas, dashboard, logs)
  models.py       Contratos de entrada e saída (Pydantic)
  dependencias.py RBAC, hash de senha, conexão e log de auditoria
  schema.sql      Modelo de dados
frontend/         Aplicação React
  src/screens/    Telas por domínio
  src/services/   Cliente HTTP e regras de permissão
  src/components/ Componentes reutilizáveis
wiki/             Cópia local da documentação (a versão oficial é a Wiki do GitHub)
```

## Documentação

O relatório completo do projeto está na [Wiki do repositório](https://github.com/Mykaell-Max/Gerenciador-de-estoque-PDS/wiki):

- [Home](https://github.com/Mykaell-Max/Gerenciador-de-estoque-PDS/wiki/Home): visão geral, motivação e telas do sistema
- [Requisitos](https://github.com/Mykaell-Max/Gerenciador-de-estoque-PDS/wiki/Requisitos): histórias do projeto e requisitos não-funcionais
- [Gestão do Projeto](https://github.com/Mykaell-Max/Gerenciador-de-estoque-PDS/wiki/Gest%C3%A3o-do-Projeto): metodologia, papéis, sprints e números do projeto
- [Análise e Projeto do Software](https://github.com/Mykaell-Max/Gerenciador-de-estoque-PDS/wiki/An%C3%A1lise-e-Projeto-do-Software): arquitetura, componentes e diagramas
- [Conclusão](https://github.com/Mykaell-Max/Gerenciador-de-estoque-PDS/wiki/Conclus%C3%A3o): lições aprendidas e dificuldades encontradas

## Equipe

| Integrante | Papel |
|---|---|
| Mateus | Product Owner |
| Guilherme | Scrum Master |
| Mykaell | Desenvolvedor |
| Flávio | Desenvolvedor |
| Gabriel | Desenvolvedor |
