# Algoritmo di Decadimento Esponenziale per Score Paziente

## Documento Tecnico

**Versione:** 1.0  
**Data:** 01/12/2025  
**Autore:** Sistema Sintonia  
**Contesto:** Gestione coda prioritaria pazienti a rischio psicologico

---

## Executive Summary

Questo documento descrive l'algoritmo di **decadimento esponenziale** implementato per il calcolo dello score dei pazienti nel sistema Sintonia. L'algoritmo è stato progettato specificamente per un contesto clinico di gestione della salute mentale, bilanciando la necessità di:

1. **Rilevare peggioramenti recenti** (alta sensibilità ai cambiamenti)
2. **Mantenere memoria storica** (considerazioni etiche)
3. **Adattarsi dinamicamente** (diverse tipologie di questionari)

---

## Perché Questa è la Miglior Soluzione

### 1. **Contesto Clinico Richiede Sensibilità Temporale**

**Problema con media semplice:**
```
Paziente A: [60, 60, 60, 90] → Media: 67.5
Paziente B: [90, 60, 60, 60] → Media: 67.5
```

Entrambi hanno lo stesso score, ma:
- **Paziente A:** Sta peggiorando (ultimo questionario 90)
- **Paziente B:** Sta migliorando (ultimo questionario 60)

**Con decadimento esponenziale:**
```
Paziente A: Score ~78 (peso maggiore su 90 recente)
Paziente B: Score ~62 (peso maggiore su 60 recente)
```

✅ **L'algoritmo cattura correttamente il trend**

---

### 2. **Adattamento Dinamico alle Tipologie**

Ogni questionario ha frequenze diverse:
- **PHQ-9:** 14 giorni (depressione - monitoraggio frequente)
- **WHO-5:** 30 giorni (benessere generale)
- **PC-PTSD-5:** 90 giorni (PTSD - valutazione a lungo termine)

**Problema con peso fisso:**
- Un questionario PHQ-9 di 14 giorni fa dovrebbe pesare diversamente da un PC-PTSD-5 di 14 giorni fa

**Soluzione:**
- λ calcolato dinamicamente per ogni tipologia
- Il decadimento si adatta al `tempoSomministrazione`

---

### 3. **Considerazioni Etiche: Peso Minimo 20%**

**Perché NON scendere sotto il 20%?**

In un contesto di salute mentale:
- ❌ **Rischio:** Ignorare completamente episodi critici passati
- ❌ **Problema:** Un paziente con storia di crisi potrebbe sembrare "guarito" solo perché i questionari recenti sono buoni
- ✅ **Soluzione:** Anche il questionario più vecchio vale almeno il 20%

**Esempio critico:**
```
Paziente con tentativo di suicidio 6 mesi fa (score 95)
Questionari recenti: [60, 55, 58]

Con peso minimo 20%: Score ~62 (mantiene traccia del rischio)
Senza peso minimo: Score ~58 (storia critica ignorata)
```

**Conclusione etica:** Il 20% garantisce che la **storia clinica non venga mai completamente dimenticata**.

---

### 4. **N = 3 Cicli: Bilanciamento Ottimale**

**Perché 3 compilazioni?**

| Aspetto | n=2 | **n=3** | n=4 |
|---------|-----|---------|-----|
| **Sensibilità recente** | Alta | **Bilanciata** | Bassa |
| **Memoria storica** | Bassa | **Bilanciata** | Alta |
| **PHQ-9 (14gg)** | 28 giorni | **42 giorni** | 56 giorni |
| **WHO-5 (30gg)** | 60 giorni | **90 giorni** | 120 giorni |
| **Clinicamente** | Troppo rapido | **Ottimale** | Troppo lento |

**n=3** è il punto di equilibrio tra:
- ✅ Catturare trend recenti (6 settimane per PHQ-9)
- ✅ Mantenere contesto storico (3 mesi per WHO-5)
- ✅ Evitare oscillazioni eccessive

---

## Come Funziona l'Algoritmo

### Step 1: Verifica Screening Completo

```typescript
// Verifica che il paziente abbia compilato tutti i 4 questionari di screening
const SCREENING_QUESTIONNAIRES = ['PHQ-9', 'GAD-7', 'WHO-5', 'PC-PTSD-5'];

if (!hasCompletedScreening(idPaziente)) {
    return null; // Score non calcolabile
}
```

