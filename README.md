# ClassHub Frontend

Application web Angular moderne pour la gestion de clubs sportifs et le suivi des présences.

## 🎯 Présentation

ClassHub est une plateforme SaaS multi-tenant permettant aux clubs sportifs de gérer leurs cours, leurs membres et de suivre les présences de manière professionnelle. Cette application frontend consomme l'API REST NestJS documentée via Swagger.

### Stack Technique

- **Framework** : Angular 20.3 (dernière version avec signals)
- **UI Library** : Angular Material 20.2
- **Langage** : TypeScript 5.8 (strict mode)
- **State Management** : Signals Angular natifs
- **Charts** : Chart.js 4.4
- **Date Utils** : date-fns 4.1
- **HTTP Client** : Client API auto-généré depuis OpenAPI
- **Architecture** : Standalone components, OnPush change detection

### Fonctionnalités Principales

**Authentification & Onboarding** avec inscription organisation en 3 étapes, inscription membre, login/logout sécurisé et gestion de session persistante via JWT.

**Gestion des Cours** incluant création de cours ponctuels et récurrents, édition et annulation de cours, calendrier mensuel et liste des cours avec filtres avancés.

**Suivi des Présences** permettant l'inscription et désinscription aux cours, la validation des présences par les coachs, l'auto check-in pour les membres et les statistiques détaillées de présence.

**Administration** offrant la gestion des utilisateurs et rôles, les paramètres d'organisation, les statistiques globales et les audit logs pour la conformité RGPD.

**Dashboard** présentant une vue d'ensemble avec KPIs, des graphiques d'évolution des présences, les prochains cours et l'activité récente.

## 🚀 Démarrage Rapide

### Prérequis

Avant de commencer, assurez-vous d'avoir installé Node.js version 18 ou supérieure, npm version 9 ou supérieure, et que le backend ClassHub API soit démarré sur localhost:3000.

### Installation

Pour installer les dépendances du projet, clonez le repository et exécutez les commandes suivantes :

```bash
git clone <repository-url>
cd classhub-frontend
npm install
```

### Configuration du Client API

Le frontend utilise un client TypeScript auto-généré depuis le Swagger du backend. Cette génération garantit que les types et services sont toujours synchronisés avec l'API.

Démarrez d'abord le backend :

```bash
cd ../classhub-api
npm run start:dev
```

Vérifiez que le Swagger est accessible à l'adresse http://localhost:3000/api. Ensuite, dans un autre terminal, générez le client API :

```bash
cd ../classhub-frontend
npm run api
```

Cette commande crée le dossier src/app/api/generated/ contenant tous les services TypeScript typés pour chaque endpoint du backend.

### Lancement du Serveur de Développement

Pour démarrer le serveur de développement, exécutez :

```bash
npm start
# ou avec ouverture automatique du navigateur
npm run start:open
```

L'application sera accessible sur http://localhost:4200 et se rechargera automatiquement à chaque modification du code source.

## 📁 Structure du Projet

Le projet suit une architecture modulaire avec des composants standalone. La structure est organisée de la manière suivante :

```
src/app/
├── core/                    # Services et utilitaires core de l'application
│   ├── auth/               # AuthService avec signals
│   ├── guards/             # Guards fonctionnels (authGuard, roleGuard, etc.)
│   ├── interceptors/       # HTTP interceptors (auth, error)
│   └── services/           # Services métier
│
├── shared/                  # Composants et utilitaires partagés
│   ├── components/         
│   │   ├── atoms/         # Composants atomiques (boutons, badges, etc.)
│   │   ├── molecules/     # Composants composés (stat-cards, search-bars)
│   │   └── organisms/     # Composants complexes (tables, sidebars)
│   ├── directives/        # Directives réutilisables
│   ├── pipes/             # Pipes personnalisés
│   └── validators/        # Validators de formulaires custom
│
├── features/               # Modules fonctionnels (lazy loaded)
│   ├── auth/              # Login, Register (org/member)
│   ├── dashboard/         # Dashboard avec stats et graphiques
│   ├── courses/           # Gestion des cours (liste, détail, CRUD)
│   ├── attendances/       # Gestion des présences (inscription, validation)
│   ├── users/             # Gestion des utilisateurs (admin)
│   ├── organizations/     # Gestion des organisations (admin)
│   └── audit/             # Audit logs (admin)
│
├── layout/                 # Layouts de l'application
│   ├── main-layout/       # Layout principal avec sidenav
│   ├── auth-layout/       # Layout pour pages auth
│   └── components/        # Composants de layout (toolbar, sidebar, etc.)
│
├── api/                    # Client API généré (NE PAS MODIFIER MANUELLEMENT)
│   └── generated/         # Services auto-générés depuis Swagger
│
├── environments/           # Configuration des environnements
│   ├── environment.ts     # Dev
│   └── environment.prod.ts # Production
│
└── styles/                 # Styles globaux et design system
    └── _tokens.scss       # Design tokens (couleurs, spacing, fonts)
```

