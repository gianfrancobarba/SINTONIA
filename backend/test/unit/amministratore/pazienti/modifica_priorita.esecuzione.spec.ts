import { Test, TestingModule } from '@nestjs/testing';
import { Modifica_priorita_paziente_amministratoreService } from '../../../../src/amministratore/pazienti/modifica_priorita_paziente_amministratore.service.js';
import { db } from '../../../../src/drizzle/db.js';
import { loadOracle, getTestCase } from '../../../helpers/oracle-loader.js';

jest.mock('../../../../src/drizzle/db.js');

describe('ModificaPrioritaService - Unit 2: Esecuzione', () => {
    let service: Modifica_priorita_paziente_amministratoreService;
    const oracle = loadOracle('admin/patients/modifica-priorita-unit2');

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                Modifica_priorita_paziente_amministratoreService,
            ],
        }).compile();

        service = module.get<Modifica_priorita_paziente_amministratoreService>(Modifica_priorita_paziente_amministratoreService);
    });

    describe('modificaPrioritaPaziente', () => {
        const testCases = ['TC_RF10_6', 'TC_RF10_7'];

        testCases.forEach(id => {
            const testCase = getTestCase(oracle, id);
            if (!testCase) return;

            it(`${testCase.id}: ${testCase.description}`, async () => {
                const { input, mockData, expectedBehavior } = testCase;
                console.log(`\n🔹 [${testCase.id}] TEST START`);
                console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));
                console.log(`🎯 EXPECTED: ${expectedBehavior.type === 'exception' ? `Exception "${expectedBehavior.message}"` : 'Success'}`);

                // Mock validation to bypass actual checks as this unit tests execution
                jest.spyOn(service, 'validazione').mockResolvedValue(mockData.validationResult);

                // Mock DB update
                if (mockData.updateSuccess) {
                    // @ts-ignore
                    (db.update as jest.Mock).mockReturnValue({
                        set: jest.fn().mockReturnValue({
                            where: jest.fn().mockResolvedValue({ affectedRows: 1 })
                        })
                    });
                } else {
                    // @ts-ignore
                    (db.update as jest.Mock).mockReturnValue({
                        set: jest.fn().mockReturnValue({
                            // Simulate DB error
                            where: jest.fn().mockRejectedValue(new Error("Update failed"))
                        })
                    });
                }


                try {
                    const result = await service.modificaPrioritaPaziente(input.idPaziente, input.nuovaPriorita);

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
                    } else {
                        throw e;
                    }
                }
            });
        });
    });
});
