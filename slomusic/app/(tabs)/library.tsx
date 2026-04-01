import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/contexts/theme-context';

// ── Types ────────────────────────────────────────────────────────────────────

type CategoryItem = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

type TrackItem = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  color: string;
};

// ── Mock Data ────────────────────────────────────────────────────────────────

const CATEGORIES: CategoryItem[] = [
  { id: '1', label: 'Плейлисти',         icon: 'musical-notes',    color: '#FA243C' },
  { id: '2', label: 'Виконавці',         icon: 'mic',              color: '#FA243C' },
  { id: '3', label: 'Стеження',          icon: 'person-add',       color: '#FA243C' },
  { id: '4', label: 'Альбоми',           icon: 'disc',             color: '#FA243C' },
  { id: '5', label: 'Пісні',             icon: 'musical-note',     color: '#FA243C' },
  { id: '6', label: 'Підібрано для вас', icon: 'star',             color: '#FA243C' },
  { id: '7', label: 'Відеокліпи',        icon: 'videocam',         color: '#FA243C' },
  { id: '8', label: 'Жанри',             icon: 'albums',           color: '#FA243C' },
  { id: '9', label: 'Завантажено',       icon: 'arrow-down-circle', color: '#FA243C' },
];

const INITIAL_PLAYLISTS = [
  { id: '1', title: 'Нічний Кодинг', trackCount: 5, color: '#FA243C' },
  { id: '2', title: 'Vibe Check',    trackCount: 4, color: '#0A84FF' },
  { id: '3', title: 'Інді Вечір',   trackCount: 7, color: '#AF52DE' },
];

const RECENTLY_PLAYED: TrackItem[] = [
  { id: '1', title: 'Midnight Code',   artist: 'MaxVibe',           duration: '3:20', color: '#FA243C' },
  { id: '2', title: 'Нічна Серенада',  artist: 'Один в каное',      duration: '4:12', color: '#AF52DE' },
  { id: '3', title: 'Lo-Fi Study',     artist: 'Chillhop',          duration: '3:23', color: '#30D158' },
  { id: '4', title: 'Neon Dreams',     artist: 'SynthWave',         duration: '3:45', color: '#0A84FF' },
  { id: '5', title: 'Cloud Nine',      artist: 'Ambient',           duration: '2:58', color: '#FF9F0A' },
];

