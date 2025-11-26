import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module.js';
import { PatientModule } from './patient/patient.module.js';

@Module({
  imports: [AuthModule, PatientModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
