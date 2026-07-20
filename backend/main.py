import os
from dotenv import load_dotenv
load_dotenv()
import time
from datetime import datetime, timezone
import backend.db  # noqa: F401 — triggers database initialization
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.rotas import auth, usuarios, produtos, logs, movimentacoes, vendas, dashboard
from backend.conexao import conectar

app = FastAPI()

_start_time = time.time()

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
app.include_router(vendas.router)
app.include_router(dashboard.router)


@app.get("/health")
def health():
    uptime_seconds = int(time.time() - _start_time)
    uptime = f"{uptime_seconds // 3600}h {(uptime_seconds % 3600) // 60}m {uptime_seconds % 60}s"

    db_status = "ok"
    db_version = None
    try:
        conn = conectar("estoquedb")
        cur = conn.cursor()
        cur.execute("SELECT version()")
        db_version = cur.fetchone()[0].split(",")[0]
        cur.close()
        conn.close()
    except Exception as e:
        db_status = f"error: {e}"

    return {
        "status": "ok" if db_status == "ok" else "degraded",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "uptime": uptime,
        "database": {
            "status": db_status,
            "version": db_version,
        },
    }
