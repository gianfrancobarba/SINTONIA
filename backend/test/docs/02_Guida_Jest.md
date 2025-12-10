# Guida Completa a Jest - Progetto Sintonia

## 📋 Indice

1. [Introduzione a Jest](#introduzione-a-jest)
2. [Installazione e Configurazione](#installazione-e-configurazione)
3. [Anatomia di un Test](#anatomia-di-un-test)
4. [Matchers](#matchers)
5. [Mocking](#mocking)
6. [Testing Asincrono](#testing-asincrono)
7. [Setup e Teardown](#setup-e-teardown)
8. [Snapshot Testing](#snapshot-testing)
9. [Comandi CLI](#comandi-cli)
10. [Configurazione Avanzata](#configurazione-avanzata)

---

## 🚀 Introduzione a Jest

### Cos'è Jest

**Jest** è un framework di testing JavaScript completo e zero-configuration sviluppato da Facebook. È particolarmente adatto per:

- ✅ Testing di applicazioni React, Vue, Angular
- ✅ Testing di applicazioni Node.js (come NestJS)
- ✅ Testing di codice TypeScript
- ✅ Testing di API REST

### Caratteristiche Principali

| Caratteristica | Descrizione |
|----------------|-------------|
| **Zero Config** | Funziona out-of-the-box senza configurazione |
| **Fast** | Esecuzione parallela dei test |
| **Snapshot Testing** | Cattura e confronta snapshot dell'output |
| **Code Coverage** | Report di coverage integrato |
| **Mocking** | Sistema di mocking potente e flessibile |
| **Watch Mode** | Ricompila automaticamente i test modificati |

---

## ⚙️ Installazione e Configurazione

### Installazione

Nel progetto Sintonia, Jest è già installato. Per un nuovo progetto:

```bash
npm install --save-dev jest @types/jest ts-jest
```

### Configurazione in package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand"
  },
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

### Configurazione TypeScript

Per TypeScript, assicurati che `tsconfig.json` includa:

```json
{
  "compilerOptions": {
    "types": ["jest", "node"]
  }
}
```

---

## 🧪 Anatomia di un Test

### Struttura Base

```typescript
describe('Nome del Gruppo di Test', () => {
    // Setup
    beforeEach(() => {
        // Eseguito prima di ogni test
    });

    // Test
    it('dovrebbe fare qualcosa', () => {
        // Arrange
        const input = 'test';
        
        // Act
        const result = functionToTest(input);
        
        // Assert
        expect(result).toBe('expected');
    });
});
```

### Funzioni Principali

#### `describe(name, fn)`

Raggruppa test correlati.

```typescript
describe('Calculator', () => {
    describe('add', () => {
        it('should add two numbers', () => { ... });
        it('should handle negative numbers', () => { ... });
    });
    
    describe('subtract', () => {
        it('should subtract two numbers', () => { ... });
    });
});
```

#### `it(name, fn)` o `test(name, fn)`

Definisce un singolo test.

```typescript
it('should return true', () => {
    expect(true).toBe(true);
});

// Equivalente a:
test('should return true', () => {
    expect(true).toBe(true);
});
```

#### `expect(value)`

Crea un'asserzione.

```typescript
expect(2 + 2).toBe(4);
expect([1, 2, 3]).toContain(2);
expect({ a: 1 }).toEqual({ a: 1 });
```

---

## 🎯 Matchers

I **matchers** sono metodi che verificano i valori.

### Matchers di Uguaglianza

```typescript
// Uguaglianza stretta (===)
expect(2 + 2).toBe(4);
expect('hello').toBe('hello');

// Uguaglianza profonda (deep equality)
expect({ a: 1, b: 2 }).toEqual({ a: 1, b: 2 });
expect([1, 2, 3]).toEqual([1, 2, 3]);

// Match parziale di oggetti
expect({ a: 1, b: 2, c: 3 }).toMatchObject({ a: 1, b: 2 });
```

### Matchers di Truthiness

```typescript
expect(true).toBeTruthy();
expect(false).toBeFalsy();
expect(null).toBeNull();
expect(undefined).toBeUndefined();
expect('value').toBeDefined();
```

### Matchers Numerici

```typescript
expect(5).toBeGreaterThan(3);
expect(5).toBeGreaterThanOrEqual(5);
expect(3).toBeLessThan(5);
expect(3).toBeLessThanOrEqual(3);

// Confronto float con tolleranza
expect(0.1 + 0.2).toBeCloseTo(0.3);
```

### Matchers per Stringhe

```typescript
expect('hello world').toMatch(/world/);
expect('hello world').toMatch('world');
expect('hello world').toContain('world');
```

### Matchers per Array

```typescript
expect([1, 2, 3]).toContain(2);
expect([1, 2, 3]).toHaveLength(3);
expect(['apple', 'banana']).toContain('apple');
```

### Matchers per Oggetti

```typescript
expect({ a: 1, b: 2 }).toHaveProperty('a');
expect({ a: 1, b: 2 }).toHaveProperty('a', 1);
expect({ user: { name: 'John' } }).toHaveProperty('user.name', 'John');
```

### Matchers per Eccezioni

```typescript
function throwError() {
    throw new Error('Errore!');
}

expect(() => throwError()).toThrow();
expect(() => throwError()).toThrow(Error);
expect(() => throwError()).toThrow('Errore!');
expect(() => throwError()).toThrow(/Errore/);
```

### Negazione

Tutti i matchers possono essere negati con `.not`:

```typescript
expect(2 + 2).not.toBe(5);
expect([1, 2, 3]).not.toContain(4);
expect('hello').not.toMatch(/world/);
```

---

## 🎭 Mocking

Il **mocking** permette di sostituire dipendenze reali con versioni controllate.

### Mock di Funzioni

```typescript
// Crea una mock function
const mockFn = jest.fn();

// Usa la mock function
mockFn('arg1', 'arg2');

// Verifica le chiamate
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFn).toHaveBeenCalledTimes(1);
```

### Mock con Valore di Ritorno

```typescript
const mockFn = jest.fn();
mockFn.mockReturnValue(42);

expect(mockFn()).toBe(42);
```

### Mock con Valore di Ritorno Asincrono

```typescript
const mockFn = jest.fn();
mockFn.mockResolvedValue('success');

const result = await mockFn();
expect(result).toBe('success');
```

### Mock di Moduli

```typescript
// Mock di un intero modulo
jest.mock('../../drizzle/db.js', () => ({
    db: {
        select: jest.fn(),
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));

// Usa il mock
import { db } from '../../drizzle/db.js';

(db.select as jest.Mock).mockReturnValue({
    from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([{ id: 1 }]),
    }),
});
```

### Mock Parziale di Moduli

```typescript
jest.mock('../../utils.js', () => ({
    ...jest.requireActual('../../utils.js'),
    specificFunction: jest.fn(),
}));
```

### Spy su Metodi

```typescript
const obj = {
    method: () => 'original',
};

const spy = jest.spyOn(obj, 'method');
spy.mockReturnValue('mocked');

expect(obj.method()).toBe('mocked');
expect(spy).toHaveBeenCalled();

// Ripristina l'implementazione originale
spy.mockRestore();
```

### Mock di Implementazione

```typescript
const mockFn = jest.fn((x) => x * 2);

expect(mockFn(5)).toBe(10);
expect(mockFn).toHaveBeenCalledWith(5);
```

### Mock di Implementazioni Multiple

```typescript
const mockFn = jest.fn()
    .mockReturnValueOnce(1)
    .mockReturnValueOnce(2)
    .mockReturnValue(3);

expect(mockFn()).toBe(1);
expect(mockFn()).toBe(2);
expect(mockFn()).toBe(3);
expect(mockFn()).toBe(3);
```

---

## ⏱️ Testing Asincrono

### Promises

```typescript
it('should resolve promise', () => {
    return fetchData().then(data => {
        expect(data).toBe('peanut butter');
    });
});

// Con async/await (preferito)
it('should resolve promise', async () => {
    const data = await fetchData();
    expect(data).toBe('peanut butter');
});
```

### Async/Await

```typescript
it('should fetch user data', async () => {
    const user = await service.getUser('123');
    
    expect(user).toBeDefined();
    expect(user.id).toBe('123');
});
```

### Testing di Errori Asincroni

```typescript
it('should throw error', async () => {
    await expect(service.invalidOperation()).rejects.toThrow('Error message');
});

// Oppure
it('should throw error', async () => {
    try {
        await service.invalidOperation();
        fail('Should have thrown error');
    } catch (error) {
        expect(error.message).toBe('Error message');
    }
});
```

### Timeout

```typescript
it('should complete within timeout', async () => {
    const result = await longRunningOperation();
    expect(result).toBeDefined();
}, 10000); // 10 secondi
```

---

## 🔧 Setup e Teardown

### beforeEach / afterEach

Eseguiti prima/dopo **ogni** test.

```typescript
describe('Database Tests', () => {
    let connection;

    beforeEach(() => {
        connection = createConnection();
    });

    afterEach(() => {
        connection.close();
    });

    it('should query data', () => {
        const result = connection.query('SELECT * FROM users');
        expect(result).toBeDefined();
    });
});
```

### beforeAll / afterAll

Eseguiti una sola volta prima/dopo **tutti** i test.

```typescript
describe('Database Tests', () => {
    let connection;

    beforeAll(() => {
        connection = createConnection();
    });

    afterAll(() => {
        connection.close();
    });

    it('test 1', () => { ... });
    it('test 2', () => { ... });
});
```

### Ordine di Esecuzione

```typescript
beforeAll(() => console.log('1 - beforeAll'));
afterAll(() => console.log('1 - afterAll'));
beforeEach(() => console.log('1 - beforeEach'));
afterEach(() => console.log('1 - afterEach'));

test('', () => console.log('1 - test'));

describe('Scoped', () => {
    beforeAll(() => console.log('2 - beforeAll'));
    afterAll(() => console.log('2 - afterAll'));
    beforeEach(() => console.log('2 - beforeEach'));
    afterEach(() => console.log('2 - afterEach'));

    test('', () => console.log('2 - test'));
});

// Output:
// 1 - beforeAll
// 1 - beforeEach
// 1 - test
// 1 - afterEach
// 2 - beforeAll
// 1 - beforeEach
// 2 - beforeEach
// 2 - test
// 2 - afterEach
// 1 - afterEach
// 2 - afterAll
// 1 - afterAll
```

---

## 📸 Snapshot Testing

### Cos'è uno Snapshot

Uno **snapshot** è una rappresentazione serializzata dell'output di un componente o funzione.

### Creare uno Snapshot

```typescript
it('should match snapshot', () => {
    const data = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
    };

    expect(data).toMatchSnapshot();
});
```

**Prima esecuzione**: Jest crea un file `__snapshots__/test-file.spec.ts.snap` con:

```javascript
exports[`should match snapshot 1`] = `
Object {
  "email": "john@example.com",
  "id": "123",
  "name": "John Doe",
}
`;
```

**Esecuzioni successive**: Jest confronta l'output con lo snapshot salvato.

### Aggiornare gli Snapshot

```bash
# Aggiorna tutti gli snapshot
npm test -- -u

# Aggiorna snapshot in modalità interattiva
npm test -- --watch
# Premi 'u' per aggiornare
```

### Inline Snapshots

```typescript
it('should match inline snapshot', () => {
    const data = { id: '123', name: 'John' };

    expect(data).toMatchInlineSnapshot(`
        Object {
          "id": "123",
          "name": "John",
        }
    `);
});
```

### Property Matchers

```typescript
it('should match snapshot with dynamic values', () => {
    const data = {
        id: generateId(), // Valore dinamico
        createdAt: new Date(),
        name: 'John',
    };

    expect(data).toMatchSnapshot({
        id: expect.any(String),
        createdAt: expect.any(Date),
    });
});
```

---

## 💻 Comandi CLI

### Comandi Base

```bash
# Esegui tutti i test
npm test

# Esegui test in watch mode
npm run test:watch

# Esegui test con coverage
npm run test:cov

# Esegui test in debug mode
npm run test:debug
```

### Opzioni Utili

```bash
# Esegui solo test modificati
npm test -- --onlyChanged

# Esegui test di un file specifico
npm test -- stato-animo.service.spec.ts

# Esegui test con pattern nel nome
npm test -- --testNamePattern="should return"

# Esegui test in modalità verbose
npm test -- --verbose

# Esegui test senza cache
npm test -- --no-cache

# Esegui test in modalità silent
npm test -- --silent

# Esegui test con timeout personalizzato
npm test -- --testTimeout=10000
```

### Watch Mode

In watch mode, Jest ricompila automaticamente i test modificati.

```bash
npm run test:watch
```

**Comandi interattivi**:
- `a`: Esegui tutti i test
- `f`: Esegui solo test falliti
- `p`: Filtra per nome file
- `t`: Filtra per nome test
- `q`: Esci
- `Enter`: Trigger test run

---

## ⚙️ Configurazione Avanzata

### File di Configurazione Separato

Crea `jest.config.js`:

```javascript
module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: 'src',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
    
    // Configurazioni aggiuntive
    setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '.module.ts$',
    ],
};
```

### Setup Globale

Crea `test/setup.ts`:

```typescript
// Configurazione globale per tutti i test
beforeAll(() => {
    console.log('Setup globale');
});

afterAll(() => {
    console.log('Teardown globale');
});

// Mock globali
global.console = {
    ...console,
    error: jest.fn(),
    warn: jest.fn(),
};
```

### Soglie di Coverage

```javascript
module.exports = {
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
        './src/patient/': {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90,
        },
    },
};
```

### Test Timeout Globale

```javascript
module.exports = {
    testTimeout: 10000, // 10 secondi
};
```

### Module Name Mapper

Per alias di import:

```javascript
module.exports = {
    moduleNameMapper: {
        '^@app/(.*)$': '<rootDir>/src/$1',
        '^@test/(.*)$': '<rootDir>/test/$1',
    },
};
```

---

## 🎓 Best Practices Jest

### 1. Usa describe per Raggruppare

```typescript
describe('UserService', () => {
    describe('createUser', () => {
        it('should create user with valid data', () => { ... });
        it('should throw error with invalid data', () => { ... });
    });
    
    describe('deleteUser', () => {
        it('should delete existing user', () => { ... });
        it('should throw error for non-existing user', () => { ... });
    });
});
```

### 2. Nomi Descrittivi

```typescript
// ❌ Male
it('test1', () => { ... });

// ✅ Bene
it('should return user data when ID is valid', () => { ... });
```

### 3. Un Concetto per Test

```typescript
// ❌ Male
it('should do everything', () => {
    // Testa creazione, modifica, eliminazione...
});

// ✅ Bene
it('should create user', () => { ... });
it('should update user', () => { ... });
it('should delete user', () => { ... });
```

### 4. Usa beforeEach per Setup Comune

```typescript
describe('Calculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = new Calculator();
    });

    it('should add', () => {
        expect(calculator.add(2, 3)).toBe(5);
    });

    it('should subtract', () => {
        expect(calculator.subtract(5, 3)).toBe(2);
    });
});
```

### 5. Pulisci i Mock

```typescript
beforeEach(() => {
    jest.clearAllMocks();
});
```

### 6. Testa Casi Limite

```typescript
describe('Input Validation', () => {
    it('should handle empty string', () => { ... });
    it('should handle null', () => { ... });
    it('should handle undefined', () => { ... });
    it('should handle very long string', () => { ... });
});
```

---

## 📊 Tabella Riassuntiva Matchers

| Matcher | Descrizione | Esempio |
|---------|-------------|---------|
| `toBe(value)` | Uguaglianza stretta | `expect(2+2).toBe(4)` |
| `toEqual(value)` | Uguaglianza profonda | `expect({a:1}).toEqual({a:1})` |
| `toBeTruthy()` | Valore truthy | `expect(true).toBeTruthy()` |
| `toBeFalsy()` | Valore falsy | `expect(false).toBeFalsy()` |
| `toBeNull()` | Valore null | `expect(null).toBeNull()` |
| `toBeUndefined()` | Valore undefined | `expect(undefined).toBeUndefined()` |
| `toBeDefined()` | Valore definito | `expect('x').toBeDefined()` |
| `toBeGreaterThan(n)` | Maggiore di | `expect(5).toBeGreaterThan(3)` |
| `toBeLessThan(n)` | Minore di | `expect(3).toBeLessThan(5)` |
| `toBeCloseTo(n)` | Approssimazione | `expect(0.3).toBeCloseTo(0.1+0.2)` |
| `toMatch(regex)` | Match regex | `expect('abc').toMatch(/b/)` |
| `toContain(item)` | Contiene elemento | `expect([1,2]).toContain(1)` |
| `toHaveLength(n)` | Lunghezza | `expect([1,2]).toHaveLength(2)` |
| `toHaveProperty(key)` | Ha proprietà | `expect({a:1}).toHaveProperty('a')` |
| `toThrow()` | Lancia eccezione | `expect(()=>fn()).toThrow()` |
| `toHaveBeenCalled()` | Funzione chiamata | `expect(mock).toHaveBeenCalled()` |
| `toHaveBeenCalledWith(args)` | Chiamata con args | `expect(mock).toHaveBeenCalledWith(1)` |

---

## 🔗 Risorse

### Documentazione Ufficiale

- [Jest Documentation](https://jestjs.io/)
- [Jest API Reference](https://jestjs.io/docs/api)
- [Jest CLI Options](https://jestjs.io/docs/cli)

### Tutorial

- [Testing with Jest](https://jestjs.io/docs/getting-started)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)

---

## 🎯 Conclusioni

Jest è un framework di testing potente e completo che rende il testing JavaScript/TypeScript semplice ed efficace. Le caratteristiche chiave da ricordare:

✅ **Zero configuration**: Funziona out-of-the-box  
✅ **Matchers ricchi**: Asserzioni per ogni tipo di dato  
✅ **Mocking potente**: Mock di funzioni, moduli, e dipendenze  
✅ **Testing asincrono**: Supporto completo per Promises e async/await  
✅ **Snapshot testing**: Cattura e confronta output  
✅ **Code coverage**: Report integrato  
✅ **Watch mode**: Ricompilazione automatica  

**Prossimi passi**:
- Consulta la [Guida Oracle JSON](./03_Guida_Oracle_JSON.md) per automatizzare i test
- Usa la [Checklist Testing](./04_Checklist_Testing.md) per tracciare i progressi
