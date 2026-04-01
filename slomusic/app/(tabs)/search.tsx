import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/contexts/theme-context';

// ── Mock Data ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: '1', label: 'Поп',       color: '#FA243C' },
  { id: '2', label: 'Хіп-хоп',  color: '#0A84FF' },
  { id: '3', label: 'Рок',       color: '#FF9F0A' },
  { id: '4', label: 'Електронна', color: '#30D158' },
  { id: '5', label: 'Джаз',      color: '#AF52DE' },
  { id: '6', label: 'Класика',   color: '#FF6B6B' },
  { id: '7', label: 'Інді',      color: '#5E5CE6' },
  { id: '8', label: 'R&B',       color: '#FF3B30' },
  { id: '9', label: 'Метал',     color: '#636366' },
  { id: '10', label: 'Реггі',    color: '#34C759' },
];

const SEARCH_RESULTS = [
  { id: '1', title: 'Blinding Lights',    artist: 'The Weeknd',         color: '#E74C3C' },
  { id: '2', title: 'Нічна Серенада',     artist: 'Один в каное',       color: '#8E44AD' },
  { id: '3', title: 'Levitating',         artist: 'Dua Lipa',           color: '#3498DB' },
  { id: '4', title: 'Anti-Hero',          artist: 'Taylor Swift',       color: '#E67E22' },
  { id: '5', title: 'Тримай',             artist: 'Христина Соловій',   color: '#27AE60' },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const isSearching = query.length > 0;
  const { theme } = useAppTheme();
  const isDark = theme === 'dark';

  const BG = isDark ? '#0C0C0E' : '#FFFFFF';
  const TEXT_PRIMARY = isDark ? '#FFFFFF' : '#000000';
  const TEXT_SECONDARY = '#8E8E93';
  const SURFACE = isDark ? '#1C1C1E' : '#F2F2F7';
  const SEPARATOR = isDark ? 'rgba(255,255,255,0.08)' : '#E5E5EA';
  const INPUT_BG = isDark ? '#1C1C1E' : '#EFEFF4';

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG },
    header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16 },
    headerTitle: { fontSize: 34, fontWeight: '800', color: TEXT_PRIMARY, letterSpacing: 0.4 },
    searchBarContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: INPUT_BG, marginHorizontal: 20, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 20, gap: 8 },
    searchIcon: {},
    searchInput: { flex: 1, fontSize: 16, color: TEXT_PRIMARY, padding: 0 },
    section: { marginBottom: 32, paddingHorizontal: 20 },
    sectionTitle: { fontSize: 22, fontWeight: '700', color: TEXT_PRIMARY, marginBottom: 14 },
    categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    categoryCard: { width: '47%', height: 80, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    categoryLabel: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
    resultsContainer: {},
    resultRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
    resultThumb: { width: 48, height: 48, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
    resultInfo: { flex: 1 },
    resultTitle: { fontSize: 15, fontWeight: '600', color: TEXT_PRIMARY, marginBottom: 3 },
    resultArtist: { fontSize: 13, color: TEXT_SECONDARY },
    resultSeparator: { height: StyleSheet.hairlineWidth, backgroundColor: SEPARATOR, marginLeft: 82 },
    noResults: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
    noResultsText: { fontSize: 20, fontWeight: '700', color: TEXT_PRIMARY, marginTop: 16, marginBottom: 8 },
    noResultsSub: { fontSize: 15, color: TEXT_SECONDARY, textAlign: 'center' },
    recentList: {},
    recentRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
    recentTitle: { flex: 1, fontSize: 15, color: TEXT_PRIMARY },
    recentSeparator: { height: StyleSheet.hairlineWidth, backgroundColor: SEPARATOR, marginLeft: 20 },
    separator: { height: StyleSheet.hairlineWidth, backgroundColor: SEPARATOR, marginLeft: 82 },
    categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    categoryIcon: { marginBottom: 6 },
  });

  const filtered = SEARCH_RESULTS.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.artist.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* ─── Header ─────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Пошук</Text>
        </View>

        {/* ─── Search Bar ─────────────────────── */}
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={18} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Виконавці, пісні, подкасти"
            placeholderTextColor="#8E8E93"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.6}>
              <Ionicons name="close-circle" size={18} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>

        {/* ─── Search Results ──────────────────── */}
        {isSearching ? (
          <View style={styles.resultsContainer}>
            {filtered.length === 0 ? (
              <View style={styles.noResults}>
                <Ionicons name="search-outline" size={48} color="#3A3A3C" />
                <Text style={styles.noResultsText}>Нічого не знайдено</Text>
                <Text style={styles.noResultsSub}>Спробуй інший запит</Text>
              </View>
            ) : (
              filtered.map((item, index) => (
                <TouchableOpacity key={item.id} style={styles.resultRow} activeOpacity={0.5}>
                  <View style={[styles.resultThumb, { backgroundColor: item.color }]}>
                    <Ionicons name="musical-note" size={18} color="rgba(255,255,255,0.8)" />
                  </View>
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.resultArtist} numberOfLines={1}>{item.artist}</Text>
                  </View>
                  <Ionicons name="ellipsis-horizontal" size={20} color="#636366" />
                  {index < filtered.length - 1 && <View style={styles.separator} />}
                </TouchableOpacity>
              ))
            )}
          </View>
        ) : (
          <>
            {/* ── Перегляд жанрів ────────────── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Огляд жанрів</Text>
              <View style={styles.categoriesGrid}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryCard, { backgroundColor: cat.color }]}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.categoryLabel}>{cat.label}</Text>
                    <Ionicons
                      name="musical-notes"
                      size={32}
                      color="rgba(255,255,255,0.25)"
                      style={styles.categoryIcon}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const ACCENT = '#FA243C';
const BG = '#FFFFFF';
const TEXT_PRIMARY = '#000000';
const TEXT_SECONDARY = '#8E8E93';
const SURFACE = '#F2F2F7';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  /* Header */
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: TEXT_PRIMARY,
    letterSpacing: 0.4,
  },

  /* Search Bar */
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE,
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 24,
    gap: 8,
  },
  searchIcon: {
    marginRight: 0,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: TEXT_PRIMARY,
    padding: 0,
  },

  /* Sections */
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    marginBottom: 16,
  },

  /* Categories Grid */
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '47%',
    height: 90,
    borderRadius: 14,
    justifyContent: 'flex-end',
    padding: 14,
    overflow: 'hidden',
  },
  categoryLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  categoryIcon: {
    position: 'absolute',
    bottom: -4,
    right: 8,
    transform: [{ rotate: '15deg' }],
  },

  /* Search Results */
  resultsContainer: {
    paddingHorizontal: 20,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  resultThumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  resultInfo: {
    flex: 1,
    marginRight: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  resultArtist: {
    fontSize: 13,
    color: TEXT_SECONDARY,
  },
  separator: {
    position: 'absolute',
    bottom: 0,
    left: 62,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E5EA',
  },

  /* No results */
  noResults: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  noResultsText: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_PRIMARY,
  },
  noResultsSub: {
    fontSize: 15,
    color: TEXT_SECONDARY,
  },
});
