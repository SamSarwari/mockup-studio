import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface ExportRecord {
  id: string;
  user_id: string;
  chassis_color_name: string;
  background_color: string;
  show_dynamic_island: boolean;
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
      return data ?? [];
    },
    enabled: !!user,
  });
}

export function useLogExport() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: LogExportInput) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('export_history')
        .insert({
          user_id: user.id,
          chassis_color_name: input.chassisColorName,
          background_color: input.backgroundColor,
          show_dynamic_island: input.showDynamicIsland,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPORT_HISTORY_KEY });
    },
  });
}
