import { Test, TestingModule } from '@nestjs/testing';
import { Compilazione_questionarioController } from '../../../../../src/patient/questionario/compilazione/compilazione_questionario.controller.js';
import { Compilazione_questionarioService } from '../../../../../src/patient/questionario/compilazione/compilazione_questionario.service.js';
import { loadOracle, getTestCase } from '../../../../helpers/oracle-loader.js';

describe('Compilazione_questionarioController', () => {
    let controller: Compilazione_questionarioController;
    let service: Compilazione_questionarioService;

    // Load Oracles
    const oracleUnit7 = loadOracle('patient/questionario/compilazione/compilazione-unit7'); // GET
    const oracleUnit8 = loadOracle('patient/questionario/compilazione/compilazione-unit8'); // START
    const oracleUnit9 = loadOracle('patient/questionario/compilazione/compilazione-unit9'); // SUBMIT

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [Compilazione_questionarioController],
            providers: [
                {
                    provide: Compilazione_questionarioService,
                    useValue: {
                        getQuestionarioDto: jest.fn(),
                        startCompilazione: jest.fn(),
                        submitQuestionario: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<Compilazione_questionarioController>(Compilazione_questionarioController);
        service = module.get<Compilazione_questionarioService>(Compilazione_questionarioService);
    });

    describe('Unit 7: Gestione Richiesta Get', () => {
        const testCases = ['TC_RF3_20', 'TC_RF3_21'];

        testCases.forEach(id => {
            const testCase = getTestCase(oracleUnit7, id);
            if (!testCase) return;

            it(`${testCase.id}: ${testCase.description}`, async () => {
                const { input, mockData, expectedBehavior } = testCase;
                console.log(`\n🔹 [${testCase.id}] TEST START`);

                if (mockData.serviceThrow) {
                    (service.getQuestionarioDto as jest.Mock).mockRejectedValue(new Error(expectedBehavior.message));
                } else {
                    (service.getQuestionarioDto as jest.Mock).mockResolvedValue(mockData.serviceResult);
                }

                try {
                    const result = await controller.getQuestionario(input.params.id);
                    expect(result).toEqual(expectedBehavior.expectedResult);
                } catch (e) {
                    if (expectedBehavior.type === 'exception') {
                        expect(e.message).toContain(expectedBehavior.message);
                    } else {
                        throw e;
                    }
                }
            });
        });
    });

    describe('Unit 8: Gestione Richiesta Start', () => {
        const testCases = ['TC_RF3_22', 'TC_RF3_23'];

        testCases.forEach(id => {
            const testCase = getTestCase(oracleUnit8, id);
            if (!testCase) return;

            it(`${testCase.id}: ${testCase.description}`, async () => {
                const { input, mockData, expectedBehavior } = testCase;
                console.log(`\n🔹 [${testCase.id}] TEST START`);

                // MOCK REQUEST OBJECT for user.id
                const req = { user: input.user };

                if (mockData.serviceThrow) {
                    (service.startCompilazione as jest.Mock).mockRejectedValue(new Error(expectedBehavior.message));
                } else {
                    (service.startCompilazione as jest.Mock).mockResolvedValue(mockData.serviceResult);
                }

                try {
                    const result = await controller.startCompilazione(req as any, input.body);
                    expect(result).toEqual(expectedBehavior.expectedResult);
                } catch (e) {
                    if (expectedBehavior.type === 'exception') {
                        expect(e.message).toContain(expectedBehavior.message);
                    } else {
                        throw e;
                    }
                }
            });
        });
    });

    describe('Unit 9: Gestione Richiesta Submit', () => {
        const testCases = ['TC_RF3_24', 'TC_RF3_25'];

        testCases.forEach(id => {
            const testCase = getTestCase(oracleUnit9, id);
            if (!testCase) return;

            it(`${testCase.id}: ${testCase.description}`, async () => {
                const { input, mockData, expectedBehavior } = testCase;
                console.log(`\n🔹 [${testCase.id}] TEST START`);

                const req = { user: input.user };

                if (mockData.serviceThrow) {
                    (service.submitQuestionario as jest.Mock).mockRejectedValue(new Error(expectedBehavior.message));
                } else {
                    (service.submitQuestionario as jest.Mock).mockResolvedValue(mockData.serviceResult);
                }

                try {
                    const result = await controller.submitQuestionario(req as any, input.body);
                    expect(result).toEqual(expectedBehavior.expectedResult);
                } catch (e) {
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
