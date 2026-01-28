const CONFIG = {
    API_KEY: '47ea9a85d2468d53be139a443358cfa0',
    BASE_URL: 'https://api.themoviedb.org/3',
    IMG_URL: 'https://image.tmdb.org/t/p/w500',
    BACKDROP_URL: 'https://image.tmdb.org/t/p/original'
};

// 主题配置
const THEMES = {
    netflix: {
        bgColor: '#0a0a0b',
        cardBg: '#161618',
        accent: '#e50914',
        textMain: '#ffffff',
        textDim: '#777'
    },
    midnight: {
        bgColor: '#0a0d1f',
        cardBg: '#141d3a',
        accent: '#0066ff',
        textMain: '#ffffff',
        textDim: '#4d7a9e'
    },
    royal: {
        bgColor: '#0f0213',
        cardBg: '#1a0e2e',
        accent: '#7b2cbf',
        textMain: '#e0d5ff',
        textDim: '#9d6ba8'
    },
    forest: {
        bgColor: '#0d2818',
        cardBg: '#1a4d34',
        accent: '#06a77d',
        textMain: '#e8f5f0',
        textDim: '#6b8976'
    },
    ocean: {
        bgColor: '#0a1929',
        cardBg: '#132d49',
        accent: '#00d9ff',
        textMain: '#e0f7ff',
        textDim: '#5a8fa8'
    },
    light: {
        bgColor: '#f8f9fa',
        cardBg: '#ffffff',
        accent: '#ff5722',
        textMain: '#1a1a1a',
        textDim: '#999'
    },
    soft: {
        bgColor: '#f5f1ed',
        cardBg: '#fefdfb',
        accent: '#d4845c',
        textMain: '#2d2d2d',
        textDim: '#a0a0a0'
    },
    sky: {
        bgColor: '#e3f2fd',
        cardBg: '#ffffff',
        accent: '#1976d2',
        textMain: '#1a237e',
        textDim: '#5c6b7d'
    },
    rose: {
        bgColor: '#fce4ec',
        cardBg: '#fff5f8',
        accent: '#c2185b',
        textMain: '#3e1e40',
        textDim: '#a08fa0'
    }
};

let myMovies = JSON.parse(localStorage.getItem('myWatchList')) || [];
let currentSortOrder = { field: 'release', direction: 'desc' };
let currentTheme = localStorage.getItem('selectedTheme') || 'netflix';
let currentFont = localStorage.getItem('selectedFont') || 'inter';
let currentLang = localStorage.getItem('selectedLang') || 'both';
let currentOpacity = localStorage.getItem('uiOpacity') || 100;
let searchSuggestions = [];
let selectedSuggestionIndex = -1;

// 页面加载后立即设置主题、字体、语言和渲染电影
document.addEventListener('DOMContentLoaded', () => {
    applyTheme(currentTheme);
    applyFont(currentFont);
    applyLang(currentLang);
    applyUIOpacity(currentOpacity);
    renderMovies();
    updateThemeButtons();
    updateFontButtons();
    updateLangButtons();
});

