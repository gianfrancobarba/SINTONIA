import { Test, TestingModule } from '@nestjs/testing';
import { ReportController } from '../../../../src/psi/report/report.controller.js';
import { ReportService } from '../../../../src/psi/report/report.service.js';
import { loadOracle, getTestCase } from '../../../helpers/oracle-loader.js';

describe('ReportController - Unit 3: Gestione Richiesta', () => {
    let controller: ReportController;
    let service: ReportService;
    const oracle = loadOracle('psi/report/report-unit3');

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ReportController],
            providers: [
                {
                    provide: ReportService,
                    useValue: {
                        generateReport: jest.fn()
                    }
                }
            ],
        }).compile();

        controller = module.get<ReportController>(ReportController);
        service = module.get<ReportService>(ReportService);
    });

    describe('generateReport', () => {
        const testCases = ['TC_RF4_7', 'TC_RF4_8', 'TC_RF4_9'];

        testCases.forEach(id => {
            const testCase = getTestCase(oracle, id);
            if (!testCase) return;

            it(`${testCase.id}: ${testCase.description}`, async () => {
                const { input, mockData, expectedBehavior } = testCase;
                console.log(`\n🔹 [${testCase.id}] TEST START`);
                console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));
                console.log(`🎯 EXPECTED: ${expectedBehavior.type === 'exception' ? `Exception "${expectedBehavior.message}"` : 'Success'}`);

                if (mockData.serviceSuccess) {
                    (service.generateReport as jest.Mock).mockResolvedValue(mockData.result);
                } else if (mockData.errorMessage) {
                    (service.generateReport as jest.Mock).mockRejectedValue(new Error(mockData.errorMessage));
                }

                try {
                    // Simulating controller call. Input structure matches what we expect from the tool's specialized oracle loader
                    // Note: TC_RF4_7 tests "wrong params". In unit test, we just pass what we have.
                    // If param is missing in TS check, we pass undefined/empty string to simulate.
                    // TC_RF4_7 input: patientId ""
                    const result = await controller.generateReport(input.patientId, input.query.cf);

                    if (expectedBehavior.type === 'exception') {
                        throw new Error(`Expected error "${expectedBehavior.message}" but got SUCCESS`);
                    }
                    console.log(`📤 ACTUAL: Success`, result);
                    expect(result.message).toBe(expectedBehavior.message);
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
});