## 🎨 Design System

Le projet utilise un design system complet basé sur Angular Material avec des tokens personnalisés pour garantir une cohérence visuelle dans toute l'application.

### Tokens Disponibles

Les couleurs primaires incluent Indigo pour le thème principal, Pink pour l'accent, Green pour les succès, Orange pour les avertissements, Red pour les erreurs et Blue pour les informations.

La typographie utilise la police Inter de Google Fonts avec des tailles allant de 12px (font-size-xs) à 36px (font-size-4xl) et des poids de Light 300 à Bold 700.

L'espacement suit une grille de 8px avec des valeurs de spacing-1 (4px) à spacing-16 (128px).

Pour plus de détails, consultez le fichier DESIGN_SYSTEM.md qui contient la documentation complète des tokens, mixins et classes utilitaires disponibles.

### Utilisation dans les Composants

Importez toujours les tokens dans vos fichiers SCSS de composants :

```scss
@import 'tokens';

.my-component {
  padding: $spacing-4;
  background: $color-surface;
  border-radius: $border-radius-md;
  
  h2 {
    font-size: $font-size-2xl;
    color: $primary-500;
  }
}
```

## 🔒 Authentification & Sécurité

L'application implémente un système d'authentification JWT complet avec stockage du token dans localStorage et une durée de validité de 24 heures.

Les interceptors HTTP gèrent automatiquement l'ajout du token Bearer à toutes les requêtes API et la déconnexion automatique sur erreur 401.

Les guards fonctionnels protègent les routes selon le statut d'authentification et les rôles. L'authGuard vérifie si l'utilisateur est connecté, l'adminGuard vérifie le rôle admin et le coachGuard vérifie les rôles admin ou coach.

Le système multi-tenant isole automatiquement les données par organisation via le JWT, sans nécessiter de filtrage manuel dans le frontend.

## 📡 API Client

Le client API est généré automatiquement depuis le Swagger backend à l'aide de OpenAPI Generator. Cette approche garantit plusieurs avantages importants.

Les types TypeScript sont toujours synchronisés avec le backend, ce qui élimine les erreurs de typage. Tous les DTOs sont typés avec validation à la compilation, et chaque endpoint dispose d'un service dédié.

### Régénération du Client

Régénérez le client après chaque modification du Swagger backend en suivant ce processus :

```bash
# 1. Démarrer le backend mis à jour
cd ../classhub-api
npm run start:dev

# 2. Régénérer le client
cd ../classhub-frontend
npm run api
```

### Exemple d'Utilisation

Voici comment utiliser les services générés dans vos composants Angular :

```typescript
import { Component, inject, signal } from '@angular/core';
import { CoursesService } from '@app/api/generated';

@Component({
  selector: 'app-course-list',
  standalone: true,
  templateUrl: './course-list.component.html'
})
export class CourseListComponent {
  private readonly coursesService = inject(CoursesService);
  
  readonly courses = signal<Course[]>([]);
  readonly loading = signal(false);
  
  async loadCourses(): Promise<void> {
    this.loading.set(true);
    try {
      const data = await this.coursesService.findAll().toPromise();
      this.courses.set(data);
    } finally {
      this.loading.set(false);
    }
  }
}
```