async function searchAndAdd() {
    const input = document.getElementById('movieInput');
    const name = input.value.trim();
    if (!name) return;

    try {
        // 1. 获取中文信息
        const resCn = await fetch(`${CONFIG.BASE_URL}/search/movie?api_key=${CONFIG.API_KEY}&query=${name}&language=zh-CN`);
        const dataCn = await resCn.json();

        if (dataCn.results && dataCn.results.length > 0) {
            const movieCn = dataCn.results[0];
            const movieId = movieCn.id;

            // 去重逻辑
            if (myMovies.some(m => m.id === movieId)) {
                alert("此电影已在清单中！");
                input.value = '';
                hideSuggestions();
                return;
            }

            // 2. 获取英文信息
            const resEn = await fetch(`${CONFIG.BASE_URL}/movie/${movieId}?api_key=${CONFIG.API_KEY}&language=en-US`);
            const movieEn = await resEn.json();

            // 3. 获取预告片信息 - 尝试多个语言和类型
            let trailerKey = null;
            
            // 先尝试英文预告片
            const resVideosEn = await fetch(`${CONFIG.BASE_URL}/movie/${movieId}/videos?api_key=${CONFIG.API_KEY}&language=en-US`);
            const videosDataEn = await resVideosEn.json();
            
            if (videosDataEn.results && videosDataEn.results.length > 0) {
                // 优先找 Trailer，其次找 Teaser
                const trailer = videosDataEn.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
                const teaser = videosDataEn.results.find(v => v.type === 'Teaser' && v.site === 'YouTube');
                const officialVideo = videosDataEn.results.find(v => v.type === 'Clip' && v.site === 'YouTube');
                
                trailerKey = trailer?.key || teaser?.key || officialVideo?.key || null;
            }
            
            // 如果没找到，尝试中文预告片
            if (!trailerKey) {
                try {
                    const resVideosCn = await fetch(`${CONFIG.BASE_URL}/movie/${movieId}/videos?api_key=${CONFIG.API_KEY}&language=zh-CN`);
                    const videosDataCn = await resVideosCn.json();
                    
                    if (videosDataCn.results && videosDataCn.results.length > 0) {
                        const trailer = videosDataCn.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
                        const teaser = videosDataCn.results.find(v => v.type === 'Teaser' && v.site === 'YouTube');
                        trailerKey = trailer?.key || teaser?.key || null;
                    }
                } catch (e) {
                    console.log("获取中文预告片失败，使用英文版本");
                }
            }
            
            console.log(`电影: ${movieCn.title}, 预告片KEY: ${trailerKey}`);

            // 4. 构造保存对象
            const movieData = {
                id: movieId,
                titleCn: movieCn.title,
                titleEn: movieEn.title,
                poster: CONFIG.IMG_URL + movieCn.poster_path,
                backdrop: movieCn.backdrop_path,
                rating: movieCn.vote_average,
                releaseDate: movieCn.release_date || '未知',
                releaseYear: movieCn.release_date ? movieCn.release_date.split('-')[0] : '未知',
                overviewCn: movieCn.overview || "暂无中文简介",
                overviewEn: movieEn.overview || "No description available.",
                trailerKey: trailerKey
            };

            myMovies.push(movieData);
            localStorage.setItem('myWatchList', JSON.stringify(myMovies));
            renderMovies();
            input.value = '';
            hideSuggestions();
        } else {
            alert("未找到电影资源");
        }
    } catch (e) {
        console.error("搜索出错", e);
    }
}

// 搜索建议功能
async function handleSearchInput(event) {
    const input = event.target;
    const query = input.value.trim();
    
    if (query.length < 2) {
        hideSuggestions();
        return;
    }
    
    try {
        const res = await fetch(`${CONFIG.BASE_URL}/search/movie?api_key=${CONFIG.API_KEY}&query=${query}&language=zh-CN`);
        const data = await res.json();
        
        if (data.results && data.results.length > 0) {
            searchSuggestions = data.results.slice(0, 8);
            showSuggestions();
        } else {
            hideSuggestions();
        }
    } catch (e) {
        console.error("搜索建议出错", e);
    }
}

function handleSearchKeydown(event) {
    const suggestionsDiv = document.getElementById('searchSuggestions');
    const items = suggestionsDiv.querySelectorAll('.suggestion-item');
    
    if (event.key === 'ArrowDown') {
        event.preventDefault();
        selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, items.length - 1);
        updateSuggestionSelection(items);
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, -1);
        updateSuggestionSelection(items);
    } else if (event.key === 'Enter') {
        event.preventDefault();
        if (selectedSuggestionIndex >= 0 && items[selectedSuggestionIndex]) {
            selectSuggestion(items[selectedSuggestionIndex].dataset.index);
        } else {
            searchAndAdd();
        }
    }
}

