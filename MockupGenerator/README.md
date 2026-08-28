# 📱 Mockup Studio – iPhone 17 Pro Max Mockup Generator

Ein moderner, eleganter und leistungsstarker Mockup-Generator für **iOS (Expo Go)** und **Web (Safari / Chrome)**, entwickelt mit React Native, Expo SDK 54 und TypeScript.

---

## ✨ Features

- **📱 Realistischer iPhone 17 Pro Max Frame:**
  - Präzise Display- und Gehäuse-Kurven ($58$ pt / $66$ pt).
  - Symmetrische $10$ pt Titan-Ränder.
  - Hardware-Buttons (Action Button, Lautstärke, Power, Camera Control) und Antennenbänder.
  - Optionale TrueDepth Dynamic Island mit Kamera-Reflexion.
- **🎨 8 Titan-Gehäusefarben:**
  - Space Black, Natural Titanium, White Titanium, Desert Titanium, Deep Blue, Midnight Green, Rose Gold, Silver.
- **🌸 Sanfte Pastell- & Studio-Farbpalette:**
  - 14 kuratierte Studio- und Pastellfarben (Sanftes Lavendel, Salbei, Puder Rosé, Warmes Pfirsich, etc.) + benutzerdefinierter Hex-Picker.
- **🏁 100% Freigestellter PNG-Export:**
  - Reiner transparenter Alpha-Kanal für nahtlose Weiterverarbeitung in Photoshop, Figma, Canva, Keynote oder Social Media.
- **🔍 Ultra-HD 9:16 Exportqualität:**
  - Fester $540 \times 960$ pt Render-Canvas mit `@3x` Pixeldichte ($1620 \times 2880$ px) für gestochen scharfe Ergebnisse.
- **🌐 Duale Plattform-Unterstützung:**
  - Läuft nativ in der **Expo Go App** auf dem iPhone sowie direkt im **Web-Browser** (Safari/Chrome).

---

## 🛠️ Tech Stack & Bibliotheken

- **Framework:** Expo SDK 54 (~54.0.0) / React Native 0.81.5
- **Sprache:** TypeScript 5.6
- **Capture-Engine:** `react-native-view-shot` (`drawViewHierarchyInRect` mit 3x Multiplikator)
- **Medienverwaltung:** `expo-image-picker`, `expo-media-library`, `expo-sharing`
- **Web-Support:** `react-dom`, `react-native-web`, `@expo/metro-runtime`

---

## 📁 Projektstruktur

```
MockupGenerator/
├── App.tsx                      # Hauptkomponente mit Scroll-Layout, Preview & State
├── index.ts                     # Expo Einstiegspunkt
├── app.json                     # Expo-Konfiguration & Berechtigungen
├── package.json                 # Abhängigkeiten & Scripts
└── src/
    ├── config/
    │   └── devices.ts           # Gerätespezifikationen (iPhone 17 Pro Max)
    ├── types/
    │   └── index.ts             # TypeScript Interfaces (Chassis, Screenshot, Device)
    ├── utils/
    │   ├── colors.ts            # Hintergrund-Farbpresets & Pastell-Palette
    │   ├── chassisColors.ts     # Titan-Oberflächen & Reflexionsfarben
    │   └── geometry.ts          # Skalierungs- & Zuschnittberechnungen
    ├── components/
    │   ├── MockupCanvas.tsx     # Universeller Mockup-Renderer (Device, Buttons, Glass)
    │   ├── ScreenshotPicker.tsx # Bildauswahl mit Native PHPicker
    │   ├── ChassisPicker.tsx    # Farbwahl für iPhone-Gehäuse
    │   ├── BackgroundPicker.tsx # Farbwahl für Hintergrund & Transparenz
    │   └── ExportButton.tsx     # Export-Trigger mit Dialog für Mediathek / Dateien
    └── services/
        ├── exportService.ts     # Native iOS Capture & Speicher-Pipeline
        └── exportService.web.ts # Web Canvas Download & Share-Service
```

---

## 🚀 Schnellstart

### 1. Abhängigkeiten installieren
```bash
npm install
```

### 2. Entwicklungsserver starten
```bash
# Startet Metro für LAN / Expo Go & Web
npx expo start --lan
```

### 3. Auf Geräten testen
- **Web:** Öffne [http://localhost:8081](http://localhost:8081) in Safari oder Chrome.
- **iPhone (Expo Go):** Scanne den im Terminal bzw. Chat angezeigten QR-Code mit der Kamera-App oder öffne `exp://<LOKALE-IP>:8081` in der Expo Go App.

---

## 📋 Lizenz
MIT License
