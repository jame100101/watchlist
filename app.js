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
let currentFilter = localStorage.getItem('currentFilter') || 'all';
let searchSuggestions = [];
let selectedSuggestionIndex = -1;
let isLoading = false;

const TRANSLATIONS = {
    cn: {
        mainTitle: "WATCHLIST",
        dataManagement: "📊 数据管理",
        exportData: "导出数据",
        importData: "导入数据",
        clearData: "清空数据",
        cloudSync: "☁️ 云端同步",
        enableCloudSync: "启用云同步",
        neverSync: "上次同步: 从未同步",
        syncNow: "立即同步",
        restoreFromCloud: "从云端恢复",
        cloudSyncSettings: "云同步设置",
        shortcuts: "⌨️ 快捷键",
        focusSearch: "聚焦搜索",
        exportDataShortcut: "导出数据",
        closePopup: "关闭弹窗",
        statTotal: "总计",
        statWatched: "已看",
        statWatching: "在看",
        statUnwatched: "想看",
        statAvgRating: "平均评分",
        statMyRating: "我的评分",
        searchPlaceholder: "搜索电影或电视剧名称... (Ctrl+K)",
        addBtn: "添加记录",
        filterAll: "全部",
        filterUnwatched: "👁️ 想看",
        filterWatching: "▶️ 在看",
        filterWatched: "✓ 已看",
        sortAdded: "最新添加",
        sortReleaseNew: "最新年代",
        sortReleaseOld: "最早年代",
        sortRating: "评分最高",
        sortUserRating: "我的最爱",
        confirmDelete: "确定要删除吗？",
        noMovies: "开始添加你喜欢的电影吧！",
        noMoviesFilter: "这个分类还没有电影哦",
        unwatched: "想看",
        watching: "在看",
        watched: "已看",
        editNote: "编辑笔记",
        addNote: "添加笔记",
        editRating: "修改评分",
        addRating: "添加评分",
        changeStatus: "更改状态",
        myNotes: "我的笔记",
        synopsis: "剧情简介",
        releaseDateLabel: "上映日期",
        addedDateLabel: "添加时间",
        watchedDateLabel: "观看时间",
        hasNotesCard: "📝 有笔记",
        playTrailer: "▶ 播放预告",
        confirmDeleteTitle: "确定要删除《{title}》吗？",
        statusMarked: "已标记为：{status}"
    },
    en: {
        mainTitle: "WATCHLIST",
        dataManagement: "📊 Data Mgmt",
        exportData: "Export Data",
        importData: "Import Data",
        clearData: "Clear Data",
        cloudSync: "☁️ Cloud Sync",
        enableCloudSync: "Enable Sync",
        neverSync: "Last Sync: Never",
        syncNow: "Sync Now",
        restoreFromCloud: "Restore Cloud",
        cloudSyncSettings: "Sync Settings",
        shortcuts: "⌨️ Shortcuts",
        focusSearch: "Focus Search",
        exportDataShortcut: "Export Data",
        closePopup: "Close Popup",
        statTotal: "Total",
        statWatched: "Watched",
        statWatching: "Watching",
        statUnwatched: "Queue",
        statAvgRating: "Avg. Rating",
        statMyRating: "My Rating",
        searchPlaceholder: "Search for movies or TV shows... (Ctrl+K)",
        addBtn: "Add Movie",
        filterAll: "All",
        filterUnwatched: "👁️ Queue",
        filterWatching: "▶️ Watching",
        filterWatched: "✓ Done",
        sortAdded: "Recently Added",
        sortReleaseNew: "Newest",
        sortReleaseOld: "Oldest",
        sortRating: "Top Rated",
        sortUserRating: "My Top",
        confirmDelete: "Are you sure you want to delete?",
        noMovies: "Start adding your favorite movies!",
        noMoviesFilter: "No movies in this category",
        unwatched: "Queue",
        watching: "Watching",
        watched: "Done",
        editNote: "Edit Note",
        addNote: "Add Note",
        editRating: "Modify Rating",
        addRating: "Add Rating",
        changeStatus: "Change Status",
        myNotes: "My Notes",
        synopsis: "Synopsis",
        releaseDateLabel: "Release Date",
        addedDateLabel: "Added Date",
        watchedDateLabel: "Watched Date",
        hasNotesCard: "📝 Has Notes",
        playTrailer: "▶ Trailer",
        confirmDeleteTitle: "Delete \"{title}\"?",
        statusMarked: "Marked as: {status}"
    }
};

