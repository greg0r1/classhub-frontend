import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then((m) => m.LoginComponent),
    title: 'Connexion - ClassHub',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component').then((m) => m.RegisterComponent),
    title: 'Inscription - ClassHub',
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
