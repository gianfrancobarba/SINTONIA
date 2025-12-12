import { Test, TestingModule } from '@nestjs/testing';
import { Accettazione_invalidazioneService } from '../../../../src/amministratore/invalidazione/accettazione_invalidazione.service.js';
import { ScoreService } from '../../../../src/patient/score/score.service.js';
import { PrioritaService } from '../../../../src/patient/priorita/priorita.service.js';
import { NotificationHelperService } from '../../../../src/notifications/notification-helper.service.js';
import { db } from '../../../../src/drizzle/db.js';
import { loadOracle, getTestCase } from '../../../helpers/oracle-loader.js';

jest.mock('../../../../src/drizzle/db.js');

describe('Accettazione_invalidazioneService - Unit 5: Esecuzione', () => {
    let service: Accettazione_invalidazioneService;
    let notificationHelper: NotificationHelperService;
    let scoreService: ScoreService;
    const oracle = loadOracle('admin/invalidation/accettazione-invalidazione-unit5');

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                Accettazione_invalidazioneService,
                {
                    provide: ScoreService,
                    useValue: { updatePatientScore: jest.fn() }
                },
                { provide: PrioritaService, useValue: {} },
                {
                    provide: NotificationHelperService,
                    useValue: { notifyPsicologo: jest.fn() }
                },
            ],
        }).compile();

        service = module.get<Accettazione_invalidazioneService>(Accettazione_invalidazioneService);
        notificationHelper = module.get<NotificationHelperService>(NotificationHelperService);
        scoreService = module.get<ScoreService>(ScoreService);

        // Mock internal methods to isolate Unit 5 orchestration logic
        jest.spyOn(service, 'validazione').mockResolvedValue({
            idQuestionario: 'q1',
            idPaziente: 'paz1',
            dataCompilazione: new Date('2023-01-01'),
            idPsicologoRichiedente: 'psi1'
        } as any);

        jest.spyOn(service as any, 'trovaQuestionarioPrecedenteConCambiamento').mockResolvedValue(null);
        jest.spyOn(service as any, 'ricalcolaScoreIncrementale').mockResolvedValue(true);
    });

    const testCases = ['TC_RF21_26', 'TC_RF21_27'];

    testCases.forEach(id => {
        const testCase = getTestCase(oracle, id);
        if (!testCase) return;

        it(`${testCase.id}: ${testCase.description}`, async () => {
            const { input, mockData, expectedBehavior } = testCase;
            console.log(`\n🔹 [${testCase.id}] TEST START`);
            console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));
            console.log(`🎯 EXPECTED: ${expectedBehavior.type === 'exception' ? `Exception "${expectedBehavior.message}"` : 'Success'}`);

            // Mock DB Update for Invalidation
            if (mockData.dbError) {
                const updateSetMock = jest.fn().mockReturnValue({ where: jest.fn().mockRejectedValue(new Error("Database Error")) });
                (db.update as jest.Mock).mockReturnValue({ set: updateSetMock });
            } else {
                const updateSetMock = jest.fn().mockReturnValue({ where: jest.fn().mockResolvedValue({}) });
                (db.update as jest.Mock).mockReturnValue({ set: updateSetMock });

                // Mock DB query for ultimoValido inside simple recalc path
                jest.spyOn(db.query.questionario, 'findFirst').mockResolvedValue({ idQuestionario: 'lastQ' } as any);
            }

            try {
                await service.accettaRichiestaInvalidazione(input.idQuestionario, input.email);

                if (expectedBehavior.type === 'exception') {
                    throw new Error(`Expected error "${expectedBehavior.message}" but got SUCCESS`);
                }

                console.log(`📤 ACTUAL: Success`);
                expect(db.update).toHaveBeenCalled();

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
