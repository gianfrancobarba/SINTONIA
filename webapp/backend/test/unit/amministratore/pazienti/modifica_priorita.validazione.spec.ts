import { Test, TestingModule } from '@nestjs/testing';
import { Modifica_priorita_paziente_amministratoreService } from '../../../../src/amministratore/pazienti/modifica_priorita_paziente_amministratore.service.js';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { db } from '../../../../src/drizzle/db.js';
import { loadOracle, getTestCase } from '../../../helpers/oracle-loader.js';

jest.mock('../../../../src/drizzle/db.js');

describe('ModificaPrioritaService - Unit 1: Validazione', () => {
    let service: Modifica_priorita_paziente_amministratoreService;
    const oracle = loadOracle('admin/patients/modifica-priorita-unit1');

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                Modifica_priorita_paziente_amministratoreService,
            ],
        }).compile();

        service = module.get<Modifica_priorita_paziente_amministratoreService>(Modifica_priorita_paziente_amministratoreService);
    });

    describe('validazione', () => {
        const testCases = ['TC_RF10_1', 'TC_RF10_2', 'TC_RF10_3', 'TC_RF10_4', 'TC_RF10_5'];

        testCases.forEach(id => {
            const testCase = getTestCase(oracle, id);
            if (!testCase) return;

            it(`${testCase.id}: ${testCase.description}`, async () => {
                const { input, mockData, expectedBehavior } = testCase;
                console.log(`\n🔹 [${testCase.id}] TEST START`);
                console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));
                console.log(`🎯 EXPECTED: ${expectedBehavior.type === 'exception' ? `Exception "${expectedBehavior.message}"` : 'Success'}`);

                // Mocks
                const pazienteResult = mockData.patientExists ? [{
                    idPaziente: input.idPaziente,
                }] : [];

                const whereMock = jest.fn().mockReturnValue({ limit: jest.fn().mockResolvedValue(pazienteResult) });
                const fromMock = jest.fn().mockReturnValue({ where: whereMock });
                // @ts-ignore
                (db.select as jest.Mock).mockReturnValue({ from: fromMock });

                try {
                    await service.validazione(input.idPaziente, input.nuovaPriorita);

                    if (expectedBehavior.type === 'exception') {
                        throw new Error(`Expected error "${expectedBehavior.message}" but got SUCCESS`);
                    }
                    console.log(`📤 ACTUAL: Success`);
                } catch (e) {
                    console.log(`📤 ACTUAL: Exception "${e.message}"`);
                    if (e.message.startsWith('Expected error')) throw e;

                    if (expectedBehavior.type === 'exception') {
                        expect(e.message).toContain(expectedBehavior.message);
                        if (e.message.includes('non trovato')) expect(e).toBeInstanceOf(NotFoundException);
                        else expect(e).toBeInstanceOf(BadRequestException);
                    } else {
                        throw e;
                    }
                }
            });
        });
    });
});
