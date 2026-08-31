import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  Switch,
  StatusBar,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MockupCanvas } from '../components/MockupCanvas';
import { BackgroundPicker } from '../components/BackgroundPicker';
import { ChassisPicker } from '../components/ChassisPicker';
import { ScreenshotPicker } from '../components/ScreenshotPicker';
import { ExportButton } from '../components/ExportButton';
import { WelcomeModal } from '../components/WelcomeModal';
import { DEFAULT_DEVICE } from '../config/devices';
import { DEFAULT_BACKGROUND } from '../utils/colors';
import { DEFAULT_CHASSIS_COLOR } from '../utils/chassisColors';
import { ScreenshotInfo, ChassisColor } from '../types';

// Fixed 9:16 export canvas — 540 pts × 3× = 1620 × 2880 px (crisp Ultra-HD)
const EXPORT_W = 540;
const EXPORT_H = 960;
const EXPORT_PADDING = 70;

const STORAGE_KEY_BG = 'MOCKUP_STUDIO_PREF_BG';
const STORAGE_KEY_CHASSIS = 'MOCKUP_STUDIO_PREF_CHASSIS';
const STORAGE_KEY_ISLAND = 'MOCKUP_STUDIO_PREF_ISLAND';
const STORAGE_KEY_WELCOME = 'MOCKUP_STUDIO_HAS_SEEN_WELCOME';

