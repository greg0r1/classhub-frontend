# Status de Configuration - ClassHub Frontend

**Version** : 2.0  
**Date de mise à jour** : 16 novembre 2025  
**Backend Status** : ✅ Terminé (49 endpoints documentés)

---

## ✅ Configuration Terminée

### 1. Structure de Base

Le projet Angular 20.3 a été initialisé avec succès en utilisant la dernière version stable du framework. Le routing a été activé dès la création du projet pour permettre une navigation fluide entre les différentes vues de l'application. Le preprocesseur SCSS a été choisi pour profiter des variables, mixins et autres fonctionnalités avancées de stylisation.

Le mode strict de TypeScript a été activé dans la configuration pour garantir une qualité de code maximale et détecter les erreurs potentielles dès la compilation. Cette configuration stricte impose des vérifications de types rigoureuses qui améliorent la maintenabilité du code.

### 2. Environnements

Les fichiers d'environnement ont été créés et configurés pour gérer les différences entre développement et production. Le fichier `src/environments/environment.ts` contient les paramètres pour l'environnement de développement local, avec l'URL de l'API pointant vers localhost:3000.

Le fichier `src/environments/environment.prod.ts` contient les paramètres pour l'environnement de production, avec l'URL de l'API configurée pour pointer vers le serveur de production. La configuration du file replacement a été ajoutée dans `angular.json` pour permettre le remplacement automatique du fichier d'environnement lors des builds de production.

Les environnements incluent les paramètres suivants : production (booléen), apiUrl (URL du backend), jwtKey (clé de stockage du token), apiTimeout (timeout des requêtes en millisecondes), et enableDevTools (activation des outils de développement).

### 3. Dépendances

Toutes les dépendances nécessaires au projet ont été installées et configurées correctement dans le fichier `package.json`.

Angular Material version 20.2.11 a été ajouté avec le thème Indigo/Pink, la typographie globale activée et les animations Material complètes. Cette librairie fournit l'ensemble des composants UI utilisés dans l'application : tables, dialogs, snackbars, form fields, buttons, etc.

La librairie date-fns version 4.1.0 a été installée pour la manipulation et le formatage des dates. Cette librairie moderne et performante est utilisée dans les composants de calendrier et de filtrage par dates.

Chart.js version 4.4.7 a été ajouté pour créer les graphiques et visualisations de données du dashboard. Cette librairie permet de générer des graphiques linéaires, en barres et circulaires avec une configuration simple.

Lodash-es version 4.17.21 fournit des utilitaires JavaScript performants pour la manipulation de tableaux, objets et fonctions. Les types TypeScript correspondants ont également été installés via @types/lodash-es.

OpenAPI Generator CLI version 2.15.3 a été installé comme dépendance de développement pour permettre la génération automatique du client API TypeScript depuis le Swagger backend.

### 4. Scripts NPM

Les scripts NPM ont été configurés dans le fichier `package.json` pour faciliter le développement quotidien.

Le script `start` lance le serveur de développement Angular sur localhost:4200. Le script `start:open` fait de même mais ouvre automatiquement l'application dans le navigateur par défaut.

Les scripts de build incluent `build` pour compiler en mode développement et `build:prod` pour compiler avec toutes les optimisations de production activées. Le script `watch` permet une compilation continue avec rechargement automatique lors des modifications de code.

Le script `api` (alias de `generate-api`) exécute OpenAPI Generator pour créer le client API TypeScript depuis le Swagger backend. Ce script doit être exécuté à chaque modification du backend pour maintenir la synchronisation.

Les scripts de test incluent `test` pour exécuter les tests unitaires Jasmine/Karma et `test:coverage` pour générer un rapport de couverture de code.

Le script `lint` exécute ESLint sur l'ensemble du projet pour détecter les problèmes de qualité de code et les violations des conventions.

### 5. Structure des Dossiers

L'architecture de dossiers complète a été créée en suivant les meilleures pratiques Angular et le principe de séparation des responsabilités.

Le dossier `src/app/core/` contient les services et utilitaires fondamentaux de l'application. Il est subdivisé en plusieurs sous-dossiers : `auth/` pour le service d'authentification avec signals, `guards/` pour les guards fonctionnels qui protègent les routes, `interceptors/` pour les intercepteurs HTTP qui gèrent l'authentification et les erreurs, et `services/` pour les autres services métier de l'application.

