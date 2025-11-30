import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { PsiModule } from './psi/psi.module.js';
import { SpidAuthModule } from './spid-auth/spid-auth.module.js';
import { PatientModule } from './patient/patient.module.js';
import { QuestionnairesModule } from './questionari/questionnaires.module.js';
import { Questionari_amministratoreModule } from './amministratore/questionari/questionari_amministratore.module.js';
import { Pazienti_amministratoreModule } from './amministratore/pazienti/pazienti_amministratore.module.js';
import { InvalidazioneModule } from './amministratore/invalidazione/invalidazione.module.js';
import { Psicologi_amministratoreModule } from './amministratore/psicologi/psicologi_amministratore.module.js';
import { UploadsModule } from './uploads/uploads.module.js';

@Module({
  imports: [AuthModule, DashboardModule, SpidAuthModule, PatientModule, PsiModule, QuestionnairesModule, Questionari_amministratoreModule, Pazienti_amministratoreModule, Psicologi_amministratoreModule, InvalidazioneModule, UploadsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

