# SINTONIA Project

## 🚀 Quick Start (For the Team)

Esegui questi comandi in ordine per far partire tutto. Non saltare nulla.

### 1. Setup Environment
Crea il file .env con le credenziali corrette.
```bash
echo "DATABASE_URL=postgresql://root:secret@localhost:5433/sintonia" > backend/.env
```

### 2. Avvia Docker
Fa partire il database e il backend.
```bash
docker-compose up -d --build
```

### 3. Setup Database
Installa le dipendenze, genera i file SQL e applica le migrazioni.
```bash
cd backend
npm install
npx drizzle-kit generate
npx drizzle-kit migrate
```

### 4. Popolamento Database
Popola il database con i dati di test (Pazienti, Psicologi, Forum, ecc.).
```bash
cd backend
npm run db:seed
```

---

### 🛑 Stop
Per fermare tutto e pulire i volumi (se serve ripartire da zero):
```bash
docker-compose down -v
```

### 🛠 Utili
- **Backend**: http://localhost:3000
- **Frontend Web**: http://localhost:5173 (Admin/Psicologo)
- **Frontend Mobile**: http://localhost:5174 (Pazienti)
- **Database**: localhost:5433 (User: `root`, Pass: `secret`, DB: `sintonia`)
- **SPID Test Environment**: http://localhost:8088

### 📱 Test SPID Authentication
Per testare il login SPID dei pazienti, crea un paziente di test con


Poi vai su http://localhost:5174 e usa il Codice Fiscale: `RSSMRA85M01H501Z`