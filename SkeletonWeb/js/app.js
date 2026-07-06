// ==========================================================================
// 산겸짱 K-POP FANCAM PLATFORM CORE LOGIC
// ==========================================================================

// --- 애플리케이션 상태 (State) ---
const state = {
  currentVideo: null,
  isPlaying: false,
  activeView: 'home', // 'home' | 'bookmarks' | 'random' | 'recent'
  activeCategory: '전체',
  searchQuery: '',
  selectedChips: ['최산', '도겸', 'ATEEZ', 'SEVENTEEN'], // 기본 데모 칩
  bookmarks: JSON.parse(localStorage.getItem('bookmarks')) || [],
  recentVideos: JSON.parse(localStorage.getItem('recentVideos')) || [],
  comments: JSON.parse(localStorage.getItem('comments')) || {},
  theme: localStorage.getItem('theme') || 'deep-space', // 'deep-space' | 'amoled-black'
  playbackTime: 0,
  playbackDuration: 0,
  playbackInterval: null,
  volume: parseFloat(localStorage.getItem('volume')) || 0.8,
  isMuted: false,
  commentsLimit: 3,
  
  // YouTube API 결과 캐시
  apiCache: {
    popular: null,
    male: null,
    female: null,
    tv: null
  }
};

// --- DOM 요소 캐싱 ---
const elements = {
  body: document.body,
  // 사이드바
  menuItems: document.querySelectorAll('.menu-item'),
  categoryItems: document.querySelectorAll('.category-item'),
  popularSearchList: document.getElementById('popularSearchList'),
  
  // 헤더 및 검색
  searchInput: document.getElementById('searchInput'),
  searchIconBtn: document.getElementById('searchIconBtn'),
  chipsList: document.getElementById('chipsList'),
  addChipBtn: document.getElementById('addChipBtn'),
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  themeIcon: document.getElementById('themeIcon'),
  apiKeySettingsBtn: document.getElementById('apiKeySettingsBtn'),
  
  // 모달
  apiKeyModal: document.getElementById('apiKeyModal'),
  apiKeyInput: document.getElementById('apiKeyInput'),
  closeApiKeyBtn: document.getElementById('closeApiKeyBtn'),
  saveApiKeyBtn: document.getElementById('saveApiKeyBtn'),
  
  // 메인 뷰 컨테이너
  homeView: document.getElementById('homeView'),
  bookmarksView: document.getElementById('bookmarksView'),
  randomView: document.getElementById('randomView'),
  recentView: document.getElementById('recentView'),
  
  // 대시보드 컨텐츠 & 그리드 컨텐츠
  dashboardContent: document.getElementById('dashboardContent'),
  searchGridContent: document.getElementById('searchGridContent'),
  searchGridTitle: document.getElementById('searchGridTitle'),
  searchGrid: document.getElementById('searchGrid'),
  sortSelect: document.getElementById('sortSelect'),
  btnBackHome: document.getElementById('btnBackHome'),
  
  // 캐러셀 트랙
  popularCarousel: document.getElementById('popularCarousel'),
  maleCarousel: document.getElementById('maleCarousel'),
  femaleCarousel: document.getElementById('femaleCarousel'),
  tvCarousel: document.getElementById('tvCarousel'),
  trendingChips: document.getElementById('trendingChips'),
  
  // 찜/북마크 뷰
  bookmarksGrid: document.getElementById('bookmarksGrid'),
  bookmarksEmptyState: document.getElementById('bookmarksEmptyState'),
  
  // 랜덤 뷰
  randomHighlightCard: document.getElementById('randomHighlightCard'),
  randomReBtn: document.getElementById('randomReBtn'),
  
  // 최근 본 영상
  recentGrid: document.getElementById('recentGrid'),
  recentEmptyState: document.getElementById('recentEmptyState'),
  clearRecentBtn: document.getElementById('clearRecentBtn'),
  
  // 디테일 패널
  detailPanel: document.getElementById('detailPanel'),
  playerPlaceholder: document.getElementById('playerPlaceholder'),
  ytPlayerContainer: document.getElementById('ytPlayerContainer'),
  mainYtPlayer: document.getElementById('mainYtPlayer'),
  detailTitle: document.getElementById('detailTitle'),
  detailTags: document.getElementById('detailTags'),
  detailChannel: document.getElementById('detailChannel'),
  detailViews: document.getElementById('detailViews'),
  detailLikes: document.getElementById('detailLikes'),
  detailBookmarkBtn: document.getElementById('detailBookmarkBtn'),
  detailShareBtn: document.getElementById('detailShareBtn'),
  
  // 댓글
  commentInput: document.getElementById('commentInput'),
  commentSubmitBtn: document.getElementById('commentSubmitBtn'),
  commentsCount: document.getElementById('commentsCount'),
  commentsList: document.getElementById('commentsList'),
  commentsMoreBtn: document.getElementById('commentsMoreBtn'),
  
  // 관련 영상
  relatedList: document.getElementById('relatedList'),
  
  // 바텀 플레이어 바
  barThumb: document.getElementById('barThumb'),
  barTitle: document.getElementById('barTitle'),
  barChannel: document.getElementById('barChannel'),
  controlPlayPause: document.getElementById('controlPlayPause'),
  controlPrev: document.getElementById('controlPrev'),
  controlNext: document.getElementById('controlNext'),
  controlShuffle: document.getElementById('controlShuffle'),
  controlRepeat: document.getElementById('controlRepeat'),
  timeElapsed: document.getElementById('timeElapsed'),
  timeTotal: document.getElementById('timeTotal'),
  progressBarContainer: document.getElementById('progressBarContainer'),
  progressBarFill: document.getElementById('progressBarFill'),
  progressThumb: document.getElementById('progressThumb'),
  volumeMuteBtn: document.getElementById('volumeMuteBtn'),
  volumeSliderContainer: document.getElementById('volumeSliderContainer'),
  volumeBarFill: document.getElementById('volumeBarFill'),
  volumeThumb: document.getElementById('volumeThumb')
};

// ==========================================================================
// INITIALIZER (앱 시작 설정)
// ==========================================================================

function init() {
  setupTheme();
  setupUI();
  setupEventListeners();
  renderSidebarLists();
  
  // YouTube API Key 존재 여부에 따라 초기 로드 분기
  const apiKey = localStorage.getItem('ytApiKey');
  if (apiKey) {
    loadInitialCarouselsFromYouTube(apiKey);
  } else {
    renderDashboardMock();
    // 첫 진입 시 Mock 데이터의 첫 번째 영상을 재생 대기로 로드
    if (starterItems.length > 0) {
      prepareVideo(starterItems[0], false);
    }
  }
  
  lucide.createIcons();
}

