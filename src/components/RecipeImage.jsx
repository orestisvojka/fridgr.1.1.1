import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { getRecipeImageUrl, DEFAULT_RECIPE_IMAGE } from '../data/recipeImages';

/**
 * Cached food photography with fallback on load error.
 * Pass `recipe` ({ id, imageUrl }) or `uri` directly.
 */
export default function RecipeImage({
  recipe,
  uri,
  style,
  height,
  borderRadius = 16,
  children,
}) {
  const resolved = uri || recipe?.imageUrl || getRecipeImageUrl(recipe?.id);
  const [source, setSource] = useState(resolved);

  useEffect(() => {
    setSource(resolved);
  }, [resolved]);

  const onError = useCallback(() => {
    setSource(DEFAULT_RECIPE_IMAGE);
  }, []);

  const flat = useMemo(() => StyleSheet.flatten(style) || {}, [style]);
  const recyclingKey = typeof source === 'string' ? source : source?.uri ?? String(resolved ?? '');

  return (
    <View style={[styles.wrap, { borderRadius, height, width: flat.width ?? '100%' }, style]}>
      <Image
        source={typeof source === 'string' ? { uri: source } : source}
        style={[StyleSheet.absoluteFill, { borderRadius }]}
        contentFit="cover"
        transition={220}
        cachePolicy="memory-disk"
        recyclingKey={recyclingKey}
        onError={onError}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
});
