import { Test, TestingModule } from '@nestjs/testing';
import { RevisioneQuestionarioService } from '../../../../src/psi/questionari/revisione_questionario.service.js';
import { db } from '../../../../src/drizzle/db.js';
import { loadOracle, getTestCase } from '../../../helpers/oracle-loader.js';

jest.mock('../../../../src/drizzle/db.js');

describe('RevisioneQuestionarioService - Unit 2: Esecuzione', () => {
    let service: RevisioneQuestionarioService;
    const oracle = loadOracle('psi/questionnaires/revisione-questionario-unit2');

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RevisioneQuestionarioService],
        }).compile();

        service = module.get<RevisioneQuestionarioService>(RevisioneQuestionarioService);

        // Spy on validazione to bypass it for Unit 2 execution tests
        jest.spyOn(service, 'validazione').mockResolvedValue(undefined);
    });

    describe('revisionaQuestionario', () => {
        const testCases = ['TC_RF1_7', 'TC_RF1_8'];

        testCases.forEach(id => {
            const testCase = getTestCase(oracle, id);
            if (!testCase) return;

            it(`${testCase.id}: ${testCase.description}`, async () => {
                const { input, mockData, expectedBehavior } = testCase;
                console.log(`\n🔹 [${testCase.id}] TEST START`);
                console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));
                console.log(`🎯 EXPECTED: ${expectedBehavior.type === 'exception' ? `Exception "${expectedBehavior.message}"` : 'Success'}`);

                // Mock Update
                if (mockData.dbShouldFail) {
                    (db.update as jest.Mock).mockReturnValue({ set: jest.fn().mockReturnValue({ where: jest.fn().mockRejectedValue(new Error('Database Error')) }) });
                } else {
                    (db.update as jest.Mock).mockReturnValue({ set: jest.fn().mockReturnValue({ where: jest.fn().mockResolvedValue({}) }) });
                }

                try {
                    await service.revisionaQuestionario(input.idQuestionario, input.idPsicologo);

                    if (expectedBehavior.type === 'exception') {
                        throw new Error(`Expected error "${expectedBehavior.message}" but got SUCCESS`);
                    }

                    console.log(`📤 ACTUAL: Success`);
                    expect(db.update).toHaveBeenCalled();

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
