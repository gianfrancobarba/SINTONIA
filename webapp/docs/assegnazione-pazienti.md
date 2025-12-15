# Sistema di Assegnazione Pazienti

## Panoramica

Il sistema di assegnazione pazienti gestisce una **coda virtuale** che determina l'ordine di priorità per l'assegnazione dei pazienti agli psicologi. La coda non esiste fisicamente nel database, ma viene calcolata dinamicamente ad ogni operazione significativa.

---

## Concetti Chiave

### Fascia di Priorità

Ogni paziente è associato a una fascia di priorità basata sul suo score clinico:

| Fascia | Score Range | Finestra Temporale |
|--------|-------------|-------------------|
| **Urgente** | 80 - 100 | 3 giorni |
| **Breve** | 60 - 79.99 | 10 giorni |
| **Differibile** | 40 - 59.99 | 30 giorni |
| **Programmabile** | 0 - 39.99 | 120 giorni |

### Data di Scadenza (Virtuale)

Per ogni paziente in coda viene calcolata una **data di scadenza**:

```
Data_Scadenza = Data_Base + Finestra_Temporale
```

Dove **Data_Base** è:
- La data dell'**ultimo questionario con cambiamento=true** (se esiste)
- Oppure la **data di ingresso in piattaforma** (fallback)

Il campo `cambiamento=true` indica che il questionario ha causato un cambio di fascia di priorità.

---

## Coda Virtuale

### Come Funziona

1. Si recuperano tutti i pazienti **attivi** (`stato=true`) e **non assegnati** (`id_psicologo IS NULL`)
2. Per ciascun paziente si calcola la **data di scadenza**
3. I pazienti vengono ordinati per data di scadenza **crescente**
4. Il primo in coda (data scadenza minore) ha la **priorità massima**

### Esempio

| Paziente | Data Base | Fascia | Finestra | Data Scadenza | Posizione |
|----------|-----------|--------|----------|---------------|-----------|
| Anna | 15/10/2024 | Breve | 10 gg | 25/10/2024 | **1° (priorità)** |
| Luca | 01/10/2024 | Differibile | 30 gg | 31/10/2024 | **2°** |
| Mario | 01/11/2024 | Urgente | 3 gg | 04/11/2024 | **3°** |

---

## Trigger di Assegnazione

### 1. Termina Cura

Quando uno psicologo clicca su **"Termina Cura"**:

1. Il paziente viene disattivato (`stato=false`)
2. Il sistema cerca il **primo paziente in coda**
3. Il nuovo paziente viene assegnato allo psicologo

**Endpoint:** `DELETE /psi/patients/:idPaziente/termina-cura`

### 2. Nuovo Psicologo

Quando l'admin inserisce un **nuovo psicologo**:

1. Lo psicologo viene creato nel database
2. Il sistema assegna fino a **8 pazienti** dalla coda
3. Viene inviata notifica all'admin con il conteggio

**Endpoint:** `POST /amministratore/psicologi`

---

## Vincoli

- **Massimo 8 pazienti per psicologo**: Uno psicologo non può avere più di 8 pazienti attivi contemporaneamente
- **Solo pazienti attivi**: I pazienti con `stato=false` non vengono considerati nel conteggio né nella coda
- **Solo pazienti non assegnati**: Solo chi ha `id_psicologo=NULL` è in coda

---

## API Endpoints

### Visualizzazione Coda

```
GET /psi/assegnazione/coda
```

Restituisce la coda ordinata con tutti i pazienti in attesa.

**Response:**
```json
{
  "totalePazientiInCoda": 15,
  "pazienti": [
    {
      "idPaziente": "uuid",
      "nome": "Mario",
      "cognome": "Rossi",
      "priorita": "Urgente",
      "dataScadenza": "2024-11-04T00:00:00Z"
    }
  ]
}
```

### Prossimo Paziente

```
GET /psi/assegnazione/prossimo
```

Restituisce il primo paziente in coda (quello che verrà assegnato).

### Conteggio Pazienti Psicologo

```
GET /psi/assegnazione/psicologo/:id/count
```

Restituisce quanti pazienti attivi ha uno psicologo.

**Response:**
```json
{
  "psychologistId": "RSSMRA80A01H501Z",
  "pazientiAttuali": 5,
  "massimoConsentito": 8,
  "puoRicevereNuoviPazienti": true
}
```

### Termina Cura Manuale

```
POST /psi/assegnazione/termina-cura
```

**Body:**
```json
{
  "idPaziente": "uuid-paziente",
  "idPsicologo": "CODICE-FISCALE"
}
```

### Assegnazione Nuovo Psicologo

```
POST /psi/assegnazione/nuovo-psicologo
```

**Body:**
```json
{
  "idPsicologo": "CODICE-FISCALE"
}
```

---

## File Sorgente

| File | Descrizione |
|------|-------------|
| `assegnazione.service.ts` | Logica di business (coda, calcolo scadenza, assegnazione) |
| `assegnazione.controller.ts` | Endpoint REST |
| `assegnazione.module.ts` | Modulo NestJS |
| `termina-cura.service.ts` | Integrazione con termina cura |
| `creazione_psicologo_amministratore.service.ts` | Integrazione con creazione psicologo |

---

## Diagramma di Flusso

```
┌─────────────────────────────────────────────────────────────┐
│                    TERMINA CURA                              │
├─────────────────────────────────────────────────────────────┤
│  1. Psicologo clicca "Termina Cura"                         │
│  2. Paziente.stato = false                                   │
│  3. getPsychologistPatientCount() → conta pazienti attivi    │
│  4. getNextPatientInQueue() → primo in coda                  │
│  5. assignPatientToPsychologist() → assegna nuovo paziente   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    NUOVO PSICOLOGO                           │
├─────────────────────────────────────────────────────────────┤
│  1. Admin crea nuovo psicologo                               │
│  2. Loop (max 8 volte):                                      │
│     - getNextPatientInQueue()                                │
│     - assignPatientToPsychologist()                          │
│  3. Notifica admin con conteggio                             │
└─────────────────────────────────────────────────────────────┘
```
