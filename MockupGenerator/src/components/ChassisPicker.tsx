import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { CHASSIS_COLORS } from '../utils/chassisColors';
import { ChassisColor } from '../types';

interface ChassisPickerProps {
  selected: ChassisColor;
  onChange: (color: ChassisColor) => void;
}

export const ChassisPicker: React.FC<ChassisPickerProps> = ({ selected, onChange }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>iPhone Finish</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{selected.name}</Text>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.swatchRow}>
          {CHASSIS_COLORS.map((c) => {
            const isSelected = selected.name === c.name;
            const isLight = ['White Titanium', 'Natural Titanium', 'Silver', 'Desert Titanium'].includes(c.name);

            return (
              <TouchableOpacity
                key={c.name}
                onPress={() => onChange(c)}
                style={[
                  styles.swatchOuter,
                  isSelected && styles.swatchOuterSelected,
                ]}
                activeOpacity={0.8}
                accessibilityLabel={c.name}
              >
                <View
                  style={[
                    styles.swatchInner,
                    { backgroundColor: c.color },
                    isLight && styles.lightBorder,
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
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
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  lightBorder: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
});