**Motivazione:** Lo score ha senso solo con una baseline completa.

---

### Step 2: Raggruppa Questionari per Tipologia

```typescript
// Esempio dati paziente
Questionari = [
    { tipo: 'PHQ-9', score: 60, data: '2025-10-01' },
    { tipo: 'PHQ-9', score: 70, data: '2025-10-15' },
    { tipo: 'PHQ-9', score: 85, data: '2025-11-01' },
    { tipo: 'WHO-5', score: 75, data: '2025-10-10' },
    { tipo: 'WHO-5', score: 80, data: '2025-11-10' },
]

// Raggruppamento
perTipologia = {
    'PHQ-9': [60, 70, 85],
    'WHO-5': [75, 80]
}
```

---

### Step 3: Calcola λ per Ogni Tipologia

**Formula:**
```
λ = ln(PESO_MINIMO) / (-N_CICLI_DECADIMENTO * tempoSomministrazione)
```

**Esempio PHQ-9:**
```
PESO_MINIMO = 0.20
N_CICLI_DECADIMENTO = 3
tempoSomministrazione = 14 giorni

λ = ln(0.20) / (-3 * 14)
λ = -1.609 / -42
λ = 0.0383
```

**Esempio WHO-5:**
```
tempoSomministrazione = 30 giorni

λ = ln(0.20) / (-3 * 30)
λ = -1.609 / -90
λ = 0.0179
```

**Interpretazione:**
- λ più alto → decadimento più rapido (PHQ-9)
- λ più basso → decadimento più lento (WHO-5)

---

### Step 4: Calcola Peso per Ogni Questionario

**Formula:**
```
peso = max(e^(-λ * giorni_da_oggi), PESO_MINIMO)
```

**Esempio PHQ-9 (λ = 0.0383):**

| Questionario | Data | Giorni da oggi | Peso calcolato | Peso finale |
|--------------|------|----------------|----------------|-------------|
| Q3 | 01/11/2025 | 0 | e^(-0.0383 * 0) = **1.00** | **1.00** (100%) |
| Q2 | 15/10/2025 | 17 | e^(-0.0383 * 17) = **0.51** | **0.51** (51%) |
| Q1 | 01/10/2025 | 31 | e^(-0.0383 * 31) = **0.31** | **0.31** (31%) |

**Dopo 42 giorni (3 cicli):**
```
peso = e^(-0.0383 * 42) = 0.20 → Raggiunge peso minimo
```

---

### Step 5: Calcola Media Ponderata per Tipologia

**Formula:**
```
score_tipologia = Σ(score_i * peso_i) / Σ(peso_i)
```

**Esempio PHQ-9:**
```
Questionari: [60, 70, 85]
Pesi: [0.31, 0.51, 1.00]

Numeratore: (60 * 0.31) + (70 * 0.51) + (85 * 1.00) = 18.6 + 35.7 + 85.0 = 139.3
Denominatore: 0.31 + 0.51 + 1.00 = 1.82

Score PHQ-9 = 139.3 / 1.82 = 76.5
```

**Interpretazione:** Il questionario più recente (85) ha maggiore influenza, ma la storia (60, 70) è ancora considerata.

---

### Step 6: Aggrega con Media Semplice

**Formula:**
```
score_finale = Σ(score_tipologia) / numero_tipologie
```

**Esempio:**
```
Score PHQ-9 = 76.5
Score GAD-7 = 68.0
Score WHO-5 = 72.0
Score PC-PTSD-5 = 65.0

Score Finale = (76.5 + 68.0 + 72.0 + 65.0) / 4 = 70.4
```

---

## Esempio Completo: Caso Reale

### Paziente con Peggioramento Recente

**Storia:**
```
PHQ-9:
- 90 giorni fa: score 50 (stabile)
- 60 giorni fa: score 55 (lieve peggioramento)
- 30 giorni fa: score 65 (peggioramento)
- Oggi: score 85 (peggioramento significativo)
```

**Calcolo con Media Semplice:**
```
(50 + 55 + 65 + 85) / 4 = 63.75
```

