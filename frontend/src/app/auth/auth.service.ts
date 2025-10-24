import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {jwtDecode} from 'jwt-decode';
// import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8600/api';
  // constructor(
  //   public jwtHelper: JwtHelperService
  // ) {}
  // ...
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    // Check whether the token is expired and return
    // true or false
    if (token) return true;
    else return false;
    // return !this.jwtHelper.isTokenExpired(token);
  }

  constructor(private http: HttpClient) {}

  requestOtp(mobile?: string, email?: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/request-otp`, { mobile, email });
  }

  verifyOtp(mobile?: string, email?: string, otp?: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify-otp`, { mobile, email, otp });
  }

  refreshToken(refreshToken: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/refresh-token`, { refreshToken });
  }

  // refreshAccessToken() {
  //   const refreshToken = localStorage.getItem('refreshToken');
  //   return this.http
  //     .post<{ accessToken: string; refreshToken: string }>(
  //       `${this.baseUrl}/refresh-token`,
  //       { refreshToken }
  //     )
  //     .pipe(
  //       tap((tokens) =>
  //         this.storeTokens(tokens.accessToken, tokens.refreshToken)
  //       )
  //     );
  // }

  storeTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  getDecodedToken() {
    const token = localStorage.getItem('accessToken');
    if (token) return jwtDecode<any>(token);
    return null;
  }

  getRole(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.role || null;
  }

  getEmail(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.email || null;
  }

  getMobile(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.mobile || null;
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}
