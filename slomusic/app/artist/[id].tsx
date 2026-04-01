import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/contexts/theme-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_ARTISTS: Record<string, {
  name: string;
  listeners: string;
  bio: string;
  color: string;
  topTracks: { id: string; title: string; plays: string; duration: string }[];
  albums: { id: string; title: string; year: string; color: string }[];
  similar: { id: string; name: string; color: string }[];
}> = {
  maxvibe: {
    name: 'MaxVibe',
    listeners: '1.2M слухачів на місяць',
    bio: 'MaxVibe — незалежний продюсер та виконавець, що поєднує lo-fi хіп-хоп з електронними битами. Відомий своєю унікальною атмосферою нічних треків.',
    color: '#FA243C',
    topTracks: [
      { id: '1', title: 'Midnight Code',    plays: '4.1M', duration: '3:20' },
      { id: '2', title: 'Neon Dreams',       plays: '2.8M', duration: '3:45' },
      { id: '3', title: 'Lo-Fi Session',     plays: '1.9M', duration: '4:02' },
      { id: '4', title: 'Dark Pixels',       plays: '1.4M', duration: '3:10' },
      { id: '5', title: 'Cloud Nine',        plays: '980K', duration: '2:58' },
    ],
    albums: [
      { id: '1', title: 'Midnight EP',   year: '2024', color: '#FA243C' },
      { id: '2', title: 'Neon Sessions', year: '2023', color: '#AF52DE' },
      { id: '3', title: 'Dark Pixels',   year: '2022', color: '#0A84FF' },
    ],
    similar: [
      { id: '1', name: 'Chillhop',   color: '#30D158' },
      { id: '2', name: 'SynthWave',  color: '#5E5CE6' },
      { id: '3', name: 'Ambient',    color: '#FF9F0A' },
      { id: '4', name: 'JS Master',  color: '#FF453A' },
    ],
  },
  default: {
    name: 'Виконавець',
    listeners: '500K слухачів на місяць',
    bio: 'Незалежний музикант з унікальним звучанням.',
    color: '#0A84FF',
    topTracks: [
      { id: '1', title: 'Трек 1', plays: '1.2M', duration: '3:30' },
      { id: '2', title: 'Трек 2', plays: '800K', duration: '3:15' },
      { id: '3', title: 'Трек 3', plays: '500K', duration: '4:00' },
    ],
    albums: [
      { id: '1', title: 'Альбом 1', year: '2024', color: '#0A84FF' },
      { id: '2', title: 'Альбом 2', year: '2023', color: '#AF52DE' },
    ],
    similar: [
      { id: '1', name: 'Артист 1', color: '#FA243C' },
      { id: '2', name: 'Артист 2', color: '#30D158' },
    ],
  },
};

// ── Component ────────────────────────────────────────────────────────────────