Le dossier `src/app/shared/` regroupe tous les composants, directives, pipes et validators réutilisables dans toute l'application. Les composants sont organisés selon l'atomic design : `atoms/` pour les composants de base (boutons, badges, inputs), `molecules/` pour les composants composés (stat-cards, search-bars), et `organisms/` pour les composants complexes (tables, sidebars). Les validators personnalisés pour les formulaires sont dans `validators/`.

Le dossier `src/app/features/` contient tous les modules fonctionnels de l'application, organisés par domaine métier. Chaque feature est lazy-loaded pour optimiser les performances. Les features incluent : `auth/` pour l'authentification (login, register-org, register-member), `landing/` pour la page d'accueil, `dashboard/` pour le tableau de bord avec statistiques, `courses/` pour la gestion des cours, `attendances/` pour la gestion des présences, `users/` pour la gestion des utilisateurs, `organizations/` pour la gestion des organisations, et `audit/` pour les audit logs.

Le dossier `src/app/layout/` contient les composants de mise en page qui structurent l'interface. Il inclut `main-layout/` pour le layout principal avec sidenav et toolbar, et `auth-layout/` pour le layout des pages d'authentification.

Le dossier `src/app/api/generated/` sera créé automatiquement par OpenAPI Generator et contiendra tous les services API auto-générés depuis le Swagger backend. Ce dossier ne doit jamais être modifié manuellement.

### 6. Configuration TypeScript

Les paths TypeScript ont été configurés dans `tsconfig.json` pour permettre des imports absolus plus lisibles et maintenables.

Les alias suivants ont été définis : `@app/*` pointe vers `src/app/*`, `@env/*` pointe vers `src/environments/*`, `@shared/*` pointe vers `src/app/shared/*`, `@core/*` pointe vers `src/app/core/*`, `@features/*` pointe vers `src/app/features/*`, et `@layout/*` pointe vers `src/app/layout/*`.

Ces alias permettent d'écrire des imports comme `import { AuthService } from '@core/auth/auth.service'` au lieu de chemins relatifs complexes avec de multiples niveaux de `../`.

### 7. Intercepteurs HTTP

Les intercepteurs HTTP ont été créés et configurés pour gérer de manière centralisée l'authentification et les erreurs.

L'AuthInterceptor (dans `src/app/core/interceptors/auth.interceptor.ts`) ajoute automatiquement le token JWT Bearer à toutes les requêtes HTTP vers l'API backend. Il récupère le token depuis le localStorage et l'injecte dans le header Authorization. Cet intercepteur est essentiel pour le fonctionnement du système d'authentification multi-tenant.

L'ErrorInterceptor (dans `src/app/core/interceptors/error.interceptor.ts`) capture toutes les erreurs HTTP et les gère de manière uniforme. Sur une erreur 401 (Unauthorized), il déconnecte automatiquement l'utilisateur et le redirige vers la page de login. Sur une erreur 403 (Forbidden), il affiche un message indiquant des permissions insuffisantes. Sur une erreur 404 (Not Found), il informe que la ressource n'a pas été trouvée. Sur une erreur 500 ou plus, il affiche un message d'erreur serveur générique.

Tous les messages d'erreur sont affichés via MatSnackBar avec un style cohérent et sont automatiquement fermés après 5 secondes. Les intercepteurs ont été enregistrés dans `app.config.ts` via la fonction `withInterceptors()`.

### 8. Guards de Navigation

Les guards fonctionnels ont été créés pour protéger les routes selon l'authentification et les rôles utilisateur.

L'authGuard (dans `src/app/core/guards/auth.guard.ts`) vérifie que l'utilisateur est authentifié avant d'autoriser l'accès à une route protégée. Si l'utilisateur n'est pas connecté, il est automatiquement redirigé vers la page de login. Ce guard utilise le signal `isAuthenticated()` du AuthService pour vérifier l'état de connexion.

Le roleGuard est une fonction factory qui génère des guards spécifiques pour vérifier les rôles. Elle prend en paramètre un tableau de rôles autorisés et retourne un guard fonctionnel. Si l'utilisateur n'a pas le bon rôle, un snackbar d'erreur s'affiche et il est redirigé vers le dashboard.

Deux guards prédéfinis ont été créés à partir de roleGuard : adminGuard qui autorise uniquement le rôle 'admin', et coachGuard qui autorise les rôles 'admin' et 'coach'. Ces guards sont appliqués dans le fichier de routing sur les routes nécessitant des permissions spécifiques.

