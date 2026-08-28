import { DeviceConfig, ScreenshotInfo } from '../types';
import { computeScreenshotRect } from '../utils/geometry';

const EXPORT_PADDING = 200;

export interface ExportOptions {
  screenshot: ScreenshotInfo;
  device: DeviceConfig;
  backgroundColor: string;
  showDynamicIsland: boolean;
  viewRef?: any;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

export async function exportMockupAsPng(options: ExportOptions): Promise<string> {
  const { screenshot, device, backgroundColor, showDynamicIsland } = options;

  const physicalDisplayW = device.displayWidth * device.scaleFactor;
  const physicalDisplayH = device.displayHeight * device.scaleFactor;
  const physicalBezel = device.bezelWidth * device.scaleFactor;
  const physicalChassisW = physicalDisplayW + physicalBezel * 2;
  const physicalChassisH = physicalDisplayH + physicalBezel * 2;
  const physicalCornerR = device.cornerRadius * device.scaleFactor;
  const physicalChassisCornerR = device.chassisCornerRadius * device.scaleFactor;

  const totalW = physicalChassisW + EXPORT_PADDING * 2;
  const totalH = physicalChassisH + EXPORT_PADDING * 2;

  const chassisX = EXPORT_PADDING;
  const chassisY = EXPORT_PADDING;
  const displayX = chassisX + physicalBezel;
  const displayY = chassisY + physicalBezel;

  const canvas = document.createElement('canvas');
  canvas.width = totalW;
  canvas.height = totalH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create HTML canvas context');

  // 1. Background (if not transparent)
  if (backgroundColor !== 'transparent') {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, totalW, totalH);
  } else {
    ctx.clearRect(0, 0, totalW, totalH);
  }

  // 2. Drop shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 40 * device.scaleFactor;
  ctx.shadowOffsetY = 20;
  ctx.fillStyle = '#1A1A1A';
  drawRoundedRect(ctx, chassisX, chassisY, physicalChassisW, physicalChassisH, physicalChassisCornerR);
  ctx.fill();
  ctx.restore();

  // 3. Chassis body
  ctx.fillStyle = '#1A1A1A';
  drawRoundedRect(ctx, chassisX, chassisY, physicalChassisW, physicalChassisH, physicalChassisCornerR);
  ctx.fill();

  // 4. Screenshot
  await new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.save();
      drawRoundedRect(ctx, displayX, displayY, physicalDisplayW, physicalDisplayH, physicalCornerR);
      ctx.clip();

      const rect = computeScreenshotRect(img.naturalWidth, img.naturalHeight, physicalDisplayW, physicalDisplayH);
      ctx.drawImage(
        img,
        rect.srcX,
        rect.srcY,
        rect.srcWidth,
        rect.srcHeight,
        displayX,
        displayY,
        physicalDisplayW,
        physicalDisplayH
      );
      ctx.restore();
      resolve();
    };
    img.onerror = () => {
      // Draw dark placeholder if image fails
      ctx.fillStyle = '#0A0A0A';
      drawRoundedRect(ctx, displayX, displayY, physicalDisplayW, physicalDisplayH, physicalCornerR);
      ctx.fill();
      resolve();
    };
    img.src = screenshot.uri;
  });

  // 5. Dynamic Island
  if (showDynamicIsland) {
    const diPhysicalW = device.dynamicIsland.width * device.scaleFactor;
    const diPhysicalH = device.dynamicIsland.height * device.scaleFactor;
    const diPhysicalTop = device.dynamicIsland.topOffset * device.scaleFactor;
    const diPhysicalR = device.dynamicIsland.cornerRadius * device.scaleFactor;

    const diX = displayX + (physicalDisplayW - diPhysicalW) / 2;
    const diY = displayY + diPhysicalTop;

    ctx.fillStyle = '#000000';
    drawRoundedRect(ctx, diX, diY, diPhysicalW, diPhysicalH, diPhysicalR);
    ctx.fill();
  }

  // 6. Bezel Border Highlight
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = device.scaleFactor;
  drawRoundedRect(ctx, chassisX, chassisY, physicalChassisW, physicalChassisH, physicalChassisCornerR);
  ctx.stroke();

  // 7. Data URL & Download
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  
  // Trigger direct browser download
  const link = document.createElement('a');
  link.download = `iPhone_Mockup_${Date.now()}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return dataUrl;
}

export async function saveToGallery(uri: string): Promise<boolean> {
  return true;
}

export async function shareImage(uri: string): Promise<void> {
  if (navigator.share) {
    try {
      const blob = await (await fetch(uri)).blob();
      const file = new File([blob], 'mockup.png', { type: 'image/png' });
      await navigator.share({
        files: [file],
        title: 'iPhone Mockup',
      });
    } catch {
      // Ignored
    }
  }
}
