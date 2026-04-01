import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import MiniPlayer from '@/components/mini-player';
import { useAppTheme, ThemeProvider } from '@/contexts/theme-context';
import { PlayerProvider } from '@/contexts/player-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

const TAB_BAR_HEIGHT = 49;

function AppContent() {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const miniPlayerBottom = TAB_BAR_HEIGHT + insets.bottom;

  return (
    <NavThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'fullScreenModal', headerShown: false }} />
          <Stack.Screen name="artist/[id]" options={{ presentation: 'modal', headerShown: false }} />
          <Stack.Screen name="auth" options={{ presentation: 'fullScreenModal', headerShown: false }} />
          <Stack.Screen name="settings" options={{ presentation: 'modal', headerShown: false }} />
          <Stack.Screen name="playlist/[id]" options={{ presentation: 'modal', headerShown: false }} />
        </Stack>

        {/* Mini-player floats above tab bar */}
        <View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            bottom: miniPlayerBottom,
            left: 0,
            right: 0,
          }}
        >
          <MiniPlayer />
        </View>
      </View>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <PlayerProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </PlayerProvider>
  );
}
