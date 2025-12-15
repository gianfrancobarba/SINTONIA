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
        insert: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
    }
}));

describe('Compilazione_questionarioService - Unit 6: Esecuzione Invio', () => {
    let service: Compilazione_questionarioService;
    let scoreService: ScoreService;
    let alertService: AlertService;
    let badgeService: BadgeService;
    const oracle = loadOracle('patient/questionario/compilazione/compilazione-unit6');

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                Compilazione_questionarioService,
                { provide: ScoreService, useValue: { updatePatientScore: jest.fn() } },
                { provide: AlertService, useValue: { createAlertIfNeeded: jest.fn() } },
                { provide: BadgeService, useValue: { checkAndAwardBadges: jest.fn() } },
            ],
        }).compile();

        service = module.get<Compilazione_questionarioService>(Compilazione_questionarioService);
        scoreService = module.get<ScoreService>(ScoreService);
        alertService = module.get<AlertService>(AlertService);
        badgeService = module.get<BadgeService>(BadgeService);

        jest.clearAllMocks();

        // Mock validazioneInvio and calculateScore
        service.validazioneInvio = jest.fn().mockResolvedValue(true);
        service.calculateScore = jest.fn().mockResolvedValue(50);
    });

    const testCases = ['TC_RF3_18', 'TC_RF3_19'];

    testCases.forEach(id => {
        const testCase = getTestCase(oracle, id);
        if (!testCase) return;

        it(`${testCase.id}: ${testCase.description}`, async () => {
            const { input, mockData, expectedBehavior } = testCase;
            console.log(`\n🔹 [${testCase.id}] TEST START`);
            console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));

            // Mock DB Insert
            ((db as any).returning as jest.Mock).mockResolvedValue(mockData.insertSuccess ? [{ id: 'new-quest-id' }] : []);

            if (mockData.calculatedScore) {
                (service.calculateScore as jest.Mock).mockResolvedValue(mockData.calculatedScore);
            }

            try {
                const result = await service.submitQuestionario(input.idPaziente, input.nomeTipologia, input.risposte);

                console.log(`📤 ACTUAL: Success`);
                if (expectedBehavior.type === 'exception') {
                    throw new Error(`Expected error but got success`);
                }

                expect(result.idQuestionario).toBe('new-quest-id');
                expect(result.score).toBe(mockData.calculatedScore);

                // Verify interactions
                expect(scoreService.updatePatientScore).toHaveBeenCalled();
                expect(alertService.createAlertIfNeeded).toHaveBeenCalled();
                expect(badgeService.checkAndAwardBadges).toHaveBeenCalled();

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
