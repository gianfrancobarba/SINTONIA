#!/usr/bin/env node

/**
 * Script per generare oracolo per StatoAnimoService - getStoricoStatoAnimo
 */

import { OracleGenerator } from './generate-oracle.js';
import {
    CONFIG,
    generateUUID,
    randomChoice,
    randomInt,
    maybeNull,
    randomDateInLastDays,
    formatDate
} from './oracle-utils.js';

// ============================================================================
// EDGE CASES CRITICI (MANUALI)
// ============================================================================

function generateCriticalEdgeCases(generator) {
    console.log('📌 Aggiungendo edge cases critici...');

    // 1. Storico vuoto
    generator.addTestCase({
        description: 'getStoricoStatoAnimo - returns empty array when no moods in range',
        category: 'edge-case-critical',
        method: 'getStoricoStatoAnimo',
        input: {
            userId: '123e4567-e89b-12d3-a456-426614174000',
            giorni: 30,
        },
        mockData: {
            dbResponse: [],
        },
        expectedOutput: {
            entries: [],
        },
        expectedBehavior: {
            shouldSucceed: true,
            shouldThrow: false,
        },
    });

    // 2. Storico con 1 solo giorno
    generator.addTestCase({
        description: 'getStoricoStatoAnimo - handles single day range',
        category: 'edge-case-critical',
        method: 'getStoricoStatoAnimo',
        input: {
            userId: '123e4567-e89b-12d3-a456-426614174000',
            giorni: 1,
        },
        mockData: {
            dbResponse: [{
                umore: 'Sereno',
                intensita: 7,
                dataInserimento: new Date().toISOString(),
            }],
        },
        expectedOutput: {
            entries: [{
                date: formatDate(new Date()),
                umore: 'Sereno',
                intensita: 7,
            }],
        },
        expectedBehavior: {
            shouldSucceed: true,
            shouldThrow: false,
            singleDayRange: true,
        },
    });

    // 3. Filtro date - dati fuori range
    generator.addTestCase({
        description: 'getStoricoStatoAnimo - filters data outside date range',
        category: 'edge-case-critical',
        method: 'getStoricoStatoAnimo',
        input: {
            userId: '123e4567-e89b-12d3-a456-426614174000',
            giorni: 7,
        },
        mockData: {
            dbResponse: [
                {
                    umore: 'Felice',
                    intensita: 8,
                    dataInserimento: new Date('2025-12-02T10:00:00.000Z').toISOString(),
                },
                {
                    umore: 'Triste',
                    intensita: 3,
                    dataInserimento: new Date('2025-11-20T10:00:00.000Z').toISOString(), // Fuori range
                },
            ],
        },
        expectedOutput: {
            entries: [{
                date: '2025-12-02',
                umore: 'Felice',
                intensita: 8,
            }],
        },
        expectedBehavior: {
            shouldSucceed: true,
            shouldThrow: false,
            filteredByDate: true,
        },
    });

    // 4. Default giorni (30)
    generator.addTestCase({
        description: 'getStoricoStatoAnimo - uses default 30 days when giorni is missing',
        category: 'edge-case-critical',
        method: 'getStoricoStatoAnimo',
        input: {
            userId: '123e4567-e89b-12d3-a456-426614174000',
            // giorni is intentionally omitted
        },
        mockData: {
            dbResponse: [{
                umore: 'Sereno',
                intensita: 7,
                dataInserimento: new Date().toISOString(),
            }],
        },
        expectedOutput: {
            entries: [{
                date: formatDate(new Date()),
                umore: 'Sereno',
                intensita: 7,
            }],
        },
        expectedBehavior: {
            shouldSucceed: true,
            shouldThrow: false,
            defaultGiorni: true,
        },
    });
}

// ============================================================================
// GENERATORI RANDOM
// ============================================================================

function generateRandomSuccessCase_getStorico() {
    const giorni = randomInt(CONFIG.giorniMin, CONFIG.giorniMax);
    const numEntries = randomInt(1, 15);
    const userId = generateUUID();

    const dbResponse = [];
    const expectedEntries = [];

    for (let i = 0; i < numEntries; i++) {
        const umore = randomChoice(CONFIG.umoreEnum);
        const intensita = maybeNull(randomInt(CONFIG.intensitaMin, CONFIG.intensitaMax), CONFIG.nullProbabilityIntensita);
        const dataInserimento = randomDateInLastDays(giorni - 1);

        dbResponse.push({
            umore,
            intensita,
            dataInserimento: dataInserimento.toISOString(),
        });

        expectedEntries.push({
            date: formatDate(dataInserimento),
            umore,
            ...(intensita !== null && { intensita }),
        });
    }

    // Sort by timestamp DESC for dbResponse
    dbResponse.sort((a, b) => new Date(b.dataInserimento) - new Date(a.dataInserimento));

    // Sort by timestamp ASC for expectedEntries
    // We need to reconstruct the objects from dbResponse to ensure same order
    const sortedForExpected = [...dbResponse].reverse(); // ASC

    expectedEntries.length = 0; // Clear array
    sortedForExpected.forEach(e => {
        expectedEntries.push({
            date: formatDate(new Date(e.dataInserimento)),
            umore: e.umore,
            ...(e.intensita !== null && { intensita: e.intensita }),
        });
    });

    return {
        description: `getStoricoStatoAnimo - ${numEntries} entries in ${giorni} days`,
        category: 'success',
        method: 'getStoricoStatoAnimo',
        input: {
            userId,
            giorni,
        },
        mockData: {
            dbResponse,
        },
        expectedOutput: {
            entries: expectedEntries,
        },
        expectedBehavior: {
            shouldSucceed: true,
            shouldThrow: false,
        },
    };
}

