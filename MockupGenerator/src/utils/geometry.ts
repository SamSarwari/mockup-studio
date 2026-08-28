import { DeviceConfig } from '../types';

export interface ImageRect {
  srcX: number;
  srcY: number;
  srcWidth: number;
  srcHeight: number;
  dstX: number;
  dstY: number;
  dstWidth: number;
  dstHeight: number;
}

/**
 * Computes src/dst rects to fit a screenshot into the device display area.
 * Uses "cover" mode: screenshot fills display completely, excess is cropped.
 * Top-aligned so status bar / Dynamic Island area is preserved.
 */
export function computeScreenshotRect(
  screenshotWidth: number,
  screenshotHeight: number,
  displayWidth: number,
  displayHeight: number
): ImageRect {
  const srcAspect = screenshotWidth / screenshotHeight;
  const dstAspect = displayWidth / displayHeight;

  let srcX = 0;
  let srcY = 0;
  let srcWidth = screenshotWidth;
  let srcHeight = screenshotHeight;

  if (srcAspect > dstAspect) {
    // Screenshot wider than display → crop sides (center crop)
    srcWidth = screenshotHeight * dstAspect;
    srcX = (screenshotWidth - srcWidth) / 2;
  } else {
    // Screenshot taller than display → top-align, crop bottom
    srcHeight = screenshotWidth / dstAspect;
    srcY = 0;
  }

  return {
    srcX,
    srcY,
    srcWidth,
    srcHeight,
    dstX: 0,
    dstY: 0,
    dstWidth: displayWidth,
    dstHeight: displayHeight,
  };
}

/**
 * Computes the total chassis size including bezels.
 */
export function getChassisSize(device: DeviceConfig): { width: number; height: number } {
  return {
    width: device.displayWidth + device.bezelWidth * 2,
    height: device.displayHeight + device.bezelWidth * 2,
  };
}

/**
 * Scales a device config to fit within a given preview area,
 * returning the scale factor and translated origin.
 */
export function scaleDeviceToPreview(
  device: DeviceConfig,
  availableWidth: number,
  availableHeight: number,
  padding: number = 24
): { scale: number; chassisWidth: number; chassisHeight: number; offsetX: number; offsetY: number } {
  const chassis = getChassisSize(device);
  const maxW = availableWidth - padding * 2;
  const maxH = availableHeight - padding * 2;

  const scaleByWidth = maxW / chassis.width;
  const scaleByHeight = maxH / chassis.height;
  const scale = Math.min(scaleByWidth, scaleByHeight);

  const chassisWidth = chassis.width * scale;
  const chassisHeight = chassis.height * scale;
  const offsetX = (availableWidth - chassisWidth) / 2;
  const offsetY = (availableHeight - chassisHeight) / 2;

  return { scale, chassisWidth, chassisHeight, offsetX, offsetY };
}
