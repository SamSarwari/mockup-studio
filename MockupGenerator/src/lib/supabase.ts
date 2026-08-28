import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Platform } from 'react-native';

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://tgnkurouzcspzyahfeba.supabase.co';
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_slECk8RVVnod0sWcEmT1BA_VgLpumyw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web', // Critical for Web OAuth redirects
  },
});

// Refresh auth tokens when app returns to foreground
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
