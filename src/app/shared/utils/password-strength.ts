/**
 * Utilitaires pour calculer la force d'un mot de passe
 */

export interface PasswordStrengthResult {
  score: number; // 0-100
  level: 'weak' | 'medium' | 'strong' | 'very-strong';
  label: string;
  color: 'warn' | 'accent' | 'primary';
  feedback: string[];
}

/**
 * Calcule la force d'un mot de passe
 * @param password Mot de passe à analyser
 * @returns Résultat avec score, niveau, label et feedback
 *
 * @example
 * calculatePasswordStrength("abc123") // { score: 20, level: "weak", ... }
 * calculatePasswordStrength("MyP@ssw0rd!2024") // { score: 95, level: "very-strong", ... }
 */
export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  let score = 0;
  const feedback: string[] = [];

  if (!password) {
    return {
      score: 0,
      level: 'weak',
      label: 'Très faible',
      color: 'warn',
      feedback: ['Veuillez saisir un mot de passe'],
    };
  }

  // Longueur (max 40 points)
  if (password.length >= 8) {
    score += 15;
  } else {
    feedback.push('Utilisez au moins 8 caractères');
  }

  if (password.length >= 12) {
    score += 10;
  }

  if (password.length >= 16) {
    score += 10;
  }

  if (password.length >= 20) {
    score += 5;
  }

  // Majuscules (15 points)
  if (/[A-Z]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Ajoutez au moins une lettre majuscule');
  }

  // Minuscules (15 points)
  if (/[a-z]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Ajoutez au moins une lettre minuscule');
  }

  // Chiffres (15 points)
  if (/\d/.test(password)) {
    score += 15;
  } else {
    feedback.push('Ajoutez au moins un chiffre');
  }

  // Caractères spéciaux (15 points)
  if (/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/'`~;]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Ajoutez un caractère spécial (!@#$%...)');
  }

  // Diversité des caractères (bonus 10 points)
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= password.length * 0.6) {
    score += 5;
  }

  if (uniqueChars >= password.length * 0.8) {
    score += 5;
  }

  // Pénalités
  // Séquences répétitives (ex: "aaa", "111")
  if (/(.)\1{2,}/.test(password)) {
    score -= 10;
    feedback.push('Évitez les caractères répétitifs');
  }

  // Séquences communes (ex: "123", "abc")
  if (
    /123|234|345|456|567|678|789|abc|bcd|cde|def|efg|fgh|ghi|qwerty|azerty/i.test(
      password
    )
  ) {
    score -= 10;
    feedback.push('Évitez les séquences communes');
  }

  // Mots de passe communs
  const commonPasswords = [
    'password',
    'motdepasse',
    'admin',
    'user',
    'root',
    'welcome',
    'bienvenue',
  ];
  if (commonPasswords.some((common) => password.toLowerCase().includes(common))) {
    score -= 20;
    feedback.push('Évitez les mots de passe courants');
  }

  // Limiter le score entre 0 et 100
  score = Math.max(0, Math.min(100, score));

  // Déterminer le niveau
  let level: PasswordStrengthResult['level'];
  let label: string;
  let color: PasswordStrengthResult['color'];

  if (score < 40) {
    level = 'weak';
    label = 'Faible';
    color = 'warn';
  } else if (score < 60) {
    level = 'medium';
    label = 'Moyen';
    color = 'accent';
  } else if (score < 80) {
    level = 'strong';
    label = 'Fort';
    color = 'primary';
  } else {
    level = 'very-strong';
    label = 'Très fort';
    color = 'primary';
  }

  return {
    score,
    level,
    label,
    color,
    feedback,
  };
}

/**
 * Estime le temps pour cracker un mot de passe
 * @param password Mot de passe
 * @returns Estimation du temps de crack
 */
export function estimateCrackTime(password: string): string {
  const possibleChars = calculateCharsetSize(password);
  const combinations = Math.pow(possibleChars, password.length);

  // Assume 10 billion attempts per second (modern GPU)
  const attemptsPerSecond = 10_000_000_000;
  const secondsToCrack = combinations / attemptsPerSecond / 2; // Divisé par 2 pour moyenne

  if (secondsToCrack < 1) return 'Instantané';
  if (secondsToCrack < 60) return `${Math.round(secondsToCrack)} secondes`;
  if (secondsToCrack < 3600) return `${Math.round(secondsToCrack / 60)} minutes`;
  if (secondsToCrack < 86400) return `${Math.round(secondsToCrack / 3600)} heures`;
  if (secondsToCrack < 31536000)
    return `${Math.round(secondsToCrack / 86400)} jours`;
  if (secondsToCrack < 3153600000)
    return `${Math.round(secondsToCrack / 31536000)} ans`;

  return 'Plusieurs siècles';
}

/**
 * Calcule la taille du charset utilisé
 */
function calculateCharsetSize(password: string): number {
  let size = 0;

  if (/[a-z]/.test(password)) size += 26; // Minuscules
  if (/[A-Z]/.test(password)) size += 26; // Majuscules
  if (/\d/.test(password)) size += 10; // Chiffres
  if (/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/'`~;]/.test(password)) size += 32; // Spéciaux

  return size || 1;
}

/**
 * Génère un mot de passe fort aléatoire
 * @param length Longueur souhaitée (défaut: 16)
 * @returns Mot de passe généré
 */
export function generateStrongPassword(length: number = 16): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  const allChars = lowercase + uppercase + numbers + special;

  // Garantir au moins un caractère de chaque type
  let password = '';
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Remplir le reste aléatoirement
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Mélanger les caractères
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}
