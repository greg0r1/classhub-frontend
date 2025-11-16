import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  // Redirection par défaut
  {
    path: '',
    redirectTo: '/auth',
    pathMatch: 'full',
  },

  // Routes d'authentification (publiques)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },

  // Routes protégées (nécessitent authentification)
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        title: 'Tableau de bord - ClassHub',
      },
      {
        path: 'courses',
        loadChildren: () =>
          import('./features/courses/courses.routes').then((m) => m.coursesRoutes),
      },
      // Les autres routes seront ajoutées progressivement
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },

  // Route 404
  {
    path: '**',
    redirectTo: '/auth/login',
  },
];
