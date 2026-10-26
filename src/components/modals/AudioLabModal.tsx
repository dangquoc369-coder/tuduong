import React, { useState, useEffect, useRef } from 'react';
import { X, Activity, Mic, CheckCircle, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { ChantingEngine, normalizeVietnamese } from '../../services/chantiEngine';
import { ChantItem } from '../../types';

interface AudioLabModalProps {
  currentChant: ChantItem;
  onClose: () => void;
}

export const AudioLabModal: React.FC<AudioLabModalProps> = ({
  currentChant,
  onClose
}) => {
  const [testLog, setTestLog] = useState<{ time: string; text: string; status: 'matched' | 'ignored' | 'info' }[]>([]);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [realtimeTranscript, setRealtimeTranscript] = useState('');
  const [micLevel, setMicLevel] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const animFrameRef = useRef<number | null>(null);

  const compat = ChantingEngine.checkCompatibility();

  const addLog = (text: string, status: 'matched' | 'ignored' | 'info') => {
    const time = new Date().toLocaleTimeString('vi-VN');
    setTestLog(prev => [{ time, text, status }, ...prev.slice(0, 20)]);
  };

  const startTest = async () => {
    try {
      addLog('Đang khởi tạo kết nối Microphone và bộ phân tích âm thanh...', 'info');

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true }
      });
      streamRef.current = stream;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Draw real-time spectrum
      const draw = () => {
        if (!analyserRef.current || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const cCtx = canvas.getContext('2d');
        if (!cCtx) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        cCtx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 1.5;
        let x = 0;
        let sum = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height;
          sum += dataArray[i];

          // Gold gradient bars
          cCtx.fillStyle = `rgb(223, 177, 91)`;
          cCtx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
          x += barWidth;
        }

        const avg = Math.round((sum / bufferLength / 128) * 100);
        setMicLevel(Math.min(100, avg));

        animFrameRef.current = requestAnimationFrame(draw);
      };
      draw();

      // Start test SpeechRecognition
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        const rec = new SpeechRecognitionClass();
        rec.lang = 'vi-VN';
        rec.continuous = true;
        rec.interimResults = true;

        rec.onresult = (event: any) => {
          let chunk = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            chunk += event.results[i][0].transcript + ' ';
          }
          const text = chunk.trim();
          setRealtimeTranscript(text);

          const norm = normalizeVietnamese(text);
          if (norm.includes('di da phat') || norm.includes('quan the am') || norm.includes('phat') || norm.includes('bo tat')) {
            addLog(`Đã khớp câu niệm: "${text}"`, 'matched');
          } else if (text.length > 5) {
            addLog(`Âm thanh ngoài danh hiệu: "${text}"`, 'ignored');
          }
        };

        rec.onerror = (e: any) => {
          addLog(`Lỗi SpeechRecognition: ${e.error}`, 'info');
        };

        rec.start();
        recognitionRef.current = rec;
      }

      setIsTestRunning(true);
      addLog('Đang lắng nghe! Hãy thử niệm một câu hoặc nói chuyện bình thường để kiểm tra độ nhạy.', 'info');
    } catch (e: any) {
      addLog(`Không thể mở Microphone: ${e.message}`, 'ignored');
    }
  };

  const stopTest = () => {
    setIsTestRunning(false);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
      recognitionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      try { audioContextRef.current.close(); } catch {}
      audioContextRef.current = null;
    }
    setMicLevel(0);
    setRealtimeTranscript('');
    addLog('Đã dừng kiểm tra.', 'info');
  };

  useEffect(() => {
    return () => {
      stopTest();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#092221] border border-[#dfb15b]/40 rounded-3xl p-5 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#dfb15b]/20">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#dfb15b]" />
            <h3 className="font-serif-sacred text-base sm:text-lg font-bold text-[#faeed1]">
              Chẩn Đoán Âm Thanh & Micro AI
            </h3>
          </div>
          <button
            onClick={() => {
              stopTest();
              onClose();
            }}
            className="text-[#9fb8b5] hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Support Status Banner */}
        <div className="my-3 space-y-2 text-xs">
          <div className="p-3 rounded-2xl bg-[#061514] border border-[#dfb15b]/20 flex items-center justify-between">
            <div>
              <span className="text-[#a2beba] block">Web Speech API (Nhận diện giọng nói):</span>
              <strong className={compat.isSupported ? 'text-emerald-400' : 'text-amber-400'}>
                {compat.isSupported ? '✓ Được hỗ trợ trên thiết bị này' : '✗ Không có sẵn'}
              </strong>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#8ea8a5] block">Thiết bị:</span>
              <span className="text-xs text-[#faeed1]">
                {compat.isIOS ? 'iOS Safari' : compat.isSafari ? 'Safari Mac' : 'Chrome/Android/Desktop'}
              </span>
            </div>
          </div>

          {/* Real-time Spectrum Visualizer */}
          <div className="p-3 rounded-2xl bg-[#04100f] border border-[#dfb15b]/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-[#dfb15b] font-medium flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5" />
                Cường độ micro thực tế: {micLevel}%
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${isTestRunning ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-700 text-zinc-300'}`}>
                {isTestRunning ? 'Đang đo' : 'Chưa chạy'}
              </span>
            </div>
            <canvas
              ref={canvasRef}
              width={400}
              height={60}
              className="w-full h-14 rounded-lg bg-[#020b0a]"
            />
            {realtimeTranscript && (
              <p className="mt-2 text-xs text-[#faeed1] italic truncate bg-[#092221] p-2 rounded-lg border border-[#dfb15b]/20">
                "{realtimeTranscript}"
              </p>
            )}
          </div>
        </div>

        {/* Live Test Controls */}
        <div className="flex gap-2 mb-3">
          {!isTestRunning ? (
            <button
              onClick={startTest}
              className="flex-1 py-2.5 rounded-xl bg-[#dfb15b] hover:bg-[#caa04b] text-[#071716] font-bold text-xs flex items-center justify-center gap-1.5 shadow"
            >
              <Mic className="w-4 h-4" />
              <span>Bắt Đầu Kiểm Tra Micro</span>
            </button>
          ) : (
            <button
              onClick={stopTest}
              className="flex-1 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Dừng Kiểm Tra</span>
            </button>
          )}
        </div>

        {/* Test event logs */}
        <div className="flex-1 overflow-y-auto space-y-1.5 bg-[#051514] p-2.5 rounded-2xl border border-[#dfb15b]/15 text-[11px] max-h-48">
          <p className="text-[10px] text-[#8ea8a5] uppercase font-semibold">Nhật ký nhận diện theo thời gian thực:</p>
          {testLog.length === 0 ? (
            <p className="text-[#647c7a] italic py-4 text-center">Bấm "Bắt Đầu Kiểm Tra Micro" rồi niệm một câu để xem phân tích.</p>
          ) : (
            testLog.map((item, idx) => (
              <div
                key={idx}
                className={`p-1.5 rounded-lg flex items-start gap-2 ${
                  item.status === 'matched'
                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                    : item.status === 'ignored'
                    ? 'bg-amber-950/40 text-amber-300'
                    : 'text-[#9fb8b5]'
                }`}
              >
                <span className="text-[10px] text-[#6b8583] font-mono shrink-0">{item.time}</span>
                <span className="break-all">{item.text}</span>
              </div>
            ))
          )}
        </div>

        {/* Footer note */}
        <div className="pt-3 border-t border-[#dfb15b]/15 flex items-center justify-between mt-2">
          <span className="text-[11px] text-[#8ea8a5]">
            Danh hiệu mục tiêu: <strong>{currentChant.shortTitle}</strong>
          </span>
          <button
            onClick={() => {
              stopTest();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-[#dfb15b] text-[#071716] font-bold text-xs"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
