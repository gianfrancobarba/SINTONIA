# 🧠 SINTONIA - Web Application

Sistema di gestione psicologica per il monitoraggio e supporto ai pazienti.

---

## 📋 Prerequisiti

Prima di iniziare, assicurati di avere installato:

| Software | Versione Minima | Verifica Installazione |
|----------|-----------------|------------------------|
| **Node.js** | 18.x o superiore | `node --version` |
| **npm** | 9.x o superiore | `npm --version` |
| **Docker** | 20.x o superiore | `docker --version` |
| **Docker Compose** | 2.x o superiore | `docker compose version` |
| **Git** | 2.x o superiore | `git --version` |

> [!IMPORTANT]
> **Docker Desktop** deve essere **in esecuzione** prima di procedere con il setup.

---

## 🚀 Quick Start - Setup Completo Automatico

**Un solo comando** per configurare e avviare tutto il progetto!

### 💻 Windows (PowerShell)

```powershell
# 1. Clona il repository
git clone https://github.com/gianfrancobarba/SINTONIA.git
cd SINTONIA/webapp

# 2. Esegui lo script di setup (configura tutto e avvia i servizi)
.\setup.ps1
```

> [!NOTE]
> Se ricevi un errore relativo alle policy di esecuzione, esegui prima:
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
> ```

### 🍎 macOS

```bash
# 1. Clona il repository
git clone https://github.com/gianfrancobarba/SINTONIA.git
cd SINTONIA/webapp

# 2. Rendi eseguibile e avvia lo script
chmod +x setup.sh
./setup.sh
```

### 🐧 Linux (Ubuntu/Debian/Fedora)

```bash
# 1. Clona il repository
git clone https://github.com/gianfrancobarba/SINTONIA.git
cd SINTONIA/webapp

# 2. Rendi eseguibile e avvia lo script
chmod +x setup.sh
./setup.sh
```

> [!TIP]
> Su Linux, potrebbe essere necessario eseguire Docker con `sudo`. In alternativa, aggiungi il tuo utente al gruppo docker:
> ```bash
> sudo usermod -aG docker $USER
> newgrp docker
> ```

---

## ✨ Cosa fa lo script automatico?

Lo script esegue automaticamente tutti questi passaggi:

1. ✅ **Configura l'ambiente** - Crea il file `.env` per il backend
2. ✅ **Avvia Docker** - Backend API + Database PostgreSQL
3. ✅ **Attende il database** - Verifica che sia pronto
4. ✅ **Configura il database** - Migrazioni + dati di test
5. ✅ **Installa le dipendenze** - Backend + Frontend Web + Frontend Mobile
6. ✅ **Avvia tutti i servizi** - Frontend accessibili immediatamente

Al termine, vedrai i servizi attivi e le credenziali di test!

---

## 🌐 URL dei Servizi

Una volta completato il setup, i servizi saranno disponibili a:

| Servizio | URL | Descrizione |
|----------|-----|-------------|
| **Backend API** | http://localhost:3000 | API REST NestJS |
| **Frontend Web** | http://localhost:5173 | Dashboard Admin/Psicologo |
| **Frontend Mobile** | http://localhost:5174 | Interfaccia Pazienti |
| **Database PostgreSQL** | localhost:5433 | Porta esposta |

---

## 🔑 Credenziali di Test

| Ruolo | Email | Password |
|-------|-------|----------|
| **Admin** | alessio.delsorbo@gmail.com | password1 |
| **Psicologo** | l.bruno@pec.aslnapoli1centro.it | password123 |
| **Paziente** | chiara.conti@gmail.com | password123 |

---

## 🛑 Stop & Pulizia

### Fermare i servizi

Premi `Ctrl+C` nel terminale dove è in esecuzione lo script.

Per fermare anche i container Docker:

**💻 Windows (PowerShell):**
```powershell
.\clean.ps1
```

**🍎 macOS / 🐧 Linux:**
```bash
./clean.sh
```

### Reset Totale (cancella anche i dati del database)

**💻 Windows (PowerShell):**
```powershell
.\clean.ps1 -v
```

**🍎 macOS / 🐧 Linux:**
```bash
./clean.sh -v
```

---

## 🔄 Sviluppo Quotidiano

Una volta completato il setup iniziale, per i giorni successivi:

### Avvio Rapido

```bash
# 1. Assicurati che Docker Desktop sia in esecuzione

# 2. Dalla cartella webapp, avvia i container Docker
docker compose up -d