## 🧪 Tests

Le projet utilise Jasmine et Karma pour les tests unitaires. Pour exécuter les tests, utilisez les commandes suivantes :

```bash
# Exécuter les tests
npm test

# Avec coverage
npm run test:coverage
```

Les rapports de coverage seront générés dans le dossier coverage/.

## 🏗️ Build

Pour compiler le projet en mode développement, exécutez :

```bash
npm run build
```

Pour compiler en mode production avec optimisations, utilisez :

```bash
npm run build:prod
```

Les artifacts seront générés dans le dossier dist/classhub-frontend/ avec les optimisations suivantes : tree-shaking activé, minification du code, compression Gzip, source maps désactivées en production, et lazy loading des modules features.

## 📋 Scripts NPM Disponibles

Voici la liste complète des scripts NPM disponibles dans le projet :

Pour le développement, utilisez npm start pour démarrer le serveur sur localhost:4200 ou npm run start:open pour démarrer et ouvrir automatiquement le navigateur.

Pour la génération du client API, utilisez npm run api qui génère le client TypeScript depuis le Swagger ou npm run generate-api qui est un alias de la commande précédente.

Pour le build, npm run build compile en mode développement tandis que npm run build:prod compile en mode production optimisé. La commande npm run watch permet la compilation continue avec rechargement automatique.

Pour les tests, npm test exécute les tests unitaires et npm run test:coverage génère le rapport de coverage.

Pour le linting, utilisez npm run lint qui exécute ESLint sur tout le projet.

## 🗺️ Roadmap de Développement

Le développement suit un planning structuré en 5 sprints sur 8 à 10 semaines. Consultez le fichier KANBAN_MVP_FRONTEND_COMPLETE.md pour le détail complet des 42 user stories.

### Sprint 0 : Authentification & Onboarding (1-2 semaines, 53 points)

Ce sprint pose les fondations de l'application avec la landing page, la configuration du client API, le service d'authentification avec signals, les intercepteurs HTTP et guards, la page de login, l'inscription organisation en 3 étapes, l'inscription adhérent, la validation des formulaires et la gestion de session persistante.

### Sprint 1 : Dashboard & Layout (1.5-2 semaines, 38 points)

Construction de l'interface principale avec le layout principal avec sidenav et navigation, le dashboard avec vue d'ensemble et stats, les composants stat cards réutilisables, les graphiques de présences avec Chart.js et le notification center.

### Sprint 2 : Planning & Cours (2 semaines, 42 points)

Gestion complète des cours incluant la liste des cours avec filtres, le détail d'un cours, la création de cours ponctuels et récurrents, l'édition et annulation de cours, et le calendrier mensuel.

### Sprint 3 : Présences & Inscriptions (2 semaines, 42 points)

Workflow complet des présences avec l'inscription et désinscription aux cours, la liste des inscrits pour les coachs, la validation des présences par les coachs, l'auto check-in pour les membres, l'historique des présences et les statistiques détaillées.

### Sprint 4 : Administration (2 semaines, 35 points)

Fonctionnalités d'administration comprenant la liste et détail des organisations, la gestion complète des utilisateurs, le profil utilisateur, les paramètres d'organisation et les audit logs.

### Sprint 5 : Polish & Production (1-2 semaines, 27 points)

Finalisation avec le responsive design complet, les animations et transitions fluides, l'accessibilité WCAG AA, la gestion d'erreurs globale, l'optimisation des performances et la documentation technique.

## 🎯 Conventions de Code

Le projet suit les principes SOLID et Clean Code. Chaque composant doit avoir une responsabilité unique et être facilement testable.

### Composants

Utilisez toujours des standalone components avec ChangeDetectionStrategy.OnPush. Privilégiez les signals pour la gestion d'état réactive et utilisez computed() pour les valeurs dérivées. Préférez input() et output() aux decorators @Input et @Output. Utilisez inject() au lieu de l'injection par constructeur.

Exemple de composant conforme aux conventions :

