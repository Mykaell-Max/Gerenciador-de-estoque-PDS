from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from backend.models import DadosMovimentacao
from backend.dependencias import get_db, requer_role, get_user_name, registrar_log

router = APIRouter()

TIPOS_VALIDOS = {"entrada", "saida"}


@router.post("/movimentacoes")
def registrarMovimentacao(dados: DadosMovimentacao, role=requer_role("admin", "estoque"), nome_autor: str = Depends(get_user_name), db=Depends(get_db)):
    conn, cursor = db
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
            "INSERT INTO MovimentacaoEstoque(cod_prod, tipo, quantidade, usuario_nome, estoque_anterior, estoque_posterior) VALUES (%s, %s, %s, %s, %s, %s)",
            (dados.cod, dados.tipo, dados.qtd, nome_autor, qtd_atual, nova_qtd)
        )
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    acao = "Registrou entrada" if dados.tipo == "entrada" else "Registrou saída"
    registrar_log(nome_autor, f"{acao} de {dados.qtd} unid. do produto '{nome_produto}' (cód: {dados.cod})")
    return {"message": "Movimentação registrada com sucesso!", "qtd": nova_qtd}


@router.get("/movimentacoes")
def listarMovimentacoes(
    role=requer_role("admin", "estoque"),
    db=Depends(get_db),
    cod_prod: Optional[int] = Query(None),
    usuario: Optional[str] = Query(None),
    tipo: Optional[str] = Query(None),
    data_inicio: Optional[str] = Query(None),
    data_fim: Optional[str] = Query(None),
    pagina: int = Query(1, ge=1),
    por_pagina: int = Query(50, ge=1, le=200),
    ordem: str = Query("desc"),
):
    conn, cursor = db

    filtros = []
    params = []

    if cod_prod is not None:
        filtros.append("m.cod_prod = %s")
        params.append(cod_prod)
    if usuario:
        filtros.append("m.usuario_nome ILIKE %s")
        params.append(f"%{usuario}%")
    if tipo and tipo in ("entrada", "saida"):
        filtros.append("m.tipo = %s")
        params.append(tipo)
    if data_inicio:
        filtros.append("m.data_hora >= %s")
        params.append(data_inicio)
    if data_fim:
        filtros.append("m.data_hora <= %s")
        params.append(data_fim + " 23:59:59")

    where = ("WHERE " + " AND ".join(filtros)) if filtros else ""
    direcao = "ASC" if ordem == "asc" else "DESC"
    offset = (pagina - 1) * por_pagina

    cursor.execute(
        f"""
        SELECT COUNT(*) FROM MovimentacaoEstoque m {where}
        """,
        params
    )
    total = cursor.fetchone()[0]

    cursor.execute(
        f"""
        SELECT m.id, m.cod_prod, p.nome, m.tipo, m.quantidade, m.usuario_nome, m.data_hora,
               m.estoque_anterior, m.estoque_posterior
        FROM MovimentacaoEstoque m
        JOIN Produto p ON p.cod_prod = m.cod_prod
        {where}
        ORDER BY m.data_hora {direcao}
        LIMIT %s OFFSET %s
        """,
        params + [por_pagina, offset]
    )
    linhas = cursor.fetchall()
    return {
        "total": total,
        "pagina": pagina,
        "por_pagina": por_pagina,
        "movimentacoes": [
            {
                "id": l[0],
                "cod": l[1],
                "nome": l[2],
                "tipo": l[3],
                "qtd": l[4],
                "usuario": l[5],
                "data_hora": l[6].isoformat(),
                "estoque_anterior": l[7],
                "estoque_posterior": l[8],
            }
            for l in linhas
        ]
    }
