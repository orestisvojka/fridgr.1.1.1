# FRIDGR. 🥗
### Cook What You Have.

A smart React Native (Expo) cooking assistant app that matches your fridge ingredients to recipes instantly.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
cd FRIDGR
npm install

# 2. Start Expo
npx expo start

# 3. Run on device
# Press 'i' for iOS simulator
# Press 'a' for Android emulator
# Scan QR code with Expo Go app on your phone
```

---

## 📁 Project Structure

```
FRIDGR/
├── App.jsx                          # Root entry point
├── app.json                         # Expo config
├── package.json
│
└── src/
    ├── components/
    │   ├── Header.jsx               # Reusable screen header
    │   ├── PrimaryButton.jsx        # Multi-variant button
    │   ├── MacroBadge.jsx           # Calorie/macro display
    │   ├── IngredientInput.jsx      # Input + chip manager
    │   ├── RecipeCard.jsx           # Full recipe card
    │   └── ShoppingListModal.jsx    # Missing items modal
    │
    ├── screens/
    │   ├── HomeScreen.jsx           # Landing / ingredient entry
    │   ├── ResultsScreen.jsx        # Matched recipe list
    │   ├── DetailScreen.jsx         # Full recipe view
    │   └── SavedRecipesScreen.jsx   # Saved/bookmarked recipes
    │
    ├── navigation/
    │   └── AppNavigator.jsx         # Tab + stack navigation
    │
    ├── context/
    │   └── RecipesContext.jsx       # Global saved recipes state
    │
    ├── data/
    │   └── mockRecipes.js           # 8 sample recipes
    │
    ├── services/
    │   └── recipeService.js         # Ingredient matching logic
    │
    ├── utils/
    │   ├── helpers.js               # normalize, format, match
    │   └── constants.js             # App-wide constants
    │
    └── styles/
        └── theme.js                 # Colors, spacing, typography
```

---

## 🧠 How Matching Works

`recipeService.js` compares user ingredients against each recipe using fuzzy matching:

- Normalizes strings (lowercase, trim, strip filler words)
- Checks for substring matches (e.g. "tomatoes" matches "tomato")
- Calculates a `matchScore` (0–1) per recipe
- Sorts by: **matchScore DESC → missingCount ASC → prepTime ASC**
- Returns top 3

---

## ✨ Features

- **Ingredient chips** — add/remove ingredients as tags
- **Quick suggestions** — one-tap common ingredients
- **Recipe matching** — ranked by best fit + speed
- **Macro display** — calories, protein, carbs, fat
- **Missing ingredients** — highlighted with shopping list modal
- **Save recipes** — persistent within session via context
- **Full detail view** — instructions, ingredients, macros
- **Smooth animations** — staggered card entry, press feedback

---

## 🔮 Extending FRIDGR

The architecture is built to scale:

| Feature | Where to add |
|---|---|
| Real AI recipe API | `src/services/recipeService.js` |
| Barcode scanner | New screen + service |
| User accounts | New `AuthContext` + `AuthScreen` |
| Meal planning | New tab + screen |
| Persistent storage | Replace context with AsyncStorage or Zustand |
| Push notifications | Expo Notifications API |

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `expo` | Runtime & toolchain |
| `expo-linear-gradient` | Dark hero gradients |
| `@react-navigation/native` | Navigation core |
| `@react-navigation/bottom-tabs` | Tab bar |
| `@react-navigation/stack` | Stack navigation |
| `react-native-safe-area-context` | Safe area insets |
| `react-native-screens` | Native screen optimization |
| `@expo/vector-icons` | Ionicons icon set |

---

*No more takeout. No more wasted food.* 🌿
