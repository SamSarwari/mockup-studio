import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';

interface WelcomeModalProps {
  visible: boolean;
  onClose: () => void;
}

const PAYPAL_POOL_URL = 'https://www.paypal.com/pool/9sgq2cTgeE?sr=wccr';
const SUPPORT_EMAIL = 'te3sam@gmail.com';

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ visible, onClose }) => {
  const handleOpenPayPal = async () => {
    try {
      await Linking.openURL(PAYPAL_POOL_URL);
    } catch (err) {
      console.warn('Could not open PayPal URL:', err);
    }
  };

  const handleContactEmail = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=Feedback%20zu%20Mockup%20Studio`).catch(() => {});
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.closeBtnText}>✕ Schließen</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Icon & Title */}
          <View style={styles.heroSection}>
            <View style={styles.heroIconBadge}>
              <Text style={styles.heroIcon}>📱</Text>
            </View>
            <Text style={styles.appTitle}>Mockup Studio</Text>
            <View style={styles.pillBadge}>
              <Text style={styles.pillBadgeText}>100% Kostenlos · Ohne Werbung</Text>
            </View>
            <Text style={styles.heroSubtitle}>
              Erstelle ultrahochauflösende iPhone 17 Pro Max Mockups in Sekunden.
            </Text>
          </View>

          {/* Features Highlights */}
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIconBox, { backgroundColor: '#EEF2FF' }]}>
                <Text style={styles.featureIcon}>⚡</Text>
              </View>
              <View style={styles.featureTexts}>
                <Text style={styles.featureTitle}>Sekundenschnell & Ultra-HD</Text>
                <Text style={styles.featureDesc}>
                  3x Retina-Auflösung (1620 × 2880 px) für gestochen scharfe Präsentationen.
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIconBox, { backgroundColor: '#F0FDF4' }]}>
                <Text style={styles.featureIcon}>🎨</Text>
              </View>
              <View style={styles.featureTexts}>
                <Text style={styles.featureTitle}>8 Titan-Finishes & Pastellfarben</Text>
                <Text style={styles.featureDesc}>
                  Wähle Gehäusefarben, ästhetische Hintergründe oder echten transparenten PNG-Export.
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIconBox, { backgroundColor: '#FFFBEB' }]}>
                <Text style={styles.featureIcon}>🔒</Text>
              </View>
              <View style={styles.featureTexts}>
                <Text style={styles.featureTitle}>100% Privat & Lokal</Text>
                <Text style={styles.featureDesc}>
                  Deine Fotos und Screenshots verlassen niemals dein Gerät. Kein Login erforderlich.
                </Text>
              </View>
            </View>
          </View>

          {/* Creator & Support Message */}
          <View style={styles.supportCard}>
            <View style={styles.supportHeader}>
              <Text style={styles.supportEmoji}>❤️</Text>
              <Text style={styles.supportTitle}>Ein Projekt von Samiullah</Text>
            </View>
            <Text style={styles.supportText}>
              Ich baue kostenlose, einfache Tools für Creator, Designer und Entwickler. Mockup Studio ist und bleibt für immer komplett kostenlos und werbefrei.
            </Text>
            <Text style={styles.supportTextSub}>
              Wenn dir die App gefällt und du meine Arbeit an weiteren kostenlosen Projekten unterstützen möchtest, freue ich mich riesig über deine Unterstützung:
            </Text>

            {/* PayPal Button */}
            <TouchableOpacity
              style={styles.paypalButton}
              onPress={handleOpenPayPal}
              activeOpacity={0.85}
            >
              <Text style={styles.paypalButtonIcon}>☕</Text>
              <Text style={styles.paypalButtonText}>Projekt auf PayPal unterstützen</Text>
            </TouchableOpacity>
          </View>

          {/* Feedback & Contact */}
          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>Ideen oder Feedback?</Text>
            <TouchableOpacity onPress={handleContactEmail} activeOpacity={0.7}>
              <Text style={styles.contactLink}>{SUPPORT_EMAIL}</Text>
            </TouchableOpacity>
          </View>

          {/* Main Action Button */}
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaButtonText}>🚀 Loslegen & Mockup erstellen</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
  },
  closeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
  },
  heroIconBadge: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
    marginBottom: 14,
  },
  heroIcon: {
    fontSize: 34,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  pillBadge: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  pillBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 290,
  },
  featureList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  featureIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  featureIcon: {
    fontSize: 18,
  },
  featureTexts: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 17,
  },
  supportCard: {
    backgroundColor: '#FAF5FF',
    borderColor: '#E9D5FF',
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },
  supportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  supportEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  supportTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6B21A8',
  },
  supportText: {
    fontSize: 13,
    color: '#4C1D95',
    lineHeight: 19,
    marginBottom: 6,
  },
  supportTextSub: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 14,
  },
  paypalButton: {
    backgroundColor: '#0070BA',
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0070BA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  paypalButtonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  paypalButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  contactRow: {
    alignItems: 'center',
    marginBottom: 20,
  },
  contactLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  contactLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4F46E5',
    textDecorationLine: 'underline',
  },
  ctaButton: {
    backgroundColor: '#111827',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