function updateSuggestionSelection(items) {
    items.forEach((item, index) => {
        item.classList.toggle('selected', index === selectedSuggestionIndex);
    });
}

function selectSuggestion(index) {
    const movie = searchSuggestions[parseInt(index)];
    const input = document.getElementById('movieInput');
    input.value = movie.title;
    hideSuggestions();
    searchAndAdd();
}

function showSuggestions() {
    const suggestionsDiv = document.getElementById('searchSuggestions');
    suggestionsDiv.innerHTML = searchSuggestions.map((movie, index) => {
        const poster = movie.poster_path ? CONFIG.IMG_URL + movie.poster_path : '';
        const year = movie.release_date ? movie.release_date.split('-')[0] : '未知';
        return `
            <div class="suggestion-item" data-index="${index}" onclick="selectSuggestion(${index})">
                ${poster ? `<img src="${poster}" alt="${movie.title}" class="suggestion-poster">` : ''}
                <div class="suggestion-text">${movie.title}</div>
                <div class="suggestion-year">${year}</div>
            </div>
        `;
    }).join('');
    suggestionsDiv.classList.remove('hidden');
    selectedSuggestionIndex = -1;
}

function hideSuggestions() {
    const suggestionsDiv = document.getElementById('searchSuggestions');
    suggestionsDiv.classList.add('hidden');
    searchSuggestions = [];
    selectedSuggestionIndex = -1;
}

function renderMovies() {
    const grid = document.getElementById('movie-grid');
    const moviesToRender = [...myMovies];
    
    // 根据当前排序顺序排列
    if (currentSortOrder.field === 'release') {
        moviesToRender.sort((a, b) => {
            const yearA = parseInt(a.releaseYear) || 0;
            const yearB = parseInt(b.releaseYear) || 0;
            return currentSortOrder.direction === 'desc' ? yearB - yearA : yearA - yearB;
        });
    } else if (currentSortOrder.field === 'rating') {
        moviesToRender.sort((a, b) => {
            return currentSortOrder.direction === 'desc' ? b.rating - a.rating : a.rating - b.rating;
        });
    }
    
    grid.innerHTML = moviesToRender.map((movie, index) => {
        const originalIndex = myMovies.indexOf(movie);
        
        // 根据语言设置显示标题
        let titleDisplay = '';
        let titleEnDisplay = '';
        if (currentLang === 'cn') {
            titleDisplay = movie.titleCn;
        } else if (currentLang === 'en') {
            titleDisplay = movie.titleEn;
            titleEnDisplay = '';
        } else { // 'both'
            titleDisplay = movie.titleCn;
            titleEnDisplay = `<span class="title-en">${movie.titleEn}</span>`;
        }
        
        const trailerHtml = movie.trailerKey ? `
            <div class="preview-player">
                <button class="play-btn" onclick="event.stopPropagation(); playTrailer('${movie.trailerKey}', '${movie.titleCn}')">▶ 播放预告</button>
            </div>
        ` : '';
        
        return `
        <div class="movie-card" onclick="openDetails(${movie.id}, ${originalIndex})">
            <img src="${movie.poster}" alt="${movie.titleCn}">
            ${trailerHtml}
            <div class="info">
                <div class="rating">★ ${movie.rating.toFixed(1)}</div>
                <h3>${titleDisplay}</h3>
                ${titleEnDisplay}
                <div class="release-year">📅 ${movie.releaseYear}</div>
                <button class="delete-btn" onclick="event.stopPropagation(); deleteMovie(${originalIndex})" title="移除此电影">✕</button>
            </div>
        </div>
    `}).join('');
}

function playTrailer(trailerKey, titleCn) {
    // 从 myMovies 中找到对应的电影
    const movie = myMovies.find(m => m.titleCn === titleCn);
    if (movie) {
        const index = myMovies.indexOf(movie);
        openDetails(movie.id, index);
    }
}

