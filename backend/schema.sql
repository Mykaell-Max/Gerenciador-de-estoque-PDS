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

CREATE TABLE IF NOT EXISTS LogAuditoria(
	id SERIAL NOT NULL,
	usuario_nome VARCHAR(100) NOT NULL,
	acao VARCHAR(255) NOT NULL,
	data_hora TIMESTAMP NOT NULL DEFAULT NOW(),
	CONSTRAINT logpk PRIMARY KEY(id)
);

INSERT INTO Usuario(nome, senha, email, tipo, data_inicio) VALUES('admin', 'PDS20261', 'trabalhopdsufu@gmail.com', 'admin', '2026/07/01')
ON CONFLICT DO NOTHING;
