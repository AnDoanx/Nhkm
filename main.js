let activeTheme = 'autumn';
let zIndexCounter = 100;
let dragItem = null;
let activeOffset = { x: 0, y: 0 };

let audioCtx = null;
const soundNodes = {
    rain: null,
    wind: null,
    fire: null,
    cafe: null
};

window.addEventListener('DOMContentLoaded', () => {
    initClock();
    initCanvas();
    initNotes();
    initSysInfo();
    setupThemeSwitching();
});

function initClock() {
    function update() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('vi-VN');
        const dateStr = now.toLocaleDateString('vi-VN');
        
        document.getElementById('top-clock').innerText = timeStr;
        document.getElementById('taskbar-date').innerText = dateStr;
    }
    update();
    setInterval(update, 1000);
}

function setupThemeSwitching() {
    const btnAutumn = document.getElementById('btn-autumn');
    const btnWinter = document.getElementById('btn-winter');

    btnAutumn.addEventListener('click', () => setTheme('autumn'));
    btnWinter.addEventListener('click', () => setTheme('winter'));
}

function setTheme(theme) {
    activeTheme = theme;
    const body = document.body;
    const btnAutumn = document.getElementById('btn-autumn');
    const btnWinter = document.getElementById('btn-winter');
    const startIcon = document.getElementById('start-icon');
    const windIcon = document.getElementById('wind-icon');
    const windLabel = document.getElementById('wind-label');
    const startQuote = document.getElementById('start-quote');

    if (theme === 'autumn') {
        body.className = 'theme-autumn';
        btnAutumn.classList.add('active');
        btnWinter.classList.remove('active');
        startIcon.innerText = '🍁';
        windIcon.innerText = '🍂';
        windLabel.innerText = 'Gió Thu';
        startQuote.innerText = '"Mùa thu là mùa khai trường của những ước mơ."';
    } else {
        body.className = 'theme-winter';
        btnWinter.classList.add('active');
        btnAutumn.classList.remove('active');
        startIcon.innerText = '❄️';
        windIcon.innerText = '🌬️';
        windLabel.innerText = 'Gió Tuyết';
        startQuote.innerText = '"Mùa đông ấm áp khi tâm trí bình yên."';
    }
    resetParticles();
}

let particles = [];
let canvas, ctx;

