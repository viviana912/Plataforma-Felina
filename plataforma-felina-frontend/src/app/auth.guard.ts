import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Cargamos sesión por si se ha refrescado la página
  authService.checkSession();

  const user = authService.user();

  // Si es ADMIN
  if (user && user.rol?.nombre === 'ADMIN') {
    return true;
  }

  // Si no es ADMIN (o no está logueado), se manda a login
  router.navigate(['/login']);
  return false;
};

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Cargamos sesión por si se ha refrescado la página
  authService.checkSession();

  // Si hay usuario logueado (cualquier rol), pasa
  if (authService.isLoggedIn()) {
    return true;
  }

  // Si no está logueado, a login
  router.navigate(['/login']);
  return false;
};
