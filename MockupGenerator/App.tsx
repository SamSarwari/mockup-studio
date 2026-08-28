import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  Switch,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { MockupCanvas } from './src/components/MockupCanvas';
import { BackgroundPicker } from './src/components/BackgroundPicker';
import { ChassisPicker } from './src/components/ChassisPicker';
import { ScreenshotPicker } from './src/components/ScreenshotPicker';
import { ExportButton } from './src/components/ExportButton';
import { DEFAULT_DEVICE } from './src/config/devices';
import { DEFAULT_BACKGROUND } from './src/utils/colors';
import { DEFAULT_CHASSIS_COLOR } from './src/utils/chassisColors';
import { ScreenshotInfo, ChassisColor } from './src/types';

// Fixed 9:16 export canvas — 540 pts × 3× = 1620 × 2880 px (crisp Ultra-HD)
const EXPORT_W = 540;
const EXPORT_H = 960;
const EXPORT_PADDING = 70;

export default function App() {
  const { width, height } = useWindowDimensions();

  const exportCanvasRef = useRef<View>(null);

  const [screenshot, setScreenshot] = useState<ScreenshotInfo | null>(null);
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_BACKGROUND);
  const [chassisColor, setChassisColor] = useState<ChassisColor>(DEFAULT_CHASSIS_COLOR);
  const [showDynamicIsland, setShowDynamicIsland] = useState(true);
  const [loading, setLoading] = useState(false);

  const device = DEFAULT_DEVICE;
  const isTransparent = backgroundColor === 'transparent';
  const previewCanvasHeight = Math.min(540, Math.max(380, Math.floor(height * 0.52)));

  const handleScreenshotSelected = useCallback(async (info: ScreenshotInfo) => {
    setLoading(true);
    setScreenshot(info);
    setLoading(false);
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FD" />

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
              <Text style={styles.headerTitle}>Mockup Studio</Text>
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>PRO</Text>
              </View>
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
            <ChassisPicker selected={chassisColor} onChange={setChassisColor} />

            <View style={styles.divider} />

            {/* 3. Background Swatches */}
            <BackgroundPicker selectedColor={backgroundColor} onColorChange={setBackgroundColor} />

            <View style={styles.divider} />

            {/* 4. Dynamic Island Toggle */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleTexts}>
                <Text style={styles.toggleLabel}>Dynamic Island</Text>
                <Text style={styles.toggleSub}>Pille im Mockup anzeigen</Text>
              </View>
              <Switch
                value={showDynamicIsland}
                onValueChange={setShowDynamicIsland}
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
}

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

