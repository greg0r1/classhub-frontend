import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Une erreur est survenue';

      if (error.error instanceof ErrorEvent) {
        // Erreur côté client
        errorMessage = `Erreur: ${error.error.message}`;
      } else {
        // Erreur côté serveur
        switch (error.status) {
          case 400:
            errorMessage = 'Données invalides';
            break;
          case 403:
            errorMessage = 'Accès interdit';
            break;
          case 404:
            errorMessage = 'Ressource introuvable';
            break;
          case 500:
            errorMessage = 'Erreur serveur';
            break;
          default:
            errorMessage = error.error?.message || errorMessage;
        }
      }

      // Afficher l'erreur dans la console (sauf 401 géré par authInterceptor)
      if (error.status !== 401) {
        console.error(`[HTTP Error ${error.status}]`, errorMessage);
        // TODO: Ajouter MatSnackBar après avoir configuré Angular Material
        // const snackBar = inject(MatSnackBar);
        // snackBar.open(errorMessage, 'Fermer', {
        //   duration: 5000,
        //   horizontalPosition: 'end',
        //   verticalPosition: 'top',
        //   panelClass: ['error-snackbar'],
        // });
      }

      return throwError(() => error);
    })
  );
};
