import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '@core/auth/auth.service';
import { RegisterDto } from '@app/api/generated';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSnackBarModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  // Signals pour l'état local
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly hidePassword = signal(true);
  readonly hideConfirmPassword = signal(true);

  // Step 1: Informations personnelles
  readonly personalInfoForm = this.fb.group({
    organizationName: ['', [Validators.required, Validators.minLength(2)]],
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.pattern(/^(\+33|0)[1-9](\d{2}){4}$/)]],
  });

  // Step 2: Mot de passe
  readonly passwordForm = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator }
  );

  /**
   * Computed: Force du mot de passe (0-100)
   */
  readonly passwordStrength = computed(() => {
    const password = this.passwordForm.get('password')?.value || '';
    if (!password) return 0;

    let strength = 0;
    // Longueur
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 15;
    // Majuscules
    if (/[A-Z]/.test(password)) strength += 20;
    // Minuscules
    if (/[a-z]/.test(password)) strength += 20;
    // Chiffres
    if (/\d/.test(password)) strength += 10;
    // Caractères spéciaux
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 10;

    return Math.min(strength, 100);
  });

  /**
   * Computed: Couleur de la barre de force
   */
  readonly passwordStrengthColor = computed(() => {
    const strength = this.passwordStrength();
    if (strength < 40) return 'warn';
    if (strength < 70) return 'accent';
    return 'primary';
  });

  /**
   * Computed: Label de force du mot de passe
   */
  readonly passwordStrengthLabel = computed(() => {
    const strength = this.passwordStrength();
    if (strength === 0) return '';
    if (strength < 40) return 'Faible';
    if (strength < 70) return 'Moyen';
    return 'Fort';
  });

  /**
   * Validation personnalisée: force du mot de passe
   */
  private passwordStrengthValidator(control: AbstractControl) {
    const password = control.value || '';
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumeric = /\d/.test(password);

    const valid = hasUpperCase && hasLowerCase && hasNumeric;
    return valid ? null : { passwordStrength: true };
  }

  /**
   * Validation personnalisée: correspondance des mots de passe
   */
  private passwordMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  /**
   * Soumission du formulaire d'inscription
   */
  onSubmit(): void {
    if (this.personalInfoForm.invalid || this.passwordForm.invalid) {
      this.personalInfoForm.markAllAsTouched();
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    // TEMPORARY: Generate a UUID for the organization
    // TODO: Le backend devrait créer l'organisation automatiquement ou fournir un endpoint dédié
    const tempOrgId = crypto.randomUUID();

    const dto: RegisterDto = {
      email: this.personalInfoForm.value.email!,
      password: this.passwordForm.value.password!,
      first_name: this.personalInfoForm.value.firstName!,
      last_name: this.personalInfoForm.value.lastName!,
      phone: this.personalInfoForm.value.phoneNumber || undefined,
      organization_id: tempOrgId, // TEMPORARY: UUID généré côté client
      role: RegisterDto.RoleEnum.Member,
    };

    this.authService
      .register(dto)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: () => {
          this.snackBar.open('Inscription réussie ! Bienvenue sur ClassHub.', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
          this.isLoading.set(false);
          // Navigation gérée par le service
        },
        error: (error) => {
          this.isLoading.set(false);
          const message =
            error.error?.message ||
            'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.';
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
   * Getters pour la validation
   */
  get organizationNameControl() {
    return this.personalInfoForm.get('organizationName');
  }

  get firstNameControl() {
    return this.personalInfoForm.get('firstName');
  }

  get lastNameControl() {
    return this.personalInfoForm.get('lastName');
  }

  get emailControl() {
    return this.personalInfoForm.get('email');
  }

  get phoneControl() {
    return this.personalInfoForm.get('phoneNumber');
  }

  get passwordControl() {
    return this.passwordForm.get('password');
  }

  get confirmPasswordControl() {
    return this.passwordForm.get('confirmPassword');
  }

  /**
   * Messages d'erreur
   */
  getErrorMessage(controlName: string): string {
    const control = this.personalInfoForm.get(controlName);
    if (!control) return '';

    if (control.hasError('required')) return 'Ce champ est requis';
    if (control.hasError('email')) return 'Email invalide';
    if (control.hasError('minlength'))
      return `Minimum ${control.errors?.['minlength'].requiredLength} caractères`;
    if (control.hasError('pattern')) return 'Format invalide';
    return '';
  }

  getPasswordErrorMessage(): string {
    if (this.passwordControl?.hasError('required')) return 'Le mot de passe est requis';
    if (this.passwordControl?.hasError('minlength')) return 'Minimum 8 caractères';
    if (this.passwordControl?.hasError('passwordStrength'))
      return 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre';
    return '';
  }

  getConfirmPasswordErrorMessage(): string {
    if (this.confirmPasswordControl?.hasError('required'))
      return 'La confirmation est requise';
    if (this.passwordForm.hasError('passwordMismatch'))
      return 'Les mots de passe ne correspondent pas';
    return '';
  }
}
