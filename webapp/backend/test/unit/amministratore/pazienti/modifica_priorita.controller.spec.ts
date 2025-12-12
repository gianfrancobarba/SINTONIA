import { Test, TestingModule } from '@nestjs/testing';
import { Modifica_priorita_paziente_amministratoreController } from '../../../../src/amministratore/pazienti/modifica_priorita_paziente_amministratore.controller.js';
import { Modifica_priorita_paziente_amministratoreService } from '../../../../src/amministratore/pazienti/modifica_priorita_paziente_amministratore.service.js';
import { BadRequestException } from '@nestjs/common';
import { loadOracle, getTestCase } from '../../../helpers/oracle-loader.js';

describe('ModificaPrioritaController - Unit 3: Gestione Richiesta', () => {
    let controller: Modifica_priorita_paziente_amministratoreController;
    let service: Modifica_priorita_paziente_amministratoreService;
    const oracle = loadOracle('admin/patients/modifica-priorita-unit3');

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [Modifica_priorita_paziente_amministratoreController],
            providers: [
                {
                    provide: Modifica_priorita_paziente_amministratoreService,
                    useValue: {
                        modificaPrioritaPaziente: jest.fn()
                    }
                }
            ],
        }).compile();

        controller = module.get<Modifica_priorita_paziente_amministratoreController>(Modifica_priorita_paziente_amministratoreController);
        service = module.get<Modifica_priorita_paziente_amministratoreService>(Modifica_priorita_paziente_amministratoreService);
    });

    describe('modificaPriorita', () => {
        const testCases = ['TC_RF10_8', 'TC_RF10_9', 'TC_RF10_10'];

        testCases.forEach(id => {
            const testCase = getTestCase(oracle, id);
            if (!testCase) return;

            it(`${testCase.id}: ${testCase.description}`, async () => {
                const { input, mockData, expectedBehavior } = testCase;
                console.log(`\n🔹 [${testCase.id}] TEST START`);
                console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));
                console.log(`🎯 EXPECTED: ${expectedBehavior.type === 'exception' ? `Exception "${expectedBehavior.message}"` : 'Success'}`);

                if (mockData.serviceSuccess) {
                    (service.modificaPrioritaPaziente as jest.Mock).mockResolvedValue(mockData.result);
                } else if (mockData.errorMessage) {
                    (service.modificaPrioritaPaziente as jest.Mock).mockRejectedValue(new Error(mockData.errorMessage));
                }

                try {
                    // @ts-ignore
                    const result = await controller.modificaPriorita(input.id, input.body);

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
                        if (e.message.includes('obbligatorio')) expect(e).toBeInstanceOf(BadRequestException);
                    } else {
                        throw e;
                    }
                }
            });
        });
    });
});
