# 🌟 SINTONIA

<p align="center">
  <strong>Piattaforma Digitale per il Supporto alla Salute Mentale</strong>
</p>

<p align="center">
  <a href="#-il-problema">Il Problema</a> •
  <a href="#-la-nostra-soluzione">La Soluzione</a> •
  <a href="#-funzionalità-principali">Funzionalità</a> •
  <a href="#-architettura">Architettura</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-documentazione">Documentazione</a>
</p>

---

## 📖 Panoramica

**SINTONIA** è una piattaforma digitale innovativa progettata per **rivoluzionare il supporto alla salute mentale** nel Sistema Sanitario della Regione Campania. Il progetto nasce dalla consapevolezza che l'accesso ai servizi di salute mentale è spesso ostacolato da lunghe liste d'attesa e mancanza di strumenti di monitoraggio continuo.

La piattaforma crea un **ecosistema digitale integrato** che mette in comunicazione tre attori fondamentali:
- **Pazienti**: cittadini campani che necessitano di supporto psicologico
- **Psicologi**: professionisti del SSR che forniscono assistenza
- **Amministratori**: personale che gestisce il sistema

---

## 🎯 Il Problema

Il Sistema Sanitario Regionale della Campania affronta sfide significative nella gestione della salute mentale:

| Problema | Impatto |
|----------|---------|
| **Liste d'attesa lunghe** | Pazienti attendono mesi prima di essere assegnati a uno psicologo |
| **Mancanza di prioritizzazione** | Non esiste un sistema oggettivo per identificare i casi più urgenti |
| **Monitoraggio discontinuo** | Difficoltà nel tracciare l'evoluzione del paziente tra le sedute |
| **Comunicazione frammentata** | Pazienti isolati senza canali di supporto tra un appuntamento e l'altro |
| **Carico di lavoro sbilanciato** | Distribuzione inefficiente dei pazienti tra gli psicologi disponibili |

---

## 💡 La Nostra Soluzione

SINTONIA affronta queste sfide con un approccio **data-driven** e **centrato sul paziente**:

### 🧠 Sistema di Prioritizzazione Intelligente

Il cuore di SINTONIA è un **algoritmo di scoring clinico** che valuta continuamente lo stato di salute mentale di ogni paziente. Il sistema:

- **Analizza le risposte ai questionari clinici validati** per calcolare uno score di rischio
- **Utilizza il decadimento esponenziale** per dare più peso ai dati recenti, pur mantenendo memoria della storia clinica
- **Classifica automaticamente i pazienti** in fasce di priorità (Urgente, Breve, Differibile, Programmabile)
- **Garantisce che nessun caso critico venga dimenticato** grazie a finestre temporali che impongono interventi entro deadline specifiche

### 👥 Assegnazione Automatica Ottimizzata

Quando un nuovo paziente entra nel sistema o uno psicologo si libera:

- Il sistema calcola una **coda virtuale dinamica** basata sulla priorità clinica
- I pazienti più urgenti vengono **assegnati automaticamente** agli psicologi disponibili
- Ogni psicologo ha un **carico massimo di 8 pazienti** per garantire qualità dell'assistenza
- Il sistema bilancia automaticamente il carico di lavoro tra i professionisti

### 📊 Monitoraggio Continuo

A differenza del modello tradizionale basato solo sulle sedute:

- I pazienti compilano **questionari periodici** direttamente dall'app
- Lo **stato d'animo viene tracciato quotidianamente** con un sistema semplice e veloce
- Gli psicologi ricevono **alert clinici automatici** quando un paziente mostra segnali di peggioramento
- Il **diario emotivo** permette ai pazienti di esprimere pensieri e sensazioni tra le sedute

### 💬 Community di Supporto

Per combattere l'isolamento tra le sedute:

- Un **forum anonimo** permette ai pazienti di condividere esperienze e fare domande
- Gli psicologi **rispondono pubblicamente**, creando una knowledge base di supporto
- La community fornisce un **senso di appartenenza** e riduce lo stigma

### 🏅 Gamification per l'Engagement

Per incentivare l'uso costante della piattaforma:

- Sistema di **streak** che premia i giorni consecutivi di check-in
- **Badge** sbloccabili al raggiungimento di obiettivi
- **Progress bar** e livelli che rendono tangibile il percorso di miglioramento

---

## 🚀 Quick Start

Per istruzioni dettagliate su come configurare e avviare il progetto, consulta la guida tecnica:

