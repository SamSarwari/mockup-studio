import { computeScreenshotRect, getChassisSize, scaleDeviceToPreview } from '../src/utils/geometry';
import { IPHONE_17_PRO_MAX } from '../src/config/devices';

console.log('--- Testing Geometry & Mockup Calculations ---');

// Test Chassis size
const chassis = getChassisSize(IPHONE_17_PRO_MAX);
console.log(`Chassis Size: ${chassis.width} x ${chassis.height} pt (Display: ${IPHONE_17_PRO_MAX.displayWidth} x ${IPHONE_17_PRO_MAX.displayHeight})`);
console.assert(chassis.width === 468, 'Chassis width should be 440 + 2*14 = 468');
console.assert(chassis.height === 984, 'Chassis height should be 956 + 2*14 = 984');

// Test Preview Scaling for various screen widths/heights
const preview = scaleDeviceToPreview(IPHONE_17_PRO_MAX, 390, 500, 16);
console.log(`Preview scaling on 390x500 viewport: scale=${preview.scale.toFixed(4)}, chassis=${preview.chassisWidth.toFixed(1)}x${preview.chassisHeight.toFixed(1)}, offset=(${preview.offsetX.toFixed(1)}, ${preview.offsetY.toFixed(1)})`);
console.assert(preview.scale > 0 && preview.scale < 1, 'Preview scale should be positive fraction');
console.assert(preview.offsetX >= 0, 'Offset X should be non-negative');
console.assert(preview.offsetY >= 0, 'Offset Y should be non-negative');

// Test 8 Screenshot Scenarios
const testCases = [
  { name: '1. Native iPhone 17 Pro Max (1320x2868)', w: 1320, h: 2868 },
  { name: '2. iPhone 15 Pro (1179x2556)', w: 1179, h: 2556 },
  { name: '3. Older iPhone 16:9 (750x1334)', w: 750, h: 1334 },
  { name: '4. iPad 4:3 (2048x2732)', w: 2048, h: 2732 },
  { name: '5. Landscape (1920x1080)', w: 1920, h: 1080 },
  { name: '6. Square (1080x1080)', w: 1080, h: 1080 },
  { name: '7. Long UI Scroll (1080x4000)', w: 1080, h: 4000 },
  { name: '8. Exact Points (440x956)', w: 440, h: 956 },
];

testCases.forEach((tc) => {
  const rect = computeScreenshotRect(tc.w, tc.h, IPHONE_17_PRO_MAX.displayWidth, IPHONE_17_PRO_MAX.displayHeight);
  console.log(`\nScenario ${tc.name}:`);
  console.log(`  Source Rect: (${rect.srcX.toFixed(1)}, ${rect.srcY.toFixed(1)}) ${rect.srcWidth.toFixed(1)}x${rect.srcHeight.toFixed(1)}`);
  console.log(`  Dest Rect:   (${rect.dstX}, ${rect.dstY}) ${rect.dstWidth}x${rect.dstHeight}`);
  
  console.assert(rect.dstWidth === IPHONE_17_PRO_MAX.displayWidth, 'dstWidth must match display');
  console.assert(rect.dstHeight === IPHONE_17_PRO_MAX.displayHeight, 'dstHeight must match display');
  console.assert(rect.srcWidth <= tc.w, 'srcWidth must not exceed image width');
  console.assert(rect.srcHeight <= tc.h, 'srcHeight must not exceed image height');
  console.assert(rect.srcX >= 0, 'srcX must be >= 0');
  console.assert(rect.srcY >= 0, 'srcY must be >= 0');
});

console.log('\n✅ All geometry tests passed successfully!');
