import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { PsiModule } from './psi/psi.module.js';
import { SpidAuthModule } from './spid-auth/spid-auth.module.js';
import { PatientModule } from './patient/patient.module.js';

@Module({
  imports: [AuthModule, DashboardModule, SpidAuthModule, PatientModule, PsiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
