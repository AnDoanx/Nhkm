let activeTheme = 'autumn';
let zIndexCounter = 100;
let dragItem = null;
let activeOffset = { x: 0, y: 0 };

let audioCtx = null;
const soundNodes = { rain: null, wind: null, fire: null, cafe: null };

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

// WINDOW CONTROL & TOUCH DRAG (iOS)
function openWindow(winId) {
    const win = document.getElementById(winId);
    win.style.display = 'flex';
    zIndexCounter++;
    win.style.zIndex = zIndexCounter;
}

function closeWindow(winId) {
    document.getElementById(winId).style.display = 'none';
}

function dragTouchStart(e, winId) {
    dragItem = document.getElementById(winId);
    const touch = e.touches[0];
    activeOffset.x = touch.clientX - dragItem.offsetLeft;
    activeOffset.y = touch.clientY - dragItem.offsetTop;

    document.ontouchmove = (e) => {
        if (!dragItem) return;
        const touch = e.touches[0];
        dragItem.style.left = (touch.clientX - activeOffset.x) + "px";
        dragItem.style.top = (touch.clientY - activeOffset.y) + "px";
    };

    document.ontouchend = () => {
        document.ontouchmove = null;
        document.ontouchend = null;
        dragItem = null;
    };
}

function dragMouseDown(e, winId) {
    dragItem = document.getElementById(winId);
    activeOffset.x = e.clientX - dragItem.offsetLeft;
    activeOffset.y = e.clientY - dragItem.offsetTop;

    document.onmousemove = (e) => {
        if (!dragItem) return;
        dragItem.style.left = (e.clientX - activeOffset.x) + "px";
        dragItem.style.top = (e.clientY - activeOffset.y) + "px";
    };

    document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
        dragItem = null;
    };
}

// TIMER & NOTES & SYSINFO
let timerInterval = null, timerSeconds = 25 * 60, isTimerRunning = false;

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
                const mins = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
                const secs = (timerSeconds % 60).toString().padStart(2, '0');
                document.getElementById('timer-display').innerText = `${mins}:${secs}`;
            } else {
                clearInterval(timerInterval);
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerSeconds = 25 * 60;
    document.getElementById('btn-start').innerText = 'Bắt Đầu';
    document.getElementById('timer-display').innerText = '25:00';
}

function switchMode() { resetTimer(); }

function initNotes() {
    const notepad = document.getElementById('notepad');
    notepad.value = localStorage.getItem('lofi_notes') || '';
    notepad.addEventListener('input', () => localStorage.setItem('lofi_notes', notepad.value));
}

function clearNotes() {
    document.getElementById('notepad').value = '';
    localStorage.removeItem('lofi_notes');
}

function initSysInfo() {
    document.getElementById('sys-res').innerText = `${window.screen.width} x ${window.screen.height}`;
}

function updateVolume() {}
