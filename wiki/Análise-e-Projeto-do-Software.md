# Análise e Projeto do Software

## Projeto Arquitetural

O sistema segue uma arquitetura **cliente-servidor em três camadas**:

1. **Frontend (cliente):** Single Page Application em React 19, com Vite como bundler e Tailwind CSS para estilização. Consome a API via HTTP/JSON.
2. **Backend (servidor de aplicação):** API REST em Python com FastAPI, organizada em roteadores por domínio. Responsável pelas regras de negócio, validação e controle de acesso (RBAC).
3. **Banco de dados:** PostgreSQL, acessado via `psycopg2`, com o schema definido em [schema.sql](backend/schema.sql).

A autenticação/autorização é feita de forma simplificada: no login (`POST /login`), o backend valida usuário/senha (hash bcrypt) e retorna o nome e o perfil (`tipo`) do usuário. O frontend guarda essa sessão em `localStorage` e, a partir daí, envia o perfil e o nome do usuário em cada requisição via headers HTTP customizados (`x-user-role`, `x-user-name`; ver [api.js](frontend/src/services/api.js)). O backend usa esses headers para autorizar cada endpoint (`requer_role` em [dependencias.py](backend/dependencias.py)) e para registrar o autor de cada ação no log de auditoria.

<!-- PLACEHOLDER: se o grupo considerar esse mecanismo um risco de segurança (headers não são assinados/criptografados, podendo ser forjados pelo cliente), documente aqui como um ponto de melhoria futura (ex.: migrar para JWT). -->

```mermaid
flowchart LR
    subgraph Cliente["Frontend (React + Vite)"]
        UI["Telas: Login, Dashboard,\nEstoque, Caixa, Usuários, Logs"]
        SVC["services/api.js\nservices/rbac.js"]
        UI --> SVC
    end

    subgraph Servidor["Backend (FastAPI)"]
        MW["CORS Middleware"]
        DEP["dependencias.py\n(RBAC, hash de senha,\nlog de auditoria, sessão de DB)"]
        R1["rotas/auth.py"]
        R2["rotas/usuarios.py"]
        R3["rotas/produtos.py"]
        R4["rotas/movimentacoes.py"]
        R5["rotas/vendas.py"]
        R6["rotas/dashboard.py"]
        R7["rotas/logs.py"]
        MW --> R1 & R2 & R3 & R4 & R5 & R6 & R7
        R1 & R2 & R3 & R4 & R5 & R6 & R7 --> DEP
    end

    subgraph Dados["PostgreSQL"]
        DB[("Schema Banco:\nUsuario, Produto,\nMovimentacaoEstoque,\nVenda, ItemVenda,\nLogAuditoria")]
    end

    SVC -- "HTTP/JSON\n(x-user-role, x-user-name)" --> MW
    DEP -- "psycopg2" --> DB
```

## Projeto de Componentes

### Backend: módulos

