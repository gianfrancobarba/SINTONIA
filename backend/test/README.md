# Testing - Progetto Sintonia

## 📁 Struttura Directory

```
test/
├── docs/                                    ← Documentazione testing
│   ├── 00_README_Testing.md                ← Indice completo
│   ├── 01_Guida_Unit_Testing_Sintonia.md   ← Guida unit testing
│   ├── 02_Guida_Jest.md                    ← Reference Jest
│   ├── 03_Guida_Oracle_JSON.md             ← Guida oracoli JSON
│   └── 04_Checklist_Testing.md             ← Checklist e tracking
├── scripts/                                 ← Script per testing
│   └── generate-oracle.js                  ← Generatore oracoli
├── helpers/                                 ← Helper utilities
│   └── oracle-loader.ts                    ← Caricamento oracoli
├── oracles/                                 ← Oracoli JSON
│   └── stato-animo-oracle.json             ← Esempio oracolo
├── jest-e2e.json                           ← Config E2E tests
└── README.md                               ← Questo file
```

---

## 🚀 Quick Start

### 1. Leggi la Documentazione

Inizia dal documento indice:

```bash
# Apri l'indice della documentazione
open test/docs/00_README_Testing.md
```

### 2. Setup Testing

```bash
# Installa dipendenze (se necessario)
npm install

# Verifica configurazione Jest
npm test -- --version

# Esegui test esistenti
npm test

# Genera report coverage
npm run test:cov
```

### 3. Crea il Tuo Primo Test

```bash
# Crea file di test
touch src/patient/stato-animo/stato-animo.service.spec.ts

# Segui gli esempi in docs/01_Guida_Unit_Testing_Sintonia.md

# Esegui il test
npm test -- stato-animo.service.spec.ts
```

### 4. Genera Oracolo JSON

```bash
# Genera oracolo per un service
node test/scripts/generate-oracle.js StatoAnimoService

# L'oracolo sarà salvato in test/oracles/
```

---

## 📚 Documentazione

### Documenti Disponibili

| Documento | Descrizione | Quando Usarlo |
|-----------|-------------|---------------|
| [00_README_Testing.md](./docs/00_README_Testing.md) | Indice e guida rapida | Punto di partenza |
| [01_Guida_Unit_Testing_Sintonia.md](./docs/01_Guida_Unit_Testing_Sintonia.md) | Guida completa unit testing | Imparare a testare |
| [02_Guida_Jest.md](./docs/02_Guida_Jest.md) | Reference Jest completa | Consultazione rapida |
| [03_Guida_Oracle_JSON.md](./docs/03_Guida_Oracle_JSON.md) | Generazione oracoli | Automatizzare test |
| [04_Checklist_Testing.md](./docs/04_Checklist_Testing.md) | Checklist e tracking | Pianificare e tracciare |

### Percorso Consigliato

```
1. Leggi: 00_README_Testing.md (panoramica)
   ↓
2. Studia: 01_Guida_Unit_Testing_Sintonia.md (basi)
   ↓
3. Pratica: Scrivi il tuo primo test
   ↓
4. Consulta: 02_Guida_Jest.md (reference)
   ↓
5. Automatizza: 03_Guida_Oracle_JSON.md (oracoli)
   ↓
6. Traccia: 04_Checklist_Testing.md (progressi)
```

---

## 🛠️ Script e Utilities

### Script Disponibili

#### generate-oracle.js

Genera oracoli JSON per i test.

```bash
# Uso base
node test/scripts/generate-oracle.js ServiceName

# Con percorso personalizzato
node test/scripts/generate-oracle.js ServiceName ./test/oracles/custom-oracle.json

# Esempio
node test/scripts/generate-oracle.js StatoAnimoService
```

### Helper Disponibili

#### oracle-loader.ts

Helper TypeScript per caricare oracoli nei test.

```typescript
import { loadOracle, filterByCategory } from '../helpers/oracle-loader';

// Carica oracolo
const oracle = loadOracle('stato-animo');

// Filtra per categoria
const successCases = filterByCategory(oracle, 'success');
```

---

## 📊 Coverage Target

### Obiettivi Aggiornati

