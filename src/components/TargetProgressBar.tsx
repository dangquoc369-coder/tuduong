import React, { useState } from 'react';
import { Target, Award, CheckCircle2 } from 'lucide-react';

interface TargetProgressBarProps {
  count: number;
  target: number;
  onSetTarget: (newTarget: number) => void;
}

export const TargetProgressBar: React.FC<TargetProgressBarProps> = ({
  count,
  target,
  onSetTarget
}) => {
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [customInput, setCustomInput] = useState('');

  const PRESETS = [
    { label: '108', value: 108, desc: '1 Chuỗi' },
    { label: '500', value: 500, desc: 'Biến' },
    { label: '1.000', value: 1000, desc: 'Biến' },
    { label: '10.000', value: 10000, desc: 'Đại nguyện' },
    { label: 'Vô lượng', value: 0, desc: 'Tự do' }
  ];

  const percentage = target > 0 ? Math.min(100, Math.round((count / target) * 100)) : 100;
  const remaining = target > 0 ? Math.max(0, target - count) : 0;
  const isCompleted = target > 0 && count >= target;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customInput, 10);
    if (!isNaN(val) && val > 0) {
      onSetTarget(val);
      setIsCustomOpen(false);
      setCustomInput('');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 mt-2">
      <div className="bg-[#0a2221] border border-[#dfb15b]/20 rounded-2xl p-4 shadow-lg">
        {/* Progress Info Header */}
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-1.5 text-[#dfb15b]">
            <Target className="w-4 h-4" />
            <span className="font-semibold uppercase tracking-wider">Tiến độ mục tiêu</span>
          </div>

          <div className="text-right">
            {target > 0 ? (
              <span className="text-[#e2eceb]">
                {isCompleted ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Đã hoàn thành mục tiêu!
                  </span>
                ) : (
                  <>
                    Còn lại: <strong className="text-[#faeed1] font-semibold">{remaining.toLocaleString('vi-VN')}</strong> lần
                  </>
                )}
              </span>
            ) : (
              <span className="text-[#9fb8b5]">Không đặt giới hạn</span>
            )}
          </div>
        </div>

        {/* Progress Bar Track */}
        {target > 0 && (
          <div className="relative w-full h-3 bg-[#061615] rounded-full overflow-hidden border border-[#dfb15b]/20 mb-3">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isCompleted
                  ? 'bg-gradient-to-r from-emerald-500 via-[#dfb15b] to-emerald-400 shadow-md shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-[#b3883b] via-[#dfb15b] to-[#fcecb6]'
              }`}
              style={{ width: `${percentage}%` }}
            />
            {/* 108 milestone notch marker if target > 108 */}
            {target > 108 && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white/40"
                style={{ left: `${(108 / target) * 100}%` }}
                title="Mốc 1 chuỗi 108"
              />
            )}
          </div>
        )}

        {/* Quick Target Preset Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-[#8ea8a5] mr-1">Mục tiêu:</span>
          {PRESETS.map((p) => {
            const isSelected = target === p.value;
            return (
              <button
                key={p.label}
                onClick={() => onSetTarget(p.value)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                  isSelected
                    ? 'bg-[#dfb15b] text-[#071716] font-bold border-[#dfb15b] shadow-sm'
                    : 'bg-[#0e2d2b] text-[#cfdcda] border-[#dfb15b]/20 hover:border-[#dfb15b]/50'
                }`}
              >
                {p.label}
              </button>
            );
          })}

          {/* Custom Target Button */}
          <button
            onClick={() => setIsCustomOpen(!isCustomOpen)}
            className={`text-xs px-2.5 py-1 rounded-lg border transition ${
              isCustomOpen || (!PRESETS.some(p => p.value === target) && target > 0)
                ? 'bg-[#dfb15b]/20 text-[#dfb15b] border-[#dfb15b]'
                : 'bg-[#0e2d2b] text-[#cfdcda] border-[#dfb15b]/20 hover:border-[#dfb15b]/50'
            }`}
          >
            Tùy chỉnh
          </button>
        </div>

        {/* Custom Target Input Form */}
        {isCustomOpen && (
          <form onSubmit={handleCustomSubmit} className="mt-3 flex items-center gap-2 pt-2 border-t border-[#dfb15b]/15">
            <input
              type="number"
              min="1"
              max="1000000"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Nhập số lần mục tiêu (ví dụ 1080)..."
              className="flex-1 bg-[#061514] border border-[#dfb15b]/40 rounded-xl px-3 py-1.5 text-xs text-[#faeed1] focus:outline-none focus:border-[#dfb15b]"
              autoFocus
            />
            <button
              type="submit"
              className="bg-[#dfb15b] hover:bg-[#caa04b] text-[#071716] text-xs font-bold px-3 py-1.5 rounded-xl transition shadow"
            >
              Đặt mục tiêu
            </button>
            <button
              type="button"
              onClick={() => setIsCustomOpen(false)}
              className="text-xs text-[#9fb8b5] hover:text-white px-2 py-1.5"
            >
              Hủy
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