👉 **[Guida Setup Completa](webapp/README.md)**

---

## ✨ Funzionalità Principali

### 👤 Per i Pazienti (Frontend Mobile)

| Funzionalità | Descrizione |
|--------------|-------------|
| 🔐 **Autenticazione SPID** | Login sicuro tramite identità digitale |
| 📋 **Questionari Clinici** | Compilazione PHQ-9, GAD-7, WHO-5, PC-PTSD-5 |
| 📔 **Diario Emotivo** | Scrittura e consultazione del diario personale |
| 😊 **Stato d'Animo** | Tracciamento giornaliero con storico |
| 🔥 **Sistema Streak** | Giorni consecutivi di check-in |
| 💬 **Forum** | Pubblicazione domande anonime |
| 🏅 **Badge** | Sistema di gamification |
| 📲 **Notifiche** | Alert per questionari e risposte |
| 🎫 **Supporto Tecnico** | Apertura e gestione ticket |

### 🧑‍⚕️ Per gli Psicologi (Frontend Web)

| Funzionalità | Descrizione |
|--------------|-------------|
| 👥 **Gestione Pazienti** | Visualizzazione e monitoraggio pazienti assegnati |
| 📊 **Questionari** | Visualizzazione risultati e storico |
| ⚠️ **Alert Clinici** | Notifiche per cambiamenti significativi |
| 💬 **Forum** | Risposta alle domande dei pazienti |
| 🔄 **Invalidazione** | Richiesta di invalidazione questionari |
| ✅ **Termina Cura** | Chiusura percorso terapeutico |
| 👤 **Area Personale** | Gestione profilo e credenziali |

### 👨‍💼 Per gli Amministratori (Frontend Web)

| Funzionalità | Descrizione |
|--------------|-------------|
| 👥 **Gestione Pazienti** | CRUD pazienti e assegnazione psicologi |
| 🧑‍⚕️ **Gestione Psicologi** | CRUD psicologi e credenziali |
| 📋 **Questionari** | Overview globale e revisione |
| ✏️ **Invalidazioni** | Approvazione/rifiuto richieste |
| 🎫 **Supporto Tecnico** | Gestione ticket aperti |
| 💬 **Forum** | Moderazione contenuti |
| 👤 **Area Personale** | Gestione profilo amministratore |

---

## 🔬 Algoritmi Chiave

### Calcolo Score Paziente

Il sistema utilizza un **algoritmo di decadimento esponenziale** per calcolare lo score di rischio clinico, bilanciando:

- ⚡ **Sensibilità ai cambiamenti recenti** (peso maggiore ai questionari più recenti)
- 📜 **Memoria storica** (peso minimo 20% garantito per considerazioni etiche)
- 🎯 **Adattamento dinamico** (parametri diversi per ogni tipologia di questionario)

> 📄 Documentazione completa: [`docs/algoritmo-score-paziente.md`](webapp/docs/algoritmo-score-paziente.md)

### Sistema di Assegnazione

Gestisce una **coda virtuale prioritaria** dei pazienti basata su:

| Fascia | Score | Finestra Temporale |
|--------|-------|--------------------|
| 🔴 Urgente | 80-100 | 3 giorni |
| 🟠 Breve | 60-79 | 10 giorni |
| 🟡 Differibile | 40-59 | 30 giorni |
| 🟢 Programmabile | 0-39 | 120 giorni |

> 📄 Documentazione completa: [`docs/assegnazione-pazienti.md`](webapp/docs/assegnazione-pazienti.md)

---

## 🛠 Tech Stack

### Backend

| Tecnologia | Utilizzo |
|------------|----------|
| **NestJS** | Framework API REST |
| **TypeScript** | Linguaggio principale |
| **PostgreSQL** | Database relazionale |
| **Drizzle ORM** | Object-Relational Mapping |
| **Passport** | Autenticazione (JWT + SAML/SPID) |
| **bcrypt** | Hashing password |
| **Nodemailer** | Invio email |
| **Jest** | Testing |

### Frontend Web

| Tecnologia | Utilizzo |
|------------|----------|
| **React 19** | UI Library |
| **TypeScript** | Linguaggio principale |
| **Vite** | Build tool |
| **React Router 7** | Routing |
| **Axios** | HTTP Client |
| **Lucide React** | Iconografia |
| **jsPDF** | Generazione PDF |

### Frontend Mobile

