# Guide de Démarrage Frontend - ClassHub

**Version** : 2.0  
**Date** : 16 novembre 2025  
**Stack** : Angular 20.3 + TypeScript 5.8 + Material 20.2  
**Backend** : NestJS (terminé, 49 endpoints)

---

## 📋 Vue d'Ensemble

Ce guide vous accompagne dans la configuration initiale du projet frontend ClassHub. Il couvre toutes les étapes nécessaires pour mettre en place un environnement de développement fonctionnel et intégré avec le backend NestJS.

### Prérequis Système

Avant de commencer, assurez-vous que votre environnement dispose des éléments suivants :

**Node.js** version 18 ou supérieure est requis pour exécuter Angular 20. Vous pouvez vérifier votre version avec la commande `node --version`.

**npm** version 9 ou supérieure est nécessaire pour gérer les dépendances. Vérifiez avec `npm --version`.

**Git** doit être installé pour le contrôle de version.

**Visual Studio Code** est l'éditeur recommandé avec les extensions Angular Language Service et ESLint.

Le **backend ClassHub API** doit être cloné et fonctionnel sur localhost:3000.

### Architecture Technique

L'application suit une architecture moderne basée sur les dernières fonctionnalités Angular. Elle utilise des **Standalone Components** sans NgModules, la **gestion d'état avec Signals** natifs Angular, le **nouveau control flow** (@if, @for, @switch), des **guards et interceptors fonctionnels**, et la **OnPush change detection** par défaut pour optimiser les performances.

Le système d'authentification repose sur **JWT avec stockage localStorage** et une **auto-hydratation au démarrage de l'application**. L'architecture est **multi-tenant** avec isolation automatique des données par organisation.

Le **client API TypeScript** est généré automatiquement depuis le Swagger backend, garantissant une synchronisation parfaite entre frontend et backend.

---

## Étape 1 : Initialisation du Projet

Si le projet n'est pas encore créé, initialisez-le avec Angular CLI. Sinon, passez directement à l'étape 2.

### Création du Projet Angular

Exécutez les commandes suivantes pour créer le projet :

```bash
ng new classhub-frontend --routing --style=scss --strict
cd classhub-frontend
```

Lors de la création, répondez aux questions de configuration en activant le routing Angular et en choisissant SCSS comme préprocesseur de styles.

### Configuration angular.json

Le fichier `angular.json` doit être configuré pour optimiser les builds de production. Vérifiez que la section `configurations.production` contient les paramètres suivants :

```json
{
  "projects": {
    "classhub-frontend": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "namedChunks": false,
              "extractLicenses": true,
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kB",
                  "maximumError": "1MB"
                }
              ]
            }
          }
        }
      }
    }
  }
}
```

---

## Étape 2 : Configuration des Environnements

Les fichiers d'environnement permettent de gérer différentes configurations entre développement et production.

### Création des Fichiers d'Environnement

Créez le dossier environments s'il n'existe pas :

```bash
mkdir -p src/environments
```

Créez le fichier `src/environments/environment.ts` pour le développement :

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  jwtKey: 'access_token',
  apiTimeout: 30000,
  enableDevTools: true
};
```

Créez le fichier `src/environments/environment.prod.ts` pour la production :

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.classhub.com',
  jwtKey: 'access_token',
  apiTimeout: 30000,
  enableDevTools: false
};
```

### Configuration du File Replacement

Dans `angular.json`, ajoutez la configuration de remplacement des fichiers pour la production :

```json
{
  "configurations": {
    "production": {
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.prod.ts"
        }
      ]
    }
  }
}
```

---

## Étape 3 : Installation d'Angular Material

Angular Material fournit les composants UI de base de l'application.

### Installation

Exécutez la commande suivante :

```bash
ng add @angular/material
```

Lors de l'installation, choisissez les options suivantes :

**Theme** : Sélectionnez "Indigo/Pink" ou un thème personnalisé selon vos préférences.

**Global typography** : Répondez "Yes" pour activer la typographie Material globale.

**Animations** : Répondez "Yes" pour activer les animations Material.

Cette commande configure automatiquement Angular Material dans votre projet en ajoutant les imports nécessaires dans `app.config.ts` et en créant un fichier de thème personnalisé.

---

## Étape 4 : Installation des Dépendances

Installez toutes les dépendances nécessaires pour le projet.

### Librairies de Production

Installez les librairies suivantes qui seront utilisées dans l'application :

```bash
# Gestion des dates
npm install date-fns

# Graphiques pour le dashboard
npm install chart.js

# Utilitaires JavaScript
npm install lodash-es
```

### Librairies de Développement

Installez les types TypeScript et les outils de développement :

```bash
# Types TypeScript pour lodash
npm install --save-dev @types/lodash-es

# Générateur de client API OpenAPI
npm install --save-dev @openapitools/openapi-generator-cli
```

