// src/utils/helpers.js

/**
 * Normalizes an ingredient string:
 * lowercase, trimmed, singular-ish
 */
export function normalizeIngredient(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    // strip common quantity words
    .replace(/\b(some|a|an|the|fresh|dried|cooked|raw|frozen)\b/g, '')
    .trim();
}

/**
 * Checks if two ingredient strings are a fuzzy match
 */
export function ingredientsMatch(a, b) {
  const na = normalizeIngredient(a);
  const nb = normalizeIngredient(b);
  return na === nb || na.includes(nb) || nb.includes(na);
}

/**
 * Given user ingredients and recipe ingredients, returns
 * { available: [], missing: [], matchScore: number }
 */
export function analyzeIngredients(userIngredients, recipeIngredients) {
  const available = [];
  const missing = [];

  recipeIngredients.forEach((ri) => {
    const found = userIngredients.some((ui) => ingredientsMatch(ui, ri));
    if (found) available.push(ri);
    else missing.push(ri);
  });

  const matchScore = recipeIngredients.length > 0
    ? available.length / recipeIngredients.length
    : 0;

  return { available, missing, matchScore };
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Formats prep time nicely
 */
export function formatPrepTime(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/**
 * Truncates text to maxLength with ellipsis
 */
export function truncate(str, maxLength = 80) {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength).trim() + '…';
}

/**
 * Generates a simple unique ID
 */
export function uid() {
  return Math.random().toString(36).slice(2, 9);
}