| Livello | Coverage Target | Status |
|---------|----------------|--------|
| **Minimo Accettabile** | 80% | 🟡 |
| **Buono** | 90% | 🟢 |
| **Eccellente** | 100% | ⭐ |

### Comandi Coverage

```bash
# Genera report coverage
npm run test:cov

# Visualizza report HTML
npm run test:cov && open coverage/lcov-report/index.html

# Verifica soglia minima
npm run test:cov -- --coverageThreshold='{"global":{"lines":80}}'
```

---

## 🎯 Comandi Utili

### Testing

```bash
# Esegui tutti i test
npm test

# Esegui test in watch mode
npm run test:watch

# Esegui test con coverage
npm run test:cov

# Esegui test di un modulo specifico
npm test -- stato-animo

# Esegui test con pattern
npm test -- --testNamePattern="should return"

# Esegui solo test falliti
npm test -- --onlyFailures

# Esegui test E2E
npm run test:e2e
```

### Oracoli

```bash
# Genera oracolo
node test/scripts/generate-oracle.js ServiceName

# Valida oracoli (se script di validazione presente)
npm run validate:oracles
```

---

## 📁 Organizzazione File di Test

### Convenzioni

```
src/
├── patient/
│   ├── stato-animo/
│   │   ├── stato-animo.service.ts
│   │   ├── stato-animo.service.spec.ts      ← Test file
│   │   ├── stato-animo.controller.ts
│   │   └── stato-animo.controller.spec.ts   ← Test file
│   └── ...
```

### Naming Convention

- **Test files**: `*.spec.ts`
- **E2E tests**: `*.e2e-spec.ts`
- **Oracles**: `*-oracle.json`

---

## 🎓 Best Practices

### 1. Naming

```typescript
// ✅ Bene
it('should return user data when ID is valid', () => { ... });

// ❌ Male
it('test1', () => { ... });
```

### 2. Arrange-Act-Assert

```typescript
it('should calculate total', () => {
    // Arrange
    const value1 = 10;
    const value2 = 20;
    
    // Act
    const result = calculator.add(value1, value2);
    
    // Assert
    expect(result).toBe(30);
});
```

### 3. Isolamento

```typescript
beforeEach(() => {
    jest.clearAllMocks();
});
```

### 4. Mock delle Dipendenze

```typescript
jest.mock('../../drizzle/db.js', () => ({
    db: {
        select: jest.fn(),
    },
}));
```

---

## 📈 Tracking Progress

Usa la [Checklist Testing](./docs/04_Checklist_Testing.md) per tracciare:

- ✅ Moduli completati
- 📊 Coverage per modulo
- 🎯 Obiettivi raggiunti
- 📅 Timeline

---

## 🔗 Risorse

### Documentazione Ufficiale

- [Jest Documentation](https://jestjs.io/)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [TypeScript Jest](https://kulshekhar.github.io/ts-jest/)

### Guide Interne

- [Guida Unit Testing](./docs/01_Guida_Unit_Testing_Sintonia.md)
- [Guida Jest](./docs/02_Guida_Jest.md)
- [Guida Oracle JSON](./docs/03_Guida_Oracle_JSON.md)
- [Checklist Testing](./docs/04_Checklist_Testing.md)

---

## 🆘 Supporto

### Problemi Comuni

1. **Test non trovati**: Verifica che il file termini con `.spec.ts`
2. **Mock non funziona**: Mock deve essere definito prima dell'import
3. **Timeout**: Aumenta timeout con `jest.setTimeout(10000)`
4. **Coverage basso**: Consulta la checklist

### Dove Trovare Aiuto

1. Consulta la documentazione in `test/docs/`
2. Verifica gli esempi negli oracoli
3. Controlla la configurazione in `package.json`

---

## 📝 Changelog

| Versione | Data | Modifiche |
|----------|------|-----------|
| 1.1.0 | 2025-12-02 | Riorganizzazione struttura directory |
| 1.0.0 | 2025-12-02 | Creazione iniziale suite |

---

## 🎯 Prossimi Passi

1. ✅ Leggi la documentazione in `test/docs/`
2. ✅ Scrivi il tuo primo test
3. ✅ Genera oracoli JSON
4. ✅ Traccia i progressi con la checklist
5. ✅ Raggiungi 80%+ coverage

**Buon testing!** 🚀