// 테마 초기 로드
function setupTheme() {
  if (state.theme === 'amoled-black') {
    elements.body.classList.add('amoled-black');
    elements.themeIcon.setAttribute('data-lucide', 'sun');
  } else {
    elements.body.classList.remove('amoled-black');
    elements.themeIcon.setAttribute('data-lucide', 'moon');
  }
}

// UI 상태 동기화
function setupUI() {
  const volPct = Math.round(state.volume * 100) + '%';
  elements.volumeBarFill.style.width = volPct;
  elements.volumeThumb.style.left = volPct;
  updateVolumeIcon();
  
  renderSearchChips();
}

// ==========================================================================
// YOUTUBE DATA API COMMUNICATION (실시간 API 연동)
// ==========================================================================

// ISO 8601 포맷 재생시간(PT3M24S 등)을 MM:SS 형식으로 변환하는 헬퍼
function parseISO8601Duration(durationStr) {
  const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;
  
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

// YouTube Data API를 통해 직캠 검색 및 상세 메타 정보 가져오기
async function fetchFromYouTube(query, maxResults = 12) {
  const apiKey = localStorage.getItem('ytApiKey');
  if (!apiKey) return null;
  
  try {
    // 1. YouTube API 비디오 검색 호출
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoEmbeddable=true&maxResults=${maxResults}&key=${apiKey}`;
    const response = await fetch(searchUrl);
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || 'Search failed');
    }
    const searchData = await response.json();
    const items = searchData.items || [];
    
    if (items.length === 0) return [];
    
    // 2. 비디오 ID들을 취합하여 통계 및 세부 정보 호출 (조회수, 좋아요수, 재생시간 획득용)
    const videoIds = items.map(item => item.id.videoId).join(',');
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${apiKey}`;
    const detailsResponse = await fetch(detailsUrl);
    if (!detailsResponse.ok) throw new Error('Details fetch failed');
    
    const detailsData = await detailsResponse.json();
    const detailsMap = {};
    (detailsData.items || []).forEach(item => {
      detailsMap[item.id] = item;
    });
    
    // 3. 템플릿에 부합하도록 직캠 데이터 맵핑
    return items.map((item, index) => {
      const vId = item.id.videoId;
      const details = detailsMap[vId] || {};
      
      const durationISO = details.contentDetails?.duration || 'PT0M0S';
      const durationFormatted = parseISO8601Duration(durationISO);
      
      const rawViews = parseInt(details.statistics?.viewCount || '0');
      const viewsFormatted = rawViews >= 10000 
        ? (rawViews / 10000).toFixed(1) + '만회' 
        : rawViews.toLocaleString() + '회';
        
      const rawLikes = parseInt(details.statistics?.likeCount || '0');
      const likesFormatted = rawLikes >= 1000 
        ? (rawLikes / 1000).toFixed(1) + 'K' 
        : rawLikes.toLocaleString();
      
      // 날짜 포맷
      const rawDate = new Date(item.snippet.publishedAt);
      const dateFormatted = `${rawDate.getFullYear()}.${String(rawDate.getMonth()+1).padStart(2,'0')}.${String(rawDate.getDate()).padStart(2,'0')}`;
      
      // 연관 칩 태그 임시 생성
      const tags = state.selectedChips.slice(0, 3);
      if (tags.length === 0) tags.push("직캠", "K-POP");
      
      return {
        id: 'yt_' + vId,
        videoId: vId,
        title: item.snippet.title,
        category: "남자 아이돌", // 검색 쿼리에 따라 추후 보정 가능
        channel: item.snippet.channelTitle,
        date: dateFormatted,
        duration: durationFormatted,
        views: viewsFormatted,
        likes: likesFormatted,
        tags: tags
      };
    });
  } catch (error) {
    console.error('YouTube Data API 오류:', error);
    return null;
  }
}

// 스케줄에 따른 스켈레톤 로더 노출 함수
function renderCarouselSkeletons() {
  const SKELETON_HTML = Array(6).fill(0).map(() => `
    <div class="video-card skeleton-card">
      <div class="card-thumbnail-wrapper skeleton-pulse" style="padding-top: 56.25%;"></div>
      <div class="card-info">
        <div class="skeleton-line title skeleton-pulse"></div>
        <div class="skeleton-line meta skeleton-pulse"></div>
      </div>
    </div>
  `).join('');

  elements.popularCarousel.innerHTML = SKELETON_HTML;
  elements.maleCarousel.innerHTML = SKELETON_HTML;
  elements.femaleCarousel.innerHTML = SKELETON_HTML;
  elements.tvCarousel.innerHTML = SKELETON_HTML;
}

// YouTube 실시간 API로 메인 대시보드 4대 카테고리 구성
async function loadInitialCarouselsFromYouTube(apiKey) {
  renderCarouselSkeletons();
  
  // 1. 인기 TOP10: "K-POP Fancam Popular" or "최산 도겸 직캠 인기"
  const popList = await fetchFromYouTube("최산 도겸 직캠 인기", 10);
  if (popList) {
    state.apiCache.popular = popList;
    elements.popularCarousel.innerHTML = popList.map((item, idx) => createVideoCardHTML(item, idx + 1)).join('');
  } else {
    // API 에러 시 강제 Mock 백업
    renderDashboardMock();
    return;
  }

  // 2. 남자 아이돌: "ATEEZ SEVENTEEN 직캠"
  const maleList = await fetchFromYouTube("ATEEZ SEVENTEEN 직캠", 8);
  if (maleList) {
    state.apiCache.male = maleList;
    elements.maleCarousel.innerHTML = maleList.map(item => createVideoCardHTML(item)).join('');
  }

  // 3. 여자 아이돌: "IVE aespa NewJeans 직캠"
  const femaleList = await fetchFromYouTube("IVE aespa NewJeans 직캠", 8);
  if (femaleList) {
    state.apiCache.female = femaleList;
    elements.femaleCarousel.innerHTML = femaleList.map(item => createVideoCardHTML(item)).join('');
  }

  // 4. 음악방송: "음악방송 무대 교차편집"
  const tvList = await fetchFromYouTube("음악방송 무대 교차편집", 8);
  if (tvList) {
    state.apiCache.tv = tvList;
    elements.tvCarousel.innerHTML = tvList.map(item => createVideoCardHTML(item)).join('');
  }
  
  // 첫 진입 시 캐시된 영상 중 첫 번째 재생 대기
  const firstVideo = state.apiCache.popular?.[0];
  if (firstVideo) {
    prepareVideo(firstVideo, false);
  }
  
  bindCardEvents();
  lucide.createIcons();
}

// Mock 데이터로 대시보드 구성 (API Key 미설정 시)
function renderDashboardMock() {
  // 인기 TOP10 (rank_badge 포함)
  const popularItems = starterItems.filter(item => item.subCategory === '인기 TOP10').slice(0, 10);
  elements.popularCarousel.innerHTML = popularItems.map((item, idx) => createVideoCardHTML(item, idx + 1)).join('');
  
  // 남자 아이돌
  const maleItems = starterItems.filter(item => item.category === '남자 아이돌');
  elements.maleCarousel.innerHTML = maleItems.map(item => createVideoCardHTML(item)).join('');
  
  // 여자 아이돌
  const femaleItems = starterItems.filter(item => item.category === '여자 아이돌');
  elements.femaleCarousel.innerHTML = femaleItems.map(item => createVideoCardHTML(item)).join('');
  
  // 음악방송
  const tvItems = starterItems.filter(item => item.category === '음악방송');
  elements.tvCarousel.innerHTML = tvItems.map(item => createVideoCardHTML(item)).join('');
  
  bindCardEvents();
}

// 통합 영상 탐색 헬퍼 (Mock과 API 연동 결과를 모두 병합해 ID를 검색)
function findVideoById(id) {
  // 1. Mock 데이터 우선 탐색
  let video = starterItems.find(v => v.id === id);
  if (video) return video;
  
  // 2. YouTube API 캐시 탐색
  const caches = [state.apiCache.popular, state.apiCache.male, state.apiCache.female, state.apiCache.tv];
  for (const cache of caches) {
    if (cache) {
      video = cache.find(v => v.id === id);
      if (video) return video;
    }
  }
  
  // 3. 최근 본 영상이나 찜에만 존재하는 외래 YouTube 영상 복원
  // videoId 파싱 시 id 자체가 "yt_videoId" 형태로 구성되어 있으므로 dynamic 복원
  if (id.startsWith('yt_')) {
    const rawVideoId = id.substring(3);
    return {
      id: id,
      videoId: rawVideoId,
      title: "재생 중인 YouTube 영상",
      category: "YouTube",
      channel: "YouTube Channel",
      date: "2024.01.01",
      duration: "3:00",
      views: "10만회",
      likes: "1K",
      tags: ["YouTube"]
    };
  }
  
  return null;
}

// ==========================================================================
// DATA RENDERING & INTERACTIONS (사이드바 리스트 및 카드 생성)
// ==========================================================================

function renderSidebarLists() {
  // 인기 검색어 TOP10 렌더링
  elements.popularSearchList.innerHTML = popularSearchQueries.map((query, index) => `
    <li data-query="${query}">
      <span class="rank-badge">${index + 1}</span>
      <span class="search-text">${query}</span>
    </li>
  `).join('');

  elements.popularSearchList.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () => {
      const q = li.getAttribute('data-query');
      elements.searchInput.value = q;
      state.searchQuery = q;
      performCompoundSearch();
    });
  });

  // 메인 대시보드 하단 실시간 인기 검색어 칩 렌더링
  elements.trendingChips.innerHTML = popularSearchQueries.map((query, index) => `
    <div class="trending-chip" data-query="${query}">
      <span class="rank-num">${index + 1}</span>
      <span>${query}</span>
      <i data-lucide="plus" style="width:12px; height:12px;"></i>
    </div>
  `).join('');

  elements.trendingChips.querySelectorAll('.trending-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.getAttribute('data-query');
      if (!state.selectedChips.includes(query)) {
        state.selectedChips.push(query);
        renderSearchChips();
        performCompoundSearch();
      }
    });
  });
  
  lucide.createIcons();
}

