# Conclusão

## Lições aprendidas

O desenvolvimento do Gerenciador de Estoque PDS proporcionou a prática concreta de diversas competências abordadas ao longo da disciplina de Processo de Desenvolvimento de Software.

**Metodologia Scrum na prática**

A experiência com Scrum foi o ponto central do aprendizado. Trabalhar com sprints de duração fixa, manter o backlog organizado no Jira, realizar plannings e reviews exigiu uma disciplina que vai além da programação em si. Ficou evidente que a qualidade do planejamento de uma sprint impacta diretamente a capacidade de entrega — sprints com histórias bem detalhadas e estimadas produziram resultados mais previsíveis.

**Rastreabilidade entre planejamento e execução**

A experiência com a história de bloqueio de usuários (`SCRUM-9`) — que foi implementada no código mas nunca movida no Jira — evidenciou a importância de manter o rastreamento do trabalho atualizado. Em projetos reais, código desenvolvido fora do fluxo rastreado gera inconsistências entre o que foi planejado, o que foi comprometido e o que realmente está funcionando. A lição é clara: qualquer trabalho feito deve estar refletido no board de gerenciamento.

**Separação de responsabilidades (frontend/backend)**

Desenvolver um sistema com frontend e backend separados, comunicando-se via API REST, exigiu cuidado com definição de contratos (endpoints, formatos de request/response) e com a configuração de CORS. A necessidade de coordenar mudanças nos dois lados simultaneamente reforçou a importância de uma API bem documentada e estável.

**Controle de acesso (RBAC)**

Implementar controle de acesso por perfil tanto no backend (via `requer_role` em `dependencias.py`) quanto no frontend (via `rbac.js` e `constants/roles.js`) ensinou que segurança precisa estar em múltiplas camadas — validar apenas no cliente não é suficiente.

**Operações transacionais**

O registro de venda, que exige baixa de estoque + criação de itens de venda em uma única transação atômica (com rollback em caso de erro), foi um exercício prático de consistência de dados em banco relacional. Esse tipo de lógica não aparece em tutoriais simples, e implementá-la com rollback correto foi um aprendizado relevante.

<!-- PLACEHOLDER: acrescente aqui outros pontos que o grupo considera que aprendeu — por exemplo: uso de variáveis de ambiente para configuração, deploy em Render/Vercel, trabalho em equipe no GitHub com pull requests, etc. -->

## Dificuldades encontradas

**Gestão do tempo e concentração de trabalho no final das sprints**

Os gráficos de burndown das Sprints 1, 2 e 4 mostram que a maior parte do trabalho foi registrada perto do fim do período, em vez de uma queda gradual ao longo da sprint. Isso indica que a estimativa e o registro de progresso no Jira aconteciam próximos à entrega, não durante a execução. Para sprints futuras, atualizar o Jira ao longo da semana (e não só no fechamento) tornaria o burndown um indicador mais útil de risco.

**Sprint 4 encurtada**

A última sprint teve apenas ~3 dias úteis (20 a 23/07), o que exigiu que as histórias selecionadas fossem de menor complexidade. Isso é uma consequência natural do cronograma, mas mostra que o buffer de tempo ao final de um projeto é reduzido — o que reforça a importância de entregar o máximo nas sprints anteriores.

**Coordenação entre o Jira e o código real**

Manter o board do Jira sincronizado com o progresso real do desenvolvimento foi um desafio constante. A equipe precisou adotar o hábito de mover cards, registrar horas e atualizar status — tarefas que parecem burocráticas, mas são essenciais para que o Scrum Master e o PO tenham visibilidade real do andamento do projeto.

<!-- PLACEHOLDER: descreva aqui outras dificuldades técnicas que o grupo encontrou — por exemplo: problemas de configuração do PostgreSQL, dificuldades com CORS, depuração de erros entre frontend e backend, dificuldades com deploy, etc. -->

---
Veja também: [Home](Home), [Requisitos](Requisitos), [Gestão do Projeto](Gestão-do-Projeto), [Análise e Projeto do Software](Análise-e-Projeto-do-Software), [Testes e Qualidade](Testes-e-Qualidade), [DevOps](DevOps).
