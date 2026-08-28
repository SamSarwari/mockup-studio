import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { PRESET_COLORS } from '../utils/colors';

interface BackgroundPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export const BackgroundPicker: React.FC<BackgroundPickerProps> = ({
  selectedColor,
  onColorChange,
}) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customHex, setCustomHex] = useState('');

  const handleCustomSubmit = () => {
    const hex = customHex.startsWith('#') ? customHex : `#${customHex}`;
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      onColorChange(hex);
      setShowCustomInput(false);
      setCustomHex('');
    } else {
      Alert.alert('Ungültige Farbe', 'Bitte einen gültigen Hex-Farbwert eingeben (z.B. #FF5733)');
    }
  };

  const selectedPreset = PRESET_COLORS.find(c => c.value === selectedColor);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>Hintergrund</Text>
        <View style={[styles.badge, selectedColor === 'transparent' && styles.transparentBadge]}>
          <Text style={[styles.badgeText, selectedColor === 'transparent' && styles.transparentBadgeText]}>
            {selectedPreset ? selectedPreset.name : selectedColor}
          </Text>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.swatchRow}>
          {PRESET_COLORS.map((color) => {
            const isTransparent = color.value === 'transparent';
            const isSelected = selectedColor === color.value;

            if (isTransparent) {
              return (
                <TouchableOpacity
                  key="transparent"
                  style={[
                    styles.swatchOuter,
                    isSelected && styles.swatchOuterSelected,
                  ]}
                  onPress={() => onColorChange('transparent')}
                  activeOpacity={0.8}
                  accessibilityLabel="Transparenter Hintergrund"
                >
                  <View style={[styles.swatchInner, styles.transparentInner]}>
                    <View style={styles.checkerGrid}>
                      <View style={[styles.checkerTile, styles.checkerWhite]} />
                      <View style={[styles.checkerTile, styles.checkerGray]} />
                      <View style={[styles.checkerTile, styles.checkerGray]} />
                      <View style={[styles.checkerTile, styles.checkerWhite]} />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                key={color.value}
                style={[
                  styles.swatchOuter,
                  isSelected && styles.swatchOuterSelected,
                ]}
                onPress={() => onColorChange(color.value)}
                activeOpacity={0.8}
                accessibilityLabel={color.name}
              >
                <View
                  style={[
                    styles.swatchInner,
                    { backgroundColor: color.value },
                    styles.swatchBorder,
                  ]}
                />
              </TouchableOpacity>
            );
          })}
          {/* Custom color button */}
          <TouchableOpacity
            style={[styles.swatchOuter, showCustomInput && styles.swatchOuterSelected]}
            onPress={() => setShowCustomInput((v) => !v)}
            activeOpacity={0.8}
            accessibilityLabel="Benutzerdefinierte Farbe"
          >
            <View style={[styles.swatchInner, styles.customSwatchInner]}>
              <Text style={styles.customSwatchText}>+</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showCustomInput && (
        <View style={styles.customInputRow}>
          <Text style={styles.hashSign}>#</Text>
          <TextInput
            style={styles.hexInput}
            value={customHex.replace('#', '')}
            onChangeText={setCustomHex}
            placeholder="E9E7FD"
            placeholderTextColor="#94A3B8"
            maxLength={7}
            autoCapitalize="characters"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleCustomSubmit}
          />
          <TouchableOpacity style={styles.applyBtn} onPress={handleCustomSubmit} activeOpacity={0.8}>
            <Text style={styles.applyBtnText}>Anwenden</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const SWATCH = 34;

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  badge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  transparentBadge: {
    backgroundColor: '#ECFDF5',
  },
  transparentBadgeText: {
    color: '#059669',
  },
  scrollView: {
    flexGrow: 0,
  },
  swatchRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  swatchOuter: {
    width: SWATCH + 8,
    height: SWATCH + 8,
    borderRadius: (SWATCH + 8) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchOuterSelected: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  swatchInner: {
    width: SWATCH,
    height: SWATCH,
    borderRadius: SWATCH / 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  swatchBorder: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  transparentInner: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  checkerGrid: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  checkerTile: {
    width: '50%',
    height: '50%',
  },
  checkerWhite: {
    backgroundColor: '#FFFFFF',
  },
  checkerGray: {
    backgroundColor: '#CBD5E1',
  },
  customSwatchInner: {
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
  },
  customSwatchText: {
    color: '#6366F1',
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '500',
  },
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  hashSign: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
  hexInput: {
    flex: 1,
    color: '#0F172A',
    fontSize: 15,
    fontFamily: 'Courier',
    fontWeight: '600',
    height: 36,
  },
  applyBtn: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
});

