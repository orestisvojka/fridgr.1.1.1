// src/context/RecipesContext.jsx
import React, { createContext, useContext, useReducer, useCallback } from 'react';

const RecipesContext = createContext(null);

const initialState = {
  savedRecipes: [],
  recentScans: [],
  lastIngredients: [],
  preferences: { skill: null, diet: null, time: null },
};

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_SAVE': {
      const exists = state.savedRecipes.find(r => r.id === action.recipe.id);
      return {
        ...state,
        savedRecipes: exists
          ? state.savedRecipes.filter(r => r.id !== action.recipe.id)
          : [action.recipe, ...state.savedRecipes].slice(0, 50),
      };
    }
    case 'ADD_RECENT_SCAN': {
      const scan = {
        id: `scan_${Date.now()}`,
        ingredients: action.ingredients,
        timestamp: new Date().toISOString(),
        recipeCount: action.recipeCount || 0,
      };
      return {
        ...state,
        recentScans: [scan, ...state.recentScans].slice(0, 20),
        lastIngredients: action.ingredients,
      };
    }
    case 'SET_PREFERENCES':
      return { ...state, preferences: { ...state.preferences, ...action.preferences } };
    case 'CLEAR_SAVED':
      return { ...state, savedRecipes: [] };
    default:
      return state;
  }
}

export function RecipesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const toggleSave = useCallback((recipe) => {
    dispatch({ type: 'TOGGLE_SAVE', recipe });
  }, []);

  const isSaved = useCallback((id) => {
    return state.savedRecipes.some(r => r.id === id);
  }, [state.savedRecipes]);

  const addRecentScan = useCallback((ingredients, recipeCount) => {
    dispatch({ type: 'ADD_RECENT_SCAN', ingredients, recipeCount });
  }, []);

  const setPreferences = useCallback((preferences) => {
    dispatch({ type: 'SET_PREFERENCES', preferences });
  }, []);

  return (
    <RecipesContext.Provider value={{
      savedRecipes: state.savedRecipes,
      recentScans: state.recentScans,
      lastIngredients: state.lastIngredients,
      preferences: state.preferences,
      toggleSave,
      isSaved,
      addRecentScan,
      setPreferences,
      savedCount: state.savedRecipes.length,
      savedIds: state.savedRecipes.map(r => r.id),
    }}>
      {children}
    </RecipesContext.Provider>
  );
}

export function useRecipes() {
  const ctx = useContext(RecipesContext);
  if (!ctx) throw new Error('useRecipes must be used within RecipesProvider');
  return ctx;
}

export default RecipesContext;
