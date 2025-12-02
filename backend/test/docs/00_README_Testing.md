# Suite Documentazione Testing - Progetto Sintonia

## 📚 Panoramica

Benvenuto nella suite completa di documentazione per il testing del progetto Sintonia. Questa raccolta di guide fornisce tutto il necessario per implementare un sistema di testing robusto e completo.

---

## 📖 Documenti Disponibili

### 1. [Guida al Unit Testing](./01_Guida_Unit_Testing_Sintonia.md)

**Descrizione**: Guida completa al unit testing con esempi pratici basati sul progetto Sintonia.

**Contenuti**:
- ✅ Introduzione al unit testing
- ✅ Architettura del testing in Sintonia
- ✅ Esempio pratico completo: `StatoAnimoService`
- ✅ Best practices
- ✅ Guida al code coverage
- ✅ Troubleshooting

**Quando usarla**: 
- Sei nuovo al unit testing
- Vuoi capire come testare un service NestJS
- Hai bisogno di esempi pratici
- Vuoi imparare a misurare il coverage

**Tempo di lettura**: ~30 minuti

---

### 2. [Guida Completa a Jest](./02_Guida_Jest.md)

**Descrizione**: Reference completa per Jest, il framework di testing utilizzato nel progetto.

**Contenuti**:
- ✅ Installazione e configurazione
- ✅ Anatomia di un test
- ✅ Matchers (tutti i tipi)
- ✅ Mocking (funzioni, moduli, spy)
- ✅ Testing asincrono
- ✅ Setup e teardown
- ✅ Snapshot testing
- ✅ Comandi CLI
- ✅ Configurazione avanzata

**Quando usarla**:
- Hai bisogno di un riferimento rapido per Jest
- Vuoi approfondire una funzionalità specifica
- Devi configurare Jest per un nuovo progetto
- Cerchi esempi di matchers o mocking