# 3. Avvia i frontend
npm run dev:frontends
```

### Comandi Disponibili

| Comando | Descrizione |
|---------|-------------|
| `npm run dev:frontends` | Avvia Frontend Web + Mobile |
| `npm run dev:web` | Avvia solo Frontend Web |
| `npm run dev:mobile` | Avvia solo Frontend Mobile |
| `npm run dev:all` | Avvia Backend + tutti i Frontend |

---

## ⚙️ Setup Manuale (Passo-Passo)

Se preferisci eseguire i comandi manualmente:

<details>
<summary><b>Clicca per espandere le istruzioni manuali</b></summary>

### Passo 1: Configura l'ambiente

**💻 Windows (PowerShell):**
```powershell
cd webapp
Set-Content -Path "backend\.env" -Value "DATABASE_URL=postgresql://root:secret@localhost:5433/sintonia" -Encoding Ascii
```

**🍎 macOS / 🐧 Linux:**
```bash
cd webapp
echo "DATABASE_URL=postgresql://root:secret@localhost:5433/sintonia" > backend/.env
```

### Passo 2: Avvia Docker

```bash
docker compose up -d --build
```

### Passo 3: Attendi il database

```bash
# Verifica stato
docker exec webapp-db-1 pg_isready -U root -d sintonia
```

### Passo 4: Configura il database

```bash
cd backend
npm install
npx drizzle-kit generate
npx drizzle-kit migrate
npm run db:seed
cd ..
```

### Passo 5: Installa dipendenze e avvia

```bash
npm install
npm run dev:frontends
```

</details>

---

## 🐛 Troubleshooting

<details>
<summary><b>❌ "Docker daemon is not running"</b></summary>

**Soluzione:** Avvia Docker Desktop e attendi che sia completamente caricato.
</details>

<details>
<summary><b>❌ "Port 3000/5173/5174 already in use"</b></summary>

**💻 Windows:**
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**macOS / Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```
</details>

<details>
<summary><b>❌ "Cannot find module..."</b></summary>

**Soluzione:** Reinstalla le dipendenze:
```bash
npm install
```
</details>

<details>
<summary><b>❌ "EACCES permission denied" (macOS/Linux)</b></summary>

**Soluzione:**
```bash
sudo chown -R $(whoami) ~/.npm
```
</details>

<details>
<summary><b>❌ Container non si avvia</b></summary>

**Soluzione:** Verifica i log:
```bash
docker compose logs backend
docker compose logs db
```
</details>

<details>
<summary><b>🔄 Reset completo dell'ambiente</b></summary>

```bash
# Ferma tutto e rimuovi volumi
docker compose down -v

# Rimuovi node_modules (macOS/Linux)
rm -rf node_modules backend/node_modules frontend-web/node_modules frontend-mobile/node_modules

# Rimuovi node_modules (Windows PowerShell)
Remove-Item -Recurse -Force node_modules, backend\node_modules, frontend-web\node_modules, frontend-mobile\node_modules

# Riparti dal setup iniziale
./setup.sh   # oppure .\setup.ps1 su Windows
```
</details>

---

## 📁 Struttura del Progetto

```
webapp/
├── 📄 README.md              # Questo file
├── 📄 docker-compose.yml     # Configurazione Docker
├── 📄 package.json           # Workspace npm root
├── 📄 setup.sh               # Setup automatico macOS/Linux
├── 📄 setup.ps1              # Setup automatico Windows
├── 📄 clean.sh               # Pulizia macOS/Linux
├── 📄 clean.ps1              # Pulizia Windows
├── 📂 backend/               # API NestJS + Drizzle ORM
├── 📂 frontend-web/          # React + Vite (Dashboard)
├── 📂 frontend-mobile/       # React + Vite (App Pazienti)
└── 📂 docs/                  # Documentazione aggiuntiva
```

---

## 📚 Documentazione Aggiuntiva

- [Algoritmo Score Paziente](docs/algoritmo-score-paziente.md)
- [Assegnazione Pazienti](docs/assegnazione-pazienti.md)
- [Sistema Streak](docs/STREAK.md)

---

## 🤝 Contribuire

1. Crea un branch: `git checkout -b feature/nome-feature`
2. Committa: `git commit -m "Descrizione"`
3. Pusha: `git push origin feature/nome-feature`
4. Apri una Pull Request

---

> **SINTONIA** - Sviluppato con ❤️ per il supporto psicologico
