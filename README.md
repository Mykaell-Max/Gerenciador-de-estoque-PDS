# Gerenciador-de-estoque-PDS
Gerenciador de estoque para supermercados. Desenvolvido como trabalho final para a disciplina de Processo de Desenvolvimento de Software.


Configs para rodar o sistema

Dentro da pasta backend:
	Se não tiver a pasta venv: python -m venv venv
	
	source venv/bin/activate
	pip install -r requirements.txt
	uvicorn main:app --reload

Dentro da pasta frontend:
	npm run dev
	Se a anterior fala, faça: npm install, e depois execute npm run dev
