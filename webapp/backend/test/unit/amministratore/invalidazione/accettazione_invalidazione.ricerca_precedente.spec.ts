import { Test, TestingModule } from '@nestjs/testing';
import { Accettazione_invalidazioneService } from '../../../../src/amministratore/invalidazione/accettazione_invalidazione.service.js';
import { ScoreService } from '../../../../src/patient/score/score.service.js';
import { PrioritaService } from '../../../../src/patient/priorita/priorita.service.js';
import { NotificationHelperService } from '../../../../src/notifications/notification-helper.service.js';
import { db } from '../../../../src/drizzle/db.js';
import { loadOracle, getTestCase } from '../../../helpers/oracle-loader.js';

jest.mock('../../../../src/drizzle/db.js');

describe('Accettazione_invalidazioneService - Unit 2: Ricerca Precedente', () => {
    let service: Accettazione_invalidazioneService;
    const oracle = loadOracle('admin/invalidation/accettazione-invalidazione-unit2');

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

    const testCases = ['TC_RF21_7', 'TC_RF21_8', 'TC_RF21_9', 'TC_RF21_10', 'TC_RF21_11', 'TC_RF21_12'];

    testCases.forEach(id => {
        const testCase = getTestCase(oracle, id);
        if (!testCase) return;

        it(`${testCase.id}: ${testCase.description}`, async () => {
            const { input, mockData, expectedBehavior } = testCase;
            console.log(`\n🔹 [${testCase.id}] TEST START`);
            console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));
            console.log(`🎯 EXPECTED: ${expectedBehavior.type === 'exception' ? `Exception "${expectedBehavior.message}"` : 'Success'}`);

            // Parsing the Date input might be needed if it passes string
            const dataInput = input.data === "FUTURE_DATE"
                ? new Date(new Date().getTime() + 86400000)
                : (input.data ? new Date(input.data) : null);

            // Mock Patient Check
            const pazienteMock = mockData.pazienteEsiste === false ? null : { idPaziente: input.idPaziente };
            jest.spyOn(db.query.paziente, 'findFirst').mockResolvedValue(pazienteMock as any);

            // Mock Query Result
            const queryResult = mockData.queryResult ? mockData.queryResult.map(q => ({
                id: q.id,
                data: new Date(q.data)
            })) : [];

            // Mock db.select...
            const limitMock = jest.fn().mockResolvedValue(queryResult);
            const orderByMock = jest.fn().mockReturnValue({ limit: limitMock });
            const whereMock = jest.fn().mockReturnValue({ orderBy: orderByMock });
            const fromMock = jest.fn().mockReturnValue({ where: whereMock });
            // @ts-ignore
            (db.select as jest.Mock).mockReturnValue({ from: fromMock });

            try {
                // Accessing private method
                const result = await (service as any).trovaQuestionarioPrecedenteConCambiamento(input.idPaziente, dataInput);

                if (expectedBehavior.type === 'exception') {
                    throw new Error(`Expected error "${expectedBehavior.message}" but got SUCCESS`);
                } else if (expectedBehavior.type === 'result_behavior') {
                    // Special checking for TC_RF21_10 if falling back to empty
                    console.log(`📤 ACTUAL: Success (Fallback behavior)`);
                } else {
                    console.log(`📤 ACTUAL: Success`);
                    // Check result Structure
                    if (expectedBehavior.result === null) {
                        expect(result).toBeNull();
                    } else {
                        expect(result).toBeDefined();
                        expect(result.id).toBe(expectedBehavior.result.id);
                    }
                }
            } catch (e) {
                console.log(`📤 ACTUAL: Exception "${e.message}"`);
                if (e.message.startsWith('Expected error')) throw e;

                if (expectedBehavior.type === 'exception') {
                    if (expectedBehavior.message) expect(e.message).toContain(expectedBehavior.message);
                } else {
                    throw e;
                }
            }
        });
    });
});
