import { Test, TestingModule } from '@nestjs/testing';
import { RevisioneQuestionarioService } from '../../../../src/psi/questionari/revisione_questionario.service.js';
import { db } from '../../../../src/drizzle/db.js';
import { loadOracle, getTestCase } from '../../../helpers/oracle-loader.js';

jest.mock('../../../../src/drizzle/db.js');

describe('RevisioneQuestionarioService - Unit 1: Validazione', () => {
    let service: RevisioneQuestionarioService;
    const oracle = loadOracle('psi/questionnaires/revisione-questionario-unit1');

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RevisioneQuestionarioService],
        }).compile();

        service = module.get<RevisioneQuestionarioService>(RevisioneQuestionarioService);
    });

    describe('validazione', () => {
        const testCases = ['TC_RF1_1', 'TC_RF1_2', 'TC_RF1_3', 'TC_RF1_4', 'TC_RF1_5', 'TC_RF1_6', 'TC_RF1_6_OK'];

        testCases.forEach(id => {
            const testCase = getTestCase(oracle, id);
            if (!testCase) return;

            it(`${testCase.id}: ${testCase.description}`, async () => {
                const { input, mockData, expectedBehavior } = testCase;
                console.log(`\n🔹 [${testCase.id}] TEST START`);
                console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));
                console.log(`🎯 EXPECTED: ${expectedBehavior.type === 'exception' ? `Exception "${expectedBehavior.message}"` : 'Success'}`);

                // Mocks
                const questionarioResult = mockData.questionarioExists ? [{
                    idQuestionario: input.idQuestionario,
                    revisionato: mockData.revisionato,
                    invalidato: mockData.invalidato,
                    idPsicologoRichiedente: mockData.richiestaInvalidazione ? 'req-psi-id' : null
                }] : [];

                const whereMock = jest.fn().mockReturnValue({ limit: jest.fn().mockResolvedValue(questionarioResult) });
                const fromMock = jest.fn().mockReturnValue({ where: whereMock });
                // @ts-ignore
                (db.select as jest.Mock).mockReturnValue({ from: fromMock });

                try {
                    await service.validazione(input.idQuestionario, input.idPsicologo);

                    if (expectedBehavior.type === 'exception') {
                        throw new Error(`Expected error "${expectedBehavior.message}" but got SUCCESS`);
                    }
                    console.log(`📤 ACTUAL: Success`);
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