### 9. Routing

Le système de routing a été configuré avec lazy loading pour optimiser les performances de l'application.

Le fichier `src/app/app.routes.ts` définit toutes les routes de l'application organisées hiérarchiquement. Les routes publiques incluent la landing page et les routes d'authentification (login, register-org, register-member).

Les routes protégées sous le chemin `/app/*` nécessitent toutes une authentification via l'authGuard. Elles sont wrappées dans le MainLayoutComponent qui fournit la navigation et le toolbar. Les routes protégées incluent : dashboard pour la vue d'ensemble, courses pour la gestion des cours, attendances pour la gestion des présences, users pour la gestion des utilisateurs (admin uniquement), organizations pour la gestion des organisations (admin uniquement), profile pour le profil utilisateur, et settings pour les paramètres de l'organisation (admin uniquement).

Toutes les routes features utilisent le lazy loading via `loadChildren()` ou `loadComponent()` pour ne charger le code que lorsque l'utilisateur accède à la route correspondante. Cette stratégie réduit significativement la taille du bundle initial et améliore le temps de chargement de l'application.

Une route catch-all redirige toutes les URLs non reconnues vers la landing page.

### 10. Design System

Le design system a été créé avec tous les tokens de design centralisés dans un fichier SCSS unique.

Le fichier `src/styles/_tokens.scss` contient toutes les variables SCSS pour les couleurs (primary, accent, success, warning, error, info avec toutes leurs nuances), la typographie (tailles de police de 12px à 36px, poids de police de 300 à 700), l'espacement suivant une grille de 8px (de 4px à 128px), les border-radius (de 4px à 16px), les ombres (de subtle à 2xl), et les transitions (fast 150ms, base 200ms, slow 300ms).

Des mixins SCSS ont été créés pour faciliter le développement : mixin responsive pour les media queries, mixin truncate pour tronquer le texte, mixin line-clamp pour limiter le nombre de lignes, mixin focus-visible pour les styles de focus accessibles, mixin card pour créer des cartes Material, et mixin flex-center pour centrer le contenu.

Le thème Angular Material a été configuré dans `src/styles.scss` en utilisant les palettes Indigo pour le primary et Pink pour l'accent. La typographie Material et la density par défaut ont été appliqués.

La police Inter de Google Fonts a été importée dans `src/index.html` avec les poids 300, 400, 500, 600 et 700. Les Material Icons ont également été importés pour l'utilisation des icônes Material dans les composants.

Un fichier `DESIGN_SYSTEM.md` détaillé a été créé pour documenter tous les tokens disponibles, les mixins, les classes utilitaires et les conventions de code. Ce fichier sert de référence pour tous les développeurs travaillant sur le projet.

### 11. Configuration de l'Application

Le fichier `src/app/app.config.ts` a été configuré avec tous les providers nécessaires à l'application.

Le provider `provideZoneChangeDetection` active la coalescence des événements pour améliorer les performances. Le provider `provideRouter` enregistre les routes définies dans `app.routes.ts`. Le provider `provideAnimationsAsync` active les animations Angular Material de manière asynchrone pour réduire la taille du bundle initial.

Le provider `provideHttpClient` active le client HTTP avec les intercepteurs authInterceptor et errorInterceptor enregistrés via `withInterceptors()`.

Un provider `APP_INITIALIZER` a été configuré pour charger automatiquement l'utilisateur connecté au démarrage de l'application. Si un token JWT est présent dans le localStorage, le service AuthService est appelé pour récupérer les informations de l'utilisateur via l'endpoint `/auth/me`. Cette initialisation garantit que l'état d'authentification est hydraté avant le premier rendu de l'application.

### 12. OpenAPI Generator

OpenAPI Generator a été configuré pour générer automatiquement un client TypeScript typé depuis le Swagger du backend.

Le fichier `openapitools.json` définit la configuration du générateur : version 7.10.0 d'OpenAPI Generator, générateur typescript-angular pour créer des services Angular, output dans le dossier `src/app/api/generated`, inputSpec pointant vers `http://localhost:3000/api-json`, et propriétés additionnelles incluant ngVersion 20.0.0, supportsES6 true, et withInterfaces true.