| Módulo | Responsabilidade |
|---|---|
| [main.py](backend/main.py) | Ponto de entrada da aplicação FastAPI; registra middlewares (CORS) e roteadores; expõe `/health`. |
| [conexao.py](backend/conexao.py) / [db.py](backend/db.py) / [init_db.py](backend/init_db.py) | Conexão com o PostgreSQL e inicialização do schema. |
| [models.py](backend/models.py) | Modelos Pydantic de entrada/saída (contratos da API): `DadosLogin`, `DadosCadastro`, `DadosProduto`, `DadosAtualizarProduto`, `DadosAtualizarRole`, `DadosMovimentacao`, `DadosBloqueio`, `DadosItemVenda`, `DadosVenda`. |
| [dependencias.py](backend/dependencias.py) | Funções transversais: hash/verificação de senha (bcrypt), obtenção de conexão de banco por requisição, checagem de perfil (`requer_role`), identificação do usuário autor (`get_user_name`) e registro de log de auditoria (`registrar_log`). |
| [rotas/auth.py](backend/rotas/auth.py) | Login, autocadastro (`/registrar`) e cadastro por admin (`/cadastrar`). |
| [rotas/usuarios.py](backend/rotas/usuarios.py) | Listagem de usuários, alteração de perfil, bloqueio e desbloqueio. |
| [rotas/produtos.py](backend/rotas/produtos.py) | CRUD de produtos e busca. |
| [rotas/movimentacoes.py](backend/rotas/movimentacoes.py) | Registro e histórico (com filtros/paginação) de entradas e saídas de estoque. |
| [rotas/vendas.py](backend/rotas/vendas.py) | Registro de venda (com baixa transacional de estoque) e consulta de venda por id (para o comprovante). |
| [rotas/dashboard.py](backend/rotas/dashboard.py) | Agregações para KPIs e séries temporais (vendas e movimentações dos últimos 7 dias, produtos com baixo estoque, mais movimentados). |
| [rotas/logs.py](backend/rotas/logs.py) | Consulta do log de auditoria. |
| [schema.sql](backend/schema.sql) | Modelo de dados relacional: `Usuario`, `Produto`, `MovimentacaoEstoque`, `LogAuditoria`, `Venda`, `ItemVenda`. |

### Frontend: módulos

| Módulo | Responsabilidade |
|---|---|
| [App.jsx](frontend/src/App.jsx) | Controle de sessão (login/logout) e roteamento simples entre Login, Cadastro e Dashboard. |
| screens/login, screens/register | Autenticação e autocadastro de conta. |
| [screens/dashboard](frontend/src/screens/dashboard) | Layout principal pós-login (Dashboard.jsx = shell com menu; DashboardScreen.jsx = KPIs e gráficos). |
| [screens/stock/StockScreen.jsx](frontend/src/screens/stock/StockScreen.jsx) | Cadastro, edição, remoção e movimentação de produtos; histórico de movimentações. |
| [screens/cashier/CashierScreen.jsx](frontend/src/screens/cashier/CashierScreen.jsx) | Carrinho de venda, cálculo de total, cancelamento e emissão de comprovante. |
| [screens/users/UsersScreen.jsx](frontend/src/screens/users/UsersScreen.jsx) | Gestão de usuários: alteração de perfil, bloqueio/desbloqueio. |
| [screens/logs/LogsScreen.jsx](frontend/src/screens/logs/LogsScreen.jsx) | Visualização do log de auditoria. |
| [components/layout](frontend/src/components/layout) | `Header`, `Sidebar`, `MobileDrawer`: casca visual e navegação responsiva. |
| [components/ConfirmDialog.jsx](frontend/src/components/ConfirmDialog.jsx), [Feedback.jsx](frontend/src/components/Feedback.jsx), [Field.jsx](frontend/src/components/Field.jsx) | Componentes de UI reutilizáveis (confirmação de ação, mensagens de sucesso/erro, campo de formulário). |
| [services/api.js](frontend/src/services/api.js) | Cliente HTTP central (injeta headers de RBAC, trata erros). |
| [services/rbac.js](frontend/src/services/rbac.js) | Regras de exibição/permissão de menu no cliente, a partir de `constants/roles.js`. |
| [constants/roles.js](frontend/src/constants/roles.js) | Definição dos perfis e do menu por perfil. |
| [utils/format.js](frontend/src/utils/format.js) | Formatação (ex.: valores em BRL). |

### Diagrama de Componentes

