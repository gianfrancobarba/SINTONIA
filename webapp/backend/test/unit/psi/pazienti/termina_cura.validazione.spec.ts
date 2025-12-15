import { Test, TestingModule } from '@nestjs/testing';
import { TerminaCuraService } from '../../../../src/psi/pazienti/termina-cura.service.js';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { db } from '../../../../src/drizzle/db.js';
import { AssegnazioneService } from '../../../../src/psi/assegnazione/assegnazione.service.js';
import { loadOracle, getTestCase } from '../../../helpers/oracle-loader.js';

jest.mock('../../../../src/drizzle/db.js');

describe('TerminaCuraService - Unit 1: Validazione', () => {
    let service: TerminaCuraService;
    let assegnazioneServiceMock: any;
    const oracle = loadOracle('psi/patients/termina-cura-unit1');

    beforeEach(async () => {
        assegnazioneServiceMock = {};

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TerminaCuraService,
                { provide: AssegnazioneService, useValue: assegnazioneServiceMock }
            ],
        }).compile();

        service = module.get<TerminaCuraService>(TerminaCuraService);
    });

    describe('validazione', () => {
        const testCases = ['TC_RF4_1', 'TC_RF4_2', 'TC_RF4_3', 'TC_RF4_4', 'TC_RF4_5', 'TC_RF4_6'];

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
                    nome: 'Mario',
                    cognome: 'Rossi',
                    idPsicologo: mockData.assignedPsychologist || input.codiceFiscalePsicologo,
                    stato: mockData.stato // true or false
                }] : [];

                const whereMock = jest.fn().mockReturnValue({ limit: jest.fn().mockResolvedValue(pazienteResult) });
                const fromMock = jest.fn().mockReturnValue({ where: whereMock });
                // @ts-ignore
                (db.select as jest.Mock).mockReturnValue({ from: fromMock });

                try {
                    await service.validazione(input.idPaziente, input.codiceFiscalePsicologo);

                    if (expectedBehavior.type === 'exception') {
                        throw new Error(`Expected error "${expectedBehavior.message}" but got SUCCESS`);
                    }
                    console.log(`📤 ACTUAL: Success`);
                } catch (e) {
                    console.log(`📤 ACTUAL: Exception "${e.message}"`);
                    if (e.message.startsWith('Expected error')) throw e;

                    if (expectedBehavior.type === 'exception') {
                        expect(e.message).toContain(expectedBehavior.message);
                        // Optional specific exception check
                        if (e.message.includes('non trovato')) expect(e).toBeInstanceOf(NotFoundException);
                        else if (e.message.includes('autorizzato')) expect(e).toBeInstanceOf(ForbiddenException);
                        else expect(e).toBeInstanceOf(BadRequestException);
                    } else {
                        throw e;
                    }
                }
            });
        });
    });
});