let lastUIState = localStorage.getItem('lastUIState') || 'cn';

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
    updateFilterButtons();
    updateStats();

    // 添加键盘快捷键
    document.addEventListener('keydown', handleKeyboardShortcuts);
});

// 键盘快捷键处理
function handleKeyboardShortcuts(event) {
    // ESC 关闭弹窗
    if (event.key === 'Escape') {
        closeModal();
        closeNoteModal();
    }

    // Ctrl/Cmd + K 聚焦搜索框
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        document.getElementById('movieInput').focus();
    }

    // Ctrl/Cmd + E 导出数据
    if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
        event.preventDefault();
        exportData();
    }
}

async function searchAndAdd() {
    const input = document.getElementById('movieInput');
    const name = input.value.trim();
    if (!name || isLoading) return;

    setLoading(true);

    try {
        // 1. 获取中文信息
        const resCn = await fetch(`${CONFIG.BASE_URL}/search/movie?api_key=${CONFIG.API_KEY}&query=${name}&language=zh-CN`);
        const dataCn = await resCn.json();

        if (dataCn.results && dataCn.results.length > 0) {
            const movieCn = dataCn.results[0];
            const movieId = movieCn.id;

            // 去重逻辑
            if (myMovies.some(m => m.id === movieId)) {
                showNotification("此电影已在清单中！", "warning");
                input.value = '';
                hideSuggestions();
                setLoading(false);
                return;
            }

            // 2. 获取英文信息
            const resEn = await fetch(`${CONFIG.BASE_URL}/movie/${movieId}?api_key=${CONFIG.API_KEY}&language=en-US`);
            const movieEn = await resEn.json();

            // 3. 获取预告片信息
            let trailerKey = await getTrailerKey(movieId);

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
                trailerKey: trailerKey,
                // 新增字段
                userRating: 0,
                watchStatus: 'unwatched', // unwatched, watching, watched
                notes: '',
                tags: [],
                addedDate: new Date().toISOString(),
                watchedDate: null
            };

            myMovies.push(movieData);
            saveMovies();
            renderMovies();
            updateStats();
            input.value = '';
            hideSuggestions();
            showNotification(`已添加《${movieCn.title}》`, "success");
        } else {
            showNotification("未找到电影资源", "error");
        }
    } catch (e) {
        console.error("搜索出错", e);
        showNotification("搜索出错，请稍后重试", "error");
    } finally {
        setLoading(false);
    }
}

// 获取预告片KEY的辅助函数
async function getTrailerKey(movieId) {
    try {
        // 先尝试英文预告片
        const resVideosEn = await fetch(`${CONFIG.BASE_URL}/movie/${movieId}/videos?api_key=${CONFIG.API_KEY}&language=en-US`);
        const videosDataEn = await resVideosEn.json();

        if (videosDataEn.results && videosDataEn.results.length > 0) {
            const trailer = videosDataEn.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
            const teaser = videosDataEn.results.find(v => v.type === 'Teaser' && v.site === 'YouTube');
            const officialVideo = videosDataEn.results.find(v => v.type === 'Clip' && v.site === 'YouTube');

            const key = trailer?.key || teaser?.key || officialVideo?.key;
            if (key) return key;
        }

        // 如果没找到，尝试中文预告片
        const resVideosCn = await fetch(`${CONFIG.BASE_URL}/movie/${movieId}/videos?api_key=${CONFIG.API_KEY}&language=zh-CN`);
        const videosDataCn = await resVideosCn.json();

        if (videosDataCn.results && videosDataCn.results.length > 0) {
            const trailer = videosDataCn.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
            const teaser = videosDataCn.results.find(v => v.type === 'Teaser' && v.site === 'YouTube');
            return trailer?.key || teaser?.key || null;
        }
    } catch (e) {
        console.log("获取预告片失败", e);
    }
    return null;
}

