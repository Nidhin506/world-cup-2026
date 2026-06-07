import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoriteState {
  favorites: string[]; // Array of team ids (e.g., ['usa', 'arg'])
  toggleFavorite: (teamId: string) => void;
  isFavorite: (teamId: string) => boolean;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (teamId: string) => {
        const current = get().favorites;
        const exists = current.includes(teamId);
        const updated = exists
          ? current.filter((id) => id !== teamId)
          : [...current, teamId];
        set({ favorites: updated });
      },
      isFavorite: (teamId: string) => {
        return get().favorites.includes(teamId);
      }
    }),
    {
      name: 'fifa-2026-favorites' // LocalStorage key
    }
  )
);
