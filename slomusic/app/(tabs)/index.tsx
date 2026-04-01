import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/contexts/theme-context';

// ── Mock Data ────────────────────────────────────────────────────────────────

const CONTINUE_LISTENING = [
  { id: '1', title: 'Нічний Кодинг',    artist: 'Various Artists', color: '#FA243C', progress: 0.65 },
  { id: '2', title: 'Vibe Check',        artist: 'Chillhop',        color: '#0A84FF', progress: 0.3  },
  { id: '3', title: 'Інді Знахідки',    artist: 'Various Artists', color: '#AF52DE', progress: 0.8  },
];

const RECOMMENDATIONS = [
  { id: '1', title: 'Фокус · Навчання', artist: 'Curated',          color: '#30D158' },
  { id: '2', title: 'Вечірній Чіл',     artist: 'Curated',          color: '#FF9F0A' },
  { id: '3', title: 'Тренування',       artist: 'Curated',          color: '#FA243C' },
  { id: '4', title: 'Дорога до кампусу', artist: 'Curated',         color: '#0A84FF' },
  { id: '5', title: 'Інді Знахідки',    artist: 'Curated',          color: '#AF52DE' },
];

const RECENTLY_PLAYED = [
  { id: '1', title: 'Midnight Code',    artist: 'MaxVibe',          color: '#FA243C' },
  { id: '2', title: 'Нічна Серенада',   artist: 'Один в каное',     color: '#AF52DE' },
  { id: '3', title: 'Lo-Fi Study',      artist: 'Chillhop',         color: '#30D158' },
  { id: '4', title: 'Neon Dreams',      artist: 'SynthWave',        color: '#0A84FF' },
  { id: '5', title: 'Cloud Nine',       artist: 'Ambient',          color: '#FF9F0A' },
];

const NEW_RELEASES = [
  { id: '1', title: 'CHROMAKOPIA',     artist: 'Tyler, the Creator', color: '#E67E22' },
  { id: '2', title: 'Eternal Sunshine', artist: 'Ariana Grande',     color: '#9B59B6' },
  { id: '3', title: 'Short n\' Sweet',  artist: 'Sabrina Carpenter',  color: '#E74C3C' },
  { id: '4', title: 'Manning Fireworks', artist: 'MJ Lenderman',      color: '#2ECC71' },
  { id: '5', title: 'Bright Future',   artist: 'Adrianne Lenker',   color: '#3498DB' },
];

