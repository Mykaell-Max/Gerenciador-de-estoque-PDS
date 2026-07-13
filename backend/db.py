from backend.conexao import conectar
from backend.init_db import inicializar_banco

inicializar_banco()

conn = conectar("estoquedb")
cursor = conn.cursor()
cursor.execute("SET search_path TO Banco")
conn.commit()
