CREATE SCHEMA IF NOT EXISTS Banco;
SET search_path TO Banco;

CREATE TABLE IF NOT EXISTS Usuario(
	id SERIAL NOT NULL,
	nome VARCHAR(100) NOT NULL UNIQUE,
	senha VARCHAR(200) NOT NULL,
	email VARCHAR(100) NOT NULL UNIQUE,
	tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('admin', 'estoque', 'caixa')),
	data_inicio DATE NOT NULL,
	CONSTRAINT idpk PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS Produto(
	cod_prod INT NOT NULL,
	nome VARCHAR(50) NOT NULL,
	descricao VARCHAR(100) NOT NULL,
	lote INT NOT NULL,
	qtd INT DEFAULT 0,
	CONSTRAINT codprodpk PRIMARY KEY(cod_prod)
);

CREATE TABLE IF NOT EXISTS MovimentacaoEstoque(
	id SERIAL NOT NULL,
	cod_prod INT NOT NULL,
	tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('entrada', 'saida')),
	quantidade INT NOT NULL,
	usuario_nome VARCHAR(100) NOT NULL,
	data_hora TIMESTAMP NOT NULL DEFAULT NOW(),
	CONSTRAINT movimentacaopk PRIMARY KEY(id),
	CONSTRAINT movimentacaoprodfk FOREIGN KEY(cod_prod) REFERENCES Produto(cod_prod) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS LogAuditoria(
	id SERIAL NOT NULL,
	usuario_nome VARCHAR(100) NOT NULL,
	acao VARCHAR(255) NOT NULL,
	data_hora TIMESTAMP NOT NULL DEFAULT NOW(),
	CONSTRAINT logpk PRIMARY KEY(id)
);

-- SCRUM-9: Bloqueio temporário de usuário
ALTER TABLE Usuario ADD COLUMN IF NOT EXISTS bloqueado BOOLEAN DEFAULT FALSE;
ALTER TABLE Usuario ADD COLUMN IF NOT EXISTS motivo_bloqueio VARCHAR(255);
ALTER TABLE Usuario ADD COLUMN IF NOT EXISTS data_desbloqueio DATE;

-- SCRUM-15: Estoque antes/depois na movimentação
ALTER TABLE MovimentacaoEstoque ADD COLUMN IF NOT EXISTS estoque_anterior INT;
ALTER TABLE MovimentacaoEstoque ADD COLUMN IF NOT EXISTS estoque_posterior INT;

-- SCRUM-16/20: Preço do produto
ALTER TABLE Produto ADD COLUMN IF NOT EXISTS preco DECIMAL(10,2) DEFAULT 0;

-- SCRUM-16: Tabela de vendas
CREATE TABLE IF NOT EXISTS Venda(
	id SERIAL NOT NULL,
	usuario_nome VARCHAR(100) NOT NULL,
	data_hora TIMESTAMP NOT NULL DEFAULT NOW(),
	subtotal DECIMAL(10,2) NOT NULL,
	desconto DECIMAL(10,2) DEFAULT 0,
	total DECIMAL(10,2) NOT NULL,
	forma_pagamento VARCHAR(20) NOT NULL,
	CONSTRAINT vendapk PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS ItemVenda(
	id SERIAL NOT NULL,
	venda_id INT NOT NULL,
	cod_prod INT NOT NULL,
	nome_prod VARCHAR(50) NOT NULL,
	quantidade INT NOT NULL,
	preco_unitario DECIMAL(10,2) NOT NULL,
	subtotal DECIMAL(10,2) NOT NULL,
	CONSTRAINT itemvendapk PRIMARY KEY(id),
	CONSTRAINT itemvendafk FOREIGN KEY(venda_id) REFERENCES Venda(id) ON DELETE CASCADE
);

