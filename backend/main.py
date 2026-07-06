from fastapi import FastAPI #Biblioteca que permite a conversa entre back e frontend
from fastapi.middleware.cors import CORSMiddleware #Biblioteca para permitir a conversa entre sites (Front é um site, back é outro)
from pydantic import BaseModel #Biblioteca para formatar os dados recebidos automaticamente
import psycopg2 #Biblioteca de conexão com o banco de dados
from backend.init_db import inicializar_banco
from backend.conexao import conectar
from datetime import date

inicializar_banco()

class DadosLogin(BaseModel):
    usuario: str
    senha: str

class DadosCadastro(BaseModel):
    usuario: str
    email: str
    senha: str
    tipo: str

app = FastAPI()

app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
)

conn = conectar("estoquedb")
cursor = conn.cursor()
cursor.execute("SET search_path TO Banco")
conn.commit()


@app.post("/login")
def realizarLogin(dados: DadosLogin):
    if(dados.usuario.strip() == "" or len(dados.usuario) < 3):
        return {
            "sucess": False,
            "message": "Insira um usuário válido."
        }

    if(dados.senha.strip() == "" or len(dados.senha) < 8):
        return {
            "sucess": False,
            "message": "Insira uma senha válida."
        }

    cursor.execute(
        "SELECT * FROM Usuario WHERE nome = %s and senha = %s",
        (dados.usuario, dados.senha)
    )

    linha = cursor.fetchone()
    if linha is None:
        return {
            "sucess": False,
            "message": "Usuario inexistente ou senha incorreta"
        }

    return {
        "sucess": True,
        "tipo": str(linha[4])
    }


@app.post("/cadastrar")
def realizarCadastro(dados: DadosCadastro):
    if dados.usuario.strip() == "":
        return {
            "sucess": False,
            "message": "Usuário não pode estar vazio."
        }
    
    if len(dados.usuario) < 3:
        return {
            "sucess": False,
            "message": "Usuário deve ter no mínimo 3 caracteres."
        }
    
    if dados.email.strip() == "":
        return {
            "sucess": False,
            "message": "Email não pode estar vazio."
        }
        
    if "@" not in dados.email or ".com" not in dados.email:
        return {
            "sucess": False,
            "message": "Email em um formato inválido."
        }

    if dados.senha.strip() == "":
        return {
            "sucess": False,
            "message": "Senha não pode estar vazia."
        }
    
    if len(dados.senha) < 8:
        return {
            "sucess": False,
            "message": "Senha deve ter no mínimo 8 caracteres."
        }

    if dados.tipo not in {"A", "C"}:
        return {
            "sucess": False,
            "message": "Tipo inválido."
        }

    cursor.execute(
        "SELECT 1 FROM Usuario WHERE nome = %s",
        (dados.usuario,)
    )

    if cursor.fetchone():
        return {
            "sucess": False,
            "message": "Usuário já cadastrado."
        }

    cursor.execute(
        "SELECT 1 FROM Usuario WHERE email = %s",
        (dados.email,)
    )

    if cursor.fetchone():
        return {
            "sucess": False,
            "message": "Email já cadastrado."
        }

    data_atual = date.today()

    cursor.execute(
        "INSERT INTO Usuario(nome, senha, email, tipo, data_inicio) VALUES (%s, %s, %s, %s, %s)",
        (dados.usuario, dados.senha, dados.email, dados.tipo, data_atual)
    )
    conn.commit()

    return {
        "sucess": True,
        "message": "Cadastro realizado com sucesso"
    }


