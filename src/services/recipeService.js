// src/services/recipeService.js
// Core logic: match user ingredients to recipes

import { mockRecipes } from '../data/mockRecipes';
import { analyzeIngredients } from '../utils/helpers';
import { MAX_RECIPES_SHOWN } from '../utils/constants';
import { recipePalettes } from '../styles/theme';

/**
 * Given an array of user ingredient strings,
 * returns the top N best-matching recipes, enriched with:
 *   - missing / available arrays
 *   - matchScore (0–1)
 *   - palette (color, bg)
 *   - paletteIndex
 */
export function findMatchingRecipes(userIngredients, limit = MAX_RECIPES_SHOWN) {
  if (!userIngredients || userIngredients.length === 0) return [];

  const enriched = mockRecipes.map((recipe, idx) => {
    const { available, missing, matchScore } = analyzeIngredients(
      userIngredients,
      recipe.ingredients
    );
    return {
      ...recipe,
      available,
      missing,
      matchScore,
      missingCount: missing.length,
      palette: recipePalettes[idx % recipePalettes.length],
      paletteIndex: idx % recipePalettes.length,
    };
  });

  // Sort: highest matchScore first, then lowest prepTime, then fewest missing
  const sorted = enriched.sort((a, b) => {
    if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
    if (a.missingCount !== b.missingCount) return a.missingCount - b.missingCount;
    return a.prepTime - b.prepTime;
  });

  // Only return recipes with at least 1 matching ingredient
  const filtered = sorted.filter((r) => r.available.length > 0);

  // If nothing matches at all, fall back to all recipes sorted by prep time
  const pool = filtered.length > 0 ? filtered : sorted;

  return pool.slice(0, limit);
}

/**
 * Returns a single recipe by ID (with palette applied)
 */
export function getRecipeById(id) {
  const idx = mockRecipes.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  return {
    ...mockRecipes[idx],
    palette: recipePalettes[idx % recipePalettes.length],
  };
}

/**
 * Returns all recipes (e.g. for browse/explore)
 */
export function getAllRecipes() {
  return mockRecipes.map((recipe, idx) => ({
    ...recipe,
    palette: recipePalettes[idx % recipePalettes.length],
  }));
}
