import { Test, TestingModule } from '@nestjs/testing';
import { CreateStatoAnimoService } from '../../../../src/patient/stato-animo/create-stato-animo.service.js';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { db } from '../../../../src/drizzle/db.js';
import { loadOracle, getTestCase } from '../../../helpers/oracle-loader.js';
import { BadgeService } from '../../../../src/patient/badge/badge.service.js';

jest.mock('../../../../src/drizzle/db.js');

describe('CreateStatoAnimoService - Unit 1: Validazione', () => {
    let service: CreateStatoAnimoService;
    const oracle = loadOracle('patient/mood/stato-animo-unit1');

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateStatoAnimoService,
                {
                    provide: BadgeService,
                    useValue: { checkAndAwardBadges: jest.fn() }
                }
            ],
        }).compile();

        service = module.get<CreateStatoAnimoService>(CreateStatoAnimoService);
    });

    describe('validazione', () => {
        const testCases = [
            'TC_RF5_1', 'TC_RF5_2', 'TC_RF5_3', 'TC_RF5_4', 'TC_RF5_5',
            'TC_RF5_6', 'TC_RF5_7', 'TC_RF5_8', 'TC_RF5_9'
        ];

        testCases.forEach(id => {
            const testCase = getTestCase(oracle, id);
            if (!testCase) return;

            it(`${testCase.id}: ${testCase.description}`, async () => {
                const { input, mockData, expectedBehavior } = testCase;

                // Expand "LONG_STRING" for TC_RF5_7
                if (input.dto && input.dto.note === 'LONG_STRING') {
                    input.dto.note = 'a'.repeat(501);
                }

                console.log(`\n🔹 [${testCase.id}] TEST START`);
                // Use a truncated input for logging if note is huge
                const loggedInput = JSON.parse(JSON.stringify(input));
                if (loggedInput.dto?.note?.length > 50) loggedInput.dto.note = 'LONG_STRING...';

                console.log(`📥 INPUT:`, JSON.stringify(loggedInput, null, 2));
                console.log(`🎯 EXPECTED: ${expectedBehavior.type === 'exception' ? `Exception "${expectedBehavior.message}"` : 'Success'}`);

                // Mocks
                const pazienteResult = mockData.patientExists ? [{ idPaziente: input.patientId }] : [];

                const whereMock = jest.fn().mockReturnValue({ limit: jest.fn().mockResolvedValue(pazienteResult) });
                const fromMock = jest.fn().mockReturnValue({ where: whereMock });
                // @ts-ignore
                (db.select as jest.Mock).mockReturnValue({ from: fromMock });

                try {
                    await service.validazione(input.patientId, input.dto);

                    if (expectedBehavior.type === 'exception') {
                        throw new Error(`Expected error "${expectedBehavior.message}" but got SUCCESS`);
                    }
                    console.log(`📤 ACTUAL: Success`);
                } catch (e) {
                    // console.log(`📤 ACTUAL: Exception "${e.message}"`);
                    if (e.message.startsWith('Expected error')) throw e;

                    if (expectedBehavior.type === 'exception') {
                        if (e instanceof BadRequestException && typeof e.getResponse() === 'object') {
                            const response = e.getResponse() as any;
                            if (response.errors && Array.isArray(response.errors)) {
                                const found = response.errors.some(err => err.includes(expectedBehavior.message));
                                if (!found) {
                                    console.log(`Actual Errors:`, response.errors);
                                    throw new Error(`Expected error message "${expectedBehavior.message}" not found in errors array`);
                                }
                            } else {
                                // Fallback for simple message
                                expect(e.message).toContain(expectedBehavior.message);
                            }
                        } else if (e instanceof NotFoundException) {
                            expect(e.message).toContain(expectedBehavior.message);
                        } else {
                            // Fallback
                            expect(e.message).toContain(expectedBehavior.message);
                        }
                    } else {
                        throw e;
                    }
                }
            });
        });
    });
});
