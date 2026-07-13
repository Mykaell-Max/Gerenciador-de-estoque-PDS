from fastapi import APIRouter, Depends, HTTPException
from datetime import date
from backend.models import DadosLogin, DadosCadastro
from backend.db import conn, cursor
from backend.dependencias import ROLES_VALIDOS, requer_role, get_user_name, registrar_log

router = APIRouter()


@router.post("/login")
def realizarLogin(dados: DadosLogin):
    if dados.usuario.strip() == "" or len(dados.usuario) < 3:
        raise HTTPException(status_code=400, detail="Insira um usuário válido.")
    if dados.senha.strip() == "" or len(dados.senha) < 8:
        raise HTTPException(status_code=400, detail="Insira uma senha válida.")
    cursor.execute(
        "SELECT * FROM Usuario WHERE nome = %s AND senha = %s",
        (dados.usuario, dados.senha)
    )
    linha = cursor.fetchone()
    if linha is None:
        raise HTTPException(status_code=401, detail="Usuário inexistente ou senha incorreta.")
    return {"tipo": str(linha[4]), "nome": str(linha[1])}


@router.post("/registrar")
def registrar(dados: DadosCadastro):
    if dados.usuario.strip() == "":
        raise HTTPException(status_code=400, detail="Usuário não pode estar vazio.")
    if len(dados.usuario) < 3:
        raise HTTPException(status_code=400, detail="Usuário deve ter no mínimo 3 caracteres.")
    if dados.email.strip() == "":
        raise HTTPException(status_code=400, detail="Email não pode estar vazio.")
    if "@" not in dados.email or ".com" not in dados.email:
        raise HTTPException(status_code=400, detail="Email em um formato inválido.")
    if dados.senha.strip() == "":
        raise HTTPException(status_code=400, detail="Senha não pode estar vazia.")
    if len(dados.senha) < 8:
        raise HTTPException(status_code=400, detail="Senha deve ter no mínimo 8 caracteres.")
    if dados.tipo not in {"estoque", "caixa"}:
        raise HTTPException(status_code=400, detail="Perfil inválido para auto-cadastro.")
    cursor.execute("SELECT 1 FROM Usuario WHERE nome = %s", (dados.usuario,))
    if cursor.fetchone():
        raise HTTPException(status_code=409, detail="Usuário já cadastrado.")
    cursor.execute("SELECT 1 FROM Usuario WHERE email = %s", (dados.email,))
    if cursor.fetchone():
        raise HTTPException(status_code=409, detail="Email já cadastrado.")
    cursor.execute(
        "INSERT INTO Usuario(nome, senha, email, tipo, data_inicio) VALUES (%s, %s, %s, %s, %s)",
        (dados.usuario, dados.senha, dados.email, dados.tipo, date.today())
    )
    conn.commit()
    return {"message": "Conta criada com sucesso!"}


@router.post("/cadastrar")
def realizarCadastro(dados: DadosCadastro, role=requer_role("admin"), nome_autor: str = Depends(get_user_name)):
    if dados.usuario.strip() == "":
        raise HTTPException(status_code=400, detail="Usuário não pode estar vazio.")
    if len(dados.usuario) < 3:
        raise HTTPException(status_code=400, detail="Usuário deve ter no mínimo 3 caracteres.")
    if dados.email.strip() == "":
        raise HTTPException(status_code=400, detail="Email não pode estar vazio.")
    if "@" not in dados.email or ".com" not in dados.email:
        raise HTTPException(status_code=400, detail="Email em um formato inválido.")
    if dados.senha.strip() == "":
        raise HTTPException(status_code=400, detail="Senha não pode estar vazia.")
    if len(dados.senha) < 8:
        raise HTTPException(status_code=400, detail="Senha deve ter no mínimo 8 caracteres.")
    if dados.tipo not in ROLES_VALIDOS:
        raise HTTPException(status_code=400, detail="Perfil inválido.")
    cursor.execute("SELECT 1 FROM Usuario WHERE nome = %s", (dados.usuario,))
    if cursor.fetchone():
        raise HTTPException(status_code=409, detail="Usuário já cadastrado.")
    cursor.execute("SELECT 1 FROM Usuario WHERE email = %s", (dados.email,))
    if cursor.fetchone():
        raise HTTPException(status_code=409, detail="Email já cadastrado.")
    cursor.execute(
        "INSERT INTO Usuario(nome, senha, email, tipo, data_inicio) VALUES (%s, %s, %s, %s, %s)",
        (dados.usuario, dados.senha, dados.email, dados.tipo, date.today())
    )
    conn.commit()
    registrar_log(nome_autor, f"Cadastrou usuário '{dados.usuario}' com perfil '{dados.tipo}'")
    return {"message": "Cadastro realizado com sucesso!"}