export default function ArtistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isFollowing, setIsFollowing] = useState(false);

  const { theme } = useAppTheme();
  const isDark = theme === 'dark';

  const TEXT_PRIMARY = isDark ? '#FFFFFF' : '#000000';
  const TEXT_SECONDARY = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)';
  const TEXT_MUTED = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)';
  const BORDER = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)';

  const artist = MOCK_ARTISTS[id?.toLowerCase() ?? ''] ?? MOCK_ARTISTS.default;

  return (
    <View style={[styles.root, { backgroundColor: isDark ? '#0C0C0E' : '#FFFFFF' }]}>
      {/* Blurred background */}
      <BlurView intensity={90} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      {/* Color glow */}
      <View style={[styles.glow, { backgroundColor: artist.color }]} />

      {/* Back button — fixed */}
      <View style={[styles.backBtn, { top: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backCircle} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        {/* ── Hero ──────────────────────────── */}
        <View style={[styles.hero, { backgroundColor: artist.color }]}>
          <View style={styles.heroArtIcon}>
            <Ionicons name="mic" size={80} color="rgba(255,255,255,0.3)" />
          </View>
          {/* Gradient overlay */}
          <BlurView intensity={20} tint="dark" style={styles.heroOverlay} />
          <View style={[styles.heroContent, { paddingTop: insets.top + 56 }]}>
            <Text style={styles.heroName}>{artist.name}</Text>
            <Text style={styles.heroListeners}>{artist.listeners}</Text>
          </View>
        </View>

        <View style={styles.content}>

          {/* ── Follow + Options ──────────────── */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.followBtn, { borderColor: isFollowing ? '#FA243C' : TEXT_SECONDARY }, isFollowing && styles.followBtnActive]}
              onPress={() => setIsFollowing((p) => !p)}
              activeOpacity={0.7}
            >
              <Text style={[styles.followLabel, { color: isFollowing ? '#FFFFFF' : TEXT_PRIMARY }, isFollowing && styles.followLabelActive]}>
                {isFollowing ? 'Відстежується' : 'Стежити'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionsBtn} activeOpacity={0.6}>
              <Ionicons name="ellipsis-horizontal" size={22} color={TEXT_SECONDARY} />
            </TouchableOpacity>
          </View>

          {/* ── Popular Tracks ───────────────── */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: TEXT_PRIMARY }]}>Популярні треки</Text>
            {artist.topTracks.map((track, index) => (
              <TouchableOpacity key={track.id} style={styles.trackRow} activeOpacity={0.5}>
                <Text style={[styles.trackRank, { color: TEXT_MUTED }]}>{index + 1}</Text>
                <View style={[styles.trackThumb, { backgroundColor: BORDER }]}>
                  <Ionicons name="musical-note" size={16} color={TEXT_SECONDARY} />
                </View>
                <View style={styles.trackInfo}>
                  <Text style={[styles.trackTitle, { color: TEXT_PRIMARY }]} numberOfLines={1}>{track.title}</Text>
                  <Text style={[styles.trackPlays, { color: TEXT_MUTED }]}>{track.plays} прослуховувань</Text>
                </View>
                <Text style={[styles.trackDuration, { color: TEXT_MUTED }]}>{track.duration}</Text>
                {index < artist.topTracks.length - 1 && <View style={[styles.separator, { backgroundColor: BORDER }]} />}
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Discography ──────────────────── */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: TEXT_PRIMARY }]}>Дискографія</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hScroll}
            >
              {artist.albums.map((album) => (
                <TouchableOpacity key={album.id} style={styles.albumCard} activeOpacity={0.7}>
                  <View style={[styles.albumArt, { backgroundColor: album.color }]}>
                    <Ionicons name="disc" size={32} color="rgba(255,255,255,0.4)" />
                  </View>
                  <Text style={[styles.albumTitle, { color: TEXT_PRIMARY }]} numberOfLines={1}>{album.title}</Text>
                  <Text style={[styles.albumYear, { color: TEXT_MUTED }]}>{album.year}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* ── Similar Artists ───────────────── */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: TEXT_PRIMARY }]}>Схожі виконавці</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hScroll}
            >
              {artist.similar.map((sim) => (
                <TouchableOpacity
                  key={sim.id}
                  style={styles.similarCard}
                  activeOpacity={0.7}
                  onPress={() => router.push({ pathname: '/artist/[id]', params: { id: sim.name.toLowerCase().replace(/\s+/g, '') } })}
                >
                  <View style={[styles.similarAvatar, { backgroundColor: sim.color }]}>
                    <Ionicons name="person" size={28} color="rgba(255,255,255,0.5)" />
                  </View>
                  <Text style={[styles.similarName, { color: TEXT_PRIMARY }]} numberOfLines={1}>{sim.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0C0C0E',
  },
  glow: {
    position: 'absolute',
    top: -100,
    left: -60,
    width: SCREEN_WIDTH + 120,
    height: SCREEN_WIDTH + 120,
    borderRadius: (SCREEN_WIDTH + 120) / 2,
    opacity: 0.2,
  },

  /* Back button */
  backBtn: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
  },
  backCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Hero */
  hero: {
    width: '100%',
    height: SCREEN_WIDTH * 0.85,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  heroArtIcon: {
    position: 'absolute',
    alignSelf: 'center',
    top: '25%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  heroContent: {
    padding: 24,
  },
  heroName: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  heroListeners: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },

  /* Content */
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  /* Actions */
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  followBtn: {
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  followBtnActive: {
    backgroundColor: '#FA243C',
    borderColor: '#FA243C',
  },
  followLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  followLabelActive: {
    color: '#FFFFFF',
  },
  optionsBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Bio */
  bio: {
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 28,
  },

  /* Sections */
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },

  /* Tracks */
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  trackRank: {
    width: 24,
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    marginRight: 12,
  },
  trackThumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  trackInfo: {
    flex: 1,
    marginRight: 12,
  },
  trackTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  trackPlays: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
  },
  trackDuration: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
  },
  separator: {
    position: 'absolute',
    bottom: 0,
    left: 80,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  /* Albums */
  hScroll: {
    gap: 14,
  },
  albumCard: {
    width: 130,
  },
  albumArt: {
    width: 130,
    height: 130,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  albumTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  albumYear: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
  },

  /* Similar Artists */
  similarCard: {
    width: 90,
    alignItems: 'center',
  },
  similarAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  similarName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
