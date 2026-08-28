import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isGuest: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
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
  resetPassword: async () => {},
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
      return 'E-Mail-Sendelimit von Supabase erreicht. Bitte warte kurz oder deaktiviere "Confirm email" im Supabase Dashboard.';
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
      'Dein Konto wurde erfolgreich erstellt!'
    );
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: Platform.OS === 'web' && typeof window !== 'undefined' ? window.location.origin : undefined,
    });
    if (error) {
      const friendlyMsg = formatAuthError(error);
      Alert.alert('Passwort zurücksetzen', friendlyMsg);
      throw error;
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
        resetPassword,
        signOut,
        continueAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