Le script npm `api` a été créé pour exécuter la génération en une seule commande. Ce script doit être exécuté après chaque modification du Swagger backend pour régénérer les services et types TypeScript et garantir la synchronisation parfaite entre frontend et backend.

---

## 🔄 Client API Généré

Le client API a été généré avec succès depuis le Swagger backend. Le dossier `src/app/api/generated/` contient maintenant tous les services TypeScript nécessaires pour consommer l'API.

### Services Disponibles

Les services suivants ont été générés automatiquement et sont prêts à l'utilisation :

AuthService fournit les méthodes register, login et me pour l'authentification et la gestion de session. OrganizationsService offre le CRUD complet des organisations avec les méthodes findAll, findOne, create, update et remove. UsersService permet la gestion des utilisateurs avec findAll, findOne, create, update et remove.

CoursesService gère les cours avec les méthodes findAll, findOne, create, update, remove et les méthodes spécifiques pour les cours récurrents. AttendancesService gère les présences avec createIntention, updateIntention, validateAttendance, selfCheckin et les statistiques.

SubscriptionsService permet la gestion des abonnements et paiements avec findAll, findOne, create, update et remove. AuditLogsService fournit l'accès aux logs d'audit avec findAll et les filtres avancés.

### Types TypeScript

Tous les DTOs du backend ont été convertis en interfaces TypeScript avec validation complète des types. Les interfaces suivantes sont disponibles : RegisterDto, LoginDto, CreateCourseDto, UpdateCourseDto, CreateAttendanceDto, User, Organization, Course, Attendance, Subscription, AuditLog et toutes leurs variantes.

Ces types garantissent que le code frontend est parfaitement synchronisé avec le backend et détecte les erreurs de typage à la compilation.

### Configuration API

Le base path de l'API est configuré automatiquement depuis le fichier `environment.ts`. Les services utilisent l'URL définie dans `environment.apiUrl` pour toutes les requêtes HTTP.

Les intercepteurs ajoutent automatiquement le token JWT et gèrent les erreurs, donc les composants peuvent utiliser les services générés directement sans gérer l'authentification manuellement.

---

## 🎯 Prochaines Étapes

La configuration de base étant terminée, le projet est maintenant prêt pour le développement des fonctionnalités. Voici les actions recommandées pour démarrer efficacement.

### Étape 1 : Créer le AuthService Angular

Le AuthService doit être créé dans `src/app/core/auth/auth.service.ts` en utilisant les services API générés. Ce service central gérera tout l'état d'authentification de l'application avec des signals.

Le service devra exposer les signals suivants : currentUser pour l'utilisateur connecté (ou null), isAuthenticated computed depuis currentUser, isAdmin computed pour vérifier le rôle admin, et isCoach computed pour vérifier les rôles admin ou coach.

Les méthodes à implémenter incluent : login pour authentifier l'utilisateur et stocker le token, register pour créer un nouveau compte, logout pour déconnecter et nettoyer le localStorage, et loadCurrentUser pour récupérer le profil utilisateur depuis l'API.

Référez-vous à la user story US-003 dans le kanban pour les spécifications détaillées et les exemples de code.

### Étape 2 : Implémenter la Landing Page

La landing page sera le point d'entrée de l'application pour les utilisateurs non connectés. Elle doit présenter ClassHub de manière attractive et guider les visiteurs vers les actions principales.

Créez le composant `src/app/features/landing/landing.component.ts` avec une hero section comprenant un titre accrocheur, une description concise et deux CTA bien visibles. Le premier CTA "Créer mon club" redirigera vers `/auth/register-org`. Le second CTA "Rejoindre un club" redirigera vers `/auth/register-member`.

Ajoutez une section features présentant 3 à 4 bénéfices clés de ClassHub avec des icônes Material Icons. Incluez un footer avec les liens légaux (mentions légales, CGU, politique de confidentialité).

Assurez-vous que le design soit responsive et utilise les tokens du design system. Référez-vous à la user story US-001 pour les critères d'acceptation complets.

### Étape 3 : Développer les Pages d'Authentification

Les pages d'authentification sont critiques pour permettre aux utilisateurs d'accéder à l'application. Elles constituent le Sprint 0 du kanban.

Commencez par la page de login dans `src/app/features/auth/login/login.component.ts`. Créez un formulaire réactif avec les champs email et password, ajoutez la validation temps réel, implémentez la gestion des erreurs 401, et redirigez vers le dashboard après succès.

