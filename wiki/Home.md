# Gerenciador de Estoque PDS

![Logo](images/logo.png)

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

A escolha do tema foi influenciada pela experiência prática de um dos membros do grupo, que já havia trabalhado profissionalmente com um sistema de gestão de estoque. Esse contato direto com o domínio permitiu ao grupo entender de forma realista quais funcionalidades são essenciais em um sistema desse tipo, tornando o levantamento de requisitos mais assertivo e fundamentado em necessidades reais.

O recorte para supermercados foi deliberado: o modelo de negócio de um supermercado envolve múltiplos perfis de usuário com responsabilidades distintas (administração, operação de estoque e caixa), o que tornava o projeto um desafio consistente e adequado para praticar controle de acesso baseado em papéis (RBAC) — um dos conceitos centrais da disciplina. Ao mesmo tempo, o escopo permanecia gerenciável dentro do tempo disponível, permitindo que o grupo se concentrasse na qualidade da implementação e na aplicação da metodologia Scrum, em vez de lidar com um domínio excessivamente complexo.

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
Veja também: [Requisitos](Requisitos), [Gestão do Projeto](Gestão-do-Projeto), [Análise e Projeto do Software](Análise-e-Projeto-do-Software), [Testes e Qualidade](Testes-e-Qualidade), [DevOps](DevOps), [Conclusão](Conclusão).
