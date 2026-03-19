// src/services/recipeService.js
import { MOCK_RECIPES } from '../data/mockData';
import { COLORS } from '../constants/theme';

function normalizeIngredient(ingredient) {
  return ingredient
    .toLowerCase()
    .trim()
    .replace(/\b(a|an|the|some|few|piece of|cup of|tbsp|tsp|g|kg|lb|oz)\b/gi, '')
    .replace(/s$/, '')
    .trim();
}

function ingredientsMatch(userIngredient, recipeIngredient) {
  const a = normalizeIngredient(userIngredient);
  const b = normalizeIngredient(recipeIngredient);
  if (!a || !b) return false;
  return (
    a === b ||
    a.includes(b) ||
    b.includes(a) ||
    (a.length > 3 && b.length > 3 && (a.startsWith(b.slice(0, 4)) || b.startsWith(a.slice(0, 4))))
  );
}

function analyzeIngredients(userIngredients, recipeIngredients) {
  const available = [];
  const missing   = [];
  for (const recipeIng of recipeIngredients) {
    const found = userIngredients.some(ui => ingredientsMatch(ui, recipeIng));
    if (found) available.push(recipeIng);
    else        missing.push(recipeIng);
  }
  const matchScore = recipeIngredients.length > 0 ? available.length / recipeIngredients.length : 0;
  return { available, missing, matchScore };
}

export function findMatchingRecipes(userIngredients, limit = 8) {
  if (!userIngredients || userIngredients.length === 0) return [];

  const results = MOCK_RECIPES.map((recipe, index) => {
    const { available, missing, matchScore } = analyzeIngredients(userIngredients, recipe.ingredients);
    const palette = COLORS.recipePalettes[index % COLORS.recipePalettes.length];
    return {
      recipe: { ...recipe, palette },
      matchScore,
      availableIngredients: available,
      missingIngredients:   missing,
    };
  });

  const filtered = results.filter(r => r.matchScore > 0);
  const pool = filtered.length > 0 ? filtered : results;

  return pool
    .sort((a, b) => {
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      if (a.missingIngredients.length !== b.missingIngredients.length)
        return a.missingIngredients.length - b.missingIngredients.length;
      return a.recipe.prepTime - b.recipe.prepTime;
    })
    .slice(0, limit);
}

export function getRecipeById(id) {
  const index = MOCK_RECIPES.findIndex(r => r.id === id);
  if (index === -1) return null;
  return { ...MOCK_RECIPES[index], palette: COLORS.recipePalettes[index % COLORS.recipePalettes.length] };
}

export function getAllRecipes() {
  return MOCK_RECIPES.map((recipe, index) => ({
    ...recipe,
    palette: COLORS.recipePalettes[index % COLORS.recipePalettes.length],
  }));
}

export function filterRecipesByDiet(recipes, diet) {
  if (!diet || diet === 'none') return recipes;
  return recipes.filter(r => {
    if (diet === 'vegetarian' || diet === 'vegan') return r.tags?.includes('vegetarian');
    if (diet === 'high_protein') return r.macros?.protein >= 20;
    if (diet === 'low_carb') return r.macros?.carbs <= 20;
    return true;
  });
}

export function filterRecipesByTime(recipes, maxTime) {
  if (!maxTime || maxTime === 'unlimited') return recipes;
  const limit = parseInt(maxTime, 10);
  return recipes.filter(r => r.prepTime <= limit);
}
