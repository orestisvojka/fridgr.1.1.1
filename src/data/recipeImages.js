// High-quality Unsplash food photography (stable CDN URLs, cropped for cards)
const Q = 'w=1200&q=85&auto=format&fit=crop';

export const RECIPE_IMAGE_URLS = {
  r1: `https://images.unsplash.com/photo-1596797038530-2c107229654b?${Q}`,
  r2: `https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?${Q}`,
  r3: `https://images.unsplash.com/photo-1525351484163-7529414344d8?${Q}`,
  r4: `https://images.unsplash.com/photo-1603133872878-684f208fb84b?${Q}`,
  r5: `https://images.unsplash.com/photo-1512058564366-18510be2db9a?${Q}`,
  r6: `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?${Q}`,
  r7: `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?${Q}`,
  r8: `https://images.unsplash.com/photo-1473093295043-cdd812d0e601?${Q}`,
  r9: `https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?${Q}`,
  r10: `https://images.unsplash.com/photo-1467003909585-2f8a72700288?${Q}`,
  r11: `https://images.unsplash.com/photo-1565299585323-38d6b0865b47?${Q}`,
  r12: `https://images.unsplash.com/photo-1476124369491-e7add408a792?${Q}`,
  r13: `https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?${Q}`,
  r14: `https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?${Q}`,
  r15: `https://images.unsplash.com/photo-1512621776951-a57141f2eefd?${Q}`,
  r16: `https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?${Q}`,
  r17: `https://images.unsplash.com/photo-1473093295043-cdd812d0e601?${Q}`,
  r18: `https://images.unsplash.com/photo-1547592166-23ac45744acd?${Q}`,
  r19: `https://images.unsplash.com/photo-1510627489930-0c1b0ba94488?${Q}`,
  r20: `https://images.unsplash.com/photo-1541518138351-3c889a247f8c?${Q}`,
};

export const DEFAULT_RECIPE_IMAGE = `https://images.unsplash.com/photo-1490645935967-10de6ba17061?${Q}`;

export function getRecipeImageUrl(recipeId) {
  if (!recipeId) return DEFAULT_RECIPE_IMAGE;
  return RECIPE_IMAGE_URLS[recipeId] || DEFAULT_RECIPE_IMAGE;
}
