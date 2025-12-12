import { Test, TestingModule } from '@nestjs/testing';
import { Compilazione_questionarioService } from '../../../../../src/patient/questionario/compilazione/compilazione_questionario.service.js';
import { db } from '../../../../../src/drizzle/db.js';
import { loadOracle, getTestCase } from '../../../../helpers/oracle-loader.js';
import { BadRequestException, NotFoundException } from '@nestjs/common';
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

describe('Compilazione_questionarioService - Unit 5: Validazione Invio', () => {
    let service: Compilazione_questionarioService;
    const oracle = loadOracle('patient/questionario/compilazione/compilazione-unit5');

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
    });

    const testCases = ['TC_RF3_14', 'TC_RF3_15', 'TC_RF3_16', 'TC_RF3_17'];

    testCases.forEach(id => {
        const testCase = getTestCase(oracle, id);
        if (!testCase) return;

        it(`${testCase.id}: ${testCase.description}`, async () => {
            const { input, mockData, expectedBehavior } = testCase;
            console.log(`\n🔹 [${testCase.id}] TEST START`);
            console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));

            // Mock DB for Patient check
            if (mockData.pazienteExists !== undefined) {
                ((db as any).limit as jest.Mock).mockResolvedValue(mockData.pazienteExists ? [{ id: '1' }] : []);
            }

            try {
                const result = await service.validazioneInvio(input.idPaziente, input.nomeTipologia, input.risposte);

                console.log(`📤 ACTUAL: Success`);
                if (expectedBehavior.type === 'exception') {
                    throw new Error(`Expected error but got success`);
                }
                expect(result).toBe(true);

            } catch (e) {
                console.log(`📤 ACTUAL: Exception "${e.message}"`);
                if (e.message.startsWith('Expected error')) throw e;

                if (expectedBehavior.type === 'exception') {
                    if (expectedBehavior.status === 400) expect(e).toBeInstanceOf(BadRequestException);
                    if (expectedBehavior.status === 404) expect(e).toBeInstanceOf(NotFoundException);
                    expect(e.message).toContain(expectedBehavior.message);
                } else {
                    throw e;
                }
            }
        });
    });
});
