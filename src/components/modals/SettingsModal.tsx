import React from 'react';
import { X, Settings, Volume2, Vibrate, Zap, Moon, Gauge, Sparkles } from 'lucide-react';
import { AppSettings } from '../../types';
import { sound } from '../../services/soundFx';

interface SettingsModalProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose
}) => {
  const handleChange = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    onUpdateSettings({
      ...settings,
      [key]: value
    });
  };

  const handleTestSound = () => {
    if (settings.soundType === 'woodblock' || settings.soundType === 'both') {
      sound.playWoodblock(settings.soundVolume);
    }
    if (settings.soundType === 'bell' || settings.soundType === 'both') {
      sound.playTempleBell(settings.soundVolume);
    }
    if (settings.vibrationEnabled) {
      sound.triggerHaptic('tap');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#092221] border border-[#dfb15b]/40 rounded-3xl p-5 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#dfb15b]/20">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#dfb15b]" />
            <h3 className="font-serif-sacred text-base sm:text-lg font-bold text-[#faeed1]">
              Cài Đặt Ứng Dụng
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#9fb8b5] hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto space-y-4 my-3 pr-1 text-xs text-[#cfdcda]">
          {/* Sound Settings */}
          <div className="p-3 rounded-2xl bg-[#061615] border border-[#dfb15b]/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#dfb15b] flex items-center gap-1.5">
                <Volume2 className="w-4 h-4" />
                Âm Thanh Tiếng Niệm
              </span>
              <button
                type="button"
                onClick={handleTestSound}
                className="text-[11px] text-[#dfb15b] hover:text-white px-2 py-0.5 rounded bg-[#dfb15b]/15 border border-[#dfb15b]/30"
              >
                Thử âm thanh
              </button>
            </div>

            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[
                { id: 'woodblock', label: 'Mõ Gỗ' },
                { id: 'bell', label: 'Chuông' },
                { id: 'both', label: 'Cả Hai' },
                { id: 'silent', label: 'Tắt Âm' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleChange('soundType', opt.id as any)}
                  className={`py-1.5 text-xs rounded-xl border transition text-center ${
                    settings.soundType === opt.id
                      ? 'bg-[#dfb15b] text-[#071716] font-bold border-[#dfb15b]'
                      : 'bg-[#0b2423] text-[#cfdcda] border-[#dfb15b]/20'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {settings.soundType !== 'silent' && (
              <div>
                <div className="flex justify-between text-[11px] text-[#a2beba] mb-1">
                  <span>Âm lượng chuông mõ:</span>
                  <span>{Math.round(settings.soundVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={settings.soundVolume}
                  onChange={(e) => handleChange('soundVolume', parseFloat(e.target.value))}
                  className="w-full accent-[#dfb15b]"
                />
              </div>
            )}
          </div>

          {/* Vibration and Milestone */}
          <div className="p-3 rounded-2xl bg-[#061615] border border-[#dfb15b]/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#faeed1] flex items-center gap-1.5">
                <Vibrate className="w-4 h-4 text-[#dfb15b]" />
                Rung nhẹ khi đếm thành công
              </span>
              <input
                type="checkbox"
                checked={settings.vibrationEnabled}
                onChange={(e) => handleChange('vibrationEnabled', e.target.checked)}
                className="w-4 h-4 accent-[#dfb15b] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between border-t border-[#dfb15b]/10 pt-2.5">
              <span className="font-semibold text-[#faeed1] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#dfb15b]" />
                Âm báo đặc biệt khi đạt mốc 108, 500, 1000
              </span>
              <input
                type="checkbox"
                checked={settings.milestoneAlerts}
                onChange={(e) => handleChange('milestoneAlerts', e.target.checked)}
                className="w-4 h-4 accent-[#dfb15b] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between border-t border-[#dfb15b]/10 pt-2.5">
              <span className="font-semibold text-[#faeed1] flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-[#dfb15b]" />
                Giữ màn hình luôn sáng (Wake Lock)
              </span>
              <input
                type="checkbox"
                checked={settings.wakeLockEnabled}
                onChange={(e) => handleChange('wakeLockEnabled', e.target.checked)}
                className="w-4 h-4 accent-[#dfb15b] rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Chanting Pace (Speed) */}
          <div className="p-3 rounded-2xl bg-[#061615] border border-[#dfb15b]/20 space-y-2">
            <span className="font-bold text-[#dfb15b] flex items-center gap-1.5">
              <Gauge className="w-4 h-4" />
              Tốc Độ Niệm (Khoảng cách giữa các biến)
            </span>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { id: 'fast', label: 'Nhanh (~0.7s)', desc: 'Niệm liên tục' },
                { id: 'normal', label: 'Vừa (~1.0s)', desc: 'Chuẩn nhịp thở' },
                { id: 'slow', label: 'Chậm (~1.5s)', desc: 'Trầm bổng, rõ' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleChange('chantPace', opt.id as any)}
                  className={`p-2 rounded-xl border text-center transition ${
                    settings.chantPace === opt.id
                      ? 'bg-[#dfb15b] text-[#071716] font-bold border-[#dfb15b]'
                      : 'bg-[#0b2423] text-[#cfdcda] border-[#dfb15b]/20'
                  }`}
                >
                  <div className="text-xs">{opt.label}</div>
                  <div className={`text-[10px] ${settings.chantPace === opt.id ? 'text-[#071716]/80' : 'text-[#8ea8a5]'}`}>
                    {opt.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sensitivity */}
          <div className="p-3 rounded-2xl bg-[#061615] border border-[#dfb15b]/20 space-y-2">
            <span className="font-bold text-[#dfb15b] flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              Độ Nhạy Lọc Âm Thanh
            </span>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { id: 'high', label: 'Nhạy Cao', desc: 'Thì thầm / yên tĩnh' },
                { id: 'normal', label: 'Tiêu Chuẩn', desc: 'Phòng bình thường' },
                { id: 'low', label: 'Lọc Ồn', desc: 'Có tiếng quạt / TV nhẹ' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleChange('voiceSensitivity', opt.id as any)}
                  className={`p-2 rounded-xl border text-center transition ${
                    settings.voiceSensitivity === opt.id
                      ? 'bg-[#dfb15b] text-[#071716] font-bold border-[#dfb15b]'
                      : 'bg-[#0b2423] text-[#cfdcda] border-[#dfb15b]/20'
                  }`}
                >
                  <div className="text-xs">{opt.label}</div>
                  <div className={`text-[10px] ${settings.voiceSensitivity === opt.id ? 'text-[#071716]/80' : 'text-[#8ea8a5]'}`}>
                    {opt.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#dfb15b]/15 text-right">
          <button
            onClick={onClose}
            className="bg-[#dfb15b] hover:bg-[#caa04b] text-[#071716] font-bold text-xs px-5 py-2.5 rounded-xl transition shadow"
          >
            Lưu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
