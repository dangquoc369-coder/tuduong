import React from 'react';
import { AlertTriangle, RotateCcw, Save, X } from 'lucide-react';

interface ResetConfirmModalProps {
  currentCount: number;
  onConfirmReset: (shouldSave: boolean) => void;
  onClose: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  currentCount,
  onConfirmReset,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#092221] border border-amber-500/40 rounded-2xl p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#dfb15b]/20">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>Xác Nhận Đặt Lại Số Đếm</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#9fb8b5] hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="my-4 text-xs text-[#cfdcda] space-y-2">
          <p>
            Bạn có <strong className="text-[#faeed1] text-sm">{currentCount.toLocaleString('vi-VN')}</strong> lần niệm trong phiên tu tập này.
          </p>
          <p className="text-[#9fb8b5]">
            Bạn có muốn lưu phiên niệm này vào Lịch sử trước khi đưa số đếm về 0 không?
          </p>
        </div>

        <div className="space-y-2 pt-2 border-t border-[#dfb15b]/15">
          {currentCount > 0 && (
            <button
              onClick={() => onConfirmReset(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#dfb15b] to-[#b88c3a] text-[#071716] font-bold text-xs flex items-center justify-center gap-1.5 shadow"
            >
              <Save className="w-4 h-4" />
              <span>Lưu vào Lịch sử & Đặt lại về 0</span>
            </button>
          )}

          <button
            onClick={() => onConfirmReset(false)}
            className="w-full py-2 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-xs font-medium flex items-center justify-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xóa bỏ số đếm (không lưu)</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 px-3 rounded-xl border border-[#dfb15b]/20 text-[#9fb8b5] hover:text-white text-xs font-medium"
          >
            Tiếp tục tu tập (Hủy)
          </button>
        </div>
      </div>
    </div>
  );
};