Développez ensuite l'inscription organisation dans `src/app/features/auth/register-org/register-org.component.ts`. Utilisez un stepper Material en 3 étapes : infos organisation, contact organisation et compte admin. Implémentez la génération automatique du slug depuis le nom. Ajoutez un indicateur de force du mot de passe.

Créez l'inscription adhérent dans `src/app/features/auth/register-member/register-member.component.ts` avec un formulaire simple permettant de sélectionner l'organisation via un autocomplete et de saisir les informations personnelles.

Les user stories US-006, US-007 et US-008 détaillent précisément les critères d'acceptation pour chacune de ces pages.

### Étape 4 : Construire le Layout Principal

Le layout principal structure toute l'interface de l'application pour les utilisateurs connectés. Il assure une expérience cohérente sur toutes les pages.

Créez le composant `src/app/layout/main-layout/main-layout.component.ts` avec un sidenav Material contenant la navigation principale. Ajoutez un toolbar en haut avec le logo, le nom de l'organisation et l'avatar de l'utilisateur.

Implémentez un menu utilisateur accessible via l'avatar avec les options Profil, Paramètres et Déconnexion. Configurez la navigation conditionnelle selon le rôle : tous les utilisateurs voient Dashboard, Cours et Présences ; les coachs et admins voient en plus Gestion Cours ; les admins voient Organisations, Utilisateurs et Paramètres.

Rendez le sidenav collapsible sur mobile avec un bouton hamburger. Ajoutez un indicateur visuel pour la route active. La user story US-012 fournit tous les détails d'implémentation.

### Étape 5 : Implémenter le Dashboard

Le dashboard est la première page que voit l'utilisateur après connexion. Il doit fournir une vue d'ensemble rapide et pertinente.

Créez le composant `src/app/features/dashboard/dashboard.component.ts` avec quatre stat cards en haut affichant les KPIs principaux : nombre de prochains cours, nombre de présences ce mois, taux de présence global et statut de l'abonnement.

Ajoutez une section "Prochains cours" listant les 5 prochains cours à venir avec possibilité de s'inscrire directement. Incluez une section "Activité récente" montrant les dernières présences validées.

Intégrez un graphique Chart.js montrant l'évolution des présences sur les 30 derniers jours. Adaptez le contenu selon le rôle : un membre voit ses stats personnelles, un coach voit les stats de ses cours, un admin voit les stats globales de l'organisation.

La user story US-013 détaille précisément les APIs à utiliser et les composants à créer.

---

## 📚 Documentation de Référence

Plusieurs fichiers de documentation ont été créés pour guider le développement et assurer la cohérence du code.

### README.md

Le fichier README.md fournit une vue d'ensemble complète du projet avec la présentation de ClassHub, la stack technique détaillée, les fonctionnalités principales, le guide de démarrage rapide, la structure du projet expliquée, les conventions de code et les bonnes pratiques.

Ce fichier doit être consulté en premier par tout nouveau développeur rejoignant le projet. Il contient également tous les scripts npm disponibles et des exemples d'utilisation des services et composants.

### DESIGN_SYSTEM.md

Le fichier DESIGN_SYSTEM.md documente exhaustivement le système de design avec tous les tokens disponibles (couleurs, typographie, espacement, border-radius, ombres, transitions), les mixins SCSS réutilisables, les classes utilitaires, les conventions de responsive design et les règles d'accessibilité WCAG AA.

Ce fichier doit être consulté systématiquement lors de la création de nouveaux composants pour garantir la cohérence visuelle de l'application.

### FRONTEND_DEMARRAGE_V2.md

Le fichier FRONTEND_DEMARRAGE_V2.md est un guide détaillé étape par étape de la configuration initiale du projet. Il couvre l'initialisation du projet Angular, la configuration des environnements, l'installation d'Angular Material, l'installation de toutes les dépendances, la configuration d'OpenAPI Generator, la création de la structure de dossiers, la configuration TypeScript, la mise en place du design system, la configuration des intercepteurs et guards, le routing avec lazy loading, et la vérification complète de l'installation.

Ce guide permet de reproduire exactement la configuration du projet sur un nouvel environnement ou pour onboarder un nouveau développeur.

### KANBAN_MVP_FRONTEND_COMPLETE.md

