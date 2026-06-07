import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeType = 'electric' | 'trophy' | 'light';

interface ThemeState {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'electric', // Default theme is Electric Midnight
      setTheme: (newTheme: ThemeType) => {
        set({ theme: newTheme });
        
        if (typeof document !== 'undefined') {
          const root = document.documentElement;
          // Clear all theme classes
          root.classList.remove('light', 'dark', 'electric', 'trophy');
          
          if (newTheme === 'light') {
            root.classList.add('light');
          } else {
            root.classList.add('dark', newTheme);
          }
        }
      },
      toggleTheme: () => {
        const current = get().theme;
        let next: ThemeType = 'electric';
        if (current === 'electric') next = 'trophy';
        else if (current === 'trophy') next = 'light';
        else next = 'electric';
        
        get().setTheme(next);
      }
    }),
    {
      name: 'fifa-2026-theme'
    }
  )
);

