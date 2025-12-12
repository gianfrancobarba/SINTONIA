# Test Case Report: Inserimento Domanda Forum

**Modulo**: Patient / Forum  
**Service**: `InserimentoDomandaService`  
**Oracle File**: `backend/test/oracles/inserimento-domanda-oracle.json`

---

## 1. Analisi dei Parametri

### Parametro: Titolo domanda
**Nome categoria:** Scelta per la categoria

| **Lunghezza [LTI]** |
|:---|
| **1a.** Lunghezza <= 0 = false [error] |
| **1b.** Lunghezza > 64 = false [error] |
| **2.** 0 < Lunghezza <= 64 = true [PROPERTY LTI_OK] |

---

### Parametro: Testo del messaggio
**Nome categoria:** Scelta per la categoria

| **Lunghezza [LTE]** |
|:---|
| **1.** Lunghezza <= 0 = false [error] |
| **2.** Lunghezza > 0 = true [PROPERTY LTE_OK] |

---

### Parametro: Categoria Tematica
**Nome categoria:** Scelta per la categoria

| **Scelta [SC]** |
|:---|
| **1.** Nessuna Categoria Tematica selezionata = false [error] |
| **2.** Categoria Tematica selezionata = true [PROPERTY SC_OK] |

---

## 1.2 Analisi dei Parametri - Unit 2: Inserimento Domanda (service)

### Parametro: Risultato Inserimento Database
**Nome categoria:** Operazione Database

| **Esito [DB]** |
|:---|
| **1.** Inserimento fallito (nessun ID ritornato) = false [error] |
| **2.** Inserimento riuscito (ID ritornato) = true [PROPERTY DB_OK] |

---

### Parametro: Assegnazione Badge
**Nome categoria:** Operazione Badge Service

| **Esito [BADGE]** |
|:---|
| **1.** Servizio badge chiamato correttamente = true [PROPERTY BADGE_OK] |

---

## 1.3 Analisi dei Parametri - Unit 3: Inserimento Domanda (controller)

### Parametro: User ID dalla Request
**Nome categoria:** Estrazione Parametri Request

| **Estrazione [REQ_ID]** |
|:---|
| **1.** User ID presente in request.user.id = true [PROPERTY REQ_ID_OK] |

---

### Parametro: Delega al Service
**Nome categoria:** Chiamata Service Layer

| **Delega [SVC_CALL]** |
|:---|
| **1.** Service chiamato con parametri corretti (id, dto) = true [PROPERTY SVC_CALL_OK] |

---

### Parametro: Ritorno Risposta
**Nome categoria:** Response Handling

| **Risposta [RESP]** |
|:---|
| **1.** Controller ritorna esattamente il risultato del service = true [PROPERTY RESP_OK] |

---

## 2. Mapping Test Unitari

### Unit 1: Metodo `validazione` (Service)
**File**: `backend/test/unit/patient/forum/inserimento_domanda.validazione.spec.ts`

| ID Unit Test | Descrizione | Test Frame Coperto |
|:--- |:--- |:--- |
| **TC_RF23_1_EMPTY_TITLE** | Titolo vuoto (length = 0) | LTI 1a |
| **TC_RF23_1_LONG_TITLE** | Titolo > 64 caratteri | LTI 1b |
| **TC_RF23_2_EMPTY_TEXT** | Testo vuoto | LTE 1 |
| **TC_RF23_3_EMPTY_CATEGORY** | Categoria mancante | SC 1 |
| **TC_RF23_3_LONG_CATEGORY** | Categoria > 128 caratteri | SC 1 (variant) |

### Unit 2: Metodo `inserisciDomanda` (Service)
**File**: `backend/test/unit/patient/forum/inserimento_domanda.inserimento.spec.ts`

| ID Unit Test | Descrizione | Test Frame Coperto |
|:--- |:--- |:--- |
| **TC_RF23_4_SUCCESS** | Inserimento corretto con valori validi | LTI 2, LTE 2, SC 2, DB 2, BADGE 1 |
| **TC_DB_ERROR** | Errore inserimento database | DB 1 |


### Unit 3: Metodo `inserisciDomanda` (Controller)
**File**: `backend/test/unit/patient/forum/inserimento_domanda.controller.spec.ts`

| ID Unit Test | Descrizione | Test Frame Coperto |
|:--- |:--- |:--- |
| **TC_CTRL_DELEGATION** | Estrazione user ID e delega al service | REQ_ID 1, SVC_CALL 1, RESP 1 |

