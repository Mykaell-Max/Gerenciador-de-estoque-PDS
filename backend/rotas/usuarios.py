from fastapi import APIRouter, Depends, HTTPException
from backend.models import DadosAtualizarRole, DadosBloqueio
from backend.dependencias import ROLES_VALIDOS, get_db, requer_role, get_user_name, registrar_log

router = APIRouter()


@router.get("/usuarios")
def listarUsuarios(role=requer_role("admin"), db=Depends(get_db)):
    conn, cursor = db
    cursor.execute(
        "SELECT id, nome, email, tipo, data_inicio, bloqueado, motivo_bloqueio, data_desbloqueio FROM Usuario ORDER BY id"
    )
    linhas = cursor.fetchall()
    return {
        "usuarios": [
            {
                "id": l[0],
                "nome": l[1],
                "email": l[2],
                "tipo": l[3],
                "data_inicio": str(l[4]),
                "bloqueado": bool(l[5]),
                "motivo_bloqueio": l[6],
                "data_desbloqueio": str(l[7]) if l[7] else None,
            }
            for l in linhas
        ]
    }


@router.put("/usuarios/{usuario_id}/role")
def atualizarRole(usuario_id: int, dados: DadosAtualizarRole, role=requer_role("admin"), nome_autor: str = Depends(get_user_name), db=Depends(get_db)):
    conn, cursor = db
    if dados.tipo not in ROLES_VALIDOS:
        raise HTTPException(status_code=400, detail="Perfil inválido.")
    cursor.execute("UPDATE Usuario SET tipo = %s WHERE id = %s", (dados.tipo, usuario_id))
    conn.commit()
    registrar_log(nome_autor, f"Atualizou perfil do usuário ID {usuario_id} para '{dados.tipo}'")
    return {"message": "Perfil atualizado com sucesso."}


@router.put("/usuarios/{usuario_id}/bloquear")
def bloquearUsuario(usuario_id: int, dados: DadosBloqueio, role=requer_role("admin"), nome_autor: str = Depends(get_user_name), db=Depends(get_db)):
    conn, cursor = db
    cursor.execute("SELECT nome FROM Usuario WHERE id = %s", (usuario_id,))
    linha = cursor.fetchone()
    if linha is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    cursor.execute(
        "UPDATE Usuario SET bloqueado = TRUE, motivo_bloqueio = %s, data_desbloqueio = %s WHERE id = %s",
        (dados.motivo, dados.data_desbloqueio, usuario_id)
    )
    conn.commit()
    registrar_log(nome_autor, f"Bloqueou usuário '{linha[0]}' (ID {usuario_id}). Motivo: {dados.motivo}")
    return {"message": "Usuário bloqueado com sucesso."}


@router.put("/usuarios/{usuario_id}/desbloquear")
def desbloquearUsuario(usuario_id: int, role=requer_role("admin"), nome_autor: str = Depends(get_user_name), db=Depends(get_db)):
    conn, cursor = db
    cursor.execute("SELECT nome FROM Usuario WHERE id = %s", (usuario_id,))
    linha = cursor.fetchone()
    if linha is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    cursor.execute(
        "UPDATE Usuario SET bloqueado = FALSE, motivo_bloqueio = NULL, data_desbloqueio = NULL WHERE id = %s",
        (usuario_id,)
    )
    conn.commit()
    registrar_log(nome_autor, f"Desbloqueou usuário '{linha[0]}' (ID {usuario_id})")
    return {"message": "Usuário desbloqueado com sucesso."}
