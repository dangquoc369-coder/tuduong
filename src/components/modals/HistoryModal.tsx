import React, { useState } from 'react';
import { X, Calendar, Clock, Flame, Award, Trash2, BarChart2, Filter } from 'lucide-react';
import { ChantSession, DailyStat } from '../../types';

interface HistoryModalProps {
  history: ChantSession[];
  dailyStats: Record<string, DailyStat>;
  streak: number;
  onClearHistory: () => void;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  history,
  dailyStats,
  streak,
  onClearHistory,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'stats'>('sessions');

  // Calculate totals
  const totalChantsAllTime = history.reduce((sum, s) => sum + s.count, 0);
  const totalSecondsAllTime = history.reduce((sum, s) => sum + s.durationSeconds, 0);
  const totalHours = (totalSecondsAllTime / 3600).toFixed(1);

  // Format date helper
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    if (mins === 0) return `${s} giây`;
    return `${mins} phút ${s > 0 ? `${s}s` : ''}`;
  };

  // Group stats by recent 7 days
  const recentDays = Object.values(dailyStats)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#092221] border border-[#dfb15b]/40 rounded-3xl p-5 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#dfb15b]/20">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#dfb15b]" />
            <h3 className="font-serif-sacred text-base sm:text-lg font-bold text-[#faeed1]">
              Lịch Sử Tu Tập & Thống Kê
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#9fb8b5] hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highlight Stats Row */}
        <div className="grid grid-cols-3 gap-2 my-3">
          <div className="bg-[#051514] border border-[#dfb15b]/20 rounded-2xl p-2.5 text-center">
            <span className="text-[10px] text-[#8ea8a5] uppercase tracking-wider block">Tổng Niệm</span>
            <strong className="text-lg font-serif-sacred text-[#faeed1]">
              {totalChantsAllTime.toLocaleString('vi-VN')}
            </strong>
          </div>

          <div className="bg-[#051514] border border-[#dfb15b]/20 rounded-2xl p-2.5 text-center">
            <span className="text-[10px] text-[#8ea8a5] uppercase tracking-wider block">Thời Lượng</span>
            <strong className="text-lg font-serif-sacred text-[#dfb15b]">
              {totalHours} giờ
            </strong>
          </div>

          <div className="bg-[#051514] border border-[#dfb15b]/20 rounded-2xl p-2.5 text-center">
            <span className="text-[10px] text-[#8ea8a5] uppercase tracking-wider block">Chuỗi Ngày</span>
            <strong className="text-lg font-serif-sacred text-amber-400 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-current" />
              {streak} ngày
            </strong>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex bg-[#061514] p-1 rounded-xl border border-[#dfb15b]/20 mb-3">
          <button
            onClick={() => setActiveTab('sessions')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition ${
              activeTab === 'sessions'
                ? 'bg-[#dfb15b] text-[#071716] font-bold shadow'
                : 'text-[#8ea8a5] hover:text-[#faeed1]'
            }`}
          >
            Danh Sách Phiên Niệm ({history.length})
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition ${
              activeTab === 'stats'
                ? 'bg-[#dfb15b] text-[#071716] font-bold shadow'
                : 'text-[#8ea8a5] hover:text-[#faeed1]'
            }`}
          >
            Thống Kê Theo Ngày
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {activeTab === 'sessions' ? (
            history.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#8ea8a5]">
                <Calendar className="w-8 h-8 text-[#dfb15b]/40 mx-auto mb-2" />
                <p>Chưa có phiên niệm nào được lưu.</p>
                <p className="mt-1">Khi bạn bấm "Lưu Phiên", kết quả sẽ xuất hiện ở đây.</p>
              </div>
            ) : (
              history.map((session) => (
                <div
                  key={session.id}
                  className="bg-[#0c2726] border border-[#dfb15b]/20 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-serif-sacred font-bold text-sm text-[#faeed1] truncate">
                        {session.chantTitle}
                      </span>
                      {session.reachedTarget && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-medium">
                          Đạt mục tiêu
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-[#8ea8a5]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#dfb15b]" />
                        {formatDuration(session.durationSeconds)}
                      </span>
                      <span>{formatDate(session.completedAt || session.startedAt)}</span>
                      <span className="capitalize text-[#9fb8b5]">
                        ({session.mode === 'voice' ? 'Micro AI' : 'Chạm tay'})
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-lg font-serif-sacred font-bold text-[#dfb15b]">
                      +{session.count.toLocaleString('vi-VN')}
                    </span>
                    <span className="text-[10px] text-[#8ea8a5] block">biến</span>
                  </div>
                </div>
              ))
            )
          ) : (
            /* Stats Tab */
            recentDays.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#8ea8a5]">
                <BarChart2 className="w-8 h-8 text-[#dfb15b]/40 mx-auto mb-2" />
                <p>Chưa có dữ liệu thống kê ngày.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[11px] text-[#dfb15b] font-medium mb-1">
                  7 ngày tu tập gần nhất:
                </p>
                {recentDays.map((stat) => (
                  <div
                    key={stat.date}
                    className="bg-[#0c2726] border border-[#dfb15b]/20 rounded-2xl p-3 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-[#faeed1] block">
                        Ngày {new Date(stat.date + 'T00:00:00').toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' })}
                      </span>
                      <span className="text-[11px] text-[#8ea8a5]">
                        {stat.sessionCount} phiên tu tập • {formatDuration(stat.totalDurationSeconds)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-serif-sacred font-bold text-[#dfb15b]">
                        {stat.totalCount.toLocaleString('vi-VN')}
                      </span>
                      <span className="text-[10px] text-[#8ea8a5] block">biến</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-[#dfb15b]/15 flex items-center justify-between mt-2">
          {history.length > 0 ? (
            <button
              onClick={() => {
                if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử tu tập không?')) {
                  onClearHistory();
                }
              }}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 p-1 rounded"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa lịch sử</span>
            </button>
          ) : <span />}

          <button
            onClick={onClose}
            className="bg-[#dfb15b] hover:bg-[#caa04b] text-[#071716] font-bold text-xs px-4 py-2 rounded-xl transition shadow"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
