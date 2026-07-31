# Testes e Qualidade

## Estratégia de testes

O projeto não adotou testes automatizados (unitários ou de integração) como parte do fluxo de desenvolvimento. A validação do software foi realizada de forma manual ao longo de cada sprint, com foco em garantir que as histórias entregues funcionassem corretamente antes do fechamento do sprint.

## Como o software foi testado

A cada sprint, os desenvolvedores testavam manualmente as funcionalidades implementadas diretamente no sistema em execução local, seguindo os critérios de aceitação definidos nas histórias do Jira. Os principais fluxos verificados foram:

- **Autenticação:** login com credenciais válidas e inválidas, comportamento para usuário bloqueado, redirecionamento por perfil (admin, estoque, caixa).
- **Estoque:** cadastro de produto com dados válidos e inválidos (validações de código, lote, quantidade e preço), edição, remoção e busca.
- **Movimentações:** registro de entrada e saída com verificação do estoque atualizado após cada operação.
- **Caixa:** montagem de carrinho com múltiplos itens, aplicação de desconto, escolha de forma de pagamento, cancelamento de venda e emissão de comprovante.
- **Usuários:** alteração de perfil, bloqueio com motivo e data de desbloqueio, desbloqueio automático no login.
- **Dashboard:** verificação dos KPIs e dos gráficos de vendas e movimentações com dados reais inseridos durante os testes.
- **Logs:** confirmação de que as ações de escrita geravam registros corretos no log de auditoria.

## Ferramentas utilizadas

- **Navegador** (Chrome/Firefox): testes manuais de interface e fluxos de usuário.
- **Swagger UI** (`/docs` do FastAPI): validação dos endpoints da API de forma isolada, sem depender do frontend.
- **Endpoint `/health`**: verificação do status da API e da conexão com o banco de dados em produção.

## Cobertura de testes

Por não ter sido adotada uma suíte de testes automatizados, não há métrica formal de cobertura de código. A cobertura funcional foi garantida pela execução manual dos fluxos críticos descritos acima antes de cada entrega de sprint.

---
Veja também: [Home](Home), [Requisitos](Requisitos), [Gestão do Projeto](Gestão-do-Projeto), [Análise e Projeto do Software](Análise-e-Projeto-do-Software), [DevOps](DevOps), [Conclusão](Conclusão).