---

## Étape 5 : Configuration OpenAPI Generator

Le générateur OpenAPI permet de créer automatiquement un client TypeScript typé depuis le Swagger du backend.

### Création du Fichier de Configuration

Créez le fichier `openapitools.json` à la racine du projet :

```json
{
  "$schema": "node_modules/@openapitools/openapi-generator-cli/config.schema.json",
  "spaces": 2,
  "generator-cli": {
    "version": "7.10.0",
    "generators": {
      "typescript-angular": {
        "generatorName": "typescript-angular",
        "output": "./src/app/api/generated",
        "inputSpec": "http://localhost:3000/api-json",
        "additionalProperties": {
          "npmName": "@classhub/api-client",
          "npmVersion": "1.0.0",
          "ngVersion": "20.0.0",
          "supportsES6": true,
          "withInterfaces": true
        }
      }
    }
  }
}
```

### Ajout des Scripts NPM

Ajoutez les scripts suivants dans votre `package.json` :

```json
{
  "scripts": {
    "start": "ng serve",
    "start:open": "ng serve --open",
    "build": "ng build",
    "build:prod": "ng build --configuration production",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "test:coverage": "ng test --code-coverage",
    "lint": "ng lint",
    "generate-api": "openapi-generator-cli generate",
    "api": "npm run generate-api"
  }
}
```

### Génération du Client API

**Important** : Le backend doit être démarré sur localhost:3000 avant de générer le client API.

Dans un premier terminal, démarrez le backend :

```bash
cd ../classhub-api
npm run start:dev
```

Vérifiez que le Swagger est accessible sur http://localhost:3000/api. Dans un second terminal, générez le client API :

```bash
cd ../classhub-frontend
npm run api
```

Cette commande crée le dossier `src/app/api/generated/` contenant tous les services TypeScript typés correspondant aux endpoints du backend. Vous verrez des fichiers comme `auth.service.ts`, `courses.service.ts`, `users.service.ts`, etc.

---

## Étape 6 : Structure des Dossiers

Créez la structure de dossiers complète du projet pour organiser le code de manière logique.

### Création de la Structure Core

Le dossier core contient les services et utilitaires fondamentaux de l'application :

```bash
mkdir -p src/app/core/auth
mkdir -p src/app/core/guards
mkdir -p src/app/core/interceptors
mkdir -p src/app/core/services
```

### Création de la Structure Shared

Le dossier shared contient les composants et utilitaires réutilisables :

```bash
mkdir -p src/app/shared/components/atoms
mkdir -p src/app/shared/components/molecules
mkdir -p src/app/shared/components/organisms
mkdir -p src/app/shared/directives
mkdir -p src/app/shared/pipes
mkdir -p src/app/shared/models
mkdir -p src/app/shared/validators
```

### Création de la Structure Features

Le dossier features contient les modules fonctionnels de l'application :

```bash
mkdir -p src/app/features/auth/login
mkdir -p src/app/features/auth/register-org
mkdir -p src/app/features/auth/register-member
mkdir -p src/app/features/landing
mkdir -p src/app/features/dashboard
mkdir -p src/app/features/organizations
mkdir -p src/app/features/users
mkdir -p src/app/features/courses
mkdir -p src/app/features/attendances
mkdir -p src/app/features/audit
```

### Création de la Structure Layout

Le dossier layout contient les composants de mise en page :

```bash
mkdir -p src/app/layout/main-layout/components
mkdir -p src/app/layout/auth-layout
```

---

## Étape 7 : Configuration TypeScript Paths

Les paths TypeScript permettent d'utiliser des imports absolus plus lisibles.

### Modification de tsconfig.json

