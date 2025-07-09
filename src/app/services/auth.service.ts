import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { BASE_URL } from '../app.config';
import { map, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { IS_ANONYMOUS } from '../auth.interceptor';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private http: HttpClient,
    @Inject(BASE_URL) private baseUrl: string
  ) {}

  login(credentials: { username: string; password: string }) {
    return this.http
      .post<{ fullname: string; accessToken: string; redirect: string }>(
        `${this.baseUrl}/auth/login`,
        credentials,
        {
          context: new HttpContext().set(IS_ANONYMOUS, true),
          withCredentials: true,
        }
      )
      .pipe(
        tap((response) => {
          localStorage.setItem('access_token', response.accessToken);
        })
      );
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }
  refreshToken(): Observable<string> {
    return this.http
      .post<{ access_token: string }>(
        `${this.baseUrl}/auth/refresh`,
        {},
        { withCredentials: true }
      )
      .pipe(map((response) => response.access_token));
  }
  logout() {
    return this.http
      .post(`${this.baseUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          localStorage.removeItem('access_token');
        })
      );
  }
  getRoleFromAPI() {
    const token = localStorage.getItem('access_token');
    return this.http.post<{ role: number }>(
      `${this.baseUrl}/auth/role`,
      {},
      {
        context: new HttpContext().set(IS_ANONYMOUS, true),
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
  getRoleFromToken(): string | null {
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    try {
      const decoded = jwtDecode<{
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
      }>(token);
      return decoded[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ];
    } catch (e) {
      console.error('Invalid JWT token', e);
      return null;
    }
  }
}
