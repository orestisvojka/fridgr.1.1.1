// src/context/RecipesContext.jsx
// Global state: saved recipes + user preferences

import React, { createContext, useContext, useState, useCallback } from 'react';

const RecipesContext = createContext(null);

const DEFAULT_PREFS = {
  skill: 'home_cook',
  diet: 'none',
  time: 30,
};

export function RecipesProvider({ children }) {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [preferences, setPreferences] = useState(DEFAULT_PREFS);

  const savedIds = savedRecipes.map((r) => r.id);

  const toggleSave = useCallback((recipe) => {
    setSavedRecipes((prev) => {
      const exists = prev.find((r) => r.id === recipe.id);
      return exists ? prev.filter((r) => r.id !== recipe.id) : [...prev, recipe];
    });
  }, []);

  const isSaved = useCallback(
    (id) => savedIds.includes(id),
    [savedIds]
  );

  return (
    <RecipesContext.Provider value={{ savedRecipes, savedIds, toggleSave, isSaved, preferences, setPreferences }}>
      {children}
    </RecipesContext.Provider>
  );
}

export function useRecipes() {
  const ctx = useContext(RecipesContext);
  if (!ctx) throw new Error('useRecipes must be used within RecipesProvider');
  return ctx;
}