Ajoutez la section `paths` dans le fichier `tsconfig.json` :

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@app/*": ["src/app/*"],
      "@env/*": ["src/environments/*"],
      "@shared/*": ["src/app/shared/*"],
      "@core/*": ["src/app/core/*"],
      "@features/*": ["src/app/features/*"],
      "@layout/*": ["src/app/layout/*"]
    }
  }
}
```

Cette configuration permet d'importer les modules avec des chemins absolus plus clairs :

```typescript
// Au lieu de : import { AuthService } from '../../../core/auth/auth.service';
import { AuthService } from '@core/auth/auth.service';
```

---

## Étape 8 : Configuration du Design System

Le design system centralise tous les tokens de design pour garantir la cohérence visuelle.

### Création du Fichier de Tokens

Créez le fichier `src/styles/_tokens.scss` avec les tokens de design. Ce fichier contiendra les variables SCSS pour les couleurs, la typographie, l'espacement, les border-radius, les ombres et les transitions.

Consultez le fichier `DESIGN_SYSTEM.md` pour voir la liste complète des tokens disponibles.

### Configuration du Thème Angular Material

Modifiez le fichier `src/styles.scss` pour importer les tokens et configurer le thème Material :

```scss
@use '@angular/material' as mat;
@import 'tokens';

// Configuration du thème Material
$primary-palette: mat.define-palette(mat.$indigo-palette);
$accent-palette: mat.define-palette(mat.$pink-palette);

$theme: mat.define-light-theme((
  color: (
    primary: $primary-palette,
    accent: $accent-palette,
  ),
  typography: mat.define-typography-config(),
  density: 0,
));

@include mat.all-component-themes($theme);

// Styles globaux
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: 'Inter', sans-serif;
}

body {
  background: $color-background;
  color: $color-text-primary;
}
```

### Import de la Police Inter

Ajoutez la police Inter de Google Fonts dans le fichier `src/index.html` :

```html
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
```

---

## Étape 9 : Configuration des Intercepteurs

Les intercepteurs HTTP gèrent l'authentification et les erreurs de manière centralisée.

### AuthInterceptor

Créez le fichier `src/app/core/interceptors/auth.interceptor.ts` :

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@env/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(environment.jwtKey);
  
  if (token && req.url.startsWith(environment.apiUrl)) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req);
};
```

### ErrorInterceptor

Créez le fichier `src/app/core/interceptors/error.interceptor.ts` :

```typescript
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Une erreur est survenue';
      
      if (error.status === 401) {
        errorMessage = 'Session expirée. Veuillez vous reconnecter.';
        localStorage.removeItem('access_token');
        router.navigate(['/auth/login']);
      } else if (error.status === 403) {
        errorMessage = 'Accès refusé. Permissions insuffisantes.';
      } else if (error.status === 404) {
        errorMessage = 'Ressource non trouvée.';
      } else if (error.status >= 500) {
        errorMessage = 'Erreur serveur. Veuillez réessayer.';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }
      
      snackBar.open(errorMessage, 'Fermer', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      
      return throwError(() => error);
    })
  );
};
```

---

## Étape 10 : Configuration des Guards

Les guards protègent les routes selon l'authentification et les rôles.

### AuthGuard

Créez le fichier `src/app/core/guards/auth.guard.ts` :

```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  return router.parseUrl('/auth/login');
};
```

### RoleGuard

Créez le fichier `src/app/core/guards/role.guard.ts` :

```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export function roleGuard(allowedRoles: string[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const snackBar = inject(MatSnackBar);
    
    const user = authService.currentUser();
    
    if (!user) {
      return router.parseUrl('/auth/login');
    }
    
    if (allowedRoles.includes(user.role)) {
      return true;
    }
    
    snackBar.open('Accès refusé. Permissions insuffisantes.', 'Fermer', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
    
    return router.parseUrl('/app/dashboard');
  };
}

export const adminGuard: CanActivateFn = roleGuard(['admin']);
export const coachGuard: CanActivateFn = roleGuard(['admin', 'coach']);
```

---

## Étape 11 : Configuration du Routing

Le routing définit la structure de navigation de l'application avec lazy loading.

### Création du Fichier app.routes.ts

Créez le fichier `src/app/app.routes.ts` :

```typescript
import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { adminGuard, coachGuard } from '@core/guards/role.guard';

export const routes: Routes = [
  // Routes publiques
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
  {
    path: 'landing',
    loadComponent: () => 
      import('./features/landing/landing.component').then(m => m.LandingComponent),
  },
  {
    path: 'auth',
    loadChildren: () => 
      import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },

  // Routes protégées avec layout
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => 
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'courses',
        loadChildren: () => 
          import('./features/courses/courses.routes').then(m => m.COURSES_ROUTES),
      },
      {
        path: 'attendances',
        loadChildren: () => 
          import('./features/attendances/attendances.routes').then(m => m.ATTENDANCES_ROUTES),
      },
      {
        path: 'users',
        canActivate: [adminGuard],
        loadChildren: () => 
          import('./features/users/users.routes').then(m => m.USERS_ROUTES),
      },
      {
        path: 'organizations',
        canActivate: [adminGuard],
        loadChildren: () => 
          import('./features/organizations/organizations.routes').then(m => m.ORGANIZATIONS_ROUTES),
      },
      {
        path: 'profile',
        loadComponent: () => 
          import('./features/users/user-profile/user-profile.component').then(m => m.UserProfileComponent),
      },
      {
        path: 'settings',
        canActivate: [adminGuard],
        loadComponent: () => 
          import('./features/organizations/org-settings/org-settings.component').then(m => m.OrgSettingsComponent),
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
    redirectTo: 'landing',
  },
];
```

---

## Étape 12 : Configuration de l'Application

Le fichier `app.config.ts` configure les providers de l'application.

### Création du Fichier app.config.ts

Modifiez le fichier `src/app/app.config.ts` :

```typescript
import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from '@core/interceptors/auth.interceptor';
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { AuthService } from '@core/auth/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AuthService) => () => {
        const token = localStorage.getItem('access_token');
        if (token) {
          return authService.loadCurrentUser();
        }
        return Promise.resolve();
      },
      deps: [AuthService],
      multi: true
    }
  ]
};
```

---

## Étape 13 : Vérification et Tests

Avant de commencer le développement, vérifiez que tout est correctement configuré.

### Vérification de la Compilation

Exécutez les commandes suivantes pour vérifier que le projet compile sans erreur :

```bash
# Build development
npm run build

# Build production
npm run build:prod
```

Les deux builds doivent se terminer sans erreur TypeScript.

### Démarrage du Serveur de Développement

Démarrez le serveur de développement et vérifiez que l'application se lance :

```bash
npm start
```

L'application doit être accessible sur http://localhost:4200. Vous devriez voir une page blanche avec le message par défaut d'Angular si aucun composant n'a encore été créé.

### Vérification du Client API

Vérifiez que le client API a bien été généré :

```bash
ls -la src/app/api/generated
```

Vous devriez voir les fichiers suivants : `api.module.ts`, `auth.service.ts`, `courses.service.ts`, `users.service.ts`, `organizations.service.ts`, `attendances.service.ts`, `subscriptions.service.ts`, et `audit-logs.service.ts`.

---

## Étape 14 : Prochaines Étapes

Une fois la configuration terminée, vous êtes prêt à commencer le développement en suivant le kanban.

### Démarrer Sprint 0

Consultez le fichier `KANBAN_MVP_FRONTEND_COMPLETE.md` et commencez par l'Epic 0 qui couvre l'authentification et l'onboarding. Les premières user stories à implémenter sont :

**US-001** : Landing Page avec les deux CTA vers inscription organisation et membre.

**US-003** : AuthService Angular avec signals pour gérer l'état d'authentification.

**US-006** : Page de Login avec formulaire réactif et gestion des erreurs.

**US-007** : Inscription Organisation en 3 étapes avec stepper Material.

**US-008** : Inscription Adhérent avec sélection de l'organisation.

### Consulter la Documentation

Lisez les fichiers de documentation suivants pour bien comprendre l'architecture :

`README.md` pour la vue d'ensemble du projet et les commandes disponibles.

`DESIGN_SYSTEM.md` pour comprendre les tokens de design et les conventions de style.

`SETUP_STATUS.md` pour voir le statut actuel de la configuration.

`KANBAN_MVP_FRONTEND_COMPLETE.md` pour la planification complète du développement.

---

## 📋 Checklist Complète

Avant de commencer le développement, vérifiez que tous les éléments suivants sont en place :

**Configuration de base** : Node.js version 18 ou plus installé, npm version 9 ou plus installé, projet Angular créé avec routing et SCSS, Angular Material ajouté et configuré, toutes les dépendances npm installées.

**Fichiers de configuration** : fichiers environment.ts et environment.prod.ts créés, openapitools.json configuré, tsconfig.json avec paths configurés, angular.json avec file replacement configuré.

**Structure de dossiers** : structure core créée (auth, guards, interceptors, services), structure shared créée (components, validators, etc.), structure features créée (auth, dashboard, courses, etc.), structure layout créée (main-layout, auth-layout).

**Services et interceptors** : AuthService créé avec signals, authInterceptor créé et enregistré, errorInterceptor créé et enregistré, guards créés (authGuard, adminGuard, coachGuard).

**Client API** : backend démarré sur localhost:3000, npm run api exécuté avec succès, dossier src/app/api/generated créé, services API générés visibles.

**Routing** : app.routes.ts créé avec lazy loading, guards appliqués sur les routes protégées, redirections configurées.

**Design system** : fichier _tokens.scss créé avec tous les tokens, styles.scss configuré avec le thème Material, police Inter importée dans index.html.

**Tests de validation** : npm run build réussit sans erreur, npm run build:prod réussit sans erreur, npm start lance l'application sur localhost:4200, aucune erreur TypeScript dans la console, aucune erreur ESLint.

---

## 🎯 Résumé

Vous avez maintenant un projet frontend Angular complètement configuré avec toutes les fondations nécessaires pour développer l'application ClassHub. Le client API est synchronisé avec le backend, les intercepteurs et guards sont en place, et le design system est prêt à être utilisé.

La prochaine étape consiste à commencer l'implémentation des user stories en suivant le kanban méthodiquement. Sprint 0 pose les fondations de l'authentification et de l'onboarding, ce qui permettra ensuite de développer les fonctionnalités métier de gestion des cours et des présences.

Bon développement !

---

**Dernière mise à jour** : 16 novembre 2025  
**Auteur** : Grégory Dernaucourt
