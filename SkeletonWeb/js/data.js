// K-POP 직캠 데이터베이스 (산겸짱 플랫폼용 - 실제 YouTube 영상 ID 적용)

const starterItems = [
  {
    id: "v1",
    videoId: "prHZeFppj78", // [K-Fancam] 에이티즈 산 직캠 'WORK' @뮤직뱅크 240531
    title: "최산 직캠 (ATEEZ SAN) - WORK @뮤직뱅크 240531",
    category: "남자 아이돌",
    subCategory: "인기 TOP10",
    channel: "KBS Kpop",
    date: "2024.05.31",
    duration: "3:24",
    views: "324,512",
    likes: "24.5K",
    tags: ["최산", "ATEEZ", "WORK", "뮤직뱅크", "직캠"]
  },
  {
    id: "v2",
    videoId: "x_w_v2J_D1U", // [안방1열 직캠4K] 세븐틴 도겸 'MAESTRO' @SBS 인기가요 240505
    title: "도겸 직캠 (SEVENTEEN DK) - MAESTRO @인기가요 240505",
    category: "남자 아이돌",
    subCategory: "인기 TOP10",
    channel: "스브스케이팝 ZOOM",
    date: "2024.05.05",
    duration: "3:15",
    views: "289,104",
    likes: "19.8K",
    tags: ["도겸", "SEVENTEEN", "MAESTRO", "인기가요", "직캠"]
  },
  {
    id: "v3",
    videoId: "S8L3k2q24YI", // [입덕직캠] 에이티즈 산 직캠 4K 'BOUNCY' @엠카운트다운 230622
    title: "최산 직캠 (ATEEZ SAN) - BOUNCY @엠카운트다운 230622",
    category: "남자 아이돌",
    subCategory: "인기 TOP10",
    channel: "Mnet K-POP",
    date: "2023.06.22",
    duration: "3:20",
    views: "451,209",
    likes: "35.2K",
    tags: ["최산", "ATEEZ", "BOUNCY", "엠카", "직캠"]
  },
  {
    id: "v4",
    videoId: "utu5SevmUSw", // [4K] 부석순(BSS) 파이팅해야지 Band LIVE [it's KPOP LIVE]
    title: "도겸 직캠 (BSS DK) - 파이팅 해야지 @잇츠라이브 230211",
    category: "남자 아이돌",
    subCategory: "인기 TOP10",
    channel: "it's KPOP LIVE",
    date: "2023.02.11",
    duration: "3:28",
    views: "512,304",
    likes: "42.1K",
    tags: ["도겸", "SEVENTEEN", "부석순", "파이팅해야지", "라이브"]
  },
  {
    id: "v5",
    videoId: "0k5G6M0s9eQ", // [K-Fancam] 에이티즈 산 직캠 'HALAZIA' @뮤직뱅크 230106
    title: "최산 직캠 (ATEEZ SAN) - HALAZIA @뮤직뱅크 230106",
    category: "남자 아이돌",
    subCategory: "인기 TOP10",
    channel: "KBS Kpop",
    date: "2023.01.06",
    duration: "3:22",
    views: "392,042",
    likes: "31.1K",
    tags: ["최산", "ATEEZ", "HALAZIA", "뮤직뱅크", "직캠"]
  },
  {
    id: "v6",
    videoId: "F3a37yG2m-Y", // [K-Fancam] 세븐틴 도겸 직캠 '음악의 신' @뮤직뱅크 231027
    title: "도겸 직캠 (SEVENTEEN DK) - 음악의 신 @뮤직뱅크 231027",
    category: "남자 아이돌",
    subCategory: "인기 TOP10",
    channel: "KBS Kpop",
    date: "2023.10.27",
    duration: "3:18",
    views: "214,050",
    likes: "15.4K",
    tags: ["도겸", "SEVENTEEN", "음악의신", "뮤직뱅크", "직캠"]
  },
  {
    id: "v7",
    videoId: "_t97q930oSc", // [예능연구소] ATEEZ SAN – Crazy Form @음악중심 231202
    title: "최산 직캠 (ATEEZ SAN) - 미친 폼 (Crazy Form) @음악중심 231202",
    category: "남자 아이돌",
    channel: "MBCkpop",
    date: "2023.12.02",
    duration: "3:30",
    views: "295,411",
    likes: "21.9K",
    tags: ["최산", "ATEEZ", "미친폼", "음중", "직캠"]
  },
  {
    id: "v8",
    videoId: "9L-b99qL9B4", // [안방1열] 세븐틴 도겸 직캠 'HOT' @인기가요 220605
    title: "도겸 직캠 (SEVENTEEN DK) - HOT @인기가요 220605",
    category: "남자 아이돌",
    channel: "스브스케이팝 ZOOM",
    date: "2022.06.05",
    duration: "3:21",
    views: "341,209",
    likes: "26.3K",
    tags: ["도겸", "SEVENTEEN", "HOT", "인기가요", "직캠"]
  },
  {
    id: "v9",
    videoId: "gL8Y5p4Rj0c", // [MPD직캠] 에이티즈 산 직캠 4K 'Deja Vu' @엠카 210916
    title: "최산 직캠 (ATEEZ SAN) - Deja Vu @엠카운트다운 210916",
    category: "남자 아이돌",
    channel: "Mnet K-POP",
    date: "2021.09.16",
    duration: "3:17",
    views: "589,012",
    likes: "48.2K",
    tags: ["최산", "ATEEZ", "DejaVu", "엠카", "직캠"]
  },
  {
    id: "v10",
    videoId: "vY65G-90_sE", // [MPD직캠] 세븐틴 도겸 직캠 4K '손오공 (Super)' @엠카 230427
    title: "도겸 직캠 (SEVENTEEN DK) - 손오공 (Super) @엠카 230427",
    category: "남자 아이돌",
    channel: "Mnet K-POP",
    date: "2023.04.27",
    duration: "3:19",
    views: "612,450",
    likes: "55.8K",
    tags: ["도겸", "SEVENTEEN", "손오공", "엠카", "직캠"]
  },
  // 여자 아이돌
  {
    id: "v11",
    videoId: "1Dw1E6EYwnU", // [K-Fancam] 아이브 장원영 직캠 '해야 (HEYA)' @뮤직뱅크 240503
    title: "장원영 직캠 (IVE WONYOUNG) - HEYA @뮤직뱅크 240503",
    category: "여자 아이돌",
    channel: "KBS Kpop",
    date: "2024.05.03",
    duration: "3:14",
    views: "680,240",
    likes: "61.3K",
    tags: ["장원영", "IVE", "HEYA", "뮤직뱅크", "직캠"]
  },
  {
    id: "v12",
    videoId: "7T9yYg8c71E", // [안방1열 직캠4K] 에스파 카리나 'Supernova' @인기가요 240519
    title: "카리나 직캠 (aespa KARINA) - Supernova @인기가요 240519",
    category: "여자 아이돌",
    channel: "스브스케이팝 ZOOM",
    date: "2024.05.19",
    duration: "3:18",
    views: "921,450",
    likes: "89.2K",
    tags: ["카리나", "aespa", "Supernova", "인기가요", "직캠"]
  },
  {
    id: "v13",
    videoId: "u2M7-l-Z5lE", // [#Close-upCam] IVE AN YUJIN - Accendio @음악중심 240518
    title: "안유진 직캠 (IVE YUJIN) - Accendio @음악중심 240518",
    category: "여자 아이돌",
    channel: "MBCkpop",
    date: "2024.05.18",
    duration: "3:10",
    views: "420,105",
    likes: "34.5K",
    tags: ["안유진", "IVE", "Accendio", "음중", "직캠"]
  },
  {
    id: "v14",
    videoId: "zG5d_yZ5b7o", // [입덕직캠] 에스파 윈터 직캠 4K 'Armageddon' @엠카 240530
    title: "윈터 직캠 (aespa WINTER) - Armageddon @엠카 240530",
    category: "여자 아이돌",
    channel: "Mnet K-POP",
    date: "2024.05.30",
    duration: "3:25",
    views: "580,214",
    likes: "49.8K",
    tags: ["윈터", "aespa", "Armageddon", "엠카", "직캠"]
  },
  // 음악방송 단체 무대
  {
    id: "v15",
    videoId: "u2uV7gK0P_0", // WORK - ATEEZ [뮤직뱅크/Music Bank] KBS 240531
    title: "에이티즈 (ATEEZ) - WORK @뮤직뱅크 240531 무대영상",
    category: "음악방송",
    channel: "KBS Kpop",
    date: "2024.05.31",
    duration: "3:40",
    views: "812,042",
    likes: "68.2K",
    tags: ["ATEEZ", "WORK", "뮤직뱅크", "무대영상"]
  },
  {
    id: "v16",
    videoId: "z1V8uT7V74Q", // SEVENTEEN – MAESTRO @인기가요 240505
    title: "세븐틴 (SEVENTEEN) - MAESTRO @인기가요 240505 무대영상",
    category: "음악방송",
    channel: "스브스케이팝 ZOOM",
    date: "2024.05.05",
    duration: "3:35",
    views: "1,240,512",
    likes: "102.5K",
    tags: ["SEVENTEEN", "MAESTRO", "인기가요", "무대영상"]
  }
];

// 실시간 인기 검색어 목록
const popularSearchQueries = [
  "최산 직캠",
  "도겸 직캠",
  "ATEEZ 직캠",
  "SEVENTEEN 직캠",
  "음악방송 직캠",
  "뮤직뱅크 직캠",
  "인기가요 직캠",
  "찜한 직캠",
  "팬캠",
  "콘서트 직캠"
];

// 실시간 트렌딩 태그
const trendingTags = [
  "최산",
  "도겸",
  "ATEEZ",
  "SEVENTEEN",
  "음악방송",
  "240503"
];
