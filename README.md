# Gerenciador-de-estoque-PDS
Gerenciador de estoque para supermercados. Desenvolvido como trabalho final para a disciplina de Processo de Desenvolvimento de Software.


Configs para rodar o sistema

Dentro da pasta backend:
	Se não tiver a pasta venv:
		python -m venv venv
	
	Processo normal:
		Linux:
			source venv/bin/activate
			pip install -r requirements.txt
			uvicorn main:app --reload

		Windows (PowerShell do Vscode): 
			Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
			venv\Scripts\Activate.ps1
			pip install -r .\requirements.txt
			uvicorn main:app --reload			

Dentro da pasta frontend:
	Processo normal:
		Linux:
			npm install
			npm run dev
		
		Windows:
			Instalar: https://nodejs.org/
			Baixar a última versão, usando docker, baixe o instalador, não tente executar comandos de terminal.

			nmp install
			npm run 
			
