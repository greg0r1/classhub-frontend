import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const coursesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./course-list/course-list.component').then((m) => m.CourseListComponent),
    title: 'Liste des cours - ClassHub',
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./course-detail/course-detail.component').then((m) => m.CourseDetailComponent),
    title: 'Détail du cours - ClassHub',
  },
  {
    path: 'new',
    canActivate: [authGuard], // Protégé pour coach/admin (à affiner avec role guard)
    loadComponent: () =>
      import('./course-form/course-form.component').then((m) => m.CourseFormComponent),
    title: 'Créer un cours - ClassHub',
  },
  {
    path: ':id/edit',
    canActivate: [authGuard], // Protégé pour coach/admin
    loadComponent: () =>
      import('./course-form/course-form.component').then((m) => m.CourseFormComponent),
    title: 'Modifier le cours - ClassHub',
  },
];
