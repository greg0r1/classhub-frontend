import {
  Component,
  signal,
  computed,
  inject,
  ChangeDetectionStrategy,
  DestroyRef,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '@core/auth/auth.service';
import { RegisterDto } from '@app/api/generated';
import { generateSlug } from '@app/shared/utils/slug-generator';
import {
  passwordStrengthValidator,
  passwordMatchValidator,
  slugValidator,
} from '@app/shared/utils/validators';
import { calculatePasswordStrength } from '@app/shared/utils/password-strength';

@Component({
  selector: 'app-signup-organization',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatCardModule,
  ],
  templateUrl: './signup-organization.component.html',
  styleUrl: './signup-organization.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupOrganizationComponent {
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

  // Types de sport disponibles
  readonly sportTypes = [
    'Krav Maga',
    'Karaté',
    'Boxing',
    'Judo',
    'CrossFit',
    'Yoga',
    'Muay Thaï',
    'Taekwondo',
    'Jiu-Jitsu',
    'MMA',
    'Autre',
  ];

  // Step 1: Informations Organisation
  readonly organizationForm = this.fb.group({
    organizationName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    slug: ['', [Validators.required, Validators.minLength(2), slugValidator()]],
    contactEmail: ['', [Validators.required, Validators.email]],
    sportType: ['', [Validators.required]],
    city: [''],
  });

  // Step 2: Compte Admin
  readonly adminForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    adminEmail: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.pattern(/^(\+33|0)[1-9](\d{2}){4}$/)]],
  });

  // Step 3: Mot de passe
  readonly passwordForm = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(8), passwordStrengthValidator()]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]],
    },
    { validators: passwordMatchValidator('password', 'confirmPassword') }
  );

  /**
   * Computed: Force du mot de passe
   */
  readonly passwordStrength = computed(() => {
    const password = this.passwordForm.get('password')?.value || '';
    if (!password) return { score: 0, level: 'weak', label: '', color: 'warn' as const };
    return calculatePasswordStrength(password);
  });

  /**
   * Auto-génération du slug à partir du nom d'organisation
   */
  constructor() {
    this.organizationForm.get('organizationName')?.valueChanges.subscribe((name) => {
      if (name && !this.organizationForm.get('slug')?.dirty) {
        this.organizationForm.patchValue({
          slug: generateSlug(name),
        });
      }
    });
  }

  /**
   * Soumission finale du formulaire
   */
  onSubmit(): void {
    if (
      this.organizationForm.invalid ||
      this.adminForm.invalid ||
      this.passwordForm.invalid
    ) {
      this.organizationForm.markAllAsTouched();
      this.adminForm.markAllAsTouched();
      this.passwordForm.markAllAsTouched();
      this.snackBar.open('Veuillez remplir tous les champs requis', 'Fermer', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Créer un UUID temporaire pour l'organisation
    // TODO: Le backend devrait créer l'organisation automatiquement
    const orgId = crypto.randomUUID();

    const dto: RegisterDto = {
      // Données admin
      email: this.adminForm.value.adminEmail!,
      password: this.passwordForm.value.password!,
      first_name: this.adminForm.value.firstName!,
      last_name: this.adminForm.value.lastName!,
      phone: this.adminForm.value.phoneNumber || undefined,

      // Organisation (UUID temporaire)
      organization_id: orgId,

      // Rôle: admin pour créateur d'organisation
      role: RegisterDto.RoleEnum.Admin,
    };

    this.authService
      .register(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.snackBar.open(
            `✅ Bienvenue sur ClassHub ! Votre club "${this.organizationForm.value.organizationName}" a été créé avec succès.`,
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
          const message =
            error.error?.message ||
            "Une erreur est survenue lors de la création de votre club. Veuillez réessayer.";
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
  getErrorMessage(form: any, controlName: string): string {
    const control = form.get(controlName);
    if (!control) return '';

    if (control.hasError('required')) return 'Ce champ est requis';
    if (control.hasError('email')) return 'Email invalide';
    if (control.hasError('minlength'))
      return `Minimum ${control.errors?.['minlength'].requiredLength} caractères`;
    if (control.hasError('maxlength'))
      return `Maximum ${control.errors?.['maxlength'].requiredLength} caractères`;
    if (control.hasError('pattern')) return 'Format invalide';
    if (control.hasError('invalidSlug'))
      return 'Slug invalide (minuscules, chiffres et tirets uniquement)';
    return '';
  }

  getPasswordErrorMessage(): string {
    const control = this.passwordForm.get('password');
    if (!control) return '';

    if (control.hasError('required')) return 'Le mot de passe est requis';
    if (control.hasError('minlength')) return 'Minimum 8 caractères';
    if (control.hasError('passwordStrength'))
      return 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre';
    return '';
  }

  getConfirmPasswordErrorMessage(): string {
    const control = this.passwordForm.get('confirmPassword');
    if (!control) return '';

    if (control.hasError('required')) return 'La confirmation est requise';
    if (this.passwordForm.hasError('passwordMismatch'))
      return 'Les mots de passe ne correspondent pas';
    return '';
  }
}
