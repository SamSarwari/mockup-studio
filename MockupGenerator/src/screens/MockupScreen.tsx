import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  Switch,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { MockupCanvas } from '../components/MockupCanvas';
import { BackgroundPicker } from '../components/BackgroundPicker';
import { ChassisPicker } from '../components/ChassisPicker';
import { ScreenshotPicker } from '../components/ScreenshotPicker';
import { ExportButton } from '../components/ExportButton';
import { PresetList } from '../components/PresetList';
import { DEFAULT_DEVICE } from '../config/devices';
import { DEFAULT_BACKGROUND } from '../utils/colors';
import { DEFAULT_CHASSIS_COLOR } from '../utils/chassisColors';
import { ScreenshotInfo, ChassisColor } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useSavePreset } from '../hooks/usePresets';

// Fixed 9:16 export canvas — 540 pts × 3× = 1620 × 2880 px (crisp Ultra-HD)
const EXPORT_W = 540;
const EXPORT_H = 960;
const EXPORT_PADDING = 70;

export const MockupScreen: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const { user, signOut } = useAuth();
  const savePreset = useSavePreset();

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

  const [isSavingPreset, setIsSavingPreset] = useState(false);
  const [presetNameInput, setPresetNameInput] = useState('');

  const handleApplyPreset = useCallback((preset: {
    chassisColor: ChassisColor;
    backgroundColor: string;
    showDynamicIsland: boolean;
  }) => {
    setChassisColor(preset.chassisColor);
    setBackgroundColor(preset.backgroundColor);
    setShowDynamicIsland(preset.showDynamicIsland);
  }, []);

  const handleOpenSavePreset = () => {
    setPresetNameInput(`${chassisColor.name} · ${isTransparent ? 'Transparent' : backgroundColor}`);
    setIsSavingPreset(true);
  };

  const handleConfirmSavePreset = () => {
    if (!presetNameInput.trim()) return;
    savePreset.mutate({
      name: presetNameInput.trim(),
      chassisColor,
      backgroundColor,
      showDynamicIsland,
    });
    setIsSavingPreset(false);
  };

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FD" />

      {/* Save Preset Modal */}
      <Modal
        visible={isSavingPreset}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSavingPreset(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Preset speichern</Text>
            <Text style={styles.modalSubtitle}>
              Gib einen Namen für deine aktuelle Mockup-Konfiguration ein:
            </Text>
            <TextInput
              style={styles.modalInput}
              value={presetNameInput}
              onChangeText={setPresetNameInput}
              placeholder="z.B. Mein YouTube Preset"
              placeholderTextColor="#94A3B8"
              autoFocus
              selectTextOnFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setIsSavingPreset(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Abbrechen</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleConfirmSavePreset}
                activeOpacity={0.85}
              >
                <Text style={styles.modalSaveText}>Speichern</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

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
              <TouchableOpacity style={styles.userChip} onPress={signOut} activeOpacity={0.8}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>
                    {displayName.charAt(0).toUpperCase()}
                  </Text>
                </View>
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

            {/* 2. Saved Presets */}
            <PresetList onApply={handleApplyPreset} />

            {/* 3. iPhone Finish Color */}
            <ChassisPicker selected={chassisColor} onChange={setChassisColor} />

            <View style={styles.divider} />

            {/* 4. Background Swatches */}
            <BackgroundPicker selectedColor={backgroundColor} onColorChange={setBackgroundColor} />

            <View style={styles.divider} />

            {/* 5. Dynamic Island Toggle */}
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

            {/* 6. Save Preset */}
            <TouchableOpacity
              style={styles.savePresetBtn}
              onPress={handleOpenSavePreset}
              activeOpacity={0.85}
            >
              <Text style={styles.savePresetIcon}>💾</Text>
              <Text style={styles.savePresetText}>Einstellungen als Preset speichern</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* 7. Ultra-HD Export Button */}
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
  userChip: {
    padding: 2,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
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
  savePresetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 12,
    gap: 8,
  },
  savePresetIcon: {
    fontSize: 16,
  },
  savePresetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  hint: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 10,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
  },
  modalCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  modalSaveBtn: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  modalSaveText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
