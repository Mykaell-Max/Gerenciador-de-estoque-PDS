from fastapi import APIRouter, Depends, HTTPException
from backend.models import DadosVenda
from backend.dependencias import get_db, requer_role, get_user_name, registrar_log

router = APIRouter()

FORMAS_PAGAMENTO = {"dinheiro", "credito", "debito", "pix"}


@router.post("/vendas")
def registrarVenda(dados: DadosVenda, role=requer_role("admin", "caixa"), nome_autor: str = Depends(get_user_name), db=Depends(get_db)):
    conn, cursor = db

    if not dados.itens:
        raise HTTPException(status_code=400, detail="A venda deve conter ao menos um item.")
    if dados.forma_pagamento not in FORMAS_PAGAMENTO:
        raise HTTPException(status_code=400, detail="Forma de pagamento inválida.")
    if dados.desconto < 0:
        raise HTTPException(status_code=400, detail="Desconto não pode ser negativo.")

    subtotal = 0.0
    itens_validados = []
    for item in dados.itens:
        if item.quantidade <= 0:
            raise HTTPException(status_code=400, detail=f"Quantidade inválida para '{item.nome_prod}'.")
        cursor.execute("SELECT nome, qtd, preco FROM Produto WHERE cod_prod = %s FOR UPDATE", (item.cod_prod,))
        linha = cursor.fetchone()
        if linha is None:
            raise HTTPException(status_code=404, detail=f"Produto {item.cod_prod} não encontrado.")
        if item.quantidade > linha[1]:
            raise HTTPException(status_code=400, detail=f"Estoque insuficiente para '{linha[0]}'.")
        preco_db = float(linha[2] or 0)
        item_subtotal = round(preco_db * item.quantidade, 2)
        subtotal += item_subtotal
        itens_validados.append((item, linha[1], item_subtotal, linha[0], preco_db))

    subtotal = round(subtotal, 2)
    if dados.desconto > subtotal:
        raise HTTPException(status_code=400, detail="Desconto não pode ser maior que o subtotal.")
    total = round(subtotal - dados.desconto, 2)

    try:
        cursor.execute(
            "INSERT INTO Venda(usuario_nome, subtotal, desconto, total, forma_pagamento) VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (nome_autor, subtotal, dados.desconto, total, dados.forma_pagamento)
        )
        venda_id = cursor.fetchone()[0]

        for item, qtd_atual, item_subtotal, nome_db, preco_db in itens_validados:
            nova_qtd = qtd_atual - item.quantidade
            cursor.execute("UPDATE Produto SET qtd = %s WHERE cod_prod = %s", (nova_qtd, item.cod_prod))
            cursor.execute(
                "INSERT INTO MovimentacaoEstoque(cod_prod, tipo, quantidade, usuario_nome, estoque_anterior, estoque_posterior) VALUES (%s, %s, %s, %s, %s, %s)",
                (item.cod_prod, "saida", item.quantidade, nome_autor, qtd_atual, nova_qtd)
            )
            cursor.execute(
                "INSERT INTO ItemVenda(venda_id, cod_prod, nome_prod, quantidade, preco_unitario, subtotal) VALUES (%s, %s, %s, %s, %s, %s)",
                (venda_id, item.cod_prod, nome_db, item.quantidade, preco_db, item_subtotal)
            )

        conn.commit()
    except Exception:
        conn.rollback()
        raise

    registrar_log(nome_autor, f"Registrou venda #{venda_id} — total R$ {total:.2f} ({dados.forma_pagamento})")
    return {"message": "Venda registrada com sucesso!", "venda_id": venda_id, "total": total}


@router.get("/vendas/{venda_id}")
def buscarVenda(venda_id: int, role=requer_role("admin", "caixa"), db=Depends(get_db)):
    conn, cursor = db
    cursor.execute(
        "SELECT id, usuario_nome, data_hora, subtotal, desconto, total, forma_pagamento FROM Venda WHERE id = %s",
        (venda_id,)
    )
    venda = cursor.fetchone()
    if venda is None:
        raise HTTPException(status_code=404, detail="Venda não encontrada.")
    cursor.execute(
        "SELECT cod_prod, nome_prod, quantidade, preco_unitario, subtotal FROM ItemVenda WHERE venda_id = %s",
        (venda_id,)
    )
    itens = cursor.fetchall()
    return {
        "id": venda[0],
        "usuario_nome": venda[1],
        "data_hora": venda[2].isoformat(),
        "subtotal": float(venda[3]),
        "desconto": float(venda[4]),
        "total": float(venda[5]),
        "forma_pagamento": venda[6],
        "itens": [
            {
                "cod_prod": i[0],
                "nome_prod": i[1],
                "quantidade": i[2],
                "preco_unitario": float(i[3]),
                "subtotal": float(i[4]),
            }
            for i in itens
        ]
    }
