import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { InserimentoDomandaService } from '../../../../src/patient/forum/inserimento_domanda.service.js';
import { BadgeService } from '../../../../src/patient/badge/badge.service.js';
import { loadOracle, getTestCase } from '../../../helpers/oracle-loader.js';
import { db } from '../../../../src/drizzle/db.js';

// Mock dependencies
jest.mock('../../../../src/drizzle/db.js', () => ({
    db: {
        insert: jest.fn(),
    },
}));

jest.mock('../../../../src/patient/badge/badge.service.js');

describe('InserimentoDomandaService - Validazione (Unit)', () => {
    let service: InserimentoDomandaService;
    const oracle = loadOracle('patient/forum/inserimento-domanda-unit1');

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InserimentoDomandaService,
                BadgeService,
            ],
        }).compile();

        service = module.get<InserimentoDomandaService>(InserimentoDomandaService);
        jest.clearAllMocks();
    });

    describe('metodo: validazione', () => {
        const validationErrorCases = [
            'TC_RF23_1',
            'TC_RF23_2',
            'TC_RF23_3',
            'TC_RF23_4',
            'TC_RF23_5'
        ];

        validationErrorCases.forEach(id => {
            const testCase = getTestCase(oracle, id);
            if (!testCase) throw new Error(`Test case ${id} not found in oracle`);

            it(`${testCase.id}: ${testCase.description}`, async () => {
                const { input, expectedBehavior } = testCase;
                console.log(`\n🔹 [${testCase.id}] TEST START`);
                console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));
                console.log(`🎯 EXPECTED: Exception "${expectedBehavior.message}"`);

                try {
                    await service.validazione(input);
                    // If code reaches here, it failed to throw
                    throw new Error(`Expected error "${expectedBehavior.message}" but got SUCCESS`);
                } catch (e) {
                    console.log(`📤 ACTUAL: Exception "${e.message}"`);

                    if (e.message.startsWith('Expected error')) throw e; // Re-throw our own assertion error

                    expect(e).toBeInstanceOf(BadRequestException);
                    expect(e.message).toBe(expectedBehavior.message);
                }
            });
        });

        it('should pass validation with valid data (TC_RF23_6)', async () => {
            const testCase = getTestCase(oracle, 'TC_RF23_6');
            if (!testCase) throw new Error('Test case TC_RF23_6 not found');

            console.log(`\n🔹 [TC_RF23_6] TEST START`);
            console.log(`📥 INPUT:`, JSON.stringify(testCase.input, null, 2));
            console.log(`🎯 EXPECTED: Success`);

            try {
                await service.validazione(testCase.input);
                console.log(`📤 ACTUAL: Success`);
            } catch (e) {
                console.log(`📤 ACTUAL: Error "${e.message}"`);
                throw e;
            }
        });
    });
});
