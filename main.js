let activeTheme = 'autumn';
let zIndexCounter = 100;
let dragItem = null;
let startY = 0, currentY = 0;

let lofiAudioStream = null;
let customAudioTrack = null;
let isLofiPlaying = false;
let currentChannelIndex = 0;
const lofiChannels = [
    { name: 'Lofi Chill Radio', url: 'https://stream.zeno.fm/f3wvbbqmdg8uv' },
    { name: 'Lofi Jazzhop', url: 'https://stream.zeno.fm/0r0xa792kwzuv' }
];

const dailyQuotes = [
    '"Hành trình vạn dặm bắt đầu từ một bước chân."',
    '"Tập trung là chìa khóa của mọi thành công."',
    '"Hãy làm những gì bạn có thể, với những gì bạn có."',
    '"Mỗi phút giây rèn luyện là một bước tiến gần hơn đến ước mơ."'
];

let audioCtx = null;
const synthNodes = {};
let isZenMode = false;
let todos = JSON.parse(localStorage.getItem('lofi_todos')) || [];

window.addEventListener('DOMContentLoaded', () => {
    initClock();
    initCanvas();
    initNotes();
    initTodos();
    initBattery();
    setupThemeSwitching();
    setupKeyboardShortcuts();
    renderRandomQuote();
});

function triggerHaptic() {
    if (navigator.vibrate) navigator.vibrate(12);
}

function renderRandomQuote() {
    const q = dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)];
    document.getElementById('daily-quote').innerText = q;
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

// CUSTOMIZATION FUNCTIONS
function setAccent(color) {
    triggerHaptic();
    document.body.className = document.body.className.replace(/accent-\w+/g, `accent-${color}`);
}

function setFont(style) {
    triggerHaptic();
    document.body.className = document.body.className.replace(/font-\w+/g, `font-${style}`);
}

function loadCustomBg(e) {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    document.getElementById('bg-overlay').style.backgroundImage = `url('${url}')`;
}

function loadCustomAudio(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (customAudioTrack) customAudioTrack.pause();
    customAudioTrack = new Audio(URL.createObjectURL(file));
    customAudioTrack.loop = true;
    customAudioTrack.play();
    document.getElementById('sound-now-playing').innerText = `File: ${file.name}`;
}

// POWER TOOLS: BATTERY & EXPORT/IMPORT
function initBattery() {
    if (navigator.getBattery) {
        navigator.getBattery().then(bat => {
            const updateBat = () => {
                document.getElementById('battery-status').innerText = `${Math.round(bat.level * 100)}% ${bat.charging ? '⚡' : ''}`;
            };
            updateBat();
            bat.addEventListener('levelchange', updateBat);
            bat.addEventListener('chargingchange', updateBat);
        });
    } else {
        document.getElementById('battery-status').innerText = 'Không hỗ trợ';
    }
}

function exportData() {
    triggerHaptic();
    const data = { notes: localStorage.getItem('lofi_notes') || '', todos: todos };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'lofi-workspace-backup.json';
    a.click();
}

function importData() {
    triggerHaptic();
    document.getElementById('import-file').click();
}

function processImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            if (data.notes !== undefined) {
                localStorage.setItem('lofi_notes', data.notes);
                document.getElementById('notepad').value = data.notes;
                updateWidgetPreview(data.notes);
            }
            if (data.todos !== undefined) {
                todos = data.todos;
                saveTodos();
            }
            alert('Nhập dữ liệu thành công!');
        } catch (err) { alert('File JSON không hợp lệ!'); }
    };
    reader.readAsText(file);
}

// ZEN MODE
function toggleZenMode() {
    triggerHaptic();
    isZenMode = !isZenMode;
    const zenDisp = document.getElementById('zen-display');
    const header = document.getElementById('ios-header');
    const desktop = document.getElementById('ios-desktop');
    const dock = document.getElementById('ios-dock');

    if (isZenMode) {
        zenDisp.style.display = 'flex';
        header.style.opacity = '0';
        desktop.style.opacity = '0';
        dock.style.opacity = '0';
    } else {
        zenDisp.style.display = 'none';
        header.style.opacity = '1';
        desktop.style.opacity = '1';
        dock.style.opacity = '1';
    }
}

