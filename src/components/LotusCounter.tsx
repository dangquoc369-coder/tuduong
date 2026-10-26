import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Edit3, Mic, Sparkles, Hand } from 'lucide-react';
import { CountingMode } from '../types';

interface LotusCounterProps {
  count: number;
  target: number;
  mode: CountingMode;
  audioLevel: number;
  isListening: boolean;
  onManualCount: () => void;
  onIncrementManual: (delta: number) => void;
  onOpenEditModal: () => void;
  lastChantDetected: string | null;
}

export const LotusCounter: React.FC<LotusCounterProps> = ({
  count,
  target,
  mode,
  audioLevel,
  isListening,
  onManualCount,
  onIncrementManual,
  onOpenEditModal,
  lastChantDetected
}) => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  // Percentage toward current target
  const percentage = target > 0 ? Math.min(100, Math.round((count / target) * 100)) : 100;
  const remaining = target > 0 ? Math.max(0, target - count) : 0;

  // Touch handler for manual counting
  const handleTap = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (mode === 'manual') {
      const rect = e.currentTarget.getBoundingClientRect();
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
      }

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      setRipples(prev => [...prev.slice(-4), { id: Date.now(), x, y }]);
      onManualCount();
    }
  };

  // Generate 27 beads (divisible into 108 bead cycles) around the perimeter
  const beadCount = 36;
  const beads = Array.from({ length: beadCount });

  // Calculate dynamic aura scale from audio level (0 to 100)
  const auraScale = isListening ? 1 + (audioLevel / 100) * 0.18 : 1;
  const auraGlow = isListening ? Math.max(0.2, audioLevel / 80) : 0.2;

  return (
    <div className="relative flex flex-col items-center justify-center my-4 sm:my-6 select-none">
      {/* Outer Glow Halo */}
      <div
        className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full transition-all duration-150 pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(223, 177, 91, ${auraGlow * 0.4}) 0%, rgba(16, 56, 53, 0) 70%)`,
          transform: `scale(${auraScale})`
        }}
      />

      {/* Main Lotus Prayer Disc */}
      <motion.div
        whileTap={{ scale: mode === 'manual' ? 0.96 : 1 }}
        onClick={handleTap}
        className={`relative w-64 h-64 sm:w-80 sm:h-80 rounded-full flex flex-col items-center justify-center cursor-pointer transition-shadow shadow-2xl ${
          mode === 'manual'
            ? 'active:ring-4 active:ring-[#dfb15b]/40 bg-gradient-to-br from-[#0c2827] via-[#091e1d] to-[#061413] border-2 border-[#dfb15b]/40 hover:border-[#dfb15b]/70'
            : 'bg-gradient-to-br from-[#0b2423] via-[#081a19] to-[#04100f] border-2 border-[#dfb15b]/30'
        }`}
        style={{
          boxShadow: isListening && audioLevel > 15
            ? '0 0 50px rgba(223, 177, 91, 0.35), inset 0 0 35px rgba(223, 177, 91, 0.2)'
            : '0 10px 40px rgba(0, 0, 0, 0.6), inset 0 0 25px rgba(223, 177, 91, 0.08)'
        }}
      >
        {/* Background Sacred Lotus Petals Geometry */}
        <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-56 h-56 sm:w-72 sm:h-72 animate-spin-slow">
            <g stroke="#dfb15b" fill="none" strokeWidth="0.8">
              {[0, 30, 60, 90, 120, 150].map(angle => (
                <ellipse
                  key={angle}
                  cx="100"
                  cy="100"
                  rx="30"
                  ry="85"
                  transform={`rotate(${angle} 100 100)`}
                />
              ))}
              <circle cx="100" cy="100" r="45" strokeDasharray="3 5" />
              <circle cx="100" cy="100" r="75" strokeDasharray="2 4" />
            </g>
          </svg>
        </div>

        {/* Circular Prayer Beads Ring */}
        <div className="absolute inset-2 sm:inset-3 pointer-events-none">
          {beads.map((_, i) => {
            const angle = (i / beadCount) * 2 * Math.PI;
            // Radius as percentage
            const r = 48; // percent
            const left = 50 + r * Math.sin(angle);
            const top = 50 - r * Math.cos(angle);
            // Highlight bead based on progress in current 108 cycle
            const cycleProgress = (count % 108) / 108;
            const beadProgress = i / beadCount;
            const isFilled = cycleProgress >= beadProgress && count > 0;

            return (
              <div
                key={i}
                className="absolute w-2 h-2 sm:w-2.5 sm:h-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  backgroundColor: isFilled ? '#dfb15b' : 'rgba(223, 177, 91, 0.18)',
                  boxShadow: isFilled ? '0 0 6px #dfb15b' : 'none'
                }}
              />
            );
          })}
        </div>

        {/* Touch Ripple Animations (Manual Mode) */}
        {ripples.map(r => (
          <span
            key={r.id}
            className="absolute rounded-full pointer-events-none bg-[#dfb15b]/30 animate-ping"
            style={{
              left: r.x - 20,
              top: r.y - 20,
              width: 40,
              height: 40
            }}
          />
        ))}

        {/* Center Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
          {/* Subtle Label / Status */}
          <div className="flex items-center gap-1.5 mb-1 text-[11px] sm:text-xs font-medium text-[#dfb15b]/90 uppercase tracking-widest">
            {mode === 'voice' ? (
              <>
                <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span>{isListening ? 'Giọng Nói AI' : 'Micro Tạm Dừng'}</span>
              </>
            ) : (
              <>
                <Hand className="w-3.5 h-3.5 text-[#dfb15b]" />
                <span>Chạm Để Đếm (+1)</span>
              </>
            )}
          </div>

          {/* MAIN GIANT COUNT DISPLAY */}
          <motion.div
            key={count}
            initial={{ scale: 0.88, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            className="font-serif-sacred text-6xl sm:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#faeed1] to-[#dfb15b] drop-shadow-md py-1"
          >
            {count.toLocaleString('vi-VN')}
          </motion.div>

          {/* Target Progress Subtext */}
          {target > 0 ? (
            <div className="text-xs sm:text-sm text-[#9eb9b6] mt-0.5 font-medium">
              Mục tiêu: <span className="text-[#faeed1] font-semibold">{target.toLocaleString('vi-VN')}</span>
              <span className="text-[#dfb15b] ml-1.5 font-bold">({percentage}%)</span>
            </div>
          ) : (
            <div className="text-xs text-[#9eb9b6] mt-0.5">
              Vô lượng (Không giới hạn)
            </div>
          )}

          {/* Live Chant Feedback Toast Inside Disc */}
          <AnimatePresence mode="wait">
            {lastChantDetected && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2 px-2.5 py-0.5 rounded-full bg-[#dfb15b]/20 border border-[#dfb15b]/40 text-[11px] text-[#faeed1] flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-[#dfb15b]" />
                <span className="truncate max-w-[170px]">{lastChantDetected}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Manual Fine-Tuning Controls (-1, Chỉnh sửa, +1) */}
      <div className="flex items-center gap-3 mt-4 sm:mt-5">
        <button
          onClick={() => onIncrementManual(-1)}
          disabled={count <= 0}
          className="flex items-center gap-1 text-xs px-3 py-2 rounded-xl bg-[#0c2423] hover:bg-[#123634] text-[#cfdcda] disabled:opacity-30 border border-[#dfb15b]/20 hover:border-[#dfb15b]/40 transition active:scale-95 shadow-md"
          title="Giảm 1 lần (sửa khi đếm dư)"
        >
          <Minus className="w-3.5 h-3.5 text-[#dfb15b]" />
          <span>-1</span>
        </button>

        <button
          onClick={onOpenEditModal}
          className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-xl bg-[#0e2c2a] hover:bg-[#154240] text-[#faeed1] border border-[#dfb15b]/30 hover:border-[#dfb15b]/60 transition active:scale-95 shadow-md font-medium"
          title="Chỉnh sửa số đếm thủ công"
        >
          <Edit3 className="w-3.5 h-3.5 text-[#dfb15b]" />
          <span>Sửa số đếm</span>
        </button>

        <button
          onClick={() => onIncrementManual(1)}
          className="flex items-center gap-1 text-xs px-3 py-2 rounded-xl bg-[#0c2423] hover:bg-[#123634] text-[#cfdcda] border border-[#dfb15b]/20 hover:border-[#dfb15b]/40 transition active:scale-95 shadow-md"
          title="Tăng 1 lần (bổ sung khi đếm thiếu)"
        >
          <Plus className="w-3.5 h-3.5 text-[#dfb15b]" />
          <span>+1</span>
        </button>
      </div>

      {/* Helper hint for active mode */}
      <div className="mt-2 text-center">
        {mode === 'manual' ? (
          <p className="text-[12px] text-[#8ea8a5]">
            💡 Chạm trực tiếp vào vòng tròn để đếm từng biến niệm.
          </p>
        ) : (
          <p className="text-[12px] text-[#8ea8a5]">
            💡 Đặt điện thoại trước mặt và niệm rõ ràng, micro sẽ tự động đếm.
          </p>
        )}
      </div>
    </div>
  );
};
