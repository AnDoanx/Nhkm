let activeTheme = 'autumn';
let zIndexCounter = 100;
let dragItem = null;
let startY = 0, currentY = 0;

let audioCtx = null;
const soundNodes = { rain: null, wind: null, fire: null, cafe: null };
let lofiAudioStream = null;
let isLofiPlaying = false;

window.addEventListener('DOMContentLoaded', () => {
    initClock();
    initCanvas();
    initNotes();
    initSysInfo();
    setupThemeSwitching();
});

// Haptic feedback (Rung nhe)
function triggerHaptic() {
    if (navigator.vibrate) navigator.vibrate(12);
}

function initClock() {
    function update() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        document.getElementById('top-clock').innerText = timeStr;
    }
    update();
    setInterval(update, 1000);
}

function setupThemeSwitching() {
    document.getElementById('btn-autumn').addEventListener('click', () => setTheme('autumn'));
    document.getElementById('btn-winter').addEventListener('click', () => setTheme('winter'));
}

function setTheme(theme) {
    triggerHaptic();
    activeTheme = theme;
    const body = document.body;
    const btnAutumn = document.getElementById('btn-autumn');
    const btnWinter = document.getElementById('btn-winter');

    if (theme === 'autumn') {
        body.className = 'theme-autumn';
        btnAutumn.classList.add('active');
        btnWinter.classList.remove('active');
    } else {
        body.className = 'theme-winter';
        btnWinter.classList.add('active');
        btnAutumn.classList.remove('active');
    }
    resetParticles();
}

// CANVAS PARTICLES
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
    const count = activeTheme === 'autumn' ? 30 : 50;
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * (activeTheme === 'autumn' ? 10 : 3) + 2,
            speedY: Math.random() * 0.8 + 0.4,
            speedX: Math.random() * 0.6 - 0.3,
            color: activeTheme === 'autumn' 
                ? ['#ff7b54', '#ffb26b', '#ffd56b'][Math.floor(Math.random() * 3)]
                : ['#ffffff', '#d4f1f9'][Math.floor(Math.random() * 2)]
        });
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
    });
    requestAnimationFrame(animateParticles);
}

// WINDOW CONTROL & CỬ CHỈ VUỐT XUỐNG ĐỂ ĐÓNG (iOS SWIPE TO CLOSE)
function openWindow(winId) {
    triggerHaptic();
    const win = document.getElementById(winId);
    win.style.display = 'flex';
    win.style.transform = 'translateY(0)';
    zIndexCounter++;
    win.style.zIndex = zIndexCounter;
}

function closeWindow(winId) {
    triggerHaptic();
    document.getElementById(winId).style.display = 'none';
}

function dragTouchStart(e, winId) {
    dragItem = document.getElementById(winId);
    startY = e.touches[0].clientY;

    document.ontouchmove = (e) => {
        if (!dragItem) return;
        currentY = e.touches[0].clientY - startY;
        if (currentY > 0) {
            dragItem.style.transform = `translateY(${currentY}px)`;
        }
    };

    document.ontouchend = () => {
        if (currentY > 120) {
            closeWindow(winId);
        } else {
            if (dragItem) dragItem.style.transform = 'translateY(0)';
        }
        document.ontouchmove = null;
        document.ontouchend = null;
        dragItem = null;
        currentY = 0;
    };
}

function dragMouseDown(e, winId) {}

// TIMER & POMODORO
let timerInterval = null, timerSeconds = 25 * 60, isTimerRunning = false;

function toggleTimer() {
    triggerHaptic();
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
                const mins = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
                const secs = (timerSeconds % 60).toString().padStart(2, '0');
                document.getElementById('timer-display').innerText = `${mins}:${secs}`;
            } else {
                clearInterval(timerInterval);
                playAlarmSound();
                if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            }
        }, 1000);
    }
}

function resetTimer() {
    triggerHaptic();
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerSeconds = 25 * 60;
    document.getElementById('btn-start').innerText = 'Bắt Đầu';
    document.getElementById('timer-display').innerText = '25:00';
}

function switchMode() { resetTimer(); }

function playAlarmSound() {
    initAudioContext();
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
    osc.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 1);
}

// LOFI STREAM & AUDIO MIXER
function toggleLofiStream() {
    triggerHaptic();
    const btn = document.getElementById('btn-lofi-stream');
    if (!lofiAudioStream) {
        lofiAudioStream = new Audio('https://stream.zeno.fm/f3wvbbqmdg8uv');
    }
    
    if (isLofiPlaying) {
        lofiAudioStream.pause();
        isLofiPlaying = false;
        btn.innerText = '▶ Bật Nhạc Lofi Stream';
    } else {
        lofiAudioStream.play();
        isLofiPlaying = true;
        btn.innerText = '⏸ Tạm Dừng Lofi Stream';
    }
}

function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function updateVolume(type, val) {
    initAudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    // Logic điều chỉnh volume
}

// NOTES & SYSINFO
function initNotes() {
    const notepad = document.getElementById('notepad');
    notepad.value = localStorage.getItem('lofi_notes') || '';
    notepad.addEventListener('input', () => localStorage.setItem('lofi_notes', notepad.value));
}

function clearNotes() {
    triggerHaptic();
    document.getElementById('notepad').value = '';
    localStorage.removeItem('lofi_notes');
}

function initSysInfo() {
    document.getElementById('sys-res').innerText = `${window.screen.width} x ${window.screen.height}`;
}
