#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Genera un oracolo JSON per i test
 */
export class OracleGenerator {
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

// CLI usage
if (process.argv[1] === fileURLToPath(import.meta.url)) {
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
