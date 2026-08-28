import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ScreenshotInfo } from '../types';

interface ScreenshotPickerProps {
  hasScreenshot: boolean;
  loading: boolean;
  onScreenshotSelected: (info: ScreenshotInfo) => void;
}

export const ScreenshotPicker: React.FC<ScreenshotPickerProps> = ({
  hasScreenshot,
  loading,
  onScreenshotSelected,
}) => {
  const handlePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      onScreenshotSelected({
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
      });
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, hasScreenshot ? styles.buttonSecondary : styles.buttonPrimary]}
      onPress={handlePick}
      disabled={loading}
      activeOpacity={0.85}
      accessibilityLabel="Screenshot auswählen"
    >
      {loading ? (
        <ActivityIndicator color={hasScreenshot ? '#6366F1' : '#FFFFFF'} />
      ) : (
        <View style={styles.buttonInner}>
          <Text style={styles.icon}>{hasScreenshot ? '🔄' : '📸'}</Text>
          <Text style={[styles.buttonText, hasScreenshot && styles.buttonTextSecondary]}>
            {hasScreenshot ? 'Screenshot ändern' : 'Screenshot auswählen'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  buttonPrimary: {
    backgroundColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonSecondary: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    fontSize: 18,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  buttonTextSecondary: {
    color: '#334155',
  },
});

