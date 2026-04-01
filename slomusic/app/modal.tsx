import { useAppTheme } from '@/contexts/theme-context';
import { usePlayer } from '@/contexts/player-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  LayoutAnimation,
  PanResponder,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ALBUM_ART_SIZE = SCREEN_WIDTH - 64;

// ── Mock lyrics (shown in Lyrics tab) ────────────────────────────────────────
const LYRICS = [
  'У серці тиша, але звук не зник,',
  'Він десь між рядків, між нот і слів.',
  'Midnight code plays on repeat tonight,',
  "The city sleeps but we're still wide awake.",
  '',
  'Кожна нота — це крок уперед,',
  'Кожен ритм — це новий світ.',
  'We write the music, we write the code,',
  'Dancing through the dark on this endless road.',
  '',
  'Вмикай гучніше, не зупиняйся,',
  'Дозволь мелодії нести тебе.',
];

export default function PlayerScreen() {
  const router = useRouter();
  const { currentTrack, isPlaying, togglePlayPause } = usePlayer();
  const { theme } = useAppTheme();
  const isDark = theme === 'dark';

  const TEXT_PRIMARY = isDark ? '#FFFFFF' : '#000000';
  const TEXT_SECONDARY = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';
  const TEXT_MUTED = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)';
  const ICON_COLOR = isDark ? '#FFFFFF' : '#000000';
  const PILL_BG = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const CONTROL_BG = isDark ? '#FFFFFF' : '#000000';
  const CONTROL_FG = isDark ? '#000000' : '#FFFFFF';
  const TRACK_BG = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';

  const [progress, setProgress] = useState(0.35);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0=off 1=all 2=one
  const [activeTab, setActiveTab] = useState<'now' | 'lyrics'>('now');
  const [showQueue, setShowQueue] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  // Enable LayoutAnimation on Android
  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  const transitionCompact = (compact: boolean) => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
      update: { type: LayoutAnimation.Types.easeInEaseOut },
      delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
    });
    setIsCompact(compact);
  };

  const insets = useSafeAreaInsets();

  // ── Swipe-down to close ──────────────────────────────────────────────────
  const translateY = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gs) =>
        gs.dy > 8 && Math.abs(gs.dy) > Math.abs(gs.dx),
      onPanResponderMove: (_, gs) => {
        if (gs.dy > 0) translateY.setValue(gs.dy);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > 120) {
          router.back();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const track = currentTrack ?? {
    title: 'Midnight Code',
    artist: 'MaxVibe',
    color: '#FA243C',
  };

  const formatTime = (ratio: number) => {
    const total = 217; // 3:37 mock
    const secs = Math.round(ratio * total);
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const cycleRepeat = () => setRepeatMode((prev) => (prev + 1) % 3);
  const repeatIcon = repeatMode === 2 ? 'repeat-outline' : 'repeat';
  const repeatColor = repeatMode > 0 ? '#FA243C' : TEXT_SECONDARY;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Слухаємо «${track.title}» — ${track.artist} у SLOmusic 🎵`,
        title: track.title,
      });
    } catch {
      // user dismissed sheet
    }
  };

  return (
    <Animated.View
      style={[styles.root, { backgroundColor: isDark ? '#0C0C0E' : '#FFFFFF', transform: [{ translateY }] }]}
      {...panResponder.panHandlers}
    >
      {/* Full-screen blurred background */}
      <BlurView intensity={95} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      {/* Coloured glow behind album art */}
      <View style={[styles.glow, { backgroundColor: track.color }]} />

      {/* Drag handle */}
      <View style={styles.dragHandleRow}>
        <View style={[styles.dragHandle, { backgroundColor: TEXT_MUTED }]} />
      </View>

      <View
        style={[
          styles.safeArea,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        {/* ── Header ─────────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerBtn}
            activeOpacity={0.6}
          >
            <Ionicons name="chevron-down" size={28} color={ICON_COLOR} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.headerSub, { color: TEXT_MUTED }]}>Зараз грає</Text>
            <Text style={[styles.headerPlaylist, { color: TEXT_PRIMARY }]} numberOfLines={1}>
              Нічний Кодинг
            </Text>
          </View>
          <TouchableOpacity style={styles.headerBtn} activeOpacity={0.6} onPress={handleShare}>
            <Ionicons name="ellipsis-horizontal" size={24} color={ICON_COLOR} />
          </TouchableOpacity>
        </View>

        {/* ── Art / Compact Header (Apple Music style) ── */}
        {isCompact ? (
          /* Compact: small art LEFT + track info RIGHT */
          <View style={styles.compactHeader}>
            <View style={[styles.compactArt, { backgroundColor: track.color }]}>
              <Ionicons name="musical-notes" size={30} color="rgba(255,255,255,0.5)" />
            </View>
            <View style={styles.compactInfo}>
              <Text style={[styles.compactTitle, { color: TEXT_PRIMARY }]} numberOfLines={1}>{track.title}</Text>
              <TouchableOpacity
                onPress={() => router.push({ pathname: '/artist/[id]', params: { id: track.artist.toLowerCase().replace(/\s+/g, '') } })}
                activeOpacity={0.6}
              >
                <Text style={[styles.compactArtist, { color: TEXT_SECONDARY }]} numberOfLines={1}>{track.artist}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setIsLiked((p) => !p)} activeOpacity={0.7}>
              <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={24} color={isLiked ? '#FA243C' : TEXT_SECONDARY} />
            </TouchableOpacity>
          </View>
        ) : (
          /* Full: large art centered + track info below */
          <>
            <View style={styles.artContainer}>
              <View style={[styles.art, { backgroundColor: track.color }]}>
                <Ionicons name="musical-notes" size={ALBUM_ART_SIZE * 0.35} color="rgba(255,255,255,0.35)" />
              </View>
            </View>
            <View style={styles.trackRow}>
              <View style={styles.trackInfo}>
                <Text style={[styles.trackTitle, { color: TEXT_PRIMARY }]} numberOfLines={1}>{track.title}</Text>
                <TouchableOpacity
                  onPress={() => router.push({ pathname: '/artist/[id]', params: { id: track.artist.toLowerCase().replace(/\s+/g, '') } })}
                  activeOpacity={0.6}
                >
                  <Text style={[styles.trackArtist, { textDecorationLine: 'underline', color: TEXT_SECONDARY }]} numberOfLines={1}>{track.artist}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => setIsLiked((p) => !p)} activeOpacity={0.7}>
                <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={28} color={isLiked ? '#FA243C' : TEXT_SECONDARY} />
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* ── Tabs + Queue Toggle ─────────────── */}
        <View style={[styles.tabRow, { backgroundColor: PILL_BG }]}>
          {!showQueue && (['now', 'lyrics'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
              onPress={() => {
                setActiveTab(tab);
                transitionCompact(tab === 'lyrics');
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive, { color: activeTab === tab ? TEXT_PRIMARY : TEXT_MUTED }]}>
                {tab === 'now' ? 'Зараз грає' : 'Текст'}
              </Text>
            </TouchableOpacity>
          ))}
          {showQueue && <Text style={[styles.queueTabLabel, { color: TEXT_PRIMARY }]}>Черга</Text>}
          <TouchableOpacity
            style={styles.queueTabBtn}
            onPress={() => {
              const next = !showQueue;
              setShowQueue(next);
              transitionCompact(next);
              if (!next) setActiveTab('now');
            }}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="list" size={22} color={showQueue ? '#FA243C' : TEXT_SECONDARY} />
          </TouchableOpacity>
        </View>

        {activeTab === 'now' && !showQueue ? (
          <>
            {/* ── Progress Bar ─────────────────── */}
            <View style={styles.progressSection}>
              <View style={[styles.progressTrack, { backgroundColor: TRACK_BG }]}>
                <View
                  style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: ICON_COLOR }]}
                >
                  <View style={[styles.progressThumb, { backgroundColor: ICON_COLOR }]} />
                </View>
              </View>
              <View style={styles.progressTimes}>
                <Text style={[styles.time, { color: TEXT_MUTED }]}>{formatTime(progress)}</Text>
                <Text style={[styles.time, { color: TEXT_MUTED }]}>{formatTime(1)}</Text>
              </View>
            </View>

            {/* ── Playback Controls ──────────────── */}
            <View style={styles.controls}>
              <TouchableOpacity
                onPress={() => setIsShuffle((p) => !p)}
                activeOpacity={0.6}
              >
                <Ionicons
                  name="shuffle"
                  size={26}
                  color={isShuffle ? '#FA243C' : TEXT_SECONDARY}
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.ctrlBtn} activeOpacity={0.6}>
                <Ionicons name="play-skip-back" size={32} color={ICON_COLOR} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.playBtn, { backgroundColor: CONTROL_BG }]}
                onPress={togglePlayPause}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={36}
                  color={CONTROL_FG}
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.ctrlBtn} activeOpacity={0.6}>
                <Ionicons name="play-skip-forward" size={32} color={ICON_COLOR} />
              </TouchableOpacity>

              <TouchableOpacity onPress={cycleRepeat} activeOpacity={0.6}>
                <Ionicons name={repeatIcon} size={26} color={repeatColor} />
              </TouchableOpacity>
            </View>

            {/* ── Volume ─────────────────────────── */}
            <View style={styles.volumeRow}>
              <Ionicons
                name="volume-low"
                size={18}
                color={TEXT_MUTED}
              />
              <View style={[styles.volumeTrack, { backgroundColor: TRACK_BG }]}>
                <View style={[styles.volumeFill, { backgroundColor: ICON_COLOR }]} />
              </View>
              <Ionicons
                name="volume-high"
                size={18}
                color={TEXT_MUTED}
              />
            </View>

          </>
        ) : showQueue ? (
          /* ── Queue ───────────────────────── */
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.queueContainer}
            contentContainerStyle={styles.queueContent}
          >
            {[
              { title: 'Neon Dreams',   artist: 'MaxVibe',   color: '#AF52DE' },
              { title: 'Lo-Fi Session', artist: 'Chillhop',  color: '#0A84FF' },
              { title: 'Dark Pixels',   artist: 'MaxVibe',   color: '#30D158' },
              { title: 'Cloud Nine',    artist: 'SynthWave', color: '#FF9F0A' },
              { title: 'Electric Haze', artist: 'Ambient',   color: '#FA243C' },
            ].map((item, i) => (
              <View key={i} style={styles.queueItem}>
                <View style={[styles.queueThumb, { backgroundColor: item.color }]}>
                  <Ionicons name="musical-note" size={16} color="rgba(255,255,255,0.85)" />
                </View>
                <View style={styles.queueInfo}>
                  <Text style={[styles.queueTrackTitle, { color: TEXT_PRIMARY }]} numberOfLines={1}>{item.title}</Text>
                  <Text style={[styles.queueTrackArtist, { color: TEXT_SECONDARY }]} numberOfLines={1}>{item.artist}</Text>
                </View>
                <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} activeOpacity={0.6}>
                  <Ionicons name="close" size={18} color={TEXT_MUTED} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        ) : (
          /* ── Lyrics Tab ──────────────────────── */
          <View style={styles.lyricsContainer}>
            {LYRICS.map((line, i) => (
              <Text
                key={i}
                style={[styles.lyricsLine, { color: TEXT_MUTED }, line === '' && styles.lyricsBlank]}
              >
                {line}
              </Text>
            ))}
          </View>
        )}
      </View>
    </Animated.View>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0C0C0E',
  },
  dragHandleRow: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 2,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  glow: {
    position: 'absolute',
    top: -120,
    left: -80,
    width: SCREEN_WIDTH + 160,
    height: SCREEN_WIDTH + 160,
    borderRadius: (SCREEN_WIDTH + 160) / 2,
    opacity: 0.25,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  headerBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerSub: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerPlaylist: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 2,
  },

  /* Compact header (small art left + info right) */
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    gap: 12,
  },
  compactArt: {
    width: 64,
    height: 64,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  compactInfo: {
    flex: 1,
  },
  compactTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  compactArtist: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
  },

  /* Album Art */
  artContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  art: {
    width: ALBUM_ART_SIZE,
    height: ALBUM_ART_SIZE,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Track Info */
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  trackInfo: {
    flex: 1,
    marginRight: 16,
  },
  trackTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
  },

  /* Tabs */
  tabRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    padding: 3,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.45)',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },

  /* Progress */
  progressSection: {
    marginBottom: 24,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
    overflow: 'visible',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    position: 'relative',
  },
  progressThumb: {
    position: 'absolute',
    right: -6,
    top: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  progressTimes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
  },

  /* Controls */
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  ctrlBtn: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Volume */
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 28,
  },
  volumeTrack: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  volumeFill: {
    width: '65%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },

  /* Bottom actions */
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },

  /* Lyrics */
  lyricsContainer: {
    flex: 1,
    paddingTop: 8,
  },
  lyricsLine: {
    fontSize: 17,
    lineHeight: 28,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
    marginBottom: 2,
  },
  lyricsBlank: {
    marginVertical: 4,
  },

  /* Queue */
  queueContainer: {
    marginTop: 12,
    flex: 1,
  },
  queueContent: {
    paddingBottom: 20,
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  queueInfo: {
    flex: 1,
    flexShrink: 1,
    marginRight: 8,
  },
  queueTrackTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  queueTrackArtist: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
  },
  queueRemoveBtn: {
    padding: 4,
  },
  queueTabLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 6,
  },
  queueTabBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  queueThumb: {
    width: 42,
    height: 42,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
});
