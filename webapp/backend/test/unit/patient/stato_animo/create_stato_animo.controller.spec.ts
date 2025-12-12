import { Test, TestingModule } from '@nestjs/testing';
import { CreateStatoAnimoController } from '../../../../src/patient/stato-animo/create-stato-animo.controller.js';
import { CreateStatoAnimoService } from '../../../../src/patient/stato-animo/create-stato-animo.service.js';
import { loadOracle, getTestCase } from '../../../helpers/oracle-loader.js';

describe('CreateStatoAnimoController - Unit 3: Gestione Richiesta', () => {
    let controller: CreateStatoAnimoController;
    let service: CreateStatoAnimoService;
    const oracle = loadOracle('patient/mood/stato-animo-unit3');

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CreateStatoAnimoController],
            providers: [
                {
                    provide: CreateStatoAnimoService,
                    useValue: {
                        createStatoAnimo: jest.fn()
                    }
                }
            ],
        }).compile();

        controller = module.get<CreateStatoAnimoController>(CreateStatoAnimoController);
        service = module.get<CreateStatoAnimoService>(CreateStatoAnimoService);
    });

    describe('createStatoAnimo', () => {
        const testCases = ['TC_RF5_13', 'TC_RF5_14', 'TC_RF5_15'];

        testCases.forEach(id => {
            const testCase = getTestCase(oracle, id);
            if (!testCase) return;

            it(`${testCase.id}: ${testCase.description}`, async () => {
                const { input, mockData, expectedBehavior } = testCase;
                console.log(`\n🔹 [${testCase.id}] TEST START`);
                console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));
                console.log(`🎯 EXPECTED: ${expectedBehavior.type === 'exception' ? `Exception "${expectedBehavior.message}"` : 'Success'}`);

                if (mockData.serviceSuccess) {
                    (service.createStatoAnimo as jest.Mock).mockResolvedValue(mockData.result);
                } else if (mockData.errorMessage) {
                    (service.createStatoAnimo as jest.Mock).mockRejectedValue(new Error(mockData.errorMessage));
                }

                try {
                    // Controller extracts req.user.id
                    // Oracle input might say "sub" but we need to match controller expectation
                    const req = input.req || { user: { id: 'mock-id' } };
                    // If input.req exists (from oracle), ensure it has 'id' if 'sub' was used there
                    if (req.user && req.user.sub && !req.user.id) {
                        req.user.id = req.user.sub;
                    }

                    const body = input.body;

                    // @ts-ignore
                    const result = await controller.createStatoAnimo(req, body);

                    if (expectedBehavior.type === 'exception') {
                        throw new Error(`Expected error "${expectedBehavior.message}" but got SUCCESS`);
                    }
                    console.log(`📤 ACTUAL: Success`, result);
                    // result might be just the object
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
