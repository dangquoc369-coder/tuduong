import React from 'react';
import { ChantItem } from '../types';
import { ChevronDown, Plus, Sparkles, Trash2 } from 'lucide-react';

interface ChantSelectorProps {
  chants: ChantItem[];
  selectedChant: ChantItem;
  onSelectChant: (chant: ChantItem) => void;
  onOpenAddModal: () => void;
  onDeleteCustomChant: (id: string) => void;
  isSessionActive: boolean;
}

export const ChantSelector: React.FC<ChantSelectorProps> = ({
  chants,
  selectedChant,
  onSelectChant,
  onOpenAddModal,
  onDeleteCustomChant,
  isSessionActive
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const getCategoryBadge = (cat: ChantItem['category']) => {
    switch (cat) {
      case 'phat':
        return <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">Chư Phật</span>;
      case 'bo-tat':
        return <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Bồ Tát</span>;
      case 'chu':
        return <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30">Chân Ngôn</span>;
      default:
        return <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">Tự Thêm</span>;
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto px-4 pt-2">
      {/* Current Chant Display Card */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="group cursor-pointer bg-gradient-to-r from-[#0c2423] via-[#0f2c2b] to-[#0c2423] border border-[#dfb15b]/30 hover:border-[#dfb15b]/60 rounded-2xl p-3.5 transition-all duration-200 shadow-lg shadow-black/20"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#dfb15b]/10 border border-[#dfb15b]/30 flex items-center justify-center shrink-0 text-[#dfb15b]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-left overflow-hidden">
              <div className="flex items-center gap-2 mb-0.5">
                {getCategoryBadge(selectedChant.category)}
                <span className="text-xs text-[#9fb8b5]">Danh hiệu đang niệm</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#fbf6e9] truncate font-serif-sacred tracking-wide">
                {selectedChant.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-[#dfb15b] hidden sm:inline">Đổi danh hiệu</span>
            <div className={`p-1.5 rounded-lg bg-[#dfb15b]/10 text-[#dfb15b] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {selectedChant.description && (
          <p className="mt-2 text-[12px] text-[#8ea8a5] line-clamp-1 border-t border-[#dfb15b]/10 pt-1.5 italic">
            "{selectedChant.description}"
          </p>
        )}
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-4 right-4 top-full mt-2 z-50 bg-[#091f1e] border border-[#dfb15b]/30 rounded-2xl p-2 shadow-2xl max-h-80 overflow-y-auto">
            <div className="p-2 border-b border-[#dfb15b]/15 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#dfb15b] uppercase tracking-wider">
                Chọn danh hiệu Phật, Bồ Tát
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  onOpenAddModal();
                }}
                className="flex items-center gap-1 text-xs text-[#dfb15b] hover:text-[#faeed1] px-2 py-1 rounded bg-[#dfb15b]/15 hover:bg-[#dfb15b]/25 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm mới</span>
              </button>
            </div>

            <div className="space-y-1.5 mt-2">
              {chants.map((chant) => {
                const isSelected = chant.id === selectedChant.id;
                return (
                  <div
                    key={chant.id}
                    onClick={() => {
                      if (isSessionActive && !isSelected) {
                        const confirmSwitch = window.confirm(
                          'Bạn đang trong phiên niệm. Đổi danh hiệu sẽ áp dụng cho các lần niệm tiếp theo. Tiếp tục?'
                        );
                        if (!confirmSwitch) return;
                      }
                      onSelectChant(chant);
                      setIsOpen(false);
                    }}
                    className={`group flex items-center justify-between p-2.5 rounded-xl transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#dfb15b]/20 border border-[#dfb15b]/50 text-[#fff7df]'
                        : 'hover:bg-[#123634] text-[#cfdcda]'
                    }`}
                  >
                    <div className="flex flex-col text-left">
                      <div className="flex items-center gap-2">
                        {getCategoryBadge(chant.category)}
                        <span className="text-sm font-semibold tracking-wide">
                          {chant.title}
                        </span>
                      </div>
                      {chant.description && (
                        <span className="text-[11px] text-[#8ea8a5] line-clamp-1 mt-0.5">
                          {chant.description}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isSelected && (
                        <span className="text-xs font-medium text-[#dfb15b] bg-[#dfb15b]/10 px-2 py-0.5 rounded-full border border-[#dfb15b]/30">
                          Đang chọn
                        </span>
                      )}
                      {chant.isCustom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteCustomChant(chant.id);
                          }}
                          className="p-1 rounded text-red-400 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition"
                          title="Xóa danh hiệu tự thêm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => {
                setIsOpen(false);
                onOpenAddModal();
              }}
              className="w-full mt-2 p-2.5 rounded-xl border border-dashed border-[#dfb15b]/30 text-[#dfb15b] text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-[#dfb15b]/10 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Tự thêm danh hiệu Phật / Bồ Tát khác</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
