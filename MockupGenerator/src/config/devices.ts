import { DeviceConfig } from '../types';

// iPhone 17 Pro Max (identical specs to iPhone 16 Pro Max)
// All values in logical points (@3x scale)
export const IPHONE_17_PRO_MAX: DeviceConfig = {
  id: 'iphone-17-pro-max',
  name: 'iPhone 17 Pro Max',
  displayWidth: 440,
  displayHeight: 956,
  cornerRadius: 58,
  bezelWidth: 10,
  chassisCornerRadius: 66,
  dynamicIsland: {
    width: 126,
    height: 37,
    topOffset: 11,
    cornerRadius: 18.5,
  },
  scaleFactor: 3,
};

export const DEVICES: DeviceConfig[] = [
  IPHONE_17_PRO_MAX,
  // Future devices can be added here:
  // IPHONE_17_PRO,
  // IPHONE_17,
  // IPHONE_16_PRO_MAX,
];

export const DEFAULT_DEVICE = IPHONE_17_PRO_MAX;
