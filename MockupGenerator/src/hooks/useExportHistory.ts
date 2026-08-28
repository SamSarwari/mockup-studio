import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { LogExportInputSchema, ExportRecordListSchema } from '../utils/validation';

export interface ExportRecord {
  id: string;
  user_id: string;
  chassis_color_name?: string | null;
  background_color?: string | null;
  show_dynamic_island?: boolean | null;
  exported_at: string;
}

export interface LogExportInput {
  chassisColorName: string;
  backgroundColor: string;
  showDynamicIsland: boolean;
}

const EXPORT_HISTORY_KEY = ['export_history'] as const;

export function useExportHistory() {
  const { user } = useAuth();

  return useQuery({
    queryKey: EXPORT_HISTORY_KEY,
    queryFn: async (): Promise<ExportRecord[]> => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('export_history')
        .select('*')
        .eq('user_id', user.id)
        .order('exported_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      const parsed = ExportRecordListSchema.safeParse(data);
      if (!parsed.success) {
        console.warn('Export history schema validation warning:', parsed.error);
        return (data as ExportRecord[]) ?? [];
      }
      return parsed.data;
    },
    enabled: !!user,
  });
}

export function useLogExport() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rawInput: LogExportInput) => {
      if (!user) throw new Error('Not authenticated');
      
      // Validate input before sending to Supabase
      const validated = LogExportInputSchema.parse(rawInput);

      const { error } = await supabase
        .from('export_history')
        .insert({
          user_id: user.id,
          chassis_color_name: validated.chassisColorName,
          background_color: validated.backgroundColor,
          show_dynamic_island: validated.showDynamicIsland,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPORT_HISTORY_KEY });
    },
  });
}
