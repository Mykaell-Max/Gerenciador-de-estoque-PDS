import os
import config
from backend.conexao import conectar

def inicializar_banco():
    database = "estoquedb"

    if os.getenv("DATABASE_URL"):
        conn = conectar(database)
    else:
        # Local: cria o banco se ainda não existir
        conn = conectar("postgres")
        conn.autocommit = True
        cursor = conn.cursor()
        cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", (database,))
        if not cursor.fetchone():
            cursor.execute(f"CREATE DATABASE {database}")
        cursor.close()
        conn.close()
        conn = conectar(database)

    cursor = conn.cursor()
    with open(config.BACKEND / "schema.sql", "r", encoding="utf-8") as arquivo:
        codigo_sql = arquivo.read()
    cursor.execute(codigo_sql)
    conn.commit()

    import bcrypt
    hashed = bcrypt.hashpw("PDS20261".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    cursor.execute(
        """
        INSERT INTO Banco.Usuario(nome, senha, email, tipo, data_inicio)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT(nome) DO UPDATE SET senha = EXCLUDED.senha
        WHERE Banco.Usuario.senha NOT LIKE '$2b$%%'
        """,
        ("admin", hashed, "trabalhopdsufu@gmail.com", "admin", "2026-07-01")
    )
    conn.commit()

    cursor.close()
    conn.close()
