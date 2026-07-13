from fastapi import APIRouter
from backend.dependencias import requer_role
from backend.conexao import conectar

router = APIRouter()


@router.get("/logs")
def listarLogs(role=requer_role("admin")):
    _conn = conectar("estoquedb")
    _cur = _conn.cursor()
    try:
        _cur.execute(
            "SELECT id, usuario_nome, acao, data_hora FROM Banco.LogAuditoria ORDER BY data_hora DESC"
        )
        linhas = _cur.fetchall()
    finally:
        _cur.close()
        _conn.close()
    return {
        "logs": [
            {"id": l[0], "usuario_nome": l[1], "acao": l[2], "data_hora": str(l[3])}
            for l in linhas
        ]
    }
