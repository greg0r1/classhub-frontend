# 🔌 Client API Généré

Ce dossier contient le client API TypeScript généré automatiquement à partir de la spécification OpenAPI du backend.

## ⚠️ Important

**Ne modifiez JAMAIS les fichiers dans `generated/`** - ils seront écrasés à la prochaine génération.

## 🔄 Régénération

Pour régénérer le client après des modifications du backend :

```bash
# 1. Assurez-vous que le backend tourne
cd ../classhub-api
npm run start:dev

# 2. Dans un autre terminal, régénérez le client
cd ../classhub-frontend
npm run api
```

## 📦 Services Disponibles

Le client génère automatiquement les services suivants :

- `AuthService` - Authentification (login, register, me)
- `OrganizationsService` - Gestion des organisations
- `UsersService` - Gestion des utilisateurs
- `CoursesService` - Gestion des cours
- `AttendancesService` - Gestion des présences
- `SubscriptionsService` - Gestion des abonnements
- `AuditLogsService` - Logs d'audit

## 💡 Utilisation

### Import

```typescript
import { AuthService } from '@app/api/generated';
import { LoginDto, RegisterDto } from '@app/api/generated';
```

### Dans un Component/Service

```typescript
import { Component, inject } from '@angular/core';
import { AuthService } from '@app/api/generated';

@Component({
  selector: 'app-login',
  template: `...`
})
export class LoginComponent {
  private authApiService = inject(AuthService);

  login(email: string, password: string) {
    this.authApiService.authControllerLogin({ email, password })
      .subscribe({
        next: (response) => {
          console.log('Token:', response.access_token);
        },
        error: (err) => {
          console.error('Erreur:', err);
        }
      });
  }
}
```

## 🔧 Configuration

Le client est configuré dans `openapitools.json` à la racine du projet.

### Options importantes :

- `inputSpec`: URL du Swagger JSON (http://localhost:3000/api-json)
- `output`: Dossier de sortie (./src/app/api/generated)
- `ngVersion`: Version Angular cible (20.0.0)

## 📝 DTOs

Tous les DTOs sont fortement typés et disponibles dans `generated/model/` :

```typescript
import {
  LoginDto,
  RegisterDto,
  CreateCourseDto,
  CreateUserDto,
  UpdateUserDto,
} from '@app/api/generated';
```

## 🎯 Wrapper Services (Recommandé)

Au lieu d'utiliser directement les services générés dans vos components, créez des **wrapper services** dans `src/app/core/` :

```typescript
// src/app/core/auth/auth.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { AuthService as ApiAuthService } from '@app/api/generated';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiAuthService = inject(ApiAuthService);
  private currentUserSignal = signal(null);

  login(email: string, password: string) {
    return this.apiAuthService.authControllerLogin({ email, password })
      .pipe(
        tap(response => {
          this.currentUserSignal.set(response.user);
          localStorage.setItem('token', response.access_token);
        })
      );
  }
}
```

**Avantages** :
- Logique métier séparée
- Gestion d'état avec signals
- Facilite les tests
- Le client généré reste intact

## 🔄 Workflow de Développement

1. **Modifier le backend** : Ajout d'un endpoint, modification d'un DTO
2. **Regénérer le client** : `npm run api`
3. **Utiliser les nouveaux types** : Auto-complétion dans VSCode
4. **Tout est synchronisé** ! ✨

## ⚙️ Troubleshooting

### Erreur "Cannot find module '@app/api/generated'"

**Solution** : Regénérez le client avec `npm run api`

### Le backend ne répond pas

**Vérifiez** :
- Le backend tourne sur http://localhost:3000
- http://localhost:3000/api-json retourne du JSON
- Pas de problèmes CORS

### Types incorrects après modification du backend

**Solution** : Regénérez le client. Les types sont toujours extraits du Swagger actuel.

## 📚 Ressources

- [OpenAPI Generator](https://openapi-generator.tech/)
- [NestJS Swagger](https://docs.nestjs.com/openapi/introduction)
- [Documentation Swagger ClassHub](http://localhost:3000/api)
