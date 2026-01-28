// 云端存储管理器
class CloudStorage {
    constructor() {
        this.syncEnabled = localStorage.getItem('cloudSyncEnabled') === 'true';
        this.lastSyncTime = localStorage.getItem('lastSyncTime') || null;
        this.syncInterval = 5 * 60 * 1000; // 5分钟自动同步
        this.autoSyncTimer = null;

        // 支持的云端存储提供商
        this.providers = {
            github: {
                name: 'GitHub Gist',
                enabled: false,
                token: localStorage.getItem('github_token') || '',
                gistId: localStorage.getItem('github_gistId') || ''
            },
            dropbox: {
                name: 'Dropbox',
                enabled: false,
                token: localStorage.getItem('dropbox_token') || ''
            }
        };

        this.initAutoSync();
    }

    // 初始化自动同步
    initAutoSync() {
        if (this.syncEnabled && this.autoSyncTimer === null) {
            this.autoSyncTimer = setInterval(() => {
                this.autoSync();
            }, this.syncInterval);
        }
    }

    // 停止自动同步
    stopAutoSync() {
        if (this.autoSyncTimer) {
            clearInterval(this.autoSyncTimer);
            this.autoSyncTimer = null;
        }
    }

    // 启用/禁用云同步
    toggleSync(enabled) {
        this.syncEnabled = enabled;
        localStorage.setItem('cloudSyncEnabled', enabled);

        if (enabled) {
            this.initAutoSync();
            showNotification('云同步已启用', 'success');
        } else {
            this.stopAutoSync();
            showNotification('云同步已禁用', 'info');
        }
    }

    // 自动同步
    async autoSync() {
        if (!this.syncEnabled) return;

        try {
            await this.syncToCloud();
            console.log('自动同步完成');
        } catch (e) {
            console.error('自动同步失败', e);
        }
    }

    // 同步到云端
    async syncToCloud() {
        if (!this.syncEnabled) {
            showNotification('请先启用云同步', 'warning');
            return;
        }

        const data = {
            movies: myMovies,
            settings: {
                theme: currentTheme,
                font: currentFont,
                lang: currentLang,
                opacity: currentOpacity,
                filter: currentFilter
            },
            timestamp: new Date().toISOString(),
            version: '2.0.0'
        };

        try {
            // 尝试使用配置的云端提供商
            if (this.providers.github.enabled && this.providers.github.token) {
                await this.syncToGitHub(data);
            } else {
                // 使用浏览器的 IndexedDB 作为本地云存储
                await this.syncToIndexedDB(data);
            }

            this.lastSyncTime = new Date().toISOString();
            localStorage.setItem('lastSyncTime', this.lastSyncTime);
            showNotification('同步成功！', 'success');
            updateSyncStatus();
        } catch (e) {
            console.error('同步失败', e);
            showNotification('同步失败：' + e.message, 'error');
        }
    }

    // 从云端恢复
    async restoreFromCloud() {
        try {
            let data;

            if (this.providers.github.enabled && this.providers.github.token) {
                data = await this.restoreFromGitHub();
            } else {
                data = await this.restoreFromIndexedDB();
            }

            if (data && data.movies) {
                if (confirm(`发现云端数据（${data.movies.length}部电影），是否恢复？这将覆盖本地数据。`)) {
                    myMovies = data.movies;

                    // 恢复设置
                    if (data.settings) {
                        currentTheme = data.settings.theme || currentTheme;
                        currentFont = data.settings.font || currentFont;
                        currentLang = data.settings.lang || currentLang;
                        currentOpacity = data.settings.opacity || currentOpacity;
                        currentFilter = data.settings.filter || currentFilter;

                        applyTheme(currentTheme);
                        applyFont(currentFont);
                        applyLang(currentLang);
                        applyUIOpacity(currentOpacity);
                        updateThemeButtons();
                        updateFontButtons();
                        updateLangButtons();
                        updateFilterButtons();
                    }

                    saveMovies();
                    renderMovies();
                    updateStats();
                    showNotification('数据恢复成功！', 'success');
                }
            } else {
                showNotification('未找到云端数据', 'info');
            }
        } catch (e) {
            console.error('恢复失败', e);
            showNotification('恢复失败：' + e.message, 'error');
        }
    }

    // 使用 IndexedDB 存储（浏览器本地云存储）
    async syncToIndexedDB(data) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('MovieWatchlistDB', 1);

