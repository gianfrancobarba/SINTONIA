import { Test, TestingModule } from '@nestjs/testing';
import { Accettazione_invalidazioneService } from '../../../../src/amministratore/invalidazione/accettazione_invalidazione.service.js';
import { ScoreService } from '../../../../src/patient/score/score.service.js';
import { PrioritaService } from '../../../../src/patient/priorita/priorita.service.js';
import { NotificationHelperService } from '../../../../src/notifications/notification-helper.service.js';
import { db } from '../../../../src/drizzle/db.js';
import { loadOracle, getTestCase } from '../../../helpers/oracle-loader.js';

jest.mock('../../../../src/drizzle/db.js');

describe('Accettazione_invalidazioneService - Unit 4: Downgrade Priorità', () => {
    let service: Accettazione_invalidazioneService;
    const oracle = loadOracle('admin/invalidation/accettazione-invalidazione-unit4');

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

    const testCases = ['TC_RF21_20', 'TC_RF21_21', 'TC_RF21_22', 'TC_RF21_23', 'TC_RF21_24', 'TC_RF21_25'];

    testCases.forEach(id => {
        const testCase = getTestCase(oracle, id);
        if (!testCase) return;

        it(`${testCase.id}: ${testCase.description}`, async () => {
            const { input, mockData, expectedBehavior } = testCase;
            console.log(`\n🔹 [${testCase.id}] TEST START`);
            console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));
            console.log(`🎯 EXPECTED: ${expectedBehavior.type === 'exception' ? `Exception "${expectedBehavior.message}"` : 'Success'}`);

            // Mock Patient
            const pazienteMock = mockData.pazienteExists === false ? null : { idPaziente: input.idPaziente, idPriorita: mockData.priorita };
            jest.spyOn(db.query.paziente, 'findFirst').mockResolvedValue(pazienteMock as any);

            // Mock Update
            const updateSetMock = jest.fn().mockReturnValue({ where: jest.fn().mockResolvedValue({}) });
            (db.update as jest.Mock).mockReturnValue({ set: updateSetMock });

            try {
                await (service as any).downgradePriorita(input.idPaziente);

                if (expectedBehavior.type === 'exception') {
                    throw new Error(`Expected error "${expectedBehavior.message}" but got SUCCESS`);
                }

                console.log(`📤 ACTUAL: Success`);
                expect(db.update).toHaveBeenCalled();
                const setCalls = updateSetMock.mock.calls[0][0];
                expect(setCalls.idPriorita).toBe(expectedBehavior.expectedPriorita);

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
