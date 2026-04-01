import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/contexts/theme-context';

const ACCENT = '#FA243C';

// ── Helper ────────────────────────────────────────────────────────────────────

function SettingsRow({
  icon,
  label,
  value,
  onPress,
  rightElement,
  isDark,
  isLast = false,
}: {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  isDark: boolean;
  isLast?: boolean;
}) {
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const subColor = isDark ? 'rgba(255,255,255,0.45)' : '#8E8E93';
  const sepColor = isDark ? 'rgba(255,255,255,0.08)' : '#E5E5EA';

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={onPress ? 0.5 : 1}
      disabled={!onPress && !rightElement}
    >
      <View style={[styles.rowIcon, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F2F2F7' }]}>
        <Ionicons name={icon as any} size={18} color={ACCENT} />
      </View>
      <View style={styles.rowContent}>
        <Text style={[styles.rowLabel, { color: textColor }]}>{label}</Text>
        {value ? <Text style={[styles.rowValue, { color: subColor }]}>{value}</Text> : null}
      </View>
      <View style={styles.rowRight}>
        {rightElement ?? (onPress ? <Ionicons name="chevron-forward" size={18} color={subColor} /> : null)}
      </View>
      {!isLast && <View style={[styles.rowSeparator, { backgroundColor: sepColor }]} />}
    </TouchableOpacity>
  );
}

function SectionHeader({ title, isDark }: { title: string; isDark: boolean }) {
  return (
    <Text style={[styles.sectionHeader, { color: isDark ? 'rgba(255,255,255,0.45)' : '#8E8E93' }]}>
      {title}
    </Text>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, toggleTheme } = useAppTheme();
  const isDark = theme === 'dark';

  const [notifications, setNotifications] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);
  const [highQuality, setHighQuality] = useState(true);
  const [language, setLanguage] = useState('Українська');

  const bg = isDark ? '#0C0C0E' : '#F2F2F7';
  const cardBg = isDark ? '#1C1C1E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#000000';

  const handleClearCache = () => {
    Alert.alert(
      'Очистити кеш',
      'Ви впевнені? Це видалить усі тимчасові файли.',
      [
        { text: 'Скасувати', style: 'cancel' },
        { text: 'Очистити', style: 'destructive', onPress: () => Alert.alert('Готово', 'Кеш очищено') },
      ]
    );
  };

  const handleDeleteDownloads = () => {
    Alert.alert(
      'Видалити завантаження',
      'Усі завантажені треки будуть видалені.',
      [
        { text: 'Скасувати', style: 'cancel' },
        { text: 'Видалити', style: 'destructive', onPress: () => Alert.alert('Готово', 'Завантаження видалено') },
      ]
    );
  };

  const handleLanguage = () => {
    Alert.alert('Мова інтерфейсу', 'Виберіть мову', [
      { text: 'Українська', onPress: () => setLanguage('Українська') },
      { text: 'English', onPress: () => setLanguage('English') },
      { text: 'Скасувати', style: 'cancel' },
    ]);
  };

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.6}>
          <Ionicons name="chevron-back" size={26} color={isDark ? '#FFFFFF' : '#000000'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Налаштування</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        {/* ── Зовнішній вигляд ──────────────── */}
        <SectionHeader title="ЗОВНІШНІЙ ВИГЛЯД" isDark={isDark} />
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <SettingsRow
            icon="contrast"
            label="Тема"
            value={isDark ? 'Темна' : 'Світла'}
            isDark={isDark}
            isLast
            rightElement={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: '#3A3A3C', true: ACCENT }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#3A3A3C"
              />
            }
          />
        </View>
        <Text style={[styles.sectionHint, { color: isDark ? 'rgba(255,255,255,0.3)' : '#AEAEB2' }]}>
          Тема змінюється автоматично відповідно до системних налаштувань
        </Text>

        {/* ── Мова ──────────────────────────── */}
        <SectionHeader title="МОВ А ТА РЕГІОН" isDark={isDark} />
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <SettingsRow
            icon="language"
            label="Мова інтерфейсу"
            value={language}
            onPress={handleLanguage}
            isDark={isDark}
            isLast
          />
        </View>

        {/* ── Аудіо ─────────────────────────── */}
        <SectionHeader title="АУДІО" isDark={isDark} />
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <SettingsRow
            icon="musical-notes"
            label="Висока якість звуку"
            isDark={isDark}
            rightElement={
              <Switch
                value={highQuality}
                onValueChange={setHighQuality}
                trackColor={{ false: '#3A3A3C', true: ACCENT }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#3A3A3C"
              />
            }
          />
          <SettingsRow
            icon="cloud-download"
            label="Авто-завантаження"
            isDark={isDark}
            isLast
            rightElement={
              <Switch
                value={autoDownload}
                onValueChange={setAutoDownload}
                trackColor={{ false: '#3A3A3C', true: ACCENT }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#3A3A3C"
              />
            }
          />
        </View>

        {/* ── Сповіщення ────────────────────── */}
        <SectionHeader title="СПОВІЩЕННЯ" isDark={isDark} />
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <SettingsRow
            icon="notifications"
            label="Нові релізи"
            isDark={isDark}
            isLast
            rightElement={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#3A3A3C', true: ACCENT }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#3A3A3C"
              />
            }
          />
        </View>

        {/* ── Сховище ───────────────────────── */}
        <SectionHeader title="СХОВИЩЕ" isDark={isDark} />
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <SettingsRow
            icon="folder"
            label="Завантажено"
            value="234 МБ"
            isDark={isDark}
          />
          <SettingsRow
            icon="trash"
            label="Видалити завантаження"
            onPress={handleDeleteDownloads}
            isDark={isDark}
          />
          <SettingsRow
            icon="refresh-circle"
            label="Очистити кеш"
            value="18 МБ"
            onPress={handleClearCache}
            isDark={isDark}
            isLast
          />
        </View>

        {/* ── Про застосунок ────────────────── */}
        <SectionHeader title="ПРО ЗАСТОСУНОК" isDark={isDark} />
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <SettingsRow icon="musical-note" label="SLOmusic" value="Версія 1.0.0" isDark={isDark} />
          <SettingsRow icon="document-text" label="Умови використання" onPress={() => {}} isDark={isDark} />
          <SettingsRow icon="shield-checkmark" label="Політика конфіденційності" onPress={() => {}} isDark={isDark} isLast />
        </View>

        {/* ── Вихід ─────────────────────────── */}
        <View style={[styles.card, styles.logoutCard, { backgroundColor: cardBg }]}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => router.replace('/auth')}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={20} color={ACCENT} />
            <Text style={styles.logoutText}>Вийти з акаунту</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 28,
    marginBottom: 8,
    marginHorizontal: 20,
  },
  sectionHint: {
    fontSize: 12,
    marginHorizontal: 20,
    marginTop: 6,
    lineHeight: 18,
  },

  card: {
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: 'hidden',
  },
  logoutCard: {
    marginTop: 28,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    minHeight: 52,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rowContent: { flex: 1 },
  rowLabel: { fontSize: 16, fontWeight: '500' },
  rowValue: { fontSize: 13, marginTop: 1 },
  rowRight: { marginLeft: 8 },
  rowSeparator: {
    position: 'absolute',
    bottom: 0,
    left: 60,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },

  themeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  themeBadgeText: { fontSize: 13, fontWeight: '600' },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: ACCENT,
  },
});
