import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');

  if (!token) {
  router.navigate(['/auth/login']);
  return false;
  }

  //TODO: Check if token is expired

  //simulate deny access to settings page
  //if(route.url.some((segment) => segment.path === 'settings')) {
  //  router.navigate(['/error/404']);
  //  return false;
  //}
  

  //proceed to the requested page
  return true;
};
