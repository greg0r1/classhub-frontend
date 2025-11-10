/**
 * Générateur de slugs pour les noms d'organisations
 * Convertit un nom en slug URL-friendly
 */

/**
 * Génère un slug à partir d'un texte
 * @param text Texte source (ex: "Mon Club de Karaté")
 * @returns Slug formaté (ex: "mon-club-de-karate")
 *
 * @example
 * generateSlug("Mon Club de Karaté") // "mon-club-de-karate"
 * generateSlug("L'Équipe de Paris") // "l-equipe-de-paris"
 * generateSlug("Club@Sport#2024") // "club-sport-2024"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase() // Convertir en minuscules
    .normalize('NFD') // Décomposer les caractères accentués
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^a-z0-9\s-]/g, '') // Supprimer caractères spéciaux sauf espaces et tirets
    .trim() // Supprimer espaces début/fin
    .replace(/\s+/g, '-') // Remplacer espaces par tirets
    .replace(/-+/g, '-') // Remplacer tirets multiples par un seul
    .replace(/^-|-$/g, ''); // Supprimer tirets début/fin
}

/**
 * Génère un slug unique en ajoutant un suffixe numérique si nécessaire
 * @param text Texte source
 * @param existingSlugs Liste des slugs existants
 * @returns Slug unique
 *
 * @example
 * generateUniqueSlug("Mon Club", ["mon-club"]) // "mon-club-2"
 * generateUniqueSlug("Mon Club", ["mon-club", "mon-club-2"]) // "mon-club-3"
 */
export function generateUniqueSlug(text: string, existingSlugs: string[]): string {
  const baseSlug = generateSlug(text);

  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  let counter = 2;
  let uniqueSlug = `${baseSlug}-${counter}`;

  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }

  return uniqueSlug;
}

/**
 * Vérifie si un slug est valide
 * @param slug Slug à vérifier
 * @returns true si valide, false sinon
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && slug.length >= 2 && slug.length <= 100;
}

/**
 * Suggère des slugs alternatifs
 * @param text Texte source
 * @param count Nombre de suggestions
 * @returns Liste de slugs suggérés
 *
 * @example
 * suggestSlugs("Mon Club") // ["mon-club", "mon-club-sport", "club"]
 */
export function suggestSlugs(text: string, count: number = 3): string[] {
  const baseSlug = generateSlug(text);
  const suggestions: string[] = [baseSlug];

  const words = text.toLowerCase().split(/\s+/);

  // Ajouter des variantes
  if (words.length > 1) {
    // Premier mot uniquement
    suggestions.push(generateSlug(words[0]));

    // Derniers mots
    suggestions.push(generateSlug(words.slice(-2).join(' ')));

    // Initiales
    const initials = words.map((w) => w[0]).join('');
    suggestions.push(initials);
  }

  // Retourner uniquement les slugs valides et uniques
  return [...new Set(suggestions)]
    .filter((s) => isValidSlug(s))
    .slice(0, count);
}
