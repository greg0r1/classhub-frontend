import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '@environments/environment';
import { AuthService as ApiAuthService } from '@app/api/generated';
import { LoginDto, RegisterDto } from '@app/api/generated';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'coach' | 'member';
  organizationId: string;
}

interface LoginResponse {
  access_token: string;
  user: AuthUser;
}

interface RegisterResponse {
  access_token: string;
  user: AuthUser;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Services injectés avec inject()
  private readonly router = inject(Router);
  private readonly apiAuthService = inject(ApiAuthService);

  // State avec signals
  private readonly currentUserSignal = signal<AuthUser | null>(null);

  // Exposer l'état en lecture seule
  readonly currentUser = this.currentUserSignal.asReadonly();

  // État dérivé avec computed
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');
  readonly isCoach = computed(() =>
    this.currentUser()?.role === 'coach' || this.currentUser()?.role === 'admin'
  );
  readonly userFullName = computed(() => {
    const user = this.currentUser();
    return user ? `${user.firstName} ${user.lastName}` : '';
  });

  constructor() {
    this.loadUserFromStorage();
  }

  /**
   * Connexion
   * Appelle le endpoint /auth/login via l'API client générée
   */
  login(dto: LoginDto): Observable<LoginResponse> {
    return this.apiAuthService.authControllerLogin(dto).pipe(
      tap((response: LoginResponse) => {
        this.saveToken(response.access_token);
        this.saveUser(response.user);
        this.router.navigate(['/app/dashboard']);
      })
    );
  }

  /**
   * Inscription
   * Appelle le endpoint /auth/register via l'API client générée
   */
  register(dto: RegisterDto): Observable<RegisterResponse> {
    return this.apiAuthService.authControllerRegister(dto).pipe(
      tap((response: RegisterResponse) => {
        this.saveToken(response.access_token);
        this.saveUser(response.user);
        this.router.navigate(['/app/dashboard']);
      })
    );
  }

  /**
   * Déconnexion
   */
  logout(): void {
    localStorage.removeItem(environment.jwt.tokenKey);
    localStorage.removeItem(environment.jwt.userKey);
    this.currentUserSignal.set(null);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Récupérer le token
   */
  getToken(): string | null {
    return localStorage.getItem(environment.jwt.tokenKey);
  }

  /**
   * Vérifier si le token est valide
   */
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  /**
   * Vérifier un rôle spécifique
   */
  hasRole(role: string): boolean {
    return this.currentUser()?.role === role;
  }

  /**
   * Sauvegarder le token
   */
  saveToken(token: string): void {
    localStorage.setItem(environment.jwt.tokenKey, token);
  }

  /**
   * Sauvegarder l'utilisateur et mettre à jour le signal
   */
  saveUser(user: AuthUser): void {
    localStorage.setItem(environment.jwt.userKey, JSON.stringify(user));
    this.currentUserSignal.set(user);
  }

  /**
   * Charger l'utilisateur depuis le localStorage au démarrage
   */
  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem(environment.jwt.userKey);
    if (userStr && this.isTokenValid()) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSignal.set(user);
      } catch {
        this.logout();
      }
    }
  }
}
