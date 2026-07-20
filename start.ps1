Start-Process powershell -ArgumentList "-NoExit", "-Command", ".\backend\venv\Scripts\uvicorn.exe backend.main:app --reload --port 8000"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
