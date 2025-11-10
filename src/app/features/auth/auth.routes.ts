import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/landing/landing.component').then((m) => m.LandingComponent),
    title: 'Bienvenue - ClassHub',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then((m) => m.LoginComponent),
    title: 'Connexion - ClassHub',
  },
  {
    path: 'signup/organization',
    loadComponent: () =>
      import('./components/signup-organization/signup-organization.component').then(
        (m) => m.SignupOrganizationComponent
      ),
    title: 'Créer mon club - ClassHub',
  },
  {
    path: 'signup/member',
    loadComponent: () =>
      import('./components/signup-member/signup-member.component').then(
        (m) => m.SignupMemberComponent
      ),
    title: 'Rejoindre mon club - ClassHub',
  },
  // Legacy route - redirect to new organization signup
  {
    path: 'register',
    redirectTo: 'signup/organization',
    pathMatch: 'full',
  },
];
