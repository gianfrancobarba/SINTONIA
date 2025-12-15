import { Test, TestingModule } from '@nestjs/testing';
import { Compilazione_questionarioService } from '../../../../../src/patient/questionario/compilazione/compilazione_questionario.service.js';
import { db } from '../../../../../src/drizzle/db.js';
import { loadOracle, getTestCase } from '../../../../helpers/oracle-loader.js';
import { ScoreService } from '../../../../../src/patient/score/score.service.js';
import { AlertService } from '../../../../../src/patient/alert/alert.service.js';
import { BadgeService } from '../../../../../src/patient/badge/badge.service.js';

// Mock DB
jest.mock('../../../../../src/drizzle/db.js', () => ({
    db: {
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
    }
}));

describe('Compilazione_questionarioService - Unit 4: Esecuzione Calcolo Score', () => {
    let service: Compilazione_questionarioService;
    const oracle = loadOracle('patient/questionario/compilazione/compilazione-unit4');

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

        // Skip validation
        service.validazioneCalcoloScore = jest.fn().mockResolvedValue(true);
    });

    const testCases = ['TC_RF3_12', 'TC_RF3_13'];

    testCases.forEach(id => {
        const testCase = getTestCase(oracle, id);
        if (!testCase) return;

        it(`${testCase.id}: ${testCase.description}`, async () => {
            const { input, mockData, expectedBehavior } = testCase;
            console.log(`\n🔹 [${testCase.id}] TEST START`);
            console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));

            // Mock DB response for tipologia config
            if (mockData.punteggioConfig) {
                ((db as any).limit as jest.Mock).mockResolvedValue([{
                    punteggio: mockData.punteggioConfig
                }]);
            }

            try {
                const result = await service.calculateScore(input.nomeTipologia, input.risposte);

                console.log(`📤 ACTUAL: Success (Score: ${result})`);
                if (expectedBehavior.type === 'exception') {
                    throw new Error(`Expected error but got success`);
                }

                expect(result).toBe(expectedBehavior.expectedResult);

            } catch (e) {
                console.log(`📤 ACTUAL: Exception "${e.message}"`);
                if (e.message.startsWith('Expected error')) throw e;
                throw e;
            }
        });
    });
});
