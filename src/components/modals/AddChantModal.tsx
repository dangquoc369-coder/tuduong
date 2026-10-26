import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { ChantItem } from '../../types';
import { normalizeVietnamese } from '../../services/chantiEngine';

interface AddChantModalProps {
  onAddChant: (newChant: ChantItem) => void;
  onClose: () => void;
}

export const AddChantModal: React.FC<AddChantModalProps> = ({
  onAddChant,
  onClose
}) => {
  const [title, setTitle] = useState('');
  const [shortTitle, setShortTitle] = useState('');
  const [category, setCategory] = useState<ChantItem['category']>('custom');
  const [description, setDescription] = useState('');
  const [target, setTarget] = useState('108');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalShort = shortTitle.trim() || title.trim().replace(/^nam\s+mô\s+/i, '');
    const norm = normalizeVietnamese(title);
    const normShort = normalizeVietnamese(finalShort);

    // Auto-generate phonetic keywords
    const keywords = Array.from(new Set([
      norm,
      normShort,
      ...norm.split(' ').filter(w => w.length > 1),
      ...normShort.split(' ').filter(w => w.length > 1)
    ]));

    const newChant: ChantItem = {
      id: 'custom-' + Date.now(),
      title: title.trim(),
      shortTitle: finalShort,
      category,
      description: description.trim() || 'Danh hiệu tu tập tự thiết lập.',
      defaultTarget: parseInt(target, 10) || 108,
      keywords,
      isCustom: true
    };

    onAddChant(newChant);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#092221] border border-[#dfb15b]/40 rounded-2xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#dfb15b]/20">
          <div className="flex items-center gap-2 text-[#faeed1] font-bold">
            <Sparkles className="w-4 h-4 text-[#dfb15b]" />
            <span>Thêm Danh Hiệu Muốn Niệm</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#9fb8b5] hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs text-[#a2beba] mb-1 font-medium">
              Tên câu niệm đầy đủ <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!shortTitle) {
                  // Suggest short title
                  setShortTitle(e.target.value.replace(/^nam\s+mô\s+/i, ''));
                }
              }}
              placeholder="Ví dụ: Nam mô Văn Thù Sư Lợi Bồ Tát"
              className="w-full bg-[#061514] border border-[#dfb15b]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#faeed1] focus:outline-none focus:border-[#dfb15b]"
            />
          </div>

          <div>
            <label className="block text-xs text-[#a2beba] mb-1 font-medium">
              Tên rút gọn (hiển thị khi đếm)
            </label>
            <input
              type="text"
              value={shortTitle}
              onChange={(e) => setShortTitle(e.target.value)}
              placeholder="Ví dụ: Văn Thù Bồ Tát"
              className="w-full bg-[#061514] border border-[#dfb15b]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#faeed1] focus:outline-none focus:border-[#dfb15b]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#a2beba] mb-1 font-medium">
                Phân loại
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#061514] border border-[#dfb15b]/30 rounded-xl px-3 py-2 text-xs text-[#faeed1] focus:outline-none focus:border-[#dfb15b]"
              >
                <option value="phat">Chư Phật</option>
                <option value="bo-tat">Bồ Tát</option>
                <option value="chu">Chân Ngôn / Chú</option>
                <option value="custom">Tùy Chọn</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-[#a2beba] mb-1 font-medium">
                Mục tiêu mặc định
              </label>
              <input
                type="number"
                min="1"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full bg-[#061514] border border-[#dfb15b]/30 rounded-xl px-3 py-2 text-xs text-[#faeed1] focus:outline-none focus:border-[#dfb15b]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#a2beba] mb-1 font-medium">
              Ý nghĩa hoặc lời nguyện (tùy chọn)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ví dụ: Cầu khai mở trí tuệ quang minh, học hành thông suốt..."
              className="w-full bg-[#061514] border border-[#dfb15b]/30 rounded-xl px-3.5 py-2 text-xs text-[#faeed1] focus:outline-none focus:border-[#dfb15b] resize-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-[#061817] border border-[#dfb15b]/15 text-[11px] text-[#8ea8a5] leading-relaxed">
            🌿 <strong>Tự động nhận diện giọng nói:</strong> Hệ thống AI của Tu Dưỡng sẽ tự động phân tích và tạo bộ nhận diện âm vị cho câu niệm này khi bạn dùng Micro.
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
              <Plus className="w-4 h-4" />
              <span>Thêm danh hiệu</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