function createVideoCardHTML(item, rank = null) {
  const isBookmarked = state.bookmarks.includes(item.id);
  const activeClass = isBookmarked ? 'active' : '';

  // hqdefault: 더 큰 해상도 / mqdefault → default 폴백 체인
  const thumbnailSrc = `https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`;
  const fallback1 = `https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`;
  const fallback2 = `https://img.youtube.com/vi/${item.videoId}/default.jpg`;
  
  return `
    <div class="video-card" data-id="${item.id}" data-videoid="${item.videoId}">
      <div class="card-thumbnail-wrapper">
        <img class="card-thumbnail" src="${thumbnailSrc}" alt="${item.title}" loading="lazy"
          onerror="if(this.src.includes('hqdefault')){this.src='${fallback1}'}else if(this.src.includes('mqdefault')){this.src='${fallback2}'}else{this.style.display='none'}" />
        ${rank ? `
          <div class="card-overlay-top-left">
            <span class="rank-badge-overlay">${rank}</span>
          </div>
        ` : ''}
        <div class="card-overlay-top-right">
          <button class="card-bookmark-btn ${activeClass}" data-id="${item.id}" title="찜하기">
            <i data-lucide="heart"></i>
          </button>
        </div>
        <span class="card-duration-badge">${item.duration}</span>
      </div>
      <div class="card-info">
        <h3 class="card-title">${item.title}</h3>
        <div class="card-meta-row">
          <span class="card-channel">${item.channel}</span>
          <span class="card-views-date">${item.date.slice(2)}</span>
        </div>
      </div>
    </div>
  `;
}

function bindCardEvents() {
  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-bookmark-btn')) {
        e.stopPropagation();
        const btn = e.target.closest('.card-bookmark-btn');
        const id = btn.getAttribute('data-id');
        toggleBookmark(id, btn);
        return;
      }
      
      const id = card.getAttribute('data-id');
      const item = findVideoById(id);
      if (item) {
        selectVideo(item);
      }
    });
  });
}

function toggleBookmark(id, buttonEl = null) {
  const idx = state.bookmarks.indexOf(id);
  let isAdded = false;
  if (idx > -1) {
    state.bookmarks.splice(idx, 1);
  } else {
    state.bookmarks.push(id);
    isAdded = true;
  }
  
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
  
  if (buttonEl) {
    buttonEl.classList.toggle('active', isAdded);
  }
  
  if (state.currentVideo && state.currentVideo.id === id) {
    elements.detailBookmarkBtn.classList.toggle('active', isAdded);
  }
  
  if (state.activeView === 'bookmarks') {
    renderBookmarksView();
  }
  
  document.querySelectorAll(`.card-bookmark-btn[data-id="${id}"]`).forEach(btn => {
    btn.classList.toggle('active', isAdded);
  });
}

// ==========================================================================
// VIDEO SELECTION & PLAYER CONTROLS (재생바 컨트롤러)
// ==========================================================================

function selectVideo(video) {
  prepareVideo(video, true);
  addToRecent(video.id);
}

