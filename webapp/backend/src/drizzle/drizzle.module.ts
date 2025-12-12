
import { Module, Global } from '@nestjs/common';
import { db } from './db.js';

@Global()
@Module({
    providers: [
        {
            provide: 'drizzle',
            useValue: db,
        },
    ],
    exports: ['drizzle'],
})
export class DrizzleModule { }
