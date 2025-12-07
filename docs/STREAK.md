# Streak - Funzionalità di Tracciamento Giornaliero

## Descrizione

La streak traccia i **giorni consecutivi** in cui il paziente inserisce il proprio stato d'animo. È un meccanismo di gamification per incentivare l'uso quotidiano dell'app.

## Come Funziona

### Calcolo della Streak

1. Il sistema parte dalla **data odierna** e conta all'indietro
2. Per ogni giorno con almeno un inserimento di stato d'animo, incrementa il contatore
3. Al primo giorno **senza** inserimento, si ferma

**Esempio:**
- Oggi è il 6 dicembre
- Ho inserito mood il 6, 5, 4, 3 dicembre ma **non** il 2 dicembre
- **Risultato:** streak = 4 giorni

### Sistema di Livelli

| Giorni Consecutivi | Livello |
|--------------------|---------|
| 0-6                | 0       |
| 7-13               | 1       |
| 14-20              | 2       |
| 21-27              | 3       |
| ...                | ...     |

**Formula:** `livello = giorni ÷ 7` (arrotondato per difetto)

### Progress Bar

La barra di progresso nel frontend mostra **7 segmenti** che rappresentano la settimana corrente:

- 1 giorno → 1/7 segmenti attivi
- 4 giorni → 4/7 segmenti attivi  
- 7 giorni → 7/7 segmenti attivi → **Livello UP!**

## File Coinvolti

### Backend
- `src/patient/home/home.service.ts` → `getConsecutiveMoodDays()`
- `src/patient/home/dto/home-dashboard.dto.ts` → `currentStreakDays`, `streakLevel`, `streakProgress`

### Frontend
- `src/components/StreakStatus.tsx` → Componente UI
- `src/types/home.ts` → `HomeDashboardDto`
- `src/css/StreakStatus.css` → Stili

## Reset della Streak

La streak si **resetta a 0** se:
- Il paziente non inserisce lo stato d'animo per un giorno intero
- Il giorno "mancante" interrompe la catena di giorni consecutivi

## Note

- La streak viene calcolata dinamicamente ad ogni accesso alla home
- Non è salvata nel database, viene ricalcolata dalla tabella `stato_animo`
- Un paziente può inserire più stati d'animo nello stesso giorno, conta solo che ce ne sia almeno uno
