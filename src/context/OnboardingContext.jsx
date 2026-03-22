// src/context/OnboardingContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';

const OnboardingContext = createContext(null);

const DEFAULT_ANSWERS = {
  referralSource: null,
  goal: null,
  diet: null,
  allergies: [],
  skill: null,
  time: null,
  mealsFocus: [],
  mealPriority: null,
  cookFrequency: null,
  activityLevel: null,
  household: null,
  cuisineVibe: null,
  spiceLevel: null,
  leftovers: null,
  shoppingStyle: null,
};

export function OnboardingProvider({ children }) {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [answers, setAnswers] = useState(DEFAULT_ANSWERS);

  const setAnswer = useCallback((questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }, []);

  const toggleMultiAnswer = useCallback((questionId, value) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      if (value === 'none') return { ...prev, [questionId]: ['none'] };
      const withoutNone = current.filter(v => v !== 'none');
      if (withoutNone.includes(value)) {
        const updated = withoutNone.filter(v => v !== value);
        return { ...prev, [questionId]: updated.length ? updated : [] };
      }
      return { ...prev, [questionId]: [...withoutNone, value] };
    });
  }, []);

  const completeOnboarding = useCallback(() => {
    setHasCompletedOnboarding(true);
  }, []);

  const resetOnboarding = useCallback(() => {
    setHasCompletedOnboarding(false);
    setAnswers(DEFAULT_ANSWERS);
  }, []);

  return (
    <OnboardingContext.Provider value={{
      hasCompletedOnboarding,
      answers,
      setAnswer,
      toggleMultiAnswer,
      completeOnboarding,
      resetOnboarding,
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}

export default OnboardingContext;
