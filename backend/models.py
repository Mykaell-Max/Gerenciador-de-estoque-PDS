from typing import List, Optional
from pydantic import BaseModel


class DadosLogin(BaseModel):
    usuario: str
    senha: str


class DadosCadastro(BaseModel):
    usuario: str
    email: str
    senha: str
    tipo: str


class DadosProduto(BaseModel):
    cod: int
    nome: str
    desc: str
    lote: int
    qtd: int
    preco: float = 0.0


class DadosAtualizarProduto(BaseModel):
    nome: str
    desc: str
    lote: int
    qtd: int
    preco: float = 0.0


class DadosAtualizarRole(BaseModel):
    tipo: str


class DadosMovimentacao(BaseModel):
    cod: int
    tipo: str
    qtd: int


class DadosBloqueio(BaseModel):
    motivo: str
    data_desbloqueio: Optional[str] = None


class DadosItemVenda(BaseModel):
    cod_prod: int
    nome_prod: str
    quantidade: int
    preco_unitario: float


class DadosVenda(BaseModel):
    itens: List[DadosItemVenda]
    desconto: float = 0.0
    forma_pagamento: str
