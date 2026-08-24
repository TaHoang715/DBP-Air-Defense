# 🎖️ Điện Biên Phủ - Pháo Cao Xạ Phòng Không (DBP Air Defense)

> **Game giáo dục lịch sử tương tác 3 giai đoạn** tái hiện cuộc chiến khống chế bầu trời Mường Thanh, cắt đứt cầu hàng không tiếp tế của thực dân Pháp trong Chiến dịch Điện Biên Phủ lịch sử (13/03/1954 – 07/05/1954).

[![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF.svg)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC.svg)](https://tailwindcss.com/)
[![Canvas 2D 60FPS](https://img.shields.io/badge/Canvas-60FPS-orange.svg)]()
[![Web Audio API](https://img.shields.io/badge/Web_Audio-Procedural_SFX-green.svg)]()

---

## 🎮 Cơ Chế Vận Hành & Luồng Gameplay (Gameplay Flow)

Hệ thống được thiết kế chuẩn mực theo 3 giai đoạn cốt lõi:

```
[ Bắt Đầu Trận Đánh (3 Phút) ]
             │
             ▼
[ Giai Đoạn 1: Nạp Đạn Qua Khảo Sát Lịch Sử ]
   • Trả lời trắc nghiệm lịch sử Chiến dịch Điện Biên Phủ 1954
   • Mỗi câu đúng nhận +4/+5 đạn pháo 37mm & đạn nổ Flak
             │
             ▼
[ Giai Đoạn 2: Trận Địa Pháo Cao Xạ Bắn Máy Bay ]
   • Điều khiển nòng pháo cao xạ 37mm xoay theo chuột & kính ngắm quang học
   • Bắn các loại máy bay: Bearcat F8F, Hellcat F6F, Dakota C-47, Invader B-26, C-119...
   • ⚡ Tốc độ máy bay tăng dần theo thời gian (Velocity Curve)
             │
             ▼
[ Giai Đoạn 3: Đọc Bảng Hồ Sơ Chiến Tích Bắt Buộc (STRICT NO-SKIP) ]
   • Máy bay rơi xuống ➔ Hiển thị bảng tư liệu chiến công chi tiết
   • Đếm ngược 5-7 giây BẮT BUỘC để người học ghi nhớ kiến thức
   • 🚫 TUYỆT ĐỐI KHÔNG CÓ NÚT BỎ QUA (SKIP)
             │
             ▼
[ Giai Đoạn 4: Tổng Kết & Ghi Danh Bảng Vàng ]
   • Vinh danh danh hiệu: Anh hùng Tô Vĩnh Diện, Dũng sĩ Diệt máy bay...
   • Bảng xếp hạng Realtime lưu thành tích cá nhân
```

---

## ✈️ Danh Mục Máy Bay Lịch Sử & Sự Kiện Bắn Rơi (1954)

| Tên Máy Bay | Phiên Hiệu / Mã | Đơn Vị Quân Pháp | Thời Điểm Bị Hạ | Đơn Vị Lập Công |
| :--- | :--- | :--- | :--- | :--- |
| **Morane MS.500 Criquet** | "Cò Lửa" Trinh sát | Biệt đội GAOA 4 | 17:30 - 13/03/1954 | Đại đội 815, Tiểu đoàn 383 (Mở màn Him Lam) |
| **Grumman F8F Bearcat** | Tiêm kích No.122 | Không đoàn GC 1/22 Saintonge | 09:15 - 15/03/1954 | Đại đội 816, Tiểu đoàn 383, Trung đoàn 367 |
| **Douglas C-47 Dakota** | Vận tải tiếp tế dù | Không đoàn GT 2/62 Franche-Comté | 11:45 - 17/03/1954 | Tiểu đoàn 381, Trung đoàn Pháo cao xạ 367 |
| **Grumman F6F Hellcat** | Tiêm kích hạm đội | Hải đội 11F (Tàu Arromanches) | 14:20 - 22/03/1954 | Đại đội pháo cao xạ 828 |
| **Douglas B-26 Invader** | Oanh tạc cơ hạng trung | Không đoàn GB 1/19 Gascogne | 15:10 - 27/03/1954 | Tiểu đoàn 382, Trung đoàn 367 |
| **Fairchild C-119** | "Toa Xe Bay" 2 thân | Biệt đội Vận tải Hỗn hợp CAT | 10:05 - 04/04/1954 | Khẩu đội 3, Đại đội 817, Tiểu đoàn 383 |
| **Curtiss SB2C Helldiver**| Cường kích bổ nhào | Hải đội Không quân 3F | 16:40 - 24/04/1954 | Đại đội 824, Tiểu đoàn 382 (Đồi A1) |
| **Vought AU-1 Corsair** | Cường kích tầm gần | Hải đội 14F Hải quân Pháp | 13:55 - 01/05/1954 | Đại đội 815, Tiểu đoàn 383 (Tổng công kích) |

---

## 🛠️ Cài Đặt & Chạy Dự Án

### Yêu cầu:
- Node.js >= 18.0
- npm hoặc yarn / pnpm

### Các bước khởi chạy:
```bash
# 1. Cài đặt thư viện dependencies
npm install

# 2. Khởi chạy môi trường phát triển (Local Dev Server)
npm run dev

# 3. Đóng gói bản Production
npm run build
```

---

## 🎨 Điểm Nhấn Công Nghệ

- **Canvas 2D Particle Engine**: Hoạt họa 60 FPS mượt mà, vệt đạn sáng (tracer fire), khói thuốc súng, máy bay bốc cháy xoay tròn, hiệu ứng rung màn hình (Screen Shake).
- **Web Audio API Procedural Synthesizer**: Tự tổng hợp âm thanh pháo 37mm, còi báo động, tiếng máy bay bổ nhào gầm rú, tiếng nổ dội bom chân thực không cần load file âm thanh cồng kềnh.
- **Academic Integrity**: 100% dữ liệu lịch sử đối chiếu Giáo trình Lịch sử Đảng và Văn kiện Chiến dịch Điện Biên Phủ Bộ Tổng Tham mưu Quân đội Nhân dân Việt Nam.