function generateRandomEdgeCase() {
    const umore = randomChoice(CONFIG.umoreEnum);
    const dataInserimento = randomDateInLastDays(5);
    return {
        description: 'Random edge - storico with null intensita',
        category: 'edge-case',
        method: 'getStoricoStatoAnimo',
        input: {
            userId: generateUUID(),
            giorni: randomInt(7, 30),
        },
        mockData: {
            dbResponse: [{
                umore,
                intensita: null,
                dataInserimento: dataInserimento.toISOString(),
            }],
        },
        expectedOutput: {
            entries: [{
                date: formatDate(dataInserimento),
                umore,
            }],
        },
        expectedBehavior: {
            shouldSucceed: true,
            shouldThrow: false,
        },
    };
}

function generateStressCase() {
    const numEntries = randomInt(80, 100);
    const giorni = 30;
    const userId = generateUUID();

    const dbResponse = [];
    const expectedEntries = [];

    for (let i = 0; i < numEntries; i++) {
        const umore = randomChoice(CONFIG.umoreEnum);
        const intensita = maybeNull(randomInt(1, 10), 0.2);
        const dataInserimento = randomDateInLastDays(giorni - 1);

        dbResponse.push({
            umore,
            intensita,
            dataInserimento: dataInserimento.toISOString(),
        });

        expectedEntries.push({
            date: formatDate(dataInserimento),
            umore,
            ...(intensita !== null && { intensita }),
        });
    }

    // Sort by timestamp DESC for dbResponse
    dbResponse.sort((a, b) => new Date(b.dataInserimento) - new Date(a.dataInserimento));

    // Sort by timestamp ASC for expectedEntries
    const sortedForExpected = [...dbResponse].reverse(); // ASC

    expectedEntries.length = 0; // Clear array
    sortedForExpected.forEach(e => {
        expectedEntries.push({
            date: formatDate(new Date(e.dataInserimento)),
            umore: e.umore,
            ...(e.intensita !== null && { intensita: e.intensita }),
        });
    });

    return {
        description: `Stress test - ${numEntries} entries (near safety limit)`,
        category: 'stress',
        method: 'getStoricoStatoAnimo',
        input: {
            userId,
            giorni,
        },
        mockData: {
            dbResponse: dbResponse.slice(0, 100),
        },
        expectedOutput: {
            entries: expectedEntries,
        },
        expectedBehavior: {
            shouldSucceed: true,
            shouldThrow: false,
            largeDataset: true,
        },
    };
}

// ============================================================================
// MAIN
// ============================================================================

const generator = new OracleGenerator('StatoAnimoService - getStoricoStatoAnimo');

console.log('🎲 Generazione oracolo per getStoricoStatoAnimo...\n');

// 1. Edge cases critici (manuali)
generateCriticalEdgeCases(generator);
console.log(`✅ Edge cases critici: 3\n`);

// 2. Success cases random
console.log(`📊 Generando ${CONFIG.numRandomSuccessCases} success cases...`);
for (let i = 0; i < CONFIG.numRandomSuccessCases; i++) {
    generator.addTestCase(generateRandomSuccessCase_getStorico());
}

// 3. Edge cases random
console.log(`⚠️  Generando ${CONFIG.numRandomEdgeCases} edge cases random...`);
for (let i = 0; i < CONFIG.numRandomEdgeCases; i++) {
    generator.addTestCase(generateRandomEdgeCase());
}

// 4. Stress cases
console.log(`💪 Generando ${CONFIG.numStressCases} stress test cases...`);
for (let i = 0; i < CONFIG.numStressCases; i++) {
    generator.addTestCase(generateStressCase());
}

// Salva
const outputPath = './test/oracles/get-storico-stato-animo-oracle.json';
generator.save(outputPath);

console.log('\n✅ Oracolo getStoricoStatoAnimo generato con successo!');
console.log(`📊 Totale test cases: ${generator.oracle.testCases.length}`);
console.log('\n🎯 File generato:');
console.log(`   ${outputPath}`);
