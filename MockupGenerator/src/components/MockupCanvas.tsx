import React, { forwardRef } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { DeviceConfig, ScreenshotInfo, ChassisColor } from '../types';
import { scaleDeviceToPreview } from '../utils/geometry';
import { DEFAULT_CHASSIS_COLOR } from '../utils/chassisColors';

interface MockupCanvasProps {
  screenshot: ScreenshotInfo | null;
  device: DeviceConfig;
  backgroundColor: string;
  showDynamicIsland: boolean;
  chassisColor?: ChassisColor;
  canvasWidth: number;
  canvasHeight: number;
  padding?: number;
}

export const MockupCanvas = forwardRef<View, MockupCanvasProps>(({
  screenshot,
  device,
  backgroundColor,
  showDynamicIsland,
  chassisColor = DEFAULT_CHASSIS_COLOR,
  canvasWidth,
  canvasHeight,
  padding = 16,
}, ref) => {
  const { scale, chassisWidth, chassisHeight, offsetX, offsetY } =
    scaleDeviceToPreview(device, canvasWidth, canvasHeight, padding);

  const displayW = device.displayWidth * scale;
  const displayH = device.displayHeight * scale;
  const bezel = device.bezelWidth * scale;
  const cornerR = device.cornerRadius * scale;
  const chassisCornerR = device.chassisCornerRadius * scale;

  const diW = device.dynamicIsland.width * scale;
  const diH = device.dynamicIsland.height * scale;
  const diTop = device.dynamicIsland.topOffset * scale;
  const diR = device.dynamicIsland.cornerRadius * scale;

  const isTransparent = backgroundColor === 'transparent';

  // Hardware button color derived from chassis
  const isLightChassis = ['Natural Titanium', 'White Titanium', 'Silver', 'Desert Titanium'].includes(chassisColor.name);
  const buttonColor = isLightChassis ? '#A0A0A4' : '#38383C';
  const buttonBorderColor = isLightChassis ? '#B8B8BC' : '#48484A';

  return (
    <View
      ref={ref}
      collapsable={false}
      style={[
        styles.canvas,
        {
          width: canvasWidth,
          height: canvasHeight,
          backgroundColor: isTransparent ? 'transparent' : backgroundColor,
        },
      ]}
    >
      {/* Left: Action Button */}
      <View
        style={[
          styles.hardwareButton,
          {
            backgroundColor: buttonColor,
            borderColor: buttonBorderColor,
            left: offsetX - Math.max(1.5, 2 * scale),
            top: offsetY + chassisHeight * 0.17,
            width: Math.max(1.5, 2 * scale),
            height: 26 * scale,
            borderTopLeftRadius: 2,
            borderBottomLeftRadius: 2,
          },
        ]}
      />
      {/* Left: Volume Up */}
      <View
        style={[
          styles.hardwareButton,
          {
            backgroundColor: buttonColor,
            borderColor: buttonBorderColor,
            left: offsetX - Math.max(1.5, 2 * scale),
            top: offsetY + chassisHeight * 0.24,
            width: Math.max(1.5, 2 * scale),
            height: 44 * scale,
            borderTopLeftRadius: 2,
            borderBottomLeftRadius: 2,
          },
        ]}
      />
      {/* Left: Volume Down */}
      <View
        style={[
          styles.hardwareButton,
          {
            backgroundColor: buttonColor,
            borderColor: buttonBorderColor,
            left: offsetX - Math.max(1.5, 2 * scale),
            top: offsetY + chassisHeight * 0.32,
            width: Math.max(1.5, 2 * scale),
            height: 44 * scale,
            borderTopLeftRadius: 2,
            borderBottomLeftRadius: 2,
          },
        ]}
      />
      {/* Right: Power Button */}
      <View
        style={[
          styles.hardwareButton,
          {
            backgroundColor: buttonColor,
            borderColor: buttonBorderColor,
            left: offsetX + chassisWidth,
            top: offsetY + chassisHeight * 0.23,
            width: Math.max(1.5, 2 * scale),
            height: 68 * scale,
            borderTopRightRadius: 2,
            borderBottomRightRadius: 2,
          },
        ]}
      />
      {/* Right: Camera Control */}
      <View
        style={[
          styles.hardwareButton,
          {
            backgroundColor: buttonColor,
            borderColor: buttonBorderColor,
            left: offsetX + chassisWidth,
            top: offsetY + chassisHeight * 0.68,
            width: Math.max(1.2, 1.6 * scale),
            height: 52 * scale,
            borderTopRightRadius: 1.5,
            borderBottomRightRadius: 1.5,
          },
        ]}
      />

      {/* Titanium Chassis Outer Frame */}
      <View
        style={[
          styles.titaniumChassis,
          {
            width: chassisWidth,
            height: chassisHeight,
            left: offsetX,
            top: offsetY,
            borderRadius: chassisCornerR,
            padding: bezel,
            backgroundColor: chassisColor.color,
            borderColor: chassisColor.borderColor,
            shadowOpacity: isTransparent ? 0 : 0.22,
            shadowRadius: isTransparent ? 0 : 18,
            elevation: isTransparent ? 0 : 8,
          },
        ]}
      >
        {/* Antenna Bands */}
        <View
          style={[
            styles.antennaBand,
            { left: 0, top: chassisHeight * 0.11, width: bezel, height: 1.5 },
          ]}
        />
        <View
          style={[
            styles.antennaBand,
            { right: 0, top: chassisHeight * 0.11, width: bezel, height: 1.5 },
          ]}
        />
        <View
          style={[
            styles.antennaBand,
            { left: 0, bottom: chassisHeight * 0.11, width: bezel, height: 1.5 },
          ]}
        />
        <View
          style={[
            styles.antennaBand,
            { right: 0, bottom: chassisHeight * 0.11, width: bezel, height: 1.5 },
          ]}
        />

        {/* Display Screen */}
        <View
          style={[
            styles.display,
            {
              width: displayW,
              height: displayH,
              borderRadius: cornerR,
            },
          ]}
        >
          {screenshot ? (
            <Image
              source={{ uri: screenshot.uri }}
              style={styles.screenshotImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.emptyScreen} />
          )}

          {/* Dynamic Island */}
          {showDynamicIsland && (
            <View
              style={[
                styles.dynamicIsland,
                {
                  width: diW,
                  height: diH,
                  top: diTop,
                  borderRadius: diR,
                  left: (displayW - diW) / 2,
                },
              ]}
            >
              <View
                style={[
                  styles.cameraLens,
                  {
                    width: 9 * scale,
                    height: 9 * scale,
                    borderRadius: 4.5 * scale,
                    right: 8 * scale,
                  },
                ]}
              >
                <View
                  style={[
                    styles.lensHighlight,
                    {
                      width: 2.5 * scale,
                      height: 2.5 * scale,
                      borderRadius: 1.25 * scale,
                    },
                  ]}
                />
              </View>
            </View>
          )}

          {/* Screen Glass Reflection */}
          <View
            pointerEvents="none"
            style={[
              styles.screenReflection,
              {
                borderRadius: cornerR,
              },
            ]}
          />
        </View>

        {/* Outer Titanium Bezel Gleam */}
        <View
          pointerEvents="none"
          style={[
            styles.chassisBezelGleam,
            {
              borderRadius: chassisCornerR,
              borderWidth: Math.max(1, 1.2 * scale),
              borderColor: chassisColor.gleamColor,
            },
          ]}
        />

        {/* Inner Edge Shadow */}
        <View
          pointerEvents="none"
          style={[
            styles.innerBezelEdge,
            {
              borderRadius: chassisCornerR - 1,
              top: 1,
              left: 1,
              right: 1,
              bottom: 1,
            },
          ]}
        />
      </View>
    </View>
  );
});

MockupCanvas.displayName = 'MockupCanvas';

const styles = StyleSheet.create({
  canvas: {
    position: 'relative',
    overflow: 'visible',
  },
  hardwareButton: {
    position: 'absolute',
    zIndex: 5,
    borderWidth: 0.5,
  },
  titaniumChassis: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 14 },
    borderWidth: 1,
  },
  antennaBand: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: 2,
  },
  display: {
    backgroundColor: '#000000',
    overflow: 'hidden',
    position: 'relative',
  },
  screenshotImage: {
    width: '100%',
    height: '100%',
  },
  emptyScreen: {
    width: '100%',
    height: '100%',
    backgroundColor: '#050507',
  },
  dynamicIsland: {
    position: 'absolute',
    backgroundColor: '#000000',
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 6,
  },
  cameraLens: {
    position: 'absolute',
    backgroundColor: '#0D0D14',
    borderWidth: 0.5,
    borderColor: '#1A1A28',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lensHighlight: {
    backgroundColor: '#35355A',
    opacity: 0.6,
  },
  screenReflection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 0.8,
  },
  chassisBezelGleam: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  innerBezelEdge: {
    position: 'absolute',
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.5)',
  },
});
