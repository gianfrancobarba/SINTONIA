import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SpidAuthModule } from './spid-auth/spid-auth.module.js';
import { PatientModule } from './patient/patient.module.js';

@Module({
  imports: [AuthModule, DashboardModule, SpidAuthModule, PatientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
