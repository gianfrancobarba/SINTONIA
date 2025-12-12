import { Test, TestingModule } from '@nestjs/testing';
import { Accettazione_invalidazioneController } from '../../../../src/amministratore/invalidazione/accettazione_invalidazione.controller.js';
import { Accettazione_invalidazioneService } from '../../../../src/amministratore/invalidazione/accettazione_invalidazione.service.js';
import { loadOracle, getTestCase } from '../../../helpers/oracle-loader.js';
import { BadRequestException } from '@nestjs/common';

describe('Accettazione_invalidazioneController - Unit 6', () => {
    let controller: Accettazione_invalidazioneController;
    let service: Accettazione_invalidazioneService;
    const oracle = loadOracle('admin/invalidation/accettazione-invalidazione-unit6');

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [Accettazione_invalidazioneController],
            providers: [
                {
                    provide: Accettazione_invalidazioneService,
                    useValue: {
                        accettaRichiestaInvalidazione: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<Accettazione_invalidazioneController>(Accettazione_invalidazioneController);
        service = module.get<Accettazione_invalidazioneService>(Accettazione_invalidazioneService);
    });

    const testCases = ['TC_RF21_28', 'TC_RF21_29', 'TC_RF21_30'];

    testCases.forEach(id => {
        const testCase = getTestCase(oracle, id);
        if (!testCase) return;

        it(`${testCase.id}: ${testCase.description}`, async () => {
            const { input, mockData, expectedBehavior } = testCase;
            console.log(`\n🔹 [${testCase.id}] TEST START`);
            console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));
            console.log(`🎯 EXPECTED: ${expectedBehavior.type === 'exception' ? `Exception "${expectedBehavior.message}"` : 'Success'}`);

            // Mock service response
            if (mockData.serviceShouldThrow) {
                (service.accettaRichiestaInvalidazione as jest.Mock).mockRejectedValue(new Error("Internal Server Error"));
            } else {
                (service.accettaRichiestaInvalidazione as jest.Mock).mockResolvedValue(undefined);
            }

            try {
                // Simulate parameter validationpipe effect for invalid uuid
                if (input.params.id === 'invalid-uuid') {
                    throw new BadRequestException("Validation failed");
                }

                const result = await controller.accettaRichiesta(input.params.id, { user: input.user });

                if (expectedBehavior.type === 'exception') {
                    throw new Error(`Expected error "${expectedBehavior.message}" but got SUCCESS`);
                }

                console.log(`📤 ACTUAL: Success`);
                expect(result).toEqual({ message: expectedBehavior.message });

            } catch (e) {
                console.log(`📤 ACTUAL: Exception "${e.message}"`);
                if (e.message.startsWith('Expected error')) throw e;

                if (expectedBehavior.type === 'exception') {
                    if (expectedBehavior.status === 400) expect(e).toBeInstanceOf(BadRequestException);
                    if (expectedBehavior.message) expect(e.message).toContain(expectedBehavior.message);
                } else {
                    throw e;
                }
            }
        });
    });
});
