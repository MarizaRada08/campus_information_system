import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { IAuthPayload, IAuthResponse } from '../../../core/interfaces/authInterface';
import { Router } from '@angular/router';

export interface IRegisterForm extends FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
}>{}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnDestroy {
  private readonly _authService = inject(AuthService);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  private _unsubscribeAll = new Subject<any>();
  registerForm: IRegisterForm;

  constructor() {
    this.registerForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    }) as IRegisterForm;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
    
    const registerPayload = this.registerForm.value as IAuthPayload;
    
    this._authService
    .register(registerPayload)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe({
      next: () => {
        this.router.navigate(['auth/verify-otp'], {
          state: { email: this.registerForm.value.email }
        });
      },
      error: (error) => {
        // TODO: Show error message
        console.error('Registration failed:', error);
      }
    });
  
  }
}
