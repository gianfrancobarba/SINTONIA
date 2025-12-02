# Guida al Unit Testing - Progetto Sintonia

## 📋 Indice

1. [Introduzione](#introduzione)
2. [Cos'è il Unit Testing](#cosè-il-unit-testing)
3. [Architettura del Testing in Sintonia](#architettura-del-testing-in-sintonia)
4. [Esempio Pratico: Testing del StatoAnimoService](#esempio-pratico-testing-del-statoan

imoservice)
5. [Best Practices](#best-practices)
6. [Code Coverage](#code-coverage)
7. [Troubleshooting](#troubleshooting)

---

## 📖 Introduzione

Questa guida fornisce una panoramica completa sul **unit testing** nel progetto Sintonia, con esempi pratici basati sul codice reale del progetto.

### Obiettivi della Guida

- ✅ Comprendere i concetti fondamentali del unit testing
- ✅ Imparare a scrivere test efficaci per NestJS
- ✅ Applicare le best practices al progetto Sintonia
- ✅ Misurare e migliorare il code coverage

---

## 🎯 Cos'è il Unit Testing

### Definizione

Il **unit testing** è una metodologia di testing del software che verifica il corretto funzionamento di **singole unità** di codice in **isolamento**.

### Caratteristiche Principali

| Caratteristica | Descrizione |
|----------------|-------------|
| **Isolamento** | Ogni test verifica una singola unità (funzione, metodo, classe) |
| **Indipendenza** | I test non dipendono l'uno dall'altro |
| **Ripetibilità** | Ogni test produce sempre lo stesso risultato |
| **Velocità** | I test unitari sono veloci da eseguire |
| **Automatizzazione** | I test vengono eseguiti automaticamente |

### Vantaggi

✅ **Rilevamento precoce dei bug**: I problemi vengono identificati durante lo sviluppo  
✅ **Documentazione vivente**: I test documentano il comportamento atteso del codice  
✅ **Refactoring sicuro**: Modifiche al codice possono essere verificate immediatamente  
✅ **Design migliore**: Scrivere test porta a codice più modulare e testabile  

---

## 🏗️ Architettura del Testing in Sintonia

### Stack Tecnologico

Il progetto Sintonia utilizza:

- **Jest**: Framework di testing JavaScript/TypeScript
- **@nestjs/testing**: Utilities NestJS per il testing
- **ts-jest**: Preprocessore TypeScript per Jest
- **supertest**: Testing HTTP per endpoint REST (E2E)

### Struttura delle Directory

```
backend/
├── src/
│   ├── patient/
│   │   ├── stato-animo/
│   │   │   ├── stato-animo.service.ts
│   │   │   ├── stato-animo.service.spec.ts    ← Test file
│   │   │   ├── stato-animo.controller.ts
│   │   │   └── stato-animo.controller.spec.ts ← Test file
│   │   └── ...
│   └── ...
├── test/
│   ├── jest-e2e.json                           ← Config E2E
│   └── ...
├── coverage/                                    ← Report coverage (generato)
└── package.json                                 ← Config Jest
```

### Configurazione Jest

Il file `package.json` contiene la configurazione Jest:

```json
{
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": ["**/*.(t|j)s"],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
```

**Spiegazione**:
- `testRegex`: Cerca file che terminano con `.spec.ts`
- `rootDir`: Directory radice dei test (`src/`)
- `coverageDirectory`: Dove salvare i report di coverage
- `testEnvironment`: Ambiente Node.js (non browser)

---

## 🔬 Esempio Pratico: Testing del StatoAnimoService

### Scenario

Vogliamo testare il `StatoAnimoService`, che gestisce gli stati d'animo dei pazienti.

### Codice da Testare

```typescript
// stato-animo.service.ts
@Injectable()
export class StatoAnimoService {
    async getUltimoStatoAnimo(userId: string): Promise<UltimoStatoAnimoDto | null> {
        const rows = await db
            .select({
                umore: statoAnimo.umore,
                intensita: statoAnimo.intensita,
                note: statoAnimo.note,
                dataInserimento: statoAnimo.dataInserimento,
            })
            .from(statoAnimo)
            .where(eq(statoAnimo.idPaziente, userId))
            .orderBy(desc(statoAnimo.dataInserimento))
            .limit(1);

        if (rows.length === 0) {
            return null;
        }

        return {
            umore: rows[0].umore,
            intensita: rows[0].intensita ?? undefined,
            note: rows[0].note ?? undefined,
            dataInserimento: rows[0].dataInserimento,
        };
    }
}
```

### Passo 1: Creare il File di Test

Creare il file `stato-animo.service.spec.ts` nella stessa directory del service.

### Passo 2: Importare le Dipendenze

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { StatoAnimoService } from './stato-animo.service';
import { db } from '../../drizzle/db.js';

// Mock del database
jest.mock('../../drizzle/db.js', () => ({
    db: {
        select: jest.fn(),
    },
}));
```

**Spiegazione**:
- `Test` e `TestingModule`: Utilities NestJS per creare moduli di test
- `jest.mock()`: Crea un mock del database per isolare il service

### Passo 3: Struttura del Test

```typescript
describe('StatoAnimoService', () => {
    let service: StatoAnimoService;

    beforeEach(async () => {
        // Setup: Crea il modulo di test
        const module: TestingModule = await Test.createTestingModule({
            providers: [StatoAnimoService],
        }).compile();

        service = module.get<StatoAnimoService>(StatoAnimoService);
        
        // Reset dei mock prima di ogni test
        jest.clearAllMocks();
    });

    // I test vanno qui
});
```

**Spiegazione**:
- `describe()`: Raggruppa test correlati
- `beforeEach()`: Eseguito prima di ogni test
- `jest.clearAllMocks()`: Pulisce i mock tra i test

### Passo 4: Scrivere i Test

#### Test 1: Verifica che il service sia definito

```typescript
it('should be defined', () => {
    expect(service).toBeDefined();
});
```

**Scopo**: Verifica che il service venga creato correttamente.

#### Test 2: Recupero ultimo stato d'animo con successo

```typescript
it('should return the last mood when data exists', async () => {
    // Arrange: Prepara i dati di test
    const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
    const mockDate = new Date('2025-12-02T10:00:00Z');
    const mockRows = [{
        umore: 'Felice',
        intensita: 8,
        note: 'Ottima giornata',
        dataInserimento: mockDate,
    }];

    // Mock della catena di metodi del database
    const mockSelect = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
                orderBy: jest.fn().mockReturnValue({
                    limit: jest.fn().mockResolvedValue(mockRows),
                }),
            }),
        }),
    });
    (db.select as jest.Mock) = mockSelect;

    // Act: Esegui il metodo da testare
    const result = await service.getUltimoStatoAnimo(mockUserId);

    // Assert: Verifica il risultato
    expect(result).toEqual({
        umore: 'Felice',
        intensita: 8,
        note: 'Ottima giornata',
        dataInserimento: mockDate,
    });
    expect(mockSelect).toHaveBeenCalled();
});
```

**Spiegazione**:
- **Arrange**: Prepara i dati di test e i mock
- **Act**: Esegue il metodo da testare
- **Assert**: Verifica che il risultato sia corretto

#### Test 3: Nessuno stato d'animo trovato

```typescript
it('should return null when no mood data exists', async () => {
    // Arrange
    const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
    const mockRows = []; // Array vuoto

    const mockSelect = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
                orderBy: jest.fn().mockReturnValue({
                    limit: jest.fn().mockResolvedValue(mockRows),
                }),
            }),
        }),
    });
    (db.select as jest.Mock) = mockSelect;

    // Act
    const result = await service.getUltimoStatoAnimo(mockUserId);

    // Assert
    expect(result).toBeNull();
});
```

#### Test 4: Gestione campi opzionali

```typescript
it('should handle optional fields correctly', async () => {
    // Arrange
    const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
    const mockDate = new Date('2025-12-02T10:00:00Z');
    const mockRows = [{
        umore: 'Neutro',
        intensita: null,  // Campo opzionale null
        note: null,       // Campo opzionale null
        dataInserimento: mockDate,
    }];

    const mockSelect = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
                orderBy: jest.fn().mockReturnValue({
                    limit: jest.fn().mockResolvedValue(mockRows),
                }),
            }),
        }),
    });
    (db.select as jest.Mock) = mockSelect;

    // Act
    const result = await service.getUltimoStatoAnimo(mockUserId);

    // Assert
    expect(result).toEqual({
        umore: 'Neutro',
        intensita: undefined,  // null convertito in undefined
        note: undefined,
        dataInserimento: mockDate,
    });
});
```

### File Completo di Test

```typescript
// stato-animo.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { StatoAnimoService } from './stato-animo.service';
import { db } from '../../drizzle/db.js';

