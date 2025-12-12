import { Test, TestingModule } from '@nestjs/testing';
import { CreateDiaryPageController } from '../../../../src/patient/diary/create-diary-page.controller.js';
import { CreateDiaryPageService } from '../../../../src/patient/diary/create-diary-page.service.js';
import { loadOracle, getTestCase } from '../../../helpers/oracle-loader.js';
import { BadRequestException } from '@nestjs/common';

describe('CreateDiaryPageController (Unit)', () => {
    let controller: CreateDiaryPageController;
    let service: CreateDiaryPageService;
    let oracle: any;

    beforeAll(() => {
        oracle = loadOracle('patient/diary/creazione-diario-unit3');
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CreateDiaryPageController],
            providers: [
                {
                    provide: CreateDiaryPageService,
                    useValue: {
                        createDiaryPage: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<CreateDiaryPageController>(CreateDiaryPageController);
        service = module.get<CreateDiaryPageService>(CreateDiaryPageService);
    });

    describe('createDiaryPage', () => {
        it('should throw Error if user ID is missing (TC_RF19_8)', async () => {
            const testCase = getTestCase(oracle, 'TC_RF19_8');
            if (!testCase) throw new Error('TC_RF19_8 not found');
            const { input, expectedBehavior } = testCase;

            console.log(`\n🔹 [TC_RF19_8] TEST START`);
            console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));
            console.log(`🎯 EXPECTED: Exception "${expectedBehavior.message}"`);

            try {
                await controller.createDiaryPage(input.req, input.dto);
                throw new Error(`Expected error "${expectedBehavior.message}" but got SUCCESS`);
            } catch (e) {
                console.log(`📤 ACTUAL: Exception "${e.message}"`);
                if (e.message.startsWith('Expected error')) throw e;
                expect(e.message).toContain('User ID');
            }
        });

        it('should handle service errors (TC_RF19_9 - DLG1)', async () => {
            const testCase = getTestCase(oracle, 'TC_RF19_9');
            if (!testCase) throw new Error('TC_RF19_9 not found');
            const { input, expectedBehavior } = testCase;

            console.log(`\n🔹 [TC_RF19_9] TEST START`);
            console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));
            console.log(`🎯 EXPECTED: Exception "${expectedBehavior.message}"`);

            (service.createDiaryPage as jest.Mock).mockRejectedValue(new BadRequestException(expectedBehavior.message));

            try {
                await controller.createDiaryPage(input.req as any, input.dto);
                throw new Error(`Expected error "${expectedBehavior.message}" but got SUCCESS`);
            } catch (e) {
                console.log(`📤 ACTUAL: Exception "${e.message}"`);
                if (e.message.startsWith('Expected error')) throw e;
                expect(e.message).toBe(expectedBehavior.message);
            }
        });

        it('should handle empty result from service (TC_RF19_10 - RSP1)', async () => {
            const testCase = getTestCase(oracle, 'TC_RF19_10');
            if (!testCase) throw new Error('TC_RF19_10 not found');
            const { input, mockData, expectedBehavior } = testCase;

            console.log(`\n🔹 [TC_RF19_10] TEST START`);
            console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));
            console.log(`🎯 EXPECTED: Exception "${expectedBehavior.message}"`);

            (service.createDiaryPage as jest.Mock).mockResolvedValue(mockData.serviceReturn);

            try {
                await controller.createDiaryPage(input.req, input.dto);
                throw new Error(`Expected error "${expectedBehavior.message}" but got SUCCESS`);
            } catch (e) {
                console.log(`📤 ACTUAL: Exception "${e.message}"`);
                if (e.message.startsWith('Expected error')) throw e;
                expect(e.message).toContain('Nessun risultato');
            }
        });

        it('should delegate to service and return result (TC_RF19_11)', async () => {
            const testCase = getTestCase(oracle, 'TC_RF19_11');
            if (!testCase) throw new Error('TC_RF19_11 not found');
            const { input, mockData, expectedOutput } = testCase;

            console.log(`\n🔹 [TC_RF19_11] TEST START`);
            console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));
            console.log(`🎯 EXPECTED: Success with ID "${expectedOutput.id}"`);

            (service.createDiaryPage as jest.Mock).mockResolvedValue(mockData.serviceReturn);

            try {
                const result = await controller.createDiaryPage(input.req, input.dto);
                console.log(`📤 ACTUAL: Success`, JSON.stringify(result, null, 2));
                expect(result).toEqual(expectedOutput);
                expect(service.createDiaryPage).toHaveBeenCalledWith(input.req.user.id, input.dto);
            } catch (e) {
                console.log(`📤 ACTUAL: Error "${e.message}"`);
                throw e;
            }
        });
    });
});
