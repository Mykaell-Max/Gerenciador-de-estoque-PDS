CREATE TABLE IF NOT EXISTS Usuario(
	id SERIAL NOT NULL,
	nome VARCHAR(100) NOT NULL UNIQUE,
	senha VARCHAR(200) NOT NULL,
	email VARCHAR(100) NOT NULL UNIQUE,
	tipo CHAR(1) NOT NULL,
	data_inicio DATE NOT NULL,
	CONSTRAINT idpk PRIMARY KEY(id),
);

CREATE TABLE IF NOT EXISTS Produto(
	cod_prod INT NOT NULL,
	nome VARCHAR(50) NOT NULL,
	desc VARCHAR(100) NOT NULL,
	lote INT NOT NULL,
	qtd INT DEFAULT 0,
	CONSTRAINT codprodpk PRIMARY KEY(cod_prod),
);
-- Resenha para fornecedor


INSERT INTO Usuario VALUES(1, 'admin', 'PDS20261', 'trabalhopdsufu@gmail.com', 'E', '2026/07/01');