**Tempo di lettura**: ~45 minuti (reference, consultare all'occorrenza)

---

### 3. [Guida alla Generazione di Oracoli JSON](./03_Guida_Oracle_JSON.md)

**Descrizione**: Come creare e utilizzare oracoli JSON per automatizzare e standardizzare i test.

**Contenuti**:
- ✅ Cos'è un oracolo JSON
- ✅ Struttura dell'oracolo
- ✅ Script di generazione automatica
- ✅ Utilizzo negli unit test
- ✅ Esempi pratici per Sintonia
- ✅ Best practices
- ✅ Automazione e validazione

**Quando usarla**:
- Vuoi standardizzare i dati di test
- Hai molti test con dati simili
- Vuoi automatizzare la generazione di test
- Cerchi un modo per centralizzare i test data

**Tempo di lettura**: ~35 minuti

---

### 4. [Checklist Testing](./04_Checklist_Testing.md)

**Descrizione**: Checklist completa di tutti i moduli da testare con tracking del progresso.

**Contenuti**:
- ✅ Lista completa dei moduli
- ✅ Test cases per ogni modulo
- ✅ Coverage target
- ✅ Tracking del progresso
- ✅ Report template
- ✅ Timeline suggerita
- ✅ Metriche di qualità

**Quando usarla**:
- Inizi il testing di un modulo
- Vuoi tracciare i progressi
- Hai bisogno di un piano di testing
- Devi generare report settimanali

**Tempo di lettura**: ~20 minuti (documento di lavoro, aggiornare continuamente)

---

## 🚀 Percorso di Apprendimento Consigliato

### Per Principianti

```
1. Leggi: Guida al Unit Testing (01)
   ↓
2. Pratica: Scrivi il tuo primo test seguendo l'esempio
   ↓
3. Consulta: Guida Jest (02) per approfondire
   ↓
4. Usa: Checklist Testing (04) per tracciare i progressi
```

### Per Esperti

```
1. Consulta: Guida Jest (02) come reference
   ↓
2. Implementa: Oracoli JSON (03) per automatizzare
   ↓
3. Usa: Checklist Testing (04) per pianificare
```

---

## 🎯 Quick Start

### Setup Iniziale

```bash
# 1. Assicurati che le dipendenze siano installate
npm install

# 2. Verifica che Jest sia configurato
npm test -- --version

# 3. Esegui i test esistenti (se presenti)
npm test

# 4. Genera report di coverage
npm run test:cov
```

### Creare il Primo Test

```bash
# 1. Crea il file di test
touch src/patient/stato-animo/stato-animo.service.spec.ts

# 2. Segui l'esempio nella Guida Unit Testing (01)

# 3. Esegui il test
npm test -- stato-animo.service.spec.ts

# 4. Verifica il coverage
npm run test:cov
```

---

## 📊 Struttura dei File di Test

```
backend/
├── src/
│   ├── patient/
│   │   ├── stato-animo/
│   │   │   ├── stato-animo.service.ts
│   │   │   ├── stato-animo.service.spec.ts      ← Test file
│   │   │   ├── stato-animo.controller.ts
│   │   │   └── stato-animo.controller.spec.ts   ← Test file
│   │   └── ...
│   └── ...
├── test/
│   ├── oracles/                                  ← Oracoli JSON
│   │   ├── stato-animo-oracle.json
│   │   └── ...
│   ├── helpers/                                  ← Helper per test
│   │   ├── oracle-loader.ts
│   │   └── test-utils.ts
│   ├── 01_Guida_Unit_Testing_Sintonia.md        ← Questa suite
│   ├── 02_Guida_Jest.md
│   ├── 03_Guida_Oracle_JSON.md
│   └── 04_Checklist_Testing.md
├── coverage/                                     ← Report coverage
│   └── lcov-report/
│       └── index.html
└── package.json
```

---

## 🔧 Comandi Utili

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

# Esegui test con pattern nel nome
npm test -- --testNamePattern="should return"

# Esegui solo test falliti
npm test -- --onlyFailures

# Genera report HTML coverage
npm run test:cov && open coverage/lcov-report/index.html
```

### Oracoli

```bash
# Genera oracolo per un service
node test/scripts/generate-oracle.js StatoAnimoService

# Valida tutti gli oracoli
npm run validate:oracles
```

---

## 📈 Obiettivi di Coverage

### Target Globali

| Livello | Coverage | Descrizione |
|---------|----------|-------------|
| 🔴 Minimo | 60% | Insufficiente |
| 🟡 Accettabile | 70% | Migliorabile |
| 🟢 Buono | 80% | Target standard |
| ⭐ Eccellente | 90%+ | Obiettivo finale |

### Target per Categoria

| Categoria | Target |
|-----------|--------|
| Services (Business Logic) | 90% |
| Controllers | 85% |
| DTOs con Validazione | 85% |
| Utilities | 80% |
| Guards/Middleware | 90% |

---

## 🎓 Best Practices Riassuntive

### 1. Naming

```typescript
// ❌ Male
it('test1', () => { ... });

// ✅ Bene
it('should return user data when ID is valid', () => { ... });
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

### 5. Test dei Casi Limite

```typescript
describe('Edge Cases', () => {
    it('should handle empty array', () => { ... });
    it('should handle null value', () => { ... });
    it('should handle undefined value', () => { ... });
});
```

---

## 📅 Timeline Suggerita

### Settimana 1-2: Foundation
- [ ] Leggere tutta la documentazione
- [ ] Setup testing infrastructure
- [ ] Creare primi test di esempio
- [ ] Familiarizzare con Jest

### Settimana 3-5: Core Features
- [ ] Testare authentication
- [ ] Testare patient services
- [ ] Testare score calculation
- [ ] Testare alert system

### Settimana 6-7: Secondary Features
- [ ] Testare diary
- [ ] Testare forum
- [ ] Testare badge system
- [ ] Testare settings

### Settimana 8: Refinement
- [ ] Migliorare coverage
- [ ] Integration tests
- [ ] Bug fixes
- [ ] Documentazione finale

---

## 🔗 Risorse Esterne

### Documentazione Ufficiale

- [Jest Documentation](https://jestjs.io/)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [TypeScript Jest](https://kulshekhar.github.io/ts-jest/)

### Tutorial

- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Jest Cheat Sheet](https://github.com/sapegin/jest-cheat-sheet)

---

## 🆘 Supporto

### Problemi Comuni

1. **Test non trovati**: Verifica che il file termini con `.spec.ts`
2. **Mock non funziona**: Assicurati che il mock sia definito prima dell'import
3. **Timeout**: Aumenta il timeout con `jest.setTimeout(10000)`
4. **Coverage basso**: Consulta la Checklist per identificare aree non testate

### Dove Trovare Aiuto

1. Consulta la sezione Troubleshooting nella Guida Unit Testing
2. Cerca nella Guida Jest per funzionalità specifiche
3. Controlla gli esempi negli oracoli JSON
4. Rivedi la checklist per best practices

---

## 📊 Metriche di Successo

### Indicatori di Qualità

✅ **Coverage >= 85%**  
✅ **Tutti i test passano**  
✅ **Nessun test skippato**  
✅ **Tempo esecuzione < 30s**  
✅ **Nessun warning nei test**  

### Red Flags

⚠️ **Coverage < 60%**  
⚠️ **Test falliti > 5%**  
⚠️ **Test skippati > 10%**  
⚠️ **Tempo esecuzione > 60s**  
⚠️ **Mock non puliti**  

---

## 🎯 Conclusioni

Questa suite di documentazione fornisce tutto il necessario per implementare un sistema di testing completo nel progetto Sintonia.

**Ricorda**:
- ✅ Inizia con le basi (Guida 01)
- ✅ Usa Jest come reference (Guida 02)
- ✅ Automatizza con oracoli (Guida 03)
- ✅ Traccia i progressi (Guida 04)

**Buon testing!** 🚀

---

## 📝 Changelog

| Versione | Data | Modifiche |
|----------|------|-----------|
| 1.0.0 | 2025-12-02 | Creazione iniziale della suite |

---

## 👥 Autori

- **Testing Team** - Progetto Sintonia
- **Documentazione** - [Data: 2025-12-02]

---

## 📄 Licenza

Documentazione interna - Progetto Sintonia