```mermaid
flowchart TB
    subgraph FE["«component» Frontend - SPA React"]
        direction TB
        FE_screens["«component» Screens\nLogin · Dashboard · Estoque\nCaixa · Usuários · Logs"]
        FE_components["«component» UI Components\nHeader · Sidebar · MobileDrawer\nConfirmDialog · Feedback · Field"]
        FE_services["«component» Services\napi.js · rbac.js"]
        FE_constants["«component» Constants/Utils\nroles.js · format.js"]
        FE_screens --> FE_components
        FE_screens --> FE_services
        FE_services --> FE_constants
    end

    subgraph BE["«component» Backend - API FastAPI"]
        direction TB
        BE_routes["«component» Rotas\nauth · usuarios · produtos\nmovimentacoes · vendas\ndashboard · logs"]
        BE_core["«component» Núcleo transversal\ndependencias.py\n(RBAC, hash, log, sessão DB)"]
        BE_models["«component» Modelos\nmodels.py (contratos Pydantic)"]
        BE_conn["«component» Conexão\nconexao.py / db.py / init_db.py"]
        BE_routes --> BE_core
        BE_routes --> BE_models
        BE_core --> BE_conn
    end

    subgraph DB["«component» Banco de Dados"]
        BD_schema[("schema.sql\nUsuario · Produto · MovimentacaoEstoque\nVenda · ItemVenda · LogAuditoria")]
    end

    FE_services -- "interface: HTTP/JSON\nheaders x-user-role, x-user-name" --> BE_routes
    BE_conn -- "interface: SQL (psycopg2)" --> BD_schema
```

### Diagrama de Pacotes

```mermaid
flowchart TB
    subgraph frontend_pkg["pacote frontend/src"]
        direction LR
        p_screens["pacote screens"]
        p_components["pacote components"]
        p_services["pacote services"]
        p_constants["pacote constants"]
        p_utils["pacote utils"]
    end

    subgraph backend_pkg["pacote backend"]
        direction LR
        p_rotas["pacote rotas"]
        p_root["módulos raiz\nmain · models\ndependencias · conexao"]
    end

    p_screens -.->|«import»| p_services
    p_screens -.->|«import»| p_components
    p_screens -.->|«import»| p_utils
    p_services -.->|«import»| p_constants

    p_rotas -.->|«import»| p_root

    frontend_pkg -. "HTTP/JSON" .-> backend_pkg
```

### Diagrama de Classes (modelo de domínio)

Baseado no schema relacional ([schema.sql](backend/schema.sql)). As referências entre `Usuario` e `MovimentacaoEstoque`/`Venda`/`LogAuditoria` são feitas por **cópia do nome** (`usuario_nome`), não por chave estrangeira. Por isso aparecem como dependência (`..>`), não como associação forte. O mesmo vale para `ItemVenda → Produto` (o item de venda guarda uma cópia de `nome_prod`/`preco_unitario` no momento da compra, sem FK, para preservar o histórico caso o produto mude de preço depois).

```mermaid
classDiagram
    class Usuario {
        +int id
        +string nome
        +string senha_hash
        +string email
        +string tipo
        +date data_inicio
        +bool bloqueado
        +string motivo_bloqueio
        +date data_desbloqueio
    }

    class Produto {
        +int cod_prod
        +string nome
        +string descricao
        +int lote
        +int qtd
        +decimal preco
    }

    class MovimentacaoEstoque {
        +int id
        +string tipo
        +int quantidade
        +datetime data_hora
        +int estoque_anterior
        +int estoque_posterior
    }

    class Venda {
        +int id
        +datetime data_hora
        +decimal subtotal
        +decimal desconto
        +decimal total
        +string forma_pagamento
    }

    class ItemVenda {
        +int id
        +string nome_prod
        +int quantidade
        +decimal preco_unitario
        +decimal subtotal
    }

    class LogAuditoria {
        +int id
        +string acao
        +datetime data_hora
    }

    Produto "1" --> "many" MovimentacaoEstoque : registra
    Venda "1" *-- "many" ItemVenda : contém
    Produto ..> ItemVenda : referencia (sem FK)
    Usuario ..> MovimentacaoEstoque : autor
    Usuario ..> Venda : autor
    Usuario ..> LogAuditoria : autor
```

### Diagramas de Sequência (fluxos principais)

**Login, com verificação de bloqueio temporário:**

