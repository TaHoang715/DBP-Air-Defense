// 19 Official Historical Aircraft Models Shot Down during Operation Linebacker II (18/12 - 30/12/1972)
// "Dien Bien Phu on the Air" - 12 Days and Nights Historical Dossier

export interface HistoricalPlane {
  id: string;
  name: string;
  code: string;
  serialNumber?: string; // Số hiệu máy bay (nếu có)
  role: string; // Vai trò / Sức công phá
  shotDownDate: string; // Ngày bị bắn rơi
  creditedUnit: string; // Đơn vị lập công
  historicalContext: string; // Tư liệu lịch sử & diễn biến chiến công
  imageUrl: string; // Ảnh tư liệu lịch sử thực tế
  imageCaption: string; // Chú thích ảnh
  aircraftType: 'B52' | 'JET_FIGHTER' | 'SWING_WING' | 'ATTACK_BOMBER' | 'RECON' | 'HELICOPTER' | 'DRONE';
  specs: {
    origin: string;
    maxSpeed: string;
    wingspan: string;
    bombLoad: string; // Tải trọng bom
    armament: string;
  };
  baseScore: number;
  baseHp: number;
  baseSpeed: number; // Base pixel velocity
  colorScheme: {
    body: string;
    wing: string;
    cockpit: string;
    stripe: string;
  };
}

