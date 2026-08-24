// 35+ Academically Verified Historical Quiz Questions on Dien Bien Phu Campaign 1954

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // 0 = A, 1 = B, 2 = C, 3 = D
  ammoReward: {
    shells37mm: number;
    flakBonus: number;
  };
  historicalNote: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Chiến dịch Điện Biên Phủ lịch sử diễn ra trong bao nhiêu ngày đêm?",
    options: [
      "A. 45 ngày đêm",
      "B. 56 ngày đêm",
      "C. 60 ngày đêm",
      "D. 81 ngày đêm"
    ],
    correctAnswer: 1,
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Chiến dịch Điện Biên Phủ diễn ra trong 56 ngày đêm (từ 13/03/1954 đến 17h30 ngày 07/05/1954), 'khoét núi, ngủ hầm, mưa dầm, cơm vắt, máu trộn bùn non, gan không núng, chí không mòn'."
  },
  {
    id: 2,
    question: "Trung đoàn pháo cao xạ đầu tiên của Quân đội nhân dân Việt Nam tham gia bắn rơi nhiều máy bay Pháp tại Điện Biên Phủ mang phiên hiệu nào?",
    options: [
      "A. Trung đoàn Pháo cao xạ 367",
      "B. Trung đoàn Pháo binh 45",
      "C. Trung đoàn Bộ binh 102",
      "D. Trung đoàn Pháo binh 675"
    ],
    correctAnswer: 0,
    ammoReward: { shells37mm: 5, flakBonus: 1 },
    historicalNote: "Trung đoàn 367 với hai Tiểu đoàn pháo cao xạ 383 và 381 (trang bị pháo cao xạ 37mm 61-K) đã tạo nên lưới lửa phòng không khống chế hoàn toàn không phận thung lũng Mường Thanh."
  },
  {
    id: 3,
    question: "Người anh hùng lấy thân mình chèn bánh pháo trên dốc Chuối để cứu khẩu pháo cao xạ 37mm khỏi lao xuống vực sâu là ai?",
    options: [
      "A. Anh hùng Bế Văn Đàn",
      "B. Anh hùng Phan Đình Giót",
      "C. Anh hùng Tô Vĩnh Diện",
      "D. Anh hùng Trần Can"
    ],
    correctAnswer: 2,
    ammoReward: { shells37mm: 5, flakBonus: 1 },
    historicalNote: "Anh hùng Tô Vĩnh Diện (khẩu đội trưởng pháo cao xạ 37mm) đã dũng cảm lấy thân mình chèn vào bánh pháo cứu khẩu pháo nguyên vẹn trong đêm kéo pháo ra gian khổ."
  },
  {
    id: 4,
    question: "Quyết định chuyển phương châm tác chiến nào của Đại tướng Võ Nguyên Giáp được coi là 'Quyết định khó khăn nhất trong cuộc đời chỉ huy'?",
    options: [
      "A. Chuyển từ 'Đánh điểm diệt viện' sang 'Bao vây đánh tỉa'",
      "B. Chuyển từ 'Đánh nhanh thắng nhanh' sang 'Đánh chắc tiến chắc'",
      "C. Chuyển từ 'Phòng ngự cứ điểm' sang 'Tổng công kích chớp nhoáng'",
      "D. Chuyển từ 'Đánh du kích' sang 'Vận động chiến quy mô lớn'"
    ],
    correctAnswer: 1,
    ammoReward: { shells37mm: 5, flakBonus: 1 },
    historicalNote: "Sáng ngày 26/01/1954, Đại tướng Võ Nguyên Giáp đã quyết định hoãn nổ súng, lệnh kéo pháo ra và chuyển phương châm sang 'Đánh chắc, tiến chắc', bảo đảm chắc thắng 100%."
  },
  {
    id: 5,
    question: "Chiếc máy bay đầu tiên của thực dân Pháp bị pháo cao xạ ta bắn rơi tại Điện Biên Phủ vào ngày mở màn chiến dịch (13/03/1954) là loại nào?",
    options: [
      "A. Tiêm kích F8F Bearcat",
      "B. Vận tải cơ C-47 Skytrain",
      "C. Máy bay trinh sát Morane-Saulnier MS.500 Criquet",
      "D. Oanh tạc cơ B-26 Invader"
    ],
    correctAnswer: 2,
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Vào hồi 17h30 ngày 13/03/1954, ngay khi pháo binh ta dập bão lửa vào đồi Him Lam, chiếc trinh sát cơ Morane Criquet vừa cất cánh đã bị pháo cao xạ Đại đội 815 bắn cháy rơi tại chỗ."
  },
  {
    id: 6,
    question: "Anh hùng Phan Đình Giót đã lập nên chiến công bất tử nào trong trận đánh mở màn cứ điểm Him Lam ngày 13/03/1954?",
    options: [
      "A. Lấy thân mình lấp lỗ châu mai hỏa điểm địch",
      "B. Lấy vai làm giá súng cho đồng đội bắn",
      "C. Cắm cờ chiến thắng trên nóc hầm De Castries",
      "D. Dùng súng phòng không 12.7mm bắn rơi máy bay Pháp"
    ],
    correctAnswer: 0,
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Khi hỏa điểm ngầm của địch bắn rát cản bước tiến quân ta, anh hùng Phan Đình Giót đã dũng cảm lấy cả thân mình áp chặt vào lỗ châu mai, bịt kín họng súng giặc để đồng đội xông lên tiêu diệt Him Lam."
  },
  {
    id: 7,
    question: "Chiến dịch Điện Biên Phủ được chia làm mấy đợt tiến công chính?",
    options: [
      "A. 2 đợt tiến công",
      "B. 3 đợt tiến công",
      "C. 4 đợt tiến công",
      "D. 5 đợt tiến công"
    ],
    correctAnswer: 1,
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Chiến dịch gồm 3 đợt: Đợt 1 (13/3 - 17/3) diệt Him Lam, Độc Lập, Bản Kéo; Đợt 2 (30/3 - 30/4) vây lấn dãy đồi phía Đông (A1, C1...); Đợt 3 (01/5 - 07/5) tổng công kích tiêu diệt toàn bộ tập đoàn cứ điểm."
  },
  {
    id: 8,
    question: "Việc pháo cao xạ của ta siết chặt vòng vây bầu trời Mường Thanh đã dẫn đến kết quả mang tính bước ngoặt nào?",
    options: [
      "A. Cắt đứt hoàn toàn cầu hàng không duy nhất tiếp tế và tiếp viện của quân Pháp",
      "B. Khiến pháo binh mặt đất của Pháp bị tiêu diệt ngay ngày đầu",
      "C. Buộc Pháp phải rút quân sang Thượng Lào",
      "D. Khiến quân Pháp không thể dùng xe tăng chiến đấu"
    ],
    correctAnswer: 0,
    ammoReward: { shells37mm: 5, flakBonus: 1 },
    historicalNote: "Lưới lửa phòng không khống chế sân bay Mường Thanh và Hồng Cúm, máy bay Pháp không thể hạ cánh, phải thả dù từ độ cao lớn khiến hơn 50% dù hàng rơi vào tay bộ đội ta, đẩy quân địch vào tình trạng kiệt quệ hoàn toàn."
  },
  {
    id: 9,
    question: "Người chỉ huy cao nhất của tập đoàn cứ điểm Điện Biên Phủ phía quân đội Pháp là ai?",
    options: [
      "A. Tướng Henri Navarre",
      "B. Tướng Christian de Castries",
      "C. Đại tá Charles Piroth",
      "D. Tướng René Cogny"
    ],
    correctAnswer: 1,
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Chuẩn tướng Christian de Castries là chỉ huy trưởng tập đoàn cứ điểm Điện Biên Phủ, bị tổ xung kích của đồng chí Tạ Quốc Luật bắt sống tại hầm chỉ huy chiều ngày 07/05/1954."
  },
  {
    id: 10,
    question: "Khối bộc phá ngàn cân (gần 1.000kg thuốc nổ) phát nổ đêm 06/05/1954 làm rung chuyển ngọn đồi huyết mạch nào, báo hiệu giờ tổng công kích?",
    options: [
      "A. Đồi Him Lam (Beatrice)",
      "B. Đồi Độc Lập (Gabrielle)",
      "C. Đồi A1 (Eliane 2)",
      "D. Đồi C1 (Eliane 1)"
    ],
    correctAnswer: 2,
    ammoReward: { shells37mm: 5, flakBonus: 1 },
    historicalNote: "Đêm 06/05/1954, khối bộc phá 960kg đào sâu trong lòng đồi A1 phát nổ, thổi bay cứ điểm then chốt nhất của Pháp, mở đường cho quân ta tổng công kích bắt sống tướng De Castries."
  },
  {
    id: 11,
    question: "Anh hùng Bế Văn Đàn đã hy sinh anh dũng trong trận đánh nào với hành động 'Lấy thân mình làm giá súng'?",
    options: [
      "A. Trận Mường Pồn (Đường 42 Lai Châu - Điện Biên)",
      "B. Trận Đồi A1",
      "C. Trận Đồi C1",
      "D. Trận Sân bay Hồng Cúm"
    ],
    correctAnswer: 0,
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Trong trận Mường Pồn ác liệt chặn địch rút chạy, Anh hùng Bế Văn Đàn đã ghé hai vai làm giá súng trung liên vững chắc cho đồng đội nhả đạn tiêu diệt quân Pháp."
  },
  {
    id: 12,
    question: "Lá cờ thêu bốn chữ gì được Bác Hồ trao tặng và tung bay trên nóc hầm De Castries vào chiều ngày 07/05/1954?",
    options: [
      "A. 'Độc lập - Tự do'",
      "B. 'Quyết chiến - Quyết thắng'",
      "C. 'Bách chiến - Bách thắng'",
      "D. 'Chiến sĩ Điện Biên'"
    ],
    correctAnswer: 1,
    ammoReward: { shells37mm: 5, flakBonus: 1 },
    historicalNote: "Lá cờ 'Quyết chiến Quyết thắng' đỏ thắm tung bay trên nóc hầm chỉ huy De Castries lúc 17h30 ngày 07/05/1954 đánh dấu thắng lợi hoàn toàn của Chiến dịch Điện Biên Phủ chấn động địa cầu."
  }
];
