import { z } from 'zod';

export const HexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

export const ColorSchema = z.string().refine(
  (val) => val === 'transparent' || HexColorRegex.test(val),
  { message: 'Ungültiger Farbwert (muss Hex-Code oder "transparent" sein).' }
);

export const AuthCredentialsSchema = z.object({
  email: z.string().trim().email('Bitte eine gültige E-Mail-Adresse eingeben.').max(255),
  password: z.string().min(6, 'Das Passwort muss mindestens 6 Zeichen lang sein.').max(128),
  displayName: z.string().trim().max(80, 'Der Name darf maximal 80 Zeichen lang sein.').optional(),
});

export const PasswordResetSchema = z.object({
  email: z.string().trim().email('Bitte eine gültige E-Mail-Adresse eingeben.').max(255),
});

export const LogExportInputSchema = z.object({
  chassisColorName: z.string().trim().min(1).max(64),
  backgroundColor: ColorSchema,
  showDynamicIsland: z.boolean(),
});

export const ExportRecordSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  chassis_color_name: z.string().nullable().optional(),
  background_color: z.string().nullable().optional(),
  show_dynamic_island: z.boolean().nullable().optional(),
  exported_at: z.string(),
});

export const ExportRecordListSchema = z.array(ExportRecordSchema);
