import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePlayer } from '@/contexts/player-context';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/contexts/theme-context';

// ── Component ────────────────────────────────────────────────────────────────

export default function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlayPause, playNext } = usePlayer();
  const router = useRouter();
  const { theme } = useAppTheme();
  const isDark = theme === 'dark';

  if (!currentTrack) return null;

  const bg = isDark ? '#2C2C2E' : '#F2F2F7';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const iconColor = isDark ? '#FFFFFF' : '#000000';
  const subtitleColor = isDark ? 'rgba(255,255,255,0.55)' : '#8E8E93';

  return (
    <Pressable
      style={[styles.container, { backgroundColor: bg }]}
      onPress={() => router.push('/modal')}
      android_ripple={null}
    >
      {/* Album art */}
      <View style={[styles.art, { backgroundColor: currentTrack.color }]}>
        <Ionicons name="musical-note" size={16} color="rgba(255,255,255,0.85)" />
      </View>

      {/* Track info */}
      <View style={styles.info}>
        <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
          {currentTrack.title}
        </Text>
        <Text style={[styles.artist, { color: subtitleColor }]} numberOfLines={1}>
          {currentTrack.artist}
        </Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={togglePlayPause}
          style={styles.controlBtn}
          activeOpacity={0.6}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color={iconColor} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={playNext}
          style={styles.controlBtn}
          activeOpacity={0.6}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="play-forward" size={22} color={iconColor} />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 12,
  },
  art: {
    width: 42,
    height: 42,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  artist: {
    fontSize: 13,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  controlBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
