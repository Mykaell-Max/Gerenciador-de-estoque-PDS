from fastapi import APIRouter, Depends
from backend.dependencias import get_db, requer_role

router = APIRouter()


@router.get("/dashboard")
def resumoDashboard(role=requer_role("admin", "estoque", "caixa"), db=Depends(get_db)):
    conn, cursor = db
    resposta = {}

    is_admin = role == "admin"
    ver_estoque = is_admin or role == "estoque"
    ver_vendas = is_admin or role == "caixa"

    if ver_estoque:
        cursor.execute(
            "SELECT COUNT(*), COALESCE(SUM(qtd), 0), COALESCE(SUM(preco * qtd), 0) FROM Produto"
        )
        total_produtos, total_estoque, valor_estoque = cursor.fetchone()
        cursor.execute("SELECT COUNT(*) FROM Produto WHERE qtd = 0")
        sem_estoque = cursor.fetchone()[0]
        resposta["total_produtos"] = int(total_produtos)
        resposta["total_estoque"] = int(total_estoque)
        resposta["valor_estoque"] = float(valor_estoque)
        resposta["sem_estoque"] = int(sem_estoque)

    if ver_vendas:
        cursor.execute(
            "SELECT COUNT(*), COALESCE(SUM(total), 0) FROM Venda WHERE data_hora::date = CURRENT_DATE"
        )
        vendas_hoje, faturamento_hoje = cursor.fetchone()
        cursor.execute("SELECT COUNT(*), COALESCE(SUM(total), 0) FROM Venda")
        total_vendas, faturamento_total = cursor.fetchone()
        cursor.execute(
            """
            WITH dias AS (
                SELECT generate_series(
                    CURRENT_DATE - INTERVAL '6 days',
                    CURRENT_DATE,
                    INTERVAL '1 day'
                )::date AS dia
            )
            SELECT d.dia,
                   COALESCE(COUNT(v.id), 0) AS qtd_vendas,
                   COALESCE(SUM(v.total), 0) AS faturamento
            FROM dias d
            LEFT JOIN Venda v ON v.data_hora::date = d.dia
            GROUP BY d.dia
            ORDER BY d.dia
            """
        )
        resposta["vendas_hoje"] = int(vendas_hoje)
        resposta["faturamento_hoje"] = float(faturamento_hoje)
        resposta["total_vendas"] = int(total_vendas)
        resposta["faturamento_total"] = float(faturamento_total)
        resposta["vendas_por_dia"] = [
            {"data": str(r[0]), "vendas": int(r[1]), "faturamento": float(r[2])}
            for r in cursor.fetchall()
        ]

    if ver_estoque:
        cursor.execute(
            """
            WITH dias AS (
                SELECT generate_series(
                    CURRENT_DATE - INTERVAL '6 days',
                    CURRENT_DATE,
                    INTERVAL '1 day'
                )::date AS dia
            )
            SELECT d.dia,
                   COALESCE(SUM(CASE WHEN m.tipo = 'entrada' THEN m.quantidade ELSE 0 END), 0) AS entradas,
                   COALESCE(SUM(CASE WHEN m.tipo = 'saida'   THEN m.quantidade ELSE 0 END), 0) AS saidas
            FROM dias d
            LEFT JOIN MovimentacaoEstoque m ON m.data_hora::date = d.dia
            GROUP BY d.dia
            ORDER BY d.dia
            """
        )
        resposta["movimentacoes_por_dia"] = [
            {"data": str(r[0]), "entradas": int(r[1]), "saidas": int(r[2])}
            for r in cursor.fetchall()
        ]
        cursor.execute("SELECT nome, qtd FROM Produto ORDER BY qtd ASC LIMIT 5")
        resposta["baixo_estoque"] = [{"nome": r[0], "qtd": int(r[1])} for r in cursor.fetchall()]
        cursor.execute(
            """
            SELECT p.nome, COALESCE(SUM(m.quantidade), 0) AS total_mov
            FROM Produto p
            LEFT JOIN MovimentacaoEstoque m ON m.cod_prod = p.cod_prod
                AND m.data_hora >= CURRENT_DATE - INTERVAL '29 days'
            GROUP BY p.nome
            ORDER BY total_mov DESC
            LIMIT 5
            """
        )
        resposta["mais_movimentados"] = [{"nome": r[0], "movimentacoes": int(r[1])} for r in cursor.fetchall()]

    return resposta