const TOP_CHARTS = [
  { id: '1', title: 'Blinding Lights',    artist: 'The Weeknd',         duration: '3:20' },
  { id: '2', title: 'Flowers',            artist: 'Miley Cyrus',        duration: '3:20' },
  { id: '3', title: 'As It Was',          artist: 'Harry Styles',       duration: '2:37' },
  { id: '4', title: 'Unholy',             artist: 'Sam Smith',          duration: '2:36' },
  { id: '5', title: 'Anti-Hero',          artist: 'Taylor Swift',       duration: '3:20' },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const isDark = theme === 'dark';

  const ACCENT = '#FA243C';
  const BG = isDark ? '#0C0C0E' : '#FFFFFF';
  const TEXT_PRIMARY = isDark ? '#FFFFFF' : '#000000';
  const TEXT_SECONDARY = '#8E8E93';
  const SURFACE = isDark ? '#1C1C1E' : '#F2F2F7';
  const SEPARATOR_COLOR = isDark ? 'rgba(255,255,255,0.08)' : '#E5E5EA';

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG },

    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 28 },
    headerGreeting: { fontSize: 16, fontWeight: '500', color: TEXT_SECONDARY, marginBottom: 2 },
    headerName: { fontSize: 34, fontWeight: '800', color: TEXT_PRIMARY, letterSpacing: 0.4 },
    profileButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: ACCENT, justifyContent: 'center', alignItems: 'center' },
    profileInitial: { fontSize: 17, fontWeight: '700', color: '#FFFFFF' },

    section: { marginBottom: 32 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 14 },
    sectionTitle: { fontSize: 22, fontWeight: '700', color: TEXT_PRIMARY },
    seeAll: { fontSize: 15, color: ACCENT, fontWeight: '600' },

    hScroll: { paddingLeft: 20, paddingRight: 6 },

    continueCard: { marginRight: 16, width: 220, backgroundColor: SURFACE, borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
    continueThumbnail: { width: 52, height: 52, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
    continueInfo: { flex: 1 },
    continueTitle: { fontSize: 14, fontWeight: '700', color: TEXT_PRIMARY, marginBottom: 3 },
    continueArtist: { fontSize: 12, color: TEXT_SECONDARY, marginBottom: 6 },
    progressBar: { height: 3, backgroundColor: isDark ? '#3A3A3C' : '#D1D1D6', borderRadius: 2 },
    progressFill: { height: '100%', backgroundColor: ACCENT, borderRadius: 2 },

    card: { marginRight: 14, width: 140 },
    albumArt: { width: 140, height: 140, borderRadius: 12, marginBottom: 8, justifyContent: 'center', alignItems: 'center' },
    cardTitle: { fontSize: 14, fontWeight: '600', color: TEXT_PRIMARY, marginBottom: 2 },
    cardArtist: { fontSize: 12, color: TEXT_SECONDARY },

    chartList: { paddingHorizontal: 20 },
    chartRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
    chartRank: { width: 32, fontSize: 15, fontWeight: '700', color: ACCENT },
    chartThumb: { width: 46, height: 46, borderRadius: 8, backgroundColor: SURFACE, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    chartInfo: { flex: 1, marginRight: 12 },
    chartTitle: { fontSize: 15, fontWeight: '600', color: TEXT_PRIMARY },
    chartArtist: { fontSize: 13, color: TEXT_SECONDARY, marginTop: 2 },
    chartDuration: { fontSize: 13, color: TEXT_SECONDARY },
    chartSeparator: { height: StyleSheet.hairlineWidth, backgroundColor: SEPARATOR_COLOR, marginLeft: 90 },
    separator: { height: StyleSheet.hairlineWidth, backgroundColor: SEPARATOR_COLOR, marginLeft: 90 },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ─── Header ─────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerGreeting}>Вітаємо 👋</Text>
            <Text style={styles.headerName}>Олесю</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            activeOpacity={0.6}
            onPress={() => router.push('/settings')}
          >
            <Text style={styles.profileInitial}>О</Text>
          </TouchableOpacity>
        </View>


        {/* ─── Рекомендації ───────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Рекомендації для тебе</Text>
            <TouchableOpacity activeOpacity={0.6}>
              <Ionicons name="chevron-forward" size={22} color={ACCENT} />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hScroll}
          >
            {RECOMMENDATIONS.map((item) => (
              <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.7}>
                <View style={[styles.albumArt, { backgroundColor: item.color }]}>
                  <Ionicons name="musical-notes" size={28} color="rgba(255,255,255,0.6)" />
                </View>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.cardArtist} numberOfLines={1}>{item.artist}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ─── Нещодавно відтворено ───────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Нещодавно відтворено</Text>
            <TouchableOpacity activeOpacity={0.6}>
              <Ionicons name="chevron-forward" size={22} color={ACCENT} />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hScroll}
          >
            {RECENTLY_PLAYED.map((item) => (
              <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.7}>
                <View style={[styles.albumArt, { backgroundColor: item.color }]}>
                  <Ionicons name="musical-note" size={28} color="rgba(255,255,255,0.6)" />
                </View>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.cardArtist} numberOfLines={1}>{item.artist}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ─── Нові релізи ────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Нові релізи</Text>
            <TouchableOpacity activeOpacity={0.6}>
              <Ionicons name="chevron-forward" size={22} color={ACCENT} />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hScroll}
          >
            {NEW_RELEASES.map((item) => (
              <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.7}>
                <View style={[styles.albumArt, { backgroundColor: item.color }]}>
                  <Ionicons name="disc" size={28} color="rgba(255,255,255,0.6)" />
                </View>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.cardArtist} numberOfLines={1}>{item.artist}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ─── Топ чарти ──────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Топ чарти</Text>
            <TouchableOpacity activeOpacity={0.6}>
              <Ionicons name="chevron-forward" size={22} color={ACCENT} />
            </TouchableOpacity>
          </View>
          <View style={styles.chartList}>
            {TOP_CHARTS.map((item, index) => (
              <TouchableOpacity key={item.id} style={styles.chartRow} activeOpacity={0.5}>
                <Text style={styles.chartRank}>#{index + 1}</Text>
                <View style={styles.chartThumb}>
                  <Ionicons name="musical-note" size={18} color="rgba(255,255,255,0.7)" />
                </View>
                <View style={styles.chartInfo}>
                  <Text style={styles.chartTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.chartArtist} numberOfLines={1}>{item.artist}</Text>
                </View>
                <Text style={styles.chartDuration}>{item.duration}</Text>
                {index < TOP_CHARTS.length - 1 && <View style={styles.separator} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>

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
const SEPARATOR_COLOR = '#E5E5EA';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
  },
  headerGreeting: {
    fontSize: 16,
    fontWeight: '500',
    color: TEXT_SECONDARY,
    marginBottom: 2,
  },
  headerName: {
    fontSize: 34,
    fontWeight: '800',
    color: TEXT_PRIMARY,
    letterSpacing: 0.4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: SURFACE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 17,
    fontWeight: '700',
    color: ACCENT,
  },

  /* Sections */
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: TEXT_PRIMARY,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: ACCENT,
  },
  hScroll: {
    paddingHorizontal: 20,
  },

  /* Continue Listening Card */
  continueCard: {
    marginRight: 14,
    width: 150,
  },
  continueArt: {
    width: 150,
    height: 150,
    borderRadius: 14,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  continueArtist: {
    fontSize: 12,
    color: TEXT_SECONDARY,
    marginBottom: 8,
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: SURFACE,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: ACCENT,
    borderRadius: 2,
  },

  /* Generic Card */
  card: {
    marginRight: 14,
    width: 140,
  },
  albumArt: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  cardArtist: {
    fontSize: 12,
    color: TEXT_SECONDARY,
  },

  /* Top Charts */
  chartList: {
    paddingHorizontal: 20,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  chartRank: {
    width: 32,
    fontSize: 15,
    fontWeight: '700',
    color: ACCENT,
  },
  chartThumb: {
    width: 46,
    height: 46,
    borderRadius: 8,
    backgroundColor: SURFACE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chartInfo: {
    flex: 1,
    marginRight: 12,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  chartArtist: {
    fontSize: 13,
    color: TEXT_SECONDARY,
  },
  chartDuration: {
    fontSize: 13,
    color: TEXT_SECONDARY,
  },
  separator: {
    position: 'absolute',
    bottom: 0,
    left: 80,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: SEPARATOR_COLOR,
  },
});