const LISTENING_HISTORY: TrackItem[] = [
  { id: '1', title: 'Blinding Lights',  artist: 'The Weeknd',         duration: '3:20', color: '#E74C3C' },
  { id: '2', title: 'Нічна Серенада',   artist: 'Один в каное',       duration: '4:12', color: '#8E44AD' },
  { id: '3', title: 'Levitating',       artist: 'Dua Lipa',           duration: '3:23', color: '#3498DB' },
  { id: '4', title: 'Тримай',           artist: 'Христина Соловій',   duration: '3:45', color: '#E67E22' },
  { id: '5', title: 'Peach',            artist: 'Kevin Abstract',     duration: '2:58', color: '#27AE60' },
  { id: '6', title: 'Місто Весни',      artist: 'Бумбокс',            duration: '4:30', color: '#2980B9' },
  { id: '7', title: 'Electric Feel',    artist: 'MGMT',               duration: '3:49', color: '#F39C12' },
  { id: '8', title: 'Обійми',           artist: 'Океан Ельзи',        duration: '4:01', color: '#1ABC9C' },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function LibraryScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const isDark = theme === 'dark';

  const BG = isDark ? '#0C0C0E' : '#FFFFFF';
  const SURFACE = isDark ? '#1C1C1E' : '#F2F2F7';
  const TEXT_PRIMARY = isDark ? '#FFFFFF' : '#000000';
  const TEXT_SECONDARY = '#8E8E93';
  const SEPARATOR = isDark ? 'rgba(255,255,255,0.08)' : '#E5E5EA';

  const [playlists, setPlaylists] = React.useState(INITIAL_PLAYLISTS);
  const [sortMode, setSortMode] = React.useState<'recent' | 'title' | 'artist'>('recent');

  const sortedHistory = React.useMemo(() => {
    const list = [...LISTENING_HISTORY];
    if (sortMode === 'title')  return list.sort((a, b) => a.title.localeCompare(b.title));
    if (sortMode === 'artist') return list.sort((a, b) => a.artist.localeCompare(b.artist));
    return list; // 'recent' = original order
  }, [sortMode]);

  const handleAddPlaylist = () => {
    Alert.prompt(
      'Новий плейлист',
      'Введіть назву плейлиста',
      [
        { text: 'Скасувати', style: 'cancel' },
        {
          text: 'Створити',
          onPress: (name?: string) => {
            if (name?.trim()) {
              const colors = ['#FA243C', '#0A84FF', '#AF52DE', '#30D158', '#FF9F0A'];
              const randomColor = colors[Math.floor(Math.random() * colors.length)];
              setPlaylists([
                {
                  id: Date.now().toString(),
                  title: name.trim(),
                  trackCount: 0,
                  color: randomColor,
                },
                ...playlists,
              ]);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: BG }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ─── Header ─────────────────────────────────── */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: TEXT_PRIMARY }]}>Медіатека</Text>
          <View style={styles.headerIcons}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: SURFACE }]}
            onPress={() => router.push('/settings')}
            activeOpacity={0.6}
          >
            <View style={styles.accountAvatar}>
              <Text style={styles.accountInitial}>О</Text>
            </View>
          </TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: SURFACE }]} onPress={handleAddPlaylist} activeOpacity={0.6}>
              <Ionicons name="add" size={26} color="#FA243C" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Category List ──────────────────────────── */}
        <View style={[styles.categoryList, { backgroundColor: SURFACE }]}>
          {CATEGORIES.map((cat, index) => (
            <TouchableOpacity key={cat.id} style={styles.categoryRow} activeOpacity={0.6}>
              <View style={styles.categoryLeft}>
                <Ionicons name={cat.icon as any} size={22} color="#FA243C" />
                <Text style={[styles.categoryLabel, { color: TEXT_PRIMARY }]}>{cat.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={TEXT_SECONDARY} />
              {index < CATEGORIES.length - 1 && <View style={[styles.categorySeparator, { backgroundColor: SEPARATOR }]} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* ─── Playlists ───────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: TEXT_PRIMARY }]}>Мої плейлисти</Text>
            <TouchableOpacity onPress={handleAddPlaylist} activeOpacity={0.6}>
              <Ionicons name="chevron-forward" size={22} color="#FA243C" />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {playlists.map((pl) => (
              <TouchableOpacity
                key={pl.id}
                style={styles.recentCard}
                activeOpacity={0.7}
                onPress={() => router.push({ pathname: '/playlist/[id]', params: { id: pl.id } })}
              >
                <View style={[styles.recentArt, { backgroundColor: pl.color }]}>
                  <Ionicons name="musical-notes" size={28} color="rgba(255,255,255,0.6)" />
                </View>
                <Text style={[styles.recentTitle, { color: TEXT_PRIMARY }]} numberOfLines={1}>{pl.title}</Text>
                <Text style={[styles.recentArtist, { color: TEXT_SECONDARY }]}>{pl.trackCount} треків</Text>
              </TouchableOpacity>
            ))}
            {/* Add new playlist card */}
            <TouchableOpacity style={styles.recentCard} activeOpacity={0.7} onPress={handleAddPlaylist}>
              <View style={[styles.recentArt, { backgroundColor: SURFACE, justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="add" size={36} color="#FA243C" />
              </View>
              <Text style={[styles.recentTitle, { color: TEXT_PRIMARY }]}>Новий</Text>
              <Text style={[styles.recentArtist, { color: TEXT_SECONDARY }]}>Створити</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* ─── Recently Played ────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: TEXT_PRIMARY }]}>Нещодавно відтворено</Text>
            <TouchableOpacity activeOpacity={0.6}>
              <Ionicons name="chevron-forward" size={22} color="#FA243C" />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {RECENTLY_PLAYED.map((track) => (
              <TouchableOpacity
                key={track.id}
                style={styles.recentCard}
                activeOpacity={0.7}
              >
                <View
                  style={[styles.recentArt, { backgroundColor: track.color }]}
                >
                  <Ionicons
                    name="musical-notes"
                    size={28}
                    color="rgba(255,255,255,0.6)"
                  />
                </View>
                <Text style={[styles.recentTitle, { color: TEXT_PRIMARY }]} numberOfLines={1}>
                  {track.title}
                </Text>
                <Text style={[styles.recentArtist, { color: TEXT_SECONDARY }]} numberOfLines={1}>
                  {track.artist}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ─── Listening History ──────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: TEXT_PRIMARY }]}>Історія прослуховувань</Text>
            <TouchableOpacity activeOpacity={0.6}>
              <Ionicons name="chevron-forward" size={22} color="#FA243C" />
            </TouchableOpacity>
          </View>
          {/* Sort Pills */}
          <View style={styles.sortRow}>
            {([['recent', 'Нещодавні'], ['title', 'Назва'], ['artist', 'Виконавець']] as const).map(([mode, label]) => (
              <TouchableOpacity
                key={mode}
                style={[styles.sortPill, { backgroundColor: SURFACE, borderColor: isDark ? '#3A3A3C' : '#D1D1D6' }, sortMode === mode && styles.sortPillActive]}
                onPress={() => setSortMode(mode)}
                activeOpacity={0.7}
              >
                <Text style={[styles.sortPillText, { color: TEXT_SECONDARY }, sortMode === mode && styles.sortPillTextActive]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.historyList}>
            {sortedHistory.map((track, index) => (
              <TouchableOpacity
                key={track.id}
                style={styles.historyRow}
                activeOpacity={0.5}
              >
                <View
                  style={[
                    styles.historyThumb,
                    { backgroundColor: track.color },
                  ]}
                >
                  <Ionicons
                    name="musical-note"
                    size={18}
                    color="rgba(255,255,255,0.7)"
                  />
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyTitle} numberOfLines={1}>
                    {track.title}
                  </Text>
                  <Text style={styles.historyArtist} numberOfLines={1}>
                    {track.artist}
                  </Text>
                </View>
                <Text style={styles.historyDuration}>{track.duration}</Text>
                {index < LISTENING_HISTORY.length - 1 && (
                  <View style={styles.historySeparator} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bottom spacer */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const ACCENT = '#FA243C';
const BG = '#0C0C0E';
const SURFACE = '#1A1A1E';
const TEXT_PRIMARY = '#FFFFFF';
const TEXT_SECONDARY = '#8E8E93';
const SEPARATOR = '#2C2C2E';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  /* ── Header ────────────────────────────────────── */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: TEXT_PRIMARY,
    letterSpacing: 0.4,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: SURFACE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: SURFACE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 16,
    fontWeight: '600',
    color: ACCENT,
  },

  /* ── Category List ─────────────────────────────── */
  categoryList: {
    marginHorizontal: 20,
    backgroundColor: SURFACE,
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  categoryLabel: {
    fontSize: 17,
    fontWeight: '500',
    color: TEXT_PRIMARY,
  },
  categorySeparator: {
    position: 'absolute',
    bottom: 0,
    left: 36,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: SEPARATOR,
  },

  /* ── Sections ──────────────────────────────────── */
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
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

  /* ── Recently Played Cards ─────────────────────── */
  horizontalScroll: {
    paddingHorizontal: 20,
  },
  recentCard: {
    marginRight: 14,
    width: 140,
  },
  recentArt: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  recentArtist: {
    fontSize: 12,
    fontWeight: '400',
    color: TEXT_SECONDARY,
  },

  /* ── Listening History ─────────────────────────── */
  historyList: {
    paddingHorizontal: 20,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  historyThumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  historyInfo: {
    flex: 1,
    marginRight: 12,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginBottom: 3,
  },
  historyArtist: {
    fontSize: 13,
    fontWeight: '400',
    color: TEXT_SECONDARY,
  },
  historyDuration: {
    fontSize: 13,
    fontWeight: '500',
    color: TEXT_SECONDARY,
  },
  historySeparator: {
    position: 'absolute',
    bottom: 0,
    left: 62,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: SEPARATOR,
  },
  sortRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  sortPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#1C1C1E',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#3A3A3C',
  },
  sortPillActive: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  sortPillText: {
    fontSize: 13,
    fontWeight: '500',
    color: TEXT_SECONDARY,
  },
  sortPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  accountAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FA243C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountInitial: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
