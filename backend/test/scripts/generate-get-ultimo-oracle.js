#!/usr/bin/env node

/**
 * Script per generare oracolo per StatoAnimoService - getUltimoStatoAnimo
 */

import { OracleGenerator } from './generate-oracle.js';
import {
    CONFIG,
    generateUUID,
    randomChoice,
    randomInt,
    maybeNull,
    randomDateInLastDays,
    generateRandomNote
} from './oracle-utils.js';

// ============================================================================
// EDGE CASES CRITICI (MANUALI)
// ============================================================================

function generateCriticalEdgeCases(generator) {
    console.log('📌 Aggiungendo edge cases critici...');

    // 1. User senza stati d'animo (null)
    generator.addTestCase({
        description: 'getUltimoStatoAnimo - returns null when user has no moods',
        category: 'edge-case-critical',
        method: 'getUltimoStatoAnimo',
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
            shouldReturnNull: true,
        },
    });

    // 2. Tutti i campi opzionali null
    generator.addTestCase({
        description: 'getUltimoStatoAnimo - handles all optional fields as null',
        category: 'edge-case-critical',
        method: 'getUltimoStatoAnimo',
        input: {
            userId: '123e4567-e89b-12d3-a456-426614174000',
        },
        mockData: {
            dbResponse: [{
                umore: 'Neutro',
                intensita: null,
                note: null,
                dataInserimento: new Date('2025-12-02T10:00:00.000Z').toISOString(),
            }],
        },
        expectedOutput: {
            umore: 'Neutro',
            dataInserimento: new Date('2025-12-02T10:00:00.000Z').toISOString(),
        },
        expectedBehavior: {
            shouldSucceed: true,
            shouldThrow: false,
            optionalFieldsUndefined: ['intensita', 'note'],
        },
    });

    // 3. Note molto lunghe (vicino al limite 500)
    generator.addTestCase({
        description: 'getUltimoStatoAnimo - handles long note near 500 char limit',
        category: 'edge-case-critical',
        method: 'getUltimoStatoAnimo',
        input: {
            userId: '123e4567-e89b-12d3-a456-426614174000',
        },
        mockData: {
            dbResponse: [{
                umore: 'Ansioso',
                intensita: 7,
                note: 'A'.repeat(490), // Vicino al limite
                dataInserimento: new Date().toISOString(),
            }],
        },
        expectedOutput: {
            umore: 'Ansioso',
            intensita: 7,
            note: 'A'.repeat(490),
            dataInserimento: new Date().toISOString(),
        },
        expectedBehavior: {
            shouldSucceed: true,
            shouldThrow: false,
            longNote: true,
        },
    });

    // 4. Intensità estrema (1)
    generator.addTestCase({
        description: 'getUltimoStatoAnimo - handles minimum intensita (1)',
        category: 'edge-case-critical',
        method: 'getUltimoStatoAnimo',
        input: {
            userId: '123e4567-e89b-12d3-a456-426614174000',
        },
        mockData: {
            dbResponse: [{
                umore: 'Stanco',
                intensita: 1,
                note: 'Molto stanco oggi',
                dataInserimento: new Date().toISOString(),
            }],
        },
        expectedOutput: {
            umore: 'Stanco',
            intensita: 1,
            note: 'Molto stanco oggi',
            dataInserimento: new Date().toISOString(),
        },
        expectedBehavior: {
            shouldSucceed: true,
            shouldThrow: false,
            extremeIntensita: 'min',
        },
    });

    // 5. Intensità estrema (10)
    generator.addTestCase({
        description: 'getUltimoStatoAnimo - handles maximum intensita (10)',
        category: 'edge-case-critical',
        method: 'getUltimoStatoAnimo',
        input: {
            userId: '123e4567-e89b-12d3-a456-426614174000',
        },
        mockData: {
            dbResponse: [{
                umore: 'Felice',
                intensita: 10,
                note: 'Giornata fantastica!',
                dataInserimento: new Date().toISOString(),
            }],
        },
        expectedOutput: {
            umore: 'Felice',
            intensita: 10,
            note: 'Giornata fantastica!',
            dataInserimento: new Date().toISOString(),
        },
        expectedBehavior: {
            shouldSucceed: true,
            shouldThrow: false,
            extremeIntensita: 'max',
        },
    });
}