jest.mock('../../drizzle/db.js', () => ({
    db: {
        select: jest.fn(),
    },
}));

describe('StatoAnimoService', () => {
    let service: StatoAnimoService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [StatoAnimoService],
        }).compile();

        service = module.get<StatoAnimoService>(StatoAnimoService);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return the last mood when data exists', async () => {
        const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
        const mockDate = new Date('2025-12-02T10:00:00Z');
        const mockRows = [{
            umore: 'Felice',
            intensita: 8,
            note: 'Ottima giornata',
            dataInserimento: mockDate,
        }];

        const mockSelect = jest.fn().mockReturnValue({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    orderBy: jest.fn().mockReturnValue({
                        limit: jest.fn().mockResolvedValue(mockRows),
                    }),
                }),
            }),
        });
        (db.select as jest.Mock) = mockSelect;

        const result = await service.getUltimoStatoAnimo(mockUserId);

        expect(result).toEqual({
            umore: 'Felice',
            intensita: 8,
            note: 'Ottima giornata',
            dataInserimento: mockDate,
        });
    });

    it('should return null when no mood data exists', async () => {
        const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
        const mockRows = [];

        const mockSelect = jest.fn().mockReturnValue({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    orderBy: jest.fn().mockReturnValue({
                        limit: jest.fn().mockResolvedValue(mockRows),
                    }),
                }),
            }),
        });
        (db.select as jest.Mock) = mockSelect;

        const result = await service.getUltimoStatoAnimo(mockUserId);

        expect(result).toBeNull();
    });

    it('should handle optional fields correctly', async () => {
        const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
        const mockDate = new Date('2025-12-02T10:00:00Z');
        const mockRows = [{
            umore: 'Neutro',
            intensita: null,
            note: null,
            dataInserimento: mockDate,
        }];

        const mockSelect = jest.fn().mockReturnValue({
            from: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    orderBy: jest.fn().mockReturnValue({
                        limit: jest.fn().mockResolvedValue(mockRows),
                    }),
                }),
            }),
        });
        (db.select as jest.Mock) = mockSelect;

        const result = await service.getUltimoStatoAnimo(mockUserId);

        expect(result).toEqual({
            umore: 'Neutro',
            intensita: undefined,
            note: undefined,
            dataInserimento: mockDate,
        });
    });
});
```

### Eseguire i Test

```bash
# Esegui tutti i test
npm test

