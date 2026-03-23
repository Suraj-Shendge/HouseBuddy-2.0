import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, SPACING, CATEGORIES } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { SearchBar, WorkerCard, EmptyState } from '../components';
import { Worker } from '../types';
import { RootStackParamList } from '../navigation';

type SearchNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Search'>;

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<SearchNavigationProp>();
  const route = useRoute();
  const { workers } = useApp();
  const [searchQuery, setSearchQuery] = useState((route.params as any)?.query || '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>((route.params as any)?.categoryId || null);

  const filteredWorkers = useMemo(() => {
    let result = [...workers];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(w =>
        w.name.toLowerCase().includes(query) ||
        w.category.name.toLowerCase().includes(query)
      );
    }
    if (selectedCategory) {
      result = result.filter(w => w.category.id === selectedCategory);
    }
    return result.sort((a, b) => b.rating - a.rating);
  }, [workers, searchQuery, selectedCategory]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onPress={() => {}}
          placeholder="Search services..."
        />
      </View>

      <View style={styles.categories}>
        <TouchableOpacity
          style={[styles.chip, !selectedCategory && styles.chipActive]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[styles.chipText, !selectedCategory && styles.chipTextActive]}>All</Text>
        </TouchableOpacity>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.chip, selectedCategory === cat.id && styles.chipActive]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Text style={[styles.chipText, selectedCategory === cat.id && styles.chipTextActive]}>{cat.icon} {cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredWorkers.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No workers found"
          message="Try adjusting your search or filters"
        />
      ) : (
        <FlatList
          data={filteredWorkers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <WorkerCard worker={item} onPress={() => navigation.navigate('WorkerProfile', { workerId: item.id })} />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl, paddingBottom: SPACING.md },
  title: { fontSize: 28, fontWeight: '700', marginBottom: SPACING.md, color: '#333' },
  categories: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  chip: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#f0f0f0', borderRadius: 20, margin: 4 },
  chipActive: { backgroundColor: COLORS.primary },
  chipText: { fontSize: 13, color: '#333' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  list: { paddingHorizontal: SPACING.lg, paddingBottom: 100 },
});
