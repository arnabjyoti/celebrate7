import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, switchMap, catchError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.authService.getAccessToken();

    let authReq = req;
    if (accessToken) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403 && this.authService.getRefreshToken()) {
          return this.authService.refreshToken(this.authService.getRefreshToken()!).pipe(
            switchMap((tokens) => {
              this.authService.storeTokens(tokens.accessToken, tokens.refreshToken);
              const cloned = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${tokens.accessToken}`),
              });
              return next.handle(cloned);
            }),
            catchError(() => {
              this.authService.logout();
              this.router.navigate(['/login']);
              return throwError(() => new Error('Session expired'));
            })
          );
        } else {
          return throwError(() => error);
        }
      })
    );
  }
}
