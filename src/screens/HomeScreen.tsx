import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, FlatList, RefreshControl, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, SPACING, BORDER_RADIUS, CATEGORIES } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { SearchBar, WorkerCard, SectionHeader, WorkerCardSkeleton } from '../components';
import { Worker, Category } from '../types';
import { RootStackParamList } from '../navigation';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MOCK_WORKERS: Worker[] = [
  {
    id: '1',
    name: 'John Smith',
    category: CATEGORIES[0],
    rating: 4.8,
    review_count: 127,
    hourly_rate: 75,
    location: 'Brooklyn, NY',
    distance: 0.8,
    availability: 'available',
    trust_score: 95,
    verified: true,
    years_experience: 12,
    completed_jobs: 450,
    bio: 'Master plumber with 12+ years experience',
    avatar: '',
    images: [],
    reviews: [],
    completed_bookings: 0,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    category: CATEGORIES[1],
    rating: 4.9,
    review_count: 203,
    hourly_rate: 85,
    location: 'Manhattan, NY',
    distance: 1.2,
    availability: 'busy',
    trust_score: 98,
    verified: true,
    years_experience: 8,
    completed_jobs: 320,
    bio: 'Licensed electrician specializing in residential',
    avatar: '',
    images: [],
    reviews: [],
    completed_bookings: 0,
  },
  {
    id: '3',
    name: 'Mike Wilson',
    category: CATEGORIES[2],
    rating: 4.7,
    review_count: 89,
    hourly_rate: 65,
    location: 'Queens, NY',
    distance: 2.5,
    availability: 'available',
    trust_score: 88,
    verified: true,
    years_experience: 15,
    completed_jobs: 500,
    bio: 'Expert carpenter and furniture maker',
    avatar: '',
    images: [],
    reviews: [],
    completed_bookings: 0,
  },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { workers } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading] = useState(false);

  const displayWorkers = workers.length > 0 ? workers : MOCK_WORKERS;

  const topRated = useMemo(() => {
    return [...displayWorkers].sort((a, b) => b.rating - a.rating).slice(0, 5);
  }, [displayWorkers]);

  const handleCategoryPress = (category: Category) => {
    navigation.navigate('Search', { categoryId: category.id });
  };

  const handleWorkerPress = (worker: Worker) => {
    navigation.navigate('WorkerProfile', { workerId: worker.id });
  };

  const handleSearchPress = () => {
    navigation.navigate('Search', { query: searchQuery });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Find Trusted</Text>
          <Text style={styles.greetingBold}>Service Providers</Text>
        </View>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onPress={handleSearchPress}
          placeholder="Search services or providers..."
        />

        <SectionHeader
          title="Categories"
          subtitle="Browse by service type"
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {CATEGORIES.map(cat => (
            <View key={cat.id} style={styles.categoryItem}>
              <Text
                style={styles.categoryIcon}
                onPress={() => handleCategoryPress(cat)}
              >
                {cat.icon}
              </Text>
              <Text style={styles.categoryName}>{cat.name}</Text>
            </View>
          ))}
        </ScrollView>

        <SectionHeader
          title="Top Rated"
          subtitle="Highest rated professionals"
          actionLabel="See All"
          onActionPress={() => navigation.navigate('Search', {})}
        />

        <FlatList
          data={topRated}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item }) => (
            <WorkerCard worker={item} onPress={() => handleWorkerPress(item)} compact />
          )}
        />

        <SectionHeader
          title="Available Now"
          subtitle="Ready to help you today"
        />

        <View style={styles.workersList}>
          {displayWorkers.slice(0, 4).map(worker => (
            <WorkerCard
              key={worker.id}
              worker={worker}
              onPress={() => handleWorkerPress(worker)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  greeting: {
    fontSize: 28,
    color: '#333',
    fontWeight: '400',
  },
  greetingBold: {
    fontSize: 28,
    color: COLORS.primary,
    fontWeight: '700',
  },
  categoriesScroll: {
    paddingLeft: SPACING.md,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: SPACING.md,
  },
  categoryIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  horizontalList: {
    paddingHorizontal: SPACING.md,
  },
  workersList: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100,
  },
});
