import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');

  if (token) {
    // If logged in, redirect to dashboard
    router.navigate(['pages/dashboard']);
    return false;
  }

  // Allow access to login/register
  return true;
};
