<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no">
    <title>Lofi Workspace Ultimate iOS</title>

    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Lofi Workspace">
    <link rel="manifest" href="./manifest.json">

    <link rel="stylesheet" href="./main.css">
</head>
<body class="theme-autumn font-clean accent-orange">

    <div id="bg-overlay"></div>
    <canvas id="ambient-canvas"></canvas>

    <!-- TOP Dynamic Bar -->
    <header class="ios-status-bar" id="ios-header">
        <div class="brand">
            <span class="icon">🍁</span>
            <span class="title">Workspace</span>
        </div>
        <div class="segmented-control">
            <button id="btn-autumn" class="segment active">Mùa Thu</button>
            <button id="btn-winter" class="segment">Mùa Đông</button>
        </div>
        <button class="zen-btn" onclick="toggleZenMode()">🧘 Zen Mode</button>
        <div class="top-clock" id="top-clock">00:00</div>
    </header>

    <!-- DESKTOP WORKSPACE -->
    <main class="desktop" id="ios-desktop">
        
        <!-- WIDGET TRÊN MÀN HÌNH CHÍNH -->
        <div class="desktop-widget">
            <div class="widget-title">📌 Lời nhắc & Cảm hứng hôm nay</div>
            <div class="widget-content" id="widget-note-preview">Chưa có ghi chú nào...</div>
            <div class="quote-box" id="daily-quote">"Hành trình vạn dặm bắt đầu từ một bước chân."</div>
        </div>

        <div class="desktop-icons">
            <div class="icon-item" onclick="openWindow('win-pomodoro')">
                <div class="icon-badge">⏳</div>
                <span>Pomodoro</span>
            </div>
            <div class="icon-item" onclick="openWindow('win-music')">
                <div class="icon-badge">🎵</div>
                <span>Âm Thanh</span>
            </div>
            <div class="icon-item" onclick="openWindow('win-theme')">
                <div class="icon-badge">🎨</div>
                <span>Giao Diện</span>
            </div>
            <div class="icon-item" onclick="openWindow('win-todo')">
                <div class="icon-badge">✅</div>
                <span>Tác Vụ</span>
            </div>
            <div class="icon-item" onclick="openWindow('win-notes')">
                <div class="icon-badge">📝</div>
                <span>Ghi Chú</span>
            </div>
            <div class="icon-item" onclick="openWindow('win-power')">
                <div class="icon-badge">⚡</div>
                <span>Power Tools</span>
            </div>
        </div>

        <!-- CARD 1: POMODORO -->
        <div class="window ios-card" id="win-pomodoro">
            <div class="window-header" ontouchstart="dragTouchStart(event, 'win-pomodoro')">
                <div class="ios-handle"></div>
                <span class="win-title">⏳ Pomodoro Timer</span>
                <button class="ios-close-btn" onclick="closeWindow('win-pomodoro')">✕</button>
            </div>
            <div class="window-body">
                <div class="timer-display" id="timer-display">25:00</div>
                <div class="timer-status" id="timer-status">Thời gian tập trung (Phím Space: Phát/Dừng)</div>
                <div class="ios-btn-group">
                    <button class="action-btn primary" id="btn-start" onclick="toggleTimer()">Bắt Đầu</button>
                    <button class="action-btn" onclick="resetTimer()">Đặt Lại</button>
                </div>
            </div>
        </div>

        <!-- CARD 2: AMBIENT & LOFI PLAYER + MIXER + CUSTOM AUDIO -->
        <div class="window ios-card" id="win-music">
            <div class="window-header" ontouchstart="dragTouchStart(event, 'win-music')">
                <div class="ios-handle"></div>
                <span class="win-title">🎵 Âm Thanh & Soundboard</span>
                <button class="ios-close-btn" onclick="closeWindow('win-music')">✕</button>
            </div>
            <div class="window-body">
                <div class="lofi-status">
                    <div class="equalizer-bar" id="eq-bar">
                        <span></span><span></span><span></span><span></span><span></span>
                    </div>
                    <span id="sound-now-playing">Lofi Chill Stream</span>
                </div>

                <div class="ios-btn-group" style="margin-bottom: 8px;">
                    <button class="action-btn primary" id="btn-lofi-stream" onclick="toggleLofiStream()">▶ Bật Nhạc Lofi</button>
                    <button class="action-btn" onclick="changeLofiChannel()">📻 Đổi Kênh</button>
                </div>

                <div class="preset-group" style="margin-bottom: 12px;">
                    <span class="preset-label">Trộn sẵn:</span>
                    <button class="preset-btn" onclick="applyPreset('rain')">🌧 Mưa</button>
                    <button class="preset-btn" onclick="applyPreset('cozy')">🔥 Ấm</button>
                    <button class="preset-btn" onclick="applyPreset('reset')">🔇 Tắt</button>
                </div>
                
                <div class="sound-grid">
                    <div class="sound-card">
                        <div class="sound-info"><span>🌧️</span> Tiếng Mưa</div>
                        <input type="range" min="0" max="100" value="0" id="vol-rain" oninput="updateVolume('rain', this.value)">
                    </div>
                    <div class="sound-card">
                        <div class="sound-info"><span>🔥</span> Lửa Trại</div>
                        <input type="range" min="0" max="100" value="0" id="vol-fire" oninput="updateVolume('fire', this.value)">
                    </div>
                    <div class="sound-card">
                        <div class="sound-info"><span>🎧</span> MP3 Tự Tải</div>
                        <button class="action-btn" style="padding:4px 8px; font-size:10px;" onclick="document.getElementById('custom-audio-file').click()">Tải File</button>
                        <input type="file" id="custom-audio-file" accept="audio/*" style="display:none" onchange="loadCustomAudio(event)">
                    </div>
                </div>
            </div>
        </div>

        <!-- CARD 3: CUSTOMIZATION (THEMES, FONTS, ACCENTS) -->
        <div class="window ios-card" id="win-theme">
            <div class="window-header" ontouchstart="dragTouchStart(event, 'win-theme')">
                <div class="ios-handle"></div>
                <span class="win-title">🎨 Tùy Chỉnh Giao Diện</span>
                <button class="ios-close-btn" onclick="closeWindow('win-theme')">✕</button>
            </div>
            <div class="window-body">
                <div class="setting-section">
                    <label>Màu Accent Primary:</label>
                    <div class="theme-picker">
                        <span class="color-dot orange" onclick="setAccent('orange')"></span>
                        <span class="color-dot green" onclick="setAccent('green')"></span>
                        <span class="color-dot pink" onclick="setAccent('pink')"></span>
                        <span class="color-dot cyan" onclick="setAccent('cyan')"></span>
                    </div>
                </div>
                <div class="setting-section" style="margin-top:10px;">
                    <label>Phong cách Font:</label>
                    <div class="ios-btn-group" style="margin-top:5px;">
                        <button class="action-btn" onclick="setFont('clean')">Clean iOS</button>
                        <button class="action-btn" onclick="setFont('pixel')">Retro Pixel</button>
                        <button class="action-btn" onclick="setFont('rounded')">Rounded</button>
                    </div>
                </div>
                <div class="setting-section" style="margin-top:10px;">
                    <label>Hình nền cá nhân (GIF/Ảnh):</label>
                    <button class="action-btn primary" style="width:100%; margin-top:5px;" onclick="document.getElementById('bg-file').click()">🖼️ Chọn File Ảnh/GIF</button>
                    <input type="file" id="bg-file" accept="image/*" style="display:none" onchange="loadCustomBg(event)">
                </div>
            </div>
        </div>

        <!-- CARD 4: TO-DO LIST -->
        <div class="window ios-card" id="win-todo">
            <div class="window-header" ontouchstart="dragTouchStart(event, 'win-todo')">
                <div class="ios-handle"></div>
                <span class="win-title">✅ Danh Sách Việc</span>
                <button class="ios-close-btn" onclick="closeWindow('win-todo')">✕</button>
            </div>
            <div class="window-body">
                <div class="todo-input-group">
                    <input type="text" id="todo-input" placeholder="Thêm việc mới...">
                    <button class="action-btn primary" onclick="addTodo()">Thêm</button>
                </div>
                <ul class="todo-list" id="todo-list"></ul>
            </div>
        </div>

        <!-- CARD 5: NOTES -->
        <div class="window ios-card" id="win-notes">
            <div class="window-header" ontouchstart="dragTouchStart(event, 'win-notes')">
                <div class="ios-handle"></div>
                <span class="win-title">📝 Ghi Chú</span>
                <button class="ios-close-btn" onclick="closeWindow('win-notes')">✕</button>
            </div>
            <div class="window-body">
                <textarea id="notepad" placeholder="Nhập ghi chú..."></textarea>
                <div class="note-footer">
                    <span id="note-status">Đã lưu tự động</span>
                    <button class="action-btn danger" onclick="clearNotes()">Xóa Hết</button>
                </div>
            </div>
        </div>

        <!-- CARD 6: POWER TOOLS -->
        <div class="window ios-card" id="win-power">
            <div class="window-header" ontouchstart="dragTouchStart(event, 'win-power')">
                <div class="ios-handle"></div>
                <span class="win-title">⚡ Power Tools</span>
                <button class="ios-close-btn" onclick="closeWindow('win-power')">✕</button>
            </div>
            <div class="window-body">
                <div class="power-item">
                    <span>Mức Pin Thiết Bị:</span>
                    <strong id="battery-status">Đang tải...</strong>
                </div>
                <div class="ios-btn-group" style="margin-top: 12px;">
                    <button class="action-btn" onclick="exportData()">📥 Xuất JSON</button>
                    <button class="action-btn" onclick="importData()">📤 Nhập JSON</button>
                </div>
                <input type="file" id="import-file" style="display:none" onchange="processImport(event)">
            </div>
        </div>
    </main>

    <!-- ZEN MODE OVERLAY -->
    <div class="zen-display" id="zen-display" onclick="toggleZenMode()">
        <div class="zen-timer" id="zen-timer-display">25:00</div>
        <div class="zen-hint">Chạm vào màn hình hoặc bấm ESC để thoát Zen Mode</div>
    </div>

    <!-- iOS BOTTOM DOCK -->
    <footer class="ios-dock" id="ios-dock">
        <div class="dock-container">
            <div class="dock-item" onclick="openWindow('win-pomodoro')">⏳</div>
            <div class="dock-item" onclick="openWindow('win-music')">🎵</div>
            <div class="dock-item" onclick="openWindow('win-theme')">🎨</div>
            <div class="dock-item" onclick="openWindow('win-todo')">✅</div>
            <div class="dock-item" onclick="openWindow('win-notes')">📝</div>
            <div class="dock-item" onclick="openWindow('win-power')">⚡</div>
        </div>
    </footer>

    <script src="./main.js"></script>
</body>
</html>
