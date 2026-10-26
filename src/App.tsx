import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChantItem, ChantSession, DailyStat, AppSettings, CountingMode } from './types';
import { StorageService, ActiveSessionState, DEFAULT_SETTINGS } from './services/storage';
import { ChantingEngine, EngineStatus } from './services/chantiEngine';
import { sound } from './services/soundFx';
import { wakeLock } from './services/wakeLock';

import { Header } from './components/Header';
import { ChantSelector } from './components/ChantSelector';
import { LotusCounter } from './components/LotusCounter';
import { TargetProgressBar } from './components/TargetProgressBar';
import { AudioStatusBanner } from './components/AudioStatusBanner';
import { SessionControlBar } from './components/SessionControlBar';

import { ManualEditModal } from './components/modals/ManualEditModal';
import { AddChantModal } from './components/modals/AddChantModal';
import { ResetConfirmModal } from './components/modals/ResetConfirmModal';
import { MilestoneModal } from './components/modals/MilestoneModal';
import { HistoryModal } from './components/modals/HistoryModal';
import { AudioLabModal } from './components/modals/AudioLabModal';
import { IOSGuideModal } from './components/modals/IOSGuideModal';
import { SettingsModal } from './components/modals/SettingsModal';

export default function App() {
  // 1. Data Collections & Settings
  const [chants, setChants] = useState<ChantItem[]>(() => StorageService.getChants());
  const [settings, setSettings] = useState<AppSettings>(() => StorageService.getSettings());
  const [history, setHistory] = useState<ChantSession[]>(() => StorageService.getHistory());
  const [dailyStats, setDailyStats] = useState<Record<string, DailyStat>>(() => StorageService.getDailyStats());
  const [streak, setStreak] = useState<number>(() => StorageService.calculateStreak());

  // 2. Active Session State
  const initialActive = StorageService.getActiveSession();
  const defaultChant = chants[0];
  const initialChant = initialActive ? (chants.find(c => c.id === initialActive.chantId) || defaultChant) : defaultChant;

  const [selectedChant, setSelectedChant] = useState<ChantItem>(initialChant);
  const [count, setCount] = useState<number>(initialActive ? initialActive.count : 0);
  const [target, setTarget] = useState<number>(initialActive ? initialActive.target : initialChant.defaultTarget);
  const [mode, setMode] = useState<CountingMode>(initialActive ? initialActive.mode : 'voice');
  const [durationSeconds, setDurationSeconds] = useState<number>(initialActive ? initialActive.durationSeconds : 0);
  const [isPaused, setIsPaused] = useState<boolean>(initialActive ? initialActive.isPaused : false);

  // 3. Engine & Audio Real-Time State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [engineStatus, setEngineStatus] = useState<EngineStatus>('idle');
  const [engineStatusMsg, setEngineStatusMsg] = useState<string>('Sẵn sàng bắt đầu');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [lastChantDetected, setLastChantDetected] = useState<string | null>(null);

  // 4. Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAudioLabModal, setShowAudioLabModal] = useState(false);
  const [showIOSGuideModal, setShowIOSGuideModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Refs for session management
  const engineRef = useRef<ChantingEngine | null>(null);
  const sessionStartTimeRef = useRef<string>(initialActive ? initialActive.startedAt : new Date().toISOString());
  const timerIntervalRef = useRef<any>(null);
  const lastMilestoneReportedRef = useRef<number>(0);

  // Sync settings with audio/storage
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
    if (engineRef.current) {
      engineRef.current.updateSettings(newSettings);
    }
    if (newSettings.wakeLockEnabled && (isListening || (mode === 'manual' && count > 0))) {
      wakeLock.acquire().catch(() => {});
    } else if (!newSettings.wakeLockEnabled) {
      wakeLock.release().catch(() => {});
    }
  };

  // Sound toggle shortcut in header
  const handleToggleSound = () => {
    const newSoundEnabled = !settings.soundEnabled;
    handleUpdateSettings({ ...settings, soundEnabled: newSoundEnabled });
  };

  // Mode change (Voice vs Manual)
  const handleModeChange = (newMode: CountingMode) => {
    setMode(newMode);
    if (newMode === 'manual' && isListening) {
      if (engineRef.current) engineRef.current.pause();
      setIsListening(false);
      setIsPaused(true);
    }
  };

  // Timer loop for active session
  useEffect(() => {
    const isRunning = isListening || (mode === 'manual' && !isPaused && count > 0);
    if (isRunning) {
      timerIntervalRef.current = setInterval(() => {
        setDurationSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isListening, isPaused, mode, count]);

  // Screen Wake Lock
  useEffect(() => {
    if (settings.wakeLockEnabled && (isListening || (mode === 'manual' && count > 0))) {
      wakeLock.acquire().catch(() => {});
    } else {
      wakeLock.release().catch(() => {});
    }
    return () => {
      wakeLock.release().catch(() => {});
    };
  }, [isListening, count, mode, settings.wakeLockEnabled]);

  // Persist active session state
  useEffect(() => {
    if (count > 0 || durationSeconds > 0) {
      const activeState: ActiveSessionState = {
        chantId: selectedChant.id,
        count,
        target,
        mode,
        startedAt: sessionStartTimeRef.current,
        durationSeconds,
        isPaused
      };
      StorageService.saveActiveSession(activeState);
    }
  }, [count, target, selectedChant, mode, durationSeconds, isPaused]);

  // Milestone check
  useEffect(() => {
    if (target > 0 && count >= target && lastMilestoneReportedRef.current !== target && count > 0) {
      lastMilestoneReportedRef.current = target;
      setShowMilestoneModal(true);
      sound.playMilestoneChime(settings.soundVolume);
      sound.triggerHaptic('milestone');
    }
  }, [count, target, settings.soundVolume]);

  // Engine callbacks
  const handleChantCount = useCallback((newCount: number, matchedPhrase: string) => {
    setCount(newCount);
    setLastChantDetected(matchedPhrase);
    setTimeout(() => {
      setLastChantDetected(null);
    }, 1800);
  }, []);

  const handleStatusChange = useCallback((status: EngineStatus, msg: string) => {
    setEngineStatus(status);
    setEngineStatusMsg(msg);
  }, []);

  const handleAudioLevel = useCallback((level: number) => {
    setAudioLevel(level);
  }, []);

  const handleTranscript = useCallback((interim: string) => {
    setInterimTranscript(interim);
  }, []);

  const handleEngineError = useCallback((errMsg: string) => {
    setEngineStatus('unsupported');
    setEngineStatusMsg(errMsg);
  }, []);

  // Initialize chanting engine on mount or chant switch
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.updateChant(selectedChant);
      engineRef.current.updateCount(count);
      engineRef.current.updateSettings(settings);
    } else {
      engineRef.current = new ChantingEngine(
        selectedChant,
        count,
        settings,
        {
          onCount: handleChantCount,
          onStatusChange: handleStatusChange,
          onAudioLevel: handleAudioLevel,
          onTranscript: handleTranscript,
          onError: handleEngineError
        }
      );
    }
  }, [selectedChant, settings, handleChantCount, handleStatusChange, handleAudioLevel, handleTranscript, handleEngineError]);

  // Keep engine's internal count updated when user edits count manually
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.updateCount(count);
    }
  }, [count]);

  // Start chanting session
  const handleStartSession = async () => {
    setIsPaused(false);
    if (!sessionStartTimeRef.current || count === 0) {
      sessionStartTimeRef.current = new Date().toISOString();
    }

    if (mode === 'voice') {
      if (!engineRef.current) {
        engineRef.current = new ChantingEngine(
          selectedChant,
          count,
          settings,
          {
            onCount: handleChantCount,
            onStatusChange: handleStatusChange,
            onAudioLevel: handleAudioLevel,
            onTranscript: handleTranscript,
            onError: handleEngineError
          }
        );
      }
      const success = await engineRef.current.start();
      if (success) {
        setIsListening(true);
      }
    } else {
      // Manual mode started
      setIsListening(false);
    }
  };

  // Pause session
  const handlePauseSession = () => {
    if (mode === 'voice' && engineRef.current) {
      engineRef.current.pause();
      setIsListening(false);
    }
    setIsPaused(true);
  };

  // Resume session
  const handleResumeSession = async () => {
    handleStartSession();
  };

  // Manual tap count (Chạm đếm)
  const handleManualCount = () => {
    const next = count + 1;
    setCount(next);

    // Audio & Haptic feedback
    if (settings.soundEnabled) {
      if (settings.soundType === 'woodblock' || settings.soundType === 'both') {
        sound.playWoodblock(settings.soundVolume);
      }
      if (settings.soundType === 'bell' || settings.soundType === 'both') {
        sound.playTempleBell(settings.soundVolume);
      }
    }
    if (settings.vibrationEnabled) {
      sound.triggerHaptic('tap');
    }

    // Milestone sound
    if (settings.milestoneAlerts && (next % 108 === 0 || next === 500 || next === 1000)) {
      sound.playMilestoneChime(settings.soundVolume);
      sound.triggerHaptic('milestone');
    }
  };

  // Fine-tuning adjustment (+1, -1)
  const handleManualIncrement = (delta: number) => {
    const next = Math.max(0, count + delta);
    setCount(next);
    if (delta > 0 && settings.vibrationEnabled) {
      sound.triggerHaptic('tap');
    }
  };

  // Finish & Archive session into History
  const handleFinishSession = () => {
    if (count === 0 && durationSeconds === 0) return;

    if (engineRef.current) {
      engineRef.current.stop();
      setIsListening(false);
    }
    setIsPaused(false);

    const completedSession: ChantSession = {
      id: 'session-' + Date.now(),
      chantId: selectedChant.id,
      chantTitle: selectedChant.title,
      count,
      target,
      mode,
      durationSeconds,
      startedAt: sessionStartTimeRef.current,
      completedAt: new Date().toISOString(),
      reachedTarget: target > 0 && count >= target
    };

    const updatedHistory = StorageService.saveCompletedSession(completedSession);
    setHistory(updatedHistory);
    setDailyStats(StorageService.getDailyStats());
    setStreak(StorageService.calculateStreak());

    // Reset current active session
    StorageService.saveActiveSession(null);
    setCount(0);
    setDurationSeconds(0);
    sessionStartTimeRef.current = new Date().toISOString();
    lastMilestoneReportedRef.current = 0;

    setShowHistoryModal(true);
  };

  // Reset confirmation
  const handleResetRequest = () => {
    if (count > 0) {
      setShowResetModal(true);
    } else {
      setDurationSeconds(0);
      setIsPaused(false);
    }
  };

  const handleConfirmReset = (shouldSave: boolean) => {
    if (shouldSave && count > 0) {
      handleFinishSession();
    } else {
      if (engineRef.current) {
        engineRef.current.stop();
        setIsListening(false);
      }
      setIsPaused(false);
      StorageService.saveActiveSession(null);
      setCount(0);
      setDurationSeconds(0);
      sessionStartTimeRef.current = new Date().toISOString();
      lastMilestoneReportedRef.current = 0;
    }
    setShowResetModal(false);
  };

  // Add custom chant
  const handleAddCustomChant = (newChant: ChantItem) => {
    const updated = StorageService.saveCustomChant(newChant);
    setChants(updated);
    setSelectedChant(newChant);
    setTarget(newChant.defaultTarget);
  };

  // Delete custom chant
  const handleDeleteCustomChant = (id: string) => {
    const updated = StorageService.deleteCustomChant(id);
    setChants(updated);
    if (selectedChant.id === id) {
      setSelectedChant(updated[0]);
    }
  };

  // Clear history
  const handleClearHistory = () => {
    StorageService.clearHistory();
    setHistory([]);
    setDailyStats({});
    setStreak(0);
  };

  // Keyboard shortcut: Spacebar to count in manual mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && mode === 'manual' && !showEditModal && !showAddModal) {
        e.preventDefault();
        handleManualCount();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, count, showEditModal, showAddModal]);

  return (
    <div className="min-h-screen bg-[#071716] text-[#f7f5ed] flex flex-col justify-between selection:bg-[#dfb15b]/30">
      {/* Top Ambient Lotus Aura Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-radial from-[#dfb15b]/10 via-[#0e3532]/20 to-transparent rounded-full blur-3xl opacity-70" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        {/* Navigation Header */}
        <Header
          mode={mode}
          onModeChange={handleModeChange}
          streak={streak}
          soundEnabled={settings.soundEnabled}
          onToggleSound={handleToggleSound}
          onOpenHistory={() => setShowHistoryModal(true)}
          onOpenSettings={() => setShowSettingsModal(true)}
          onOpenAudioLab={() => setShowAudioLabModal(true)}
          onOpenIOSGuide={() => setShowIOSGuideModal(true)}
        />

        {/* Main Chanting Workspace */}
        <main className="flex-1 flex flex-col items-center justify-between max-w-4xl w-full mx-auto pb-4">
          {/* Chant Title Selector */}
          <ChantSelector
            chants={chants}
            selectedChant={selectedChant}
            onSelectChant={(c) => {
              setSelectedChant(c);
              setTarget(c.defaultTarget);
            }}
            onOpenAddModal={() => setShowAddModal(true)}
            onDeleteCustomChant={handleDeleteCustomChant}
            isSessionActive={isListening || count > 0}
          />

          {/* Core Lotus Counter Centerpiece */}
          <LotusCounter
            count={count}
            target={target}
            mode={mode}
            audioLevel={audioLevel}
            isListening={isListening}
            onManualCount={handleManualCount}
            onIncrementManual={handleManualIncrement}
            onOpenEditModal={() => setShowEditModal(true)}
            lastChantDetected={lastChantDetected}
          />

          {/* Target Progress Bar */}
          <TargetProgressBar
            count={count}
            target={target}
            onSetTarget={(newTarget) => setTarget(newTarget)}
          />

          {/* Real-time Voice / Status Banner */}
          <AudioStatusBanner
            mode={mode}
            status={engineStatus}
            statusMessage={engineStatusMsg}
            interimTranscript={interimTranscript}
            audioLevel={audioLevel}
            onRequestMicPermission={handleStartSession}
          />

          {/* Bottom Session Controls */}
          <SessionControlBar
            isListening={isListening}
            isPaused={isPaused}
            durationSeconds={durationSeconds}
            onStart={handleStartSession}
            onPause={handlePauseSession}
            onResume={handleResumeSession}
            onFinish={handleFinishSession}
            onReset={handleResetRequest}
          />
        </main>
      </div>

      {/* MODALS */}
      {showEditModal && (
        <ManualEditModal
          currentCount={count}
          onSave={(newCount) => setCount(newCount)}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {showAddModal && (
        <AddChantModal
          onAddChant={handleAddCustomChant}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {showResetModal && (
        <ResetConfirmModal
          currentCount={count}
          onConfirmReset={handleConfirmReset}
          onClose={() => setShowResetModal(false)}
        />
      )}

      {showMilestoneModal && (
        <MilestoneModal
          count={count}
          target={target}
          chantTitle={selectedChant.title}
          onContinue={() => setShowMilestoneModal(false)}
          onFinish={() => {
            setShowMilestoneModal(false);
            handleFinishSession();
          }}
        />
      )}

      {showHistoryModal && (
        <HistoryModal
          history={history}
          dailyStats={dailyStats}
          streak={streak}
          onClearHistory={handleClearHistory}
          onClose={() => setShowHistoryModal(false)}
        />
      )}

      {showAudioLabModal && (
        <AudioLabModal
          currentChant={selectedChant}
          onClose={() => setShowAudioLabModal(false)}
        />
      )}

      {showIOSGuideModal && (
        <IOSGuideModal
          onClose={() => setShowIOSGuideModal(false)}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
}
