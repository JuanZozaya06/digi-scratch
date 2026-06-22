import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as QRCode from 'qrcode';
import { AuthApiService, AuthMeResponse, SessionResponse } from '../services/auth-api.service';

type AccessMode = 'admin' | 'stand';
type LoginStage = 'credentials' | 'setup' | 'verify' | 'success';

interface SessionViewModel {
  accessToken: string;
  refreshToken: string;
  expiresInMinutes: number;
  me: AuthMeResponse;
}

@Component({
  selector: 'app-internal-login',
  templateUrl: './internal-login.component.html',
  styleUrls: ['./internal-login.component.scss']
})
export class InternalLoginComponent implements OnInit {
  loginForm: FormGroup;
  mode: AccessMode = 'admin';
  stage: LoginStage = 'credentials';
  title = '';
  subtitle = '';
  helper = '';
  challengeToken = '';
  mfaSecret = '';
  otpauthUrl = '';
  qrCodeDataUrl = '';
  isSubmitting = false;
  feedbackMessage = '';
  errorMessage = '';
  session: SessionViewModel | null = null;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly authApi: AuthApiService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['juanzozaya06@gmail.com', [Validators.required, Validators.email]],
      password: ['Miclave1.', [Validators.required]],
      mfaCode: ['', [Validators.pattern(/^\d{6}$/)]]
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.mode = (data['mode'] as AccessMode | undefined) || 'admin';
      this.applyCopy();
      this.restoreSession();
    });
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.stage === 'credentials') {
      if (this.loginForm.get('email')?.invalid || this.loginForm.get('password')?.invalid) {
        this.loginForm.get('email')?.markAsTouched();
        this.loginForm.get('password')?.markAsTouched();
        return;
      }

      this.submitCredentials();
      return;
    }

    if (this.loginForm.get('mfaCode')?.invalid || !this.loginForm.get('mfaCode')?.value) {
      this.loginForm.get('mfaCode')?.markAsTouched();
      return;
    }

    if (this.stage === 'setup') {
      this.enableMfa();
      return;
    }

    if (this.stage === 'verify') {
      this.verifyMfa();
    }
  }

  hasError(controlName: string, errorName?: string): boolean {
    const control = this.loginForm.get(controlName);

    if (!control || !control.touched) {
      return false;
    }

    if (!errorName) {
      return control.invalid;
    }

    return control.hasError(errorName);
  }

  get submitLabel(): string {
    if (this.isSubmitting) {
      return 'Procesando...';
    }

    if (this.stage === 'setup') {
      return 'Activar MFA';
    }

    if (this.stage === 'verify') {
      return 'Verificar MFA';
    }

    return `Entrar a ${this.mode === 'admin' ? 'admin' : 'stand'}`;
  }

  logout(): void {
    if (!this.session) {
      this.clearSession();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.feedbackMessage = 'Cerrando sesion...';

    this.authApi.logout(this.session.refreshToken).subscribe({
      next: () => {
        this.clearSession();
        this.feedbackMessage = 'Sesion cerrada correctamente.';
        this.isSubmitting = false;
      },
      error: () => {
        this.clearSession();
        this.feedbackMessage = 'La sesion local se cerro. El cierre remoto no pudo confirmarse.';
        this.isSubmitting = false;
      }
    });
  }

  private submitCredentials(): void {
    this.isSubmitting = true;
    this.feedbackMessage = 'Validando credenciales...';

    const email = this.loginForm.get('email')?.value as string;
    const password = this.loginForm.get('password')?.value as string;

    this.authApi.login(email, password).subscribe({
      next: (response) => {
        this.challengeToken = response.challengeToken;
        this.loginForm.get('mfaCode')?.reset('');

        if (response.mfaEnabled) {
          this.stage = 'verify';
          this.feedbackMessage = 'Credenciales validadas. Ingresa tu codigo MFA para continuar.';
          this.isSubmitting = false;
          return;
        }

        this.feedbackMessage = 'Tu usuario aun no tiene MFA activo. Vamos a configurarlo.';
        this.authApi.setupMfa(response.challengeToken).subscribe({
          next: (setup) => {
            this.stage = 'setup';
            this.mfaSecret = setup.secret;
            this.otpauthUrl = setup.otpauthUrl;
            this.qrCodeDataUrl = '';
            this.feedbackMessage = 'Escanea el codigo en tu app autenticadora y luego ingresa el codigo MFA.';
            this.renderQrCode();
          },
          error: (error) => this.handleError(error)
        });
      },
      error: (error) => this.handleError(error)
    });
  }

  private enableMfa(): void {
    this.isSubmitting = true;
    this.feedbackMessage = 'Activando MFA...';

    this.authApi.enableMfa(this.challengeToken, this.loginForm.get('mfaCode')?.value as string).subscribe({
      next: (session) => this.finalizeSession(session),
      error: (error) => this.handleError(error)
    });
  }

  private verifyMfa(): void {
    this.isSubmitting = true;
    this.feedbackMessage = 'Verificando MFA...';

    this.authApi.verifyMfa(this.challengeToken, this.loginForm.get('mfaCode')?.value as string).subscribe({
      next: (session) => this.finalizeSession(session),
      error: (error) => this.handleError(error)
    });
  }

  private finalizeSession(session: SessionResponse): void {
    this.authApi.me(session.accessToken).subscribe({
      next: (me) => {
        this.stage = 'success';
        this.isSubmitting = false;
        this.feedbackMessage = 'Sesion iniciada correctamente.';
        this.session = {
          ...session,
          me
        };

        localStorage.setItem(
          this.sessionStorageKey,
          JSON.stringify({
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
            me
          })
        );
      },
      error: (error) => this.handleError(error)
    });
  }

  private handleError(error: unknown): void {
    this.isSubmitting = false;
    this.session = null;

    if (error instanceof HttpErrorResponse) {
      const apiMessage = error.error?.error?.message as string | undefined;
      this.errorMessage = apiMessage || 'No se pudo completar la solicitud.';
      this.feedbackMessage = '';
      return;
    }

    this.errorMessage = 'Ocurrio un error inesperado.';
    this.feedbackMessage = '';
  }

  private renderQrCode(): void {
    QRCode.toDataURL(this.otpauthUrl, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 220
    })
      .then((dataUrl: string) => {
        this.qrCodeDataUrl = dataUrl;
        this.isSubmitting = false;
      })
      .catch(() => {
        this.qrCodeDataUrl = '';
        this.isSubmitting = false;
        this.errorMessage = 'No se pudo generar el codigo QR. Usa el secret manual.';
      });
  }

  private restoreSession(): void {
    const rawSession = localStorage.getItem(this.sessionStorageKey);

    if (!rawSession) {
      return;
    }

    try {
      const parsed = JSON.parse(rawSession) as {
        accessToken: string;
        refreshToken: string;
        me: AuthMeResponse;
      };

      this.session = {
        accessToken: parsed.accessToken,
        refreshToken: parsed.refreshToken,
        expiresInMinutes: 0,
        me: parsed.me
      };
      this.stage = 'success';
      this.feedbackMessage = 'Sesion restaurada desde este dispositivo.';
      this.errorMessage = '';
    } catch {
      localStorage.removeItem(this.sessionStorageKey);
    }
  }

  private clearSession(): void {
    this.stage = 'credentials';
    this.session = null;
    this.challengeToken = '';
    this.mfaSecret = '';
    this.otpauthUrl = '';
    this.qrCodeDataUrl = '';
    this.loginForm.get('mfaCode')?.reset('');
    localStorage.removeItem(this.sessionStorageKey);
  }

  private get sessionStorageKey(): string {
    return `digi-scratch-${this.mode}-session`;
  }

  private applyCopy(): void {
    if (this.mode === 'stand') {
      this.title = 'Acceso de stand';
      this.subtitle = 'Valida ganadores y registra canjes con un usuario interno autenticado.';
      this.helper = 'Este acceso usa el backend real con login y MFA.';
      return;
    }

    this.title = 'Acceso administrativo';
    this.subtitle = 'Gestiona eventos, premios, inventario y auditoria desde el portal interno.';
    this.helper = 'Este acceso usa el backend real con login y MFA.';
  }
}
