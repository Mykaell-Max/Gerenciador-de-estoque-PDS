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
    cursor.close()
    conn.close()
