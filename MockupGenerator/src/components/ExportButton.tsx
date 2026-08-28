import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { ScreenshotInfo, DeviceConfig } from '../types';
import { exportMockupAsPng, saveToGallery, shareImage } from '../services/exportService';

interface ExportButtonProps {
  screenshot: ScreenshotInfo | null;
  device: DeviceConfig;
  backgroundColor: string;
  showDynamicIsland: boolean;
  viewRef?: any;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  screenshot,
  device,
  backgroundColor,
  showDynamicIsland,
  viewRef,
}) => {
  const [exporting, setExporting] = React.useState(false);
  const isTransparent = backgroundColor === 'transparent';

  const handleExport = async () => {
    if (!screenshot) {
      Alert.alert('Kein Screenshot', 'Bitte wähle zuerst einen Screenshot aus.');
      return;
    }

    setExporting(true);
    try {
      const uri = await exportMockupAsPng({
        screenshot,
        device,
        backgroundColor,
        showDynamicIsland,
        viewRef,
      });

      const actions = [
        {
          text: '📷  In Fotomediathek',
          onPress: async () => {
            const saved = await saveToGallery(uri);
            if (saved) {
              Alert.alert(
                '✅ Gespeichert',
                isTransparent
                  ? 'PNG gespeichert! Hinweis: Apple Fotos stellt transparente Bilder mit dunklem Hintergrund dar – die Freistellung ist aber 100% transparent. Nutze "Teilen" für Canva, Figma oder Messenger.'
                  : 'Das hochauflösende Mockup wurde in deiner Fotomediathek gespeichert.'
              );
            } else {
              Alert.alert('Fehler', 'Berechtigung für Fotomediathek verweigert.');
            }
          },
        },
        {
          text: '🔗  Teilen / In Dateien sichern',
          onPress: () => shareImage(uri),
        },
        {
          text: 'Abbrechen',
          style: 'cancel' as const,
        },
      ];

      Alert.alert('Mockup exportieren', 'Wohin möchtest du das Ultra-HD Mockup speichern?', actions);
    } catch (err: any) {
      console.error('Export error:', err);
      Alert.alert('Fehler beim Export', err?.message ?? String(err));
    } finally {
      setExporting(false);
    }
  };

  const disabled = !screenshot || exporting;

  return (
    <TouchableOpacity
      style={[styles.button, disabled ? styles.buttonDisabled : styles.buttonActive]}
      onPress={handleExport}
      disabled={disabled}
      activeOpacity={0.85}
      accessibilityLabel="Als PNG exportieren"
    >
      {exporting ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <View style={styles.buttonInner}>
          <Text style={styles.icon}>✨</Text>
          <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
            Ultra-HD PNG exportieren
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  buttonActive: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 18,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  buttonTextDisabled: {
    color: '#94A3B8',
    fontWeight: '600',
  },
});

