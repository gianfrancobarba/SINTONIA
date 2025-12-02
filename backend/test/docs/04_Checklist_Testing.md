# Checklist Testing - Progetto Sintonia

## 📋 Indice

1. [Panoramica](#panoramica)
2. [Moduli da Testare](#moduli-da-testare)
3. [Checklist per Modulo](#checklist-per-modulo)
4. [Coverage Target](#coverage-target)
5. [Tracking Progress](#tracking-progress)
6. [Report Template](#report-template)

---

## 🎯 Panoramica

Questa checklist serve per tracciare il progresso del testing nel progetto Sintonia.

### Obiettivi di Coverage

| Livello | Coverage Target | Status |
|---------|----------------|--------|
| **Minimo Accettabile** | 60% | 🟡 |
| **Buono** | 80% | 🟢 |
| **Eccellente** | 90%+ | ⭐ |

### Legenda

- ✅ Completato e testato
- 🔄 In corso
- ⏳ Pianificato
- ❌ Non iniziato
- 🚫 Non applicabile

---

## 📦 Moduli da Testare

### 1. Patient Module

#### 1.1 Stato Animo (`patient/stato-animo/`)

| Componente | Tipo | Status | Coverage | Note |
|------------|------|--------|----------|------|
| `StatoAnimoService` | Service | ❌ | 0% | |
| `StatoAnimoController` | Controller | ❌ | 0% | |
| `UltimoStatoAnimoDto` | DTO | 🚫 | N/A | Solo interfaccia |
| `StoricoStatoAnimoDto` | DTO | 🚫 | N/A | Solo interfaccia |

**Test Cases da Implementare**:
- [ ] `getUltimoStatoAnimo` - con dati
- [ ] `getUltimoStatoAnimo` - senza dati (null)
- [ ] `getUltimoStatoAnimo` - campi opzionali null
- [ ] `getStoricoStatoAnimo` - con filtro 30 giorni
- [ ] `getStoricoStatoAnimo` - con filtro personalizzato
- [ ] `getStoricoStatoAnimo` - array vuoto
- [ ] `formatLocalDate` - formattazione corretta
- [ ] Controller GET `/ultimo` - success
- [ ] Controller GET `/storico` - success
- [ ] Controller - autenticazione JWT

**Coverage Attuale**: 0%  
**Coverage Target**: 85%  
**Data Inizio**: ___________  
**Data Completamento**: ___________

---

#### 1.2 Diary (`patient/diary/`)

| Componente | Tipo | Status | Coverage | Note |
|------------|------|--------|----------|------|
| `DiaryService` | Service | ❌ | 0% | |
| `DiaryController` | Controller | ❌ | 0% | |
| `CreateDiaryPageService` | Service | ❌ | 0% | |
| `CreateDiaryPageController` | Controller | ❌ | 0% | |
| `UpdateDiaryPageService` | Service | ❌ | 0% | |
| `UpdateDiaryPageController` | Controller | ❌ | 0% | |
| `DeleteDiaryPageService` | Service | ❌ | 0% | |
| `DeleteDiaryPageController` | Controller | ❌ | 0% | |

**Test Cases da Implementare**:
- [ ] `getDiaryPages` - lista pagine
- [ ] `getDiaryPages` - lista vuota
- [ ] `getLastDiaryPage` - ultima pagina
- [ ] `getLastDiaryPage` - nessuna pagina (null)
- [ ] `createDiaryPage` - creazione success
- [ ] `createDiaryPage` - validazione titolo
- [ ] `createDiaryPage` - validazione contenuto
- [ ] `updateDiaryPage` - aggiornamento success
- [ ] `updateDiaryPage` - pagina non trovata (404)
- [ ] `updateDiaryPage` - ownership validation
- [ ] `deleteDiaryPage` - eliminazione success
- [ ] `deleteDiaryPage` - pagina non trovata (404)
- [ ] `deleteDiaryPage` - ownership validation (403)

**Coverage Attuale**: 0%  
**Coverage Target**: 85%  
**Data Inizio**: ___________  
**Data Completamento**: ___________

---

#### 1.3 Badge (`patient/badge/`)

| Componente | Tipo | Status | Coverage | Note |
|------------|------|--------|----------|------|
| `BadgeService` | Service | ❌ | 0% | |
| `BadgeController` | Controller | ❌ | 0% | |

**Test Cases da Implementare**:
- [ ] `getPatientBadges` - lista badge acquisiti
- [ ] `getPatientBadges` - nessun badge
- [ ] `checkAndAwardBadges` - assegnazione badge
- [ ] `checkAndAwardBadges` - badge già acquisito
- [ ] Badge logic - primo stato d'animo
- [ ] Badge logic - 7 giorni consecutivi
- [ ] Badge logic - 30 giorni consecutivi

**Coverage Attuale**: 0%  
**Coverage Target**: 80%  
**Data Inizio**: ___________  
**Data Completamento**: ___________

---

#### 1.4 Questionario (`patient/questionario/`)

| Componente | Tipo | Status | Coverage | Note |
|------------|------|--------|----------|------|
| `QuestionarioService` | Service | ❌ | 0% | |
| `QuestionarioController` | Controller | ❌ | 0% | |
| `CompilazioneQuestionarioService` | Service | ❌ | 0% | |

**Test Cases da Implementare**:
- [ ] `getQuestionari` - lista questionari
- [ ] `getQuestionario` - dettaglio questionario
- [ ] `compilaQuestionario` - compilazione success
- [ ] `compilaQuestionario` - calcolo score
- [ ] `compilaQuestionario` - validazione risposte
- [ ] `invalidaQuestionario` - invalidazione
- [ ] `invalidaQuestionario` - ricalcolo score

**Coverage Attuale**: 0%  
**Coverage Target**: 85%  
**Data Inizio**: ___________  
**Data Completamento**: ___________

---

#### 1.5 Alert (`patient/alert/`)

| Componente | Tipo | Status | Coverage | Note |
|------------|------|--------|----------|------|
| `AlertService` | Service | ❌ | 0% | |
| `AlertController` | Controller | ❌ | 0% | |

**Test Cases da Implementare**:
- [ ] `getPatientAlerts` - lista alert
- [ ] `createAlertIfNeeded` - score >= 80
- [ ] `createAlertIfNeeded` - score < 80 (no alert)
- [ ] `createAlertIfNeeded` - screening non completo
- [ ] `createAlertIfNeeded` - alert già esistente
- [ ] `hasCompletedScreening` - tutti questionari
- [ ] `hasAlertInLastMonth` - verifica duplicati

**Coverage Attuale**: 0%  
**Coverage Target**: 85%  
**Data Inizio**: ___________  
**Data Completamento**: ___________

---

#### 1.6 Score (`patient/score/`)

| Componente | Tipo | Status | Coverage | Note |
|------------|------|--------|----------|------|
| `ScoreService` | Service | ❌ | 0% | |
| `ScoreController` | Controller | ❌ | 0% | |

**Test Cases da Implementare**:
- [ ] `getPatientScore` - recupero score
- [ ] `calculateScore` - calcolo corretto
- [ ] `updateScore` - aggiornamento
- [ ] Score logic - media ponderata
- [ ] Score logic - arrotondamento

**Coverage Attuale**: 0%  
**Coverage Target**: 85%  
**Data Inizio**: ___________  
**Data Completamento**: ___________

---

#### 1.7 Priorità (`patient/priorita/`)

| Componente | Tipo | Status | Coverage | Note |
|------------|------|--------|----------|------|
| `PrioritaService` | Service | ❌ | 0% | |
| `PrioritaController` | Controller | ❌ | 0% | |

**Test Cases da Implementare**:
- [ ] `getPriorita` - lista priorità
- [ ] `calculatePriority` - calcolo priorità
- [ ] `updatePatientPriority` - aggiornamento
- [ ] Priority logic - range score
- [ ] Priority logic - finestra temporale

**Coverage Attuale**: 0%  
**Coverage Target**: 80%  
**Data Inizio**: ___________  
**Data Completamento**: ___________

---

#### 1.8 Forum (`patient/forum/`)

| Componente | Tipo | Status | Coverage | Note |
|------------|------|--------|----------|------|
| `ForumService` | Service | ❌ | 0% | |
| `ForumController` | Controller | ❌ | 0% | |

**Test Cases da Implementare**:
- [ ] `getDomande` - lista domande
- [ ] `createDomanda` - creazione domanda
- [ ] `getRisposte` - risposte a domanda
- [ ] `createRisposta` - creazione risposta
- [ ] Validazione - titolo domanda
- [ ] Validazione - testo domanda
- [ ] Ownership - modifica domanda

**Coverage Attuale**: 0%  
**Coverage Target**: 80%  
**Data Inizio**: ___________  
**Data Completamento**: ___________

---

#### 1.9 Settings (`patient/settings/`)

| Componente | Tipo | Status | Coverage | Note |
|------------|------|--------|----------|------|
| `SettingsService` | Service | ❌ | 0% | |
| `SettingsController` | Controller | ❌ | 0% | |

**Test Cases da Implementare**:
- [ ] `getSettings` - recupero impostazioni
- [ ] `updateSettings` - aggiornamento
- [ ] Validazione - email format
- [ ] Validazione - notifiche

**Coverage Attuale**: 0%  
**Coverage Target**: 75%  
**Data Inizio**: ___________  
**Data Completamento**: ___________

---

#### 1.10 Home (`patient/home/`)

| Componente | Tipo | Status | Coverage | Note |
|------------|------|--------|----------|------|
| `HomeService` | Service | ❌ | 0% | |
| `HomeController` | Controller | ❌ | 0% | |

**Test Cases da Implementare**:
- [ ] `getDashboard` - dati dashboard
- [ ] `getDashboard` - aggregazione dati
- [ ] Dashboard - ultimo stato d'animo
- [ ] Dashboard - notifiche
- [ ] Dashboard - post suggeriti

**Coverage Attuale**: 0%  
**Coverage Target**: 80%  
**Data Inizio**: ___________  
**Data Completamento**: ___________

---

### 2. Psicologo Module

#### 2.1 Psicologo Service

| Componente | Tipo | Status | Coverage | Note |
|------------|------|--------|----------|------|
| `PsicologoService` | Service | ❌ | 0% | |
| `PsicologoController` | Controller | ❌ | 0% | |

**Test Cases da Implementare**:
- [ ] `getPazienti` - lista pazienti assegnati
- [ ] `getPatientDetails` - dettagli paziente
- [ ] `acceptAlert` - accettazione alert
- [ ] `createReport` - creazione report
- [ ] Ownership - accesso solo pazienti assegnati

**Coverage Attuale**: 0%  
**Coverage Target**: 85%  
**Data Inizio**: ___________  
**Data Completamento**: ___________

---

### 3. Amministratore Module

#### 3.1 Amministratore Service

| Componente | Tipo | Status | Coverage | Note |
|------------|------|--------|----------|------|
| `AmministratoreService` | Service | ❌ | 0% | |
| `AmministratoreController` | Controller | ❌ | 0% | |

**Test Cases da Implementare**:
- [ ] `login` - autenticazione
- [ ] `getPsicologi` - lista psicologi
- [ ] `assignPsicologo` - assegnazione
- [ ] `managePriority` - gestione priorità
- [ ] Password hashing - bcrypt

**Coverage Attuale**: 0%  
**Coverage Target**: 80%  
**Data Inizio**: ___________  
**Data Completamento**: ___________

---

### 4. Auth Module

#### 4.1 Authentication

| Componente | Tipo | Status | Coverage | Note |
|------------|------|--------|----------|------|
| `JwtStrategy` | Strategy | ❌ | 0% | |
| `JwtAuthGuard` | Guard | ❌ | 0% | |
| `SpidAuthService` | Service | ❌ | 0% | |

**Test Cases da Implementare**:
- [ ] JWT - token generation
- [ ] JWT - token validation
- [ ] JWT - token expiration
- [ ] SPID - authentication flow
- [ ] SPID - callback handling
- [ ] Guard - protected routes

**Coverage Attuale**: 0%  
**Coverage Target**: 90%  
**Data Inizio**: ___________  
**Data Completamento**: ___________

---

### 5. Database Module

#### 5.1 Drizzle ORM

| Componente | Tipo | Status | Coverage | Note |
|------------|------|--------|----------|------|
| `schema.ts` | Schema | 🚫 | N/A | Solo definizioni |
| `db.ts` | Connection | ❌ | 0% | |

**Test Cases da Implementare**:
- [ ] Connection - database connection
- [ ] Connection - error handling
- [ ] Migrations - schema sync

**Coverage Attuale**: 0%  
**Coverage Target**: 70%  
**Data Inizio**: ___________  
**Data Completamento**: ___________

---

## 📊 Coverage Target per Categoria

### Services

| Categoria | Target | Priorità |
|-----------|--------|----------|
| Core Business Logic | 90% | 🔴 Alta |
| Data Access | 85% | 🟡 Media |
| Utilities | 80% | 🟢 Bassa |

### Controllers

| Categoria | Target | Priorità |
|-----------|--------|----------|
| CRUD Operations | 85% | 🔴 Alta |
| Authentication | 90% | 🔴 Alta |
| Public Endpoints | 80% | 🟡 Media |

### DTOs

| Categoria | Target | Priorità |
|-----------|--------|----------|
| Validation Logic | 85% | 🔴 Alta |
| Simple Interfaces | N/A | 🚫 Skip |

---

## 📈 Tracking Progress

### Progress Dashboard

```
Totale Moduli: 15
Completati: 0 (0%)
In Corso: 0 (0%)
Pianificati: 0 (0%)
Non Iniziati: 15 (100%)

Coverage Globale: 0%
Coverage Target: 85%
Gap: -85%
```

### Aggiornamento Settimanale

| Settimana | Moduli Completati | Coverage | Note |
|-----------|-------------------|----------|------|
| 1 | 0 | 0% | |
| 2 | 0 | 0% | |
| 3 | 0 | 0% | |
| 4 | 0 | 0% | |

---

## 📝 Report Template

### Report Settimanale

```markdown
# Testing Report - Settimana [N]

## Sommario
- **Data**: [DATA]
- **Responsabile**: [NOME]
- **Coverage Globale**: [X]%
- **Moduli Completati**: [N]/[TOTALE]

## Progressi
### Moduli Completati
- [ ] Modulo 1 - Coverage: X%
- [ ] Modulo 2 - Coverage: X%

### Moduli in Corso
- [ ] Modulo 3 - Coverage: X% (Target: Y%)

## Issues
### Blockers
- Issue 1: Descrizione
- Issue 2: Descrizione

### Warnings
- Warning 1: Descrizione

## Metriche
- Test Scritti: [N]
- Test Passati: [N]
- Test Falliti: [N]
- Coverage Incremento: +[X]%

## Prossimi Passi
1. Completare Modulo X
2. Iniziare Modulo Y
3. Risolvere Issue Z

## Note
[Note aggiuntive]
```

---

## 🎯 Priorità Testing

### Alta Priorità (P0)

1. **Authentication** - Sicurezza critica
2. **Patient Data** - Dati sensibili
3. **Score Calculation** - Logica core
4. **Alert System** - Funzionalità critica

### Media Priorità (P1)

5. **Diary** - Feature importante
6. **Forum** - Interazione utenti
7. **Badge** - Gamification
8. **Settings** - Configurazione

### Bassa Priorità (P2)

9. **Dashboard** - Aggregazione dati
10. **Utilities** - Helper functions

---

## 📅 Timeline Suggerita

### Fase 1: Foundation (Settimane 1-2)
- [ ] Setup testing infrastructure
- [ ] Create test helpers
- [ ] Generate oracles
- [ ] Test authentication

### Fase 2: Core Features (Settimane 3-5)
- [ ] Test patient services
- [ ] Test score calculation
- [ ] Test alert system
- [ ] Test questionari

### Fase 3: Secondary Features (Settimane 6-7)
- [ ] Test diary
- [ ] Test forum
- [ ] Test badge system
- [ ] Test settings

### Fase 4: Integration & Refinement (Settimana 8)
- [ ] Integration tests
- [ ] Coverage improvement
- [ ] Bug fixes
- [ ] Documentation

---

## 🔧 Tools & Scripts

### Comandi Utili

```bash
# Esegui tutti i test
npm test

# Esegui test con coverage
npm run test:cov

# Esegui test in watch mode
npm run test:watch

# Esegui test di un modulo specifico
npm test -- stato-animo

# Genera report HTML coverage
npm run test:cov && open coverage/lcov-report/index.html

# Valida oracoli
npm run validate:oracles
```

### Script Personalizzati

Aggiungi in `package.json`:

```json
{
  "scripts": {
    "test:patient": "jest --testPathPattern=patient",
    "test:psi": "jest --testPathPattern=psi",
    "test:admin": "jest --testPathPattern=amministratore",
    "test:coverage:check": "jest --coverage --coverageThreshold='{\"global\":{\"lines\":85}}'",
    "test:report": "jest --coverage --coverageReporters=html text"
  }
}
```

---

## 📊 Metriche di Qualità

### Criteri di Accettazione

Un modulo è considerato "completato" quando:

- ✅ Coverage >= 85%
- ✅ Tutti i test passano
- ✅ Nessun test skippato
- ✅ Documentazione aggiornata
- ✅ Oracolo JSON creato
- ✅ Code review completata

### Red Flags

⚠️ **Attenzione se**:
- Coverage < 60%
- Test falliti > 5%
- Test skippati > 10%
- Nessun test per funzioni critiche
- Mock non puliti tra test

---

## 🎓 Conclusioni

Questa checklist serve come guida per il testing sistematico del progetto Sintonia. 

**Ricorda**:
- ✅ Testa prima le funzionalità critiche
- ✅ Mantieni i test semplici e leggibili
- ✅ Aggiorna la checklist regolarmente
- ✅ Documenta i problemi trovati
- ✅ Celebra i progressi! 🎉

**Risorse**:
- [Guida Unit Testing](./01_Guida_Unit_Testing_Sintonia.md)
- [Guida Jest](./02_Guida_Jest.md)
- [Guida Oracle JSON](./03_Guida_Oracle_JSON.md)