function openDetails(movieId, index) {
    const modal = document.getElementById('movieModal');
    const modalBody = document.getElementById('modal-body');
    const movie = myMovies[index];

    modal.style.display = "block";
    const bgImage = movie.backdrop ? CONFIG.BACKDROP_URL + movie.backdrop : movie.poster;

    modalBody.innerHTML = `
        <div class="modal-banner" style="background-image: url('${bgImage}')">
            <div class="banner-overlay"></div>
            <div class="banner-content">
                <span class="modal-rating">★ ${movie.rating.toFixed(1)}</span>
                <h2 style="font-size: 2.5rem; margin: 15px 0 5px 0;">${movie.titleCn}</h2>
                <p class="title-en-sub" style="font-size: 1.2rem; opacity: 0.7;">${movie.titleEn}</p>
            </div>
        </div>
        ${movie.trailerKey ? `
        <div class="modal-trailer-section">
            <h5>预告片</h5>
            <div class="modal-player-container">
                <iframe width="100%" height="400" src="https://www.youtube.com/embed/${movie.trailerKey}?autoplay=0&controls=1&rel=0&modestbranding=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
        </div>
        ` : ''}
        <div class="modal-info-section">
            <div class="desc-group">
                <h5>剧情简介 · · ·</h5>
                <p class="desc-cn">${movie.overviewCn}</p>
            </div>
            <div class="desc-group">
                <h5>SYNOPSIS · · ·</h5>
                <p class="desc-en">${movie.overviewEn}</p>
            </div>
        </div>
    `;
}

function closeModal() {
    document.getElementById('movieModal').style.display = "none";
}

function deleteMovie(index) {
    myMovies.splice(index, 1);
    localStorage.setItem('myWatchList', JSON.stringify(myMovies));
    renderMovies();
}

// 点击弹窗外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('movieModal');
    if (event.target == modal) closeModal();
}

function sortMovies(field, direction) {
    currentSortOrder = { field, direction };
    renderMovies();
}

// 主题切换功能
function changeTheme(themeName) {
    currentTheme = themeName;
    localStorage.setItem('selectedTheme', themeName);
    applyTheme(themeName);
    updateThemeButtons();
}

function toggleThemeSelector() {
    const selector = document.getElementById('themeSelector');
    selector.classList.toggle('hidden');
}

function applyTheme(themeName) {
    const theme = THEMES[themeName];
    if (!theme) return;
    
    const root = document.documentElement;
    root.style.setProperty('--bg-color', theme.bgColor);
    root.style.setProperty('--card-bg', theme.cardBg);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--text-main', theme.textMain);
    root.style.setProperty('--text-dim', theme.textDim);
    
    // 根据主题类型切换暗/亮模式
    const lightThemes = ['light', 'soft', 'sky', 'rose'];
    if (lightThemes.includes(themeName)) {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }
}

