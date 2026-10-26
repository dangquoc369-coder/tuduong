import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, History, Settings, HelpCircle, Activity, Sparkles, Mic, Hand, Download } from 'lucide-react';
import { CountingMode } from '../types';

interface HeaderProps {
  mode: CountingMode;
  onModeChange: (mode: CountingMode) => void;
  streak: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onOpenAudioLab: () => void;
  onOpenIOSGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onModeChange,
  streak,
  soundEnabled,
  onToggleSound,
  onOpenHistory,
  onOpenSettings,
  onOpenAudioLab,
  onOpenIOSGuide
}) => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      onOpenIOSGuide();
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#071716]/90 backdrop-blur-md border-b border-[#dfb15b]/15 px-3 sm:px-6 py-3 transition-all">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Logo & App Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#dfb15b]/25 to-[#0e3532] border border-[#dfb15b]/40 flex items-center justify-center shadow-lg shadow-[#dfb15b]/10">
            <svg className="w-5 h-5 text-[#dfb15b]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C12 2 8 8 8 13C8 15.21 9.79 17 12 17C14.21 17 16 15.21 16 13C16 8 12 2 12 2ZM12 15C10.9 15 10 14.1 10 13C10 10.3 12 5.5 12 5.5C12 5.5 14 10.3 14 13C14 14.1 13.1 15 12 15ZM6.5 12.5C5.1 13.5 4 15.1 4 17C4 19.8 6.2 22 9 22C10.9 22 12.5 20.9 13.5 19.5C11.5 19.3 9.7 18.1 8.8 16.3C8.1 15 8.1 13.6 8.5 12.5H6.5ZM17.5 12.5C17.9 13.6 17.9 15 17.2 16.3C16.3 18.1 14.5 19.3 12.5 19.5C13.5 20.9 15.1 22 17 22C19.8 22 22 19.8 22 17C22 15.1 20.9 13.5 19.5 12.5H17.5Z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-serif-sacred text-lg sm:text-xl font-bold tracking-wider text-[#faeed1]">
                TU DƯỠNG
              </h1>
              {streak > 0 && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#dfb15b]/15 text-[#dfb15b] border border-[#dfb15b]/30">
                  <Sparkles className="w-3 h-3 text-[#dfb15b]" />
                  {streak} ngày
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#9fb8b5] leading-none hidden xs:block">
              Niệm Phật Tự Động Bằng Giọng Nói AI
            </p>
          </div>
        </div>

        {/* Center Mode Switcher */}
        <div className="flex items-center bg-[#0b2423] p-1 rounded-full border border-[#dfb15b]/20">
          <button
            onClick={() => onModeChange('voice')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              mode === 'voice'
                ? 'bg-gradient-to-r from-[#dfb15b] to-[#b3883b] text-[#071716] font-semibold shadow-md shadow-[#dfb15b]/20'
                : 'text-[#a2beba] hover:text-[#faeed1]'
            }`}
            title="Tự động nhận diện câu niệm bằng Micro"
          >
            <Mic className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Micro</span> AI
          </button>
          <button
            onClick={() => onModeChange('manual')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              mode === 'manual'
                ? 'bg-gradient-to-r from-[#dfb15b] to-[#b3883b] text-[#071716] font-semibold shadow-md shadow-[#dfb15b]/20'
                : 'text-[#a2beba] hover:text-[#faeed1]'
            }`}
            title="Chạm màn hình để đếm chuỗi hoặc gõ mõ thủ công"
          >
            <Hand className="w-3.5 h-3.5" />
            <span>Chạm</span>
          </button>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-xl transition-all ${
              soundEnabled
                ? 'text-[#dfb15b] bg-[#dfb15b]/10 hover:bg-[#dfb15b]/20'
                : 'text-[#688582] hover:text-[#a2beba]'
            }`}
            title={soundEnabled ? 'Âm thanh: Bật' : 'Âm thanh: Tắt'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* Audio Lab / Diagnostics */}
          <button
            onClick={onOpenAudioLab}
            className="p-2 rounded-xl text-[#a2beba] hover:text-[#dfb15b] hover:bg-[#dfb15b]/10 transition-all"
            title="Kiểm tra âm thanh & Micro"
          >
            <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* History */}
          <button
            onClick={onOpenHistory}
            className="p-2 rounded-xl text-[#a2beba] hover:text-[#dfb15b] hover:bg-[#dfb15b]/10 transition-all"
            title="Lịch sử tu tập & Thống kê"
          >
            <History className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-[#a2beba] hover:text-[#dfb15b] hover:bg-[#dfb15b]/10 transition-all"
            title="Cài đặt ứng dụng"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Help / iOS Guide */}
          <button
            onClick={onOpenIOSGuide}
            className="p-2 rounded-xl text-[#a2beba] hover:text-[#dfb15b] hover:bg-[#dfb15b]/10 transition-all hidden xs:block"
            title="Hướng dẫn sử dụng & Cài đặt iPhone"
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Install PWA Button if available */}
          {isInstallable && (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1 text-xs bg-[#dfb15b]/20 hover:bg-[#dfb15b]/30 text-[#dfb15b] px-2.5 py-1.5 rounded-lg border border-[#dfb15b]/40 font-medium transition-all"
              title="Cài đặt Tu Dưỡng vào màn hình chính"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cài App</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
