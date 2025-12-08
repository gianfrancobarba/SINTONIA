import { Test, TestingModule } from '@nestjs/testing';
import { InserimentoDomandaService } from '../../../../src/patient/forum/inserimento_domanda.service.js';
import { BadgeService } from '../../../../src/patient/badge/badge.service.js';
import { loadOracle, getTestCase } from '../../../helpers/oracle-loader.js';
import { db } from '../../../../src/drizzle/db.js';
import { domandaForum } from '../../../../src/drizzle/schema.js';

// Mock dependencies
jest.mock('../../../../src/drizzle/db.js', () => ({
    db: {
        insert: jest.fn(),
    },
}));

jest.mock('../../../../src/patient/badge/badge.service.js');

describe('InserimentoDomandaService - Inserimento (Unit)', () => {
    let service: InserimentoDomandaService;
    let badgeService: BadgeService;
    const oracle = loadOracle('inserimento-domanda');

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InserimentoDomandaService,
                BadgeService,
            ],
        }).compile();

        service = module.get<InserimentoDomandaService>(InserimentoDomandaService);
        badgeService = module.get<BadgeService>(BadgeService);

        jest.clearAllMocks();
    });

    describe('metodo: inserisciDomanda', () => {
        it('should insert question and award badges successfully (TC_RF23_4)', async () => {
            const testCase = getTestCase(oracle, 'TC_RF23_4_SUCCESS');
            if (!testCase) throw new Error('Test case TC_RF23_4_SUCCESS not found');
            const { input, mockData, expectedOutput } = testCase;

            // Mock DB chain
            const returningMock = jest.fn().mockResolvedValue([{ id: mockData.newIdDomanda }]);
            const valuesMock = jest.fn().mockReturnValue({ returning: returningMock });
            // @ts-ignore
            (db.insert as jest.Mock).mockReturnValue({ values: valuesMock });

            // Mock BadgeService
            (badgeService.checkAndAwardBadges as jest.Mock).mockResolvedValue(mockData.awardedBadges);

            const result = await service.inserisciDomanda(input.idPaziente, input.dto);

            // Assertions
            expect(result).toEqual(expectedOutput);

            // Verify DB call
            expect(db.insert).toHaveBeenCalledWith(domandaForum);
            expect(valuesMock).toHaveBeenCalledWith({
                idPaziente: input.idPaziente,
                titolo: input.dto.titolo.trim(),
                testo: input.dto.testo.trim(),
                categoria: input.dto.categoria.trim(),
            });

            // Verify Badge Service call
            expect(badgeService.checkAndAwardBadges).toHaveBeenCalledWith(input.idPaziente);
        });

        it('should throw Error if database insertion fails', async () => {
            const testCase = getTestCase(oracle, 'TC_DB_ERROR');
            if (!testCase) throw new Error('Test case TC_DB_ERROR not found');
            const { input, mockData, expectedBehavior } = testCase;

            // Mock DB returning empty/failure
            const returningMock = jest.fn().mockResolvedValue(mockData.dbReturn);
            const valuesMock = jest.fn().mockReturnValue({ returning: returningMock });
            // @ts-ignore
            (db.insert as jest.Mock).mockReturnValue({ values: valuesMock });

            await expect(service.inserisciDomanda(input.idPaziente, input.dto))
                .rejects.toThrow(expectedBehavior.message);
        });
    });
});
