import os
from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.rotas import auth, usuarios, produtos, logs, movimentacoes

app = FastAPI()

_default_origins = "http://localhost:5173,http://localhost:5174"
_origins = os.getenv("ALLOWED_ORIGINS", _default_origins).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(usuarios.router)
app.include_router(produtos.router)
app.include_router(logs.router)
app.include_router(movimentacoes.router)
