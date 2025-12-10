import { Test, TestingModule } from '@nestjs/testing';
import { AssegnazionePsicologoAmministratoreService } from '../../../../src/amministratore/pazienti/assegnazione_psicologo_amministratore.service.js';
import { loadOracle, getTestCase } from '../../../helpers/oracle-loader.js';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { db } from '../../../../src/drizzle/db.js';
import { paziente, psicologo } from '../../../../src/drizzle/schema.js';
import { AssegnazioneService } from '../../../../src/psi/assegnazione/assegnazione.service.js';

jest.mock('../../../../src/drizzle/db.js');

describe('AssegnazionePsicologoAmministratoreService - Unit 1: Validazione', () => {
    let service: AssegnazionePsicologoAmministratoreService;
    const oracle = loadOracle('admin/patients/assegnazione-psicologo-unit1');
    let assegnazioneServiceMock: any;

    beforeEach(async () => {
        assegnazioneServiceMock = {};

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AssegnazionePsicologoAmministratoreService,
                { provide: AssegnazioneService, useValue: assegnazioneServiceMock }
            ],
        }).compile();

        service = module.get<AssegnazionePsicologoAmministratoreService>(AssegnazionePsicologoAmministratoreService);
    });

    describe('validazione', () => {
        const testCases = ['TC_RF11_1', 'TC_RF11_2', 'TC_RF11_3', 'TC_RF11_4', 'TC_RF11_5'];

        testCases.forEach(id => {
            const testCase = getTestCase(oracle, id);
            if (!testCase) return;

            it(`${testCase.id}: ${testCase.description}`, async () => {
                const { input, mockData, expectedBehavior } = testCase;
                console.log(`\n🔹 [${testCase.id}] TEST START`);
                console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));
                console.log(`🎯 EXPECTED: ${expectedBehavior.type === 'exception' ? `Exception "${expectedBehavior.message}"` : 'Success'}`);

                // Mocks
                const patientMock = mockData.patientExists ? [{ idPaziente: input.idPaziente }] : [];
                const psychologistMock = mockData.psychologistExists ? [{ codFiscale: input.idPsicologo }] : [];

                // Simple checks now: 1. Patient -> 2. Psy

                const limitMock = jest.fn()
                    .mockResolvedValueOnce(patientMock) // 1. Patient
                    .mockResolvedValueOnce(psychologistMock); // 2. Psy

                const whereMock = jest.fn().mockReturnValue({ limit: limitMock });
                const fromMock = jest.fn().mockReturnValue({ where: whereMock });
                // @ts-ignore
                (db.select as jest.Mock).mockReturnValue({ from: fromMock });


                try {
                    await service.validazione(input.idPaziente, input.idPsicologo);

                    if (expectedBehavior.type === 'exception') {
                        throw new Error(`Expected error "${expectedBehavior.message}" but got SUCCESS`);
                    }
                    console.log(`📤 ACTUAL: Success`);
                } catch (e) {
                    console.log(`📤 ACTUAL: Exception "${e.message}"`);
                    if (e.message.startsWith('Expected error')) throw e;

                    if (expectedBehavior.type === 'exception') {
                        expect(e.message).toBe(expectedBehavior.message);
                        if (e.message.includes('Paziente')) expect(e).toBeInstanceOf(NotFoundException);
                        else expect(e).toBeInstanceOf(BadRequestException);
                    } else {
                        throw e;
                    }
                }
            });
        });
    });
});