```typescript
import { Component, ChangeDetectionStrategy, input, output, signal, computed, inject } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  templateUrl: './stat-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatCardComponent {
  // Inputs avec signals
  readonly title = input.required<string>();
  readonly value = input.required<number>();
  
  // Outputs
  readonly clicked = output<void>();
  
  // State interne
  readonly loading = signal(false);
  
  // Computed values
  readonly formattedValue = computed(() => {
    return this.value().toLocaleString('fr-FR');
  });
  
  // Services
  private readonly myService = inject(MyService);
  
  onClick(): void {
    this.clicked.emit();
  }
}
```

### Templates

Utilisez le nouveau control flow Angular (@if, @for, @switch) au lieu des directives structurelles NgIf et NgFor. Ajoutez toujours trackBy dans les boucles @for pour optimiser les performances. Préférez les events Angular natifs (click, submit) et évitez les handlers DOM directs.

```html
<!-- ✅ Bon : nouveau control flow -->
@if (loading()) {
  <mat-spinner />
} @else {
  <div class="content">
    @for (item of items(); track item.id) {
      <app-item-card [item]="item" />
    }
  </div>
}

<!-- ❌ Éviter : ancien style -->
<div *ngIf="loading">...</div>
<div *ngFor="let item of items">...</div>
```

### Services

Tous les services doivent être providedIn 'root' et utiliser inject() pour les dépendances. Exposez des signals readonly pour l'état et fournissez des méthodes async pour les opérations asynchrones.

```typescript
@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly http = inject(HttpClient);
  
  private readonly dataSignal = signal<Data[]>([]);
  readonly data = this.dataSignal.asReadonly();
  
  async loadData(): Promise<void> {
    const result = await this.http.get<Data[]>('/api/data').toPromise();
    this.dataSignal.set(result);
  }
}
```

## 🐛 Débogage

Pour déboguer efficacement l'application, utilisez les Angular DevTools disponibles en extension Chrome pour inspecter les signals et le change detection. Activez le mode verbose des interceptors dans les environnements de développement et consultez la console navigateur pour les logs.

Les erreurs API apparaissent dans les MatSnackBar grâce à l'errorInterceptor. Si le token JWT expire, l'utilisateur est automatiquement déconnecté et redirigé vers la page de login.

## 📚 Ressources Complémentaires

Pour approfondir vos connaissances, consultez les ressources suivantes :

La documentation Angular officielle est disponible sur https://angular.dev avec des guides détaillés sur les signals (https://angular.dev/guide/signals) et le nouveau control flow (https://angular.dev/guide/templates/control-flow).

Pour Angular Material, référez-vous à https://material.angular.io qui propose des composants et des exemples d'utilisation.

La documentation de l'API backend est accessible via Swagger UI sur http://localhost:3000/api et le JSON OpenAPI sur http://localhost:3000/api-json.

Pour le design system du projet, consultez le fichier DESIGN_SYSTEM.md. Le guide de démarrage détaillé se trouve dans SETUP_STATUS.md. Pour la planification complète du développement, référez-vous à KANBAN_MVP_FRONTEND_COMPLETE.md.

Les librairies tierces utilisées incluent Chart.js (https://www.chartjs.org) pour les graphiques, date-fns (https://date-fns.org) pour la manipulation des dates, et lodash-es (https://lodash.com) pour les utilitaires JavaScript.

## 🤝 Contribution

Avant de commencer à contribuer, lisez le fichier KANBAN_MVP_FRONTEND_COMPLETE.md pour comprendre les user stories et l'architecture. Créez une branche depuis main avec le format feature/US-XXX-description pour les nouvelles fonctionnalités. Suivez les conventions de code décrites ci-dessus et assurez-vous que tous les tests passent avant de merger.

## 📝 Licence

Ce projet est privé et propriétaire. Tous droits réservés.

## 👥 Équipe

Développé par Grégory Dernaucourt avec le support de Claude (Anthropic) pour l'architecture et la documentation.

---

**Version** : 1.0.0  
**Dernière mise à jour** : 16 novembre 2025
