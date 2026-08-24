import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ScrollText,
  X,
  Crosshair,
  HelpCircle,
  Clock,
  Award,
  Lock,
  Flame,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-[#1c2419] border-2 border-[#d4af37] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col text-[#f7f6f2]"
        >
          {/* Header */}
          <div className="bg-[#2d3b27] border-b border-[#44563a] p-5 md:p-6 flex justify-between items-center shrink-0">
            <h2 className="text-xl md:text-2xl font-military font-bold flex items-center gap-3 text-[#ffd700]">
              <ScrollText className="w-6 h-6 text-[#ffd700]" />
              LUẬT CHƠI ĐẤU TRƯỜNG PHÒNG KHÔNG 1954
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-black/30 hover:bg-black/50 text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-sm text-gray-200 font-military custom-scrollbar">
            {/* Slogan banner */}
            <div className="bg-[#8b0000]/30 border-l-4 border-[#8b0000] p-4 rounded-r-2xl">
              <p className="text-white leading-relaxed italic text-sm md:text-base font-medium">
                "Khống chế hoàn toàn bầu trời Mường Thanh, cắt đứt cầu hàng không tiếp tế của thực dân Pháp và ghi nhớ những mốc son lịch sử chấn động địa cầu!"
              </p>
            </div>

            {/* 3 Core Phases */}
            <section className="space-y-3">
              <h3 className="font-bold text-base md:text-lg text-white flex items-center gap-2">
                <Crosshair className="w-5 h-5 text-[#ffd700]" /> 3 Giai Đoạn Vận Hành Chính
              </h3>

              <div className="space-y-3">
                {/* Phase 1 */}
                <div className="p-4 rounded-2xl bg-black/35 border border-white/10 space-y-1.5">
                  <div className="font-bold text-amber-400 flex items-center gap-2 text-sm">
                    <HelpCircle className="w-4 h-4" /> 1. Giai Đoạn Nạp Đạn (Khảo Sát Lịch Sử)
                  </div>
                  <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                    Người chơi giải các câu đố trắc nghiệm lịch sử Chiến dịch Điện Biên Phủ 1954. Trả lời đúng nhận <strong>4 - 5 viên đạn pháo 37mm</strong> và <strong>đạn nổ phân mảnh Flak</strong>. Có thưởng Combo khi trả lời đúng liên tiếp.
                  </p>
                </div>

                {/* Phase 2 */}
                <div className="p-4 rounded-2xl bg-black/35 border border-white/10 space-y-1.5">
                  <div className="font-bold text-red-400 flex items-center gap-2 text-sm">
                    <Flame className="w-4 h-4" /> 2. Giai Đoạn Bắn Máy Bay (Tốc Độ Tăng Dần)
                  </div>
                  <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                    Điều khiển nòng pháo 37mm ngắm bắn các loại máy bay địch (F8F Bearcat, Hellcat, C-47, B-26...). <strong>Tốc độ bay và tần suất xuất hiện của máy bay sẽ ngày càng nhanh hơn theo thời gian</strong>, đòi hỏi khả năng ngắm đón hướng bay chính xác.
                  </p>
                </div>

                {/* Phase 3 */}
                <div className="p-4 rounded-2xl bg-black/35 border border-white/10 space-y-1.5">
                  <div className="font-bold text-emerald-400 flex items-center gap-2 text-sm">
                    <Lock className="w-4 h-4" /> 3. Giai Đoạn Đọc Hồ Sơ Chiến Tích (Bắt Buộc - Không Skip)
                  </div>
                  <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                    Khi bắn hạ 1 máy bay, màn hình sẽ hiển thị chi tiết tên hiệu, giờ và ngày bị bắn rơi trong 56 ngày đêm chiến dịch 1954. <strong>Đồng hồ đếm ngược 6 giây bắt buộc, tuyệt đối không có nút Bỏ qua (Skip)</strong> để người chơi buộc phải ghi nhớ kiến thức lịch sử.
                  </p>
                </div>
              </div>
            </section>

            {/* Scoring System */}
            <section className="space-y-3">
              <h3 className="font-bold text-base md:text-lg text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-[#ffd700]" /> Cơ Chế Tính Điểm & Vinh Danh
              </h3>

              <div className="p-4 rounded-2xl bg-black/35 border border-[#d4af37]/30 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Điểm cộng dồn theo độ khó của từng loại máy bay và số câu trắc nghiệm đúng.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Xếp loại danh hiệu chiến sĩ: <em>Anh hùng Tô Vĩnh Diện, Dũng sĩ Diệt máy bay, Chiến sĩ Thi đua...</em></span>
                </div>
                <div className="flex items-start gap-2 sm:col-span-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Trong chế độ Đấu trường lớp học, điểm số được đồng bộ Realtime lên máy chiếu và kết thúc bằng Bục vinh danh Top 3 Podium.</span>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-[#44563a] bg-black/40 flex justify-end shrink-0">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-[#8b0000] to-[#b22222] hover:from-[#a00000] hover:to-[#c41e3a] text-white px-8 py-3 rounded-xl font-military font-bold text-sm shadow-lg shadow-red-950/60 cursor-pointer active:scale-95 transition-all"
            >
              ĐÃ HIỂU LUẬT CHƠI · SẴN SÀNG!
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
