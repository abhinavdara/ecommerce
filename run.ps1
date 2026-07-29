# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\ecommerce-backend'; & 'C:\Program Files\Apache\apache-maven-3.9.16\bin\mvn.cmd' spring-boot:run"

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\ecommerce-frontend'; npm run dev"
