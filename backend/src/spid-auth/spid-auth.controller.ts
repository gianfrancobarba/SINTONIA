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

    // Authentic SPID login page matching Poste Italiane design
    const html = `
      <!DOCTYPE html>
      <html lang="it">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Accesso SPID - ${providerName}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Titillium Web', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #0066CC;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
          }
          
          .login-container { 
            background: white;
            max-width: 580px;
            width: 100%;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            overflow: hidden;
          }
          
          .login-header { 
            background: white;
            padding: 30px 40px 20px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          
          .spid-logo {
            display: flex;
            align-items: center;
          }
          
          .spid-logo-img {
            height: 50px;
            width: auto;
          }
          
          .spid-dot {
            width: 8px;
            height: 8px;
            background: #0066CC;
            border-radius: 50%;
            margin-bottom: 12px;
          }
          
          .provider-badge {
            display: flex;
            align-items: center;
          }
          
          .provider-logo {
            height: 40px;
            width: auto;
          }
          
          .login-body {
            padding: 20px 40px 40px;
          }
          
          .form-title {
            font-size: 14px;
            color: #666;
            margin-bottom: 8px;
            font-weight: 400;
          }
          
          .form-subtitle {
            font-size: 22px;
            color: #333;
            margin-bottom: 30px;
            font-weight: 600;
          }
          
          .form-group {
            margin-bottom: 20px;
          }
          
          .form-label {
            display: block;
            font-size: 11px;
            font-weight: 600;
            color: #999;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .form-input {
            width: 100%;
            padding: 12px 14px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 15px;
            font-family: inherit;
            background: white;
            transition: border-color 0.2s;
          }
          
          .form-input:focus {
            outline: none;
            border-color: #0066CC;
            box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
          }
          
          .form-input::placeholder {
            color: #bbb;
            font-style: italic;
          }
          
          .forgot-link {
            display: inline-block;
            margin-top: 12px;
            font-size: 13px;
            color: #0066CC;
            text-decoration: none;
            font-weight: 500;
          }
          
          .forgot-link:hover {
            text-decoration: underline;
          }
          
          .button-group {
            display: flex;
            gap: 12px;
            margin-top: 30px;
          }
          
          .btn {
            padding: 14px 28px;
            border-radius: 24px;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
            font-family: inherit;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .btn-cancel {
            background: white;
            color: #666;
            border: 2px solid #ddd;
            flex: 1;
          }
          
          .btn-cancel:hover {
            background: #f5f5f5;
            border-color: #999;
          }
          
          .btn-submit {
            background: #0066CC;
            color: white;
            border: 2px solid #0066CC;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }
          
          .btn-submit:hover {
            background: #0052A3;
            border-color: #0052A3;
          }
          
          .btn-submit:active {
            transform: scale(0.98);
          }
          
          .spid-icon {
            width: 20px;
            height: 20px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: #0066CC;
            font-weight: 700;
          }
          
          .register-link {
            margin-top: 30px;
            text-align: center;
            font-size: 13px;
            color: #666;
          }
          
          .register-link a {
            color: #0066CC;
            text-decoration: none;
            font-weight: 600;
          }
          
          .register-link a:hover {
            text-decoration: underline;
          }
          
          .readonly-note {
            font-size: 11px;
            color: #999;
            margin-top: 20px;
            padding: 10px;
            background: #f9f9f9;
            border-radius: 4px;
            text-align: center;
          }
          
          @media (max-width: 640px) {
            .login-header {
              padding: 20px 25px 15px;
            }
            .login-body {
              padding: 15px 25px 30px;
            }
            .button-group {
              flex-direction: column;
            }
          }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300;400;600;700&display=swap" rel="stylesheet">
      </head>
      <body>
        <div class="login-container">
          <div class="login-header">
            <div class="spid-logo">
              <img src="${targetFrontendUrl}/spid.png" alt="SPID Logo" class="spid-logo-img" />
            </div>
            <div class="provider-badge">
              <img src="${targetFrontendUrl}/logoposteid.png" alt="PosteID Logo" class="provider-logo" />
            </div>
          </div>
          
          <div class="login-body">
            <div class="form-title">Richiesta di accesso SPID 2 da</div>
            <div class="form-subtitle">SINTONIA</div>
            
            <form action="/spid-auth/callback" method="POST">
              <input type="hidden" name="frontendUrl" value="${targetFrontendUrl}">
              <input type="hidden" name="userType" value="${targetUserType}">
              
              <div class="form-group">
                <label class="form-label" for="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  class="form-input" 
                  placeholder="inserisci e-mail"
                  required
                  autocomplete="email"
                >
              </div>
              
              <div class="form-group">
                <label class="form-label" for="password">Password</label>
                <div class="password-wrapper" style="position: relative;">
                  <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    class="form-input" 
                    style="padding-right: 45px;"
                    placeholder="inserisci password"
                    required
                    autocomplete="current-password"
                  >
                  <button type="button" class="password-toggle" onclick="togglePassword()" style="
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  ">
                    <svg id="eye-icon" viewBox="0 0 24 24" width="20" height="20" fill="#999">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                    <svg id="eye-off-icon" viewBox="0 0 24 24" width="20" height="20" fill="#999" style="display: none;">
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <script>
                function togglePassword() {
                  const passwordInput = document.getElementById('password');
                  const eyeIcon = document.getElementById('eye-icon');
                  const eyeOffIcon = document.getElementById('eye-off-icon');
                  
                  if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    eyeIcon.style.display = 'none';
                    eyeOffIcon.style.display = 'block';
                  } else {
                    passwordInput.type = 'password';
                    eyeIcon.style.display = 'block';
                    eyeOffIcon.style.display = 'none';
                  }
                }
              </script>
              
              <div class="button-group">
                <button type="button" class="btn btn-cancel" onclick="window.history.back()">Annulla</button>
                <button type="submit" class="btn btn-submit">
                  <span class="spid-icon">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="#0066CC">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </span>
                  Entra con SPID
                </button>
              </div>
            </form>
            
            <div class="register-link">
              Non hai ancora SPID? <a href="#">Registrati</a>
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
    const email = body.email;
    const password = body.password;

    try {
      // Simuliamo un ritardo di autenticazione realistico
      await new Promise(resolve => setTimeout(resolve, 1200));

      let user;
      let tokenData;

      if (userType === 'psychologist') {
        // Per psicologi, usiamo email/password mock
        if (!email) {
          throw new Error('Email richiesta per il login');
        }

        user = await this.spidAuthService.authenticatePsychologistWithMockCredentials(email, password);

        if (!user) {
          throw new Error('Credenziali non valide. Verifica email e password.');
        }

        console.log(`✓ Autenticazione mock psicologo completata per: ${user.email}`);
        tokenData = await this.spidAuthService.generateToken(user, 'psychologist');
      } else {
        // Per pazienti, usiamo email/password mock
        if (!email) {
          throw new Error('Email richiesta per il login');
        }

        // Autentica con credenziali mock
        user = await this.spidAuthService.authenticateWithMockCredentials(email, password);

        if (!user) {
          throw new Error('Credenziali non valide. Verifica email e password.');
        }

        console.log(`✓ Autenticazione mock completata per: ${user.email} (${userType})`);

        // Check if patient already has an assigned psychologist
        if (user.idPsicologo) {
          console.warn(`Access denied for patient ${user.codFiscale}: already assigned to psychologist ${user.idPsicologo}`);
          const errorMessage = 'Accesso negato: Sei già in cura con uno psicologo assegnato.';
          return res.redirect(`${frontendUrl}/spid-error?message=` + encodeURIComponent(errorMessage));
        }

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
