from fastapi import APIRouter, Depends, HTTPException
from backend.models import DadosProduto, DadosAtualizarProduto
from backend.db import conn, cursor
from backend.dependencias import requer_role, get_user_name, registrar_log

router = APIRouter()


@router.post("/cadastrarProduto")
def cadastrarProduto(dados: DadosProduto, role=requer_role("admin", "estoque"), nome_autor: str = Depends(get_user_name)):
    if len(str(dados.cod)) < 5:
        raise HTTPException(status_code=400, detail="Código deve ter no mínimo 5 dígitos.")
    if dados.nome.strip() == "":
        raise HTTPException(status_code=400, detail="Nome não pode estar vazio.")
    if len(dados.nome) < 3:
        raise HTTPException(status_code=400, detail="Nome deve ter no mínimo 3 caracteres.")
    if dados.desc.strip() == "":
        raise HTTPException(status_code=400, detail="Descrição não pode estar vazia.")
    if len(str(dados.lote)) < 6:
        raise HTTPException(status_code=400, detail="Lote deve ter no mínimo 6 dígitos.")
    if dados.lote < 0:
        raise HTTPException(status_code=400, detail="Lote inválido.")
    if dados.qtd < 0:
        raise HTTPException(status_code=400, detail="Quantidade inicial inválida.")
    cursor.execute("SELECT 1 FROM Produto WHERE cod_prod = %s", (dados.cod,))
    if cursor.fetchone():
        raise HTTPException(status_code=409, detail="Código já cadastrado.")
    cursor.execute(
        "INSERT INTO Produto(cod_prod, nome, descricao, lote, qtd) VALUES (%s, %s, %s, %s, %s)",
        (dados.cod, dados.nome, dados.desc, dados.lote, dados.qtd)
    )
    conn.commit()
    registrar_log(nome_autor, f"Cadastrou produto '{dados.nome}' (cód: {dados.cod})")
    return {"message": "Produto cadastrado com sucesso!"}


@router.get("/produtos")
def listarProdutos(role=requer_role("admin", "estoque")):
    cursor.execute("SELECT cod_prod, nome, descricao, lote, qtd FROM Produto ORDER BY cod_prod")
    linhas = cursor.fetchall()
    return {
        "produtos": [
            {"cod": l[0], "nome": l[1], "desc": l[2], "lote": l[3], "qtd": l[4]}
            for l in linhas
        ]
    }


@router.get("/produtos/{cod}")
def buscarProduto(cod: int, role=requer_role("admin", "estoque")):
    cursor.execute(
        "SELECT cod_prod, nome, descricao, lote, qtd FROM Produto WHERE cod_prod = %s",
        (cod,)
    )
    linha = cursor.fetchone()
    if linha is None:
        raise HTTPException(status_code=404, detail="Produto não encontrado.")
    return {"cod": linha[0], "nome": linha[1], "desc": linha[2], "lote": linha[3], "qtd": linha[4]}


@router.put("/produtos/{cod}")
def editarProduto(cod: int, dados: DadosAtualizarProduto, role=requer_role("admin", "estoque"), nome_autor: str = Depends(get_user_name)):
    if dados.nome.strip() == "":
        raise HTTPException(status_code=400, detail="Nome não pode estar vazio.")
    if len(dados.nome) < 3:
        raise HTTPException(status_code=400, detail="Nome deve ter no mínimo 3 caracteres.")
    if dados.desc.strip() == "":
        raise HTTPException(status_code=400, detail="Descrição não pode estar vazia.")
    if len(str(dados.lote)) < 6:
        raise HTTPException(status_code=400, detail="Lote deve ter no mínimo 6 dígitos.")
    if dados.lote < 0:
        raise HTTPException(status_code=400, detail="Lote inválido.")
    if dados.qtd < 0:
        raise HTTPException(status_code=400, detail="Quantidade não pode ser negativa.")
    cursor.execute("SELECT 1 FROM Produto WHERE cod_prod = %s", (cod,))
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="Produto não encontrado.")
    cursor.execute(
        "UPDATE Produto SET nome = %s, descricao = %s, lote = %s, qtd = %s WHERE cod_prod = %s",
        (dados.nome, dados.desc, dados.lote, dados.qtd, cod)
    )
    conn.commit()
    registrar_log(nome_autor, f"Editou produto '{dados.nome}' (cód: {cod})")
    return {"message": "Produto atualizado com sucesso!"}


@router.delete("/produtos/{cod}")
def removerProduto(cod: int, role=requer_role("admin", "estoque"), nome_autor: str = Depends(get_user_name)):
    cursor.execute("SELECT nome FROM Produto WHERE cod_prod = %s", (cod,))
    linha = cursor.fetchone()
    if linha is None:
        raise HTTPException(status_code=404, detail="Produto não encontrado.")
    try:
        cursor.execute("DELETE FROM Produto WHERE cod_prod = %s", (cod,))
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    registrar_log(nome_autor, f"Removeu produto '{linha[0]}' (cód: {cod})")
    return {"message": "Produto removido com sucesso!"}
