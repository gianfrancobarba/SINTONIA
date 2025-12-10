import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from '../../../../src/psi/report/report.service.js';
import { NotFoundException } from '@nestjs/common';
import { db } from '../../../../src/drizzle/db.js';
import { loadOracle, getTestCase } from '../../../helpers/oracle-loader.js';

jest.mock('../../../../src/drizzle/db.js');

describe('ReportService - Unit 1: Validazione', () => {
    let service: ReportService;
    const oracle = loadOracle('psi/report/report-unit1');

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReportService,
            ],
        }).compile();

        service = module.get<ReportService>(ReportService);
    });

    describe('validazione', () => {
        const testCases = ['TC_RF4_1', 'TC_RF4_2', 'TC_RF4_3'];

        testCases.forEach(id => {
            const testCase = getTestCase(oracle, id);
            if (!testCase) return;

            it(`${testCase.id}: ${testCase.description}`, async () => {
                const { input, mockData, expectedBehavior } = testCase;
                console.log(`\n🔹 [${testCase.id}] TEST START`);
                console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));
                console.log(`🎯 EXPECTED: ${expectedBehavior.type === 'exception' ? `Exception "${expectedBehavior.message}"` : 'Success'}`);

                // Mocks
                const pazienteResult = mockData.patientFound ? [mockData.patientData] : [];

                const whereMock = jest.fn().mockReturnValue({ limit: jest.fn().mockResolvedValue(pazienteResult) });
                const fromMock = jest.fn().mockReturnValue({ where: whereMock });
                // @ts-ignore
                (db.select as jest.Mock).mockReturnValue({ from: fromMock });

                try {
                    await service.validazione(input.patientId, input.psychologistId);

                    if (expectedBehavior.type === 'exception') {
                        throw new Error(`Expected error "${expectedBehavior.message}" but got SUCCESS`);
                    }
                    console.log(`📤 ACTUAL: Success`);
                } catch (e) {
                    console.log(`📤 ACTUAL: Exception "${e.message}"`);
                    if (e.message.startsWith('Expected error')) throw e;

                    if (expectedBehavior.type === 'exception') {
                        expect(e.message).toContain(expectedBehavior.message);
                        if (e.message.includes('non trovato')) expect(e).toBeInstanceOf(NotFoundException);
                    } else {
                        throw e;
                    }
                }
            });
        });
    });
});
