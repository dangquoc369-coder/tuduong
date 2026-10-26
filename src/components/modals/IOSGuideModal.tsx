import React from 'react';
import { X, Smartphone, Mic, Share, PlusSquare, CheckCircle, ShieldCheck, HelpCircle } from 'lucide-react';

interface IOSGuideModalProps {
  onClose: () => void;
}

export const IOSGuideModal: React.FC<IOSGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#092221] border border-[#dfb15b]/40 rounded-3xl p-5 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#dfb15b]/20">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-[#dfb15b]" />
            <h3 className="font-serif-sacred text-base sm:text-lg font-bold text-[#faeed1]">
              Hướng Dẫn Sử Dụng & Cài Đặt iPhone
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#9fb8b5] hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-4 my-3 pr-1 text-xs text-[#cfdcda]">
          {/* Section 1: Feasibility Analysis */}
          <div className="p-3.5 rounded-2xl bg-[#061615] border border-[#dfb15b]/25">
            <h4 className="text-sm font-bold text-[#dfb15b] flex items-center gap-1.5 mb-1.5">
              <ShieldCheck className="w-4 h-4" />
              1. Khả Thi Nhận Diện Giọng Nói Trên iPhone (iOS)
            </h4>
            <p className="text-[#a2beba] leading-relaxed mb-2">
              Apple hỗ trợ <code>webkitSpeechRecognition</code> trên Safari (iOS 14.5 trở lên). Ứng dụng "Tu Dưỡng" được trang bị bộ giám sát tự động kích hoạt lại (Auto-Restart Watchdog) và bộ lọc âm thanh VAD của Web Audio API, giúp nhận diện liên tục mà không lo bị ngắt quãng.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 bg-emerald-950/40 p-2 rounded-xl border border-emerald-500/20">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Hoàn toàn miễn phí, xử lý giọng nói bảo mật trên máy người dùng.</span>
            </div>
          </div>

          {/* Section 2: PWA Installation on iPhone */}
          <div className="p-3.5 rounded-2xl bg-[#061615] border border-[#dfb15b]/25">
            <h4 className="text-sm font-bold text-[#dfb15b] flex items-center gap-1.5 mb-2">
              <PlusSquare className="w-4 h-4" />
              2. Cài Đặt App Vào Màn Hình Chính iPhone (PWA)
            </h4>
            <ol className="space-y-2 list-decimal list-inside text-[#cfdcda] leading-relaxed">
              <li>
                Mở trang web trong trình duyệt <strong>Safari</strong> trên iPhone.
              </li>
              <li className="flex items-center gap-1.5">
                Nhấn vào nút <strong>Chia sẻ (Share)</strong> <Share className="w-3.5 h-3.5 inline text-[#dfb15b]" /> ở thanh công cụ dưới cùng.
              </li>
              <li>
                Cuộn xuống và chọn <strong>"Thêm vào MH chính" (Add to Home Screen)</strong>.
              </li>
              <li>
                Nhấn <strong>"Thêm" (Add)</strong> ở góc trên bên phải. Biểu tượng "Tu Dưỡng" hoa sen vàng sẽ xuất hiện trên màn hình như một ứng dụng độc lập không có thanh địa chỉ!
              </li>
            </ol>
          </div>

          {/* Section 3: Mic Permissions */}
          <div className="p-3.5 rounded-2xl bg-[#061615] border border-[#dfb15b]/25">
            <h4 className="text-sm font-bold text-[#dfb15b] flex items-center gap-1.5 mb-2">
              <Mic className="w-4 h-4" />
              3. Cấp Quyền Microphone Trên Safari
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-[#a2beba]">
              <li>Khi bấm <strong>"BẮT ĐẦU NIỆM"</strong>, Safari sẽ hỏi <em>"Cho phép sử dụng micrô?"</em> - chọn <strong>Cho phép (Allow)</strong>.</li>
              <li>Nếu lỡ chặn: Vào <strong>Cài đặt iPhone &gt; Safari &gt; Micrô</strong> và chuyển sang <strong>Cho phép</strong> hoặc <strong>Hỏi</strong>.</li>
            </ul>
          </div>

          {/* Section 4: Chanting Tips */}
          <div className="p-3.5 rounded-2xl bg-[#061615] border border-[#dfb15b]/25">
            <h4 className="text-sm font-bold text-[#dfb15b] flex items-center gap-1.5 mb-2">
              <HelpCircle className="w-4 h-4" />
              4. Mẹo Để Đếm Chính Xác Nhất
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-[#a2beba]">
              <li>Đặt điện thoại cách miệng khoảng 30cm - 1m trong không gian thanh tịnh.</li>
              <li>Niệm tròn vành rõ chữ, có thể chọn tốc độ niệm <strong>Nhanh / Vừa / Chậm</strong> trong Cài đặt.</li>
              <li>Nếu ở chốn đông người hoặc thiền đường cần yên tĩnh, hãy bật <strong>Chế Độ Chạm</strong> để đếm bằng cách chạm tay vào hoa sen.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#dfb15b]/15 text-right">
          <button
            onClick={onClose}
            className="bg-[#dfb15b] hover:bg-[#caa04b] text-[#071716] font-bold text-xs px-5 py-2 rounded-xl transition shadow"
          >
            Đã Hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
