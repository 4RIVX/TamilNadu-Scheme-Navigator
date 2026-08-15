import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Platform } from 'react-native';

function makeStorage() {
  if (Platform.OS === 'web') {
    return createJSONStorage(() => window.localStorage);
  }
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  return createJSONStorage(() => AsyncStorage);
}

interface SavedState {
  savedIds: string[];
  toggleSaved: (id: string) => void;
}

export const useSaved = create<SavedState>()(
  persist(
    (set) => ({
      savedIds: [],
      toggleSaved: (id) =>
        set((state) => ({
          savedIds: state.savedIds.includes(id)
            ? state.savedIds.filter((s) => s !== id)
            : [...state.savedIds, id],
        })),
    }),
    { name: 'tn-saved-schemes', storage: makeStorage() }
  )
);