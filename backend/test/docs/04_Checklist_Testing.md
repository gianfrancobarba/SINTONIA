# Checklist Testing - Granulare

Questa checklist traccia il progresso del testing per **ogni singolo metodo** del progetto Sintonia.

## 📌 Legenda

| Simbolo | Significato | Descrizione |
|:---:|---|---|
| ✅ | **Completato** | Testati tutti i casi (successo, errore, edge cases). Coverage 100%. |
| 🔄 | **In Corso** | Test scritti ma non completi o coverage parziale. |
| ❌ | **Non Iniziato** | Nessun test scritto per questo metodo. |
| 🚫 | **Skipped** | Metodo banale o non testabile unitariamente (es. solo log). |

---

## 📦 Patient Module

### 🎭 Stato Animo (`src/patient/stato-animo`)

#### `StatoAnimoService`
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `getUltimoStatoAnimo` | ✅ | 100% | [Report](../reports/stato-animo/get-ultimo-coverage.html) |
| `getStoricoStatoAnimo` | ✅ | 100% | [Report](../reports/stato-animo/get-storico-coverage.html) |

#### `StatoAnimoController`
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `getUltimoStatoAnimo` | ❌ | 0% | |
| `getStoricoStatoAnimo` | ❌ | 0% | |

### 📔 Diary (`src/patient/diary`)

#### `DiaryService`
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `getDiaryPages` | ❌ | 0% | |
| `getLastDiaryPage` | ❌ | 0% | |

#### `DiaryController`
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `getDiaryPages` | ❌ | 0% | |
| `getLastDiaryPage` | ❌ | 0% | |

#### `CreateDiaryPage`
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `createDiaryPage` (Service) | ❌ | 0% | |
| `createDiaryPage` (Controller) | ❌ | 0% | |

#### `UpdateDiaryPage`
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `updateDiaryPage` (Service) | ❌ | 0% | |
| `updateDiaryPage` (Controller) | ❌ | 0% | |

#### `DeleteDiaryPage`
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `deleteDiaryPage` (Service) | ❌ | 0% | |
| `deleteDiaryPage` (Controller) | ❌ | 0% | |

### 🏆 Badge (`src/patient/badge`)

#### `BadgeService` & `Controller`
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `getBadgeUtente` (Service) | ❌ | 0% | |
| `getBadgeUtente` (Controller) | ❌ | 0% | |

### 📝 Questionario (`src/patient/questionario`)

#### `CompilazioneQuestionario`
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `getQuestionarioDto` (Service) | ❌ | 0% | |
| `calculateScore` (Service) | ❌ | 0% | |
| `submitQuestionario` (Service) | ❌ | 0% | |
| `startCompilazione` (Service) | ❌ | 0% | |
| `getQuestionario` (Controller) | ❌ | 0% | |
| `submitQuestionario` (Controller) | ❌ | 0% | |
| `startCompilazione` (Controller) | ❌ | 0% | |

#### `VisualizzazioneListaQuestionari`
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `getStoricoQuestionari` (Service) | ❌ | 0% | |
| `hasCompletedInitialQuestionnaires` (Service) | ❌ | 0% | |
| `getStoricoQuestionari` (Controller) | ❌ | 0% | |
| `checkInitialQuestionnaires` (Controller) | ❌ | 0% | |

### 💬 Forum (`src/patient/forum`)

#### `ForumService` & `Controller`
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `getMyQuestions` | ❌ | 0% | |
| `getPublicQuestions` | ❌ | 0% | |

#### `Gestione Domande`
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `inserisciDomanda` | ❌ | 0% | |
| `modificaDomanda` | ❌ | 0% | |
| `eliminaDomanda` | ❌ | 0% | |

### 📊 Score (`src/patient/score`)

#### `ScoreService`
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `hasCompletedScreening` | ❌ | 0% | |
| `calculatePatientScore` | ❌ | 0% | |
| `updatePatientScore` | ❌ | 0% | |
| `updatePatientScoreOnly` | ❌ | 0% | |
| `getPatientScore` | ❌ | 0% | |

#### `ScoreController`
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `getScore` | ❌ | 0% | |

### 👤 Area Personale (`src/patient/area-personale`)

