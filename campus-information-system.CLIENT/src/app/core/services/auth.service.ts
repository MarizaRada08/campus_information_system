import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IAuthPayload, IAuthResponse } from '../interfaces/authInterface';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _userService = inject(UserService);

  private _storedEmail: string | null = null;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor() {}

  // Helper method to check for token
  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

  get isAuthenticated$() {
    return this.isAuthenticatedSubject.asObservable();
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getStoredEmail(): string | null {
    return this._storedEmail;
  }

  clearStoredEmail(): void {
    this._storedEmail = null;
  }

  login(payload: IAuthPayload): Observable<IAuthResponse> {
    return this._httpClient.post<IAuthResponse>(
      `${environment.api}/login`, payload
    ).pipe(
      tap((response: IAuthResponse) => {
        this._userService.setUser(response.user);
        this._storedEmail = payload.email;

        localStorage.setItem('access_token', response.accessToken);
        localStorage.setItem('refresh_token', response.refreshToken);

        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  register(payload: IAuthPayload): Observable<{ message: string }> {
    return this._httpClient.post<{ message: string }>(
      `${environment.api}/register`, payload
    ).pipe(
      tap(() => {
        this._storedEmail = payload.email;
        // Don't store any tokens here
      })
    );
  }
  
  verifyOTP(payload: IAuthPayload): Observable<IAuthResponse> {
    return this._httpClient.post<IAuthResponse>(
      `${environment.api}/verify-otp`, payload
    ).pipe(
      tap((response: IAuthResponse) => {
        this._userService.setUser(response.user);
        localStorage.setItem('access_token', response.accessToken);
        localStorage.setItem('refresh_token', response.refreshToken);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }
  

  resendOTP(payload: IAuthPayload): Observable<IAuthResponse> {
    return this._httpClient.post<IAuthResponse>(
      `${environment.api}/resend-otp`, payload
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    this.clearStoredEmail();
    this._userService.clearUser();

    this.isAuthenticatedSubject.next(false);
  }

  getPosts(): Observable<any> {
    return this._httpClient.get(environment.api);
  }
}
