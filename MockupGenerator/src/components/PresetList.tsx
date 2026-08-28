import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { usePresets, useDeletePreset, Preset } from '../hooks/usePresets';
import { ChassisColor } from '../types';

interface PresetListProps {
  onApply: (preset: {
    chassisColor: ChassisColor;
    backgroundColor: string;
    showDynamicIsland: boolean;
  }) => void;
}

export const PresetList: React.FC<PresetListProps> = ({ onApply }) => {
  const { data: presets, isLoading } = usePresets();
  const deletePreset = useDeletePreset();

  if (isLoading || !presets || presets.length === 0) return null;

  const handleLongPress = (preset: Preset) => {
    Alert.alert(
      'Preset löschen?',
      `"${preset.name}" unwiderruflich entfernen?`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: () => deletePreset.mutate(preset.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>Gespeicherte Presets</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{presets.length}</Text>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.row}>
          {presets.map((preset) => (
            <TouchableOpacity
              key={preset.id}
              style={styles.presetChip}
              onPress={() =>
                onApply({
                  chassisColor: preset.chassis_color,
                  backgroundColor: preset.background_color,
                  showDynamicIsland: preset.show_dynamic_island,
                })
              }
              onLongPress={() => handleLongPress(preset)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.colorDot,
                  { backgroundColor: preset.chassis_color.color },
                ]}
              />
              <Text style={styles.presetName} numberOfLines={1}>
                {preset.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  badge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '700',
  },
  scrollView: {
    flexGrow: 0,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    maxWidth: 160,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  presetName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
});
