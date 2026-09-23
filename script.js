/**
 * Configuration & App State
 */
const CONFIG = {
  DISCORD_USER_ID: "1053893912466554922", 
  TERMINAL_LOGS: `[SYSTEM] Khởi động c0mplex_kernel v2.4.1...
[OK] Gắn kết các hệ thống tệp ảo...
[OK] Thiết lập kết nối socket với API Lanyard...
[OK] Giao diện phần cứng IoT đã được khởi tạo.

Chào mừng quý khách!
Nhấn đóng [X] hoặc đợi thẻ hồ sơ tải...
`,
  TERMINAL_SPEED: 35,
  USERNAME_TEXT: "c0mplex",
  PAGE_TITLES: ["c0mplex | Bio", "IoT Enthusiast", "Chiikawa Lover (◕‿◕)"]
};

document.addEventListener("DOMContentLoaded", () => {
  initAnimatedTitle();
  initTerminal();
  initUsernameTyping();
  initMediaController();
  initVanillaTiltEffect();
  initDiscordLanyard(CONFIG.DISCORD_USER_ID);
});

/* --------------------------------------------------------------------------
   1. Đổi Title tab trình duyệt tuần hoàn
-------------------------------------------------------------------------- */
function initAnimatedTitle() {
  let index = 0;
  setInterval(() => {
    document.title = CONFIG.PAGE_TITLES[index];
    index = (index + 1) % CONFIG.PAGE_TITLES.length;
  }, 2000);
}

/* --------------------------------------------------------------------------
   2. Logic Terminal (Đã fix chạm trên cảm ứng + Tự đóng khi xong)
-------------------------------------------------------------------------- */
function initTerminal() {
  const terminal = document.getElementById("terminal");
  const terminalText = document.getElementById("terminal-text");
  const closeBtn = document.getElementById("close-button");
  const minBtn = document.getElementById("minimize-button");
  const maxBtn = document.getElementById("maximize-button");
  const profileCard = document.getElementById("blurred-box");

  if (!terminal || !terminalText) return;

  function closeTerminal() {
    terminal.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    terminal.style.opacity = "0";
    terminal.style.transform = "translate(-50%, -50%) scale(0.9)";
    setTimeout(() => {
      terminal.style.display = "none";
      if (profileCard) profileCard.style.display = "flex";
      document.body.classList.add("video-normal");
    }, 300);
  }

  // Gõ chữ tự động
  let i = 0;
  function typeLog() {
    if (i < CONFIG.TERMINAL_LOGS.length) {
      terminalText.textContent += CONFIG.TERMINAL_LOGS.charAt(i);
      i++;
      setTimeout(typeLog, CONFIG.TERMINAL_SPEED);
    } else {
      setTimeout(closeTerminal, 1500);
    }
  }
  typeLog();

  // Nút đóng terminal
  if (closeBtn) {
    ["click", "touchend"].forEach(evt => {
      closeBtn.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeTerminal();
      });
    });
  }

  // Nút thu nhỏ
  if (minBtn) {
    let isMinimized = false;
    const toggleMin = (e) => {
      e.preventDefault();
      const content = document.getElementById("terminal-content");
      if (!isMinimized) {
        content.style.display = "none";
        terminal.style.height = "46px";
      } else {
        content.style.display = "block";
        terminal.style.height = "420px";
      }
      isMinimized = !isMinimized;
    };
    ["click", "touchend"].forEach(evt => minBtn.addEventListener(evt, toggleMin));
  }

  // Nút phóng to
  if (maxBtn) {
    let isMaximized = false;
    const toggleMax = (e) => {
      e.preventDefault();
      if (!isMaximized) {
        terminal.style.top = "50%";
        terminal.style.left = "50%";
        terminal.style.width = "96vw";
        terminal.style.height = "94vh";
        terminal.style.maxHeight = "94vh";
      } else {
        terminal.removeAttribute("style");
        terminal.style.display = "flex";
      }
      isMaximized = !isMaximized;
    };
    ["click", "touchend"].forEach(evt => maxBtn.addEventListener(evt, toggleMax));
  }
}

/* --------------------------------------------------------------------------
   3. Hiệu ứng gõ chữ Username
-------------------------------------------------------------------------- */
function initUsernameTyping() {
  const userEl = document.getElementById("username");
  if (!userEl) return;

  const text = CONFIG.USERNAME_TEXT;
  let charIdx = 0;
  let isBackspacing = false;

  function loop() {
    userEl.textContent = text.substring(0, charIdx);

    if (!isBackspacing && charIdx < text.length) {
      charIdx++;
      setTimeout(loop, 120);
    } else if (isBackspacing && charIdx > 0) {
      charIdx--;
      setTimeout(loop, 60);
    } else {
      isBackspacing = !isBackspacing;
      setTimeout(loop, isBackspacing ? 2500 : 500);
    }
  }
  loop();
}

