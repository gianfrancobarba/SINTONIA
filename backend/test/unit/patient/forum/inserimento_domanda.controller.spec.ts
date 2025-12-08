import { Test, TestingModule } from '@nestjs/testing';
import { InserimentoDomandaController } from '../../../../src/patient/forum/inserimento_domanda.controller.js';
import { InserimentoDomandaService } from '../../../../src/patient/forum/inserimento_domanda.service.js';
import { loadOracle, getTestCase } from '../../../helpers/oracle-loader.js';

// Mock Service
jest.mock('../../../../src/patient/forum/inserimento_domanda.service.js');

describe('InserimentoDomandaController (Unit)', () => {
    let controller: InserimentoDomandaController;
    let service: InserimentoDomandaService;
    const oracle = loadOracle('inserimento-domanda');

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
        it('should extract user ID and delegate to service (TC_CTRL_DELEGATION)', async () => {
            const testCase = getTestCase(oracle, 'TC_CTRL_DELEGATION');
            if (!testCase) throw new Error('Test case TC_CTRL_DELEGATION not found');

            const { input, mockData, expectedOutput } = testCase;

            // Mock Service implementation
            (service.inserisciDomanda as jest.Mock).mockResolvedValue(mockData.serviceReturn);

            // Access controller method
            // We pass the mock request and dto
            const result = await controller.inserisciDomanda(input.req, input.dto);

            // Assertions
            expect(result).toEqual(expectedOutput);

            // Verify Service was called with extracted ID
            expect(service.inserisciDomanda).toHaveBeenCalledWith(
                input.req.user.id,
                input.dto
            );
        });
    });
});
