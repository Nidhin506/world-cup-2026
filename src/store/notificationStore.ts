import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface NotificationSettings {
  kickoff24h: boolean;
  kickoff1h: boolean;
  kickoff15m: boolean;
  goals: boolean;
  cards: boolean;
  halftimeFulltime: boolean;
}

interface NotificationState {
  permission: NotificationPermission;
  settings: NotificationSettings;
  requestPermission: () => Promise<NotificationPermission>;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  sendNotification: (title: string, body: string, icon?: string) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      permission: typeof window !== 'undefined' ? Notification.permission : 'default',
      settings: {
        kickoff24h: true,
        kickoff1h: true,
        kickoff15m: true,
        goals: true,
        cards: false,
        halftimeFulltime: true
      },
      requestPermission: async () => {
        if (typeof window === 'undefined' || !('Notification' in window)) {
          return 'denied';
        }
        const permission = await Notification.requestPermission();
        set({ permission });
        return permission;
      },
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }));
      },
      sendNotification: (title, body, icon = '/logo.png') => {
        const { permission } = get();
        if (typeof window !== 'undefined' && 'Notification' in window && permission === 'granted') {
          try {
            new Notification(title, {
              body,
              icon,
              tag: 'fifa-world-cup-2026'
            });
          } catch (error) {
            console.error('Failed to trigger notification:', error);
          }
        }
      }
    }),
    {
      name: 'fifa-2026-notifications',
      // Skip persisting window-only runtime properties like permission directly
      partialize: (state) => ({ settings: state.settings })
    }
  )
);
