// 时间更新函数（添加动画效果）
function updateDateTime() {
    const timeElement = document.getElementById('current-time');
    timeElement.classList.add('time-updating');
    
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    setTimeout(() => {
        timeElement.textContent = `${hours}:${minutes}`;
        timeElement.classList.remove('time-updating');
    }, 10);

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    document.getElementById('current-date').textContent =`${month}月${day}日`;
}

// 初始化时间
updateDateTime();
setInterval(updateDateTime, 1000);

// 音乐播放器功能
const playPauseBtn = document.getElementById('play-pause');
const albumArt = document.getElementById('album-art');
const progressBar = document.getElementById('progress-bar');
const progress = document.getElementById('progress');
const currentTimeDisplay = document.getElementById('audio-current-time');
const durationDisplay = document.getElementById('duration');
const audioPlayer = document.getElementById('audio-player');
const songTitleElement = document.querySelector('.song-title');
const artistNameElement = document.querySelector('.artist');


// 播放/暂停功能
const playPauseIcon = document.getElementById('play-pause-icon');
function togglePlay() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseIcon.src = "icons/pause.svg";
        albumArt.classList.add('playing');
    } else {
        audioPlayer.pause();
        playPauseIcon.src = "icons/play.svg";
        albumArt.classList.remove('playing');
    }
}

// 更新进度条
function updateProgress() {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    
    if (!isNaN(duration)) {
        const percent = (currentTime / duration) * 100;
        progress.style.width = `${percent}%`;
        progressBar.style.setProperty('--progress-percent', `${percent}%`);
        progressBar.style.setProperty('--progress-position', `${percent}%`);
        currentTimeDisplay.textContent = formatTime(currentTime);
    }
}

// 跳转播放位置
function seekPosition(e) {
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audioPlayer.currentTime = pos * audioPlayer.duration;
}

// 格式化时间
function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

// 初始化播放器
function initPlayer() {
    songTitleElement.textContent = "ACGN国歌";
    artistNameElement.textContent = "BGM:AIR鸟之诗";
    
    audioPlayer.addEventListener('loadedmetadata', () => {
        durationDisplay.textContent = formatTime(audioPlayer.duration);
    });
    
    playPauseBtn.addEventListener('click', togglePlay);
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', () => {
        if (audioPlayer.loop) {
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        }
    });
    progressBar.addEventListener('click', seekPosition);
    
    // 添加音频加载状态处理
    audioPlayer.addEventListener('waiting', () => {
        albumArt.classList.add('loading');
    });
    audioPlayer.addEventListener('canplay', () => {
        albumArt.classList.remove('loading');
    });
    
    // 添加触摸事件支持
    progressBar.addEventListener('touchstart', handleTouch);
    progressBar.addEventListener('touchmove', handleTouch);
}

// 触摸事件处理
function handleTouch(e) {
    const touch = e.touches[0];
    const rect = progressBar.getBoundingClientRect();
    const pos = (touch.clientX - rect.left) / rect.width;
    audioPlayer.currentTime = pos * audioPlayer.duration;
    updateProgress();
}

// 流星效果
const MAX_METEORS = 8;
let activeMeteors = 0;

function createMeteor() {
    if (activeMeteors >= MAX_METEORS) return;
    
    activeMeteors++;
    const container = document.querySelector('.meteors-container');
    const meteor = document.createElement('div');
    meteor.classList.add('meteor');
    
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    
    // 固定方向：从右上到左下 (-45度)
    const angle = -30; // 固定角度
    
    // 调整起始点和结束点生成逻辑
    const startX = vw + 50 + Math.random() * 500;
    const startY = -50 - Math.random() * 300;
    const endX = -50 - Math.random() * 400;
    const endY = vh + 50 + Math.random() * 500;
    
    meteor.style.cssText = `
        top: ${startY}px;
        left: ${startX}px;
        width: ${80 + Math.random() * 120}px;
        height: ${1 + Math.random() * 2}px;
        background: linear-gradient(to right, 
            transparent, 
            rgba(255, 255, 255, ${0.7 + Math.random() * 0.3}), 
            rgba(200, 220, 255, 0.3),
            transparent);
        animation: meteor-fall ${3 + Math.random() * 2}s linear forwards;
        filter: blur(1px);
        box-shadow: 0 0 10px 2px rgba(180, 220, 255, 0.8);
        transform: rotate(${angle}deg);
        opacity: 0;
        transform-origin: left center;
    `;
    
    meteor.style.setProperty('--translate-x', `${endX - startX}px`);
    meteor.style.setProperty('--translate-y', `${endY - startY}px`);
    
    // 添加点击交互
    meteor.addEventListener('click', () => {
        meteor.style.animation = 'none';
        meteor.style.transform = 'scale(2)';
        meteor.style.opacity = '0';
        meteor.style.transition = 'all 0.5s ease';
        setTimeout(() => {
            meteor.remove();
            activeMeteors--;
        }, 500);
    });
    
    meteor.addEventListener('animationend', () => {
        meteor.remove();
        activeMeteors--;
    });
    
    container.appendChild(meteor);
}

// 初始化流星效果
function initMeteors() {
    setInterval(createMeteor, 1000);
}


// 响应式布局调整
function adjustLayout() {
    const container = document.querySelector('.container');
    
    // 移动端特殊处理
    if (window.innerWidth < 768) {
        document.body.classList.add('mobile-view');
        
        // 调整音乐播放器高度
        const player = document.querySelector('.music-player');
        if (player) player.style.height = 'auto';
        
        // 简化时间显示
        if (window.innerWidth < 480) {
            const timeDisplay = document.querySelector('.time-display.horizontal');
            if (timeDisplay) {
                timeDisplay.style.flexDirection = 'column';
                timeDisplay.style.alignItems = 'flex-start';
            }
        }
    } else {
        document.body.classList.remove('mobile-view');
    }
}

// 页面初始化
window.addEventListener('load', () => {
    initPlayer();
    initMeteors();
    adjustLayout();
});

// 窗口调整时重新计算布局
window.addEventListener('resize', adjustLayout);