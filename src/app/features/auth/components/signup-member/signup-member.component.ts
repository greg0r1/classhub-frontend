import {
  Component,
  signal,
  computed,
  inject,
  ChangeDetectionStrategy,
  DestroyRef,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '@core/auth/auth.service';
import { RegisterDto } from '@app/api/generated';
import { passwordStrengthValidator, passwordMatchValidator } from '@app/shared/utils/validators';
import { calculatePasswordStrength } from '@app/shared/utils/password-strength';

@Component({
  selector: 'app-signup-member',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatAutocompleteModule,
  ],
  templateUrl: './signup-member.component.html',
  styleUrl: './signup-member.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupMemberComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  // Signals pour l'état local
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly hidePassword = signal(true);
  readonly hideConfirmPassword = signal(true);

  // Liste des organisations (mock - devrait venir de l'API)
  readonly organizations = [
    { id: 'org-1', name: 'Krav Maga Paris 15', slug: 'krav-maga-paris-15' },
    { id: 'org-2', name: 'Karaté Club Lyon', slug: 'karate-club-lyon' },
    { id: 'org-3', name: 'Boxing Academy Marseille', slug: 'boxing-academy-marseille' },
    { id: 'org-4', name: 'Judo Toulouse', slug: 'judo-toulouse' },
    { id: 'org-5', name: 'CrossFit Bordeaux', slug: 'crossfit-bordeaux' },
  ];

  // Formulaire d'inscription adhérent
  readonly memberForm = this.fb.group(
    {
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      organizationId: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8), passwordStrengthValidator()]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator('password', 'confirmPassword') }
  );

  /**
   * Computed: Force du mot de passe
   */
  readonly passwordStrength = computed(() => {
    const password = this.memberForm.get('password')?.value || '';
    if (!password) return { score: 0, level: 'weak', label: '', color: 'warn' as const };
    return calculatePasswordStrength(password);
  });

  /**
   * Soumission du formulaire
   */
  onSubmit(): void {
    if (this.memberForm.invalid) {
      this.memberForm.markAllAsTouched();
      this.snackBar.open('Veuillez remplir tous les champs requis', 'Fermer', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const selectedOrg = this.organizations.find(
      (org) => org.id === this.memberForm.value.organizationId
    );

    const dto: RegisterDto = {
      email: this.memberForm.value.email!,
      password: this.memberForm.value.password!,
      first_name: this.memberForm.value.firstName!,
      last_name: this.memberForm.value.lastName!,
      organization_id: this.memberForm.value.organizationId!,
      role: RegisterDto.RoleEnum.Member,
    };

    this.authService
      .register(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.snackBar.open(
            `✅ Bienvenue ${this.memberForm.value.firstName} ! Tu as rejoint ${selectedOrg?.name}.`,
            'Fermer',
            {
              duration: 5000,
              panelClass: ['success-snackbar'],
            }
          );
          this.isLoading.set(false);
          // Navigation gérée par le service
        },
        error: (error) => {
          this.isLoading.set(false);

          let message = "Une erreur est survenue lors de l'inscription";

          // Gérer l'erreur email déjà existant
          if (error.status === 409 || error.error?.message?.includes('already exists')) {
            message = 'Cet email est déjà utilisé dans cette organisation';
          } else if (error.error?.message) {
            message = error.error.message;
          }

          this.errorMessage.set(message);
          this.snackBar.open(message, 'Fermer', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      });
  }

  /**
   * Toggle visibilité du mot de passe
   */
  togglePasswordVisibility(): void {
    this.hidePassword.update((value) => !value);
  }

  /**
   * Toggle visibilité de la confirmation
   */
  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword.update((value) => !value);
  }

  /**
   * Messages d'erreur pour les champs
   */
  getErrorMessage(controlName: string): string {
    const control = this.memberForm.get(controlName);
    if (!control) return '';

    if (control.hasError('required')) return 'Ce champ est requis';
    if (control.hasError('email')) return 'Email invalide';
    if (control.hasError('minlength'))
      return `Minimum ${control.errors?.['minlength'].requiredLength} caractères`;
    return '';
  }

  getPasswordErrorMessage(): string {
    const control = this.memberForm.get('password');
    if (!control) return '';

    if (control.hasError('required')) return 'Le mot de passe est requis';
    if (control.hasError('minlength')) return 'Minimum 8 caractères';
    if (control.hasError('passwordStrength'))
      return 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre';
    return '';
  }

  getConfirmPasswordErrorMessage(): string {
    const control = this.memberForm.get('confirmPassword');
    if (!control) return '';

    if (control.hasError('required')) return 'La confirmation est requise';
    if (this.memberForm.hasError('passwordMismatch'))
      return 'Les mots de passe ne correspondent pas';
    return '';
  }
}
