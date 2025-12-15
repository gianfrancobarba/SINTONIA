import { Test, TestingModule } from '@nestjs/testing';
import { CreateDiaryPageService } from '../../../../src/patient/diary/create-diary-page.service.js';
import { CreateDiaryPageDto } from '../../../../src/patient/diary/dto/create-diary-page.dto.js';
import { BadgeService } from '../../../../src/patient/badge/badge.service.js';
import { db } from '../../../../src/drizzle/db.js';
import { paginaDiario } from '../../../../src/drizzle/schema.js';
import { loadOracle, getTestCase } from '../../../helpers/oracle-loader.js';
import { BadRequestException } from '@nestjs/common';

jest.mock('../../../../src/drizzle/db.js');

describe('CreateDiaryPageService - Inserimento (Unit)', () => {
    let service: CreateDiaryPageService;
    let badgeService: BadgeService;
    let oracle: any;

    beforeAll(() => {
        oracle = loadOracle('patient/diary/creazione-diario-unit2');
    });

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

    describe('metodo: createDiaryPage', () => {
        it('should insert page and award badges successfully (TC_RF19_7)', async () => {
            const testCase = getTestCase(oracle, 'TC_RF19_7');
            if (!testCase) throw new Error('TC_RF19_7 not found');
            const { input, mockData, expectedOutput } = testCase;

            console.log(`\n🔹 [TC_RF19_7] TEST START`);
            console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));
            console.log(`🎯 EXPECTED: Success with ID "${expectedOutput.id}"`);

            // Mock DB
            const returningMock = jest.fn().mockResolvedValue([{
                id: mockData.newPageId,
                title: input.dto.title,
                content: input.dto.content,
                createdAt: new Date(),
            }]);
            const valuesMock = jest.fn().mockReturnValue({ returning: returningMock });
            // @ts-ignore
            (db.insert as jest.Mock).mockReturnValue({ values: valuesMock });

            // Mock Badge
            (badgeService.checkAndAwardBadges as jest.Mock).mockResolvedValue(mockData.awardedBadges);

            try {
                const result = await service.createDiaryPage(input.patientId, input.dto);
                console.log(`📤 ACTUAL: Success`, JSON.stringify(result, null, 2));

                // Assertions
                expect(result).toBeDefined();
                expect(result.id).toBe(expectedOutput.id);
                expect(badgeService.checkAndAwardBadges).toHaveBeenCalledWith(input.patientId);
            } catch (e) {
                console.log(`📤 ACTUAL: Error "${e.message}"`);
                throw e;
            }
        });

        it('should throw Error if database insertion fails (TC_RF19_5)', async () => {
            const testCase = getTestCase(oracle, 'TC_RF19_5');
            if (!testCase) throw new Error('TC_RF19_5 not found');
            const { input, mockData, expectedBehavior } = testCase;

            console.log(`\n🔹 [TC_RF19_5] TEST START`);
            console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));
            console.log(`🎯 EXPECTED: Exception "${expectedBehavior.message}"`);

            // Mock DB fail
            const returningMock = jest.fn().mockResolvedValue(mockData.dbReturn); // Empty array
            const valuesMock = jest.fn().mockReturnValue({ returning: returningMock });
            // @ts-ignore
            (db.insert as jest.Mock).mockReturnValue({ values: valuesMock });

            try {
                await service.createDiaryPage(input.patientId, input.dto);
                throw new Error(`Expected error "${expectedBehavior.message}" but got SUCCESS`);
            } catch (e) {
                console.log(`📤 ACTUAL: Exception "${e.message}"`);
                if (e.message.startsWith('Expected error')) throw e;
                expect(e).toBeInstanceOf(BadRequestException);
                expect(e.message).toBe(expectedBehavior.message);
            }
        });
    });
});