// KEYBOARD SHORTCUTS
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
        if (e.code === 'Space') {
            e.preventDefault();
            toggleTimer();
        } else if (e.code === 'Escape') {
            if (isZenMode) toggleZenMode();
            document.querySelectorAll('.ios-card').forEach(win => win.style.display = 'none');
        }
    });
}

function setupThemeSwitching() {
    document.getElementById('btn-autumn').addEventListener('click', () => setTheme('autumn'));
    document.getElementById('btn-winter').addEventListener('click', () => setTheme('winter'));
}

function setTheme(theme) {
    triggerHaptic();
    activeTheme = theme;
    document.getElementById('btn-autumn').classList.toggle('active', theme === 'autumn');
    document.getElementById('btn-winter').classList.toggle('active', theme === 'winter');
    resetParticles();
    renderRandomQuote();
}

// CANVAS PARTICLES
let particles = [], canvas, ctx;
function initCanvas() {
    canvas = document.getElementById('ambient-canvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    resetParticles();
    animateParticles();
}
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
function resetParticles() {
    particles = [];
    for (let i = 0; i < (activeTheme === 'autumn' ? 30 : 50); i++) {
        particles.push({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            size: Math.random() * 8 + 2, speedY: Math.random() * 0.8 + 0.4, speedX: Math.random() * 0.6 - 0.3,
            color: activeTheme === 'autumn' ? '#ff7b54' : '#ffffff'
        });
    }
}
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.y += p.speedY; p.x += p.speedX;
        if (p.y > canvas.height) p.y = -10;
        ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2); ctx.fill();
    });
    requestAnimationFrame(animateParticles);
}

// WINDOW CONTROL & ANIMATION
function openWindow(winId) {
    triggerHaptic();
    const win = document.getElementById(winId);
    win.classList.remove('minimizing');
    win.style.display = 'flex';
    zIndexCounter++;
    win.style.zIndex = zIndexCounter;
}

function closeWindow(winId) {
    triggerHaptic();
    const win = document.getElementById(winId);
    win.classList.add('minimizing');
    setTimeout(() => {
        win.style.display = 'none';
        win.classList.remove('minimizing');
    }, 250);
}

function dragTouchStart(e, winId) {
    dragItem = document.getElementById(winId);
    startY = e.touches[0].clientY;
    document.ontouchmove = (e) => {
        if (!dragItem) return;
        currentY = e.touches[0].clientY - startY;
        if (currentY > 0) dragItem.style.transform = `translateY(${currentY}px)`;
    };
    document.ontouchend = () => {
        if (currentY > 100) closeWindow(winId);
        else if (dragItem) dragItem.style.transform = 'translateY(0)';
        document.ontouchmove = null; document.ontouchend = null; dragItem = null; currentY = 0;
    };
}

// TIMER & POMODORO
let timerInterval = null, timerSeconds = 25 * 60, isTimerRunning = false;
function toggleTimer() {
    triggerHaptic();
    const btn = document.getElementById('btn-start');
    if (isTimerRunning) {
        clearInterval(timerInterval); isTimerRunning = false; btn.innerText = 'Tiếp Tục';
    } else {
        isTimerRunning = true; btn.innerText = 'Tạm Dừng';
        timerInterval = setInterval(() => {
            if (timerSeconds > 0) {
                timerSeconds--;
                const mins = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
                const secs = (timerSeconds % 60).toString().padStart(2, '0');
                document.getElementById('timer-display').innerText = `${mins}:${secs}`;
                document.getElementById('zen-timer-display').innerText = `${mins}:${secs}`;
            } else { clearInterval(timerInterval); }
        }, 1000);
    }
}
function resetTimer() {
    clearInterval(timerInterval); isTimerRunning = false; timerSeconds = 25 * 60;
    document.getElementById('btn-start').innerText = 'Bắt Đầu';
    document.getElementById('timer-display').innerText = '25:00';
    document.getElementById('zen-timer-display').innerText = '25:00';
}

