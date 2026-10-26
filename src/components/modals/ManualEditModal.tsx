import React, { useState } from 'react';
import { X, Check, Edit3 } from 'lucide-react';

interface ManualEditModalProps {
  currentCount: number;
  onSave: (newCount: number) => void;
  onClose: () => void;
}

export const ManualEditModal: React.FC<ManualEditModalProps> = ({
  currentCount,
  onSave,
  onClose
}) => {
  const [value, setValue] = useState(currentCount.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      onSave(parsed);
      onClose();
    }
  };

  const handleQuickAdd = (delta: number) => {
    const current = parseInt(value, 10) || 0;
    setValue(Math.max(0, current + delta).toString());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#092221] border border-[#dfb15b]/40 rounded-2xl p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#dfb15b]/20">
          <div className="flex items-center gap-2 text-[#faeed1] font-bold">
            <Edit3 className="w-4 h-4 text-[#dfb15b]" />
            <span>Chỉnh Sửa Số Đếm Thủ Công</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#9fb8b5] hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs text-[#a2beba] mb-1.5 font-medium">
              Số biến niệm hiện tại:
            </label>
            <input
              type="number"
              min="0"
              max="10000000"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full bg-[#061514] border border-[#dfb15b]/40 rounded-xl px-4 py-3 text-center text-3xl font-serif-sacred font-bold text-[#faeed1] focus:outline-none focus:border-[#dfb15b]"
              autoFocus
            />
          </div>

          {/* Quick adjustment pills */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleQuickAdd(-10)}
              className="px-2.5 py-1 text-xs rounded-lg bg-[#0e2f2d] hover:bg-[#164441] text-[#cfdcda] border border-[#dfb15b]/20"
            >
              -10
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd(-1)}
              className="px-2.5 py-1 text-xs rounded-lg bg-[#0e2f2d] hover:bg-[#164441] text-[#cfdcda] border border-[#dfb15b]/20"
            >
              -1
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd(1)}
              className="px-2.5 py-1 text-xs rounded-lg bg-[#0e2f2d] hover:bg-[#164441] text-[#cfdcda] border border-[#dfb15b]/20"
            >
              +1
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd(10)}
              className="px-2.5 py-1 text-xs rounded-lg bg-[#0e2f2d] hover:bg-[#164441] text-[#cfdcda] border border-[#dfb15b]/20"
            >
              +10
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd(108)}
              className="px-2.5 py-1 text-xs rounded-lg bg-[#dfb15b]/20 hover:bg-[#dfb15b]/30 text-[#dfb15b] border border-[#dfb15b]/40 font-semibold"
            >
              +108
            </button>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-[#dfb15b]/15">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#dfb15b]/20 text-xs font-medium text-[#a2beba] hover:bg-[#0c2827]"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#dfb15b] hover:bg-[#caa04b] text-[#071716] text-xs font-bold shadow flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Lưu số đếm</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
