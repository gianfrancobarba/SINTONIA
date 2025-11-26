import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { SpidAuthController } from './spid-auth.controller.js';
import { SpidAuthService } from './spid-auth.service.js';

import { DrizzleModule } from '../drizzle/drizzle.module.js';

@Module({
    imports: [
        DrizzleModule,
        PassportModule,
        JwtModule.register({
            secret: 'jwt_secret', // Same secret as main auth module
            signOptions: { expiresIn: '60m' },
        }),
    ],
    controllers: [SpidAuthController],
    providers: [SpidAuthService],
    exports: [SpidAuthService],
})
export class SpidAuthModule { }