// LOFI STREAM & MIXER
function toggleLofiStream() {
    triggerHaptic();
    const btn = document.getElementById('btn-lofi-stream');
    if (!lofiAudioStream) lofiAudioStream = new Audio(lofiChannels[currentChannelIndex].url);
    if (isLofiPlaying) {
        lofiAudioStream.pause(); isLofiPlaying = false; btn.innerText = '▶ Bật Nhạc Lofi';
    } else {
        lofiAudioStream.play(); isLofiPlaying = true; btn.innerText = '⏸ Tạm Dừng Lofi';
    }
}

function changeLofiChannel() {
    triggerHaptic();
    currentChannelIndex = (currentChannelIndex + 1) % lofiChannels.length;
    const channel = lofiChannels[currentChannelIndex];
    document.getElementById('sound-now-playing').innerText = channel.name;
    if (lofiAudioStream) {
        lofiAudioStream.src = channel.url;
        if (isLofiPlaying) lofiAudioStream.play();
    }
}

function initAudioContext() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function updateVolume(type, val) {
    initAudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const gain = val / 100;
    if (!synthNodes[type]) {
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = type === 'rain' ? 'triangle' : 'sawtooth';
        osc.frequency.setValueAtTime(type === 'rain' ? 120 : 80, audioCtx.currentTime);
        osc.connect(g);
        g.connect(audioCtx.destination);
        osc.start();
        synthNodes[type] = { osc, gainNode: g };
    }
    synthNodes[type].gainNode.gain.setValueAtTime(gain * 0.1, audioCtx.currentTime);
}

function applyPreset(preset) {
    triggerHaptic();
    const rainSlider = document.getElementById('vol-rain');
    const fireSlider = document.getElementById('vol-fire');
    if (preset === 'rain') {
        rainSlider.value = 80; fireSlider.value = 0;
        updateVolume('rain', 80); updateVolume('fire', 0);
    } else if (preset === 'cozy') {
        rainSlider.value = 30; fireSlider.value = 70;
        updateVolume('rain', 30); updateVolume('fire', 70);
    } else {
        rainSlider.value = 0; fireSlider.value = 0;
        updateVolume('rain', 0); updateVolume('fire', 0);
    }
}

// TO-DO LIST
function initTodos() { renderTodos(); }
function addTodo() {
    const input = document.getElementById('todo-input');
    if (!input.value.trim()) return;
    todos.push({ text: input.value, done: false });
    input.value = '';
    saveTodos();
}
function toggleTodo(index) {
    todos[index].done = !todos[index].done;
    saveTodos();
}
function saveTodos() {
    localStorage.setItem('lofi_todos', JSON.stringify(todos));
    renderTodos();
}
function renderTodos() {
    const list = document.getElementById('todo-list');
    list.innerHTML = '';
    todos.forEach((t, i) => {
        list.innerHTML += `<li class="todo-item ${t.done ? 'done' : ''}" onclick="toggleTodo(${i})">
            <span>${t.text}</span><strong>${t.done ? '✓' : '○'}</strong>
        </li>`;
    });
}

// NOTES
function initNotes() {
    const notepad = document.getElementById('notepad');
    const val = localStorage.getItem('lofi_notes') || '';
    notepad.value = val;
    updateWidgetPreview(val);
    notepad.addEventListener('input', () => {
        localStorage.setItem('lofi_notes', notepad.value);
        updateWidgetPreview(notepad.value);
    });
}
function updateWidgetPreview(text) {
    document.getElementById('widget-note-preview').innerText = text.trim() || 'Chưa có ghi chú nào...';
}
function clearNotes() {
    triggerHaptic();
    document.getElementById('notepad').value = '';
    localStorage.removeItem('lofi_notes');
    updateWidgetPreview('');
}
