import { Test, TestingModule } from '@nestjs/testing';
import { Accettazione_invalidazioneService } from '../../../../src/amministratore/invalidazione/accettazione_invalidazione.service.js';
import { ScoreService } from '../../../../src/patient/score/score.service.js';
import { PrioritaService } from '../../../../src/patient/priorita/priorita.service.js';
import { NotificationHelperService } from '../../../../src/notifications/notification-helper.service.js';
import { db } from '../../../../src/drizzle/db.js';
import { loadOracle, getTestCase } from '../../../helpers/oracle-loader.js';

jest.mock('../../../../src/drizzle/db.js');

describe('Accettazione_invalidazioneService - Unit 3: Ricalcolo Score', () => {
    let service: Accettazione_invalidazioneService;
    let scoreService: ScoreService;
    let prioritaService: PrioritaService;
    const oracle = loadOracle('admin/invalidation/accettazione-invalidazione-unit3');

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                Accettazione_invalidazioneService,
                {
                    provide: ScoreService,
                    useValue: { calculatePatientScore: jest.fn() }
                },
                {
                    provide: PrioritaService,
                    useValue: { getFasciaPriorita: jest.fn() }
                },
                { provide: NotificationHelperService, useValue: {} },
            ],
        }).compile();

        service = module.get<Accettazione_invalidazioneService>(Accettazione_invalidazioneService);
        scoreService = module.get<ScoreService>(ScoreService);
        prioritaService = module.get<PrioritaService>(PrioritaService);
    });

    const testCases = ['TC_RF21_13', 'TC_RF21_14', 'TC_RF21_15', 'TC_RF21_16', 'TC_RF21_17', 'TC_RF21_18', 'TC_RF21_19'];

    testCases.forEach(id => {
        const testCase = getTestCase(oracle, id);
        if (!testCase) return;

        it(`${testCase.id}: ${testCase.description}`, async () => {
            const { input, mockData, expectedBehavior } = testCase;
            console.log(`\n🔹 [${testCase.id}] TEST START`);
            console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));
            console.log(`🎯 EXPECTED: ${expectedBehavior.type === 'exception' ? `Exception "${expectedBehavior.message}"` : 'Success'}`);

            const dataInput = input.data === "FUTURE"
                ? new Date(new Date().getTime() + 86400000)
                : (input.data ? new Date(input.data) : null);

            // Mock Patient
            const pazienteMock = mockData.pazienteExists === false ? null : { idPaziente: input.idPaziente, idPriorita: 'prio' };
            jest.spyOn(db.query.paziente, 'findFirst').mockResolvedValue(pazienteMock as any);

            // Mock Priorita
            if (mockData.fasciaMin) {
                (prioritaService.getFasciaPriorita as jest.Mock).mockResolvedValue({ punteggioInizio: mockData.fasciaMin });
            }

            // Mock Questionari da ricalcolare
            const questionariMock = mockData.questionari ? mockData.questionari.map(q => ({
                id: q.id,
                data: new Date(q.data)
            })) : [];

            // Mock db.select...
            const orderByMock = jest.fn().mockResolvedValue(questionariMock);
            const whereMock = jest.fn().mockReturnValue({ orderBy: orderByMock });
            const fromMock = jest.fn().mockReturnValue({ where: whereMock });
            // @ts-ignore
            (db.select as jest.Mock).mockReturnValue({ from: fromMock });

            // Mock Score Calculation
            if (mockData.questionari && mockData.questionari.length > 0) {
                const q = mockData.questionari[0];
                (scoreService.calculatePatientScore as jest.Mock)
                    .mockResolvedValueOnce(q.scorePre) // First call (time-travel pre)
                    .mockResolvedValueOnce(q.scorePost); // Second call (post)
            }

            // Mock Update
            const updateSetMock = jest.fn().mockReturnValue({ where: jest.fn().mockResolvedValue({}) });
            (db.update as jest.Mock).mockReturnValue({ set: updateSetMock });

            try {
                const result = await (service as any).ricalcolaScoreIncrementale(input.idPaziente, dataInput);

                if (expectedBehavior.type === 'exception') {
                    throw new Error(`Expected error "${expectedBehavior.message}" but got SUCCESS`);
                }

                console.log(`📤 ACTUAL: Success (Result: ${result})`);

                // Assertion on Result
                expect(result).toBe(expectedBehavior.result);

                // Assertion on DB Change
                if (expectedBehavior.dbChange) {
                    expect(db.update).toHaveBeenCalled();
                    const setCalls = updateSetMock.mock.calls[0][0];
                    expect(setCalls.cambiamento).toBe(expectedBehavior.changeValue);
                } else {
                    // It might be called even if dbChange=false for TC 17?
                    // TC 17: Post(70) < Min(80) -> raggiuntaFascia=false. Loops ends. NO update.
                    // TC 19: Post(85) >= Min(80) -> raggiuntaFascia=true. Pre(82) >= Min(80) -> Else block -> update(cambiamento=false).
                    if (testCase.id === 'TC_RF21_17') {
                        expect(db.update).not.toHaveBeenCalled();
                    }
                }

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
