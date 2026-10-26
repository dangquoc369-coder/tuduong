/**
 * Type definitions for Tu Dưỡng Buddhist Chanting Counter
 */

export interface ChantItem {
  id: string;
  title: string;          // e.g. "Nam mô A Di Đà Phật"
  shortTitle: string;     // e.g. "A Di Đà Phật"
  category: 'phat' | 'bo-tat' | 'chu' | 'custom';
  description?: string;
  defaultTarget: number;  // typically 108
  keywords: string[];     // keywords for fuzzy speech recognition
  isCustom?: boolean;
}

export type CountingMode = 'voice' | 'manual';

export interface ChantSession {
  id: string;
  chantId: string;
  chantTitle: string;
  count: number;
  target: number;
  mode: CountingMode;
  durationSeconds: number;
  startedAt: string;      // ISO string
  completedAt?: string;   // ISO string
  reachedTarget: boolean;
  notes?: string;
}

export interface DailyStat {
  date: string;           // YYYY-MM-DD
  totalCount: number;
  totalDurationSeconds: number;
  sessionCount: number;
}

export interface AppSettings {
  soundEnabled: boolean;
  soundType: 'woodblock' | 'bell' | 'both' | 'silent';
  soundVolume: number;     // 0 to 1
  vibrationEnabled: boolean;
  milestoneAlerts: boolean; // 108, 500, 1000
  chantPace: 'fast' | 'normal' | 'slow'; // Fast: 650ms, Normal: 950ms, Slow: 1500ms
  allowShortPrefix: boolean; // Match "A Di Đà Phật" without needing "Nam mô"
  wakeLockEnabled: boolean;
  voiceSensitivity: 'high' | 'normal' | 'low';
}

export interface SpeechDiagnosticInfo {
  isSupported: boolean;
  isIOS: boolean;
  isSafari: boolean;
  isChrome: boolean;
  isStandalone: boolean;
  hasGetUserMedia: boolean;
}