#### `AreaPersonale`
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `getProfile` | ❌ | 0% | |
| `updateProfile` | ❌ | 0% | |

### 🏠 Home (`src/patient/home`)

#### `Home`
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `getDashboardData` (Service) | ❌ | 0% | |
| `getDashboard` (Controller) | ❌ | 0% | |

### 🚨 Alert (`src/patient/alert`)

#### `Alert`
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `getPatientAlerts` | ❌ | 0% | |
| `createAlertIfNeeded` | ❌ | 0% | |

### ⭐ Priorità (`src/patient/priorita`)

#### `Priorita`
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `getPriorita` | ❌ | 0% | |
| `calculatePriority` | ❌ | 0% | |

### ⚙️ Settings (`src/patient/settings`)

#### `Settings`
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `getSettings` | ❌ | 0% | |
| `updateSettings` | ❌ | 0% | |

### 📜 Terms (`src/patient/terms`)

#### `Terms`
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `getTerms` | ❌ | 0% | |
| `acceptTerms` | ❌ | 0% | |

---

## 📦 Psicologo Module

### 📊 Dashboard (`src/psi/dashboard`)
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `getDashboardData` | ❌ | 0% | |

### 👥 Pazienti (`src/psi/pazienti`)
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `getPazientiByPsicologo` | ❌ | 0% | |
| `getDettaglioPaziente` | ❌ | 0% | |
| `cercaPazientePerNome` | ❌ | 0% | |
| `terminaCura` | ❌ | 0% | |

### 📝 Questionari (`src/psi/questionari`)
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `getNonRevisionatiByPsicologo` | ❌ | 0% | |
| `getTuttiNonInvalidati` | ❌ | 0% | |
| `getQuestionariByPaziente` | ❌ | 0% | |
| `getQuestionarioById` | ❌ | 0% | |
| `revisionaQuestionario` | ❌ | 0% | |
| `richiestaInvalidazione` | ❌ | 0% | |

### 🚨 Alert Clinici (`src/psi/alert-clinici`)
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `getAlertNonAccettati` | ❌ | 0% | |
| `accettaAlert` | ❌ | 0% | |

### 💬 Forum (`src/psi/forum`)
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `getAllQuestions` | ❌ | 0% | |
| `getMyAnswers` | ❌ | 0% | |
| `getUnansweredQuestions` | ❌ | 0% | |
| `createAnswer` | ❌ | 0% | |
| `updateAnswer` | ❌ | 0% | |
| `deleteAnswer` | ❌ | 0% | |

### 👤 Area Personale (`src/psi/area-personale`)
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `getProfile` | ❌ | 0% | |
| `updateProfile` | ❌ | 0% | |

---

## 📦 Amministratore Module

### 👥 Pazienti (`src/amministratore/pazienti`)
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `cercaPazienti` | ❌ | 0% | |
| `getPazienti` | ❌ | 0% | |
| `getDettaglioPaziente` | ❌ | 0% | |
| `modificaPaziente` | ❌ | 0% | |

### 🧠 Psicologi (`src/amministratore/psicologi`)
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `cercaPsicologi` | ❌ | 0% | |
| `getPsicologi` | ❌ | 0% | |
| `getDettaglioPsicologo` | ❌ | 0% | |
| `creaPsicologo` | ❌ | 0% | |
| `modificaPsicologo` | ❌ | 0% | |

### 📝 Questionari (`src/amministratore/questionari`)
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `getQuestionari` | ❌ | 0% | |
| `getDettaglioQuestionario` | ❌ | 0% | |
| `annullaRevisione` | ❌ | 0% | |

---

## 🔐 Auth Module (`src/auth`)

### `AuthService` & `Controller`
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `validateUser` | ❌ | 0% | |
| `login` | ❌ | 0% | |
| `getProfile` | ❌ | 0% | |

### `SpidAuth`
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `getLoginUrl` | ❌ | 0% | |
| `handleCallback` | ❌ | 0% | |

---

## 📤 Uploads Module (`src/uploads`)

### `UploadsController`
| Metodo | Status | Coverage | Note |
|---|:---:|:---:|---|
| `uploadFile` | ❌ | 0% | |
| `getFile` | ❌ | 0% | |