            request.onerror = () => reject(new Error('无法打开数据库'));

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('backups')) {
                    db.createObjectStore('backups', { keyPath: 'id' });
                }
            };

            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(['backups'], 'readwrite');
                const store = transaction.objectStore('backups');

                const backup = {
                    id: 'latest',
                    data: data,
                    timestamp: new Date().toISOString()
                };

                const putRequest = store.put(backup);

                putRequest.onsuccess = () => {
                    db.close();
                    resolve();
                };

                putRequest.onerror = () => {
                    db.close();
                    reject(new Error('存储失败'));
                };
            };
        });
    }

    // 从 IndexedDB 恢复
    async restoreFromIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('MovieWatchlistDB', 1);

            request.onerror = () => reject(new Error('无法打开数据库'));

            request.onsuccess = (event) => {
                const db = event.target.result;

                if (!db.objectStoreNames.contains('backups')) {
                    db.close();
                    resolve(null);
                    return;
                }

                const transaction = db.transaction(['backups'], 'readonly');
                const store = transaction.objectStore('backups');
                const getRequest = store.get('latest');

                getRequest.onsuccess = () => {
                    db.close();
                    resolve(getRequest.result ? getRequest.result.data : null);
                };

                getRequest.onerror = () => {
                    db.close();
                    reject(new Error('读取失败'));
                };
            };
        });
    }

    // 同步到 GitHub Gist
    async syncToGitHub(data) {
        const token = this.providers.github.token;
        const gistId = this.providers.github.gistId;

        if (!token) {
            throw new Error('请先配置 GitHub Token');
        }

        const content = JSON.stringify(data, null, 2);
        const filename = 'watchlist-backup.json';

        const gistData = {
            description: 'Movie Watchlist Backup',
            public: false,
            files: {
                [filename]: {
                    content: content
                }
            }
        };

        const url = gistId
            ? `https://api.github.com/gists/${gistId}`
            : 'https://api.github.com/gists';

        const method = gistId ? 'PATCH' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gistData)
        });

        if (!response.ok) {
            throw new Error('GitHub 同步失败');
        }

        const result = await response.json();

        // 保存 Gist ID
        if (!gistId) {
            this.providers.github.gistId = result.id;
            localStorage.setItem('github_gistId', result.id);
        }
    }

    // 从 GitHub Gist 恢复
    async restoreFromGitHub() {
        const token = this.providers.github.token;
        const gistId = this.providers.github.gistId;

        if (!token || !gistId) {
            throw new Error('请先配置 GitHub Token 和 Gist ID');
        }

        const response = await fetch(`https://api.github.com/gists/${gistId}`, {
            headers: {
                'Authorization': `token ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('无法获取 GitHub 数据');
        }

        const gist = await response.json();
        const file = Object.values(gist.files)[0];

        if (!file) {
            throw new Error('Gist 中没有数据');
        }

        return JSON.parse(file.content);
    }

    // 配置 GitHub
    configureGitHub(token) {
        this.providers.github.token = token;
        this.providers.github.enabled = !!token;
        localStorage.setItem('github_token', token);

        if (token) {
            showNotification('GitHub 配置成功', 'success');
        }
    }

    // 获取同步状态
    getSyncStatus() {
        if (!this.lastSyncTime) {
            return '从未同步';
        }

        const lastSync = new Date(this.lastSyncTime);
        const now = new Date();
        const diff = now - lastSync;

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}天前`;
        if (hours > 0) return `${hours}小时前`;
        if (minutes > 0) return `${minutes}分钟前`;
        return '刚刚';
    }
}

// 创建云存储实例
const cloudStorage = new CloudStorage();

// 更新同步状态显示
function updateSyncStatus() {
    const statusElement = document.getElementById('syncStatus');
    if (statusElement) {
        const status = cloudStorage.getSyncStatus();
        statusElement.textContent = `上次同步: ${status}`;
    }

    const toggleElement = document.getElementById('cloudSyncToggle');
    if (toggleElement) {
        toggleElement.checked = cloudStorage.syncEnabled;
    }
}

// 打开云同步设置
function openCloudSyncSettings() {
    const modal = document.getElementById('cloudSyncModal');
    modal.style.display = 'block';
    document.body.classList.add('modal-open'); // 隐藏背景搜索区域
    updateSyncStatus();
}

// 关闭云同步设置
function closeCloudSyncModal() {
    document.getElementById('cloudSyncModal').style.display = 'none';
    // 只有当电影详情也没打开时，才恢复背景
    const detailModal = document.getElementById('movieModal');
    if (!detailModal || detailModal.style.display !== 'block') {
        document.body.classList.remove('modal-open');
    }
}

// 切换云同步
function toggleCloudSync() {
    const enabled = document.getElementById('cloudSyncToggle').checked;
    cloudStorage.toggleSync(enabled);
    updateSyncStatus();
}

// 立即同步
async function syncNow() {
    const button = event.target;
    button.disabled = true;
    button.textContent = '同步中...';

    try {
        await cloudStorage.syncToCloud();
    } finally {
        button.disabled = false;
        button.textContent = '立即同步';
    }
}

// 从云端恢复
async function restoreFromCloud() {
    await cloudStorage.restoreFromCloud();
}

// 配置 GitHub
function configureGitHub() {
    const token = prompt('请输入 GitHub Personal Access Token:\n\n如何获取：\n1. 访问 github.com/settings/tokens\n2. 生成新 token\n3. 勾选 "gist" 权限\n4. 复制 token');

    if (token) {
        cloudStorage.configureGitHub(token.trim());
        updateSyncStatus();
    }
}

// 清除 GitHub 配置
function clearGitHubConfig() {
    if (confirm('确定要清除 GitHub 配置吗？')) {
        cloudStorage.configureGitHub('');
        cloudStorage.providers.github.gistId = '';
        localStorage.removeItem('github_gistId');
        showNotification('GitHub 配置已清除', 'info');
        updateSyncStatus();
    }
}
