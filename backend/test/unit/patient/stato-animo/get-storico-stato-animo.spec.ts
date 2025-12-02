import { Test, TestingModule } from '@nestjs/testing';
import { StatoAnimoService } from '../../../../src/patient/stato-animo/stato-animo.service.js';
import { db } from '../../../../src/drizzle/db.js';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('../../../../src/drizzle/db', () => ({
    db: {
        select: jest.fn(),
    },
}));

const oraclePath = path.join(
    __dirname,
    '../../../oracles/get-storico-stato-animo-oracle.json'
);
const oracle = JSON.parse(fs.readFileSync(oraclePath, 'utf-8'));

describe('StatoAnimoService - getStoricoStatoAnimo', () => {
    let service: StatoAnimoService;

    beforeAll(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2025-12-02T12:00:00Z'));
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StatoAnimoService,
            ],
        }).compile();

        service = module.get<StatoAnimoService>(StatoAnimoService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getStoricoStatoAnimo', () => {
        it.each(
            oracle.testCases
                .filter((tc: any) =>
                    tc.method === 'getStoricoStatoAnimo' &&
                    tc.category === 'success'
                )
                .map((tc: any) => [tc.id, tc.description, tc])
        )('%s: %s', async (id: string, description: string, testCase: any) => {
            const mockQueryBuilder = {
                from: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(testCase.mockData.dbResponse),
            };

            jest.spyOn(db, 'select').mockReturnValue(mockQueryBuilder as any);

            const args: any[] = [testCase.input.userId];
            if (testCase.input.giorni !== undefined) {
                args.push(testCase.input.giorni);
            }

            const result = await service.getStoricoStatoAnimo(...(args as [string, number?]));

            expect(result).toEqual(testCase.expectedOutput);

            expect(db.select).toHaveBeenCalled();
            expect(mockQueryBuilder.where).toHaveBeenCalled();
            expect(mockQueryBuilder.orderBy).toHaveBeenCalled();
        });

        it.each(
            oracle.testCases
                .filter((tc: any) =>
                    tc.method === 'getStoricoStatoAnimo' &&
                    (tc.category === 'edge-case' || tc.category === 'edge-case-critical')
                )
                .map((tc: any) => [tc.id, tc.description, tc])
        )('%s: %s', async (id: string, description: string, testCase: any) => {
            const mockQueryBuilder = {
                from: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(testCase.mockData.dbResponse),
            };

            jest.spyOn(db, 'select').mockReturnValue(mockQueryBuilder as any);

            const args: any[] = [testCase.input.userId];
            if (testCase.input.giorni !== undefined) {
                args.push(testCase.input.giorni);
            }

            const result = await service.getStoricoStatoAnimo(...(args as [string, number?]));

            expect(result).toEqual(testCase.expectedOutput);
        });

        it.each(
            oracle.testCases
                .filter((tc: any) =>
                    tc.method === 'getStoricoStatoAnimo' &&
                    tc.category === 'stress'
                )
                .map((tc: any) => [tc.id, tc.description, tc])
        )('%s: %s', async (id: string, description: string, testCase: any) => {
            const mockQueryBuilder = {
                from: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(testCase.mockData.dbResponse),
            };

            jest.spyOn(db, 'select').mockReturnValue(mockQueryBuilder as any);

            const args: any[] = [testCase.input.userId];
            if (testCase.input.giorni !== undefined) {
                args.push(testCase.input.giorni);
            }

            const result = await service.getStoricoStatoAnimo(...(args as [string, number?]));

            expect(result).toEqual(testCase.expectedOutput);
            expect(result.entries).toHaveLength(testCase.expectedOutput.entries.length);
        });

        it('should return empty array when no data in date range', async () => {
            const mockQueryBuilder = {
                from: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue([]),
            };

            jest.spyOn(db, 'select').mockReturnValue(mockQueryBuilder as any);

            const result = await service.getStoricoStatoAnimo('user-id', 30);

            expect(result).toEqual({ entries: [] });
        });
    });
});
