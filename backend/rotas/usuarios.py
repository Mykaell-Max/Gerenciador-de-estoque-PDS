from fastapi import APIRouter, Depends, HTTPException
from backend.models import DadosAtualizarRole
from backend.db import conn, cursor
from backend.dependencias import ROLES_VALIDOS, requer_role, get_user_name, registrar_log

router = APIRouter()


@router.get("/usuarios")
def listarUsuarios(role=requer_role("admin")):
    cursor.execute("SELECT id, nome, email, tipo, data_inicio FROM Usuario ORDER BY id")
    linhas = cursor.fetchall()
    return {
        "usuarios": [
            {"id": l[0], "nome": l[1], "email": l[2], "tipo": l[3], "data_inicio": str(l[4])}
            for l in linhas
        ]
    }


@router.put("/usuarios/{usuario_id}/role")
def atualizarRole(usuario_id: int, dados: DadosAtualizarRole, role=requer_role("admin"), nome_autor: str = Depends(get_user_name)):
    if dados.tipo not in ROLES_VALIDOS:
        raise HTTPException(status_code=400, detail="Perfil inválido.")
    cursor.execute("UPDATE Usuario SET tipo = %s WHERE id = %s", (dados.tipo, usuario_id))
    conn.commit()
    registrar_log(nome_autor, f"Atualizou perfil do usuário ID {usuario_id} para '{dados.tipo}'")
    return {"message": "Perfil atualizado com sucesso."}