```mermaid
sequenceDiagram
    actor U as Usuário
    participant FE as LoginScreen
    participant API as api.js
    participant BE as auth.py
    participant DB as PostgreSQL

    U->>FE: informa usuário e senha
    FE->>API: api("/login", "POST", {usuario, senha})
    API->>BE: POST /login
    BE->>DB: SELECT senha, tipo, bloqueado, data_desbloqueio...
    DB-->>BE: dados do usuário
    alt senha incorreta ou usuário inexistente
        BE-->>API: 401 Usuário inexistente ou senha incorreta
    else bloqueado e data_desbloqueio no futuro
        BE-->>API: 403 Usuário bloqueado. Motivo + data de desbloqueio
    else bloqueado mas data_desbloqueio já passou
        BE->>DB: UPDATE Usuario SET bloqueado = FALSE
        BE-->>API: 200 {tipo, nome}
    else login válido
        BE-->>API: 200 {tipo, nome}
    end
    API-->>FE: resposta
    FE->>FE: salva sessão em localStorage
    FE-->>U: exibe Dashboard do perfil correspondente
```

**Registrar venda (caixa), com baixa de estoque transacional:**

```mermaid
sequenceDiagram
    actor C as Operador de Caixa
    participant FE as CashierScreen
    participant API as api.js
    participant BE as vendas.py
    participant DB as PostgreSQL

    C->>FE: monta carrinho e confirma forma de pagamento
    FE->>API: api("/vendas", "POST", {itens, desconto, forma_pagamento})
    API->>BE: POST /vendas (headers x-user-role, x-user-name)
    BE->>BE: valida forma de pagamento, desconto e itens
    loop para cada item do carrinho
        BE->>DB: SELECT qtd, preco FROM Produto WHERE cod_prod = ? FOR UPDATE
        DB-->>BE: estoque atual e preço
        BE->>BE: valida estoque suficiente
    end
    BE->>DB: INSERT INTO Venda (...) RETURNING id
    loop para cada item do carrinho
        BE->>DB: UPDATE Produto SET qtd = qtd - quantidade
        BE->>DB: INSERT INTO MovimentacaoEstoque (tipo='saida', ...)
        BE->>DB: INSERT INTO ItemVenda (...)
    end
    BE->>DB: COMMIT
    BE->>DB: INSERT INTO LogAuditoria (registrou venda)
    BE-->>API: 200 {venda_id, total}
    API-->>FE: resposta
    FE-->>C: exibe Comprovante de Venda
```

<!-- PLACEHOLDER: se quiser, adicione mais diagramas de sequência para outros fluxos relevantes (ex.: cadastro de produto, movimentação de estoque). -->

## Implantação

<!-- PLACEHOLDER: confirme onde cada parte está hospedada em produção. Indícios encontrados no código: frontend/src/services/api.js aponta por padrão para "https://gerenciador-de-estoque-pds.onrender.com" (Render); há um Procfile na raiz do projeto, típico de plataformas como Render/Heroku. Falta confirmar onde o frontend (build estático) e o PostgreSQL estão hospedados. -->

### Diagrama de Implantação

```mermaid
flowchart LR
    subgraph ClientNode["«device» Máquina do usuário"]
        Browser["«execution environment» Navegador"]
    end

    subgraph HostFE["«server» PLACEHOLDER: host do frontend"]
        FEArtifact["«artifact» build estático\n(Vite - npm run build)"]
    end

    subgraph HostBE["«server» Render"]
        BEArtifact["«artifact» API FastAPI\n(uvicorn, via Procfile)"]
    end

    subgraph HostDB["«server» PLACEHOLDER: host do PostgreSQL"]
        DBArtifact[("«database» PostgreSQL")]
    end

    Browser -- "HTTPS" --> FEArtifact
    Browser -- "HTTPS / JSON\nx-user-role, x-user-name" --> BEArtifact
    BEArtifact -- "TCP 5432\npsycopg2" --> DBArtifact
```

---
Veja também: [Home](Home), [Requisitos](Requisitos), [Gestão do Projeto](Gestão-do-Projeto).