# Esegui test in modalità watch (ricompila automaticamente)
npm run test:watch

# Esegui test con coverage
npm run test:cov

# Esegui solo i test di un file specifico
npm test stato-animo.service.spec.ts
```

---

## ✅ Best Practices

### 1. Naming Convention

```typescript
// ❌ Male
it('test1', () => { ... });

// ✅ Bene
it('should return null when user has no moods', () => { ... });
```

**Regola**: Il nome del test deve descrivere chiaramente cosa viene testato e il risultato atteso.

### 2. Arrange-Act-Assert (AAA)

```typescript
it('should calculate total correctly', () => {
    // Arrange: Prepara i dati
    const value1 = 10;
    const value2 = 20;
    
    // Act: Esegui l'azione
    const result = calculator.add(value1, value2);
    
    // Assert: Verifica il risultato
    expect(result).toBe(30);
});
```

### 3. Un Test, Un Concetto

```typescript
// ❌ Male: Test troppo complesso
it('should do everything', () => {
    // Testa creazione, modifica, eliminazione...
});

// ✅ Bene: Test separati
it('should create mood successfully', () => { ... });
it('should update mood successfully', () => { ... });
it('should delete mood successfully', () => { ... });
```

### 4. Isolamento dei Test

```typescript
// ❌ Male: Dipendenza tra test
let sharedData;

it('test 1', () => {
    sharedData = { value: 10 };
});

it('test 2', () => {
    expect(sharedData.value).toBe(10); // Dipende da test 1!
});

