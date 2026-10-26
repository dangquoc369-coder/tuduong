import React from 'react';
import { Award, Sparkles, Check, ArrowRight } from 'lucide-react';

interface MilestoneModalProps {
  count: number;
  target: number;
  chantTitle: string;
  onContinue: () => void;
  onFinish: () => void;
}

export const MilestoneModal: React.FC<MilestoneModalProps> = ({
  count,
  target,
  chantTitle,
  onContinue,
  onFinish
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-gradient-to-b from-[#0e2f2e] to-[#071918] border-2 border-[#dfb15b] rounded-3xl p-6 shadow-2xl text-center relative overflow-hidden">
        {/* Sacred Aura Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#dfb15b]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#dfb15b] to-[#fff3c4] p-0.5 shadow-xl shadow-[#dfb15b]/30 mb-3 flex items-center justify-center animate-bounce">
            <div className="w-full h-full rounded-full bg-[#071716] flex items-center justify-center text-[#dfb15b]">
              <Award className="w-8 h-8" />
            </div>
          </div>

          <span className="text-xs font-bold text-[#dfb15b] uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            CÔNG ĐỨC VIÊN MÃN
            <Sparkles className="w-3.5 h-3.5" />
          </span>

          <h3 className="font-serif-sacred text-2xl font-bold text-[#faeed1] mb-1">
            Đạt Mốc {count.toLocaleString('vi-VN')} Lần Niệm
          </h3>
          <p className="text-xs text-[#9fb8b5] mb-4">
            {chantTitle}
          </p>

          {/* Buddhist Dedication of Merit Box */}
          <div className="w-full bg-[#051413]/80 border border-[#dfb15b]/30 rounded-2xl p-3.5 text-left mb-5">
            <p className="text-[11px] font-semibold text-[#dfb15b] mb-1">Kinh Hồi Hướng Công Đức:</p>
            <p className="text-[11px] text-[#cfdcda] italic leading-relaxed">
              "Nguyện đem công đức này,<br />
              Trang nghiêm Phật Tịnh Độ,<br />
              Trên đền bốn ơn nặng,<br />
              Dưới cứu khổ ba đường,<br />
              Nếu có ai thấy nghe,<br />
              Đều phát lòng bồ đề,<br />
              Hết một báo thân này,<br />
              Cùng sanh cõi Cực Lạc."
            </p>
          </div>

          <div className="w-full space-y-2">
            <button
              onClick={onContinue}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#dfb15b] to-[#b88c3a] text-[#071716] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#dfb15b]/20 active:scale-98 transition"
            >
              <Check className="w-4 h-4" />
              <span>Tiếp Tục Niệm Thêm</span>
            </button>

            <button
              onClick={onFinish}
              className="w-full py-2.5 px-4 rounded-xl border border-[#dfb15b]/30 text-[#dfb15b] hover:bg-[#dfb15b]/10 font-medium text-xs flex items-center justify-center gap-2 transition"
            >
              <span>Kết Thúc & Lưu Vào Lịch Sử</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
