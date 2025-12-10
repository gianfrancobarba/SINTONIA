import { Test, TestingModule } from '@nestjs/testing';
import { Accettazione_invalidazioneService } from '../../../../src/amministratore/invalidazione/accettazione_invalidazione.service.js';
import { ScoreService } from '../../../../src/patient/score/score.service.js';
import { PrioritaService } from '../../../../src/patient/priorita/priorita.service.js';
import { NotificationHelperService } from '../../../../src/notifications/notification-helper.service.js';
import { db } from '../../../../src/drizzle/db.js';
import { loadOracle, getTestCase } from '../../../helpers/oracle-loader.js';

jest.mock('../../../../src/drizzle/db.js');

describe('Accettazione_invalidazioneService - Unit 1: Validazione', () => {
    let service: Accettazione_invalidazioneService;
    const oracle = loadOracle('admin/invalidation/accettazione-invalidazione-unit1');

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                Accettazione_invalidazioneService,
                { provide: ScoreService, useValue: {} },
                { provide: PrioritaService, useValue: {} },
                { provide: NotificationHelperService, useValue: {} },
            ],
        }).compile();

        service = module.get<Accettazione_invalidazioneService>(Accettazione_invalidazioneService);
    });

    const testCases = ['TC_RF21_1', 'TC_RF21_2', 'TC_RF21_3', 'TC_RF21_4', 'TC_RF21_5', 'TC_RF21_6'];

    testCases.forEach(id => {
        const testCase = getTestCase(oracle, id);
        if (!testCase) return;

        it(`${testCase.id}: ${testCase.description}`, async () => {
            const { input, mockData, expectedBehavior } = testCase;
            console.log(`\n🔹 [${testCase.id}] TEST START`);
            console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));
            console.log(`🎯 EXPECTED: ${expectedBehavior.type === 'exception' ? `Exception "${expectedBehavior.message}"` : 'Success'}`);

            // Mocks
            const questionarioMock = mockData.questionarioExists ? {
                idQuestionario: input.idQuestionario,
                invalidato: mockData.invalidato
            } : null;

            const adminMock = mockData.adminExists ? {
                email: input.emailAmministratore
            } : null;

            // Mock db.query structure if needed, using Object.assign or similar to bypass simplistic read-only checks if the mock was created that way
            // However, usually with jest.mock, we can define the structure.
            // Let's rely on the fact that if we use spyOn, it must exist.
            // If it doesn't exist, we must initialize it.

            // @ts-ignore
            if (!db.query) db.query = {};
            // @ts-ignore
            if (!db.query.questionario) db.query.questionario = {};
            // @ts-ignore
            if (!db.query.amministratore) db.query.amministratore = {};

            // Mock db.query.questionario.findFirst
            // @ts-ignore
            db.query.questionario.findFirst = jest.fn().mockResolvedValue(questionarioMock);
            // Mock db.query.amministratore.findFirst
            // @ts-ignore
            db.query.amministratore.findFirst = jest.fn().mockResolvedValue(adminMock);

            try {
                await service.validazione(input.idQuestionario, input.emailAmministratore);

                if (expectedBehavior.type === 'exception') {
                    throw new Error(`Expected error "${expectedBehavior.message}" but got SUCCESS`);
                }
                console.log(`📤 ACTUAL: Success`);
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
