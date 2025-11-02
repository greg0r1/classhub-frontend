import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isTokenValid() && authService.isAuthenticated()) {
    return true;
  }

  authService.logout();
  return false;
};

/**
 * Factory pour créer un guard de rôle
 *
 * @example
 * ```typescript
 * {
 *   path: 'admin',
 *   canActivate: [authGuard, roleGuard(['admin'])],
 *   component: AdminComponent
 * }
 * ```
 */
export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const currentUser = authService.currentUser();

    if (!currentUser) {
      router.navigate(['/auth/login']);
      return false;
    }

    if (allowedRoles.includes(currentUser.role)) {
      return true;
    }

    // Accès refusé : rediriger vers le dashboard
    router.navigate(['/app/dashboard']);
    return false;
  };
};

// Helpers pré-configurés
export const adminGuard: CanActivateFn = roleGuard(['admin']);
export const coachGuard: CanActivateFn = roleGuard(['admin', 'coach']);
