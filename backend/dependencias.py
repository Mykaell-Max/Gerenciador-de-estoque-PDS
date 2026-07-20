from fastapi import Header, HTTPException, Depends
import bcrypt
from backend.conexao import conectar

ROLES_VALIDOS = {"admin", "estoque", "caixa"}


def hash_senha(senha: str) -> str:
    return bcrypt.hashpw(senha.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verificar_senha(senha: str, hashed: str) -> bool:
    return bcrypt.checkpw(senha.encode("utf-8"), hashed.encode("utf-8"))


def get_db():
    conn = conectar("estoquedb")
    cursor = conn.cursor()
    cursor.execute("SET search_path TO Banco")
    try:
        yield conn, cursor
    except Exception:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()


def requer_role(*roles_permitidos):
    def check(x_user_role: str = Header(None)):
        if x_user_role not in roles_permitidos:
            raise HTTPException(status_code=403, detail="Acesso negado.")
        return x_user_role
    return Depends(check)


def get_user_name(x_user_name: str = Header(None)):
    return x_user_name or "desconhecido"


def registrar_log(usuario_nome: str, acao: str):
    _conn = conectar("estoquedb")
    _cur = _conn.cursor()
    try:
        _cur.execute(
            "INSERT INTO Banco.LogAuditoria(usuario_nome, acao, data_hora) VALUES (%s, %s, NOW())",
            (usuario_nome, acao)
        )
        _conn.commit()
    except Exception:
        _conn.rollback()
        raise
    finally:
        _cur.close()
        _conn.close()
