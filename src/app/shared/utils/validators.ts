/**
 * Utilitaires de validation pour les formulaires
 * Utilisés dans les formulaires d'authentification et d'inscription
 */

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Valide un email
 * @param email Email à valider
 * @returns true si valide, false sinon
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valide un mot de passe
 * Critères: min 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
 * @param password Mot de passe à valider
 * @returns Objet avec isValid et errors
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }

  if (!/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Valide un slug (pour nom d'organisation)
 * Format: minuscules, chiffres et tirets uniquement
 * @param slug Slug à valider
 * @returns true si valide, false sinon
 */
export function validateSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9-]+$/;
  return slugRegex.test(slug) && slug.length >= 2;
}

/**
 * Valide un nom d'organisation
 * @param name Nom à valider
 * @returns true si valide, false sinon
 */
export function validateOrganizationName(name: string): boolean {
  return name.length >= 2 && name.length <= 100;
}

/**
 * Vérifie que deux mots de passe correspondent
 * @param password1 Premier mot de passe
 * @param password2 Second mot de passe
 * @returns true si identiques, false sinon
 */
export function validatePasswordMatch(password1: string, password2: string): boolean {
  return password1 === password2;
}

// ==================== Validators Angular ====================

/**
 * Validator Angular pour la force du mot de passe
 */
export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value || '';
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumeric = /\d/.test(password);

    const valid = hasUpperCase && hasLowerCase && hasNumeric && password.length >= 8;
    return valid ? null : { passwordStrength: true };
  };
}

/**
 * Validator Angular pour la correspondance de mots de passe
 * À utiliser au niveau du FormGroup
 */
export function passwordMatchValidator(
  passwordField: string = 'password',
  confirmField: string = 'confirmPassword'
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get(passwordField)?.value;
    const confirmPassword = control.get(confirmField)?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  };
}

/**
 * Validator Angular pour le slug
 */
export function slugValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const slug = control.value || '';
    const valid = validateSlug(slug);
    return valid ? null : { invalidSlug: true };
  };
}

/**
 * Validator Angular pour le téléphone français
 */
export function frenchPhoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const phone = control.value || '';
    if (!phone) return null; // Optionnel

    const phoneRegex = /^(\+33|0)[1-9](\d{2}){4}$/;
    const valid = phoneRegex.test(phone.replace(/\s/g, ''));
    return valid ? null : { invalidPhone: true };
  };
}
