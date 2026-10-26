import React from 'react';
import { Play, Pause, Square, RotateCcw, Clock } from 'lucide-react';

interface SessionControlBarProps {
  isListening: boolean;
  isPaused: boolean;
  durationSeconds: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onFinish: () => void;
  onReset: () => void;
}

export const SessionControlBar: React.FC<SessionControlBarProps> = ({
  isListening,
  isPaused,
  durationSeconds,
  onStart,
  onPause,
  onResume,
  onFinish,
  onReset
}) => {
  // Format seconds to mm:ss or hh:mm:ss
  const formatTime = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');
    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  const isSessionStarted = isListening || isPaused;

  return (
    <div className="w-full max-w-xl mx-auto px-4 mt-4 pb-6">
      <div className="bg-[#09201f] border border-[#dfb15b]/25 rounded-2xl p-4 shadow-xl">
        {/* Session Time & Status Indicator */}
        <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-[#dfb15b]/15 text-xs">
          <div className="flex items-center gap-1.5 text-[#dfb15b]">
            <Clock className="w-4 h-4" />
            <span className="text-[#a2beba]">Thời lượng tu tập:</span>
            <strong className="text-[#faeed1] font-mono text-sm tracking-wide">
              {formatTime(durationSeconds)}
            </strong>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isListening
                  ? 'bg-emerald-400 animate-pulse'
                  : isPaused
                  ? 'bg-amber-400'
                  : 'bg-zinc-500'
              }`}
            />
            <span className="text-[11px] text-[#8ea8a5]">
              {isListening ? 'Đang niệm' : isPaused ? 'Tạm dừng' : 'Chưa bắt đầu'}
            </span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3">
          {/* Main Primary Toggle Button (Bắt đầu / Tạm dừng / Tiếp tục) */}
          {!isSessionStarted ? (
            <button
              onClick={onStart}
              className="flex-1 max-w-xs flex items-center justify-center gap-2 bg-gradient-to-r from-[#dfb15b] to-[#b88c3a] hover:from-[#ecc476] hover:to-[#c69a48] text-[#071716] font-bold text-sm sm:text-base py-3 px-6 rounded-xl shadow-lg shadow-[#dfb15b]/20 active:scale-98 transition"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              <span>BẮT ĐẦU NIỆM</span>
            </button>
          ) : isListening ? (
            <button
              onClick={onPause}
              className="flex-1 max-w-xs flex items-center justify-center gap-2 bg-[#dfb15b]/20 hover:bg-[#dfb15b]/30 text-[#faeed1] border border-[#dfb15b]/40 font-semibold text-sm sm:text-base py-3 px-5 rounded-xl active:scale-98 transition shadow"
            >
              <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-[#dfb15b]" />
              <span>Tạm dừng</span>
            </button>
          ) : (
            <button
              onClick={onResume}
              className="flex-1 max-w-xs flex items-center justify-center gap-2 bg-gradient-to-r from-[#dfb15b] to-[#b88c3a] text-[#071716] font-bold text-sm sm:text-base py-3 px-5 rounded-xl shadow-lg shadow-[#dfb15b]/20 active:scale-98 transition"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              <span>Tiếp tục niệm</span>
            </button>
          )}

          {/* Kết thúc & Lưu phiên */}
          {isSessionStarted && (
            <button
              onClick={onFinish}
              className="flex items-center justify-center gap-1.5 bg-[#123634] hover:bg-[#184845] text-[#faeed1] border border-[#dfb15b]/30 font-medium text-xs sm:text-sm py-3 px-4 rounded-xl active:scale-98 transition shadow"
              title="Kết thúc và lưu kết quả vào Lịch sử"
            >
              <Square className="w-4 h-4 text-[#dfb15b]" />
              <span className="hidden sm:inline">Lưu</span> Phiên
            </button>
          )}

          {/* Đặt lại (Reset) */}
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-1.5 bg-[#091a19] hover:bg-red-950/40 text-[#a2beba] hover:text-red-300 border border-[#dfb15b]/15 hover:border-red-500/30 text-xs sm:text-sm py-3 px-3.5 rounded-xl active:scale-98 transition"
            title="Đặt lại số đếm về 0"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden xs:inline">Đặt lại</span>
          </button>
        </div>
      </div>
    </div>
  );
};
