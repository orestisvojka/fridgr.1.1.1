import { MOCK_RECIPES } from '../data/mockData';
import { getRecipeImageUrl } from '../data/recipeImages';

/** Merge a partial stored recipe with catalog data (images, ingredients, etc.). */
export function mergeRecipeWithCatalog(partial) {
  if (!partial?.id) return null;
  const catalog = MOCK_RECIPES.find((r) => r.id === partial.id);
  if (!catalog) {
    return {
      ...partial,
      imageUrl: getRecipeImageUrl(partial.id),
    };
  }
  return {
    ...catalog,
    ...partial,
    imageUrl: catalog.imageUrl || getRecipeImageUrl(partial.id),
  };
}

/** Deduplicate by recipe id (last wins). */
export function dedupeRecipesById(recipes) {
  const map = new Map();
  for (const r of recipes) {
    if (r?.id) map.set(r.id, r);
  }
  return Array.from(map.values());
}

/**
 * Merge AsyncStorage payload with in-memory saves. In-memory wins on conflicts
 * (fixes race where user saves while hydration is still loading).
 */
export function mergeHydrationLists(fromStorage, fromMemory) {
  const full = [];
  const seen = new Set();
  for (const r of fromMemory) {
    if (r?.id) {
      seen.add(r.id);
      const m = mergeRecipeWithCatalog(r);
      if (m) full.push(m);
    }
  }
  for (const r of fromStorage) {
    if (r?.id && !seen.has(r.id)) {
      const m = mergeRecipeWithCatalog(r);
      if (m) full.push(m);
    }
  }
  return full;
}
