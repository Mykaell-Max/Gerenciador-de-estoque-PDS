import config
from backend.conexao import conectar 

def inicializar_banco():
    database = "estoquedb"
    conn = conectar("postgres")
    conn.autocommit = True
    cursor = conn.cursor()

    cursor.execute(
        "SELECT 1 FROM pg_database WHERE datname = %s",
        (database,)
    )

    existe = cursor.fetchone()

    if not existe:
        cursor.execute(f"CREATE DATABASE {database}")

    cursor.close()
    conn.close()

    conn = conectar(database)
    cursor = conn.cursor()

    with open(config.BACKEND/"schema.sql", "r", encoding = "utf-8") as arquivo:
        codigo_sql = arquivo.read()

    cursor.execute(codigo_sql)
    conn.commit()

    cursor.close()
    conn.close()

    #print("Conexao efetuada com sucesso!")



