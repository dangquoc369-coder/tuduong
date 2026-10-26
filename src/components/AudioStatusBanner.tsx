import React from 'react';
import { Mic, MicOff, AlertCircle, Volume2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { EngineStatus } from '../services/chantiEngine';
import { CountingMode } from '../types';

interface AudioStatusBannerProps {
  mode: CountingMode;
  status: EngineStatus;
  statusMessage: string;
  interimTranscript: string;
  audioLevel: number;
  onRequestMicPermission: () => void;
}

export const AudioStatusBanner: React.FC<AudioStatusBannerProps> = ({
  mode,
  status,
  statusMessage,
  interimTranscript,
  audioLevel,
  onRequestMicPermission
}) => {
  if (mode === 'manual') {
    return (
      <div className="w-full max-w-xl mx-auto px-4 mt-3">
        <div className="bg-[#0b2423]/70 border border-[#dfb15b]/20 rounded-xl px-3.5 py-2 flex items-center justify-between text-xs text-[#9eb9b6]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Chế độ đếm thủ công: Chạm vào vòng hoa sen mỗi lần niệm</span>
          </div>
          <span className="text-[11px] text-[#dfb15b]/80">Mõ / Chuông</span>
        </div>
      </div>
    );
  }

  // Permission denied state
  if (status === 'permission_denied') {
    return (
      <div className="w-full max-w-xl mx-auto px-4 mt-3">
        <div className="bg-red-950/70 border border-red-500/40 rounded-xl p-3 flex items-center justify-between gap-3 text-xs text-red-200">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <p className="font-semibold text-red-300">Microphone chưa được cấp quyền</p>
              <p className="text-[11px] text-red-300/80">Vui lòng mở cài đặt trình duyệt để cho phép ứng dụng nghe giọng niệm.</p>
            </div>
          </div>
          <button
            onClick={onRequestMicPermission}
            className="shrink-0 bg-red-600 hover:bg-red-500 text-white font-medium text-xs px-3 py-1.5 rounded-lg shadow"
          >
            Cấp quyền
          </button>
        </div>
      </div>
    );
  }

  // Browser unsupported state
  if (status === 'unsupported') {
    return (
      <div className="w-full max-w-xl mx-auto px-4 mt-3">
        <div className="bg-amber-950/70 border border-amber-500/40 rounded-xl p-3 flex items-center gap-2.5 text-xs text-amber-200">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <p className="font-semibold text-amber-300">Trình duyệt không hỗ trợ Web Speech API</p>
            <p className="text-[11px] text-amber-300/80">Khuyên dùng Safari trên iOS hoặc Chrome trên Android. Bạn vẫn có thể dùng <strong>Chế độ Chạm</strong> bên trên.</p>
          </div>
        </div>
      </div>
    );
  }

  // Dynamic status styling
  const isDetected = status === 'detected';
  const isListening = status === 'listening';
  const isAmbientNoise = status === 'ambient_noise';

  return (
    <div className="w-full max-w-xl mx-auto px-4 mt-3">
      <div
        className={`rounded-xl px-3.5 py-2.5 border transition-all duration-300 ${
          isDetected
            ? 'bg-emerald-950/80 border-emerald-400/60 shadow-md shadow-emerald-500/20'
            : isAmbientNoise
            ? 'bg-amber-950/60 border-amber-500/30 text-amber-200'
            : isListening
            ? 'bg-[#092221] border-[#dfb15b]/30'
            : 'bg-[#071918] border-[#dfb15b]/15'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          {/* Status Message */}
          <div className="flex items-center gap-2 overflow-hidden">
            {isDetected ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 animate-bounce" />
            ) : isListening ? (
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
            ) : (
              <MicOff className="w-4 h-4 text-[#8ea8a5] shrink-0" />
            )}

            <span
              className={`text-xs font-medium truncate ${
                isDetected
                  ? 'text-emerald-300 font-bold'
                  : isAmbientNoise
                  ? 'text-amber-300'
                  : isListening
                  ? 'text-[#f0fdf4]'
                  : 'text-[#8ea8a5]'
              }`}
            >
              {statusMessage || 'Sẵn sàng lắng nghe'}
            </span>
          </div>

          {/* Real-time VU / Audio Energy Level Meter */}
          {isListening && (
            <div className="flex items-center gap-1 shrink-0" title={`Cường độ âm thanh: ${audioLevel}%`}>
              <div className="flex items-end gap-0.5 h-3.5">
                {[0.2, 0.4, 0.6, 0.8, 1.0].map((barThreshold, i) => {
                  const isActive = (audioLevel / 100) >= barThreshold;
                  return (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-75 ${
                        isActive
                          ? i >= 3
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                          : 'bg-[#153e3b]'
                      }`}
                      style={{ height: `${(i + 1) * 20}%` }}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Live Interim Transcript Stream */}
        {isListening && interimTranscript && (
          <div className="mt-1.5 pt-1.5 border-t border-[#dfb15b]/10 flex items-center gap-1.5 text-[11px] text-[#dfb15b]">
            <span className="text-[#8ea8a5] italic shrink-0">Đang nhận:</span>
            <span className="truncate italic">"{interimTranscript}"</span>
          </div>
        )}
      </div>
    </div>
  );
};
