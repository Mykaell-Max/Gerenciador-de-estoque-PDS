from fastapi import APIRouter, Depends, HTTPException
from backend.models import DadosMovimentacao
from backend.db import conn, cursor
from backend.dependencias import requer_role, get_user_name, registrar_log

router = APIRouter()

TIPOS_VALIDOS = {"entrada", "saida"}


@router.post("/movimentacoes")
def registrarMovimentacao(dados: DadosMovimentacao, role=requer_role("admin", "estoque"), nome_autor: str = Depends(get_user_name)):
    if dados.tipo not in TIPOS_VALIDOS:
        raise HTTPException(status_code=400, detail="Tipo de movimentação inválido.")
    if dados.qtd <= 0:
        raise HTTPException(status_code=400, detail="Quantidade deve ser maior que zero.")

    cursor.execute("SELECT nome, qtd FROM Produto WHERE cod_prod = %s", (dados.cod,))
    linha = cursor.fetchone()
    if linha is None:
        raise HTTPException(status_code=404, detail="Produto não encontrado.")

    nome_produto, qtd_atual = linha
    if dados.tipo == "saida" and dados.qtd > qtd_atual:
        raise HTTPException(status_code=400, detail="Quantidade insuficiente em estoque.")

    nova_qtd = qtd_atual + dados.qtd if dados.tipo == "entrada" else qtd_atual - dados.qtd
    try:
        cursor.execute("UPDATE Produto SET qtd = %s WHERE cod_prod = %s", (nova_qtd, dados.cod))
        cursor.execute(
            "INSERT INTO MovimentacaoEstoque(cod_prod, tipo, quantidade, usuario_nome) VALUES (%s, %s, %s, %s)",
            (dados.cod, dados.tipo, dados.qtd, nome_autor)
        )
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    acao = "Registrou entrada" if dados.tipo == "entrada" else "Registrou saída"
    registrar_log(nome_autor, f"{acao} de {dados.qtd} unid. do produto '{nome_produto}' (cód: {dados.cod})")
    return {"message": "Movimentação registrada com sucesso!", "qtd": nova_qtd}


@router.get("/movimentacoes")
def listarMovimentacoes(role=requer_role("admin", "estoque")):
    cursor.execute(
        """
        SELECT m.id, m.cod_prod, p.nome, m.tipo, m.quantidade, m.usuario_nome, m.data_hora
        FROM MovimentacaoEstoque m
        JOIN Produto p ON p.cod_prod = m.cod_prod
        ORDER BY m.data_hora DESC
        """
    )
    linhas = cursor.fetchall()
    return {
        "movimentacoes": [
            {
                "id": l[0],
                "cod": l[1],
                "nome": l[2],
                "tipo": l[3],
                "qtd": l[4],
                "usuario": l[5],
                "data_hora": l[6].isoformat(),
            }
            for l in linhas
        ]
    }
