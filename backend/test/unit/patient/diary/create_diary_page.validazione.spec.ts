import { Test, TestingModule } from '@nestjs/testing';
import { CreateDiaryPageService } from '../../../../src/patient/diary/create-diary-page.service.js';
import { BadRequestException } from '@nestjs/common';
import { loadOracle, getTestCase } from '../../../helpers/oracle-loader.js';
import { BadgeService } from '../../../../src/patient/badge/badge.service.js';

describe('CreateDiaryPageService - Validazione (Unit)', () => {
    let service: CreateDiaryPageService;
    let badgeService: BadgeService;
    const oracle = loadOracle('patient/diary/creazione-diario-unit1');

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateDiaryPageService,
                {
                    provide: BadgeService,
                    useValue: { checkAndAwardBadges: jest.fn() },
                },
            ],
        }).compile();

        service = module.get<CreateDiaryPageService>(CreateDiaryPageService);
        badgeService = module.get<BadgeService>(BadgeService);
    });

    describe('metodo: validazione', () => {
        const errorCases = ['TC_RF19_1', 'TC_RF19_2', 'TC_RF19_3'];

        errorCases.forEach(id => {
            const testCase = getTestCase(oracle, id);
            if (!testCase) throw new Error(`Test case ${id} not found`);

            it(`${testCase.id}: ${testCase.description}`, async () => {
                const { input, expectedBehavior } = testCase;
                console.log(`\n🔹 [${testCase.id}] TEST START`);
                console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));
                console.log(`🎯 EXPECTED: Exception "${expectedBehavior.message}"`);

                try {
                    service.validazione(input);
                    throw new Error(`Expected error "${expectedBehavior.message}" but got SUCCESS`);
                } catch (e) {
                    console.log(`📤 ACTUAL: Exception "${e.message}"`);
                    if (e.message.startsWith('Expected error')) throw e;
                    expect(e).toBeInstanceOf(BadRequestException);
                    expect(e.message).toBe(expectedBehavior.message);
                }
            });
        });

        it('should pass validation with valid data (TC_RF19_4)', () => {
            const testCase = getTestCase(oracle, 'TC_RF19_4');
            if (!testCase) throw new Error('TC_RF19_4 not found');
            const { input } = testCase;

            console.log(`\n🔹 [TC_RF19_4] TEST START`);
            console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));
            console.log(`🎯 EXPECTED: Success`);

            try {
                service.validazione(input);
                console.log(`📤 ACTUAL: Success`);
            } catch (e) {
                console.log(`📤 ACTUAL: Error "${e.message}"`);
                throw e;
            }
        });
    });
});