function initCanvas() {
    canvas = document.getElementById('ambient-canvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    resetParticles();
    animateParticles();
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function resetParticles() {
    particles = [];
    const count = activeTheme === 'autumn' ? 35 : 70;
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * (activeTheme === 'autumn' ? 12 : 4) + 2,
            speedY: Math.random() * 1 + 0.5,
            speedX: Math.random() * 1 - 0.5,
            rotation: Math.random() * 360,
            rotSpeed: Math.random() * 2 - 1,
            color: activeTheme === 'autumn' 
                ? ['#d97736', '#c0392b', '#f39c12', '#e67e22'][Math.floor(Math.random() * 4)]
                : ['#ffffff', '#d4f1f9', '#a9cce3'][Math.floor(Math.random() * 3)]
        });
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;

        if (p.y > canvas.height) {
            p.y = -10;
            p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
    requestAnimationFrame(animateParticles);
}

function dragMouseDown(e, winId) {
    e.preventDefault();
    dragItem = document.getElementById(winId);
    
    zIndexCounter++;
    dragItem.style.zIndex = zIndexCounter;

    activeOffset.x = e.clientX - dragItem.offsetLeft;
    activeOffset.y = e.clientY - dragItem.offsetTop;

    document.onmousemove = elementDrag;
    document.onmouseup = closeDragElement;
}

function elementDrag(e) {
    e.preventDefault();
    if (!dragItem) return;
    dragItem.style.left = (e.clientX - activeOffset.x) + "px";
    dragItem.style.top = (e.clientY - activeOffset.y) + "px";
}

function closeDragElement() {
    document.onmousemove = null;
    document.onmouseup = null;
    dragItem = null;
}

function openWindow(winId) {
    const win = document.getElementById(winId);
    win.style.display = 'flex';
    zIndexCounter++;
    win.style.zIndex = zIndexCounter;
}

function closeWindow(winId) {
    const win = document.getElementById(winId);
    win.style.display = 'none';
}

function toggleStartMenu() {
    const menu = document.getElementById('start-menu');
    menu.style.display = (menu.style.display === 'flex') ? 'none' : 'flex';
}

let timerInterval = null;
let timerSeconds = 25 * 60;
let isTimerRunning = false;
let isWorkMode = true;

function toggleTimer() {
    const btn = document.getElementById('btn-start');
    if (isTimerRunning) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        btn.innerText = 'Tiếp Tục';
    } else {
        isTimerRunning = true;
        btn.innerText = 'Tạm Dừng';
        timerInterval = setInterval(() => {
            if (timerSeconds > 0) {
                timerSeconds--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                alert(isWorkMode ? "Đã hết 25p! Hãy nghỉ ngơi chút nhé." : "Hết giờ nghỉ! Vào việc thôi.");
                switchMode();
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerSeconds = isWorkMode ? 25 * 60 : 5 * 60;
    document.getElementById('btn-start').innerText = 'Bắt Đầu';
    updateTimerDisplay();
}

function switchMode() {
    isWorkMode = !isWorkMode;
    timerSeconds = isWorkMode ? 25 * 60 : 5 * 60;
    document.getElementById('timer-status').innerText = isWorkMode ? "Thời gian tập trung" : "Thời gian nghỉ ngơi";
    resetTimer();
}

function updateTimerDisplay() {
    const mins = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
    const secs = (timerSeconds % 60).toString().padStart(2, '0');
    document.getElementById('timer-display').innerText = `${mins}:${secs}`;
}

function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function createNoiseBuffer() {
    const bufferSize = audioCtx.sampleRate * 2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    return buffer;
}

function updateVolume(type, val) {
    initAudioContext();
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const volume = val / 100;

    if (!soundNodes[type]) {
        if (volume > 0) {
            const whiteNoise = audioCtx.createBufferSource();
            whiteNoise.buffer = createNoiseBuffer();
            whiteNoise.loop = true;

            const filter = audioCtx.createBiquadFilter();
            if (type === 'rain') filter.type = 'lowpass', filter.frequency.value = 1000;
            if (type === 'wind') filter.type = 'bandpass', filter.frequency.value = 400;
            if (type === 'fire') filter.type = 'highpass', filter.frequency.value = 800;
            if (type === 'cafe') filter.type = 'lowpass', filter.frequency.value = 500;

            const gainNode = audioCtx.createGain();
            gainNode.gain.value = volume;

            whiteNoise.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            whiteNoise.start();
            soundNodes[type] = { source: whiteNoise, gain: gainNode };
        }
    } else {
        soundNodes[type].gain.gain.value = volume;
    }
}

function initNotes() {
    const notepad = document.getElementById('notepad');
    const saved = localStorage.getItem('lofi_notes');
    if (saved) notepad.value = saved;

    notepad.addEventListener('input', () => {
        localStorage.setItem('lofi_notes', notepad.value);
        document.getElementById('note-status').innerText = 'Đã lưu tự động';
    });
}

function clearNotes() {
    document.getElementById('notepad').value = '';
    localStorage.removeItem('lofi_notes');
    document.getElementById('note-status').innerText = 'Đã xóa';
}

function initSysInfo() {
    document.getElementById('sys-res').innerText = `${window.screen.width} x ${window.screen.height}`;
    document.getElementById('sys-platform').innerText = navigator.platform || 'Unknown OS';
    document.getElementById('sys-browser').innerText = navigator.userAgent.includes('Chrome') ? 'Chrome / Chromium' : 'Trình duyệt Web';
}
