import { Test, TestingModule } from '@nestjs/testing';
import { Compilazione_questionarioService } from '../../../../../src/patient/questionario/compilazione/compilazione_questionario.service.js';
import { db } from '../../../../../src/drizzle/db.js';
import { loadOracle, getTestCase } from '../../../../helpers/oracle-loader.js';
import { ScoreService } from '../../../../../src/patient/score/score.service.js';
import { AlertService } from '../../../../../src/patient/alert/alert.service.js';
import { BadgeService } from '../../../../../src/patient/badge/badge.service.js';

// Mock dependencies
jest.mock('../../../../../src/drizzle/db.js', () => ({
    db: {
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
    }
}));

describe('Compilazione_questionarioService - Unit 2: Esecuzione Recupero', () => {
    let service: Compilazione_questionarioService;
    const oracle = loadOracle('patient/questionario/compilazione/compilazione-unit2');

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                Compilazione_questionarioService,
                { provide: ScoreService, useValue: {} },
                { provide: AlertService, useValue: {} },
                { provide: BadgeService, useValue: {} },
            ],
        }).compile();

        service = module.get<Compilazione_questionarioService>(Compilazione_questionarioService);
        jest.clearAllMocks();

        // Mock validazioneRecupero to always pass as Unit 2 focuses on Execution
        service.validazioneRecupero = jest.fn().mockResolvedValue(true);
        ((db as any).limit as jest.Mock).mockReset();
    });

    const testCases = ['TC_RF3_4', 'TC_RF3_5', 'TC_RF3_6', 'TC_RF3_7'];

    testCases.forEach(id => {
        const testCase = getTestCase(oracle, id);
        if (!testCase) return;

        it(`${testCase.id}: ${testCase.description}`, async () => {
            const { input, mockData, expectedBehavior } = testCase;
            console.log(`\n🔹 [${testCase.id}] TEST START`);
            console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));

            // Mock DB
            const mockDb = jest.fn();
            if (mockData.isUuid !== undefined) {
                if (mockData.isUuid) {
                    // UUID path
                    ((db as any).limit as jest.Mock)
                        .mockResolvedValueOnce(mockData.questionarioDb || []) // First query for questionario
                        .mockResolvedValueOnce(mockData.tipologiaDb || []); // Second query for tipo
                } else {
                    // Typology path
                    ((db as any).limit as jest.Mock)
                        .mockResolvedValueOnce(mockData.tipologiaDb || []);
                }
            }

            try {
                const result = await service.getQuestionarioDto(input.idQuestionario);

                console.log(`📤 ACTUAL: Success (Result: ${JSON.stringify(result)})`);
                if (expectedBehavior.type === 'exception') {
                    throw new Error(`Expected error but got success`);
                }

                expect(result).toBeDefined();
                expect(result.idQuestionario).toBe(expectedBehavior.expectedResult.idQuestionario);

            } catch (e) {
                console.log(`📤 ACTUAL: Exception "${e.message}"`);
                if (e.message.startsWith('Expected error')) throw e;

                if (expectedBehavior.type === 'exception') {
                    expect(e.message).toContain(expectedBehavior.message);
                } else {
                    throw e;
                }
            }
        });
    });
});