// ============================================================================
// GENERATORI RANDOM
// ============================================================================

function generateRandomSuccessCase_getUltimo() {
    const umore = randomChoice(CONFIG.umoreEnum);
    const intensita = maybeNull(randomInt(CONFIG.intensitaMin, CONFIG.intensitaMax), CONFIG.nullProbabilityIntensita);
    const note = maybeNull(generateRandomNote(), CONFIG.nullProbabilityNote);
    const dataInserimento = randomDateInLastDays(30);

    return {
        description: `getUltimoStatoAnimo - ${umore} with ${intensita !== null ? `intensita ${intensita}` : 'no intensita'} and ${note !== null ? 'note' : 'no note'}`,
        category: 'success',
        method: 'getUltimoStatoAnimo',
        input: {
            userId: generateUUID(),
        },
        mockData: {
            dbResponse: [{
                umore,
                intensita,
                note,
                dataInserimento: dataInserimento.toISOString(),
            }],
        },
        expectedOutput: {
            umore,
            ...(intensita !== null && { intensita }),
            ...(note !== null && { note }),
            dataInserimento: dataInserimento.toISOString(),
        },
        expectedBehavior: {
            shouldSucceed: true,
            shouldThrow: false,
        },
    };
}

function generateRandomEdgeCase() {
    const types = [
        // Solo intensita null
        () => {
            const umore = randomChoice(CONFIG.umoreEnum);
            const note = generateRandomNote();
            const dataInserimento = randomDateInLastDays(10).toISOString();
            return {
                description: 'Random edge - intensita null, note present',
                category: 'edge-case',
                method: 'getUltimoStatoAnimo',
                input: { userId: generateUUID() },
                mockData: {
                    dbResponse: [{
                        umore,
                        intensita: null,
                        note,
                        dataInserimento,
                    }],
                },
                expectedOutput: {
                    umore,
                    note,
                    dataInserimento,
                },
                expectedBehavior: {
                    shouldSucceed: true,
                    shouldThrow: false,
                },
            };
        },

        // Solo note null
        () => {
            const umore = randomChoice(CONFIG.umoreEnum);
            const intensita = randomInt(1, 10);
            const dataInserimento = randomDateInLastDays(10).toISOString();
            return {
                description: 'Random edge - note null, intensita present',
                category: 'edge-case',
                method: 'getUltimoStatoAnimo',
                input: { userId: generateUUID() },
                mockData: {
                    dbResponse: [{
                        umore,
                        intensita,
                        note: null,
                        dataInserimento,
                    }],
                },
                expectedOutput: {
                    umore,
                    intensita,
                    dataInserimento,
                },
                expectedBehavior: {
                    shouldSucceed: true,
                    shouldThrow: false,
                },
            };
        },
    ];

    return randomChoice(types)();
}

// ============================================================================
// MAIN
// ============================================================================

const generator = new OracleGenerator('StatoAnimoService - getUltimoStatoAnimo');

console.log('🎲 Generazione oracolo per getUltimoStatoAnimo...\n');

// 1. Edge cases critici (manuali)
generateCriticalEdgeCases(generator);
console.log(`✅ Edge cases critici: 5\n`);

// 2. Success cases random
console.log(`📊 Generando ${CONFIG.numRandomSuccessCases} success cases...`);
for (let i = 0; i < CONFIG.numRandomSuccessCases; i++) {
    generator.addTestCase(generateRandomSuccessCase_getUltimo());
}

// 3. Edge cases random
console.log(`⚠️  Generando ${CONFIG.numRandomEdgeCases} edge cases random...`);
for (let i = 0; i < CONFIG.numRandomEdgeCases; i++) {
    generator.addTestCase(generateRandomEdgeCase());
}

// Salva
const outputPath = './test/oracles/get-ultimo-stato-animo-oracle.json';
generator.save(outputPath);

console.log('\n✅ Oracolo getUltimoStatoAnimo generato con successo!');
console.log(`📊 Totale test cases: ${generator.oracle.testCases.length}`);
console.log('\n🎯 File generato:');
console.log(`   ${outputPath}`);
