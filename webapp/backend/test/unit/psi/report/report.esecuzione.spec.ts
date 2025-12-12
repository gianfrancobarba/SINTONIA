import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from '../../../../src/psi/report/report.service.js';
import { NotFoundException } from '@nestjs/common';
import { db } from '../../../../src/drizzle/db.js';
import { loadOracle, getTestCase } from '../../../helpers/oracle-loader.js';

jest.mock('../../../../src/drizzle/db.js');

describe('ReportService - Unit 2: Esecuzione', () => {
    let service: ReportService;
    const oracle = loadOracle('psi/report/report-unit2');

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReportService,
            ],
        }).compile();

        service = module.get<ReportService>(ReportService);
    });

    describe('generateReport', () => {
        const testCases = ['TC_RF4_4', 'TC_RF4_5', 'TC_RF4_6'];

        testCases.forEach(id => {
            const testCase = getTestCase(oracle, id);
            if (!testCase) return;

            it(`${testCase.id}: ${testCase.description}`, async () => {
                const { input, mockData, expectedBehavior } = testCase;
                console.log(`\n🔹 [${testCase.id}] TEST START`);
                console.log(`📥 INPUT:`, JSON.stringify(input, null, 2));
                console.log(`🎯 EXPECTED: ${expectedBehavior.type === 'exception' ? `Exception "${expectedBehavior.message}"` : 'Success'}`);

                // Mock validation
                jest.spyOn(service, 'validazione').mockResolvedValue(mockData.validationResult);

                // Mock DB Selects (Mood, Quest, Diary, Forum)
                const mockSelect = jest.fn();
                // @ts-ignore
                (db.select as jest.Mock).mockReturnValue({
                    from: jest.fn().mockReturnValue({
                        where: jest.fn().mockReturnValue({
                            orderBy: jest.fn().mockReturnValue({
                                limit: jest.fn().mockImplementation(() => {
                                    // This limits chain logic is tricky to mock perfectly sequentially without separate mocks per table
                                    // However, we can use mockImplementationOnce for strict sequence if we know the order
                                    // 1. Mood, 2. Quest (Limit is implicit/not used for quest in service but used for others), 
                                    // Actually service code:
                                    // Mood -> limit(30)
                                    // Quest -> orderBy (no limit?) -> wait, code has limit for others?
                                    // Quest: orderBy
                                    // Diary: limit(10)
                                    // Forum: limit(10)

                                    // Since `db.select().from()...` is called multiple times, we need to handle the chain.
                                    // A simpler approach is to mock the REVOLVED value of the final chain.
                                    // BUT, the service uses `await db.select()...`

                                    return Promise.resolve([]); // Default 
                                })
                            })
                        })
                    })
                });

                // Better mock approach for multiple sequential selects:
                // We can mock `db.select` to return a chain that eventually resolves to different values based on call count or table?
                // Or we can mock `from` if we export schema tables and check args.

                // Simpler: assume fixed order of execution in service: Mood, Questionnaire, Diary, Forum.
                const selectMock = jest.fn();
                const fromMock = jest.fn();
                const whereMock = jest.fn();
                const orderByMock = jest.fn();
                const limitMock = jest.fn();

                // @ts-ignore
                (db.select as jest.Mock).mockImplementation(selectMock);
                selectMock.mockReturnValue({ from: fromMock });
                fromMock.mockReturnValue({ where: whereMock });
                whereMock.mockReturnValue({ orderBy: orderByMock, limit: limitMock }); // Handle case where orderBy is skipped? No, all have order or limit.
                orderByMock.mockReturnValue({ limit: limitMock });

                // Chain ends at limit() for Mood, Diary, Forum. For Questionnaire it ends at orderBy().
                // Service code:
                // Mood: ...orderBy().limit(30)
                // Quest: ...orderBy() (returns promise directly?) No, await db...orderBy() returns promise-like? Drizzle returns promise on await.
                // let's assume `orderBy` returns object with `limit` AND checks for `then`.

                const finalPromise = (data) => Promise.resolve(data);

                // Setup specific returns
                limitMock.mockImplementationOnce(() => finalPromise(mockData.moodData || [])) // 1. Mood
                    .mockImplementationOnce(() => finalPromise(mockData.diaryData || [])) // 3. Diary (Note: Quest is 2nd but lacks limit?)
                    .mockImplementationOnce(() => finalPromise(mockData.forumData || [])); // 4. Forum

                // For Questionnaire (2nd call), it ends at orderBy.
                orderByMock.mockImplementationOnce((arg) => {
                    // Check if this is the questionnaire call (it has no limit).
                    // But wait, the chain is shared. 
                    // If we are here for questionnaire, we return the data promse directly.
                    // But wait, limitMock is also called for others.
                    return {
                        limit: limitMock, // Continue chain for others
                        then: (resolve) => resolve(mockData.questionnaireData || []) // Resolve for this one
                    }
                });


                // Actually, simpler:
                // 1. Mood (limit)
                // 2. Quest (orderBy)
                // 3. Diary (limit)
                // 4. Forum (limit)

                // To robustly mock this without complex chains, maybe we just use `mockReturnValueOnce` on `db.select`?
                // But `db.select` returns the builder.

                // Let's use `mockImplementation` on `from` to distinguish?
                // `from(statoAnimo)` -> returns builder that resolves to MoodData
                // `from(questionario)` -> returns builder that resolves to QuestData

                // This requires importing tables in test or checking args.
                // Let's check `mockData` order.

                // Quick fix for this test: Just return empty or full based on index if possible,
                // OR use the Mock Provider approach if we had one.
                // Let's try matching `from` table names if possible. but they are objects.

                // RE-ATTEMPT MOCK STRATEGY:
                // We mock the chain to always return a Promise that resolves to a mocked value.
                // We control that value using `mockReturnValueOnce` on the *terminal* operation.
                // For Mood/Diary/Forum, terminal is `limit`. For Quest, terminal is `orderBy`.

                const chain = {
                    from: jest.fn().mockReturnThis(),
                    where: jest.fn().mockReturnThis(),
                    orderBy: jest.fn().mockReturnThis(),
                    limit: jest.fn(),
                    then: jest.fn(), // identifying a promise
                };

                // @ts-ignore
                (db.select as jest.Mock).mockReturnValue(chain);

                // 1. Mood -> limit
                // 2. Quest -> orderBy (no limit called)
                // 3. Diary -> limit
                // 4. Forum -> limit

                // This implies:
                // Call 1 (Mood): .limit() called.
                // Call 2 (Quest): .orderBy() called, then... await. So we need `then` or logic. 
                //    Wait, `orderBy` returns the query builder which IS a promise.
                //    So `request 2` awaits the result of `orderBy`.

                // Let's make `limit` return a Promise.
                chain.limit
                    .mockResolvedValueOnce(mockData.moodData || [])
                    .mockResolvedValueOnce(mockData.diaryData || [])
                    .mockResolvedValueOnce(mockData.forumData || []);

                // For Questionnaire, we need `orderBy` to behave as a promise (for Call 2) OR return a builder with limit (for Call 1,3,4).
                // Actually `orderBy` is called for ALL 4 queries.

                chain.orderBy.mockImplementation(() => {
                    return {
                        limit: chain.limit,
                        then: (resolve) => resolve(mockData.questionnaireData || []) // Only validation for Call 2? 
                        // Limitation: This `then` will be called for ALL queries if we `await` the result of `orderBy` directly.
                        // Service:
                        // 1. await ...orderBy().limit(30) -> limit returns promise, `then` of orderBy NOT called (or called internally?).
                        // 2. await ...orderBy() -> `then` of orderBy called.

                        // So if we make `orderBy` return an object that HAS `limit` AND is thenable...
                    }
                });

                // If I return a thenable from orderBy, `await` might resolve it immediately for Call 2.
                // For Call 1, `limit` is called on that returned object.

                // To separate them:
                // We need `db.select` to return distinct chains or track state.

                // State tracking strategy:
                let callCount = 0;
                // @ts-ignore
                (db.select as jest.Mock).mockImplementation(() => {
                    callCount++;
                    const localChain = {
                        from: jest.fn().mockReturnThis(),
                        where: jest.fn().mockReturnThis(),
                        orderBy: jest.fn().mockReturnThis(),
                        limit: jest.fn().mockReturnThis(),
                        then: (resolve) => {
                            if (callCount === 1) resolve(mockData.moodData || []);
                            if (callCount === 2) resolve(mockData.questionnaireData || []);
                            if (callCount === 3) resolve(mockData.diaryData || []);
                            if (callCount === 4) resolve(mockData.forumData || []);
                        }
                    };
                    return localChain;
                });
                // Note: The service calls `await ... limit()`. If `limit()` returns `this` (the chain), then `await chain` calls `chain.then`.


                // Mock Insert
                const insertMock = jest.fn().mockReturnValue({
                    values: jest.fn().mockImplementation(() => {
                        if (mockData.dbError) return Promise.reject(new Error("DB Insert Failed"));
                        return Promise.resolve();
                    })
                });
                // @ts-ignore
                (db.insert as jest.Mock).mockImplementation(insertMock);


                try {
                    await service.generateReport(input.patientId, input.psychologistId);

                    if (expectedBehavior.type === 'exception') {
                        throw new Error(`Expected error "${expectedBehavior.message}" but got SUCCESS`);
                    }
                    console.log(`📤 ACTUAL: Success`);
                } catch (e) {
                    console.log(`📤 ACTUAL: Exception "${e.message}"`);
                    if (e.message.startsWith('Expected error')) throw e;

                    if (expectedBehavior.type === 'exception') {
                        expect(e.message).toContain(expectedBehavior.message);
                        if (e.message.includes('Nessun dato')) expect(e).toBeInstanceOf(NotFoundException);
                    } else {
                        throw e;
                    }
                }
            });
        });
    });
});
