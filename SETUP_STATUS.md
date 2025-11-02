# Status de Configuration - ClassHub Frontend

## ✅ Configuration Terminée

### 1. Environnements
- ✅ `src/environments/environment.ts` créé
- ✅ `src/environments/environment.prod.ts` créé
- ✅ Configuration file replacement dans `angular.json`

### 2. Dépendances
- ✅ Angular Material ajouté au `package.json`
- ✅ date-fns, chart.js, lodash-es ajoutés
- ✅ OpenAPI Generator CLI ajouté
- ✅ Scripts npm configurés

### 3. Structure des Dossiers
```
src/app/
├── core/
│   ├── auth/          ✅ AuthService avec signals
│   ├── guards/        ✅ authGuard, roleGuard, adminGuard, coachGuard
│   ├── interceptors/  ✅ authInterceptor, errorInterceptor
│   └── services/      ✅ (vide, prêt pour vos services)
├── shared/
│   ├── components/    ✅ (vide, prêt pour vos composants réutilisables)
│   ├── directives/    ✅ (vide)
│   ├── pipes/         ✅ (vide)
│   └── models/        ✅ (vide)
├── features/
│   ├── auth/          ✅ (prêt pour login/register)
│   ├── dashboard/     ✅ (prêt)
│   ├── organizations/ ✅ (prêt)
│   ├── users/         ✅ (prêt)
│   ├── courses/       ✅ (prêt)
│   └── attendances/   ✅ (prêt)
└── layout/
    ├── main-layout/   ✅ (prêt)
    ├── auth-layout/   ✅ (prêt)
    └── components/    ✅ (prêt)
```

### 4. Configuration Angular
- ✅ TypeScript paths configurés dans `tsconfig.app.json`
- ✅ `app.config.ts` configuré avec intercepteurs et animations
- ✅ `app.routes.ts` configuré avec lazy loading et guards
- ✅ Styles globaux avec Angular Material thème

### 5. OpenAPI Generator
- ✅ `openapitools.json` configuré
- ✅ Script `npm run api` disponible

## 🔄 Prochaines Étapes (À FAIRE)

### Étape 1 : Installer les Dépendances
```bash
npm install
```

### Étape 2 : Générer le Client API
**⚠️ Important : Le backend doit tourner sur http://localhost:3000**

```bash
# Dans un terminal, démarrer le backend
cd ../classhub-api
npm run start:dev

# Dans un autre terminal, générer le client API
cd ../classhub-frontend
npm run api
```

Cela créera le dossier `src/app/api/generated/` avec tous les services typés.

### Étape 3 : Mettre à Jour AuthService
Après la génération de l'API, modifier `src/app/core/auth/auth.service.ts` pour utiliser le service API généré :

```typescript
// Remplacer les TODO par les vrais appels API
import { AuthService as ApiAuthService } from '@app/api/generated';

private readonly apiAuthService = inject(ApiAuthService);
```

### Étape 4 : Créer les Composants de Base

#### 4.1 Dashboard Component
```bash
ng generate component features/dashboard --standalone
```

#### 4.2 Auth Module
Créer les composants de login et register dans `src/app/features/auth/`

#### 4.3 Layout Components
Créer les layouts dans `src/app/layout/`

### Étape 5 : Activer MatSnackBar dans error.interceptor
Décommenter le code MatSnackBar dans `src/app/core/interceptors/error.interceptor.ts`

### Étape 6 : Tester la Compilation
```bash
npm run build
```

### Étape 7 : Démarrer l'Application
```bash
npm start
# ou
npm run start:open
```

## 📋 Checklist des Features à Implémenter

### Authentification
- [ ] Page de login
- [ ] Page de register
- [ ] Gestion des erreurs de formulaire
- [ ] Validation côté client

### Dashboard
- [ ] Vue d'ensemble avec statistiques
- [ ] Graphiques avec Chart.js
- [ ] Composants de cartes statistiques

### Gestion des Organisations (Admin)
- [ ] Liste des organisations
- [ ] Formulaire de création
- [ ] Formulaire d'édition
- [ ] Suppression

### Gestion des Utilisateurs (Admin)
- [ ] Liste des utilisateurs
- [ ] Formulaire de création
- [ ] Formulaire d'édition
- [ ] Suppression
- [ ] Filtres par rôle

### Gestion des Cours (Coach/Admin)
- [ ] Liste des cours
- [ ] Formulaire de création
- [ ] Formulaire d'édition
- [ ] Gestion des inscriptions
- [ ] Calendrier des cours

### Gestion des Présences
- [ ] Liste des présences
- [ ] Marquer présent/absent
- [ ] Historique
- [ ] Export

## 🎯 Architecture Angular 20/21 Utilisée

- ✅ **Signals** pour la gestion d'état réactive
- ✅ **Standalone components** (plus de NgModules)
- ✅ **New control flow** : `@if`, `@for`, `@switch`
- ✅ **`input()` / `output()` functions** au lieu de decorators
- ✅ **`inject()` function** au lieu de constructor injection
- ✅ **`computed()` signals** pour l'état dérivé
- ✅ **Functional guards** et **interceptors**
- ✅ **OnPush change detection** par défaut

## 🔧 Commandes Utiles

```bash
# Démarrer le serveur de développement
npm start

# Compiler en production
npm run build:prod

# Lancer les tests
npm test

# Générer le client API
npm run api

# Générer un composant
ng generate component features/nom-du-composant --standalone

# Générer un service
ng generate service core/services/nom-du-service
```

## ⚠️ Notes Importantes

1. **Multi-tenant** : Ne jamais filtrer manuellement par `organization_id` dans le frontend. Le backend gère cela automatiquement via le JWT.

2. **Sécurité** :
   - Les tokens JWT sont stockés dans le localStorage
   - L'intercepteur ajoute automatiquement le token à toutes les requêtes
   - Déconnexion automatique sur 401

3. **Routing** :
   - Toutes les routes `/app/*` nécessitent authentification
   - Routes admin nécessitent le rôle `admin`
   - Routes coach nécessitent le rôle `admin` ou `coach`

4. **API Client** :
   - Doit être régénéré à chaque modification du Swagger backend
   - Ne jamais modifier manuellement les fichiers dans `src/app/api/generated/`

## 📚 Ressources

- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Angular New Control Flow](https://angular.dev/guide/templates/control-flow)
- [Angular Material](https://material.angular.io/)
- [Chart.js](https://www.chartjs.org/)
- [date-fns](https://date-fns.org/)
