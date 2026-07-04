from fastapi import FastAPI #Biblioteca que permite a conversa entre back e frontend
from fastapi.middleware.cors import CORSMiddleware #Biblioteca para permitir a conversa entre sites (Front é um site, back é outro)
from pydantic import BaseModel #Biblioteca para formatar os dados recebidos automaticamente
import psycopg2 #Biblioteca de conexão com o banco de dados

class DadosLogin(BaseModel):
    usuario: str
    senha: str

app = FastAPI()

app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
)


@app.post("/login")
def realizarLogin(dados: DadosLogin):
    return {"message": "Dados recebidos com sucesso!"}

