from pathlib import Path
import platform

ROOT = Path(__file__).parent

BACKEND = ROOT/"backend"
FRONTEND = ROOT/"frontend"
VENV = BACKEND/"venv"
REQUIREMENTS = BACKEND/"requirements.txt"
SCHEMA = BACKEND/"schema.sql"
SISTEMA = platform.system()

if SISTEMA == "Windows":
    PYTHON_VENV = VENV/"Scripts"/"python.exe"
    PIP_VENV = VENV/"Scripts"/"pip.exe"
else:
    PYTHON_VENV = VENV/"bin"/"python"
    PIP_VENV = VENV/"bin"/"pip"



