# Gerenciador de Estoque PDS

<!-- PLACEHOLDER: adicione aqui a logo do sistema (ex: ![Logo](./images/logo.png)) -->

## O que é o sistema

O **Gerenciador de Estoque PDS** é um sistema web de gestão de estoque e ponto de venda voltado para supermercados. Ele permite:

- Cadastrar, editar, consultar e remover produtos (código, nome, descrição, lote, quantidade e preço);
- Registrar entradas e saídas de estoque, com histórico completo de movimentações (quantidade, usuário responsável e estoque antes/depois de cada operação);
- Registrar vendas no caixa, com carrinho de itens, desconto, múltiplas formas de pagamento (dinheiro, crédito, débito, PIX), cancelamento antes da finalização e emissão de comprovante;
- Gerenciar usuários e permissões por perfil: **Administrador**, **Estoque** e **Caixa**, cada um com acesso a telas e ações específicas;
- Bloquear/desbloquear usuários temporariamente, com motivo e data de desbloqueio opcional;
- Auditar o uso do sistema através de um log de ações (quem fez o quê e quando);
- Visualizar um dashboard com indicadores (produtos em estoque, valor em estoque, produtos sem estoque, vendas e faturamento do dia/total, produtos com baixo estoque, produtos mais movimentados) e gráficos de vendas e movimentações dos últimos dias.

O sistema é composto por um frontend em React (Vite + Tailwind CSS) e uma API backend em Python (FastAPI), com persistência em PostgreSQL.

## Motivação

<!-- PLACEHOLDER: escreva aqui, em 1-2 parágrafos, por que o grupo escolheu desenvolver este software.
Sugestões de pontos a cobrir:
- Por que um sistema de gestão de estoque para supermercados (problema real, familiaridade com o domínio, etc.)?
- O que motivou tecnicamente (aprender FastAPI + React, praticar RBAC, praticar Scrum, etc.)?
- Alguma experiência pessoal/profissional que inspirou o tema?
-->

## Telas do sistema

**Login**

![Tela de login](images/print-login.png)

**Cadastro de conta**

![Tela de criação de conta, com escolha de perfil Estoque ou Caixa](images/print-cadastro-conta.png)

**Dashboard** (visão do Administrador)

![Dashboard com KPIs e gráficos](images/print-dashboard.png)

**Estoque: cadastro de produto**

![Cadastro de produto](images/print-estoque-cadastro.png)

**Estoque: lista de produtos**

![Lista de produtos em estoque](images/print-estoque-lista.png)

**Caixa: registrar venda**

![Tela de caixa com carrinho](images/print-caixa.png)

**Usuários: gestão de perfis e bloqueio**

![Lista de usuários, com um bloqueado](images/print-usuarios.png)

**Logs de auditoria**

![Logs de auditoria do sistema](images/print-logs.png)

<!-- PLACEHOLDER: falta o print do Comprovante de venda gerado no Caixa (CashierScreen.jsx), opcional, mas complementa bem esta seção. -->

## Perfis de acesso

| Perfil | Telas acessíveis |
|---|---|
| Administrador | Dashboard, Estoque, Caixa, Usuários, Logs |
| Estoque | Dashboard, Estoque |
| Caixa | Dashboard, Caixa |

---
Veja também: [Requisitos](Requisitos), [Gestão do Projeto](Gestão-do-Projeto), [Análise e Projeto do Software](Análise-e-Projeto-do-Software).