function updateThemeButtons() {
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`.theme-${currentTheme}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// 字体切换功能
function changeFont(fontName) {
    currentFont = fontName;
    localStorage.setItem('selectedFont', fontName);
    applyFont(fontName);
    updateFontButtons();
}

function toggleFontSelector() {
    const selector = document.getElementById('fontSelector');
    selector.classList.toggle('hidden');
}

function applyFont(fontName) {
    const fontMap = {
        'inter': "'Inter', -apple-system, sans-serif",
        'poppins': "'Poppins', -apple-system, sans-serif",
        'playfair': "'Playfair Display', serif",
        'space': "'Space Mono', monospace",
        'outfit': "'Outfit', -apple-system, sans-serif",
        'fredoka': "'Fredoka', -apple-system, sans-serif"
    };
    
    const root = document.documentElement;
    root.style.setProperty('--font-family', fontMap[fontName] || fontMap['inter']);
}

function updateFontButtons() {
    document.querySelectorAll('.font-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`.font-${currentFont}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// 背景切换功能
function changeBg(bgName) {
    currentBg = bgName;
    localStorage.setItem('selectedBg', bgName);
    applyBg(bgName);
    updateBgButtons();
}

function toggleBgSelector() {
    const selector = document.getElementById('bgSelector');
    selector.classList.toggle('hidden');
}

function applyBg(bgName) {
    const bgMap = {
        'none': 'none',
        'gradient1': 'linear-gradient(135deg, rgba(200, 60, 200, 0.3), rgba(100, 60, 200, 0.3))',
        'gradient2': 'linear-gradient(135deg, rgba(0, 102, 255, 0.2), rgba(100, 150, 255, 0.2))',
        'gradient3': 'linear-gradient(135deg, rgba(6, 167, 125, 0.2), rgba(0, 100, 80, 0.2))',
        'gradient4': 'linear-gradient(135deg, rgba(229, 9, 20, 0.2), rgba(150, 0, 0, 0.2))'
    };
    
    const root = document.documentElement;
    root.style.setProperty('--bg-overlay', bgMap[bgName] || 'none');
}

function updateBgButtons() {
    document.querySelectorAll('.bg-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`.bg-${currentBg}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// 语言切换功能
function changeLang(lang) {
    currentLang = lang;
    localStorage.setItem('selectedLang', lang);
    applyLang(lang);
    updateLangButtons();
    renderMovies();
}

function toggleLangSelector() {
    const selector = document.getElementById('langSelector');
    selector.classList.toggle('hidden');
}

function applyLang(lang) {
    // 语言状态存储，renderMovies 会使用它
}

function updateLangButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`.lang-${currentLang}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// 透明度调整功能
function adjustUIOpacity(value) {
    currentOpacity = value;
    localStorage.setItem('uiOpacity', value);
    applyUIOpacity(value);
    document.getElementById('opacityValue').textContent = value + '%';
}

function applyUIOpacity(opacity) {
    const opacityRatio = opacity / 100;
    const baseOpacity1 = 0.2 * opacityRatio;
    const baseOpacity2 = 0.3 * opacityRatio;
    const baseOpacity3 = 0.12 * opacityRatio;
    const cardOpacity = 0.92 * opacityRatio;
    const cardBorderOpacity = 0.15 * opacityRatio;
    
    const root = document.documentElement;
    root.style.setProperty('--ui-opacity-1', baseOpacity1.toFixed(2));
    root.style.setProperty('--ui-opacity-2', baseOpacity2.toFixed(2));
    root.style.setProperty('--ui-opacity-3', baseOpacity3.toFixed(2));
    root.style.setProperty('--card-opacity', cardOpacity.toFixed(2));
    root.style.setProperty('--card-border-opacity', cardBorderOpacity.toFixed(2));
    
    // 直接更新元素样式
    document.querySelectorAll('.search-box, .theme-selector, .font-selector, .lang-selector').forEach(el => {
        el.style.background = el.classList.contains('search-box') 
            ? `rgba(255, 255, 255, ${baseOpacity1.toFixed(2)})` 
            : `rgba(255, 255, 255, ${baseOpacity1.toFixed(2)})`;
        el.style.borderColor = `rgba(255, 255, 255, ${baseOpacity2.toFixed(2)})`;
    });
    
    document.querySelectorAll('.movie-card').forEach(card => {
        card.style.background = `rgba(22, 22, 24, ${cardOpacity.toFixed(2)})`;
        card.style.borderColor = `rgba(255, 255, 255, ${cardBorderOpacity.toFixed(2)})`;
    });
    
    document.querySelectorAll('.search-suggestions').forEach(el => {
        el.style.background = `rgba(20, 20, 25, ${(0.95 * opacityRatio).toFixed(2)})`;
        el.style.borderColor = `rgba(255, 255, 255, ${baseOpacity2.toFixed(2)})`;
    });
}
