export interface DeviceConfig {
  id: string;
  name: string;
  // All values in logical points
  displayWidth: number;
  displayHeight: number;
  cornerRadius: number;
  bezelWidth: number;
  chassisCornerRadius: number;
  dynamicIsland: {
    width: number;
    height: number;
    topOffset: number;
    cornerRadius: number;
  };
  scaleFactor: number; // @3x = 3
}

export interface ChassisColor {
  name: string;
  color: string;       // Hauptfarbe des Gehäuses
  borderColor: string; // Außenkante / Reflexionskante
  gleamColor: string;  // Innere Titan-Kantenreflexion
}

export interface ScreenshotInfo {
  uri: string;
  width: number;
  height: number;
}

export interface BackgroundColor {
  name: string;
  value: string;
}

export interface MockupState {
  screenshot: ScreenshotInfo | null;
  selectedDevice: DeviceConfig;
  backgroundColor: string;
  showDynamicIsland: boolean;
}

export type ExportPreset = {
  name: string;
  width: number;
  height: number;
};
