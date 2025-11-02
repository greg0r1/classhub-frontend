import { Routes } from '@angular/router';
import { authGuard, adminGuard, coachGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Routes publiques
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },

  // Routes protégées
  {
    path: 'app',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'organizations',
        canActivate: [adminGuard],
        loadChildren: () =>
          import('./features/organizations/organizations.routes').then(m => m.ORGANIZATIONS_ROUTES),
      },
      {
        path: 'users',
        canActivate: [adminGuard],
        loadChildren: () =>
          import('./features/users/users.routes').then(m => m.USERS_ROUTES),
      },
      {
        path: 'courses',
        canActivate: [coachGuard],
        loadChildren: () =>
          import('./features/courses/courses.routes').then(m => m.COURSES_ROUTES),
      },
      {
        path: 'attendances',
        loadChildren: () =>
          import('./features/attendances/attendances.routes').then(m => m.ATTENDANCES_ROUTES),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },

  // 404
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
