/** Human-readable labels for onboarding answers on Profile */

export const REFERRAL_LABELS = {
  social: 'Social media',
  friend: 'Friend or family',
  search: 'Search or AI',
  podcast: 'Podcast or ad',
  app_store: 'App Store',
  other: 'Other',
};

export const GOAL_LABELS = {
  cook_from_fridge: 'Cook from what I have',
  save_money: 'Save money',
  eat_healthy: 'Eat healthier',
  reduce_waste: 'Reduce waste',
  build_muscle: 'Build muscle',
  quick_meals: 'Quick meals',
  high_protein: 'High protein',
};

export const DIET_LABELS = {
  none: 'No preference',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  keto: 'Keto',
  high_protein_diet: 'High protein',
  low_carb: 'Low carb',
  gluten_free: 'Gluten free',
  dairy_free: 'Dairy free',
  halal: 'Halal',
};

export const SKILL_LABELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export const TIME_LABELS = {
  10: 'Under 10 min',
  20: '10–20 min',
  30: 'Under 30 min',
  40: '20–40 min',
  '60plus': '40+ min',
  unlimited: 'No limit',
};

export const ALLERGY_LABELS = {
  nuts: 'Nuts',
  dairy: 'Dairy',
  eggs: 'Eggs',
  seafood: 'Seafood',
  shellfish: 'Shellfish',
  gluten: 'Gluten',
  soy: 'Soy',
  pork: 'Pork',
};

export function formatAllergyList(allergies) {
  if (!allergies?.length || allergies.includes('none')) return 'None';
  return allergies
    .filter((a) => a !== 'none')
    .map((a) => ALLERGY_LABELS[a] || a)
    .join(', ');
}

export function formatMealsFocus(list) {
  if (!list?.length) return 'Not set';
  const M = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snacks: 'Snacks',
    desserts: 'Desserts',
    meal_prep: 'Meal prep',
  };
  return list.map((id) => M[id] || id).join(', ');
}
