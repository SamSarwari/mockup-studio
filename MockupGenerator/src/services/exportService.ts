import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { DeviceConfig, ScreenshotInfo } from '../types';

export interface ExportOptions {
  screenshot: ScreenshotInfo;
  device: DeviceConfig;
  backgroundColor: string;
  showDynamicIsland: boolean;
  viewRef?: any;
}

/**
 * Exports the hidden 9:16 canvas at maximum quality.
 *
 * pixelRatio: 3  →  540 pt × 3 = 1620 px wide, 960 pt × 3 = 2880 px tall
 * That gives a crisp 1620 × 2880 px PNG — well above Full-HD.
 *
 * drawViewHierarchyInRect (no useRenderInContext) correctly captures Image URIs.
 * 200 ms delay ensures async images are composited before snapshot.
 */
export async function exportMockupAsPng(options: ExportOptions): Promise<string> {
  const { viewRef } = options;
  if (!viewRef || !viewRef.current) throw new Error('Canvas-Referenz nicht verfügbar');

  await new Promise<void>((resolve) => setTimeout(resolve, 200));

  const captureOptions: any = {
    format: 'png',
    quality: 1.0,
    result: 'tmpfile',
    pixelRatio: 3,
  };

  return await captureRef(viewRef.current, captureOptions);
}

export async function saveToGallery(uri: string): Promise<boolean> {
  const { status } = await MediaLibrary.requestPermissionsAsync(true);
  if (status !== 'granted') return false;
  await MediaLibrary.saveToLibraryAsync(uri);
  return true;
}

export async function shareImage(uri: string): Promise<void> {
  const isAvailable = await Sharing.isAvailableAsync();
  if (!isAvailable) return;
  await Sharing.shareAsync(uri, { mimeType: 'image/png', UTI: 'public.png' });
}
