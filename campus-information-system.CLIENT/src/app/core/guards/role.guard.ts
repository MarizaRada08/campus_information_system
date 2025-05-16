import { CanActivateChildFn, CanActivateFn } from '@angular/router';

export const roleGuard: CanActivateFn | CanActivateChildFn= (route, state) => {
  return true;
};
