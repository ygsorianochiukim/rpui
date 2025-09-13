import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { LoginService } from './login.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private loginService: LoginService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.loginService.getToken()).pipe(
      switchMap(token => {
        let authReq = req;
        if (token) {
          authReq = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
          });
        }

        return next.handle(authReq).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              return this.loginService['handleAuthError'](error);
            }
            return throwError(() => error);
          })
        );
      })
    );
  }
}