// ✅ Bene: Test indipendenti
it('test 1', () => {
    const data = { value: 10 };
    expect(data.value).toBe(10);
});

it('test 2', () => {
    const data = { value: 10 };
    expect(data.value).toBe(10);
});
```

### 5. Mock delle Dipendenze Esterne

```typescript
// ✅ Bene: Mock del database
jest.mock('../../drizzle/db.js', () => ({
    db: {
        select: jest.fn(),
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));
```

**Perché**: I test unitari non devono dipendere da database reali, API esterne, file system, ecc.

### 6. Test dei Casi Limite

```typescript
describe('Input Validation', () => {
    it('should handle empty string', () => { ... });
    it('should handle null value', () => { ... });
    it('should handle undefined value', () => { ... });
    it('should handle very long string', () => { ... });
    it('should handle special characters', () => { ... });
});
```

### 7. Descrizioni Chiare

```typescript
describe('StatoAnimoService', () => {
    describe('getUltimoStatoAnimo', () => {
        it('should return the most recent mood', () => { ... });
        it('should return null when no moods exist', () => { ... });
        it('should handle database errors gracefully', () => { ... });
    });
    
    describe('getStoricoStatoAnimo', () => {
        it('should return moods within date range', () => { ... });
        it('should limit results to 100 items', () => { ... });
    });
});
```

---

## 📊 Code Coverage

### Cos'è il Code Coverage

Il **code coverage** misura la percentuale di codice eseguita durante i test.

### Metriche di Coverage

| Metrica | Descrizione |
|---------|-------------|
| **Statement Coverage** | % di statement eseguiti |
| **Branch Coverage** | % di branch (if/else) eseguiti |
| **Function Coverage** | % di funzioni chiamate |
| **Line Coverage** | % di righe eseguite |

### Generare il Report di Coverage

```bash
npm run test:cov
```

**Output**:
```
---------------------------|---------|----------|---------|---------|-------------------
File                       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
---------------------------|---------|----------|---------|---------|-------------------
All files                  |   85.71 |    66.67 |     100 |   85.71 |
 stato-animo.service.ts    |   85.71 |    66.67 |     100 |   85.71 | 44,89
---------------------------|---------|----------|---------|---------|-------------------
```

### Interpretare il Report

- **% Stmts**: Percentuale di statement eseguiti
- **% Branch**: Percentuale di branch (if/else) testati
- **% Funcs**: Percentuale di funzioni testate
- **% Lines**: Percentuale di righe eseguite
- **Uncovered Line #s**: Righe non coperte dai test

### Report HTML

Il coverage genera anche un report HTML interattivo:

```bash
# Dopo aver eseguito npm run test:cov
open coverage/lcov-report/index.html
```

**Funzionalità del Report HTML**:
- ✅ Visualizzazione file per file
- ✅ Evidenziazione righe coperte (verde) e non coperte (rosso)
- ✅ Navigazione interattiva
- ✅ Grafici e statistiche

### Obiettivi di Coverage

| Livello | Coverage | Descrizione |
|---------|----------|-------------|
| 🔴 Basso | < 60% | Insufficiente, molte parti non testate |
| 🟡 Medio | 60-80% | Accettabile, ma migliorabile |
| 🟢 Buono | 80-90% | Buon livello di copertura |
| ⭐ Eccellente | > 90% | Copertura molto alta |

**Nota**: Il 100% di coverage non garantisce assenza di bug, ma indica che tutto il codice è stato eseguito almeno una volta durante i test.

### Migliorare il Coverage

1. **Identificare codice non coperto**:
   ```bash
   npm run test:cov
   # Guarda "Uncovered Line #s"
   ```

2. **Aggiungere test per i branch mancanti**:
   ```typescript
   // Se la funzione ha un if/else, testa entrambi i casi
   it('should handle true condition', () => { ... });
   it('should handle false condition', () => { ... });
   ```

3. **Testare casi limite**:
   ```typescript
   it('should handle empty array', () => { ... });
   it('should handle null value', () => { ... });
   it('should handle error conditions', () => { ... });
   ```

### Configurare Soglie di Coverage

Nel `package.json`, puoi impostare soglie minime:

```json
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

Se il coverage scende sotto queste soglie, i test falliranno.

---

## 🔧 Troubleshooting

### Problema 1: Mock non funziona

**Errore**:
```
TypeError: db.select is not a function
```

**Soluzione**:
```typescript
// Assicurati che il mock sia definito PRIMA dell'import del service
jest.mock('../../drizzle/db.js', () => ({
    db: {
        select: jest.fn(),
    },
}));

import { StatoAnimoService } from './stato-animo.service';
```

### Problema 2: Test asincroni non completano

**Errore**:
```
Timeout - Async callback was not invoked within the 5000 ms timeout
```

**Soluzione**:
```typescript
// Usa async/await
it('should fetch data', async () => {
    const result = await service.getData();
    expect(result).toBeDefined();
});

// Oppure aumenta il timeout
it('should fetch data', async () => {
    // ...
}, 10000); // 10 secondi
```

### Problema 3: Import di moduli ES6

**Errore**:
```
Cannot use import statement outside a module
```

**Soluzione**:
Assicurati che `package.json` contenga:
```json
{
  "type": "module"
}
```

E che `ts-jest` sia configurato correttamente.

### Problema 4: Coverage non include tutti i file

**Soluzione**:
Verifica `collectCoverageFrom` in `package.json`:
```json
{
  "jest": {
    "collectCoverageFrom": [
      "**/*.(t|j)s",
      "!**/*.spec.ts",
      "!**/node_modules/**",
      "!**/dist/**"
    ]
  }
}
```

---

## 📚 Risorse Aggiuntive

### Documentazione Ufficiale

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [TypeScript Jest](https://kulshekhar.github.io/ts-jest/)

### Comandi Utili

```bash
# Esegui tutti i test
npm test

# Esegui test in watch mode
npm run test:watch

# Esegui test con coverage
npm run test:cov

# Esegui test in debug mode
npm run test:debug

# Esegui solo test E2E
npm run test:e2e

# Esegui test di un singolo file
npm test -- stato-animo.service.spec.ts

# Esegui test con pattern
npm test -- --testNamePattern="should return"
```

### Matchers Jest Comuni

```typescript
// Uguaglianza
expect(value).toBe(5);                    // Uguaglianza stretta (===)
expect(value).toEqual({ a: 1 });          // Uguaglianza profonda

// Truthiness
expect(value).toBeTruthy();               // Valore truthy
expect(value).toBeFalsy();                // Valore falsy
expect(value).toBeNull();                 // Valore null
expect(value).toBeUndefined();            // Valore undefined
expect(value).toBeDefined();              // Valore definito

// Numeri
expect(value).toBeGreaterThan(3);         // > 3
expect(value).toBeGreaterThanOrEqual(3);  // >= 3
expect(value).toBeLessThan(5);            // < 5
expect(value).toBeCloseTo(0.3);           // Approssimazione float

// Stringhe
expect(string).toMatch(/pattern/);        // Regex match
expect(string).toContain('substring');    // Contiene substring

// Array
expect(array).toContain(item);            // Contiene elemento
expect(array).toHaveLength(3);            // Lunghezza array

// Oggetti
expect(obj).toHaveProperty('key');        // Ha proprietà
expect(obj).toMatchObject({ a: 1 });      // Match parziale

// Funzioni
expect(fn).toHaveBeenCalled();            // Funzione chiamata
expect(fn).toHaveBeenCalledWith(arg);     // Chiamata con argomento
expect(fn).toHaveBeenCalledTimes(2);      // Chiamata N volte

// Eccezioni
expect(() => fn()).toThrow();             // Lancia eccezione
expect(() => fn()).toThrow(Error);        // Lancia tipo specifico
```

---

## 🎯 Conclusioni

Il unit testing è una pratica fondamentale per garantire la qualità del software. Seguendo questa guida e applicando le best practices, potrai:

✅ Scrivere test efficaci e manutenibili  
✅ Aumentare la confidence nel codice  
✅ Facilitare il refactoring  
✅ Documentare il comportamento del sistema  
✅ Ridurre i bug in produzione  

**Prossimi passi**:
1. Leggi la [Guida Jest](./02_Guida_Jest.md) per approfondire le funzionalità di Jest
2. Consulta la [Guida Oracle JSON](./03_Guida_Oracle_JSON.md) per automatizzare i test
3. Usa la [Checklist Testing](./04_Checklist_Testing.md) per tracciare i progressi
