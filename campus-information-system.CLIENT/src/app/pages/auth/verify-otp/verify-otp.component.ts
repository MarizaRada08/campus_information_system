import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Subject, interval, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { IAuthPayload } from 'src/app/core/interfaces/authInterface';

export interface IVerifyOtpForm extends FormGroup<{
  email: FormControl<string>;
  otp: FormControl<string>;
}>{}

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.scss'
})
export class VerifyOtpComponent implements OnDestroy {
  private readonly _authService = inject(AuthService);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);

  private _unsubscribeAll = new Subject<void>();
  verifyOtpForm: IVerifyOtpForm;
  isSubmitting = false;
  isResending = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  resendCooldown = 0; 
  minutes: number = 1;
  seconds: number = 0;
  cooldownInterval: any;

  constructor() {
    const emailFromParams = this._route.snapshot.queryParamMap.get('email') || this._authService.getStoredEmail() || '';

    this.verifyOtpForm = this._formBuilder.group({
      email: [{ value: emailFromParams, disabled: true }, [Validators.required, Validators.email]],
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    }) as IVerifyOtpForm;

    this.startResendCooldown();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
    }
  }

  onSubmit() {
    if (this.verifyOtpForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    const verifyOtpPayload = {
      email: this.verifyOtpForm.controls.email.value,
      otp: this.verifyOtpForm.controls.otp.value,
    } as IAuthPayload;

    this._authService
      .verifyOTP(verifyOtpPayload)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this._router.navigate(['pages/student-registration-form']);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.message || 'Failed to verify OTP.';
        }
      });
  }

  resendOTP() {
    if (this.isResending || this.resendCooldown > 0) {
      return;
    }

    this.isResending = true;
    this.errorMessage = null;
    this.successMessage = null;

    const resendPayload = { email: this.verifyOtpForm.controls.email.value } as IAuthPayload;

    this._authService
      .resendOTP(resendPayload)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this.isResending = false;
          this.successMessage = 'OTP has been resent successfully.';
          this.startResendCooldown();
        },
        error: (err) => {
          this.isResending = false;
          this.errorMessage = err.error?.message || 'Failed to resend OTP.';
        }
      });
  }

  private startResendCooldown() {
    this.resendCooldown = 60; // 1 minute cooldown
    this.minutes = Math.floor(this.resendCooldown / 60);
    this.seconds = this.resendCooldown % 60;

    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
    }

    this.cooldownInterval = setInterval(() => {
      if (this.resendCooldown > 0) {
        this.resendCooldown--;
        this.minutes = Math.floor(this.resendCooldown / 60);
        this.seconds = this.resendCooldown % 60;
      } else {
        clearInterval(this.cooldownInterval);
      }
    }, 1000);
  }
}
