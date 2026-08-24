// Historical French Aircraft Shot Down during Dien Bien Phu Campaign (13/03/1954 - 07/05/1954)

export interface HistoricalPlane {
  id: string;
  name: string;
  code: string;
  frenchUnit: string;
  role: string;
  shotDownTime: string;
  shotDownDate: string;
  shotDownLocation: string;
  creditedUnit: string;
  historicalContext: string;
  specs: {
    origin: string;
    maxSpeed: string;
    wingspan: string;
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
  {
    id: 'morane_ms500_01',
    name: 'Morane-Saulnier MS.500 Criquet',
    code: 'MS-500 "Cò Lửa"',
    frenchUnit: 'Biệt đội Quan sát Pháo binh GAOA 4',
    role: 'Máy bay trinh sát & chỉ điểm pháo binh',
    shotDownTime: '17:30',
    shotDownDate: '13/03/1954 (Ngày mở màn chiến dịch)',
    shotDownLocation: 'Khu vực Đồi Him Lam (Phân khu Bắc)',
    creditedUnit: 'Đại đội 815, Tiểu đoàn 383, Trung đoàn Pháo cao xạ 367',
    historicalContext: 'Chiếc máy bay đầu tiên của quân Pháp bị pháo cao xạ 37mm Việt Nam bắn rơi ngay trong ngày mở màn đợt tiến công tiêu diệt cứ điểm Him Lam, tước đoạt "mắt thần" chỉ điểm của pháo binh Pháp.',
    specs: {
      origin: 'Pháp / Đức chế tạo',
      maxSpeed: '175 km/h',
      wingspan: '14.25 m',
      armament: '1 súng máy MG-15 7.92mm, thiết bị vô tuyến định vị'
    },
    baseScore: 100,
    baseHp: 1,
    baseSpeed: 1.6,
    colorScheme: {
      body: '#8b8378',
      wing: '#6e675f',
      cockpit: '#87ceeb',
      stripe: '#002654'
    }
  },
  {
    id: 'f8f_bearcat_01',
    name: 'Grumman F8F-1 Bearcat',
    code: 'F8F "Mèo Hoang" No.122',
    frenchUnit: 'Không đoàn Tiêm kích GC 1/22 Saintonge',
    role: 'Tiêm kích đánh chặn & ném bom bổ nhào',
    shotDownTime: '09:15',
    shotDownDate: '15/03/1954 (Đợt 1 chiến dịch)',
    shotDownLocation: 'Thung lũng Mường Thanh (gần Độc Lập)',
    creditedUnit: 'Đại đội 816, Tiểu đoàn 383, Trung đoàn Pháo cao xạ 367',
    historicalContext: 'F8F Bearcat là tiêm kích hiện đại bậc nhất của Pháp do Mỹ viện trợ. Chiếc Bearcat này đang bổ nhào ném bom napalm vào trận địa pháo ta thì bị lưới lửa cao xạ 37mm đón đầu bắn gãy cánh bốc cháy dữ dội.',
    specs: {
      origin: 'Hoa Kỳ (Grumman)',
      maxSpeed: '732 km/h',
      wingspan: '10.92 m',
      armament: '4 pháo 20mm M3, 4 rocket HVAR, 2 bom 450kg hoặc bom Napalm'
    },
    baseScore: 250,
    baseHp: 2,
    baseSpeed: 2.5,
    colorScheme: {
      body: '#1b365d',
      wing: '#122642',
      cockpit: '#6ba4b8',
      stripe: '#ed2939'
    }
  },
  {
    id: 'c47_dakota_01',
    name: 'Douglas C-47 Skytrain / Dakota',
    code: 'C-47 "Ngựa Thồ Hàng Không"',
    frenchUnit: 'Không đoàn Vận tải GT 2/62 Franche-Comté',
    role: 'Vận tải quân sự & thả dù tiếp tế',
    shotDownTime: '11:45',
    shotDownDate: '17/03/1954',
    shotDownLocation: 'Không phận Sân bay Mường Thanh',
    creditedUnit: 'Tiểu đoàn 381, Trung đoàn Pháo cao xạ 367',
    historicalContext: 'C-47 là huyết mạch duy nhất tiếp tế đạn dược, lương thực cho tập đoàn cứ điểm Điện Biên Phủ. Pháo cao xạ ta áp sát khống chế độ cao khiến máy bay Pháp buộc phải thả dù từ trên 3.000m, phần lớn dù tiếp tế rơi sang trận địa ta.',
    specs: {
      origin: 'Hoa Kỳ (Douglas Aircraft)',
      maxSpeed: '360 km/h',
      wingspan: '29.11 m',
      armament: 'Chở 28 lính dù hoặc 3 tấn đạn dược, lương thực'
    },
    baseScore: 200,
    baseHp: 3,
    baseSpeed: 1.4,
    colorScheme: {
      body: '#556b2f',
      wing: '#3f5223',
      cockpit: '#b0e0e6',
      stripe: '#ffffff'
    }
  },
  {
    id: 'f6f_hellcat_01',
    name: 'Grumman F6F-5 Hellcat',
    code: 'F6F-5 Hellcat',
    frenchUnit: 'Hải đội 11F (Tàu sân bay Arromanches)',
    role: 'Tiêm kích hạm đội oanh tạc đường không',
    shotDownTime: '14:20',
    shotDownDate: '22/03/1954',
    shotDownLocation: 'Dãy đồi phía Đông (Đồi C1 - D1)',
    creditedUnit: 'Đại đội pháo cao xạ 828, Đại đoàn 308 phối thuộc',
    historicalContext: 'Máy bay xuất kích từ tàu sân bay Arromanches ở Vịnh Bắc Bộ bay lên chi viện cho De Castries, bị hỏa lực súng máy phòng không 12.7mm và pháo 37mm đan chéo bắn rơi tại chỗ.',
    specs: {
      origin: 'Hoa Kỳ (Grumman)',
      maxSpeed: '621 km/h',
      wingspan: '13.06 m',
      armament: '6 súng máy Browning M2 12.7mm, 2 bom 450kg'
    },
    baseScore: 280,
    baseHp: 2,
    baseSpeed: 2.3,
    colorScheme: {
      body: '#2c3e50',
      wing: '#1a252f',
      cockpit: '#7fb3d5',
      stripe: '#f1c40f'
    }
  },
  {
    id: 'b26_invader_01',
    name: 'Douglas B-26 Invader',
    code: 'B-26 Invader "Kẻ Xâm Lược"',
    frenchUnit: 'Không đoàn Oanh tạc GB 1/19 Gascogne',
    role: 'Oanh tạc cơ hạng trung ném bom hủy diệt',
    shotDownTime: '15:10',
    shotDownDate: '27/03/1954 (Đợt 2 chiến dịch)',
    shotDownLocation: 'Khu vực lòng chảo Mường Thanh',
    creditedUnit: 'Tiểu đoàn 382, Trung đoàn Pháo cao xạ 367',
    historicalContext: 'Oanh tạc cơ 2 động cơ trang bị hỏa lực cực mạnh, chuyên ném bom rải thảm và bắn phá giao thông huyết mạch kéo pháo của quân đội ta. Bị trúng loạt đạn pháo 37mm nổ tung trên không.',
    specs: {
      origin: 'Hoa Kỳ (Douglas Aircraft)',
      maxSpeed: '571 km/h',
      wingspan: '21.34 m',
      armament: '8 súng máy 12.7mm mũi, mang 2.700 kg bom các loại'
    },
    baseScore: 350,
    baseHp: 4,
    baseSpeed: 2.0,
    colorScheme: {
      body: '#4a5568',
      wing: '#2d3748',
      cockpit: '#a0aec0',
      stripe: '#e53e3e'
    }
  },
  {
    id: 'c119_flying_boxcar_01',
    name: 'Fairchild C-119 Flying Boxcar',
    code: 'C-119 "Toa Xe Bay"',
    frenchUnit: 'Biệt đội Vận tải Hỗn hợp CAT (Mỹ lái thuê cho Pháp)',
    role: 'Vận tải chiến lược siêu trọng',
    shotDownTime: '10:05',
    shotDownDate: '04/04/1954',
    shotDownLocation: 'Phân khu Nam (Hồng Cúm)',
    creditedUnit: 'Khẩu đội 3, Đại đội 817, Tiểu đoàn 383',
    historicalContext: 'Chiếc phi cơ 2 thân khổng lồ do phi công Mỹ thuộc tập đoàn CAT điều khiển chở pháo 105mm và đạn hạng nặng tiếp viện cho De Castries. Bị bắn đứt đuôi rơi cách sở chỉ huy Pháp 1.5km.',
    specs: {
      origin: 'Hoa Kỳ (Fairchild)',
      maxSpeed: '450 km/h',
      wingspan: '33.30 m',
      armament: 'Tải trọng 13.6 tấn hoặc 62 lính dù'
    },
    baseScore: 400,
    baseHp: 5,
    baseSpeed: 1.3,
    colorScheme: {
      body: '#708090',
      wing: '#4f5d6a',
      cockpit: '#add8e6',
      stripe: '#ffd700'
    }
  },
  {
    id: 'sb2c_helldiver_01',
    name: 'Curtiss SB2C-5 Helldiver',
    code: 'SB2C Helldiver "Kẻ Bổ Nhào Địa Ngục"',
    frenchUnit: 'Hải đội Không quân 3F',
    role: 'Cường kích ném bom bổ nhào',
    shotDownTime: '16:40',
    shotDownDate: '24/04/1954',
    shotDownLocation: 'Khu vực Đồi A1 (Eliane 2)',
    creditedUnit: 'Đại đội 824, Tiểu đoàn 382',
    historicalContext: 'Được mệnh danh là sát thủ bổ nhào, chiếc Helldiver đang nỗ lực cắt bom cứu nguy cho quân Pháp đang bị ta vây lấn tại đồi A1 thì bị pháo thủ ta đón điểm nổ bắn rơi cắm đầu xuống giao thông hào.',
    specs: {
      origin: 'Hoa Kỳ (Curtiss-Wright)',
      maxSpeed: '475 km/h',
      wingspan: '15.16 m',
      armament: '2 pháo 20mm, 2 súng máy 7.62mm đuôi, 1.000 kg bom'
    },
    baseScore: 300,
    baseHp: 2,
    baseSpeed: 2.2,
    colorScheme: {
      body: '#1f2937',
      wing: '#111827',
      cockpit: '#60a5fa',
      stripe: '#dc2626'
    }
  },
  {
    id: 'au1_corsair_01',
    name: 'Vought AU-1 Corsair',
    code: 'AU-1 Corsair "Cánh Chim Hải Âu"',
    frenchUnit: 'Hải đội 14F Không quân Hải quân Pháp',
    role: 'Cường kích chi viện hỏa lực tầm gần',
    shotDownTime: '13:55',
    shotDownDate: '01/05/1954 (Đợt 3 - Tổng công kích)',
    shotDownLocation: 'Cứ điểm C2 (Eliane 4)',
    creditedUnit: 'Đại đội 815, Tiểu đoàn 383, Trung đoàn 367',
    historicalContext: 'Chiếc Corsair với đôi cánh gập ngược đặc trưng là đợt tăng viện cuối cùng trong tuyệt vọng của Pháp trước khi toàn bộ tập đoàn cứ điểm Điện Biên Phủ sụp đổ ngày 07/05/1954.',
    specs: {
      origin: 'Hoa Kỳ (Chance Vought)',
      maxSpeed: '684 km/h',
      wingspan: '12.47 m',
      armament: '4 pháo 20mm M3, 8 rocket HVAR 127mm, 1.800 kg bom'
    },
    baseScore: 350,
    baseHp: 3,
    baseSpeed: 2.6,
    colorScheme: {
      body: '#0f172a',
      wing: '#020617',
      cockpit: '#38bdf8',
      stripe: '#ffffff'
    }
  }
];