export const MockupScreen: React.FC = () => {
  const { width, height } = useWindowDimensions();

  const exportCanvasRef = useRef<View>(null);

  const [screenshot, setScreenshot] = useState<ScreenshotInfo | null>(null);
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_BACKGROUND);
  const [chassisColor, setChassisColor] = useState<ChassisColor>(DEFAULT_CHASSIS_COLOR);
  const [showDynamicIsland, setShowDynamicIsland] = useState(true);
  const [loading, setLoading] = useState(false);
  const [welcomeModalVisible, setWelcomeModalVisible] = useState(false);

  const device = DEFAULT_DEVICE;
  const isTransparent = backgroundColor === 'transparent';
  const previewCanvasHeight = Math.min(540, Math.max(380, Math.floor(height * 0.52)));

  // 1. Load saved preferences from AsyncStorage on startup
  useEffect(() => {
    async function loadSavedPreferences() {
      try {
        const [savedBg, savedChassis, savedIsland, hasSeenWelcome] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY_BG),
          AsyncStorage.getItem(STORAGE_KEY_CHASSIS),
          AsyncStorage.getItem(STORAGE_KEY_ISLAND),
          AsyncStorage.getItem(STORAGE_KEY_WELCOME),
        ]);

        if (savedBg) {
          setBackgroundColor(savedBg);
        }
        if (savedChassis) {
          try {
            setChassisColor(JSON.parse(savedChassis));
          } catch {}
        }
        if (savedIsland !== null) {
          try {
            setShowDynamicIsland(JSON.parse(savedIsland));
          } catch {}
        }
        // Show welcome screen on first launch
        if (!hasSeenWelcome) {
          setWelcomeModalVisible(true);
        }
      } catch (err) {
        console.warn('Could not load user preferences:', err);
      }
    }

    loadSavedPreferences();
  }, []);

  const handleCloseWelcome = () => {
    setWelcomeModalVisible(false);
    AsyncStorage.setItem(STORAGE_KEY_WELCOME, 'true').catch(() => {});
  };

  // 2. Persistent preference setters
  const handleBackgroundChange = (color: string) => {
    setBackgroundColor(color);
    AsyncStorage.setItem(STORAGE_KEY_BG, color).catch(() => {});
  };

  const handleChassisChange = (color: ChassisColor) => {
    setChassisColor(color);
    AsyncStorage.setItem(STORAGE_KEY_CHASSIS, JSON.stringify(color)).catch(() => {});
  };

  const handleToggleDynamicIsland = (val: boolean) => {
    setShowDynamicIsland(val);
    AsyncStorage.setItem(STORAGE_KEY_ISLAND, JSON.stringify(val)).catch(() => {});
  };

  const handleScreenshotSelected = useCallback(async (info: ScreenshotInfo) => {
    setLoading(true);
    setScreenshot(info);
    setLoading(false);
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FD" />

      {/* Welcome & Support Modal */}
      <WelcomeModal
        visible={welcomeModalVisible}
        onClose={handleCloseWelcome}
      />

      {/* ── Hidden 9:16 Ultra-HD Export Canvas (off-screen compositor) ── */}
      <View
        style={[styles.exportWrapper, { left: width + 20, width: EXPORT_W, height: EXPORT_H }]}
        pointerEvents="none"
      >
        <MockupCanvas
          ref={exportCanvasRef}
          screenshot={screenshot}
          device={device}
          backgroundColor={backgroundColor}
          chassisColor={chassisColor}
          showDynamicIsland={showDynamicIsland}
          canvasWidth={EXPORT_W}
          canvasHeight={EXPORT_H}
          padding={EXPORT_PADDING}
        />
      </View>

      <SafeAreaView style={styles.safe}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTopRow}>
              <View style={styles.headerLeft}>
                <Text style={styles.headerTitle}>Mockup Studio</Text>
                <View style={styles.proBadge}>
                  <Text style={styles.proBadgeText}>PRO</Text>
                </View>
              </View>

              {/* Info / Support Button */}
              <TouchableOpacity
                style={styles.supportChip}
                onPress={() => setWelcomeModalVisible(true)}
                activeOpacity={0.8}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.supportChipEmoji}>❤️</Text>
                <Text style={styles.supportChipText}>Über & Support</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.headerSubtitle}>
              {device.name} · {chassisColor.name}
            </Text>
          </View>

          {/* Preview Stage */}
          <View style={[styles.canvasContainer, isTransparent && styles.canvasContainerTransparent]}>
            {isTransparent && (
              <View style={styles.transparentBadge} pointerEvents="none">
                <Text style={styles.transparentBadgeText}>Freigestellt (PNG) ✓</Text>
              </View>
            )}
            <MockupCanvas
              screenshot={screenshot}
              device={device}
              backgroundColor={backgroundColor}
              chassisColor={chassisColor}
              showDynamicIsland={showDynamicIsland}
              canvasWidth={width - 24}
              canvasHeight={previewCanvasHeight}
              padding={18}
            />
            {!screenshot && (
              <View style={styles.placeholder} pointerEvents="none">
                <View style={styles.placeholderIconWrapper}>
                  <Text style={styles.placeholderIcon}>✨</Text>
                </View>
                <Text style={styles.placeholderTitle}>Kein Screenshot gewählt</Text>
                <Text style={styles.placeholderText}>Tippe unten auf Auswählen</Text>
              </View>
            )}
          </View>

          {/* Controls Card */}
          <View style={styles.card}>
            {/* 1. Screenshot Button */}
            <ScreenshotPicker
              hasScreenshot={screenshot !== null}
              loading={loading}
              onScreenshotSelected={handleScreenshotSelected}
            />

            <View style={styles.divider} />

            {/* 2. iPhone Finish Color */}
            <ChassisPicker selected={chassisColor} onChange={handleChassisChange} />

            <View style={styles.divider} />

            {/* 3. Background Swatches */}
            <BackgroundPicker selectedColor={backgroundColor} onColorChange={handleBackgroundChange} />

            <View style={styles.divider} />

            {/* 4. Dynamic Island Toggle */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleTexts}>
                <Text style={styles.toggleLabel}>Dynamic Island</Text>
                <Text style={styles.toggleSub}>Pille im Mockup anzeigen</Text>
              </View>
              <Switch
                value={showDynamicIsland}
                onValueChange={handleToggleDynamicIsland}
                trackColor={{ false: '#E2E8F0', true: '#6366F1' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#E2E8F0"
              />
            </View>

            <View style={styles.divider} />

            {/* 5. Ultra-HD Export Button */}
            <ExportButton
              screenshot={screenshot}
              device={device}
              backgroundColor={backgroundColor}
              chassisColor={chassisColor}
              showDynamicIsland={showDynamicIsland}
              viewRef={exportCanvasRef}
            />

            {!screenshot && (
              <Text style={styles.hint}>Wähle zuerst ein Bild aus, um das Mockup zu speichern.</Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  exportWrapper: {
    position: 'absolute',
    top: 0,
    zIndex: -1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.6,
  },
  proBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  proBadgeText: {
    color: '#6366F1',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  supportChip: {
    backgroundColor: '#FAF5FF',
    borderColor: '#E9D5FF',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  supportChipEmoji: {
    fontSize: 13,
  },
  supportChipText: {
    color: '#7C3AED',
    fontSize: 12,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
    fontWeight: '500',
  },
  canvasContainer: {
    marginHorizontal: 12,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  canvasContainerTransparent: {
    backgroundColor: 'transparent',
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  transparentBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 30,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  transparentBadgeText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '700',
  },
  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  placeholderIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  placeholderIcon: {
    fontSize: 26,
  },
  placeholderTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  placeholderText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '400',
  },
  card: {
    marginHorizontal: 12,
    marginTop: 14,
    paddingHorizontal: 18,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
    gap: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  toggleTexts: {
    flex: 1,
    marginRight: 12,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  toggleSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  hint: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 10,
    fontWeight: '500',
  },
});