| Tecnologia | Utilizzo |
|------------|----------|
| **React 19** | UI Library |
| **TypeScript** | Linguaggio principale |
| **Vite** | Build tool |
| **React Router 7** | Routing |
| **Axios** | HTTP Client |
| **Lucide React** | Iconografia |

### DevOps

| Tecnologia | Utilizzo |
|------------|----------|
| **Docker** | Containerizzazione |
| **Docker Compose** | Orchestrazione |
| **npm Workspaces** | Gestione monorepo |

---

## 📁 Struttura del Progetto

```
webapp/
├── backend/
│   ├── src/
│   │   ├── amministratore/    # Moduli admin (pazienti, psicologi, invalidazioni...)
│   │   ├── auth/              # Autenticazione JWT
│   │   ├── dashboard/         # Dashboard endpoints
│   │   ├── drizzle/           # Schema DB e migrations
│   │   ├── forum-comune/      # Forum condiviso
│   │   ├── mailer/            # Servizio email
│   │   ├── notifications/     # Sistema notifiche
│   │   ├── patient/           # Moduli paziente
│   │   ├── psi/               # Moduli psicologo
│   │   ├── questionari/       # Gestione questionari
│   │   ├── spid-auth/         # Autenticazione SPID
│   │   └── ticket/            # Supporto tecnico
│   └── test/                  # Test E2E
│
├── frontend-web/
│   └── src/
│       ├── components/        # Componenti React riutilizzabili
│       ├── css/               # Fogli di stile
│       ├── images/            # Asset statici
│       ├── pages/             # Pagine (Login, Dashboard...)
│       ├── services/          # Chiamate API
│       └── types/             # TypeScript types
│
├── frontend-mobile/
│   └── src/
│       ├── assets/            # Immagini e icone
│       ├── components/        # Componenti React
│       ├── contexts/          # React Context (Notifiche, Cache)
│       ├── css/               # Fogli di stile
│       ├── pages/             # Pagine (Home, Forum, Diario...)
│       ├── services/          # Chiamate API
│       └── types/             # TypeScript types
│
├── docs/                      # Documentazione tecnica
├── docker-compose.yml         # Configurazione Docker
└── package.json               # Root package (workspaces)
```

---

## 📄 Documentazione

La documentazione tecnica è disponibile nella cartella `webapp/docs/`:

| Documento | Descrizione |
|-----------|-------------|
| [`algoritmo-score-paziente.md`](webapp/docs/algoritmo-score-paziente.md) | Algoritmo di calcolo score con decadimento esponenziale |
| [`assegnazione-pazienti.md`](webapp/docs/assegnazione-pazienti.md) | Sistema di coda prioritaria e assegnazione automatica |
| [`STREAK.md`](webapp/docs/STREAK.md) | Funzionalità di tracciamento giorni consecutivi |

---

## 🧪 Testing

### Backend

```bash
cd webapp/backend

# Unit tests
npm run test

# Test con watch mode
npm run test:watch

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

---

## 📜 Script Disponibili

### Root (`webapp/`)

| Script | Comando | Descrizione |
|--------|---------|-------------|
| `install:all` | `npm run install:all` | Installa tutte le dipendenze |
| `dev:backend` | `npm run dev:backend` | Avvia backend in dev mode |
| `dev:web` | `npm run dev:web` | Avvia frontend web |
| `dev:mobile` | `npm run dev:mobile` | Avvia frontend mobile |
| `dev:all` | `npm run dev:all` | Avvia tutti i servizi |

### Backend (`webapp/backend/`)

| Script | Comando | Descrizione |
|--------|---------|-------------|
| `start:dev` | `npm run start:dev` | Avvia in development |
| `build` | `npm run build` | Compila per produzione |
| `db:generate` | `npm run db:generate` | Genera migrations Drizzle |
| `db:migrate` | `npm run db:migrate` | Applica migrations |
| `db:seed` | `npm run db:seed` | Popola database di test |

---

## 🔐 Autenticazione

### Psicologi e Amministratori

- **JWT Token** con credenziali email/password
- Login tramite `/login` nel frontend web
- Token memorizzato in localStorage

### Pazienti

- **SPID** (Sistema Pubblico di Identità Digitale)
- Login tramite identity provider
- Redirect callback a `/spid-callback`

---

## 🤝 Contributori

Progetto sviluppato come parte del corso universitario.

---

## 📝 Licenza

Questo progetto è sotto licenza [ISC](LICENSE).

---

<p align="center">
  Made with ❤️ for mental health support
</p>
