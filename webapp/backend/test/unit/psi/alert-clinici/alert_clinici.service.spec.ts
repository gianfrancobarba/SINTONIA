import { Test, TestingModule } from '@nestjs/testing';
import { AlertCliniciService } from '../../../../src/psi/alert-clinici/alert-clinici.service.js';
import { db } from '../../../../src/drizzle/db.js';
import { loadOracle, getTestCase } from '../../../helpers/oracle-loader.js';

jest.mock('../../../../src/drizzle/db.js');

describe('AlertCliniciService - Unit 1: Esecuzione Visualizzazione', () => {
    let service: AlertCliniciService;
    const oracle = loadOracle('psi/alert-clinici/alert-clinici-unit1');

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AlertCliniciService],
        }).compile();

        service = module.get<AlertCliniciService>(AlertCliniciService);
    });

    const testCases = ['TC_RF3_1', 'TC_RF3_2'];

    testCases.forEach(id => {
        const testCase = getTestCase(oracle, id);
        if (!testCase) return;

        it(`${testCase.id}: ${testCase.description}`, async () => {
            const { input, mockData, expectedBehavior } = testCase;
            console.log(`\n🔹 [${testCase.id}] TEST START`);
            console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));
            console.log(`🎯 EXPECTED: ${expectedBehavior.type === 'exception' ? `Exception "${expectedBehavior.message}"` : 'Success'}`);

            // Mock DB
            if (mockData.dbError) {
                const orderByMock = jest.fn().mockRejectedValue(new Error("Database Error"));
                const whereMock = jest.fn().mockReturnValue({ orderBy: orderByMock });
                const fromMock = jest.fn().mockReturnValue({ where: whereMock });
                // @ts-ignore
                (db.select as jest.Mock).mockReturnValue({ from: fromMock });
            } else {
                const orderByMock = jest.fn().mockResolvedValue(mockData.result);
                const whereMock = jest.fn().mockReturnValue({ orderBy: orderByMock });
                const fromMock = jest.fn().mockReturnValue({ where: whereMock });
                // @ts-ignore
                (db.select as jest.Mock).mockReturnValue({ from: fromMock });
            }

            try {
                const result = await service.getAlertNonAccettati();

                if (expectedBehavior.type === 'exception') {
                    throw new Error(`Expected error "${expectedBehavior.message}" but got SUCCESS`);
                }

                console.log(`📤 ACTUAL: Success`);
                expect(result).toHaveLength(expectedBehavior.resultLength);

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
