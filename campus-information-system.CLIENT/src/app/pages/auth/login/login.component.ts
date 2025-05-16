import { Component, HostListener, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { IAuthPayload, IAuthResponse } from '../../../core/interfaces/authInterface';
import { Router } from '@angular/router';

export interface ILoginForm extends FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
}>{}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnDestroy {
  private readonly _authService = inject(AuthService);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  private _unsubscribeAll = new Subject<any>();
  loginForm: ILoginForm

  constructor() {
    this.loginForm = this._formBuilder.group({
      email: ['',[Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    }) as ILoginForm;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  onSubmit() {
    const loginPayload = this.loginForm.value as IAuthPayload;

  this._authService
  .login(loginPayload)
  .pipe(takeUntil(this._unsubscribeAll))
  .subscribe((response: IAuthResponse) => {
   const { accessToken, refreshToken } = response;


   if (accessToken && refreshToken) {
     localStorage.setItem('access_token', accessToken);
     localStorage.setItem('refresh_token', refreshToken);
     
     this.router.navigate(['pages/dashboard']);
     return
    }

    //TODO: Show error message
  });
  }
}
