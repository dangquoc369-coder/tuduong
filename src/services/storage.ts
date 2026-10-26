import { ChantItem, ChantSession, DailyStat, AppSettings } from '../types';
import { DEFAULT_CHANTS } from '../data/defaultChants';

const STORAGE_KEYS = {
  ACTIVE_SESSION: 'tuduong_active_session_v1',
  HISTORY: 'tuduong_history_v1',
  SETTINGS: 'tuduong_settings_v1',
  CUSTOM_CHANTS: 'tuduong_custom_chants_v1',
  DAILY_STATS: 'tuduong_daily_stats_v1'
};

export const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  soundType: 'woodblock', // 'woodblock' | 'bell' | 'both' | 'silent'
  soundVolume: 0.8,
  vibrationEnabled: true,
  milestoneAlerts: true,
  chantPace: 'normal',
  allowShortPrefix: true,
  wakeLockEnabled: true,
  voiceSensitivity: 'normal'
};

export interface ActiveSessionState {
  chantId: string;
  count: number;
  target: number;
  mode: 'voice' | 'manual';
  startedAt: string;
  durationSeconds: number;
  isPaused: boolean;
}

export class StorageService {
  /**
   * Load app settings
   */
  public static getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch (e) {
      console.warn('Error reading settings from localStorage:', e);
    }
    return DEFAULT_SETTINGS;
  }

  public static saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Error saving settings:', e);
    }
  }

  /**
   * Load all chants (default + custom)
   */
  public static getChants(): ChantItem[] {
    try {
      const customData = localStorage.getItem(STORAGE_KEYS.CUSTOM_CHANTS);
      const customChants: ChantItem[] = customData ? JSON.parse(customData) : [];
      return [...DEFAULT_CHANTS, ...customChants];
    } catch (e) {
      console.warn('Error loading chants:', e);
      return DEFAULT_CHANTS;
    }
  }

  public static saveCustomChant(newChant: ChantItem): ChantItem[] {
    try {
      const customData = localStorage.getItem(STORAGE_KEYS.CUSTOM_CHANTS);
      const customChants: ChantItem[] = customData ? JSON.parse(customData) : [];
      customChants.push(newChant);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_CHANTS, JSON.stringify(customChants));
      return [...DEFAULT_CHANTS, ...customChants];
    } catch (e) {
      console.warn('Error saving custom chant:', e);
      return DEFAULT_CHANTS;
    }
  }

  public static deleteCustomChant(id: string): ChantItem[] {
    try {
      const customData = localStorage.getItem(STORAGE_KEYS.CUSTOM_CHANTS);
      let customChants: ChantItem[] = customData ? JSON.parse(customData) : [];
      customChants = customChants.filter(c => c.id !== id);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_CHANTS, JSON.stringify(customChants));
      return [...DEFAULT_CHANTS, ...customChants];
    } catch (e) {
      console.warn('Error deleting custom chant:', e);
      return DEFAULT_CHANTS;
    }
  }

  /**
   * Active ongoing session persistence (protects against accidental refresh or screen lock)
   */
  public static getActiveSession(): ActiveSessionState | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Error loading active session:', e);
    }
    return null;
  }

  public static saveActiveSession(state: ActiveSessionState | null): void {
    try {
      if (state) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(state));
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
      }
    } catch (e) {
      console.warn('Error saving active session:', e);
    }
  }

  /**
   * Session History
   */
  public static getHistory(): ChantSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Error loading history:', e);
    }
    return [];
  }

  public static saveCompletedSession(session: ChantSession): ChantSession[] {
    try {
      const history = this.getHistory();
      history.unshift(session);
      // Keep up to 200 sessions
      const trimmed = history.slice(0, 200);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(trimmed));

      // Update daily statistics
      this.updateDailyStats(session);

      return trimmed;
    } catch (e) {
      console.warn('Error saving history:', e);
      return [];
    }
  }

  public static clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
      localStorage.removeItem(STORAGE_KEYS.DAILY_STATS);
    } catch (e) {
      console.warn('Error clearing history:', e);
    }
  }

  /**
   * Daily aggregated statistics
   */
  public static getDailyStats(): Record<string, DailyStat> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DAILY_STATS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Error reading daily stats:', e);
    }
    return {};
  }

  private static updateDailyStats(session: ChantSession): void {
    try {
      const stats = this.getDailyStats();
      const dateKey = session.completedAt ? session.completedAt.split('T')[0] : new Date().toISOString().split('T')[0];

      if (!stats[dateKey]) {
        stats[dateKey] = {
          date: dateKey,
          totalCount: 0,
          totalDurationSeconds: 0,
          sessionCount: 0
        };
      }

      stats[dateKey].totalCount += session.count;
      stats[dateKey].totalDurationSeconds += session.durationSeconds;
      stats[dateKey].sessionCount += 1;

      localStorage.setItem(STORAGE_KEYS.DAILY_STATS, JSON.stringify(stats));
    } catch (e) {
      console.warn('Error updating daily stats:', e);
    }
  }

  /**
   * Calculate consecutive chanting streak (in days)
   */
  public static calculateStreak(): number {
    const stats = this.getDailyStats();
    let streak = 0;
    const now = new Date();

    // Check today, yesterday, etc.
    let checkDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // If today hasn't been practiced yet, allow yesterday as start of streak
    const todayStr = checkDate.toISOString().split('T')[0];
    if (!stats[todayStr]) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (stats[dateStr] && stats[dateStr].totalCount > 0) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }
}
