import psycopg2

def conectar(database):
    host = "localhost"
    port = "5432"
    user = "postgres"
    password = ""
    return psycopg2.connect(
        dbname = database,
        port = port,
        user = user,
        password = password,
        host = host,
    )