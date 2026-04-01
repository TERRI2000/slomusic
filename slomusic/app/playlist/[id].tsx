import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/contexts/theme-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ACCENT = '#FA243C';

// ── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_PLAYLISTS: Record<string, {
  title: string;
  description: string;
  color: string;
  trackCount: number;
  duration: string;
  tracks: { id: string; title: string; artist: string; duration: string; color: string }[];
}> = {
  '1': {
    title: 'Нічний Кодинг',
    description: 'Ідеально для пізньої роботи та фокусу',
    color: '#FA243C',
    trackCount: 5,
    duration: '18 хв',
    tracks: [
      { id: '1', title: 'Midnight Code',     artist: 'MaxVibe',          duration: '3:20', color: '#FA243C' },
      { id: '2', title: 'Neon Dreams',        artist: 'MaxVibe',          duration: '3:45', color: '#AF52DE' },
      { id: '3', title: 'Lo-Fi Session',      artist: 'Chillhop',         duration: '4:02', color: '#0A84FF' },
      { id: '4', title: 'Dark Pixels',        artist: 'MaxVibe',          duration: '3:10', color: '#30D158' },
      { id: '5', title: 'Cloud Nine',         artist: 'SynthWave',        duration: '2:58', color: '#FF9F0A' },
    ],
  },
  '2': {
    title: 'Vibe Check',
    description: 'Легкий настрій на кожен день',
    color: '#0A84FF',
    trackCount: 4,
    duration: '14 хв',
    tracks: [
      { id: '1', title: 'Blue Hour',          artist: 'Chillhop',         duration: '3:30', color: '#0A84FF' },
      { id: '2', title: 'Easy Flow',          artist: 'SynthWave',        duration: '3:15', color: '#30D158' },
      { id: '3', title: 'Sunset Drive',       artist: 'Ambient',          duration: '4:00', color: '#FF9F0A' },
      { id: '4', title: 'Floating',           artist: 'Chillhop',         duration: '3:10', color: '#AF52DE' },
    ],
  },
  default: {
    title: 'Мій плейлист',
    description: 'Персональна колекція',
    color: '#AF52DE',
    trackCount: 3,
    duration: '10 хв',
    tracks: [
      { id: '1', title: 'Трек 1', artist: 'Виконавець 1', duration: '3:30', color: '#FA243C' },
      { id: '2', title: 'Трек 2', artist: 'Виконавець 2', duration: '3:15', color: '#0A84FF' },
      { id: '3', title: 'Трек 3', artist: 'Виконавець 3', duration: '3:10', color: '#30D158' },
    ],
  },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function PlaylistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const isDark = theme === 'dark';

  const playlist = MOCK_PLAYLISTS[id ?? ''] ?? MOCK_PLAYLISTS.default;
  const [tracks, setTracks] = useState(playlist.tracks);
  const [isEditing, setIsEditing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [coverColor, setCoverColor] = useState(playlist.color);
  const [coverUri, setCoverUri] = useState<string | null>(null);

  const COVER_COLORS = [
    { label: 'Червоний',   color: '#FA243C' },
    { label: 'Синій',      color: '#0A84FF' },
    { label: 'Фіолетовий', color: '#AF52DE' },
    { label: 'Зелений',    color: '#30D158' },
    { label: 'Оранжевий',  color: '#FF9F0A' },
  ];

  const pickColor = () => Alert.alert('Колір обкладинки', 'Виберіть колір:', [
    ...COVER_COLORS.map(({ label, color }) => ({
      text: label,
      onPress: () => { setCoverColor(color); setCoverUri(null); },
    })),
    { text: 'Скасувати', style: 'cancel' as const },
  ]);

  const handleCoverPress = async () => {
    if (!isEditing) return;
    Alert.alert('Обкладинка', 'Дія:', [
      {
        text: 'Фото з галереї',
        onPress: async () => {
          try {
            const picker = await import('expo-image-picker');
            const result = await picker.launchImageLibraryAsync({ quality: 0.85 });
            if (!result.canceled && result.assets[0]) setCoverUri(result.assets[0].uri);
          } catch { pickColor(); }
        },
      },
      { text: 'Змінити колір', onPress: pickColor },
      { text: 'Скасувати', style: 'cancel' as const },
    ]);
  };

  const removeTrack = (trackId: string) => {
    setTracks((prev) => prev.filter((t) => t.id !== trackId));
  };

  const bg = isDark ? '#0C0C0E' : '#FFFFFF';
  const cardBg = isDark ? 'rgba(255,255,255,0.06)' : '#F2F2F7';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const subColor = isDark ? 'rgba(255,255,255,0.5)' : '#8E8E93';
  const sepColor = isDark ? 'rgba(255,255,255,0.08)' : '#E5E5EA';

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      {/* Glow */}
      <View style={[styles.glow, { backgroundColor: coverColor }]} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        {/* ── Header ──────────────────────────── */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} activeOpacity={0.6}>
            <Ionicons name="chevron-back" size={26} color={textColor} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setIsEditing((p) => !p)}
            activeOpacity={0.6}
          >
            <Text style={[styles.editLabel, { color: isEditing ? ACCENT : subColor }]}>
              {isEditing ? 'Готово' : 'Ред.'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Cover ───────────────────────────── */}
        <View style={styles.coverSection}>
          <TouchableOpacity onPress={handleCoverPress} activeOpacity={isEditing ? 0.75 : 1}>
            <View style={[styles.cover, { backgroundColor: coverColor }]}>
              {coverUri ? (
                <Image source={{ uri: coverUri }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
              ) : (
                <Ionicons name="musical-notes" size={64} color="rgba(255,255,255,0.3)" />
              )}
              {isEditing && (
                <View style={styles.coverEditBadge}>
                  <Ionicons name="color-palette" size={16} color="#FFFFFF" />
                </View>
              )}
            </View>
          </TouchableOpacity>
          <Text style={[styles.title, { color: textColor }]}>{playlist.title}</Text>
          <Text style={[styles.description, { color: subColor }]}>{playlist.description}</Text>
          <Text style={[styles.meta, { color: subColor }]}>
            {tracks.length} треків • {playlist.duration}
          </Text>
        </View>

        {/* ── Action Buttons ───────────────────── */}
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.playAllBtn, { backgroundColor: playlist.color }]} activeOpacity={0.8}>
            <Ionicons name="play" size={20} color="#FFFFFF" />
            <Text style={styles.playAllLabel}>Відтворити все</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconRoundBtn, { backgroundColor: cardBg }]}
            onPress={() => setIsLiked((p) => !p)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={22}
              color={isLiked ? ACCENT : subColor}
            />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.iconRoundBtn, { backgroundColor: cardBg }]} activeOpacity={0.7}>
            <Ionicons name="shuffle" size={22} color={subColor} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.iconRoundBtn, { backgroundColor: cardBg }]} activeOpacity={0.7}>
            <Ionicons name="ellipsis-horizontal" size={22} color={subColor} />
          </TouchableOpacity>
        </View>

        {/* ── Track List ──────────────────────── */}
        <View style={styles.trackList}>
          {tracks.map((track, index) => (
          <View key={track.id} style={styles.trackItem}>
              <TouchableOpacity style={styles.trackRow} activeOpacity={0.5}>
                <View style={[styles.trackThumb, { backgroundColor: track.color }]}>
                  <Ionicons name="musical-note" size={16} color="rgba(255,255,255,0.8)" />
                </View>
                <View style={styles.trackInfo}>
                  <Text style={[styles.trackTitle, { color: textColor }]} numberOfLines={1}>
                    {track.title}
                  </Text>
                  <Text style={[styles.trackArtist, { color: subColor }]} numberOfLines={1}>
                    {track.artist}
                  </Text>
                </View>
                <Text style={[styles.trackDuration, { color: subColor }]}>{track.duration}</Text>

                {isEditing ? (
                  <TouchableOpacity
                    style={styles.moreBtn}
                    onPress={() => removeTrack(track.id)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="trash-outline" size={20} color={ACCENT} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.moreBtn} activeOpacity={0.6}>
                    <Ionicons name="ellipsis-horizontal" size={18} color={subColor} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
              {index < tracks.length - 1 && <View style={[styles.separator, { backgroundColor: sepColor }]} />}
            </View>
          ))}
        </View>

        {/* ── Add Track ───────────────────────── */}
        {isEditing && (
          <TouchableOpacity style={[styles.addTrackBtn, { borderColor: ACCENT }]} activeOpacity={0.6}>
            <Ionicons name="add-circle-outline" size={22} color={ACCENT} />
            <Text style={[styles.addTrackLabel, { color: ACCENT }]}>Додати трек</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },
  glow: {
    position: 'absolute',
    top: -100,
    left: SCREEN_WIDTH / 2 - 120,
    width: 240,
    height: 240,
    borderRadius: 120,
    opacity: 0.15,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  iconBtn: {
    minWidth: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  editLabel: { fontSize: 16, fontWeight: '600' },

  coverSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  cover: {
    width: SCREEN_WIDTH * 0.52,
    height: SCREEN_WIDTH * 0.52,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 6 },
  description: { fontSize: 14, textAlign: 'center', marginBottom: 4 },
  meta: { fontSize: 13 },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 24,
  },
  playAllBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
  },
  playAllLabel: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  iconRoundBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  trackList: { paddingHorizontal: 20 },

  trackItem: {},
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  trackThumb: {
    width: 46,
    height: 46,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  trackInfo: { flex: 1, marginRight: 8 },
  trackTitle: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  trackArtist: { fontSize: 13 },
  trackDuration: { fontSize: 13, marginRight: 4 },
  moreBtn: { width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 58,
  },

  addTrackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  addTrackLabel: { fontSize: 15, fontWeight: '600' },
  coverEditBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 14,
    padding: 6,
  },
});
