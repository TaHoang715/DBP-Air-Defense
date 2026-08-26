// 50 Official Academically Standardized Historical Quiz Questions
// Lịch sử Đảng Cộng sản Việt Nam & Chiến dịch Điện Biên Phủ trên không 1972

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
    question: "Chiến dịch Điện Biên Phủ trên không năm 1972 diễn ra trong bối cảnh cuộc chiến tranh phá hoại miền Bắc lần thứ mấy của đế quốc Mỹ?",
    options: [
      "Cuộc chiến tranh phá hoại lần thứ nhất",
      "Cuộc chiến tranh phá hoại lần thứ hai",
      "Cuộc chiến tranh phá hoại lần thứ ba",
      "Cuộc chiến tranh phá hoại lần thứ tư"
    ],
    correctAnswer: 1, // B
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Từ tháng 4-1972, để ngăn chặn cuộc tiến công chiến lược của quân dân ta ở miền Nam, đế quốc Mỹ đã cho máy bay, tàu chiến tiến hành cuộc chiến tranh phá hoại miền Bắc lần thứ hai hết sức ác liệt."
  },
  {
    id: 2,
    question: "Mỹ gọi cuộc tập kích chiến lược bằng máy bay B-52 vào Hà Nội và Hải Phòng cuối năm 1972 bằng tên chiến dịch nào?",
    options: [
      "Chiến dịch Linebacker I",
      "Chiến dịch Rolling Thunder",
      "Chiến dịch Linebacker II",
      "Chiến dịch Junction City"
    ],
    correctAnswer: 2, // C
    ammoReward: { shells37mm: 4, flakBonus: 1 },
    historicalNote: "Đế quốc Mỹ thực hiện cuộc rải thảm bom bằng pháo đài bay B.52 trong 12 ngày đêm ở Hà Nội, Hải Phòng và một số địa phương khác với tên gọi là cuộc hành quân Linebacker II."
  },
  {
    id: 3,
    question: "Cuộc rải thảm bom bằng pháo đài bay B-52 của Mỹ vào Hà Nội, Hải Phòng cuối năm 1972 diễn ra trong thời gian bao nhiêu ngày đêm?",
    options: [
      "Kéo dài trong 10 ngày đêm",
      "Kéo dài trong 11 ngày đêm",
      "Kéo dài trong 12 ngày đêm",
      "Kéo dài trong 15 ngày đêm"
    ],
    correctAnswer: 2, // C
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Đế quốc Mỹ đã cho máy bay, tàu chiến tiến hành cuộc chiến tranh phá hoại miền Bắc lần thứ hai hết sức ác liệt, nhất là cuộc rải thảm bom bằng pháo đài bay B.52 trong 12 ngày đêm ở Hà Nội, Hải Phòng."
  },
  {
    id: 4,
    question: "Cuộc tập kích chiến lược bằng pháo đài bay B-52 của Mỹ vào Hà Nội và Hải Phòng diễn ra trong khoảng thời gian nào?",
    options: [
      "Từ ngày 18 đến ngày 30 tháng 12 năm 1972",
      "Từ ngày 10 đến ngày 22 tháng 12 năm 1972",
      "Từ ngày 20 đến ngày 31 tháng 12 năm 1972",
      "Từ ngày 15 đến ngày 27 tháng 12 năm 1972"
    ],
    correctAnswer: 0, // A
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Cuộc tập kích chiến lược bằng máy bay B-52 của Mỹ vào Hà Nội và Hải Phòng diễn ra trong 12 ngày đêm cuối năm 1972, cụ thể từ ngày 18 đến 30-12-1972."
  },
  {
    id: 5,
    question: "Loại máy bay nào được đế quốc Mỹ sử dụng làm lực lượng nòng cốt để tiến hành cuộc rải thảm bom hủy diệt vào Hà Nội và Hải Phòng cuối năm 1972?",
    options: [
      "Máy bay tiêm kích F-111A",
      "Máy bay ném bom chiến lược B-52",
      "Máy bay trinh sát không người lái",
      "Máy bay phản lực chiến đấu F-4"
    ],
    correctAnswer: 1, // B
    ammoReward: { shells37mm: 5, flakBonus: 1 },
    historicalNote: "Đế quốc Mỹ đã huy động không quân tiến hành cuộc rải thảm bom hủy diệt bằng pháo đài bay B.52 vào Hà Nội, Hải Phòng cuối năm 1972."
  },
  {
    id: 6,
    question: "Trong 12 ngày đêm cuối năm 1972, quân và dân miền Bắc đã bắn rơi tổng cộng bao nhiêu máy bay các loại của đế quốc Mỹ?",
    options: [
      "Bắn rơi tổng cộng 74 máy bay",
      "Bắn rơi tổng cộng 84 máy bay",
      "Bắn rơi tổng cộng 94 máy bay",
      "Bắn rơi tổng cộng 64 máy bay"
    ],
    correctAnswer: 1, // B
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Trong 12 ngày đêm cuối năm 1972, đánh trả cuộc tập kích chiến lược bằng máy bay B-52 của Mỹ vào Hà Nội và Hải Phòng, quân và dân miền Bắc đã bắn rơi 84 máy bay."
  },
  {
    id: 7,
    question: "Trong số các máy bay Mỹ bị bắn rơi trong 12 ngày đêm cuối năm 1972, có bao nhiêu chiếc là pháo đài bay B-52?",
    options: [
      "Có tổng cộng 24 máy bay B-52",
      "Có tổng cộng 34 máy bay B-52",
      "Có tổng cộng 44 máy bay B-52",
      "Có tổng cộng 14 máy bay B-52"
    ],
    correctAnswer: 1, // B
    ammoReward: { shells37mm: 5, flakBonus: 1 },
    historicalNote: "Trong 12 ngày đêm cuối năm 1972, quân và dân miền Bắc đã bắn rơi 84 máy bay, trong đó có 34 máy bay B52."
  },
  {
    id: 8,
    question: "Loại máy bay nào của Mỹ được giáo trình ghi nhận có đặc điểm cánh cụp, cánh xòe bị quân dân miền Bắc bắn rơi trong 12 ngày đêm cuối năm 1972?",
    options: [
      "Máy bay ném bom chiến thuật F-105",
      "Máy bay tiêm kích cánh cụp cánh xòe F-111A",
      "Máy bay phản lực tiêm kích bom F-4",
      "Máy bay trinh sát tầm cao siêu thanh SR-71"
    ],
    correctAnswer: 1, // B
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Trong 12 ngày đêm cuối năm 1972, quân và dân miền Bắc đã bắn rơi 34 máy bay B52 và 5 máy bay F.111A (cánh cụp, cánh xòe)."
  },
  {
    id: 9,
    question: "Trong 12 ngày đêm cuối năm 1972, quân dân miền Bắc đã bắn rơi bao nhiêu chiếc máy bay hiện đại F-111A của đế quốc Mỹ?",
    options: [
      "Bắn rơi 3 chiếc máy bay F-111A",
      "Bắn rơi 4 chiếc máy bay F-111A",
      "Bắn rơi 5 chiếc máy bay F-111A",
      "Bắn rơi 6 chiếc máy bay F-111A"
    ],
    correctAnswer: 2, // C
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Trong 12 ngày đêm cuối năm 1972, quân dân miền Bắc đã bắn rơi 34 máy bay B52 và 5 máy bay F.111A."
  },
  {
    id: 10,
    question: "Quân và dân miền Bắc đã bắt sống được bao nhiêu giặc lái Mỹ trong 12 ngày đêm chống cuộc tập kích chiến lược bằng máy bay B-52?",
    options: [
      "Bắt sống được tổng cộng 33 giặc lái",
      "Bắt sống được tổng cộng 43 giặc lái",
      "Bắt sống được tổng cộng 53 giặc lái",
      "Bắt sống được tổng cộng 23 giặc lái"
    ],
    correctAnswer: 1, // B
    ammoReward: { shells37mm: 5, flakBonus: 1 },
    historicalNote: "Trong 12 ngày đêm đánh trả cuộc tập kích bằng máy bay B52 vào Hà Nội và Hải Phòng, quân và dân miền Bắc đã bắn rơi 84 máy bay và bắt sống 43 giặc lái."
  },
  {
    id: 11,
    question: "Thất bại nặng nề trong 12 ngày đêm cuối năm 1972 đã buộc Chính phủ Mỹ phải tuyên bố ngừng mọi hoạt động phá hoại miền Bắc vào ngày tháng năm nào?",
    options: [
      "Ngày 15 tháng 1 năm 1973",
      "Ngày 20 tháng 1 năm 1973",
      "Ngày 27 tháng 1 năm 1973",
      "Ngày 10 tháng 1 năm 1973"
    ],
    correctAnswer: 0, // A
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Ngày 15-1-1973, Chính phủ Mỹ phải tuyên bố ngừng mọi hoạt động phá hoại miền Bắc và trở lại bàn đàm phán ở Paris."
  },
  {
    id: 12,
    question: "Thắng lợi quyết định của trận Điện Biên Phủ trên không cuối năm 1972 đã trực tiếp buộc Chính phủ Mỹ phải thực hiện hành động ngoại giao nào tiếp theo?",
    options: [
      "Ký kết Tuyên bố chung của Hội nghị Geneva về Đông Dương",
      "Trở lại bàn đàm phán ở Paris để ký kết Hiệp định hòa bình",
      "Bình thường hóa quan hệ ngoại giao với Việt Nam Dân chủ Cộng hòa",
      "Rút toàn bộ phái đoàn ngoại giao của Mỹ về nước vô điều kiện"
    ],
    correctAnswer: 1, // B
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Thất bại trong trận Điện Biên Phủ trên không đã buộc Chính phủ Mỹ phải tuyên bố ngừng mọi hoạt động phá hoại miền Bắc và trở lại bàn đàm phán ở Paris."
  },
  {
    id: 13,
    question: "Trong hai cuộc chiến tranh phá hoại miền Bắc bằng không quân và hải quân của Mỹ, quân dân miền Bắc đã bắn rơi tổng cộng bao nhiêu máy bay Mỹ?",
    options: [
      "Bắn rơi tổng cộng 3.181 máy bay",
      "Bắn rơi tổng cộng 4.181 máy bay",
      "Bắn rơi tổng cộng 2.181 máy bay",
      "Bắn rơi tổng cộng 5.181 máy bay"
    ],
    correctAnswer: 1, // B
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Qua hai lần chống chiến tranh phá hoại, quân dân miền Bắc đã bắn rơi 4.181 máy bay trong đó có nhiều B.52, bắn cháy 271 tàu chiến của Mỹ."
  },
  {
    id: 14,
    question: "Trong hai cuộc chiến tranh phá hoại miền Bắc, quân và dân ta đã bắn cháy bao nhiêu tàu chiến của đế quốc Mỹ?",
    options: [
      "Bắn cháy tổng cộng 171 tàu chiến Mỹ",
      "Bắn cháy tổng cộng 271 tàu chiến Mỹ",
      "Bắn cháy tổng cộng 371 tàu chiến Mỹ",
      "Bắn cháy tổng cộng 471 tàu chiến Mỹ"
    ],
    correctAnswer: 1, // B
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Qua hai lần chống chiến tranh phá hoại, quân dân miền Bắc đã bắn rơi 4.181 máy bay và bắn cháy 271 tàu chiến của Mỹ."
  },
  {
    id: 15,
    question: "Lãnh tụ nào đã đưa ra lời dự báo chính xác về việc đế quốc Mỹ chỉ chịu thua sau khi thất bại trên bầu trời Hà Nội?",
    options: [
      "Tổng Bí thư Lê Duẩn",
      "Chủ tịch Hồ Chí Minh",
      "Tổng Bí thư Trường Chinh",
      "Đại tướng Võ Nguyên Giáp"
    ],
    correctAnswer: 1, // B
    ammoReward: { shells37mm: 5, flakBonus: 1 },
    historicalNote: "Chủ tịch Hồ Chí Minh từng dự đoán: 'Ở Việt Nam, Mỹ nhất định thua. Nhưng nó chỉ chịu thua sau khi thua trên bầu trời Hà Nội'."
  },
  {
    id: 16,
    question: "Chiến thắng Điện Biên Phủ trên không năm 1972 đã chứng minh sức mạnh của lực lượng nào giữ vai trò quyết định trong việc đánh bại cuộc tập kích của Mỹ?",
    options: [
      "Lực lượng quân tình nguyện quốc tế",
      "Quân và dân miền Bắc xã hội chủ nghĩa",
      "Quân giải phóng miền Nam Việt Nam",
      "Lực lượng không quân các nước Đông Âu"
    ],
    correctAnswer: 1, // B
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Trung ương Đảng đã phát động quân dân miền Bắc nhanh chóng phát triển cuộc chiến tranh nhân dân chống chiến tranh phá hoại đến đỉnh cao, lập nên trận Điện Biên Phủ trên không oanh liệt."
  },
  {
    id: 17,
    question: "Chiến thắng Điện Biên Phủ trên không cuối năm 1972 có ý nghĩa lịch sử quyết định nào đối với tiến trình cuộc kháng chiến chống Mỹ?",
    options: [
      "Đánh bại hoàn toàn ý chí xâm lược và buộc Mỹ phải ký Hiệp định Paris",
      "Tiêu diệt toàn bộ lực lượng không quân chiến lược của Mỹ trên thế giới",
      "Giải phóng hoàn toàn các tỉnh thành miền Nam ngay trong năm 1972",
      "Buộc chính quyền Sài Gòn đầu hàng cách mạng và bàn giao chính quyền"
    ],
    correctAnswer: 0, // A
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Trận Điện Biên Phủ trên không đã đánh bại hoàn toàn cuộc chiến tranh phá hoại của Mỹ, đè bẹp ý chí xâm lược của chúng, buộc Mỹ phải trở lại bàn đàm phán và ký kết Hiệp định Paris."
  },
  {
    id: 18,
    question: "Sau khi Hiệp định Giơnevơ năm 1954 được ký kết, đất nước ta bị chia cắt làm hai miền ở vĩ tuyến nào?",
    options: [
      "Vĩ tuyến 15 về phía Nam",
      "Vĩ tuyến 17 về phía Nam",
      "Vĩ tuyến 16 về phía Nam",
      "Vĩ tuyến 18 về phía Nam"
    ],
    correctAnswer: 1, // B
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Sau Hiệp định Giơnevơ (7-1954), đất nước bị chia làm hai miền, có chế độ chính trị, xã hội khác nhau: miền Bắc được giải phóng hoàn toàn, miền Nam từ vĩ tuyến 17 về phía Nam do đối phương quản lý."
  },
  {
    id: 19,
    question: "Ngay sau khi Hiệp định Giơnevơ được ký kết, Hội nghị lần thứ 6 Ban Chấp hành Trung ương Đảng (7-1954) đã chỉ rõ kẻ thù chính và trực tiếp của nhân dân Đông Dương là ai?",
    options: [
      "Thực dân Pháp xâm lược",
      "Đế quốc Mỹ xâm lược",
      "Chính quyền tay sai Ngô Đình Diệm",
      "Lực lượng quân phiệt phát xít Nhật"
    ],
    correctAnswer: 1, // B
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Hội nghị lần thứ 6 Ban Chấp hành Trung ương Đảng (7-1954) chỉ rõ: 'Hiện nay đế quốc Mỹ là kẻ thù chính của nhân dân thế giới, và nó đang trở thành kẻ thù chính và trực tiếp của nhân dân Đông Dương'."
  },
  {
    id: 20,
    question: "Tại miền Bắc, người lính thực dân Pháp cuối cùng rút khỏi Hà Nội vào ngày tháng năm nào?",
    options: [
      "Ngày 2 tháng 9 năm 1954",
      "Ngày 10 tháng 10 năm 1954",
      "Ngày 16 tháng 5 năm 1955",
      "Ngày 19 tháng 5 năm 1955"
    ],
    correctAnswer: 1, // B
    ammoReward: { shells37mm: 5, flakBonus: 1 },
    historicalNote: "Thực hiện Hiệp định Giơnevơ, ngày 10-10-1954, người lính Pháp cuối cùng rút khỏi Hà Nội, giải phóng hoàn toàn Thủ đô."
  },
  {
    id: 21,
    question: "Toàn bộ quân đội viễn chinh Pháp và tay sai đã phải rút khỏi miền Bắc nước ta vào ngày tháng năm nào?",
    options: [
      "Ngày 10 tháng 10 năm 1954",
      "Ngày 16 tháng mười năm 1954",
      "Ngày 16 tháng 5 năm 1955",
      "Ngày 21 tháng 7 năm 1954"
    ],
    correctAnswer: 2, // C
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Ngày 16-5-1955, toàn bộ quân đội viễn chinh Pháp và tay sai đã phải rút khỏi miền Bắc theo đúng quy định của Hiệp định."
  },
  {
    id: 22,
    question: "Sự kiện Ngô Đình Diệm sang thăm Mỹ năm 1957 đã đưa ra lời tuyên bố bán nước trắng trợn nào?",
    options: [
      "Biên giới Hoa Kỳ kéo dài đến vĩ tuyến 17",
      "Nước Mỹ sẵn sàng bảo hộ miền Nam Việt Nam",
      "Việt Nam Cộng hòa là một bang của Hoa Kỳ",
      "Vĩ tuyến 17 là ranh giới vĩnh viễn của nước Mỹ"
    ],
    correctAnswer: 0, // A
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Ngày 13-5-1957, Ngô Đình Diệm thăm Mỹ và tuyên bố: 'Biên giới Hoa Kỳ kéo dài đến vĩ tuyến 17', đó là lập trường và hành động bán nước trắng trợn."
  },
  {
    id: 23,
    question: "Trong cuộc cải cách ruộng đất ở miền Bắc, chế độ chiếm hữu ruộng đất phong kiến đã được xóa bỏ hoàn toàn vào thời gian nào?",
    options: [
      "Tháng 12 năm 1955",
      "Tháng 7 năm 1956",
      "Tháng 12 năm 1957",
      "Tháng 11 năm 1958"
    ],
    correctAnswer: 1, // B
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Đến tháng 7-1956, chế độ chiếm hữu ruộng đất phong kiến ở miền Bắc đã bị xóa bỏ hoàn toàn thông qua cải cách ruộng đất."
  },
  {
    id: 24,
    question: "Nghị quyết Hội nghị lần thứ 15 Ban Chấp hành Trung ương Đảng khóa II (tháng 1-1959) đã vạch rõ con đường phát triển cơ bản của cách mạng miền Nam là gì?",
    options: [
      "Đấu tranh chính trị hòa bình đòi đối phương thi tuyển cử",
      "Sử dụng bạo lực cách mạng để đánh đổ Mỹ - Diệm",
      "Vận động ngoại giao hòa hoãn tạm thời chấp nhận chia cắt",
      "Rút toàn bộ lực lượng vũ trang ra miền Bắc tập trung sản xuất"
    ],
    correctAnswer: 1, // B
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Nghị quyết Hội nghị Trung ương 15 (tháng 1-1959) xác định con đường phát triển cơ bản của cách mạng miền Nam là sử dụng bạo lực cách mạng với hai lực lượng chính trị và vũ trang."
  },
  {
    id: 25,
    question: "Đường vận tải chiến lược trên bộ nối miền Bắc chi viện cho miền Nam (Đường 559) bắt đầu được khai thông vào ngày tháng năm nào?",
    options: [
      "Ngày 19 tháng 5 năm 1959",
      "Ngày 22 tháng 12 năm 1959",
      "Ngày 20 tháng 12 năm 1960",
      "Ngày 23 tháng 10 năm 1961"
    ],
    correctAnswer: 0, // A
    ammoReward: { shells37mm: 5, flakBonus: 1 },
    historicalNote: "Đường vận tải Hồ Chí Minh trên bộ (Đường 559) hình thành từ ngày 19-5-1959, đóng vai trò chi viện chiến lược cho cách mạng miền Nam."
  },
  {
    id: 26,
    question: "Đường vận tải chiến lược trên biển chi viện cho miền Nam (Đường 759) chính thức được hình thành từ ngày tháng năm nào?",
    options: [
      "Ngày 19 tháng 5 năm 1959",
      "Ngày 22 tháng 12 năm 1959",
      "Ngày 20 tháng 12 năm 1960",
      "Ngày 23 tháng 10 năm 1961"
    ],
    correctAnswer: 3, // D
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Đường vận tải Hồ Chí Minh trên biển (Đường 759) chính thức hình thành từ ngày 23-10-1961 để vận chuyển vũ khí chi viện miền Nam."
  },
  {
    id: 27,
    question: "Phong trào Đồng khởi ở miền Nam nổ ra tiêu biểu nhất tại địa phương nào vào ngày 17-1-1960?",
    options: [
      "Quảng Ngãi",
      "Bến Tre",
      "Đồng Tháp",
      "Ninh Thuận"
    ],
    correctAnswer: 1, // B
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Ngày 17-1-1960, ở Bến Tre, hình thức khởi nghĩa đồng loạt (phong trào Đồng khởi) đã bùng nổ rồi nhanh chóng lan ra nhiều tỉnh khác."
  },
  {
    id: 28,
    question: "Thắng lợi của phong trào Đồng khởi (1960) đã đánh dấu bước phát triển nhảy vọt nào của cách mạng miền Nam?",
    options: [
      "Chuyển cách mạng từ thế giữ gìn lực lượng sang thế tiến công",
      "Đánh bại hoàn toàn chiến tranh xâm lược cục bộ của đế quốc Mỹ",
      "Buộc chính quyền Ngô Đình Diệm phải ký kết Hiệp định hòa bình",
      "Giải phóng hoàn toàn nông thôn đồng bằng miền Nam Việt Nam"
    ],
    correctAnswer: 0, // A
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Thắng lợi của phong trào Đồng khởi là bước nhảy vọt có ý nghĩa lịch sử, chuyển cách mạng miền Nam từ thế giữ gìn lực lượng sang thế tiến công."
  },
  {
    id: 29,
    question: "Mặt trận Dân tộc Giải phóng miền Nam Việt Nam được thành lập vào ngày 20-12-1960 do ai làm Chủ tịch?",
    options: [
      "Đồng chí Lê Duẩn",
      "Luật sư Nguyễn Hữu Thọ",
      "Kiến trúc sư Huỳnh Tấn Phát",
      "Luật sư Trịnh Đình Thảo"
    ],
    correctAnswer: 1, // B
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Ngày 20-12-1960, Mặt trận Dân tộc Giải phóng miền Nam Việt Nam được thành lập tại Tân Lập (Tây Ninh) do luật sư Nguyễn Hữu Thọ làm Chủ tịch."
  },
  {
    id: 30,
    question: "Đại hội đại biểu toàn quốc lần thứ III của Đảng (tháng 9-1960) xác định cách mạng xã hội chủ nghĩa ở miền Bắc giữ vai trò gì đối với cách mạng cả nước?",
    options: [
      "Giữ vai trò quyết định nhất đối với sự phát triển của toàn bộ cách mạng",
      "Giữ vai trò quyết định trực tiếp đối với sự nghiệp giải phóng miền Nam",
      "Giữ vai trò hỗ trợ hậu cần tạm thời cho chiến trường miền Nam Việt Nam",
      "Giữ vai trò mở rộng quan hệ đối ngoại và đàm phán ngoại giao với Mỹ"
    ],
    correctAnswer: 0, // A
    ammoReward: { shells37mm: 5, flakBonus: 1 },
    historicalNote: "Đại hội III (9-1960) xác định cách mạng xã hội chủ nghĩa ở miền Bắc giữ vai trò quyết định nhất đối với sự phát triển của toàn bộ cách mạng Việt Nam."
  },
  {
    id: 31,
    question: "Đại hội đại biểu toàn quốc lần thứ III của Đảng (tháng 9-1960) xác định cách mạng dân tộc dân chủ nhân dân ở miền Nam giữ vai trò gì?",
    options: [
      "Giữ vai trò quyết định nhất đối với sự phát triển của toàn bộ cách mạng",
      "Giữ vai trò quyết định trực tiếp đối với sự nghiệp giải phóng miền Nam",
      "Giữ vai trò quyết định về công tác xây dựng Đảng và đào tạo cán bộ",
      "Giữ vai trò quyết định trong việc khôi phục và phát triển kinh tế cả nước"
    ],
    correctAnswer: 1, // B
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Đại hội III (9-1960) xác định cách mạng dân tộc dân chủ nhân dân ở miền Nam giữ vai trò quyết định trực tiếp đối với sự nghiệp giải phóng miền Nam."
  },
  {
    id: 32,
    question: "Phong trào thi đua nào dưới đây được triển khai sôi nổi trong ngành giáo dục miền Bắc thời kỳ thực hiện Kế hoạch 5 năm lần thứ nhất (1961-1965)?",
    options: [
      "Thi đua theo gương Hợp tác xã Đại Phong",
      "Thi đua với Nhà máy cơ khí Duyên Hải",
      "Thi đua học tập Trường cấp II Bắc Lý",
      "Thi đua với Hợp tác xã thủ công Thành Công"
    ],
    correctAnswer: 2, // C
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Trong những năm 1961-1965, ngành giáo dục miền Bắc có phong trào thi đua học tập gương Trường cấp II Bắc Lý (Hà Nam)."
  },
  {
    id: 33,
    question: "Trong những năm 1961-1965, phong trào thi đua nào được phát động sôi nổi trong quân đội nhân dân miền Bắc?",
    options: [
      "Phong trào thi đua Ba nhất",
      "Phong trào thi đua Đại Phong",
      "Phong trào thi đua Ba sẵn sàng",
      "Phong trào thi đua Ba đảm đang"
    ],
    correctAnswer: 0, // A
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Trong Kế hoạch 5 năm lần thứ nhất (1961-1965), trong quân đội nhân dân miền Bắc có phong trào thi đua 'Ba nhất'."
  },
  {
    id: 34,
    question: "Mỹ bắt đầu tiến hành rải chất độc hóa học Dioxin (chất độc màu da cam) xuống miền Nam Việt Nam từ ngày tháng năm nào?",
    options: [
      "Ngày 10 tháng 8 năm 1961",
      "Ngày 8 tháng 3 năm 1965",
      "Ngày 5 tháng 8 năm 1964",
      "Ngày 2 tháng 1 năm 1963"
    ],
    correctAnswer: 0, // A
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Từ ngày 10-8-1961, Mỹ bắt đầu rải chất độc Dioxin (chất độc màu da cam) xuống miền Nam Việt Nam."
  },
  {
    id: 35,
    question: "Chiến thắng quân sự nào của quân và dân miền Nam vào ngày 2-1-1963 đã mở đầu cho khả năng đánh bại chiến thuật trực thăng vận của Mỹ?",
    options: [
      "Chiến thắng Vạn Tường",
      "Chiến thắng Bình Giã",
      "Chiến thắng Ấp Bắc",
      "Chiến thắng Đồng Xoài"
    ],
    correctAnswer: 2, // C
    ammoReward: { shells37mm: 5, flakBonus: 1 },
    historicalNote: "Chiến thắng vang dội ở Ấp Bắc (Mỹ Tho) ngày 2-1-1963 đã thể hiện sức mạnh đấu tranh vũ trang chống càn quét, đánh bại chiến thuật 'trực thăng vận' của Mỹ."
  },
  {
    id: 36,
    question: "Hội nghị lần thứ 9 Ban Chấp hành Trung ương Đảng khóa III (tháng 12-1963) xác định hình thức đấu tranh nào đóng vai trò quyết định trực tiếp thắng lợi trên chiến trường miền Nam?",
    options: [
      "Đấu tranh chính trị của quần chúng ở đô thị",
      "Đấu tranh vũ trang của lực lượng vũ trang",
      "Đấu tranh ngoại giao tại các diễn đàn quốc tế",
      "Đấu tranh kinh tế đình công của công nhân"
    ],
    correctAnswer: 1, // B
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Nghị quyết Trung ương lần thứ 9 (tháng 12-1963) đã xác định 'đấu tranh vũ trang đóng vai trò quyết định trực tiếp' thắng lợi trên chiến trường miền Nam."
  },
  {
    id: 37,
    question: "Chiến thắng quân sự nào của quân giải phóng miền Nam vào cuối năm 1964 đã bước đầu làm lung lay tận gốc chiến lược Chiến tranh đặc biệt?",
    options: [
      "Chiến thắng Vạn Tường",
      "Chiến thắng Bình Giã",
      "Chiến thắng Ấp Bắc",
      "Chiến thắng Ba Gia"
    ],
    correctAnswer: 1, // B
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Chiến thắng Bình Giã (12-1964) cùng các trận Ba Gia, Đồng Xoài đã làm cho chỗ dựa của Chiến tranh đặc biệt bị lung lay tận gốc."
  },
  {
    id: 38,
    question: "Tổng thống Mỹ nào đã quyết định triển khai chiến lược Chiến tranh cục bộ ở miền Nam Việt Nam từ đầu năm 1965?",
    options: [
      "Tổng thống Dwight D. Eisenhower",
      "Tổng thống John F. Kennedy",
      "Tổng thống Lyndon B. Johnson",
      "Tổng thống Richard Nixon"
    ],
    correctAnswer: 2, // C
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Trước nguy cơ thất bại của Chiến tranh đặc biệt, chính quyền của Tổng thống Mỹ Lyndon B. Johnson quyết định tiến hành chiến lược 'Chiến tranh cục bộ' từ năm 1965."
  },
  {
    id: 39,
    question: "Quân đội Mỹ chính thức đổ bộ vào Đà Nẵng, bắt đầu trực tiếp tham chiến ở miền Nam Việt Nam vào ngày tháng năm nào?",
    options: [
      "Ngày 5 tháng 8 năm 1964",
      "Ngày 8 tháng 3 năm 1965",
      "Ngày 10 tháng 8 năm 1961",
      "Ngày 17 tháng 7 năm 1966"
    ],
    correctAnswer: 1, // B
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Ngày 8-3-1965, quân Mỹ đổ bộ vào Đà Nẵng, chính thức trực tiếp tham chiến trên bộ ở miền Nam Việt Nam."
  },
  {
    id: 40,
    question: "Hội nghị Trung ương lần thứ 11 (3-1965) và lần thứ 12 (12-1965) của Đảng đã quyết định phát động cuộc kháng chiến chống Mỹ cứu nước với khẩu hiệu chung là gì?",
    options: [
      "Tất cả để đánh thắng giặc Mỹ xâm lược",
      "Quyết tử cho Tổ quốc quyết sinh",
      "Thà hy sinh tất cả chứ không chịu làm nô lệ",
      "Một tấc không đi, một ly không rời"
    ],
    correctAnswer: 0, // A
    ammoReward: { shells37mm: 5, flakBonus: 1 },
    historicalNote: "Nghị quyết Trung ương lần thứ 11 và 12 xác định khẩu hiệu chung của nhân dân cả nước lúc này là 'Tất cả để đánh thắng giặc Mỹ xâm lược'."
  },
  {
    id: 41,
    question: "Phong trào đấu tranh nào của phụ nữ miền Bắc được phát động mạnh mẽ để vừa đảm nhiệm sản xuất vừa phục vụ chiến tranh phá hoại của Mỹ?",
    options: [
      "Phong trào Ba sẵn sàng",
      "Phong trào Ba đảm đang",
      "Phong trào Năm tốt",
      "Phong trào Hai tốt"
    ],
    correctAnswer: 1, // B
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Phụ nữ miền Bắc có phong trào 'Ba đảm đang' đảm nhiệm sản xuất, gia đình và sẵn sàng chiến đấu phục vụ tiền tuyến."
  },
  {
    id: 42,
    question: "Chiến thắng quân sự vang dội nào vào tháng 8-1965 đã chứng minh quân dân miền Nam hoàn toàn có khả năng đánh thắng quân viễn chinh Mỹ về quân sự?",
    options: [
      "Chiến thắng Núi Thành",
      "Chiến thắng Vạn Tường",
      "Chiến thắng Plâyme",
      "Chiến thắng Bình Giã"
    ],
    correctAnswer: 1, // B
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Thắng lợi của chiến đấu Vạn Tường (8-1965) chứng tỏ quân dân miền Nam hoàn toàn có khả năng đánh bại quân chiến đấu Mỹ về quân sự."
  },
  {
    id: 43,
    question: "Hội nghị Ban Chấp hành Trung ương Đảng khóa III lần thứ mười ba (tháng 1-1967) đã đưa ra quyết sách ngoại giao mang tính đột phá nào?",
    options: [
      "Ký kết ngay Hiệp định đình chiến với Chính phủ Mỹ",
      "Quyết định mở mặt trận ngoại giao, mở ra cục diện vừa đánh vừa đàm",
      "Cự tuyệt mọi cuộc tiếp xúc ngoại giao gián tiếp với Mỹ",
      "Yêu cầu Liên Hợp Quốc đứng ra làm trung gian hòa giải xung đột"
    ],
    correctAnswer: 1, // B
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Ngày 28-1-1967, Hội nghị lần thứ 13 Ban Chấp hành Trung ương Đảng (khóa III) đã quyết định mở mặt trận ngoại giao nhằm tranh thủ sự ủng hộ quốc tế, mở ra cục diện vừa đánh, vừa đàm."
  },
  {
    id: 44,
    question: "Ai được cử làm Trưởng đoàn đại biểu Chính phủ Việt Nam Dân chủ Cộng hòa tham gia đàm phán chính thức tại Hội nghị Paris từ tháng 5-1968?",
    options: [
      "Đồng chí Lê Đức Thọ",
      "Bộ trưởng Xuân Thủy",
      "Đồng chí Phạm Văn Đồng",
      "Bộ trưởng Nguyễn Thị Bình"
    ],
    correctAnswer: 1, // B
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Phái đoàn đàm phán của Chính phủ Việt Nam Dân chủ Cộng hòa tham gia đàm phán tại Paris từ ngày 13-5-1968 do Bộ trưởng Xuân Thủy làm Trưởng đoàn."
  },
  {
    id: 45,
    question: "Chính phủ Cách mạng Lâm thời Cộng hòa miền Nam Việt Nam được thành lập vào ngày 6-6-1969 do ai làm Chủ tịch?",
    options: [
      "Luật sư Nguyễn Hữu Thọ",
      "Kiến trúc sư Huỳnh Tấn Phát",
      "Luật sư Trịnh Đình Thảo",
      "Bà Nguyễn Thị Bình"
    ],
    correctAnswer: 1, // B
    ammoReward: { shells37mm: 5, flakBonus: 1 },
    historicalNote: "Chính phủ Cách mạng Lâm thời Cộng hòa miền Nam Việt Nam được thành lập ngày 6-6-1969 do kiến trúc sư Huỳnh Tấn Phát làm Chủ tịch."
  },
  {
    id: 46,
    question: "Sau khi Chủ tịch Hồ Chí Minh qua đời, Quốc hội khóa III đã bầu ai làm Chủ tịch nước Việt Nam Dân chủ Cộng hòa vào ngày 23-9-1969?",
    options: [
      "Đồng chí Tôn Đức Thắng",
      "Đồng chí Nguyễn Lương Bằng",
      "Đồng chí Trường Chinh",
      "Đồng chí Phạm Văn Đồng"
    ],
    correctAnswer: 0, // A
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Ngày 23-9-1969, tại kỳ họp đặc biệt, Quốc hội khóa III đã bầu đồng chí Tôn Đức Thắng làm Chủ tịch nước."
  },
  {
    id: 47,
    question: "Cuộc chiến đấu oanh liệt của quân giải phóng bảo vệ Thành cổ Quảng Trị mùa hè năm 1972 đã diễn ra trong bao nhiêu ngày đêm?",
    options: [
      "Diễn ra suốt 71 ngày đêm",
      "Diễn ra suốt 81 ngày đêm",
      "Diễn ra suốt 91 ngày đêm",
      "Diễn ra suốt 61 ngày đêm"
    ],
    correctAnswer: 1, // B
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Cuộc chiến đấu oanh liệt của Quân giải phóng ở Thành cổ Quảng Trị kéo dài suốt 81 ngày đêm từ ngày 28-6 đến ngày 16-9-1972."
  },
  {
    id: 48,
    question: "Hiệp định về chấm dứt chiến tranh, lập lại hòa bình ở Việt Nam (Hiệp định Paris) được ký kết chính thức vào ngày tháng năm nào?",
    options: [
      "Ngày 21 tháng 7 năm 1954",
      "Ngày 27 tháng 1 năm 1973",
      "Ngày 15 tháng 1 năm 1973",
      "Ngày 30 tháng 4 năm 1975"
    ],
    correctAnswer: 1, // B
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Cuộc đấu tranh ngoại giao kết thúc vào ngày 27-1-1973 với việc ký kết Hiệp định về chấm dứt chiến tranh, lập lại hòa bình ở Việt Nam tại Paris."
  },
  {
    id: 49,
    question: "Hội nghị Ban Chấp hành Trung ương Đảng lần thứ 21 khóa III (tháng 7-1973) xác định con đường của cách mạng miền Nam trong giai đoạn mới vẫn là con đường nào?",
    options: [
      "Con đường bạo lực cách mạng",
      "Con đường đấu tranh chính trị hòa bình",
      "Con đường thương lượng ngoại giao đa phương",
      "Con đường phát triển kinh tế thương mại tự do"
    ],
    correctAnswer: 0, // A
    ammoReward: { shells37mm: 4, flakBonus: 0 },
    historicalNote: "Hội nghị lần thứ 21 Ban Chấp hành Trung ương Đảng (7-1973) nêu rõ con đường cách mạng của nhân dân miền Nam là con đường bạo lực cách mạng."
  },
  {
    id: 50,
    question: "Chiến thắng quân sự nào của quân ta vào ngày 6-1-1975 được coi là đòn thăm dò chiến lược quan trọng khẳng định thời cơ giải phóng hoàn toàn miền Nam đã chín muồi?",
    options: [
      "Chiến thắng Buôn Ma Thuột",
      "Chiến thắng Phước Long",
      "Chiến thắng Thượng Đức",
      "Chiến thắng Đồng Xoài"
    ],
    correctAnswer: 1, // B
    ammoReward: { shells37mm: 5, flakBonus: 1 },
    historicalNote: "Quân ta đánh chiếm thị xã Phước Long (ngày 6-1-1975), giải phóng hoàn toàn tỉnh Phước Long. Chiến thắng này có ý nghĩa như một đòn thăm dò chiến lược quan trọng."
  }
];