// 加载状态管理
function setLoading(loading) {
    isLoading = loading;
    const button = document.querySelector('.search-box button');
    if (loading) {
        button.innerHTML = '<span class="spinner"></span> 搜索中...';
        button.disabled = true;
    } else {
        button.innerHTML = '添加记录';
        button.disabled = false;
    }
}

// 通知系统
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
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
    let moviesToRender = [...myMovies];

    // 应用筛选
    if (currentFilter !== 'all') {
        moviesToRender = moviesToRender.filter(m => m.watchStatus === currentFilter);
    }

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
    } else if (currentSortOrder.field === 'userRating') {
        moviesToRender.sort((a, b) => {
            return currentSortOrder.direction === 'desc' ? b.userRating - a.userRating : a.userRating - b.userRating;
        });
    } else if (currentSortOrder.field === 'added') {
        moviesToRender.sort((a, b) => {
            const dateA = new Date(a.addedDate);
            const dateB = new Date(b.addedDate);
            return currentSortOrder.direction === 'desc' ? dateB - dateA : dateA - dateB;
        });
    }

    // 空状态
    if (moviesToRender.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🎬</div>
                <h2>清单空空如也</h2>
                <p>${currentFilter === 'all' ? '开始添加你喜欢的电影吧！' : '这个分类还没有电影哦'}</p>
            </div>
        `;
        return;
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
        } else { // 'both'
            titleDisplay = `${movie.titleCn} <span class="title-slash">/</span> <span class="title-en-alt">${movie.titleEn}</span>`;
        }

        const trailerHtml = movie.trailerKey ? `
            <div class="preview-player">
                <button class="play-btn" onclick="event.stopPropagation(); playTrailer('${movie.trailerKey}', '${movie.titleCn}')">▶ 播放预告</button>
            </div>
        ` : '';

        // 观看状态徽章
        const statusBadge = getStatusBadge(movie.watchStatus);

        // 用户评分显示
        const userRatingHtml = movie.userRating > 0 ? `
            <div class="user-rating">❤️ ${movie.userRating.toFixed(1)}</div>
        ` : '';

        return `
        <div class="movie-card" onclick="openDetails(${movie.id}, ${originalIndex})">
            <img src="${movie.poster}" alt="${movie.titleCn}" loading="lazy">
            ${trailerHtml}
            ${statusBadge}
            <div class="info">
                <div class="rating-row">
                    <div class="rating">★ ${movie.rating.toFixed(1)}</div>
                    ${userRatingHtml}
                </div>
                <h3>${titleDisplay}</h3>
                ${titleEnDisplay}
                <div class="release-year">📅 ${movie.releaseYear}</div>
                ${movie.notes ? `<div class="has-notes">${t('hasNotesCard')}</div>` : ''}
                <div class="card-actions">
                    <button class="status-btn" onclick="event.stopPropagation(); toggleStatusMenu(${originalIndex})" title="${t('changeStatus')}">
                        ${getStatusIcon(movie.watchStatus)}
                    </button>
                    <button class="note-btn" onclick="event.stopPropagation(); openNoteModal(${originalIndex})" title="${t('addNote')}">📝</button>
                    <button class="delete-btn" onclick="event.stopPropagation(); deleteMovie(${originalIndex})" title="${t('clearData')}">✕</button>
                </div>
            </div>
        </div>
    `}).join('');
}

function getStatusBadge(status) {
    const badges = {
        'unwatched': `<div class="status-badge status-unwatched">${t('unwatched')}</div>`,
        'watching': `<div class="status-badge status-watching">${t('watching')}</div>`,
        'watched': `<div class="status-badge status-watched">${t('watched')}</div>`
    };
    return badges[status] || '';
}

function getStatusIcon(status) {
    const icons = {
        'unwatched': '👁️',
        'watching': '▶️',
        'watched': '✓'
    };
    return icons[status] || '👁️';
}

function toggleStatusMenu(index) {
    const movie = myMovies[index];
    const statuses = ['unwatched', 'watching', 'watched'];
    const currentIndex = statuses.indexOf(movie.watchStatus);
    const nextIndex = (currentIndex + 1) % statuses.length;

    movie.watchStatus = statuses[nextIndex];

    if (movie.watchStatus === 'watched' && !movie.watchedDate) {
        movie.watchedDate = new Date().toISOString();
    }

    saveMovies();
    renderMovies();
    updateStats();

    showNotification(t('statusMarked').replace('{status}', t(movie.watchStatus)), "success");
}

function playTrailer(trailerKey, titleCn) {
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
    document.body.classList.add('modal-open'); // 隐藏搜索框
    const bgImage = movie.backdrop ? CONFIG.BACKDROP_URL + movie.backdrop : movie.poster;

    modalBody.innerHTML = `
        <div class="modal-banner" style="background-image: url('${bgImage}')">
            <div class="banner-overlay"></div>
            <div class="banner-content">
                <span class="modal-rating">★ ${movie.rating.toFixed(1)}</span>
                ${movie.userRating > 0 ? `<span class="modal-user-rating">❤️ ${movie.userRating.toFixed(1)}</span>` : ''}
                <h2 style="font-size: 2.5rem; margin: 15px 0 5px 0;">${movie.titleCn}</h2>
                <p class="title-en-sub" style="font-size: 1.2rem; opacity: 0.7;">${movie.titleEn}</p>
                ${getStatusBadge(movie.watchStatus)}
            </div>
        </div>
        ${movie.trailerKey ? `
        <div class="modal-trailer-section">
            <h5 data-i18n="playTrailer">${t('playTrailer')}</h5>
            <div class="modal-player-container">
                <iframe width="100%" height="400" src="https://www.youtube.com/embed/${movie.trailerKey}?autoplay=0&controls=1&rel=0&modestbranding=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
        </div>
        ` : ''}
        <div class="modal-info-section">
            <div class="modal-actions">
                <button class="action-btn" onclick="openNoteModal(${index})">
                    <span>📝</span> ${movie.notes ? t('editNote') : t('addNote')}
                </button>
                <button class="action-btn" onclick="openRatingModal(${index})">
                    <span>⭐</span> ${movie.userRating > 0 ? t('editRating') : t('addRating')}
                </button>
                <button class="action-btn" onclick="toggleStatusMenu(${index}); closeModal();">
                    <span>${getStatusIcon(movie.watchStatus)}</span> ${t('changeStatus')}
                </button>
            </div>
            ${movie.notes ? `
            <div class="desc-group">
                <h5>${t('myNotes')} · · ·</h5>
                <p class="desc-cn">${movie.notes}</p>
            </div>
            ` : ''}
            <div class="desc-group">
                <h5>${t('synopsis')} · · ·</h5>
                <p class="desc-cn">${currentLang === 'en' ? movie.overviewEn : movie.overviewCn}</p>
            </div>
            ${currentLang === 'both' ? `
            <div class="desc-group">
                <h5>SYNOPSIS · · ·</h5>
                <p class="desc-en">${movie.overviewEn}</p>
            </div>
            ` : ''}
            <div class="movie-meta">
                <div class="meta-item">
                    <span class="meta-label">${t('releaseDateLabel')}</span>
                    <span class="meta-value">${movie.releaseDate}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">${t('addedDateLabel')}</span>
                    <span class="meta-value">${formatDate(movie.addedDate)}</span>
                </div>
                ${movie.watchedDate ? `
                <div class="meta-item">
                    <span class="meta-label">${t('watchedDateLabel')}</span>
                    <span class="meta-value">${formatDate(movie.watchedDate)}</span>
                </div>
                ` : ''}
            </div>
        </div>
    `;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}

function closeModal() {
    document.getElementById('movieModal').style.display = "none";
    document.body.classList.remove('modal-open'); // 恢复搜索框
}

// 笔记模态框
function openNoteModal(index) {
    const movie = myMovies[index];
    const modal = document.getElementById('noteModal');
    const textarea = document.getElementById('noteTextarea');
    const title = document.getElementById('noteModalTitle');

    title.textContent = `为《${movie.titleCn}》添加笔记`;
    textarea.value = movie.notes || '';
    modal.style.display = "block";
    document.body.classList.add('modal-open'); // 隐藏背景搜索区域
    textarea.focus();

    // 保存按钮事件
    document.getElementById('saveNoteBtn').onclick = () => {
        movie.notes = textarea.value.trim();
        saveMovies();
        renderMovies();
        closeNoteModal();
        showNotification("笔记已保存", "success");

        // 如果详情页打开，刷新它
        const detailModal = document.getElementById('movieModal');
        if (detailModal.style.display === 'block') {
            openDetails(movie.id, index);
        }
    };
}

function closeNoteModal() {
    document.getElementById('noteModal').style.display = "none";
    // 只有当详情页也没打开时，才恢复背景
    const detailModal = document.getElementById('movieModal');
    if (detailModal.style.display !== 'block') {
        document.body.classList.remove('modal-open');
    }
}

// 评分模态框
function openRatingModal(index) {
    const movie = myMovies[index];
    const modal = document.getElementById('ratingModal');
    const title = document.getElementById('ratingModalTitle');
    const slider = document.getElementById('ratingSlider');
    const value = document.getElementById('ratingValue');

    title.textContent = `为《${movie.titleCn}》评分`;
    slider.value = movie.userRating || 5;
    value.textContent = slider.value;
    modal.style.display = "block";
    document.body.classList.add('modal-open'); // 隐藏背景搜索区域

    slider.oninput = () => {
        value.textContent = slider.value;
    };

    document.getElementById('saveRatingBtn').onclick = () => {
        movie.userRating = parseFloat(slider.value);
        saveMovies();
        renderMovies();
        closeRatingModal();
        showNotification(`已评分：${movie.userRating} 分`, "success");

        // 如果详情页打开，刷新它
        const detailModal = document.getElementById('movieModal');
        if (detailModal.style.display === 'block') {
            openDetails(movie.id, index);
        }
    };
}

function closeRatingModal() {
    document.getElementById('ratingModal').style.display = "none";
    // 只有当详情页也没打开时，才恢复背景
    const detailModal = document.getElementById('movieModal');
    if (detailModal.style.display !== 'block') {
        document.body.classList.remove('modal-open');
    }
}

function deleteMovie(index) {
    const movie = myMovies[index];
    if (confirm(t('confirmDeleteTitle').replace('{title}', movie.titleCn))) {
        myMovies.splice(index, 1);
        saveMovies();
        renderMovies();
        updateStats();
        showNotification("已删除", "success");
    }
}

// 点击弹窗或下拉菜单外部自动关闭
window.onclick = function (event) {
    const modal = document.getElementById('movieModal');
    const noteModal = document.getElementById('noteModal');
    const ratingModal = document.getElementById('ratingModal');
    const cloudSyncModal = document.getElementById('cloudSyncModal');

    // 处理模态框外部点击
    if (event.target == modal) closeModal();
    if (event.target == noteModal) closeNoteModal();
    if (event.target == ratingModal) closeRatingModal();
    if (event.target == cloudSyncModal) {
        closeCloudSyncModal();
        if (modal.style.display !== "block") document.body.classList.remove('modal-open');
    }

    // 处理下拉菜单外部点击（点击非按钮且非菜单内部时关闭）
    const selectors = [
        { btn: '.theme-toggle', panel: '#themeSelector' },
        { btn: '.font-toggle', panel: '#fontSelector' },
        { btn: '.lang-toggle', panel: '#langSelector' },
        { btn: '.settings-toggle', panel: '#settingsPanel' }
    ];

    selectors.forEach(item => {
        const panel = document.querySelector(item.panel);
        const btn = document.querySelector(item.btn);

        if (panel && !panel.classList.contains('hidden')) {
            // 如果点击的既不是按钮本身，也不是菜单面板内部，则关闭它
            if (!btn.contains(event.target) && !panel.contains(event.target)) {
                panel.classList.add('hidden');
            }
        }
    });
}

function sortMovies(field, direction) {
    currentSortOrder = { field, direction };
    renderMovies();
}

// 筛选功能
function filterMovies(status) {
    currentFilter = status;
    localStorage.setItem('currentFilter', status);
    updateFilterButtons();
    renderMovies();
}

function updateFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const activeBtn = document.querySelector(`.filter-${currentFilter}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// 统计面板
function updateStats() {
    const total = myMovies.length;
    const watched = myMovies.filter(m => m.watchStatus === 'watched').length;
    const watching = myMovies.filter(m => m.watchStatus === 'watching').length;
    const unwatched = myMovies.filter(m => m.watchStatus === 'unwatched').length;

    const avgRating = total > 0
        ? (myMovies.reduce((sum, m) => sum + m.rating, 0) / total).toFixed(1)
        : 0;

    const avgUserRating = myMovies.filter(m => m.userRating > 0).length > 0
        ? (myMovies.filter(m => m.userRating > 0).reduce((sum, m) => sum + m.userRating, 0) / myMovies.filter(m => m.userRating > 0).length).toFixed(1)
        : 0;

    document.getElementById('totalCount').textContent = total;
    document.getElementById('watchedCount').textContent = watched;
    document.getElementById('watchingCount').textContent = watching;
    document.getElementById('unwatchedCount').textContent = unwatched;
    document.getElementById('avgRating').textContent = avgRating;
    document.getElementById('avgUserRating').textContent = avgUserRating || '-';
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

// 语言切换功能
function changeLang(lang) {
    if (lang !== 'both') {
        lastUIState = lang;
        localStorage.setItem('lastUIState', lang);
    }
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
    const targetLang = lang === 'both' ? lastUIState : lang;
    const texts = TRANSLATIONS[targetLang];

    // 更新带有 data-i18n 的普通元素
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (texts[key]) {
            // 如果元素里面有 span（比如图标），只替换文字部分
            const iconSpan = el.querySelector('span:first-child');
            if (iconSpan && iconSpan.parentElement === el) {
                // 暂时移除图标，替换文字后再塞回去
                const iconHtml = iconSpan.outerHTML;
                el.innerHTML = iconHtml + ' ' + texts[key];
            } else {
                el.textContent = texts[key];
            }
        }
    });

    // 更新带有 data-i18n-placeholder 的输入框
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (texts[key]) {
            el.placeholder = texts[key];
        }
    });
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
}