Le fichier KANBAN_MVP_FRONTEND_COMPLETE.md contient le planning complet du développement frontend avec 42 user stories organisées en 5 sprints pour un total de 195 points répartis sur 8 à 10 semaines.

Chaque user story est documentée avec une description complète (En tant que... Je veux... Afin de...), des critères d'acceptation détaillés avec checkboxes, les APIs backend à utiliser avec exemples de payloads, les composants Angular à créer, le code de référence TypeScript utilisant les signals, les routes et guards nécessaires, et l'estimation en points de complexité.

Ce fichier est la référence centrale pour le développement et doit être consulté quotidiennement pour suivre l'avancement et implémenter les fonctionnalités dans le bon ordre.

---

## ✅ Checklist de Démarrage

Avant de commencer le développement effectif des fonctionnalités, vérifiez que tous les éléments suivants sont en place pour garantir un environnement de travail optimal.

### Configuration Technique

Le backend ClassHub API doit être démarré sur localhost:3000 et le Swagger doit être accessible sur http://localhost:3000/api. Le frontend doit compiler sans erreur avec `npm run build` et `npm run build:prod`. Le serveur de développement doit se lancer correctement avec `npm start` sur localhost:4200.

Le dossier `src/app/api/generated` doit être créé et contenir tous les services API générés depuis le Swagger. Aucune erreur TypeScript ne doit apparaître dans la console lors de la compilation.

### Structure de Code

La structure de dossiers complète doit être créée selon l'architecture définie. Tous les fichiers de configuration doivent être en place : environments, openapitools.json, tsconfig avec paths, angular.json avec file replacement.

Les intercepteurs authInterceptor et errorInterceptor doivent être créés et enregistrés dans app.config.ts. Les guards authGuard, adminGuard et coachGuard doivent être créés et prêts à l'utilisation. Le fichier app.routes.ts doit être configuré avec toutes les routes et le lazy loading.

### Design System

Le fichier _tokens.scss doit contenir tous les tokens de design (couleurs, typographie, espacement, etc.). Le fichier styles.scss doit être configuré avec le thème Angular Material Indigo/Pink. La police Inter doit être importée dans index.html.

Tous les fichiers de documentation doivent être créés et à jour : README.md, DESIGN_SYSTEM.md, FRONTEND_DEMARRAGE_V2.md et KANBAN_MVP_FRONTEND_COMPLETE.md.

### Validation Finale

Exécutez `npm run lint` pour vérifier qu'il n'y a aucune erreur ESLint. Vérifiez que l'application se lance sans erreur dans la console du navigateur. Confirmez que le client API a bien été généré avec tous les services disponibles.

Lisez attentivement le fichier KANBAN_MVP_FRONTEND_COMPLETE.md pour comprendre l'architecture globale et le planning de développement.

---

## 🎯 Résumé de Configuration

Le projet frontend ClassHub est maintenant entièrement configuré avec une architecture moderne basée sur Angular 20, TypeScript 5.8 et Angular Material. Le client API est synchronisé avec le backend NestJS via OpenAPI Generator, garantissant une cohérence parfaite des types et des contrats d'API.

L'infrastructure de base est en place avec les intercepteurs pour l'authentification et la gestion des erreurs, les guards pour la protection des routes, le routing avec lazy loading pour optimiser les performances et le design system complet avec tous les tokens nécessaires.

La prochaine étape consiste à commencer l'implémentation des user stories en suivant méthodiquement le kanban. Le Sprint 0 qui couvre l'authentification et l'onboarding doit être développé en priorité car il pose les fondations indispensables pour toutes les autres fonctionnalités.

Le backend étant terminé avec 49 endpoints documentés, le développement frontend peut se concentrer exclusivement sur l'expérience utilisateur et la consommation efficace de l'API. La génération automatique du client API garantit que toute modification du backend sera immédiatement reflétée dans le frontend après une simple régénération.

L'ensemble de la documentation créée fournit un cadre clair pour le développement avec des conventions de code strictes, des exemples détaillés et une architecture bien définie. Cette approche structurée garantit la qualité, la maintenabilité et l'évolutivité du code produit.

---

**Prochaine action recommandée** : Commencer l'implémentation du Sprint 0 en démarrant par la user story US-001 (Landing Page), puis US-003 (AuthService), US-006 (Login), US-007 (Register Organisation) et US-008 (Register Member).

**Bon développement !** 🚀
