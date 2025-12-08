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
    const oracle = loadOracle('inserimento-domanda');

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
            'TC_RF23_1_EMPTY_TITLE',
            'TC_RF23_1_LONG_TITLE',
            'TC_RF23_2_EMPTY_TEXT',
            'TC_RF23_3_EMPTY_CATEGORY',
            'TC_RF23_3_LONG_CATEGORY'
        ];

        validationErrorCases.forEach(id => {
            const testCase = getTestCase(oracle, id);
            if (!testCase) throw new Error(`Test case ${id} not found in oracle`);

            it(testCase.description, async () => {
                const { input, expectedBehavior } = testCase;
                await expect(service.validazione(input)).rejects.toThrow(BadRequestException);
                await expect(service.validazione(input)).rejects.toThrow(expectedBehavior.message);
            });
        });

        it('should pass validation with valid data', async () => {
            const testCase = getTestCase(oracle, 'TC_RF23_4_SUCCESS');
            if (!testCase) throw new Error('Test case TC_RF23_4_SUCCESS not found');
            await expect(service.validazione(testCase.input.dto)).resolves.not.toThrow();
        });
    });
});
