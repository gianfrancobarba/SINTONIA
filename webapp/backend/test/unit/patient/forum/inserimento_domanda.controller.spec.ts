import { Test, TestingModule } from '@nestjs/testing';
import { InserimentoDomandaController } from '../../../../src/patient/forum/inserimento_domanda.controller.js';
import { InserimentoDomandaService } from '../../../../src/patient/forum/inserimento_domanda.service.js';
import { loadOracle, getTestCase } from '../../../helpers/oracle-loader.js';

// Mock Service
jest.mock('../../../../src/patient/forum/inserimento_domanda.service.js');

describe('InserimentoDomandaController (Unit)', () => {
    let controller: InserimentoDomandaController;
    let service: InserimentoDomandaService;
    let oracle;

    beforeAll(() => {
        oracle = loadOracle('patient/forum/inserimento-domanda-unit3');
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [InserimentoDomandaController],
            providers: [InserimentoDomandaService],
        }).compile();

        controller = module.get<InserimentoDomandaController>(InserimentoDomandaController);
        service = module.get<InserimentoDomandaService>(InserimentoDomandaService);

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('inserisciDomanda', () => {
        it('should throw BadRequest if user ID is missing (TC_RF23_10)', async () => {
            const testCase = getTestCase(oracle, 'TC_RF23_10');
            if (!testCase) throw new Error('Test case TC_RF23_10 not found');
            const { input, expectedBehavior } = testCase;

            console.log(`\n🔹 [TC_RF23_10] TEST START`);
            console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));
            console.log(`🎯 EXPECTED: Exception "${expectedBehavior.message}"`);

            try {
                await controller.inserisciDomanda(input.req, input.dto);
                throw new Error(`Expected error "${expectedBehavior.message}" but got SUCCESS`);
            } catch (e) {
                console.log(`📤 ACTUAL: Exception "${e.message}"`);
                if (e.message.startsWith('Expected error')) throw e;
                // Matches strict error message check? Oracle says "User ID non trovato"
                expect(e.message).toContain('User ID'); // Loose match or strict? Oracle: "User ID non trovato"
            }
        });

        it('should handle service errors (TC_RF23_11 - DLG1)', async () => {
            const testCase = getTestCase(oracle, 'TC_RF23_11');
            if (!testCase) throw new Error('Test case TC_RF23_11 not found');
            const { input, expectedBehavior } = testCase;

            console.log(`\n🔹 [TC_RF23_11] TEST START`);
            console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));
            console.log(`🎯 EXPECTED: Exception "${expectedBehavior.message}"`);

            // Mock Service to throw error on invalid params
            (service.inserisciDomanda as jest.Mock).mockRejectedValue(new Error(expectedBehavior.message));

            try {
                await controller.inserisciDomanda(input.req as any, input.dto);
                throw new Error(`Expected error "${expectedBehavior.message}" but got SUCCESS`);
            } catch (e) {
                console.log(`📤 ACTUAL: Exception "${e.message}"`);
                if (e.message.startsWith('Expected error')) throw e;
                expect(e.message).toBe(expectedBehavior.message);
            }
        });

        it('should handle empty result from service (TC_RF23_12 - RSP1)', async () => {
            const testCase = getTestCase(oracle, 'TC_RF23_12');
            if (!testCase) throw new Error('Test case TC_RF23_12 not found');
            const { input, mockData, expectedBehavior } = testCase;

            console.log(`\n🔹 [TC_RF23_12] TEST START`);
            console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));
            console.log(`🎯 EXPECTED: Exception "${expectedBehavior.message}"`);

            // Mock Service returning null/undefined
            (service.inserisciDomanda as jest.Mock).mockResolvedValue(mockData.serviceReturn);

            try {
                await controller.inserisciDomanda(input.req, input.dto);
                throw new Error(`Expected error "${expectedBehavior.message}" but got SUCCESS`);
            } catch (e) {
                console.log(`📤 ACTUAL: Exception "${e.message}"`);
                if (e.message.startsWith('Expected error')) throw e;
                // expected message: "Nessun risultato dal service"
                expect(e.message).toContain('Nessun risultato');
            }
        });

        it('should extract user ID and delegate to service (TC_RF23_13)', async () => {
            const testCase = getTestCase(oracle, 'TC_RF23_13');
            if (!testCase) throw new Error('Test case TC_RF23_13 not found');

            const { input, mockData, expectedOutput } = testCase;

            console.log(`\n🔹 [TC_RF23_13] TEST START`);
            console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));
            console.log(`🎯 EXPECTED: Success with ID "${expectedOutput.idDomanda}"`);

            // Mock Service implementation
            (service.inserisciDomanda as jest.Mock).mockResolvedValue(mockData.serviceReturn);

            try {
                const result = await controller.inserisciDomanda(input.req, input.dto);
                console.log(`📤 ACTUAL: Success`, JSON.stringify(result, null, 2));

                // Assertions
                expect(result).toEqual(expectedOutput);

                // Verify Service was called with extracted ID
                expect(service.inserisciDomanda).toHaveBeenCalledWith(
                    input.req.user.id,
                    input.dto
                );
            } catch (e) {
                console.log(`📤 ACTUAL: Error "${e.message}"`);
                throw e;
            }
        });
    });
});
