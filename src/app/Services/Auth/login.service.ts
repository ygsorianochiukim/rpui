import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, from, BehaviorSubject, throwError } from 'rxjs';
import { switchMap, mapTo, tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { Storage } from '@ionic/storage-angular';
import { User } from 'src/app/Models/User/user.model';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = `${environment.apiUrl}`;
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticated.asObservable();

  setAuthState(state: boolean) {
    this.isAuthenticated.next(state);
  }
  constructor(private http: HttpClient, private storage: Storage, private router: Router, private ToastController: ToastController) {
    this.init();
  }
  private async showToast(message: string) {

    const toast = await this.ToastController.create({
      message,
      duration: 3000,
      color: 'warning',
      position: 'top'
    });
    await toast.present();
  }

  private async init() {
    await this.storage.create();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password }).pipe(
      switchMap((res: any) => {
        const tasks: Promise<any>[] = [];

        if (res.access_token) {
          tasks.push(this.storage.set('token', res.access_token));
        }
        if (res.user) {
          tasks.push(this.storage.set('User', res.user));
        }

        return from(Promise.all(tasks)).pipe(
          tap(() => this.setAuthState(true)),
          mapTo(res)
        );
      })
    );
  }
  private handleAuthError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      // use the backend’s custom message if available
      const message = 'You have been logged out. Please log in again.';
      this.showToast(message);

      this.storage.clear().then(() => {
        this.setAuthState(false);
        this.router.navigate(['/login']);
      });
    }
    return throwError(() => error);
  }

  getUserFromAPI(): Observable<any> {
    return from(this.storage.get('token')).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.get(`${this.apiUrl}/me`, { headers }).pipe(
          catchError(err => this.handleAuthError(err))
        );
      })
    );
  }


  async getToken(): Promise<string | null> {
    return this.storage.get('token');
  }

  getUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }

  async loadAuthState() {
    const token = await this.storage.get('token');
    this.setAuthState(!!token);
  }

  logout(): Observable<any> {
    return from(this.storage.get('token')).pipe(
      switchMap(token => {
        if (!token) {
          return from(this.storage.clear());
        }
        return this.http.post(
          `${this.apiUrl}/logout`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        ).pipe(
          switchMap(() => from(this.storage.clear()))
        );
      })
    );
  }

  changePassword(userId: number, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/userAccount/password/${userId}`, {password: password});
  }
}
