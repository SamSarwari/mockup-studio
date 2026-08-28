# Project Guide: Mockup Studio (MockupGenerator)

## Overview
A React Native / Expo application that creates realistic, ultra-high-resolution iPhone 17 Pro Max device mockups with customizable titanium chassis finishes, soft pastel background palettes, dynamic island toggling, and 100% transparent PNG export in 9:16 aspect ratio ($1620 \times 2880$ px).

## Tech Stack
- Expo SDK 54 (`expo@~54.0.0`, `react-native@0.81.5`, `react@19.1.0`, TypeScript)
- `react-native-view-shot` for native iOS view rendering and PNG generation
- `expo-image-picker` for screenshot selection via native PHPicker
- `expo-media-library` & `expo-sharing` for saving to Photos or Files / AirDrop
- `react-native-web` & `react-dom` for Safari / Chrome browser execution

## Key Architecture Patterns
1. **Mockup Rendering (`MockupCanvas.tsx`):**
   - Pure React Native primitives (`View`, `Image`, `StyleSheet`) shared identically across iOS and Web.
   - Calculates display, bezel, and chassis geometry dynamically using `geometry.ts`.
   - Supports 8 chassis finishes (`chassisColors.ts`) with custom gleams and button colors.
2. **High-Res 9:16 Export Pipeline:**
   - Dedicated offscreen canvas wrapper rendered with explicit width $540$ pt, height $960$ pt, and captured with `@3x` pixel ratio ($1620 \times 2880$ px).
   - Uses `drawViewHierarchyInRect` with a 200ms stabilization delay so asynchronous image compositing completes before capture.
3. **Transparency Support:**
   - When `backgroundColor === 'transparent'`, chassis drop shadows and container backgrounds are removed to ensure true 0-alpha output.

## Essential Commands
- Start dev server (LAN): `npx expo start --lan`
- Type checking: `npx tsc --noEmit`