**Calcolo con Decadimento Esponenziale:**
```
λ = 0.0383

Pesi:
- 90 giorni: e^(-0.0383 * 90) = 0.03 → 0.20 (minimo)
- 60 giorni: e^(-0.0383 * 60) = 0.10 → 0.20 (minimo)
- 30 giorni: e^(-0.0383 * 30) = 0.32
- Oggi: 1.00

Score = (50*0.20 + 55*0.20 + 65*0.32 + 85*1.00) / (0.20+0.20+0.32+1.00)
Score = (10 + 11 + 20.8 + 85) / 1.72
Score = 126.8 / 1.72 = 73.7
```

**Confronto:**
- Media semplice: **63.75** (sottostima il rischio)
- Decadimento esponenziale: **73.7** (cattura il peggioramento)

✅ **Il paziente viene correttamente identificato come a rischio più alto**

---

## Vantaggi dell'Algoritmo

### 1. **Clinicamente Accurato**
- ✅ Cattura trend e peggioramenti recenti
- ✅ Mantiene memoria storica (etico)
- ✅ Adattabile a diverse patologie

### 2. **Matematicamente Robusto**
- ✅ Formula esponenziale ben definita
- ✅ Parametri configurabili (λ, peso minimo, n)
- ✅ Comportamento prevedibile

### 3. **Dinamico e Scalabile**
- ✅ Si adatta automaticamente a nuove tipologie
- ✅ Non richiede configurazione manuale
- ✅ Funziona con frequenze diverse

### 4. **Eticamente Responsabile**
- ✅ Non ignora mai completamente la storia
- ✅ Peso minimo 20% garantisce tracciabilità
- ✅ Bilanciamento tra presente e passato

---

## Parametri di Configurazione

### Costanti Definite

```typescript
const PESO_MINIMO = 0.20;           // 20% - peso minimo garantito
const N_CICLI_DECADIMENTO = 3;      // Raggiunge peso minimo dopo 3 compilazioni
```

### Perché Questi Valori?

**PESO_MINIMO = 0.20:**
- Garantisce che anche questionari vecchi mantengano rilevanza
- Valore etico per contesto clinico
- Evita di "dimenticare" episodi critici

**N_CICLI_DECADIMENTO = 3:**
- Bilanciamento ottimale tra sensibilità e stabilità
- 6 settimane per PHQ-9, 3 mesi per WHO-5
- Clinicamente sensato per monitoraggio salute mentale

---

## Confronto con Alternative

| Approccio | Pro | Contro | Adatto? |
|-----------|-----|--------|---------|
| **Media Semplice** | Semplice | Non cattura trend | ❌ No |
| **Solo Ultimo** | Molto sensibile | Ignora storia | ❌ No |
| **Finestra Temporale** | Semplice | Soglia arbitraria | ⚠️ Parziale |
| **Decadimento Lineare** | Intuitivo | Non adattabile | ⚠️ Parziale |
| **Decadimento Esponenziale** | Bilanciato, adattabile, etico | Più complesso | ✅ **Sì** |

---

## Conclusioni

L'algoritmo di **decadimento esponenziale con peso minimo 20% e n=3 cicli** rappresenta la **miglior soluzione** per il calcolo dello score paziente nel sistema Sintonia perché:

1. ✅ **Clinicamente accurato:** Cattura peggioramenti recenti mantenendo contesto storico
2. ✅ **Eticamente responsabile:** Non dimentica mai completamente la storia del paziente
3. ✅ **Dinamicamente adattabile:** Funziona con qualsiasi tipologia di questionario
4. ✅ **Matematicamente robusto:** Formula ben definita e prevedibile
5. ✅ **Scalabile:** Si adatta automaticamente a nuovi questionari futuri

Questo approccio garantisce una **gestione della coda prioritaria** che è sia **sensibile ai cambiamenti** sia **rispettosa della storia clinica completa** del paziente.

---

## Riferimenti Tecnici

- **File:** `backend/src/patient/score/score.service.ts`
- **Metodo:** `calculatePatientScore(idPaziente: string)`
- **Parametri:** PESO_MINIMO = 0.20, N_CICLI_DECADIMENTO = 3
- **Formula λ:** `ln(0.20) / (-3 * tempoSomministrazione)`
- **Formula peso:** `max(e^(-λ * giorni), 0.20)`