// 导出/导入功能
function exportData() {
    const dataStr = JSON.stringify(myMovies, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `watchlist_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification("数据已导出", "success");
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (Array.isArray(data)) {
                    if (confirm(`确定要导入 ${data.length} 部电影吗？这将覆盖当前数据。`)) {
                        myMovies = data;
                        saveMovies();
                        renderMovies();
                        updateStats();
                        showNotification(`已导入 ${data.length} 部电影`, "success");
                    }
                } else {
                    showNotification("文件格式错误", "error");
                }
            } catch (e) {
                showNotification("文件解析失败", "error");
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function clearAllData() {
    if (confirm('确定要清空所有数据吗？此操作不可恢复！')) {
        if (confirm('真的确定吗？所有电影记录将被永久删除！')) {
            myMovies = [];
            saveMovies();
            renderMovies();
            updateStats();
            showNotification("已清空所有数据", "success");
        }
    }
}

// 保存到localStorage
function saveMovies() {
    localStorage.setItem('myWatchList', JSON.stringify(myMovies));
}

// 切换设置面板
function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    panel.classList.toggle('hidden');
}

// 辅助翻译函数
function t(key) {
    const targetLang = currentLang === 'both' ? lastUIState : currentLang;
    return TRANSLATIONS[targetLang][key] || key;
}

// 页面加载完成后初始化云同步状态
document.addEventListener('DOMContentLoaded', () => {
    // 等待cloud-storage.js加载完成后再初始化
    setTimeout(() => {
        if (typeof updateSyncStatus === 'function') {
            updateSyncStatus();
        }
    }, 100);
});
