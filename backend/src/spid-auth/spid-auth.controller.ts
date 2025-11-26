import { Controller, Get, Post, Query, Res, Body } from '@nestjs/common';
import type { Response } from 'express';
import { SpidAuthService } from './spid-auth.service.js';

@Controller('spid-auth')
export class SpidAuthController {
  constructor(private readonly spidAuthService: SpidAuthService) { }

  @Get('login')
  async login(@Query('frontendUrl') frontendUrl: string, @Query('userType') userType: string, @Res() res: Response) {
    const targetFrontendUrl = frontendUrl || 'http://localhost:5173';
    const targetUserType = userType || 'patient';

    // Replica esatta della pagina di scelta provider SPID
    const html = `
      <!DOCTYPE html>
      <html lang="it">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Entra con SPID</title>
        <style>
          /* ... styles ... */
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Titillium Web', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
            background: linear-gradient(135deg, #0066CC 0%, #004C99 100%);
            display: flex; justify-content: center; align-items: center; 
            min-height: 100vh; padding: 20px; 
          }
          .spid-container { 
            background: white; max-width: 560px; width: 100%; 
            border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); 
            overflow: hidden; 
          }
          .spid-header { 
            background: linear-gradient(135deg, #0066CC 0%, #0052A3 100%);
            color: white; padding: 15px 15px; text-align: center; 
            position: relative; overflow: hidden;
          }
          .spid-header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }
          .spid-logo { 
            font-size: 48px; font-weight: 800; letter-spacing: 2px; 
            position: relative; z-index: 1;
            text-shadow: 0 2px 10px rgba(0,0,0,0.2);
          }
          .spid-subtitle { 
            font-size: 14px; margin-top: 12px; opacity: 0.95; 
            font-weight: 300; letter-spacing: 0.5px;
            position: relative; z-index: 1;
          }
          .spid-content { padding: 40px 30px; }
          .spid-title { 
            font-size: 20px; font-weight: 600; color: #1a202c; 
            margin-bottom: 30px; text-align: center; 
          }
          .provider-list { list-style: none; display: grid; gap: 12px; }
          .provider-item { transform-origin: center; }
          .provider-btn { 
            display: flex; align-items: center; padding: 16px 18px; 
            background: linear-gradient(to right, #ffffff 0%, #f7fafc 100%);
            border: 2px solid #e2e8f0; border-radius: 12px; 
            text-decoration: none; color: #2d3748; font-weight: 600; font-size: 15px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
            cursor: pointer; width: 100%; position: relative; overflow: hidden;
          }
          .provider-btn::before {
            content: '';
            position: absolute;
            top: 0; left: -100%;
            width: 100%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(0, 102, 204, 0.1), transparent);
            transition: left 0.5s;
          }
          .provider-btn:hover::before {
            left: 100%;
          }
          .provider-btn:hover { 
            border-color: #0066CC; 
            background: linear-gradient(to right, #ffffff 0%, #edf2f7 100%);
            transform: translateY(-2px) scale(1.02); 
            box-shadow: 0 8px 20px rgba(0, 102, 204, 0.25);
          }
          .provider-btn:active {
            transform: translateY(0) scale(0.98);
          }
          .provider-logo { 
            width: 48px; height: 48px; margin-right: 16px; 
            border-radius: 10px; display: flex; align-items: center; 
            justify-content: center; font-weight: 700; font-size: 18px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            position: relative; z-index: 1;
          }
          .info-text { 
            text-align: center; color: #718096; font-size: 13px; 
            margin-top: 30px; line-height: 1.6; font-weight: 400;
          }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300;400;600;800&display=swap" rel="stylesheet">
      </head>
      <body>
        <div class="spid-container">
          <div class="spid-header">
            <div class="spid-logo">SPID</div>
            <div class="spid-subtitle">Sistema Pubblico di Identità Digitale</div>
          </div>
          <div class="spid-content">
            <h2 class="spid-title">Scegli il tuo Identity Provider</h2>
            <ul class="provider-list">
              <li class="provider-item">
                <a href="/spid-auth/provider-login?provider=Poste Italiane&frontendUrl=${targetFrontendUrl}&userType=${targetUserType}" class="provider-btn">
                  <div class="provider-logo" style="background: linear-gradient(135deg, #FFCD00 0%, #FFB700 100%); color: #003366;">PI</div>
                  <span>Poste Italiane SpID</span>
                </a>
              </li>
              <li class="provider-item">
                <a href="/spid-auth/provider-login?provider=Aruba&frontendUrl=${targetFrontendUrl}&userType=${targetUserType}" class="provider-btn">
                  <div class="provider-logo" style="background: linear-gradient(135deg, #FF6600 0%, #FF4500 100%); color: white;">A</div>
                  <span>Aruba ID</span>
                </a>
              </li>
              <li class="provider-item">
                <a href="/spid-auth/provider-login?provider=InfoCert&frontendUrl=${targetFrontendUrl}&userType=${targetUserType}" class="provider-btn">
                  <div class="provider-logo" style="background: linear-gradient(135deg, #00A1E4 0%, #0077B6 100%); color: white;">IC</div>
                  <span>InfoCert ID</span>
                </a>
              </li>
              <li class="provider-item">
                <a href="/spid-auth/provider-login?provider=Intesa&frontendUrl=${targetFrontendUrl}&userType=${targetUserType}" class="provider-btn">
                  <div class="provider-logo" style="background: linear-gradient(135deg, #0066CC 0%, #0052A3 100%); color: white;">IN</div>
                  <span>Intesa ID</span>
                </a>
              </li>
              <li class="provider-item">
                <a href="/spid-auth/provider-login?provider=Namirial&frontendUrl=${targetFrontendUrl}&userType=${targetUserType}" class="provider-btn">
                  <div class="provider-logo" style="background: linear-gradient(135deg, #E30613 0%, #B3050F 100%); color: white;">N</div>
                  <span>Namirial ID</span>
                </a>
              </li>
              <li class="provider-item">
                <a href="/spid-auth/provider-login?provider=Sielte&frontendUrl=${targetFrontendUrl}&userType=${targetUserType}" class="provider-btn">
                  <div class="provider-logo" style="background: linear-gradient(135deg, #0099CC 0%, #007AA3 100%); color: white;">S</div>
                  <span>Sielte ID</span>
                </a>
              </li>
            </ul>
            <p class="info-text">
              Seleziona l'Identity Provider con cui hai registrato la tua identità SPID
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
    res.send(html);
  }

  @Get('provider-login')
  async providerLogin(@Query('provider') provider: string, @Query('frontendUrl') frontendUrl: string, @Query('userType') userType: string, @Res() res: Response) {
    const providerName = provider || 'Provider';
    const targetFrontendUrl = frontendUrl || 'http://localhost:5173';
    const targetUserType = userType || 'patient';

    // Form login stile Poste Italiane modernizzato
    const html = `
      <!DOCTYPE html>
      <html lang="it">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Accesso SPID - ${providerName}</title>
        <style>
          /* ... styles ... */
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Titillium Web', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
            background: linear-gradient(135deg, #0066CC 0%, #004C99 100%);
            min-height: 100vh; display: flex; justify-content: center; 
            align-items: center; padding: 20px; 
          }
          
          .login-container { 
            background: white; max-width: 1000px; width: 100%; 
            border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); 
            display: flex; flex-direction: column; overflow: hidden;
          }
          
