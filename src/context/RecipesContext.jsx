// src/context/RecipesContext.jsx
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { dedupeRecipesById, mergeRecipeWithCatalog, mergeHydrationLists } from '../utils/recipeHelpers';

const STORAGE_PREFIX = '@fridgr_saved_recipes_v3_';
/** Legacy key before per-email user ids — migrate once if new key is empty */
const LEGACY_SAVED_KEY = '@fridgr_saved_recipes_v3_u1';

const RecipesContext = createContext(null);

const initialState = {
  savedRecipes: [],
  recentScans: [],
  lastIngredients: [],
  preferences: { skill: null, diet: null, time: null },
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SAVED':
      return { ...state, savedRecipes: dedupeRecipesById(action.recipes) };
    case 'HYDRATE_SAVED':
      return {
        ...state,
        savedRecipes: mergeHydrationLists(action.recipes, state.savedRecipes),
      };
    case 'TOGGLE_SAVE': {
      const { recipe } = action;
      if (!recipe?.id) return state;
      const exists = state.savedRecipes.some((r) => r.id === recipe.id);
      const merged = mergeRecipeWithCatalog(recipe);
      if (!merged) return state;
      let next;
      if (exists) {
        next = state.savedRecipes.filter((r) => r.id !== recipe.id);
      } else {
        next = dedupeRecipesById([merged, ...state.savedRecipes]);
      }
      return { ...state, savedRecipes: next };
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

function storageKey(userId) {
  return `${STORAGE_PREFIX}${userId}`;
}

export function RecipesProvider({ children }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydration, setHydration] = useState('idle'); // idle | loading | ready | error
  const [persistError, setPersistError] = useState(null);
  const skipNextPersist = useRef(false);
  const prevUserIdRef = useRef(null);

  const userId = user?.id ?? null;

  // Load saved recipes when user changes
  useEffect(() => {
    let cancelled = false;

    if (!userId) {
      skipNextPersist.current = true;
      prevUserIdRef.current = null;
      dispatch({ type: 'SET_SAVED', recipes: [] });
      setHydration('ready');
      setPersistError(null);
      return undefined;
    }

    const switchedAccount =
      prevUserIdRef.current !== null && prevUserIdRef.current !== userId;
    if (switchedAccount) {
      dispatch({ type: 'CLEAR_SAVED' });
    }
    prevUserIdRef.current = userId;

    (async () => {
      setHydration('loading');
      setPersistError(null);
      try {
        let raw = await AsyncStorage.getItem(storageKey(userId));
        if (!raw) {
          const legacy = await AsyncStorage.getItem(LEGACY_SAVED_KEY);
          if (legacy) {
            raw = legacy;
            await AsyncStorage.setItem(storageKey(userId), legacy);
          }
        }
        if (cancelled) return;
        const parsed = raw ? JSON.parse(raw) : [];
        const list = Array.isArray(parsed) ? parsed : [];
        const fromStorage = dedupeRecipesById(
          list.map((item) => mergeRecipeWithCatalog(item)).filter(Boolean),
        );
        dispatch({ type: 'HYDRATE_SAVED', recipes: fromStorage });
        if (!cancelled) setHydration('ready');
      } catch (e) {
        if (!cancelled) {
          setHydration('error');
          setPersistError(e?.message || 'Could not load saved recipes');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Persist after ready
  useEffect(() => {
    if (!userId || hydration !== 'ready') return;
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const minimal = state.savedRecipes.filter((r) => r?.id).map((r) => ({ id: r.id }));
        await AsyncStorage.setItem(storageKey(userId), JSON.stringify(minimal));
        if (!cancelled) setPersistError(null);
      } catch (e) {
        if (!cancelled) setPersistError(e?.message || 'Could not save');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, hydration, state.savedRecipes]);

  const toggleSave = useCallback((recipe) => {
    dispatch({ type: 'TOGGLE_SAVE', recipe });
  }, []);

  const isSaved = useCallback(
    (id) => state.savedRecipes.some((r) => r.id === id),
    [state.savedRecipes],
  );

  const addRecentScan = useCallback((ingredients, recipeCount) => {
    dispatch({ type: 'ADD_RECENT_SCAN', ingredients, recipeCount });
  }, []);

  const setPreferences = useCallback((preferences) => {
    dispatch({ type: 'SET_PREFERENCES', preferences });
  }, []);

  const retryHydration = useCallback(() => {
    if (!userId) return;
    setHydration('loading');
    setPersistError(null);
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(storageKey(userId));
        const parsed = raw ? JSON.parse(raw) : [];
        const list = Array.isArray(parsed) ? parsed : [];
        const fromStorage = dedupeRecipesById(
          list.map((item) => mergeRecipeWithCatalog(item)).filter(Boolean),
        );
        dispatch({ type: 'HYDRATE_SAVED', recipes: fromStorage });
        setHydration('ready');
      } catch (e) {
        setHydration('error');
        setPersistError(e?.message || 'Could not load saved recipes');
      }
    })();
  }, [userId]);

  const value = {
    savedRecipes: state.savedRecipes,
    recentScans: state.recentScans,
    lastIngredients: state.lastIngredients,
    preferences: state.preferences,
    toggleSave,
    isSaved,
    addRecentScan,
    setPreferences,
    savedCount: state.savedRecipes.length,
    savedIds: state.savedRecipes.map((r) => r.id),
    hydration,
    hydrationError: hydration === 'error' ? persistError : null,
    persistError,
    retryHydration,
  };

  return <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>;
}

export function useRecipes() {
  const ctx = useContext(RecipesContext);
  if (!ctx) throw new Error('useRecipes must be used within RecipesProvider');
  return ctx;
}

export default RecipesContext;
