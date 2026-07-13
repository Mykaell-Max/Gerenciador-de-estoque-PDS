import os
import psycopg2

def conectar(database):
    # Localmente, usa as variáveis individuais com fallback para os valores de dev.
    database_url = os.getenv("DATABASE_URL")
    if database_url:
        return psycopg2.connect(database_url)

    return psycopg2.connect(
        dbname=database,
        port=os.getenv("DB_PORT", "5433"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", "postgres"),
        host=os.getenv("DB_HOST", "localhost"),
    )
