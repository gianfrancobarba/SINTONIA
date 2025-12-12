# SINTONIA Project

## 🚀 Quick Start (For the Team)

Esegui questi comandi in ordine per far partire tutto. Non saltare nulla.

### 1. Setup Automatico (Raccomandato)
Esegui questo script per configurare tutto automaticamente (Ambiente, Docker, Database, Dati di test).

**macOS / Linux:**
```bash
cd webapp
chmod +x setup.sh
./setup.sh
```

**Windows (PowerShell):**
```powershell
cd webapp
./setup.ps1
```

> **Nota:** Assicurati di avere Docker installato e attivo.



### 2. Stop & Pulizia (Reset)
Per fermare i container o resettare tutto, usate gli script forniti:

**macOS / Linux:**
```bash
./clean.sh
# Per cancellare anche i dati (Reset Totale): ./clean.sh -v
```

**Windows (PowerShell):**
```powershell
./clean.ps1
# Per cancellare anche i dati (Reset Totale): ./clean.ps1 -v
```


### 🛠 Utili
- **Backend**: http://localhost:3000
- **Frontend Web**: http://localhost:5173 (Admin/Psicologo)
- **Frontend Mobile**: http://localhost:5174 (Pazienti)
- **Database**: localhost:5433 (User: `root`, Pass: `secret`, DB: `sintonia`)