          .login-header { 
            background: linear-gradient(135deg, #0066CC 0%, #0052A3 100%);
            padding: 35px 40px; display: flex; justify-content: space-between; 
            align-items: center; position: relative; overflow: hidden;
          }
          .login-header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: pulse 4s ease-in-out infinite;
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }
          .spid-logo { 
            font-size: 32px; font-weight: 800; color: white; 
            z-index: 1; position: relative;
            text-shadow: 0 2px 10px rgba(0,0,0,0.2);
          }
          .provider-logo { 
            font-size: 18px; font-weight: 700; color: #003366; 
            background: linear-gradient(135deg, #FFCD00 0%, #FFB700 100%);
            padding: 10px 24px; border-radius: 10px; z-index: 1; position: relative;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          
          .login-body { display: flex; }
          .login-form-section { flex: 1; padding: 50px 45px; }
          .qr-section { 
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            width: 380px; padding: 50px 40px; display: flex; 
            flex-direction: column; align-items: center; justify-content: center; 
            border-left: 1px solid #e2e8f0; position: relative;
          }
          .qr-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><circle cx="1" cy="1" r="1" fill="rgba(0,102,204,0.05)"/></svg>');
            opacity: 0.5;
          }
          
          .form-title { 
            font-size: 16px; color: #718096; margin-bottom: 6px; 
            font-weight: 400; letter-spacing: 0.3px;
          }
          .form-subtitle { 
            font-size: 28px; color: #1a202c; margin-bottom: 40px; 
            font-weight: 700; letter-spacing: -0.5px;
          }
          
          .form-group { margin-bottom: 28px; }
          .form-label { 
            display: block; font-size: 13px; font-weight: 600; 
            color: #4a5568; margin-bottom: 10px; 
            text-transform: uppercase; letter-spacing: 0.8px; 
          }
          .form-input { 
            width: 100%; padding: 14px 16px; 
            border: 2px solid #e2e8f0; 
            border-radius: 10px; font-size: 15px; 
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: inherit; background: #f7fafc;
          }
          .form-input:focus { 
            outline: none; border-color: #0066CC; 
            background: white;
            box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.1); 
          }
          .form-input:read-only,
          .form-input[readonly] {
            background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
            color: #4a5568;
            cursor: not-allowed;
            border-color: #cbd5e0;
          }
          .form-input::placeholder { color: #a0aec0; font-style: italic; }
          
          .readonly-badge {
            display: inline-block;
            background: linear-gradient(135deg, #0066CC 0%, #0052A3 100%);
            color: white;
            font-size: 10px;
            padding: 3px 8px;
            border-radius: 6px;
            margin-left: 8px;
            font-weight: 600;
            letter-spacing: 0.5px;
          }
          
          .button-group { display: flex; gap: 12px; margin-top: 35px; }
          .btn { 
            padding: 12px 24px; border-radius: 8px; font-size: 14px; 
            font-weight: 600; cursor: pointer; 
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
            border: none; font-family: inherit; 
          }
          .btn-cancel { 
            background: white; color: #4a5568; 
            border: 2px solid #cbd5e0; flex: 1;
          }
          .btn-cancel:hover { 
            background: #f7fafc; border-color: #a0aec0;
            transform: translateY(-1px);
          }
          .btn-submit { 
            background: linear-gradient(135deg, #0066CC 0%, #0052A3 100%);
            color: white; display: flex; align-items: center; 
            justify-content: center; gap: 8px; flex: 2;
            box-shadow: 0 4px 14px rgba(0, 102, 204, 0.4);
          }
          .btn-submit:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 8px 20px rgba(0, 102, 204, 0.5);
          }
          .btn-submit:active {
            transform: translateY(0);
          }
          .spid-icon-btn { font-size: 16px; }
          
          .qr-code { 
            width: 220px; height: 220px; background: white; 
            border: 2px solid #e2e8f0; display: flex; 
            align-items: center; justify-content: center; 
            margin-bottom: 24px; border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            position: relative; z-index: 1;
          }
          .qr-placeholder { font-size: 70px; color: #FFCD00; }
          .qr-text { 
            text-align: center; font-size: 13px; color: #4a5568; 
            line-height: 1.7; position: relative; z-index: 1;
            font-weight: 500;
          }
          .qr-highlight { 
            color: #0066CC; font-weight: 700; 
          }
          
          .register-link { 
            margin-top: 35px; text-align: center; font-size: 14px; 
            color: #718096;
          }
          .register-link a { 
            color: #0066CC; text-decoration: none; font-weight: 600;
          }
          .register-link a:hover { 
            text-decoration: underline; 
          }
          
          @media (max-width: 768px) {
            .login-body { flex-direction: column; }
            .qr-section { 
              width: 100%; border-left: none; 
              border-top: 1px solid #e2e8f0; 
            }
            .login-form-section { padding: 40px 30px; }
          }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300;400;600;700;800&display=swap" rel="stylesheet">
      </head>
      <body>
        <div class="login-container">
          <div class="login-header">
            <div class="spid-logo">SPID</div>
            <div class="provider-logo">Poste ID</div>
          </div>
          
          <div class="login-body">
            <div class="login-form-section">
              <div class="form-title">Richiesta di accesso SPID 2</div>
              <div class="form-subtitle">SINTONIA</div>
              
              <form action="/spid-auth/callback" method="POST">
                <input type="hidden" name="frontendUrl" value="${targetFrontendUrl}">
                <input type="hidden" name="userType" value="${targetUserType}">
                <div class="form-group">
                  <label class="form-label" for="fiscalcode">
                    Codice Fiscale
                    <span class="readonly-badge">READONLY</span>
                  </label>
                  <input 
                    type="text" 
                    id="fiscalcode" 
                    name="fiscalcode" 
                    class="form-input" 
                    value="PZT0010SINTONIAA"
                    required 
                    readonly
                    autocomplete="off"
                  >
                </div>
                
                <div class="form-group">
                  <label class="form-label" for="password">
                    Password
                    <span class="readonly-badge">READONLY</span>
                  </label>
                  <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    class="form-input" 
                    value="password123"
                    required 
                    readonly
                    autocomplete="current-password"
                  >
                </div>

                <div class="button-group">
                  <button type="button" class="btn btn-cancel" onclick="window.history.back()">ANNULLA</button>
                  <button type="submit" class="btn btn-submit">
                    ENTRA CON SPID
                  </button>
                </div>
              </form>
              
              <div class="register-link">
                Non hai ancora SPID? <a href="#">Registrati</a>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    res.send(html);
  }

  @Post('callback')
  async callback(@Body() body: any, @Res() res: Response) {
    const frontendUrl = body.frontendUrl || 'http://localhost:5173';
    const userType = body.userType || 'patient';

    try {
      // Simuliamo un ritardo di autenticazione realistico
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Dati utente da SPID
      const spidProfile: any = userType === 'psychologist'
        ? {
          fiscalNumber: 'BRBLCA81L15F205J',
          name: 'Luca',
          familyName: 'Bruno'
        }
        : {
          fiscalNumber: 'PZT0010SINTONIAA',
          name: 'Chiara',
          familyName: 'Conti',
          email: 'chiara.conti@gmail.com',
          dateOfBirth: '2000-07-05'
        };

      console.log(`✓ Autenticazione SPID completata per: ${spidProfile.fiscalNumber} (${userType})`);

      let user;
      let tokenData;

      if (userType === 'psychologist') {
        user = await this.spidAuthService.validatePsychologist(spidProfile);
        tokenData = await this.spidAuthService.generateToken(user, 'psychologist');
      } else {
        user = await this.spidAuthService.validatePatient(spidProfile);
        tokenData = await this.spidAuthService.generateToken(user, 'patient');
      }

      // Redirect al frontend con token
      const redirectUrl = `${frontendUrl}/spid-callback?token=${tokenData.access_token}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Errore autenticazione SPID:', error);
      const errorMessage = error.message || 'Errore durante l\'autenticazione';
      res.redirect(`${frontendUrl}/spid-error?message=` + encodeURIComponent(errorMessage));
    }
  }
}
