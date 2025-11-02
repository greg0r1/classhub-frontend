# 🎨 ClassHub Design System

## Overview

ClassHub utilise un design system complet basé sur Angular Material avec des tokens personnalisés pour garantir une interface cohérente, accessible et professionnelle.

## 📁 Structure

```
src/
├── styles/
│   └── _tokens.scss         # Tous les design tokens
├── styles.scss              # Styles globaux + thème Material
└── index.html               # Polices (Inter + Material Icons)
```

## 🎨 Design Tokens

Tous les tokens sont centralisés dans `src/styles/_tokens.scss` :

### Couleurs
- **Primary** : Indigo (`$primary-500: #3f51b5`)
- **Accent** : Pink (`$accent-500: #e91e63`)
- **Success** : Green (`$success-main: #4caf50`)
- **Warning** : Orange (`$warning-main: #ff9800`)
- **Error** : Red (`$error-main: #f44336`)
- **Info** : Blue (`$info-main: #2196f3`)

### Typographie
- **Police** : Inter (Google Fonts)
- **Tailles** : `$font-size-xs` (12px) → `$font-size-4xl` (36px)
- **Poids** : Light (300), Regular (400), Medium (500), Semibold (600), Bold (700)

### Espacement (Grille 8px)
- `$spacing-1` : 4px
- `$spacing-2` : 8px
- `$spacing-4` : 16px (défaut)
- `$spacing-6` : 24px
- `$spacing-8` : 32px
- etc.

### Autres
- **Border Radius** : `$border-radius-sm` (4px) → `$border-radius-xl` (16px)
- **Shadows** : `$shadow-sm` → `$shadow-2xl`
- **Transitions** : `$transition-fast` (150ms), `$transition-base` (200ms)
- **Breakpoints** : sm (576px), md (768px), lg (992px), xl (1200px)

## 🧩 Utilisation dans les Composants

```scss
// Dans votre composant.scss
@import 'tokens';

.my-component {
  padding: $spacing-4;
  background: $color-surface;
  border-radius: $border-radius-md;
  box-shadow: $shadow-sm;

  h2 {
    font-size: $font-size-2xl;
    color: $primary-500;
    margin-bottom: $spacing-3;
  }

  .button {
    height: $button-height-md;
    background: $primary-500;
    color: white;
    transition: all $transition-fast;

    &:hover {
      background: $primary-600;
    }
  }

  // Responsive
  @include respond-to('md') {
    padding: $spacing-6;
  }
}
```

## 🎯 Mixins Disponibles

```scss
// Responsive
@include respond-to('md') { /* styles */ }

// Truncate texte
@include truncate;

// Line clamp (limiter les lignes)
@include line-clamp(3);

// Focus pour accessibilité
@include focus-visible;

// Style de carte
@include card;

// Flex center
@include flex-center;

// Custom scrollbar
@include custom-scrollbar;
```

## 🎨 Classes Utilitaires

### Texte
```html
<p class="text-center text-primary font-semibold text-lg">Hello</p>
```

### Espacement
```html
<div class="mt-2 mb-3 p-4">Content</div>
<div class="px-3 py-2">Content</div>
```

### Layout
```html
<div class="flex items-center justify-between gap-4">
  <span>Left</span>
  <span>Right</span>
</div>

<div class="container">
  <!-- Contenu centré avec max-width responsive -->
</div>
```

### Animations
```html
<div class="fade-in">Appear with fade</div>
<div class="slide-in-right">Slide from right</div>
<div class="spin">Loading spinner</div>
```

## 📱 Responsive Design

Mobile-first approach :

```scss
// Mobile (default)
.card {
  padding: $spacing-4;
}

// Tablet et au-dessus
@include respond-to('md') {
  .card {
    padding: $spacing-6;
  }
}

// Desktop et au-dessus
@include respond-to('lg') {
  .card {
    padding: $spacing-8;
  }
}
```

## ♿ Accessibilité

- **Contraste** : Tous les textes respectent WCAG AA (4.5:1)
- **Focus** : `*:focus-visible` avec outline + shadow
- **Semantic HTML** : Utilisez `<button>`, `<a>`, `<input>` natifs
- **ARIA** : Ajoutez `aria-label` sur les boutons icône uniquement

```html
<!-- ✅ Bon -->
<button aria-label="Fermer">
  <mat-icon>close</mat-icon>
</button>

<!-- ❌ Mauvais -->
<div (click)="close()">
  <mat-icon>close</mat-icon>
</div>
```

## 🎨 Architecture des Composants

Suivre le pattern Atomic Design :

```
src/app/shared/components/
├── atoms/           # Boutons, badges, icons, inputs
├── molecules/       # Stat-cards, search-bars, form-fields
└── organisms/       # Navbars, tables, sidebars
```

### Composants Presentational (Dumb)
- Pas de logique métier
- `input()` et `output()` signals
- `ChangeDetectionStrategy.OnPush`
- Styles avec les tokens

### Composants Smart (Containers)
- Gestion d'état avec signals
- Appels API
- Composent les composants presentational

## 🎨 Thème Angular Material

Le thème Material est automatiquement configuré dans `styles.scss` avec nos couleurs personnalisées.

### Snackbar avec couleurs
```typescript
snackBar.open('Succès !', 'Fermer', {
  panelClass: ['success-snackbar'],
  duration: 3000,
});

// Classes disponibles :
// - success-snackbar
// - error-snackbar
// - warning-snackbar
// - info-snackbar
```

## 📚 Ressources

- **Tokens** : [src/styles/_tokens.scss](src/styles/_tokens.scss)
- **Styles globaux** : [src/styles.scss](src/styles.scss)
- **Material Design** : https://m3.material.io/
- **WCAG Guidelines** : https://www.w3.org/WAI/WCAG21/quickref/

## ✨ Best Practices

1. **Utilisez toujours les tokens** au lieu de valeurs en dur
2. **Mobile-first** : Design pour mobile d'abord, puis desktop
3. **OnPush** : Toujours activer `ChangeDetectionStrategy.OnPush`
4. **Accessibilité** : Testez au clavier, vérifiez les contrastes
5. **Consistency** : Réutilisez les composants existants
6. **Performance** : `trackBy` dans les `@for`, lazy load images

## 🚀 Checklist

Avant de merger votre composant :

- [ ] Utilise les tokens du design system
- [ ] `ChangeDetectionStrategy.OnPush`
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Accessible (contraste, keyboard, ARIA)
- [ ] Animations subtiles et rapides (<300ms)
- [ ] TrackBy dans les boucles
- [ ] Focus visible sur éléments interactifs

---

**Consultez les fichiers de tokens pour la liste complète des variables disponibles !** 🎨✨
