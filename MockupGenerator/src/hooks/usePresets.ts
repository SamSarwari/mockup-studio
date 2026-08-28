import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ChassisColor } from '../types';

export interface Preset {
  id: string;
  user_id: string;
  name: string;
  chassis_color: ChassisColor;
  background_color: string;
  show_dynamic_island: boolean;
  created_at: string;
  updated_at: string;
}

export interface SavePresetInput {
  name: string;
  chassisColor: ChassisColor;
  backgroundColor: string;
  showDynamicIsland: boolean;
}

const PRESETS_KEY = ['presets'] as const;

export function usePresets() {
  const { user } = useAuth();

  return useQuery({
    queryKey: PRESETS_KEY,
    queryFn: async (): Promise<Preset[]> => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('presets')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });
}

export function useSavePreset() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: SavePresetInput) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('presets')
        .insert({
          user_id: user.id,
          name: input.name,
          chassis_color: input.chassisColor,
          background_color: input.backgroundColor,
          show_dynamic_island: input.showDynamicIsland,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRESETS_KEY });
    },
  });
}

export function useDeletePreset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (presetId: string) => {
      const { error } = await supabase
        .from('presets')
        .delete()
        .eq('id', presetId);

      if (error) throw error;
    },
    // Optimistic delete for instant UI feedback
    onMutate: async (presetId) => {
      await queryClient.cancelQueries({ queryKey: PRESETS_KEY });
      const previous = queryClient.getQueryData<Preset[]>(PRESETS_KEY);
      queryClient.setQueryData<Preset[]>(PRESETS_KEY, (old) =>
        (old ?? []).filter((p) => p.id !== presetId)
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(PRESETS_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PRESETS_KEY });
    },
  });
}
