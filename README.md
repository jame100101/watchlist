# 🎬 高级影视清单管理系统 | Premium Movie Watchlist System (v2.5)

[中文](#中文) | [English](#english)

---

## <a name="中文"></a>🇨🇳 中文说明

一个功能强大、界面精美、隐私安全的个人影视观影清单管理工具。这不仅仅是一个简单的列表，更是您的私人观影档案。

### ✨ 核心特性

#### 🎯 深度观影管理
- **智能搜索建议**：基于 TMDB API 的实时搜索建议，支持电影与剧集。
- **三重观看状态**：
  - 👁️ **想看**：计划清单。
  - ▶️ **在看**：当前进度。
  - ✓ **已看**：自动记录观看完成日期。
- **私人评价体系**：
  - **精细评分**：0-10 分自定义评分（0.5 精度），独立于 TMDB 官方评分。
  - **观影笔记**：为每部作品记录心得、台词或随笔，支持长文本。

#### ☁️ 云端同步与数据安全
- **GitHub 双向同步**：通过 GitHub Gist 实现多端数据同步（手机、电脑、多浏览器）。
- **浏览器本地云存储**：基于 IndexedDB 的大容量本地备份，比普通缓存更稳定。
- **数据导出/导入**：支持一键导出标准 JSON 格式，方便物理备份。

#### 🎨 极致视觉与交互
- **多样化主题**：内置 9 种精美主题（Netflix、午夜、皇家等）。
- **沉浸式交互**：3D 视差卡片、动态光效、UI 透明度调节。
- **全键盘支持**：`Ctrl+K` 搜索, `Ctrl+E` 导出, `ESC` 关闭弹窗。

---

## <a name="english"></a>🇺🇸 English Description

A powerful, beautiful, and privacy-focused personal movie watchlist management tool. More than just a list, it is your private cinema archive.

### ✨ Key Features

#### 🎯 In-depth Movie Management
- **Smart Search Suggestions**: Real-time suggestions based on TMDB API for both movies and TV shows.
- **Triple Watch Status**:
  - 👁️ **Queue**: Your wishlist for future viewing.
  - ▶️ **Watching**: Track what you are currently enjoying.
  - ✓ **Done**: Automatically records the completion date.
- **Private Rating System**:
  - **Fine-grained Ratings**: 0-10 custom rating (0.5 precision), independent of TMDB scores.
  - **Movie Notes**: Records thoughts, quotes, or reviews with long-text support.

#### ☁️ Cloud Sync & Data Safety
- **GitHub Two-way Sync**: Sync data across devices (mobile, PC, different browsers) via GitHub Gist.
- **Local Cloud Storage**: High-capacity backup based on IndexedDB for better stability than standard cache.
- **Export/Import**: One-click JSON export/import for manual backups.

#### 🎨 Premium Visuals & Interaction
- **Versatile Themes**: 9 built-in themes (Netflix, Midnight, Royal, etc.).
- **Immersive Interactions**: 3D parallax cards, dynamic shine effects, and UI opacity sliders.
- **Keyboard Shortcuts**: `Ctrl+K` for search, `Ctrl+E` for export, `ESC` to close.

---

## 🛠️ 技术栈 | Tech Stack

- **Core**: Vanilla JavaScript, HTML5, CSS3
- **Data Source**: [TMDB API](https://www.themoviedb.org/)
- **Sync**: GitHub Gist API / IndexedDB
- **Resources**: YouTube Embeds, Google Fonts

---

## 📅 版本更新记录 | Changelog (v2.5)

- **[重大调整/Major]** 移除了内置音乐播放器，更加专注影视管理。 / Removed built-in music player for a focused experience.
- **[性能优化/Performance]** 移除了开场动画，提升首屏加载速度。 / Removed intro animation for faster startup.
- **[搜索优化/Search]** 优化了搜索建议的透明度与交互细节。 / Refined search suggestion opacity and interaction.
- **[同步完善/Sync]** 强化了立即同步与云端恢复逻辑。 / Strengthened manual sync and cloud restore logic.

---

## 🔒 隐私与安全 | Privacy & Security

- 我们不直接提供视频流，仅供观影记录。 / We do not host streaming content; we are a logging tool.
- 您的数据完全属于您（本地或您的 GitHub）。 / Your data belongs entirely to you (Local or GitHub).
- **无广告，无追踪。 / No ads, no tracking.**
- **注：proxy 文件毫无意义。 / Note: proxy file is useless.**

---

🎬 **现在就开始构建您的私人影库吧！ | Start building your private library today!** 🍿
