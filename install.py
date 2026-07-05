import subprocess
import config
import platform
import sys

SISTEMA = platform.system()

def criar_venv():
    if config.VENV.exists():
        return
    try:
        subprocess.run([
            sys.executable,
            "-m",
            "venv",
            str(config.VENV)
        ], check=True)
    except:
        print(f"Erro ao criar o ambiente virtual.\n")

def instalar_libs():
    try:
        subprocess.run([
            str(config.PIP_VENV),
            "install",
            "-r",
            str(config.REQUIREMENTS)
        ], check=True)
    except:
        print(f"Erro ao instalar a bibliotecas necessárias.\n")

def rodar_na_venv():
    try:
        subprocess.run([
            str(config.PYTHON_VENV),
            "install.py",
            "--venv"
        ], check = True)
    except:
        print(f"Erro ao executar o install na venv.\n")

def instalar_node():
    try:
        subprocess.run([
            "npm",
            "install"
        ],
        cwd = config.FRONTEND,
        check = True)
    except:
        print(f"Erro ao instalar o ambiente do node!\n")

def criar_banco():
    from backend.init_db import inicializar_banco 
    inicializar_banco()

def main():
    if "--venv" not in sys.argv:
        criar_venv()
        instalar_libs()
        rodar_na_venv()
        return
    
    instalar_node()
    criar_banco()


if __name__ == "__main__":
    main()
