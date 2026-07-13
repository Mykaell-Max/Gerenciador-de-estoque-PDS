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


class DadosAtualizarProduto(BaseModel):
    nome: str
    desc: str
    lote: int
    qtd: int


class DadosAtualizarRole(BaseModel):
    tipo: str
