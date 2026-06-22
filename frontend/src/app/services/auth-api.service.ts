import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface LoginResponse {
  requiresMfa: boolean;
  mfaEnabled: boolean;
  challengeToken: string;
}

export interface MfaSetupResponse {
  otpauthUrl: string;
  secret: string;
}

export interface SessionResponse {
  accessToken: string;
  refreshToken: string;
  expiresInMinutes: number;
}

export interface AuthMeResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  mfaEnabled: boolean;
  isActive: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private readonly baseUrl = 'https://backend-production-d070.up.railway.app';

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, { email, password });
  }

  setupMfa(challengeToken: string): Observable<MfaSetupResponse> {
    return this.http.post<MfaSetupResponse>(`${this.baseUrl}/auth/mfa/setup`, { challengeToken });
  }

  enableMfa(challengeToken: string, code: string): Observable<SessionResponse> {
    return this.http.post<SessionResponse>(`${this.baseUrl}/auth/mfa/enable`, { challengeToken, code });
  }

  verifyMfa(challengeToken: string, code: string): Observable<SessionResponse> {
    return this.http.post<SessionResponse>(`${this.baseUrl}/auth/mfa/verify`, { challengeToken, code });
  }

  logout(refreshToken: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/auth/logout`, { refreshToken });
  }

  me(accessToken: string): Observable<AuthMeResponse> {
    return this.http.get<AuthMeResponse>(`${this.baseUrl}/auth/me`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${accessToken}`
      })
    });
  }
}
