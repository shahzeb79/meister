import { Stack } from "expo-router";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import 'react-native-reanimated'
import 'react-native-gesture-handler'

export default function Layout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false, animation: 'none'}}>
      <Stack.Screen name="index" />
      </Stack>
    </ThemeProvider>
  );
}
