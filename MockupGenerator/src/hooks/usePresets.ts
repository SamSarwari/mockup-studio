import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ChassisColor } from '../types';

export interface Preset {
  id: string;
  user_id?: string;
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
const LOCAL_STORAGE_KEY = 'MOCKUP_STUDIO_SAVED_PRESETS';

async function getLocalPresets(): Promise<Preset[]> {
  try {
    const raw = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function saveLocalPresets(presets: Preset[]): Promise<void> {
  try {
    await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(presets));
  } catch (err) {
    console.warn('Failed to persist local presets:', err);
  }
}

export function usePresets() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [...PRESETS_KEY, user?.id || 'guest'],
    queryFn: async (): Promise<Preset[]> => {
      const localPresets = await getLocalPresets();

      if (!user) {
        return localPresets;
      }

      try {
        const { data, error } = await supabase
          .from('presets')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (error) {
          // If Supabase table does not exist or network is offline, return local cache
          console.warn('Supabase presets fallback to local:', error.message);
          return localPresets;
        }

        const cloudPresets = data ?? [];
        // Merge cloud with local
        const map = new Map<string, Preset>();
        localPresets.forEach((p) => map.set(p.id, p));
        cloudPresets.forEach((p) => map.set(p.id, p));
        const merged = Array.from(map.values()).sort(
          (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );

        // Update local cache
        saveLocalPresets(merged);
        return merged;
      } catch {
        return localPresets;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useSavePreset() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: SavePresetInput): Promise<Preset> => {
      const newPreset: Preset = {
        id: 'preset_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        user_id: user?.id,
        name: input.name,
        chassis_color: input.chassisColor,
        background_color: input.backgroundColor,
        show_dynamic_island: input.showDynamicIsland,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // 1. Always save to local cache for instant feedback
      const current = await getLocalPresets();
      const updated = [newPreset, ...current.filter((p) => p.name !== input.name)];
      await saveLocalPresets(updated);

      // 2. If user is logged in, sync to Supabase in background
      if (user) {
        try {
          const { data, error } = await supabase
            .from('presets')
            .insert({
              id: newPreset.id,
              user_id: user.id,
              name: input.name,
              chassis_color: input.chassisColor,
              background_color: input.backgroundColor,
              show_dynamic_island: input.showDynamicIsland,
            })
            .select()
            .single();

          if (!error && data) {
            return data;
          }
        } catch (err) {
          console.warn('Could not sync preset to Supabase cloud table:', err);
        }
      }

      return newPreset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRESETS_KEY });
    },
  });
}

export function useDeletePreset() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (presetId: string) => {
      // 1. Remove from local cache
      const current = await getLocalPresets();
      const filtered = current.filter((p) => p.id !== presetId);
      await saveLocalPresets(filtered);

      // 2. If user is logged in, delete from Supabase
      if (user) {
        try {
          await supabase.from('presets').delete().eq('id', presetId);
        } catch (err) {
          console.warn('Could not delete from Supabase:', err);
        }
      }
    },
    // Optimistic delete
    onMutate: async (presetId) => {
      await queryClient.cancelQueries({ queryKey: PRESETS_KEY });
      const queryKey = [...PRESETS_KEY, user?.id || 'guest'];
      const previous = queryClient.getQueryData<Preset[]>(queryKey);
      queryClient.setQueryData<Preset[]>(queryKey, (old) =>
        (old ?? []).filter((p) => p.id !== presetId)
      );
      return { previous, queryKey };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PRESETS_KEY });
    },
  });
}
