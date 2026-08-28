import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import { Session, User } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from '../lib/supabase';

WebBrowser.maybeCompleteAuthSession();

export type OAuthProvider = 'google' | 'apple' | 'github';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isGuest: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signInWithOAuth: (provider: OAuthProvider) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isGuest: false,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signInWithOAuth: async () => {},
  signOut: async () => {},
  continueAsGuest: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setIsGuest(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const continueAsGuest = useCallback(() => {
    setIsGuest(true);
  }, []);

  const formatAuthError = (err: any): string => {
    const msg = err?.message || String(err);
    if (msg.includes('Invalid login credentials')) {
      return 'E-Mail oder Passwort ist nicht korrekt.';
    }
    if (msg.includes('Email not confirmed')) {
      return 'E-Mail-Adresse ist noch nicht bestätigt. Bitte E-Mails prüfen oder "Confirm email" im Supabase Dashboard deaktivieren.';
    }
    if (msg.includes('User already registered')) {
      return 'Ein Konto mit dieser E-Mail-Adresse existiert bereits. Bitte melde dich an.';
    }
    if (msg.includes('rate limit') || msg.includes('over_email_send_rate_limit')) {
      return 'E-Mail-Sendelimit von Supabase erreicht. Deaktiviere "Confirm email" im Supabase Dashboard (unter Authentication -> Providers -> Email), um dich direkt anzumelden.';
    }
    return msg;
  };

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const friendlyMsg = formatAuthError(error);
      Alert.alert('Anmeldung fehlgeschlagen', friendlyMsg);
      throw error;
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName || email.split('@')[0] },
      },
    });
    if (error) {
      const friendlyMsg = formatAuthError(error);
      Alert.alert('Registrierung fehlgeschlagen', friendlyMsg);
      throw error;
    }

    if (data.session) {
      // Auto-confirmed in Supabase! Session will update automatically.
      return;
    }

    Alert.alert(
      'Konto erstellt ✓',
      'Bitte prüfe deine E-Mails zur Bestätigung. Tipp: Im Supabase Dashboard kannst du "Confirm email" ausschalten, damit neue Konten sofort aktiv sind.'
    );
  }, []);

  const signInWithOAuth = useCallback(async (provider: OAuthProvider) => {
    try {
      if (Platform.OS === 'web') {
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
          },
        });
        if (error) throw error;
      } else {
        const redirectUrl = makeRedirectUri({
          preferLocalhost: true,
        });

        const { data, error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: redirectUrl,
            skipBrowserRedirect: true,
          },
        });

        if (error) throw error;

        if (data?.url) {
          const res = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
          if (res.type === 'success' && res.url) {
            const urlObj = new URL(res.url);
            const code = urlObj.searchParams.get('code');
            if (code) {
              await supabase.auth.exchangeCodeForSession(code);
            }
          }
        }
      }
    } catch (err: any) {
      const friendlyMsg = formatAuthError(err);
      Alert.alert(`${provider.toUpperCase()} Anmeldung`, friendlyMsg);
    }
  }, []);

  const signOut = useCallback(async () => {
    setIsGuest(false);
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Fehler beim Abmelden', error.message);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isGuest,
        loading,
        signIn,
        signUp,
        signInWithOAuth,
        signOut,
        continueAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
