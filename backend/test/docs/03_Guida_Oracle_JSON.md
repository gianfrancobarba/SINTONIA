# Guida alla Generazione di Oracoli JSON - Progetto Sintonia

## 📋 Indice

1. [Introduzione](#introduzione)
2. [Cos'è un Oracolo JSON](#cosè-un-oracolo-json)
3. [Struttura dell'Oracolo](#struttura-delloracolo)
4. [Script di Generazione](#script-di-generazione)
5. [Utilizzo negli Unit Test](#utilizzo-negli-unit-test)
6. [Esempi Pratici](#esempi-pratici)
7. [Best Practices](#best-practices)
8. [Automazione](#automazione)

---

## 📖 Introduzione

Questa guida spiega come creare e utilizzare **oracoli JSON** per automatizzare e standardizzare i test nel progetto Sintonia.

### Obiettivi

- ✅ Comprendere il concetto di oracolo nei test
- ✅ Creare oracoli JSON riutilizzabili
- ✅ Automatizzare la generazione di test data
- ✅ Ridurre la duplicazione di codice nei test
- ✅ Facilitare la manutenzione dei test

---

## 🎯 Cos'è un Oracolo JSON

### Definizione

Un **oracolo** è un insieme di dati di test predefiniti che rappresentano:
- **Input**: Dati di ingresso per i test
- **Output atteso**: Risultati che ci aspettiamo
- **Scenari**: Casi di test specifici (successo, errore, edge cases)

### Perché Usare Oracoli JSON

| Vantaggi | Descrizione |
|----------|-------------|
| **Riutilizzabilità** | Stessi dati per test diversi |
| **Manutenibilità** | Modifiche centralizzate |
| **Leggibilità** | Separazione dati/logica |
| **Standardizzazione** | Formato uniforme |
| **Versionamento** | Tracciabilità delle modifiche |

---

## 🏗️ Struttura dell'Oracolo

### Schema Base

```json
{
  "metadata": {
    "version": "1.0.0",
    "description": "Test data for StatoAnimoService",
    "createdAt": "2025-12-02T10:00:00Z",
    "author": "Testing Team"
  },
  "testCases": [
    {
      "id": "test-001",
      "description": "Get last mood - success case",
      "input": {
        "userId": "123e4567-e89b-12d3-a456-426614174000"
      },
      "mockData": {
        "dbResponse": [
          {
            "umore": "Felice",
            "intensita": 8,
            "note": "Ottima giornata",
            "dataInserimento": "2025-12-02T10:00:00Z"
          }
        ]
      },
      "expectedOutput": {
        "umore": "Felice",
        "intensita": 8,
        "note": "Ottima giornata",
        "dataInserimento": "2025-12-02T10:00:00Z"
      },
      "expectedBehavior": {
        "shouldSucceed": true,
        "shouldThrow": false
      }
    }
  ]
}
```

### Componenti dell'Oracolo

#### 1. Metadata

Informazioni sul file di oracolo:

```json
{
  "metadata": {
    "version": "1.0.0",
    "description": "Descrizione del test suite",
    "createdAt": "2025-12-02T10:00:00Z",
    "author": "Nome del team",
    "lastModified": "2025-12-02T11:00:00Z"
  }
}
```

#### 2. Test Cases

Array di casi di test:

```json
{
  "testCases": [
    {
      "id": "unique-test-id",
      "description": "Descrizione del test",
      "category": "success|error|edge-case",
      "input": { /* dati di input */ },
      "mockData": { /* dati mock */ },
      "expectedOutput": { /* output atteso */ },
      "expectedBehavior": { /* comportamento atteso */ }
    }
  ]
}
```

---

## 🛠️ Script di Generazione

### Script Node.js per Generare Oracoli

Crea `test/scripts/generate-oracle.js`:

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Genera un oracolo JSON per i test
 */
class OracleGenerator {
    constructor(serviceName) {
        this.serviceName = serviceName;
        this.oracle = {
            metadata: {
                version: '1.0.0',
                description: `Test oracle for ${serviceName}`,
                createdAt: new Date().toISOString(),
                author: 'Testing Team',
            },
            testCases: [],
        };
    }

    /**
     * Aggiunge un caso di test all'oracolo
     */
    addTestCase(testCase) {
        this.oracle.testCases.push({
            id: `test-${String(this.oracle.testCases.length + 1).padStart(3, '0')}`,
            ...testCase,
        });
        return this;
    }

    /**
     * Salva l'oracolo in un file JSON
     */
    save(outputPath) {
        const fullPath = path.resolve(outputPath);
        const dir = path.dirname(fullPath);

        // Crea la directory se non esiste
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Salva il file
        fs.writeFileSync(
            fullPath,
            JSON.stringify(this.oracle, null, 2),
            'utf-8'
        );

        console.log(`✅ Oracle saved to: ${fullPath}`);
        console.log(`📊 Test cases: ${this.oracle.testCases.length}`);
    }

    /**
     * Carica un oracolo esistente
     */
    static load(filePath) {
        const fullPath = path.resolve(filePath);
        const content = fs.readFileSync(fullPath, 'utf-8');
        return JSON.parse(content);
    }
}

// Export per uso come modulo
module.exports = { OracleGenerator };

// CLI usage
if (require.main === module) {
    const serviceName = process.argv[2] || 'ExampleService';
    const outputPath = process.argv[3] || `./test/oracles/${serviceName.toLowerCase()}-oracle.json`;

    const generator = new OracleGenerator(serviceName);

    // Esempio di generazione
    generator
        .addTestCase({
            description: 'Success case - returns data',
            category: 'success',
            input: {
                userId: '123e4567-e89b-12d3-a456-426614174000',
            },
            mockData: {
                dbResponse: [
                    {
                        id: '1',
                        value: 'test',
                    },
                ],
            },
            expectedOutput: {
                id: '1',
                value: 'test',
            },
            expectedBehavior: {
                shouldSucceed: true,
                shouldThrow: false,
            },
        })
        .addTestCase({
            description: 'Error case - no data found',
            category: 'error',
            input: {
                userId: '123e4567-e89b-12d3-a456-426614174000',
            },
            mockData: {
                dbResponse: [],
            },
            expectedOutput: null,
            expectedBehavior: {
                shouldSucceed: true,
                shouldThrow: false,
            },
        })
        .save(outputPath);
}
```

### Rendere lo Script Eseguibile

```bash
chmod +x test/scripts/generate-oracle.js
```

### Usare lo Script

```bash
# Genera oracolo per StatoAnimoService
node test/scripts/generate-oracle.js StatoAnimoService ./test/oracles/stato-animo-oracle.json

# Genera oracolo generico
node test/scripts/generate-oracle.js MyService
```

---

## 📝 Esempi Pratici

### Esempio 1: Oracolo per StatoAnimoService

`test/oracles/stato-animo-oracle.json`:

```json
{
  "metadata": {
    "version": "1.0.0",
    "description": "Test oracle for StatoAnimoService",
    "createdAt": "2025-12-02T10:00:00Z",
    "author": "Testing Team"
  },
  "testCases": [
    {
      "id": "test-001",
      "description": "Get last mood - user has moods",
      "category": "success",
      "input": {
        "userId": "123e4567-e89b-12d3-a456-426614174000"
      },
      "mockData": {
        "dbResponse": [
          {
            "umore": "Felice",
            "intensita": 8,
            "note": "Ottima giornata",
            "dataInserimento": "2025-12-02T10:00:00.000Z"
          }
        ]
      },
      "expectedOutput": {
        "umore": "Felice",
        "intensita": 8,
        "note": "Ottima giornata",
        "dataInserimento": "2025-12-02T10:00:00.000Z"
      },
      "expectedBehavior": {
        "shouldSucceed": true,
        "shouldThrow": false,
        "dbMethodsCalled": ["select", "from", "where", "orderBy", "limit"]
      }
    },
    {
      "id": "test-002",
      "description": "Get last mood - user has no moods",
      "category": "edge-case",
      "input": {
        "userId": "123e4567-e89b-12d3-a456-426614174000"
      },
      "mockData": {
        "dbResponse": []
      },
      "expectedOutput": null,
      "expectedBehavior": {
        "shouldSucceed": true,
        "shouldThrow": false
      }
    },
    {
      "id": "test-003",
      "description": "Get last mood - optional fields are null",
      "category": "edge-case",
      "input": {
        "userId": "123e4567-e89b-12d3-a456-426614174000"
      },
      "mockData": {
        "dbResponse": [
          {
            "umore": "Neutro",
            "intensita": null,
            "note": null,
            "dataInserimento": "2025-12-02T10:00:00.000Z"
          }
        ]
      },
      "expectedOutput": {
        "umore": "Neutro",
        "dataInserimento": "2025-12-02T10:00:00.000Z"
      },
      "expectedBehavior": {
        "shouldSucceed": true,
        "shouldThrow": false,
        "optionalFieldsUndefined": ["intensita", "note"]
      }
    },
    {
      "id": "test-004",
      "description": "Get mood history - 30 days",
      "category": "success",
      "input": {
        "userId": "123e4567-e89b-12d3-a456-426614174000",
        "giorni": 30
      },
      "mockData": {
        "dbResponse": [
          {
            "umore": "Felice",
            "intensita": 8,
            "dataInserimento": "2025-12-02T10:00:00.000Z"
          },
          {
            "umore": "Triste",
            "intensita": 3,
            "dataInserimento": "2025-12-01T10:00:00.000Z"
          }
        ]
      },
      "expectedOutput": {
        "entries": [
          {
            "date": "2025-12-01",
            "umore": "Triste",
            "intensita": 3
          },
          {
            "date": "2025-12-02",
            "umore": "Felice",
            "intensita": 8
          }
        ]
      },
      "expectedBehavior": {
        "shouldSucceed": true,
        "shouldThrow": false,
        "entriesOrdered": "chronological-ascending"
      }
    }
  ]
}
```

### Esempio 2: Script di Generazione Specifico

`scripts/generate-stato-animo-oracle.js`:

```javascript
const { OracleGenerator } = require('./generate-oracle.js');

const generator = new OracleGenerator('StatoAnimoService');

// Test case 1: Success
generator.addTestCase({
    description: 'Get last mood - user has moods',
    category: 'success',
    input: {
        userId: '123e4567-e89b-12d3-a456-426614174000',
    },
    mockData: {
        dbResponse: [
            {
                umore: 'Felice',
                intensita: 8,
                note: 'Ottima giornata',
                dataInserimento: new Date('2025-12-02T10:00:00Z'),
            },
        ],
    },
    expectedOutput: {
        umore: 'Felice',
        intensita: 8,
        note: 'Ottima giornata',
        dataInserimento: new Date('2025-12-02T10:00:00Z'),
    },
    expectedBehavior: {
        shouldSucceed: true,
        shouldThrow: false,
    },
});

// Test case 2: No data
generator.addTestCase({
    description: 'Get last mood - user has no moods',
    category: 'edge-case',
    input: {
        userId: '123e4567-e89b-12d3-a456-426614174000',
    },
    mockData: {
        dbResponse: [],
    },
    expectedOutput: null,
    expectedBehavior: {
        shouldSucceed: true,
        shouldThrow: false,
    },
});

// Test case 3: Optional fields null
generator.addTestCase({
    description: 'Get last mood - optional fields are null',
    category: 'edge-case',
    input: {
        userId: '123e4567-e89b-12d3-a456-426614174000',
    },
    mockData: {
        dbResponse: [
            {
                umore: 'Neutro',
                intensita: null,
                note: null,
                dataInserimento: new Date('2025-12-02T10:00:00Z'),
            },
        ],
    },
    expectedOutput: {
        umore: 'Neutro',
        dataInserimento: new Date('2025-12-02T10:00:00Z'),
    },
    expectedBehavior: {
        shouldSucceed: true,
        shouldThrow: false,
        optionalFieldsUndefined: ['intensita', 'note'],
    },
});

// Salva l'oracolo
generator.save('./test/oracles/stato-animo-oracle.json');
```

---

## 🧪 Utilizzo negli Unit Test

### Caricamento dell'Oracolo

```typescript
// stato-animo.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { StatoAnimoService } from './stato-animo.service';
import { db } from '../../drizzle/db.js';
import * as oracle from '../../../test/oracles/stato-animo-oracle.json';

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

    // Genera test da oracolo
    oracle.testCases.forEach((testCase) => {
        it(testCase.description, async () => {
            // Setup mock con dati dall'oracolo
            const mockSelect = jest.fn().mockReturnValue({
                from: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                        orderBy: jest.fn().mockReturnValue({
                            limit: jest.fn().mockResolvedValue(testCase.mockData.dbResponse),
                        }),
                    }),
                }),
            });
            (db.select as jest.Mock) = mockSelect;

            // Esegui il test
            const result = await service.getUltimoStatoAnimo(testCase.input.userId);

            // Verifica il risultato
            if (testCase.expectedOutput === null) {
                expect(result).toBeNull();
            } else {
                expect(result).toEqual(testCase.expectedOutput);
            }

            // Verifica comportamento
            if (testCase.expectedBehavior.shouldSucceed) {
                expect(mockSelect).toHaveBeenCalled();
            }
        });
    });
});
```

### Helper Function per Caricare Oracoli

`test/helpers/oracle-loader.ts`:

```typescript
import * as fs from 'fs';
import * as path from 'path';

export interface OracleTestCase {
    id: string;
    description: string;
    category: string;
    input: any;
    mockData: any;
    expectedOutput: any;
    expectedBehavior: any;
}

export interface Oracle {
    metadata: {
        version: string;
        description: string;
        createdAt: string;
        author: string;
    };
    testCases: OracleTestCase[];
}

/**
 * Carica un oracolo JSON
 */
export function loadOracle(oracleName: string): Oracle {
    const oraclePath = path.join(__dirname, '../oracles', `${oracleName}-oracle.json`);
    const content = fs.readFileSync(oraclePath, 'utf-8');
    return JSON.parse(content);
}

/**
 * Filtra test cases per categoria
 */
export function filterByCategory(oracle: Oracle, category: string): OracleTestCase[] {
    return oracle.testCases.filter(tc => tc.category === category);
}

/**
 * Ottiene un test case specifico per ID
 */
export function getTestCase(oracle: Oracle, id: string): OracleTestCase | undefined {
    return oracle.testCases.find(tc => tc.id === id);
}
```

### Uso dell'Helper

```typescript
import { loadOracle, filterByCategory } from '../helpers/oracle-loader';

describe('StatoAnimoService', () => {
    const oracle = loadOracle('stato-animo');

    // Test solo casi di successo
    const successCases = filterByCategory(oracle, 'success');
    successCases.forEach((testCase) => {
        it(testCase.description, async () => {
            // ... test logic
        });
    });

    // Test solo edge cases
    const edgeCases = filterByCategory(oracle, 'edge-case');
    edgeCases.forEach((testCase) => {
        it(testCase.description, async () => {
            // ... test logic
        });
    });
});
```

---

## ✅ Best Practices

### 1. Organizzazione dei File

```
test/
├── oracles/
│   ├── stato-animo-oracle.json
│   ├── diary-oracle.json
│   ├── user-oracle.json
│   └── ...
├── helpers/
│   ├── oracle-loader.ts
│   └── test-utils.ts
└── ...
```

### 2. Naming Convention

```
<service-name>-oracle.json

Esempi:
- stato-animo-oracle.json
- diary-oracle.json
- authentication-oracle.json
```

### 3. Versionamento

```json
{
  "metadata": {
    "version": "1.0.0",
    "lastModified": "2025-12-02T11:00:00Z",
    "changelog": [
      {
        "version": "1.0.0",
        "date": "2025-12-02",
        "changes": "Initial version"
      }
    ]
  }
}
```

### 4. Categorizzazione

```json
{
  "testCases": [
    {
      "category": "success",      // Casi di successo
      "category": "error",        // Casi di errore
      "category": "edge-case",    // Casi limite
      "category": "validation",   // Validazione input
      "category": "permission"    // Controlli permessi
    }
  ]
}
```

### 5. Documentazione

```json
{
  "id": "test-001",
  "description": "Descrizione chiara del test",
  "rationale": "Perché questo test è importante",
  "relatedBugs": ["BUG-123", "BUG-456"],
  "tags": ["critical", "regression"]
}
```

---

## 🤖 Automazione

### Script di Validazione Oracoli

`scripts/validate-oracles.js`:

```javascript
const fs = require('fs');
const path = require('path');

const oraclesDir = path.join(__dirname, '../test/oracles');

// Schema di validazione
const requiredFields = ['metadata', 'testCases'];
const metadataFields = ['version', 'description', 'createdAt', 'author'];
const testCaseFields = ['id', 'description', 'category', 'input', 'expectedOutput'];

function validateOracle(filePath) {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const errors = [];

    // Valida campi richiesti
    requiredFields.forEach(field => {
        if (!content[field]) {
            errors.push(`Missing required field: ${field}`);
        }
    });

    // Valida metadata
    if (content.metadata) {
        metadataFields.forEach(field => {
            if (!content.metadata[field]) {
                errors.push(`Missing metadata field: ${field}`);
            }
        });
    }

    // Valida test cases
    if (content.testCases) {
        content.testCases.forEach((tc, index) => {
            testCaseFields.forEach(field => {
                if (tc[field] === undefined) {
                    errors.push(`Test case ${index}: Missing field ${field}`);
                }
            });
        });
    }

    return errors;
}

// Valida tutti gli oracoli
const files = fs.readdirSync(oraclesDir).filter(f => f.endsWith('-oracle.json'));

let hasErrors = false;
files.forEach(file => {
    const filePath = path.join(oraclesDir, file);
    const errors = validateOracle(filePath);
    
    if (errors.length > 0) {
        console.error(`❌ ${file}:`);
        errors.forEach(err => console.error(`   - ${err}`));
        hasErrors = true;
    } else {
        console.log(`✅ ${file}`);
    }
});

process.exit(hasErrors ? 1 : 0);
```

### Integrazione in CI/CD

`package.json`:

```json
{
  "scripts": {
    "validate:oracles": "node scripts/validate-oracles.js",
    "test": "npm run validate:oracles && jest"
  }
}
```

---

## 📊 Template Oracolo

### Template Generico

```json
{
  "metadata": {
    "version": "1.0.0",
    "description": "Test oracle for [ServiceName]",
    "createdAt": "[ISO-DATE]",
    "author": "[AUTHOR-NAME]",
    "lastModified": "[ISO-DATE]"
  },
  "testCases": [
    {
      "id": "test-001",
      "description": "[TEST-DESCRIPTION]",
      "category": "success|error|edge-case|validation|permission",
      "tags": ["tag1", "tag2"],
      "input": {
        "param1": "value1",
        "param2": "value2"
      },
      "mockData": {
        "dbResponse": [],
        "apiResponse": {}
      },
      "expectedOutput": {
        "field1": "value1",
        "field2": "value2"
      },
      "expectedBehavior": {
        "shouldSucceed": true,
        "shouldThrow": false,
        "errorType": null,
        "errorMessage": null
      }
    }
  ]
}
```

---

## 🎯 Conclusioni

Gli oracoli JSON sono uno strumento potente per:

✅ **Standardizzare** i dati di test  
✅ **Automatizzare** la generazione di test  
✅ **Centralizzare** la gestione dei test data  
✅ **Facilitare** la manutenzione  
✅ **Migliorare** la leggibilità dei test  

**Prossimi passi**:
- Crea oracoli per i tuoi service
- Integra gli oracoli nei test esistenti
- Automatizza la validazione degli oracoli
- Usa la [Checklist Testing](./04_Checklist_Testing.md) per tracciare i progressi
