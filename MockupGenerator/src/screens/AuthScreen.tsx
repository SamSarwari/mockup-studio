import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuth, OAuthProvider } from '../contexts/AuthContext';

export const AuthScreen: React.FC = () => {
  const { signIn, signUp, signInWithOAuth, continueAsGuest } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<OAuthProvider | null>(null);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email.trim(), password, displayName.trim() || undefined);
      } else {
        await signIn(email.trim(), password);
      }
    } catch {
      // Handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: OAuthProvider) => {
    setSocialLoading(provider);
    try {
      await signInWithOAuth(provider);
    } catch {
      // Handled in AuthContext
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Branding */}
        <View style={styles.branding}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>📱</Text>
          </View>
          <Text style={styles.title}>Mockup Studio</Text>
          <Text style={styles.subtitle}>
            {isSignUp ? 'Erstelle dein Konto' : 'Melde dich an, um Mockups & Presets zu synchronisieren'}
          </Text>
        </View>

        {/* Social Logins */}
        <View style={styles.socialContainer}>
          {/* Apple Button */}
          <TouchableOpacity
            style={styles.socialBtnApple}
            onPress={() => handleSocialAuth('apple')}
            disabled={socialLoading !== null || loading}
            activeOpacity={0.85}
          >
            {socialLoading === 'apple' ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.socialBtnInner}>
                <Text style={styles.socialIcon}></Text>
                <Text style={styles.socialBtnAppleText}>Mit Apple anmelden</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Google Button */}
          <TouchableOpacity
            style={styles.socialBtnGoogle}
            onPress={() => handleSocialAuth('google')}
            disabled={socialLoading !== null || loading}
            activeOpacity={0.85}
          >
            {socialLoading === 'google' ? (
              <ActivityIndicator color="#0F172A" size="small" />
            ) : (
              <View style={styles.socialBtnInner}>
                <Text style={styles.googleIconText}>G</Text>
                <Text style={styles.socialBtnGoogleText}>Mit Google anmelden</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* GitHub Button */}
          <TouchableOpacity
            style={styles.socialBtnGithub}
            onPress={() => handleSocialAuth('github')}
            disabled={socialLoading !== null || loading}
            activeOpacity={0.85}
          >
            {socialLoading === 'github' ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.socialBtnInner}>
                <Text style={styles.socialIcon}>🐙</Text>
                <Text style={styles.socialBtnGithubText}>Mit GitHub anmelden</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ODER MIT E-MAIL</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          {isSignUp && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Dein Name"
                placeholderTextColor="#94A3B8"
                value={displayName}
                onChangeText={setDisplayName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>E-Mail</Text>
            <TextInput
              style={styles.input}
              placeholder="name@beispiel.de"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Passwort</Text>
            <TextInput
              style={styles.input}
              placeholder={isSignUp ? 'Mind. 6 Zeichen' : '••••••••'}
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitBtnText}>
                {isSignUp ? 'Konto erstellen' : 'Anmelden'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Toggle */}
        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => setIsSignUp((v) => !v)}
          activeOpacity={0.7}
        >
          <Text style={styles.toggleText}>
            {isSignUp ? 'Bereits ein Konto? ' : 'Noch kein Konto? '}
          </Text>
          <Text style={styles.toggleLink}>
            {isSignUp ? 'Anmelden' : 'Registrieren'}
          </Text>
        </TouchableOpacity>

        {/* Guest Mode */}
        <TouchableOpacity
          style={styles.guestBtn}
          onPress={continueAsGuest}
          activeOpacity={0.7}
        >
          <Text style={styles.guestBtnText}>Als Gast fortfahren →</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingTop: 40,
    paddingBottom: 40,
  },
  branding: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
  },
  iconEmoji: {
    fontSize: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  socialContainer: {
    gap: 10,
    marginBottom: 20,
  },
  socialBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  socialIcon: {
    fontSize: 18,
  },
  googleIconText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4285F4',
  },
  socialBtnApple: {
    backgroundColor: '#000000',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  socialBtnAppleText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  socialBtnGoogle: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },
  socialBtnGoogleText: {
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '700',
  },
  socialBtnGithub: {
    backgroundColor: '#24292F',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#24292F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  socialBtnGithubText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 22,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
    gap: 14,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginLeft: 2,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },
  submitBtn: {
    backgroundColor: '#6366F1',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  toggleText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  toggleLink: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '700',
  },
  guestBtn: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  guestBtnText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
  },
});
