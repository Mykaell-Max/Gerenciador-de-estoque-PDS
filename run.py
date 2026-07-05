import subprocess
import config
import webbrowser
import time

def executar_backend():
    try:
        subprocess.Popen([
            str(config.PYTHON_VENV),
            "-m",
            "uvicorn",
            "backend.main:app",
            "--reload"
        ], 
        cwd = config.ROOT)
    except Exception as e:
        print(e)
    
def executar_frontend():
    try:
        subprocess.Popen([
            "npm",
            "run",
            "dev"
        ],
        cwd = config.FRONTEND)
    except Exception as e:
        print(e)

def main():
    executar_backend()
    executar_frontend()
    time.sleep(3)
    webbrowser.open("http://localhost:5173")


if __name__ == "__main__":
    main()