function prepareVideo(video, autoplay = false) {
  state.currentVideo = video;
  
  elements.detailTitle.textContent = video.title;
  elements.detailChannel.textContent = video.channel;
  elements.detailViews.textContent = video.views;
  elements.detailLikes.textContent = video.likes;
  
  elements.detailTags.innerHTML = video.tags.map(tag => `<span>#${tag}</span>`).join('');
  
  const isBookmarked = state.bookmarks.includes(video.id);
  elements.detailBookmarkBtn.classList.toggle('active', isBookmarked);
  
  // 우측 플레이어: YouTube iframe 임베드 (youtube-nocookie.com 사용으로 호환성 향상)
  const ytUrl = `https://www.youtube.com/watch?v=${video.videoId}`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&enablejsapi=1&rel=0&origin=${window.location.origin}`;

  elements.playerPlaceholder.classList.add('hidden');
  elements.ytPlayerContainer.classList.remove('hidden');

  // 썸네일 클릭 시 YouTube로 새 탭에서 열기 + iframe 임베드 시도
  const safeTitle = video.title.replace(/'/g, '&#39;').replace(/"/g, '&quot;');
  elements.ytPlayerContainer.innerHTML = `
    <iframe id="mainYtPlayer" width="100%" height="100%"
      src="${embedUrl}"
      title="${safeTitle}" frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
      allowfullscreen referrerpolicy="no-referrer-when-downgrade"
      sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"></iframe>
    <div class="yt-fallback-overlay" id="ytFallbackOverlay" style="display:none;">
      <div class="yt-thumbnail-player">
        <img 
          src="https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg"
          alt="${safeTitle}"
          onerror="if(this.src.includes('hqdefault')){this.src='https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg'}"
        />
        <div class="yt-thumb-play-overlay">
          <div class="yt-thumb-play-icon">
            <i data-lucide="play"></i>
          </div>
          <p>유튜브에서 시청하기</p>
          <span class="yt-open-hint">선택하시면 바로 재생됩니다.</span>
        </div>
      </div>
    </div>
  `;
  
  // iframe 로드 실패 시 폴백 오버레이 표시
  const iframe = elements.ytPlayerContainer.querySelector('iframe');
  const fallbackOverlay = document.getElementById('ytFallbackOverlay');
  
  if (iframe) {
    iframe.addEventListener('error', () => {
      iframe.style.display = 'none';
      if (fallbackOverlay) fallbackOverlay.style.display = 'flex';
    });
    
    // file:// 프로토콜인 경우 iframe이 작동하지 않으므로 바로 폴백 표시
    if (window.location.protocol === 'file:') {
      iframe.style.display = 'none';
      if (fallbackOverlay) fallbackOverlay.style.display = 'flex';
    }
  }
  
  // 폴백 오버레이 클릭 시 YouTube로 이동
  if (fallbackOverlay) {
    fallbackOverlay.addEventListener('click', () => {
      window.open(ytUrl, '_blank', 'noopener,noreferrer');
    });
  }
  
  lucide.createIcons();
  
  if (window.innerWidth <= 1024) {
    elements.detailPanel.classList.add('open');
  }

  elements.barThumb.src = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
  elements.barThumb.onerror = function() { this.src = `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`; };
  elements.barTitle.textContent = video.title;
  elements.barChannel.textContent = video.channel;
  
  const durationParts = video.duration.split(':').map(Number);
  state.playbackDuration = durationParts.length === 2 
    ? (durationParts[0] * 60) + durationParts[1]
    : (durationParts[0] * 3600) + (durationParts[1] * 60) + durationParts[2];
    
  elements.timeTotal.textContent = video.duration;
  state.playbackTime = 0;
  updatePlaybackProgressUI();
  
  if (autoplay) {
    startPlaybackSimulation();
  } else {
    stopPlaybackSimulation();
  }
  
  renderRelatedVideos(video);
  renderComments(video.id);
}

function addToRecent(id) {
  const index = state.recentVideos.indexOf(id);
  if (index > -1) {
    state.recentVideos.splice(index, 1);
  }
  state.recentVideos.unshift(id);
  
  if (state.recentVideos.length > 20) {
    state.recentVideos.pop();
  }
  
  localStorage.setItem('recentVideos', JSON.stringify(state.recentVideos));
  
  if (state.activeView === 'recent') {
    renderRecentView();
  }
}

function renderRelatedVideos(currentVideo) {
  // 동일 카테고리이거나 해시태그 일부가 매칭되는 관련 비디오 추천
  const itemsPool = localStorage.getItem('ytApiKey') && state.apiCache.popular
    ? [...starterItems, ...state.apiCache.popular]
    : starterItems;

  const related = itemsPool
    .filter(item => item.id !== currentVideo.id && (item.category === currentVideo.category || item.tags.some(t => currentVideo.tags.includes(t))))
    .slice(0, 4);
    
  elements.relatedList.innerHTML = related.map(item => `
    <div class="related-item-card" data-id="${item.id}">
      <div class="related-thumb-wrapper">
        <img class="related-thumb" src="https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg" alt="${item.title}" />
        <span class="related-duration">${item.duration}</span>
      </div>
      <div class="related-meta">
        <h4 class="related-title">${item.title}</h4>
        <span class="related-channel">${item.channel}</span>
      </div>
    </div>
  `).join('');
  
  elements.relatedList.querySelectorAll('.related-item-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      const item = findVideoById(id);
      if (item) selectVideo(item);
    });
  });
}

function startPlaybackSimulation() {
  stopPlaybackSimulation();
  state.isPlaying = true;
  elements.controlPlayPause.innerHTML = '<i data-lucide="pause"></i>';
  elements.controlPlayPause.style.background = 'linear-gradient(135deg, var(--secondary), var(--primary))';
  lucide.createIcons();
  
  state.playbackInterval = setInterval(() => {
    if (state.playbackTime < state.playbackDuration) {
      state.playbackTime++;
      updatePlaybackProgressUI();
    } else {
      stopPlaybackSimulation();
      handleVideoEnded();
    }
  }, 1000);
}

function stopPlaybackSimulation() {
  state.isPlaying = false;
  elements.controlPlayPause.innerHTML = '<i data-lucide="play"></i>';
  elements.controlPlayPause.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
  lucide.createIcons();
  
  if (state.playbackInterval) {
    clearInterval(state.playbackInterval);
    state.playbackInterval = null;
  }
}

function handleVideoEnded() {
  const isRepeat = elements.controlRepeat.classList.contains('active');
  if (isRepeat) {
    selectVideo(state.currentVideo);
  } else {
    playNextVideo();
  }
}

function playNextVideo() {
  if (!state.currentVideo) return;
  const itemsPool = localStorage.getItem('ytApiKey') && state.apiCache.popular
    ? state.apiCache.popular
    : starterItems;

  const currentIdx = itemsPool.findIndex(v => v.id === state.currentVideo.id);
  let nextIdx = currentIdx + 1;
  
  if (elements.controlShuffle.classList.contains('active')) {
    nextIdx = Math.floor(Math.random() * itemsPool.length);
  } else if (nextIdx >= itemsPool.length || nextIdx < 0) {
    nextIdx = 0;
  }
  
  selectVideo(itemsPool[nextIdx]);
}

function playPrevVideo() {
  if (!state.currentVideo) return;
  const itemsPool = localStorage.getItem('ytApiKey') && state.apiCache.popular
    ? state.apiCache.popular
    : starterItems;

  const currentIdx = itemsPool.findIndex(v => v.id === state.currentVideo.id);
  let prevIdx = currentIdx - 1;
  
  if (prevIdx < 0) {
    prevIdx = itemsPool.length - 1;
  }
  
  selectVideo(itemsPool[prevIdx]);
}

function updatePlaybackProgressUI() {
  const elapsedMin = Math.floor(state.playbackTime / 60);
  const elapsedSec = Math.floor(state.playbackTime % 60);
  elements.timeElapsed.textContent = `${String(elapsedMin).padStart(2, '0')}:${String(elapsedSec).padStart(2, '0')}`;
  
  const progressPct = (state.playbackTime / state.playbackDuration) * 100;
  elements.progressBarFill.style.width = `${progressPct}%`;
  elements.progressThumb.style.left = `${progressPct}%`;
}

function updateVolumeIcon() {
  let iconName = 'volume-2';
  if (state.isMuted || state.volume === 0) {
    iconName = 'volume-x';
  } else if (state.volume < 0.3) {
    iconName = 'volume';
  } else if (state.volume < 0.7) {
    iconName = 'volume-1';
  }
  elements.volumeMuteBtn.innerHTML = `<i data-lucide="${iconName}"></i>`;
  lucide.createIcons();
}

// ==========================================================================
// VIEW SWITCHER (네비게이션 뷰 포워더)
// ==========================================================================

function switchView(viewName) {
  state.activeView = viewName;
  
  elements.homeView.classList.toggle('active', viewName === 'home');
  elements.bookmarksView.classList.toggle('active', viewName === 'bookmarks');
  elements.randomView.classList.toggle('active', viewName === 'random');
  elements.recentView.classList.toggle('active', viewName === 'recent');
  
  elements.menuItems.forEach(item => {
    const itemTarget = item.getAttribute('data-view');
    item.classList.toggle('active', itemTarget === viewName);
  });
  
  if (viewName !== 'home') {
    elements.categoryItems.forEach(cat => cat.classList.remove('active'));
    elements.searchGridContent.classList.add('hidden');
    elements.dashboardContent.classList.remove('hidden');
  } else {
    const allCat = Array.from(elements.categoryItems).find(c => c.getAttribute('data-category') === '전체');
    if (allCat) {
      elements.categoryItems.forEach(c => c.classList.remove('active'));
      allCat.classList.add('active');
    }
  }

  if (viewName === 'bookmarks') {
    renderBookmarksView();
  } else if (viewName === 'random') {
    renderRandomView();
  } else if (viewName === 'recent') {
    renderRecentView();
  }
}

function renderBookmarksView() {
  const bookmarkedItems = state.bookmarks.map(id => findVideoById(id)).filter(Boolean);
  
  if (bookmarkedItems.length === 0) {
    elements.bookmarksGrid.innerHTML = '';
    elements.bookmarksEmptyState.classList.remove('hidden');
  } else {
    elements.bookmarksEmptyState.classList.add('hidden');
    elements.bookmarksGrid.innerHTML = bookmarkedItems.map(item => createVideoCardHTML(item)).join('');
    bindCardEvents();
  }
  lucide.createIcons();
}

function renderRecentView() {
  const recentItems = state.recentVideos.map(id => findVideoById(id)).filter(Boolean);
    
  if (recentItems.length === 0) {
    elements.recentGrid.innerHTML = '';
    elements.recentEmptyState.classList.remove('hidden');
  } else {
    elements.recentEmptyState.classList.add('hidden');
    elements.recentGrid.innerHTML = recentItems.map(item => createVideoCardHTML(item)).join('');
    bindCardEvents();
  }
  lucide.createIcons();
}

function renderRandomView() {
  const itemsPool = localStorage.getItem('ytApiKey') && state.apiCache.popular
    ? state.apiCache.popular
    : starterItems;

  if (itemsPool.length === 0) return;
  const randIndex = Math.floor(Math.random() * itemsPool.length);
  const video = itemsPool[randIndex];
  
  elements.randomHighlightCard.innerHTML = createVideoCardHTML(video);
  bindCardEvents();
}

// ==========================================================================
// SEARCH & COMPLEX FILTERS (실시간 YouTube 검색 및 복합 필터)
// ==========================================================================

function renderSearchChips() {
  elements.chipsList.innerHTML = state.selectedChips.map(chip => `
    <div class="chip" data-val="${chip}">
      <span>#${chip}</span>
      <button class="chip-delete" aria-label="칩 삭제"><i data-lucide="x" style="width:12px; height:12px;"></i></button>
    </div>
  `).join('');
  
  elements.chipsList.querySelectorAll('.chip-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const chipVal = btn.closest('.chip').getAttribute('data-val');
      state.selectedChips = state.selectedChips.filter(c => c !== chipVal);
      renderSearchChips();
      performCompoundSearch();
    });
  });
  
  lucide.createIcons();
}

// API Key 존재 유무에 따라 실시간 YouTube 검색 또는 로컬 Mock 필터 처리
async function performCompoundSearch() {
  if (state.activeView !== 'home') {
    switchView('home');
  }
  
  const textInput = state.searchQuery.trim().toLowerCase();
  
  // 복합 검색 쿼리 조립
  // 칩들 + 입력창 문자열
  const combinedTerms = [...state.selectedChips];
  if (textInput) combinedTerms.push(textInput);
  
  // 카테고리 태그 추가
  if (state.activeCategory !== '전체') {
    combinedTerms.push(state.activeCategory + " 직캠");
  }
  
  const compoundQuery = combinedTerms.join(' ');
  const apiKey = localStorage.getItem('ytApiKey');
  
  // 검색 조건이 유무 확인
  const hasSearchConditions = textInput !== '' || state.selectedChips.length > 0 || state.activeCategory !== '전체';
  
  if (hasSearchConditions) {
    elements.dashboardContent.classList.add('hidden');
    elements.searchGridContent.classList.remove('hidden');
    
    // 타이틀 작성
    let titleStr = '';
    if (state.activeCategory !== '전체') titleStr += `[${state.activeCategory}] `;
    if (state.selectedChips.length > 0) titleStr += `${state.selectedChips.map(c=>`#${c}`).join(' ')} `;
    if (textInput) titleStr += `"${textInput}" `;
    titleStr += `검색 중...`;
    elements.searchGridTitle.textContent = titleStr;
    
    // 1. YouTube Data API 사용처
    if (apiKey) {
      // 그리드 영역에 스켈레톤 로더 임시 렌더링
      elements.searchGrid.innerHTML = Array(8).fill(0).map(() => `
        <div class="video-card skeleton-card">
          <div class="card-thumbnail-wrapper skeleton-pulse" style="padding-top:56.25%;"></div>
          <div class="card-info">
            <div class="skeleton-line title skeleton-pulse"></div>
            <div class="skeleton-line meta skeleton-pulse"></div>
          </div>
        </div>
      `).join('');
      
      const apiResults = await fetchFromYouTube(compoundQuery, 24);
      if (apiResults) {
        // 정렬 적용
        applyResultsSorting(apiResults);
        
        elements.searchGridTitle.textContent = `${state.activeCategory !== '전체' ? `[${state.activeCategory}] ` : ''}실시간 검색 결과 (${apiResults.length}개)`;
        if (apiResults.length === 0) {
          renderSearchEmptyState();
        } else {
          elements.searchGrid.innerHTML = apiResults.map(item => createVideoCardHTML(item)).join('');
          
          // API 결과를 앱 캐시에 추가 바인딩 (재생 클릭 대응용)
          if (!state.apiCache.popular) state.apiCache.popular = [];
          // 중복 방지 추가
          apiResults.forEach(res => {
            if (!state.apiCache.popular.some(c => c.id === res.id)) {
              state.apiCache.popular.push(res);
            }
          });
        }
      } else {
        // API 페치 실패 시 로컬 Mock 폴백 작동
        performMockSearchFallback(textInput);
      }
    } else {
      // 2. 로컬 Mock 데이터 검색
      performMockSearchFallback(textInput);
    }
  } else {
    // 조건이 비어있으면 홈화면 대시보드로 복귀
    elements.searchGridContent.classList.add('hidden');
    elements.dashboardContent.classList.remove('hidden');
  }
  
  bindCardEvents();
  lucide.createIcons();
}

// 로컬 백업 검색 처리
function performMockSearchFallback(textInput) {
  let filtered = [...starterItems];
  
  if (state.activeCategory !== '전체') {
    if (state.activeCategory === '인기 TOP10') {
      filtered = filtered.filter(item => item.subCategory === '인기 TOP10');
    } else {
      filtered = filtered.filter(item => item.category === state.activeCategory);
    }
  }
  
  if (state.selectedChips.length > 0) {
    filtered = filtered.filter(item => {
      return state.selectedChips.some(chip => {
        const c = chip.toLowerCase();
        return item.title.toLowerCase().includes(c) || 
               item.channel.toLowerCase().includes(c) || 
               item.tags.some(t => t.toLowerCase().includes(c));
      });
    });
  }
  
  if (textInput) {
    filtered = filtered.filter(item => {
      return item.title.toLowerCase().includes(textInput) || 
             item.channel.toLowerCase().includes(textInput) || 
             item.tags.some(t => t.toLowerCase().includes(textInput));
    });
  }
  
  applyResultsSorting(filtered);
  
  elements.searchGridTitle.textContent = `${state.activeCategory !== '전체' ? `[${state.activeCategory}] ` : ''}Mock 검색 결과 (${filtered.length}개)`;
  
  if (filtered.length === 0) {
    renderSearchEmptyState();
  } else {
    elements.searchGrid.innerHTML = filtered.map(item => createVideoCardHTML(item)).join('');
  }
}

// 결과 정렬 헬퍼
function applyResultsSorting(items) {
  const sortBy = elements.sortSelect.value;
  if (sortBy === 'newest') {
    items.sort((a, b) => new Date(b.date.replace(/\./g, '-')) - new Date(a.date.replace(/\./g, '-')));
  } else if (sortBy === 'popular') {
    items.sort((a, b) => {
      const vA = parseFloat(a.views.replace(/[^0-9.]/g, '')) * (a.views.includes('만') ? 10000 : 1);
      const vB = parseFloat(b.views.replace(/[^0-9.]/g, '')) * (b.views.includes('만') ? 10000 : 1);
      return vB - vA;
    });
  } else if (sortBy === 'likes') {
    items.sort((a, b) => {
      const lA = parseFloat(a.likes.replace(/[K]/g, '')) * (a.likes.includes('K') ? 1000 : 1);
      const lB = parseFloat(b.likes.replace(/[K]/g, '')) * (b.likes.includes('K') ? 1000 : 1);
      return lB - lA;
    });
  }
}

function renderSearchEmptyState() {
  elements.searchGrid.innerHTML = `
    <div class="empty-state" style="grid-column: 1 / -1;">
      <i data-lucide="search-code" style="width:48px; height:48px;"></i>
      <p>조건에 부합하는 K-POP 직캠을 찾지 못했습니다.<br>검색어 또는 칩 설정을 확인해 보세요!</p>
    </div>
  `;
}

// 카테고리 전용 필터 함수 (칩/검색어와 독립적으로 작동)
function performCategoryFilter(category) {
  elements.dashboardContent.classList.add('hidden');
  elements.searchGridContent.classList.remove('hidden');
  
  // Mock 데이터에서 카테고리별 필터링
  let filtered = [...starterItems];
  
  if (category === '인기 TOP10') {
    filtered = filtered.filter(item => item.subCategory === '인기 TOP10');
  } else {
    filtered = filtered.filter(item => item.category === category);
  }
  
  // API 캐시에서도 카테고리에 맞는 영상 추가
  const cacheMap = {
    '인기 TOP10': state.apiCache.popular,
    '남자 아이돌': state.apiCache.male,
    '여자 아이돌': state.apiCache.female,
    '음악방송': state.apiCache.tv
  };
  
  const cacheItems = cacheMap[category];
  if (cacheItems && cacheItems.length > 0) {
    // 중복 방지하며 API 캐시 결과 병합
    cacheItems.forEach(item => {
      if (!filtered.some(f => f.id === item.id)) {
        filtered.push(item);
      }
    });
  }
  
  // 정렬 적용
  applyResultsSorting(filtered);
  
  elements.searchGridTitle.textContent = `[${category}] 검색 결과 (${filtered.length}개)`;
  
  if (filtered.length === 0) {
    renderSearchEmptyState();
  } else {
    elements.searchGrid.innerHTML = filtered.map(item => createVideoCardHTML(item)).join('');
  }
  
  bindCardEvents();
  lucide.createIcons();
}

// ==========================================================================
// LOCAL COMMENTS PROCESS (로컬 댓글 모듈)
// ==========================================================================

function renderComments(videoId) {
  const list = state.comments[videoId] || [];
  elements.commentsCount.textContent = list.length;
  
  if (list.length === 0) {
    elements.commentsList.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); font-size:12px; padding: 20px 0;">
        첫 번째 댓글을 달아주세요!
      </div>
    `;
    elements.commentsMoreBtn.style.display = 'none';
    return;
  }
  
  const sortedComments = [...list].sort((a, b) => b.timestamp - a.timestamp);
  const visibleComments = sortedComments.slice(0, state.commentsLimit);
  
  elements.commentsList.innerHTML = visibleComments.map(c => {
    const timeStr = formatRelativeTime(c.timestamp);
    const userInitial = c.username.charAt(0).toUpperCase();
    
    return `
      <div class="comment-item" data-id="${c.id}">
        <div class="comment-avatar">${userInitial}</div>
        <div class="comment-body">
          <div class="comment-user-row">
            <span class="comment-username">${c.username}</span>
            <span class="comment-date">${timeStr}</span>
          </div>
          <p class="comment-text">${escapeHtml(c.text)}</p>
          <div class="comment-actions">
            <button class="comment-like-btn" title="좋아요">
              <i data-lucide="heart" style="width:10px; height:10px;"></i>
              <span>${c.likes || 0}</span>
            </button>
            <button class="comment-delete-btn" data-id="${c.id}">삭제</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  if (list.length > state.commentsLimit) {
    elements.commentsMoreBtn.style.display = 'flex';
  } else {
    elements.commentsMoreBtn.style.display = 'none';
  }
  
  elements.commentsList.querySelectorAll('.comment-delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const commId = btn.getAttribute('data-id');
      deleteComment(videoId, commId);
    });
  });
  
  elements.commentsList.querySelectorAll('.comment-like-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const commItem = btn.closest('.comment-item');
      const commId = commItem.getAttribute('data-id');
      likeComment(videoId, commId, btn);
    });
  });
  
  lucide.createIcons();
}

function addComment(videoId, text) {
  if (!text.trim()) return;
  
  const newComment = {
    id: 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    username: '산겸러버',
    text: text,
    timestamp: Date.now(),
    likes: 0
  };
  
  if (!state.comments[videoId]) {
    state.comments[videoId] = [];
  }
  
  state.comments[videoId].push(newComment);
  localStorage.setItem('comments', JSON.stringify(state.comments));
  
  renderComments(videoId);
}

function deleteComment(videoId, commentId) {
  if (!state.comments[videoId]) return;
  state.comments[videoId] = state.comments[videoId].filter(c => c.id !== commentId);
  localStorage.setItem('comments', JSON.stringify(state.comments));
  
  renderComments(videoId);
}

function likeComment(videoId, commentId, buttonEl) {
  if (!state.comments[videoId]) return;
  const comment = state.comments[videoId].find(c => c.id === commentId);
  if (!comment) return;
  
  const isLiked = buttonEl.classList.contains('active');
  if (isLiked) {
    comment.likes--;
    buttonEl.classList.remove('active');
  } else {
    comment.likes++;
    buttonEl.classList.add('active');
  }
  
  localStorage.setItem('comments', JSON.stringify(state.comments));
  buttonEl.querySelector('span').textContent = comment.likes;
}

function formatRelativeTime(timestamp) {
  const diff = Date.now() - timestamp;
  const sec = 1000;
  const min = sec * 60;
  const hr = min * 60;
  const day = hr * 24;
  
  if (diff < min) return '방금 전';
  if (diff < hr) return `${Math.floor(diff / min)}분 전`;
  if (diff < day) return `${Math.floor(diff / hr)}시간 전`;
  
  const dateObj = new Date(timestamp);
  return `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==========================================================================
// EVENT LISTENERS (인터랙션 바인딩)
// ==========================================================================

function setupEventListeners() {
  
  elements.menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = item.getAttribute('data-view');
      switchView(targetView);
    });
  });
  
  elements.categoryItems.forEach(cat => {
    cat.addEventListener('click', (e) => {
      e.preventDefault();
      elements.categoryItems.forEach(c => c.classList.remove('active'));
      cat.classList.add('active');
      
      const category = cat.getAttribute('data-category');
      state.activeCategory = category;
      
      // 카테고리 변경 시 뷰를 홈으로 전환
      if (state.activeView !== 'home') {
        switchView('home');
      }
      
      // '전체보기' 선택 시 대시보드로 복귀, 그 외에는 카테고리 필터링 검색
      if (category === '전체') {
        // 칩과 검색어 초기화 없이 대시보드 표시
        elements.searchGridContent.classList.add('hidden');
        elements.dashboardContent.classList.remove('hidden');
      } else {
        // 해당 카테고리의 영상을 필터링하여 보여주기
        performCategoryFilter(category);
      }
    });
  });
  
  elements.searchInput.addEventListener('keyup', (e) => {
    state.searchQuery = e.target.value;
    if (e.key === 'Enter') {
      const text = e.target.value.trim();
      if (text && !state.selectedChips.includes(text)) {
        state.selectedChips.push(text);
        elements.searchInput.value = '';
        state.searchQuery = '';
        renderSearchChips();
      }
      performCompoundSearch();
    }
  });

  // 돋보기 버튼 클릭 시에도 검색 실행
  if (elements.searchIconBtn) {
    elements.searchIconBtn.addEventListener('click', () => {
      const text = elements.searchInput.value.trim();
      if (text && !state.selectedChips.includes(text)) {
        state.selectedChips.push(text);
        elements.searchInput.value = '';
        state.searchQuery = '';
        renderSearchChips();
      }
      performCompoundSearch();
      elements.searchInput.focus();
    });
  }


  
  elements.sortSelect.addEventListener('change', () => {
    performCompoundSearch();
  });
  
  elements.addChipBtn.addEventListener('click', () => {
    const text = elements.searchInput.value.trim();
    if (text && !state.selectedChips.includes(text)) {
      state.selectedChips.push(text);
      elements.searchInput.value = '';
      state.searchQuery = '';
      renderSearchChips();
      performCompoundSearch();
    }
  });
  
  document.querySelectorAll('.carousel-section').forEach(sec => {
    const track = sec.querySelector('.carousel-track');
    const leftBtn = sec.querySelector('.carousel-arrow.left');
    const rightBtn = sec.querySelector('.carousel-arrow.right');
    
    if (track && leftBtn && rightBtn) {
      leftBtn.addEventListener('click', () => {
        track.scrollBy({ left: -300, behavior: 'smooth' });
      });
      rightBtn.addEventListener('click', () => {
        track.scrollBy({ left: 300, behavior: 'smooth' });
      });
    }
  });
  
  // 더보기 버튼 클릭 시 해당 카테고리 필터 실행
  document.querySelectorAll('.see-more-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');
      if (category) {
        // 사이드바 카테고리도 동기화
        elements.categoryItems.forEach(c => c.classList.remove('active'));
        const matchCat = Array.from(elements.categoryItems).find(c => c.getAttribute('data-category') === category);
        if (matchCat) matchCat.classList.add('active');
        
        state.activeCategory = category;
        performCategoryFilter(category);
      }
    });
  });
  
  // 닫기 버튼: 대시보드로 복귀 + 카테고리 초기화
  elements.btnBackHome.addEventListener('click', () => {
    elements.searchInput.value = '';
    state.searchQuery = '';
    
    elements.categoryItems.forEach(c => c.classList.remove('active'));
    const allCat = Array.from(elements.categoryItems).find(c => c.getAttribute('data-category') === '전체');
    if (allCat) allCat.classList.add('active');
    state.activeCategory = '전체';
    
    elements.searchGridContent.classList.add('hidden');
    elements.dashboardContent.classList.remove('hidden');
  });
  
  elements.detailBookmarkBtn.addEventListener('click', () => {
    if (state.currentVideo) {
      toggleBookmark(state.currentVideo.id);
    }
  });
  
  elements.detailShareBtn.addEventListener('click', () => {
    if (state.currentVideo) {
      const shareUrl = `https://youtu.be/${state.currentVideo.videoId}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('유튜브 공유 URL이 클립보드에 복사되었습니다!\n주소: ' + shareUrl);
      }).catch(err => {
        console.error('클립보드 실패:', err);
      });
    }
  });
  
  elements.clearRecentBtn.addEventListener('click', () => {
    if (confirm('최근 시청 기록을 모두 지우시겠습니까?')) {
      state.recentVideos = [];
      localStorage.setItem('recentVideos', JSON.stringify(state.recentVideos));
      renderRecentView();
    }
  });
  
  elements.randomReBtn.addEventListener('click', () => {
    renderRandomView();
  });
  
  elements.themeToggleBtn.addEventListener('click', () => {
    if (state.theme === 'deep-space') {
      state.theme = 'amoled-black';
      elements.body.classList.add('amoled-black');
      elements.themeIcon.setAttribute('data-lucide', 'sun');
    } else {
      state.theme = 'deep-space';
      elements.body.classList.remove('amoled-black');
      elements.themeIcon.setAttribute('data-lucide', 'moon');
    }
    localStorage.setItem('theme', state.theme);
    lucide.createIcons();
  });
  
  elements.apiKeySettingsBtn.addEventListener('click', () => {
    const savedKey = localStorage.getItem('ytApiKey') || '';
    elements.apiKeyInput.value = savedKey;
    elements.apiKeyModal.classList.remove('hidden');
  });
  
  elements.closeApiKeyBtn.addEventListener('click', () => {
    elements.apiKeyModal.classList.add('hidden');
  });
  
  elements.saveApiKeyBtn.addEventListener('click', () => {
    const key = elements.apiKeyInput.value.trim();
    if (key) {
      localStorage.setItem('ytApiKey', key);
      alert('YouTube Data API Key가 활성화되었습니다.');
    } else {
      localStorage.removeItem('ytApiKey');
      alert('API Key 설정을 지웠습니다. Mock 데이터를 사용하여 작동합니다.');
    }
    elements.apiKeyModal.classList.add('hidden');
    location.reload();
  });
  
  elements.commentSubmitBtn.addEventListener('click', () => {
    if (state.currentVideo) {
      const text = elements.commentInput.value;
      addComment(state.currentVideo.id, text);
      elements.commentInput.value = '';
    }
  });
  
  elements.commentInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      elements.commentSubmitBtn.click();
    }
  });
  
  elements.commentsMoreBtn.addEventListener('click', () => {
    state.commentsLimit += 5;
    if (state.currentVideo) {
      renderComments(state.currentVideo.id);
    }
  });
  
  elements.controlPlayPause.addEventListener('click', () => {
    if (!state.currentVideo) return;
    
    if (state.isPlaying) {
      stopPlaybackSimulation();
      try {
        elements.mainYtPlayer.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      } catch (err) {}
    } else {
      startPlaybackSimulation();
      try {
        elements.mainYtPlayer.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      } catch (err) {}
    }
  });
  
  elements.controlNext.addEventListener('click', playNextVideo);
  elements.controlPrev.addEventListener('click', playPrevVideo);
  
  elements.controlShuffle.addEventListener('click', () => {
    elements.controlShuffle.classList.toggle('active');
  });
  
  elements.controlRepeat.addEventListener('click', () => {
    elements.controlRepeat.classList.toggle('active');
  });
  
  elements.progressBarContainer.addEventListener('click', (e) => {
    if (!state.currentVideo) return;
    const rect = elements.progressBarContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    
    state.playbackTime = Math.floor(pct * state.playbackDuration);
    updatePlaybackProgressUI();
    
    try {
      elements.mainYtPlayer.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'seekTo',
        args: [state.playbackTime, true]
      }), '*');
    } catch (err) {}
  });
  
  elements.volumeMuteBtn.addEventListener('click', () => {
    state.isMuted = !state.isMuted;
    updateVolumeIcon();
    
    const targetVolume = state.isMuted ? 0 : Math.round(state.volume * 100);
    elements.volumeBarFill.style.width = targetVolume + '%';
    elements.volumeThumb.style.left = targetVolume + '%';
    
    try {
      const ytFunc = state.isMuted ? 'mute' : 'unMute';
      elements.mainYtPlayer.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: ytFunc,
        args: []
      }), '*');
      
      if (!state.isMuted) {
        elements.mainYtPlayer.contentWindow.postMessage(JSON.stringify({
          event: 'command',
          func: 'setVolume',
          args: [state.volume * 100]
        }), '*');
      }
    } catch (err) {}
  });
  
  elements.volumeSliderContainer.addEventListener('click', (e) => {
    const rect = elements.volumeSliderContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    state.volume = Math.max(0, Math.min(1, clickX / rect.width));
    state.isMuted = false;
    
    localStorage.setItem('volume', state.volume);
    
    const targetVolumePct = Math.round(state.volume * 100) + '%';
    elements.volumeBarFill.style.width = targetVolumePct;
    elements.volumeThumb.style.left = targetVolumePct;
    updateVolumeIcon();
    
    try {
      elements.mainYtPlayer.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'setVolume',
        args: [state.volume * 100]
      }), '*');
      elements.mainYtPlayer.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'unMute',
        args: []
      }), '*');
    } catch (err) {}
  });
}

// 윈도우 로드 완료 시 애플리케이션 진입점 실행
window.addEventListener('DOMContentLoaded', init);