/* --------------------------------------------------------------------------
   4. Quản lý Video Background & Âm lượng
-------------------------------------------------------------------------- */
function initMediaController() {
  const video = document.getElementById("myVideo");
  const volumeSlider = document.getElementById("volume-slider");
  const progressBar = document.getElementById("progress-bar");

  if (!video) return;

  if (volumeSlider) {
    video.volume = volumeSlider.value / 100;
    volumeSlider.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value) / 100;
      video.volume = val;
      video.muted = (val === 0);
      if (video.paused) video.play().catch(() => {});
    });
  }

  if (progressBar) {
    video.addEventListener("timeupdate", () => {
      if (video.duration) {
        const progress = (video.currentTime / video.duration) * 100;
        progressBar.style.width = `${progress}%`;
      }
    });
  }

  const unlockAudio = () => {
    if (video.paused) video.play().catch(() => {});
  };
  document.addEventListener("touchstart", unlockAudio, { once: true });
  document.addEventListener("click", unlockAudio, { once: true });
}

/* --------------------------------------------------------------------------
   5. Hiệu ứng 3D Tilt
-------------------------------------------------------------------------- */
function initVanillaTiltEffect() {
  const card = document.getElementById("blurred-box");
  if (card && typeof VanillaTilt !== "undefined") {
    VanillaTilt.init(card, {
      max: 10,
      speed: 400,
      glare: true,
      "max-glare": 0.2,
    });
  }
}

/* --------------------------------------------------------------------------
   6. Discord Widget (Tự cập nhật cả ảnh Profile chính)
-------------------------------------------------------------------------- */
function initDiscordLanyard(userId) {
  if (!userId) return;

  const mainPfp = document.getElementById("profile-picture");
  const avatarImg = document.getElementById("discord-avatar");
  const usernameText = document.getElementById("discord-username");
  const statusDot = document.getElementById("discord-status-dot");
  const statusText = document.getElementById("discord-status-text");

  const actInfo = document.getElementById("discord-activity-info");
  const noAct = document.getElementById("discord-no-activity");
  const actName = document.getElementById("discord-activity-name");
  const actDetails = document.getElementById("discord-activity-details");
  const actState = document.getElementById("discord-activity-state");
  const albumArt = document.getElementById("discord-album-art");

  // Gọi REST API hiển thị dữ liệu tức thì
  fetch(`https://api.lanyard.rest/v1/users/${userId}`)
    .then(res => res.json())
    .then(data => {
      if (data.success && data.data) {
        renderDiscord(data.data);
      }
    })
    .catch(err => console.error("Lanyard Error:", err));

  // Kết nối WebSocket thời gian thực
  const socket = new WebSocket("wss://api.lanyard.rest/socket");

  socket.onopen = () => {
    socket.send(JSON.stringify({
      op: 2,
      d: { subscribe_to_id: userId }
    }));
  };

  socket.onmessage = (event) => {
    try {
      const res = JSON.parse(event.data);
      if (res.op === 1) {
        setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ op: 3 }));
          }
        }, res.d.heartbeat_interval);
      }
      if (res.t === "INIT_STATE" || res.t === "PRESENCE_UPDATE") {
        renderDiscord(res.d);
      }
    } catch (e) {
      console.error(e);
    }
  };

  function renderDiscord(data) {
    if (!data) return;

    const user = data.discord_user;
    if (user) {
      if (usernameText) usernameText.textContent = user.global_name || user.username;
      
      const ext = user.avatar && user.avatar.startsWith("a_") ? "gif" : "png";
      const pfpUrl = user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=128`
        : `https://cdn.discordapp.com/embed/avatars/0.png`;

      // Cập nhật cả avatar discord widget và avatar lớn trên cùng
      if (avatarImg) avatarImg.src = pfpUrl;
      if (mainPfp) mainPfp.src = pfpUrl;
    }

    // Cập nhật status
    const status = data.discord_status || "offline";
    if (statusDot) {
      statusDot.className = "";
      statusDot.classList.add(`status-${status}`);
    }
    if (statusText) {
      statusText.textContent = status.toUpperCase();
    }

    // Hoạt động
    const spotify = data.spotify;
    const activities = data.activities || [];
    const customActivity = activities.find(a => a.type === 0 || a.type === 2);

    if (spotify) {
      showActivity({
        title: spotify.song,
        sub1: `bởi ${spotify.artist}`,
        sub2: `trên ${spotify.album}`,
        art: spotify.album_art_url
      });
    } else if (customActivity) {
      let artUrl = null;
      if (customActivity.assets && customActivity.assets.large_image) {
        const raw = customActivity.assets.large_image;
        artUrl = raw.startsWith("mp:external")
          ? `https://media.discordapp.net/${raw.replace("mp:", "")}`
          : `https://cdn.discordapp.com/app-assets/${customActivity.application_id}/${raw}.png`;
      }
      showActivity({
        title: customActivity.name,
        sub1: customActivity.details || "",
        sub2: customActivity.state || "",
        art: artUrl
      });
    } else {
      if (actInfo) actInfo.style.setProperty("display", "none", "important");
      if (noAct) noAct.style.setProperty("display", "flex", "important");
    }
  }

  function showActivity({ title, sub1, sub2, art }) {
    if (noAct) noAct.style.setProperty("display", "none", "important");
    if (actInfo) actInfo.style.setProperty("display", "flex", "important");

    if (actName) actName.textContent = title;
    if (actDetails) actDetails.textContent = sub1;
    if (actState) actState.textContent = sub2;

    if (albumArt) {
      if (art) {
        albumArt.style.backgroundImage = `url('${art}')`;
        albumArt.style.display = "block";
      } else {
        albumArt.style.display = "none";
      }
    }
  }
}
