import { Test, TestingModule } from '@nestjs/testing';
import { AssegnazionePsicologoAmministratoreService } from '../../../../src/amministratore/pazienti/assegnazione_psicologo_amministratore.service.js';
import { loadOracle, getTestCase } from '../../../helpers/oracle-loader.js';
import { db } from '../../../../src/drizzle/db.js';
import { AssegnazioneService } from '../../../../src/psi/assegnazione/assegnazione.service.js';

jest.mock('../../../../src/drizzle/db.js');

describe('AssegnazionePsicologoAmministratoreService - Unit 2: Esecuzione', () => {
    let service: AssegnazionePsicologoAmministratoreService;
    const oracle = loadOracle('admin/patients/assegnazione-psicologo-unit2');

    let assegnazioneServiceMock: any;

    beforeEach(async () => {
        assegnazioneServiceMock = {
            assignNextPatientToPsychologist: jest.fn().mockResolvedValue(null)
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AssegnazionePsicologoAmministratoreService,
                { provide: AssegnazioneService, useValue: assegnazioneServiceMock }
            ],
        }).compile();

        service = module.get<AssegnazionePsicologoAmministratoreService>(AssegnazionePsicologoAmministratoreService);

        // Mock validazione to do nothing (success)
        jest.spyOn(service, 'validazione').mockResolvedValue(undefined);
    });

    describe('assegnaPsicologo', () => {
        const testCases = ['TC_RF11_6', 'TC_RF11_7', 'TC_RF11_8', 'TC_RF11_9'];

        testCases.forEach(id => {
            const testCase = getTestCase(oracle, id);
            if (!testCase) return;

            it(`${testCase.id}: ${testCase.description}`, async () => {
                const { input, mockData, expectedBehavior } = testCase;
                console.log(`\n🔹 [${testCase.id}] TEST START`);
                console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));
                console.log(`🎯 EXPECTED: ${expectedBehavior.type === 'exception' ? `Exception "${expectedBehavior.message}"` : `Success (Delegation: ${expectedBehavior.shouldDelegate})`}`);

                // Mocks
                const oldPsy = mockData.oldPsychologist ? [{ idPsicologo: mockData.oldPsychologist }] : [];

                const selectSetMock = jest.fn()
                    .mockReturnValue({ from: jest.fn().mockReturnValue({ where: jest.fn().mockReturnValue({ limit: jest.fn().mockResolvedValue(oldPsy) }) }) });
                (db.select as jest.Mock).mockImplementation(selectSetMock);

                // Mock Update
                if (mockData.dbShouldFail) {
                    (db.update as jest.Mock).mockReturnValue({ set: jest.fn().mockReturnValue({ where: jest.fn().mockRejectedValue(new Error('Database Error')) }) });
                } else {
                    (db.update as jest.Mock).mockReturnValue({ set: jest.fn().mockReturnValue({ where: jest.fn().mockResolvedValue({}) }) });
                }

                // Mock Delegation
                if (mockData.delegationShouldFail) {
                    assegnazioneServiceMock.assignNextPatientToPsychologist.mockRejectedValue(new Error('Delegation Error'));
                } else {
                    assegnazioneServiceMock.assignNextPatientToPsychologist.mockResolvedValue('new-patient-id');
                }

                try {
                    const result = await service.assegnaPsicologo(input.idPaziente, input.idPsicologo);

                    if (expectedBehavior.type === 'exception') {
                        throw new Error(`Expected error "${expectedBehavior.message}" but got SUCCESS`);
                    }

                    console.log(`📤 ACTUAL: Success (Result: ${JSON.stringify(result)})`);
                    expect(result.success).toBe(true);

                    if (expectedBehavior.shouldDelegate) {
                        console.log(`🔄 Verification: Delegation EXPECTED for ${expectedBehavior.expectedOldId}`);
                        expect(assegnazioneServiceMock.assignNextPatientToPsychologist).toHaveBeenCalledWith(expectedBehavior.expectedOldId);
                    } else {
                        console.log(`🔄 Verification: Delegation NOT EXPECTED`);
                        expect(assegnazioneServiceMock.assignNextPatientToPsychologist).not.toHaveBeenCalled();
                    }

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