export const HISTORICAL_PLANES: HistoricalPlane[] = [
  // ═══ 1. B-52G (Số hiệu: 58-0201) — 18/12/1972 ═══
  {
    id: 'b52g_58_0201',
    name: 'Boeing B-52G Stratofortress',
    code: 'B-52G "Pháo Đài Bay"',
    serialNumber: '58-0201',
    role: 'Máy bay ném bom chiến lược — mang ~9–13 tấn bom (27 quả)',
    shotDownDate: '18/12/1972 (Đêm mở màn chiến dịch)',
    creditedUnit: 'Tiểu đoàn 59, Trung đoàn tên lửa 261 (SAM-2)',
    historicalContext: 'Đêm 18/12/1972, Tiểu đoàn 59 (Trung đoàn 261) đã phóng tên lửa SAM-2 bắn rơi tại chỗ chiếc pháo đài bay B-52G đầu tiên của không quân chiến lược Mỹ trên cánh đồng Chuôm (Phù Lỗ, Sóc Sơn), mở màn cho chuỗi chiến thắng lẫy lừng của chiến dịch.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/B-52G_refueling_1988.JPEG/800px-B-52G_refueling_1988.JPEG',
    imageCaption: 'Pháo đài bay chiến lược Boeing B-52G của Không quân Mỹ',
    aircraftType: 'B52',
    specs: {
      origin: 'Hoa Kỳ (Boeing)',
      maxSpeed: '1.047 km/h (Mach 0.86)',
      wingspan: '56.4 m',
      bombLoad: '~9–13 tấn bom (27 quả bom 340kg/450kg)',
      armament: '8 động cơ phản lực Pratt & Whitney J57, tháp pháo đuôi 4 súng máy 12.7mm M3'
    },
    baseScore: 500,
    baseHp: 4,
    baseSpeed: 1.4,
    colorScheme: {
      body: '#2b303a',
      wing: '#1e2229',
      cockpit: '#4cc9f0',
      stripe: '#e63946'
    }
  },

  // ═══ 2. B-52D (Số hiệu: 56-0608) — 19/12/1972 ═══
  {
    id: 'b52d_56_0608',
    name: 'Boeing B-52D Stratofortress (Big Belly)',
    code: 'B-52D "Khoang Bom Lớn"',
    serialNumber: '56-0608',
    role: 'Máy bay ném bom chiến lược — mang ~27–30 tấn bom (108 quả)',
    shotDownDate: '19/12/1972 (Đêm thứ hai)',
    creditedUnit: 'Tiểu đoàn 77, Trung đoàn tên lửa 257 (SAM-2)',
    historicalContext: 'B-52D được Mỹ nâng cấp khoang bom phình to (Big Belly) mang tới 108 quả bom hủy diệt. Đêm 19/12/1972, Tiểu đoàn 77 (Trung đoàn 257) đã dùng phương pháp phát sóng bám sát mục tiêu chính xác trong dải nhiễu nặng, phóng đạn tiêu diệt hoàn toàn chiếc B-52D này.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Boeing_B-52D_Stratofortress_USAF.jpg/800px-Boeing_B-52D_Stratofortress_USAF.jpg',
    imageCaption: 'Boeing B-52D với khoang bom phình to (Big Belly) mang 108 quả bom',
    aircraftType: 'B52',
    specs: {
      origin: 'Hoa Kỳ (Boeing)',
      maxSpeed: '1.047 km/h',
      wingspan: '56.4 m',
      bombLoad: '~27–30 tấn bom (108 quả bom gồm 84 quả trong khoang + 24 quả ngoài cánh)',
      armament: '8 động cơ tuabin phản lực J57-P-29W, 4 súng máy đuôi 12.7mm radar dẫn bắn'
    },
    baseScore: 500,
    baseHp: 4,
    baseSpeed: 1.4,
    colorScheme: {
      body: '#1f2421',
      wing: '#141815',
      cockpit: '#00f5d4',
      stripe: '#ffd166'
    }
  },

  // ═══ 3. B-52D (Số hiệu: 56-0622) — 20/12/1972 ═══
  {
    id: 'b52d_56_0622',
    name: 'Boeing B-52D Stratofortress',
    code: 'B-52D #56-0622',
    serialNumber: '56-0622',
    role: 'Máy bay ném bom chiến lược — mang ~27–30 tấn bom (108 quả)',
    shotDownDate: '20/12/1972 (Đêm thứ ba)',
    creditedUnit: 'Tiểu đoàn 57, 77, 79 (phối hợp bắn rơi 4 chiếc trong 9 phút)',
    historicalContext: 'Đêm 20 rạng sáng 21/12/1972 đi vào lịch sử phòng không thế giới khi các Tiểu đoàn tên lửa 57, 77, 79 hiệp đồng xuất quỷ nhập thần, bắn rơi liên tiếp 4 pháo đài bay B-52 chỉ trong vòng 9 phút, bẻ gãy hoàn toàn đợt tập kích quy mô lớn của địch.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Boeing_B-52D_Stratofortress_USAF.jpg/800px-Boeing_B-52D_Stratofortress_USAF.jpg',
    imageCaption: 'Pháo đài bay B-52D trong chiến dịch Linebacker II',
    aircraftType: 'B52',
    specs: {
      origin: 'Hoa Kỳ (Boeing)',
      maxSpeed: '1.047 km/h',
      wingspan: '56.4 m',
      bombLoad: '~27–30 tấn bom (108 quả)',
      armament: 'Hệ thống tác chiến điện tử ECM công suất cực mạnh, tháp pháo đuôi 12.7mm'
    },
    baseScore: 500,
    baseHp: 4,
    baseSpeed: 1.4,
    colorScheme: {
      body: '#2d3142',
      wing: '#1f222e',
      cockpit: '#4cc9f0',
      stripe: '#ef233c'
    }
  },

  // ═══ 4. B-52G (Số hiệu: 57-6469) — 20/12/1972 ═══
  {
    id: 'b52g_57_6469',
    name: 'Boeing B-52G Stratofortress',
    code: 'B-52G #57-6469',
    serialNumber: '57-6469',
    role: 'Máy bay ném bom chiến lược — mang ~9–13 tấn bom (27 quả)',
    shotDownDate: '20/12/1972 (Đêm thứ ba)',
    creditedUnit: 'Tiểu đoàn 57, 77, 79 (phối hợp đánh bại đợt tập kích)',
    historicalContext: 'Chiếc B-52G bị trúng tên lửa phòng không bốc cháy rực sáng bầu trời Hà Nội đêm 20/12/1972, củng cố niềm tin tuyệt đối của quân và dân ta vào khả năng tiêu diệt hoàn toàn siêu pháo đài bay Mỹ.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/B-52G_refueling_1988.JPEG/800px-B-52G_refueling_1988.JPEG',
    imageCaption: 'Máy bay ném bom chiến lược B-52G của Không quân Chiến lược Mỹ (SAC)',
    aircraftType: 'B52',
    specs: {
      origin: 'Hoa Kỳ (Boeing)',
      maxSpeed: '1.047 km/h',
      wingspan: '56.4 m',
      bombLoad: '~9–13 tấn bom (27 quả)',
      armament: '8 động cơ phản lực, radar cảnh giới tầm xa, hệ thống pháo sáng gây nhiễu'
    },
    baseScore: 500,
    baseHp: 4,
    baseSpeed: 1.4,
    colorScheme: {
      body: '#283618',
      wing: '#1b2410',
      cockpit: '#dda15e',
      stripe: '#bc6c25'
    }
  },

  // ═══ 5. B-52G (Số hiệu: 58-0198) — 21/12/1972 ═══
  {
    id: 'b52g_58_0198',
    name: 'Boeing B-52G Stratofortress',
    code: 'B-52G #58-0198',
    serialNumber: '58-0198',
    role: 'Máy bay ném bom chiến lược — mang ~9–13 tấn bom (27 quả)',
    shotDownDate: '21/12/1972 (Đêm thứ tư)',
    creditedUnit: 'Lực lượng tên lửa/pháo cao xạ đêm 21–22/12/1972',
    historicalContext: 'Đêm 21/12/1972, khi không quân Mỹ điên cuồng dội bom rải thảm vào các khu dân cư Hà Nội - Hải Phòng, chiếc B-52G số hiệu 58-0198 đã bị tên lửa phòng không ta đón đầu bắn gãy cánh bốc cháy dữ dội.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/B-52G_refueling_1988.JPEG/800px-B-52G_refueling_1988.JPEG',
    imageCaption: 'Pháo đài bay B-52G được mệnh danh là vũ khí hủy diệt tối thượng',
    aircraftType: 'B52',
    specs: {
      origin: 'Hoa Kỳ (Boeing)',
      maxSpeed: '1.047 km/h',
      wingspan: '56.4 m',
      bombLoad: '~9–13 tấn bom (27 quả)',
      armament: '8 động cơ J57, tháp pháo đuôi 4x12.7mm M3, hệ thống gây nhiễu ALQ'
    },
    baseScore: 500,
    baseHp: 4,
    baseSpeed: 1.4,
    colorScheme: {
      body: '#212529',
      wing: '#16181b',
      cockpit: '#72efdd',
      stripe: '#f72585'
    }
  },

  // ═══ 6. B-52G (Số hiệu: 58-0169) — 21/12/1972 ═══
  {
    id: 'b52g_58_0169',
    name: 'Boeing B-52G Stratofortress',
    code: 'B-52G #58-0169',
    serialNumber: '58-0169',
    role: 'Máy bay ném bom chiến lược — mang ~9–13 tấn bom (27 quả)',
    shotDownDate: '21/12/1972 (Đêm thứ tư)',
    creditedUnit: 'Lực lượng tên lửa/pháo cao xạ đêm 21–22/12/1972',
    historicalContext: 'Bị bắn rơi trong đêm cao điểm 21/12/1972, biến thành ngọn đuốc khổng lồ cắm đầu xuống vùng ngoại thành, thiêu rụi ảo tưởng dùng sức mạnh không quân khuất phục ý chí dân tộc Việt Nam.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/B-52G_refueling_1988.JPEG/800px-B-52G_refueling_1988.JPEG',
    imageCaption: 'B-52G với tầm bay liên lục địa và sải cánh khổng lồ 56.4 mét',
    aircraftType: 'B52',
    specs: {
      origin: 'Hoa Kỳ (Boeing)',
      maxSpeed: '1.047 km/h',
      wingspan: '56.4 m',
      bombLoad: '~9–13 tấn bom (27 quả)',
      armament: 'Hệ thống bom thông thường, thiết bị dẫn đường vô tuyến Doppler'
    },
    baseScore: 500,
    baseHp: 4,
    baseSpeed: 1.4,
    colorScheme: {
      body: '#343a40',
      wing: '#212529',
      cockpit: '#48cae4',
      stripe: '#e76f51'
    }
  },

  // ═══ 7. B-52D (Số hiệu: 55-0050) — 22/12/1972 ═══
  {
    id: 'b52d_55_0050',
    name: 'Boeing B-52D Stratofortress',
    code: 'B-52D #55-0050',
    serialNumber: '55-0050',
    role: 'Máy bay ném bom chiến lược — mang ~27–30 tấn bom (108 quả)',
    shotDownDate: '22/12/1972 (Đêm thứ năm)',
    creditedUnit: 'Lực lượng phòng không đêm 22–23/12/1972',
    historicalContext: 'B-52D mang theo gần 30 tấn bom rải thảm bị tên lửa phòng không phát hiện từ cự ly thích hợp và phóng đạn tiêu diệt đêm 22/12/1972.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Boeing_B-52D_Stratofortress_USAF.jpg/800px-Boeing_B-52D_Stratofortress_USAF.jpg',
    imageCaption: 'Boeing B-52D Stratofortress rải thảm bom tàn phá mục tiêu',
    aircraftType: 'B52',
    specs: {
      origin: 'Hoa Kỳ (Boeing)',
      maxSpeed: '1.047 km/h',
      wingspan: '56.4 m',
      bombLoad: '~27–30 tấn bom (108 quả)',
      armament: 'Khoang bom Big Belly, hệ thống gây nhiễu chủ động và thụ động cực mạnh'
    },
    baseScore: 500,
    baseHp: 4,
    baseSpeed: 1.4,
    colorScheme: {
      body: '#3d405b',
      wing: '#2b2d42',
      cockpit: '#81b29a',
      stripe: '#e07a5f'
    }
  },

  // ═══ 8. B-52D (Số hiệu: 55-0061) — 22/12/1972 ═══
  {
    id: 'b52d_55_0061',
    name: 'Boeing B-52D Stratofortress',
    code: 'B-52D #55-0061',
    serialNumber: '55-0061',
    role: 'Máy bay ném bom chiến lược — mang ~27–30 tấn bom (108 quả)',
    shotDownDate: '22/12/1972 (Đêm thứ năm)',
    creditedUnit: 'Lực lượng phòng không đêm 22–23/12/1972',
    historicalContext: 'Chiếc B-52D số hiệu 55-0061 bị lưới lửa tên lửa phòng không quật ngã trong đêm 22/12/1972 khi đang chuẩn bị vào vệt cắt bom hủy diệt.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Boeing_B-52D_Stratofortress_USAF.jpg/800px-Boeing_B-52D_Stratofortress_USAF.jpg',
    imageCaption: 'B-52D với 8 động cơ phản lực gầm thét trên bầu trời',
    aircraftType: 'B52',
    specs: {
      origin: 'Hoa Kỳ (Boeing)',
      maxSpeed: '1.047 km/h',
      wingspan: '56.4 m',
      bombLoad: '~27–30 tấn bom (108 quả)',
      armament: '8 động cơ phản lực J57, tháp pháo đuôi điều khiển tự động bằng radar'
    },
    baseScore: 500,
    baseHp: 4,
    baseSpeed: 1.4,
    colorScheme: {
      body: '#22333b',
      wing: '#141e24',
      cockpit: '#eae0d5',
      stripe: '#c6ac8f'
    }
  },

  // ═══ 9. B-52D (Số hiệu: 56-0674) — 26/12/1972 ═══
  {
    id: 'b52d_56_0674',
    name: 'Boeing B-52D Stratofortress (Trận 26/12)',
    code: 'B-52D #56-0674',
    serialNumber: '56-0674',
    role: 'Máy bay ném bom chiến lược — mang ~27–30 tấn bom (108 quả)',
    shotDownDate: '26/12/1972 (Trận đánh lớn nhất - 8 B-52 rơi)',
    creditedUnit: 'Trung đoàn pháo cao xạ 252 (lần đầu dùng pháo 100mm hạ 1 B-52)',
    historicalContext: 'Đêm 26/12/1972 là trận đánh quyết định lớn nhất chiến dịch với 8 chiếc B-52 bị bắn rơi trong một đêm. Đặc biệt, Trung đoàn pháo cao xạ 252 đã lập kỳ tích lịch sử khi dùng pháo cao xạ 100mm đón đầu bắn rơi tại chỗ 1 pháo đài bay B-52, chứng minh sức mạnh của pháo cao xạ Việt Nam.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Boeing_B-52D_Stratofortress_USAF.jpg/800px-Boeing_B-52D_Stratofortress_USAF.jpg',
    imageCaption: 'Xác máy bay B-52 bị quân và dân ta bắn hạ rực sáng trong đêm 26/12/1972',
    aircraftType: 'B52',
    specs: {
      origin: 'Hoa Kỳ (Boeing)',
      maxSpeed: '1.047 km/h',
      wingspan: '56.4 m',
      bombLoad: '~27–30 tấn bom (108 quả)',
      armament: 'Khoang bom Big Belly, 8 động cơ phản lực, thiết bị phóng nhiễu Chaff'
    },
    baseScore: 550,
    baseHp: 4,
    baseSpeed: 1.35,
    colorScheme: {
      body: '#1b1b1e',
      wing: '#111113',
      cockpit: '#ffd166',
      stripe: '#ef476f'
    }
  },

  // ═══ 10. B-52D (Số hiệu: 56-0650) — 28/12/1972 (Vũ Xuân Thiều) ═══
  {
    id: 'b52d_56_0650',
    name: 'Boeing B-52D Stratofortress (Chiến Công Vũ Xuân Thiều)',
    code: 'B-52D #56-0650',
    serialNumber: '56-0650',
    role: 'Máy bay ném bom chiến lược — mang ~27–30 tấn bom (108 quả)',
    shotDownDate: '28/12/1972 (21h45 đêm)',
    creditedUnit: 'Anh hùng Phi công Vũ Xuân Thiều (Trung đoàn không quân 927, lái MiG-21)',
    historicalContext: 'Chiến công bất tử rạng danh non sông: Đêm 28/12/1972 lúc 21h45, phi công Vũ Xuân Thiều lái tiêm kích MiG-21 vượt qua hàng rào tiêm kích F-4 bảo vệ, tiếp cận B-52 ở cự ly cực gần, phóng 2 quả tên lửa rồi quả cảm lao thẳng máy bay MiG-21 vào pháo đài bay giặc, cùng nổ tung tiêu diệt B-52 trên bầu trời.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Boeing_B-52D_Stratofortress_USAF.jpg/800px-Boeing_B-52D_Stratofortress_USAF.jpg',
    imageCaption: 'B-52D bị anh hùng phi công Vũ Xuân Thiều cảm tử tiêu diệt đêm 28/12/1972',
    aircraftType: 'B52',
    specs: {
      origin: 'Hoa Kỳ (Boeing)',
      maxSpeed: '1.047 km/h',
      wingspan: '56.4 m',
      bombLoad: '~27–30 tấn bom (108 quả)',
      armament: 'Tháp pháo đuôi 4x12.7mm, hệ thống radar cảnh báo rải bom đêm'
    },
    baseScore: 600,
    baseHp: 4,
    baseSpeed: 1.35,
    colorScheme: {
      body: '#0f1416',
      wing: '#0a0d0e',
      cockpit: '#00b4d8',
      stripe: '#d90429'
    }
  },

  // ═══ 11. B-52 (D/G còn lại) ═══
  {
    id: 'b52_fleet_general',
    name: 'Boeing B-52 Stratofortress (Phi Đội B-52)',
    code: 'B-52 Chiến Dịch Linebacker II',
    role: 'Máy bay ném bom chiến lược — 24 chiếc còn lại trong tổng số 34 B-52 bị bắn rơi cả chiến dịch',
    shotDownDate: 'Rải rác 18–29/12/1972',
    creditedUnit: 'Lực lượng phòng không ba thứ quân (tên lửa, pháo cao xạ, không quân)',
    historicalContext: 'Trong toàn bộ 12 ngày đêm chiến dịch Điện Biên Phủ trên không, quân và dân ta đã bắn rơi tổng cộng 34 pháo đài bay B-52 bất khả xâm phạm, làm sụp đổ hoàn toàn thần tượng sức mạnh của không quân chiến lược Mỹ, buộc Tổng thống Nixon phải ký Hiệp định Paris.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Boeing_B-52D_Stratofortress_USAF.jpg/800px-Boeing_B-52D_Stratofortress_USAF.jpg',
    imageCaption: 'Tổng cộng 34 siêu pháo đài bay B-52 bị bắn rơi trong 12 ngày đêm 1972',
    aircraftType: 'B52',
    specs: {
      origin: 'Hoa Kỳ (Boeing)',
      maxSpeed: '1.047 km/h',
      wingspan: '56.4 m',
      bombLoad: '9–30 tấn bom tùy loại D/G',
      armament: '8 động cơ phản lực, hệ thống điện tử gây nhiễu tối tân'
    },
    baseScore: 500,
    baseHp: 4,
    baseSpeed: 1.4,
    colorScheme: {
      body: '#2c3e50',
      wing: '#1a252f',
      cockpit: '#1abc9c',
      stripe: '#e74c3c'
    }
  },

  // ═══ 12. F-4 (Phantom II — "Con Ma") ═══
  {
    id: 'f4_phantom_ii',
    name: 'McDonnell Douglas F-4 Phantom II ("Con Ma")',
    code: 'F-4 Phantom II',
    role: 'Tiêm kích đa năng, hộ tống B-52 và không chiến — 21 chiếc bị bắn rơi cả chiến dịch',
    shotDownDate: 'Rải rác 18–29/12/1972',
    creditedUnit: 'Lực lượng phòng không ba thứ quân (tên lửa, pháo cao xạ, không quân, dân quân tự vệ)',
    historicalContext: 'F-4 Phantom II là tiêm kích siêu âm chủ lực tối tân bậc nhất của Mỹ, bay hộ tống bảo vệ và ném bom bảo vệ đội hình B-52. Trong 12 ngày đêm, có tới 21 chiếc "Con Ma" F-4 bị lưới lửa tên lửa, pháo cao xạ và MiG-21 của ta bắn rơi tan xác.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/F-4C_4525_CCTW_over_Vietnam_1967.jpg/800px-F-4C_4525_CCTW_over_Vietnam_1967.jpg',
    imageCaption: 'Tiêm kích phản lực siêu âm F-4 Phantom II ("Con Ma") của Không quân Mỹ',
    aircraftType: 'JET_FIGHTER',
    specs: {
      origin: 'Hoa Kỳ (McDonnell Douglas)',
      maxSpeed: '2.370 km/h (Mach 2.23)',
      wingspan: '11.7 m',
      bombLoad: 'Tải trọng 8.4 tấn vũ khí',
      armament: '4 tên lửa AIM-7 Sparrow, 4 tên lửa AIM-9 Sidewinder, pháo 20mm M61 Vulcan'
    },
    baseScore: 250,
    baseHp: 2,
    baseSpeed: 2.7,
    colorScheme: {
      body: '#4a5568',
      wing: '#2d3748',
      cockpit: '#63b3ed',
      stripe: '#f56565'
    }
  },

  // ═══ 13. A-7 (Corsair II) ═══
  {
    id: 'a7_corsair_ii',
    name: 'LTV A-7 Corsair II',
    code: 'A-7 Corsair II',
    role: 'Cường kích, chế áp/tấn công trận địa phòng không — 12 chiếc bị bắn rơi cả chiến dịch',
    shotDownDate: 'Rải rác 18–29/12/1972',
    creditedUnit: 'Lực lượng phòng không ba thứ quân',
    historicalContext: 'A-7 Corsair II là máy bay cường kích tấn công mặt đất hiện đại của Hải quân và Không quân Mỹ, được trang bị hệ thống ngắm bắn kỹ thuật số chuyên đi săn lùng và đánh phá các trận địa tên lửa, pháo cao xạ. Đã có 12 chiếc A-7 bị các khẩu đội phòng không của ta bắn hạ.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/A-7E_Corsair_II_VA-82_in_flight_1975.JPEG/800px-A-7E_Corsair_II_VA-82_in_flight_1975.JPEG',
    imageCaption: 'Máy bay cường kích tấn công mặt đất LTV A-7 Corsair II',
    aircraftType: 'ATTACK_BOMBER',
    specs: {
      origin: 'Hoa Kỳ (Ling-Temco-Vought)',
      maxSpeed: '1.114 km/h',
      wingspan: '11.8 m',
      bombLoad: 'Mang tới 6.8 tấn bom đạn',
      armament: '1 pháo 20mm M61A1 Vulcan (1.000 viên), bom dẫn đường laser Paveway, tên lửa AGM-45 Shrike'
    },
    baseScore: 220,
    baseHp: 2,
    baseSpeed: 2.3,
    colorScheme: {
      body: '#52796f',
      wing: '#354f52',
      cockpit: '#84a98c',
      stripe: '#f4a261'
    }
  },

  // ═══ 14. F-111A (Aardvark — "Cánh cụp cánh xòe") ═══
  {
    id: 'f111a_aardvark',
    name: 'General Dynamics F-111A Aardvark ("Cánh Cụp Cánh Xòe")',
    code: 'F-111A "Cánh Biến Hình"',
    role: 'Ném bom chiến thuật cánh biến hình, bay thấp ném bom ban đêm — 5 chiếc bị bắn rơi cả chiến dịch',
    shotDownDate: 'Rải rác 18–29/12/1972',
    creditedUnit: 'Lực lượng phòng không ba thứ quân & Dân quân tự vệ',
    historicalContext: 'F-111A là "con bài tẩy" hiện đại bậc nhất của Mỹ với đôi cánh có thể cụp xòe tự động, trang bị radar bám địa hình bay cực thấp luồn lách qua thung lũng ban đêm để tránh radar. Tuy nhiên, các trận địa pháo cao xạ tầm thấp và súng máy của quân dân ta đã đón lõng bắn rơi 5 chiếc F-111A tối tân này.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/F-111A_428th_TFS_over_Vietnam_1968.jpg/800px-F-111A_428th_TFS_over_Vietnam_1968.jpg',
    imageCaption: 'Máy bay ném bom cánh cụp cánh xòe F-111A Aardvark của Không quân Mỹ',
    aircraftType: 'SWING_WING',
    specs: {
      origin: 'Hoa Kỳ (General Dynamics)',
      maxSpeed: '2.655 km/h (Mach 2.5)',
      wingspan: '19.2 m (xòe) / 9.74 m (cụp)',
      bombLoad: 'Mang tới 14.3 tấn bom trong khoang và trên cánh',
      armament: 'Radar bám địa hình TFR AN/APQ-110, bom nổ phá, pháo 20mm Vulcan'
    },
    baseScore: 350,
    baseHp: 3,
    baseSpeed: 2.9,
    colorScheme: {
      body: '#3a5a40',
      wing: '#344e41',
      cockpit: '#a3b18a',
      stripe: '#e76f51'
    }
  },

  // ═══ 15. A-6A (Intruder) ═══
  {
    id: 'a6a_intruder',
    name: 'Grumman A-6A Intruder',
    code: 'A-6A Intruder',
    role: 'Cường kích hải quân, ném bom mọi thời tiết — 4 chiếc bị bắn rơi cả chiến dịch',
    shotDownDate: 'Rải rác 18–29/12/1972',
    creditedUnit: 'Lực lượng phòng không ba thứ quân',
    historicalContext: 'A-6A Intruder là cường kích hạm đội hoạt động từ các tàu sân bay Mỹ ngoài vịnh Bắc Bộ, có khả năng bay đêm và ném bom trong mọi điều kiện thời tiết xấu nhờ radar DIANE tối tân. Có 4 chiếc A-6A đã bị hỏa lực phòng không miền Bắc bắn rơi.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/A-6A_Intruder_VA-196_in_flight_1971.jpg/800px-A-6A_Intruder_VA-196_in_flight_1971.jpg',
    imageCaption: 'Cường kích hải quân Grumman A-6A Intruder chuyên đánh đêm mọi thời tiết',
    aircraftType: 'ATTACK_BOMBER',
    specs: {
      origin: 'Hoa Kỳ (Grumman)',
      maxSpeed: '1.037 km/h',
      wingspan: '16.15 m',
      bombLoad: 'Mang tối đa 8.2 tấn bom',
      armament: 'Hệ thống ngắm bắn kỹ thuật số DIANE, mang tới 28 quả bom Mk 82 227kg'
    },
    baseScore: 200,
    baseHp: 2,
    baseSpeed: 2.1,
    colorScheme: {
      body: '#495057',
      wing: '#343a40',
      cockpit: '#90e0ef',
      stripe: '#e63946'
    }
  },

  // ═══ 16. RA-5C (Vigilante) ═══
  {
    id: 'ra5c_vigilante',
    name: 'North American RA-5C Vigilante',
    code: 'RA-5C Trinh Sát Hải Quân',
    role: 'Trinh sát chiến lược của hải quân — 2 chiếc bị bắn rơi cả chiến dịch',
    shotDownDate: 'Rải rác 18–29/12/1972',
    creditedUnit: 'Lực lượng phòng không ba thứ quân',
    historicalContext: 'RA-5C Vigilante là máy bay trinh sát siêu thanh hiện đại nhất của Hải quân Mỹ, mang theo các dàn máy ảnh quét quang học, hồng ngoại và radar quan sát cạnh hông SLAR để trinh sát sau các đợt oanh tạc. Có 2 chiếc RA-5C bị tên lửa phòng không của ta bắn tan xác.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/RA-5C_Vigilante_RVAH-14_in_flight_1974.jpg/800px-RA-5C_Vigilante_RVAH-14_in_flight_1974.jpg',
    imageCaption: 'Máy bay trinh sát siêu âm tầm xa North American RA-5C Vigilante',
    aircraftType: 'RECON',
    specs: {
      origin: 'Hoa Kỳ (North American Aviation)',
      maxSpeed: '2.124 km/h (Mach 2.0)',
      wingspan: '16.16 m',
      bombLoad: 'Không mang bom (Trang bị pod trinh sát điện tử tổng hợp)',
      armament: 'Hệ thống cảm biến hồng ngoại AN/AAS-21, radar nhìn cạnh AN/APD-7, camera toàn cảnh'
    },
    baseScore: 300,
    baseHp: 2,
    baseSpeed: 3.1,
    colorScheme: {
      body: '#6c757d',
      wing: '#495057',
      cockpit: '#caf0f8',
      stripe: '#fca311'
    }
  },

  // ═══ 17. F-105D (Thunderchief — "Thần Sấm") ═══
  {
    id: 'f105d_thunderchief',
    name: 'Republic F-105D Thunderchief ("Thần Sấm")',
    code: 'F-105D "Thần Sấm"',
    role: 'Tiêm kích ném bom — 1 chiếc bị bắn rơi cả chiến dịch',
    shotDownDate: 'Rải rác 18–29/12/1972',
    creditedUnit: 'Lực lượng phòng không ba thứ quân',
    historicalContext: 'F-105D "Thần Sấm" từng là xương sống ném bom chủ lực của Không quân Mỹ trong chiến tranh phá hoại miền Bắc. Trong 12 ngày đêm cuối năm 1972, thêm 1 chiếc Thần Sấm F-105D đã bị hỏa lực phòng không của quân dân miền Bắc bắn hạ đền tội.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/F-105D_357th_TFS_over_North_Vietnam_1967.jpg/800px-F-105D_357th_TFS_over_North_Vietnam_1967.jpg',
    imageCaption: 'Tiêm kích ném bom siêu âm hạng nặng Republic F-105D Thunderchief',
    aircraftType: 'JET_FIGHTER',
    specs: {
      origin: 'Hoa Kỳ (Republic Aviation)',
      maxSpeed: '2.208 km/h (Mach 2.08)',
      wingspan: '10.65 m',
      bombLoad: 'Mang tới 6.4 tấn bom đạn',
      armament: '1 pháo 20mm M61A1 Vulcan (1.028 viên), tên lửa AIM-9 Sidewinder, bom nổ phá Mk 83'
    },
    baseScore: 250,
    baseHp: 2,
    baseSpeed: 2.6,
    colorScheme: {
      body: '#606c38',
      wing: '#283618',
      cockpit: '#fefae0',
      stripe: '#d62828'
    }
  },

  // ═══ 18. HH-53 (Super Jolly Green Giant) — TRỰC THĂNG ═══
  {
    id: 'hh53_super_jolly',
    name: 'Sikorsky HH-53 Super Jolly Green Giant',
    code: 'HH-53 Trực Thăng Cứu Hộ',
    role: 'Trực thăng cứu hộ chiến đấu, cứu phi công Mỹ nhảy dù — 1 chiếc duy nhất bị bắn rơi cả chiến dịch',
    shotDownDate: 'Rải rác 18–29/12/1972',
    creditedUnit: 'Lực lượng phòng không ba thứ quân',
    historicalContext: 'HH-53 là loại trực thăng bọc thép hạng nặng khổng lồ của Không quân Mỹ, được trang bị súng máy 6 nòng minigun và cần tiếp dầu trên không chuyên bay luồn sâu vào miền Bắc để giải cứu các phi công B-52 và tiêm kích Mỹ bị bắn rơi nhảy dù. Chiếc HH-53 duy nhất tham gia chiến dịch đã bị lưới lửa phòng không của ta bắn rơi tan tành.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Sikorsky_HH-53C_Super_Jolly_Green_Giant_USAF.jpg/800px-Sikorsky_HH-53C_Super_Jolly_Green_Giant_USAF.jpg',
    imageCaption: 'Trực thăng cứu hộ hạng nặng bọc thép Sikorsky HH-53 của Không quân Mỹ',
    aircraftType: 'HELICOPTER',
    specs: {
      origin: 'Hoa Kỳ (Sikorsky Aircraft)',
      maxSpeed: '315 km/h',
      wingspan: 'Đường kính cánh quạt 22 m',
      bombLoad: 'Không mang bom (Trang bị tời cứu hộ bọc thép hạng nặng)',
      armament: '3 súng máy 6 nòng xoay 7.62mm GAU-2/A hoặc pháo 12.7mm GAU-18'
    },
    baseScore: 350,
    baseHp: 3,
    baseSpeed: 1.6,
    colorScheme: {
      body: '#386641',
      wing: '#1b4332',
      cockpit: '#95d5b2',
      stripe: '#bc4749'
    }
  },

  // ═══ 19. 147-SC (Ryan Firebee) — KHÔNG NGƯỜI LÁI ═══
  {
    id: 'ryan_147sc_firebee',
    name: 'Teledyne Ryan Model 147-SC Firebee (UAV Trinh Sát)',
    code: '147-SC Máy Bay Không Người Lái',
    role: 'Máy bay trinh sát không người lái — 1 chiếc duy nhất bị bắn rơi cả chiến dịch',
    shotDownDate: 'Rải rác 18–29/12/1972',
    creditedUnit: 'Lực lượng phòng không ba thứ quân',
    historicalContext: 'Ryan 147-SC là phương tiện bay không người lái (UAV) tối tân được phóng từ máy bay mẹ DC-130, bay theo quỹ đạo lập trình sẵn ở tầm thấp để chụp ảnh trinh sát các trận địa tên lửa SAM-2 và đánh giá thiệt hại sau các đợt ném bom B-52. Chiếc UAV 147-SC duy nhất tham chiến đã bị pháo cao xạ phát hiện và bắn hạ chính xác.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Ryan_BQM-34A_Firebee_USAF.jpg/800px-Ryan_BQM-34A_Firebee_USAF.jpg',
    imageCaption: 'Máy bay trinh sát phản lực không người lái Teledyne Ryan 147-SC Firebee',
    aircraftType: 'DRONE',
    specs: {
      origin: 'Hoa Kỳ (Teledyne Ryan Aeronautical)',
      maxSpeed: '885 km/h (Mach 0.72)',
      wingspan: '4.0 m (Nhỏ gọn, khó phát hiện)',
      bombLoad: 'Không mang bom (Trang bị camera viễn thám tự động)',
      armament: 'Động cơ phản lực Continental J69-T-29, hệ thống chụp ảnh độ phân giải cao'
    },
    baseScore: 280,
    baseHp: 1,
    baseSpeed: 2.8,
    colorScheme: {
      body: '#6d597a',
      wing: '#355070',
      cockpit: '#eaac8b',
      stripe: '#e56b6f'
    }
  }
];
