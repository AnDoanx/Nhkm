/**
 * Configuration & App State
 */
const CONFIG = {
  // Discord User ID của bạn đã được gắn vào đây:
  DISCORD_USER_ID: "1053893912466554922", 
  
  // Chữ chạy trong terminal giả lập:
  TERMINAL_LOGS: `[SYSTEM] Booting c0mplex_kernel v2.4.1...
[OK] Mounting virtual filesystems...
[OK] Establishing socket connection to Lanyard API...
[OK] IoT hardware interfaces initialized.

Welcome, guest!
Press close [X] or wait for the profile card to load...
`,
  TERMINAL_SPEED: 35,
  USERNAME_TEXT: "c0mplex",
  PAGE_TITLES: ["c0mplex | Bio", "IoT Enthusiast", "Welcome to my page!"]
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
   2. Logic giả lập Terminal (Gõ chữ + Nút điều khiển)
-------------------------------------------------------------------------- */
function initTerminal() {
  const terminal = document.getElementById("terminal");
  const terminalText = document.getElementById("terminal-text");
  const closeBtn = document.getElementById("close-button");
  const minBtn = document.getElementById("minimize-button");
  const maxBtn = document.getElementById("maximize-button");
  const profileCard = document.getElementById("blurred-box");

  if (!terminal || !terminalText) return;

  let i = 0;
  function typeLog() {
    if (i < CONFIG.TERMINAL_LOGS.length) {
      terminalText.textContent += CONFIG.TERMINAL_LOGS.charAt(i);
      i++;
      setTimeout(typeLog, CONFIG.TERMINAL_SPEED);
    } else {
      setTimeout(() => {
        if (profileCard) profileCard.style.display = "block";
      }, 500);
    }
  }
  typeLog();

  // Nút đóng terminal
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      terminal.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      terminal.style.opacity = "0";
      terminal.style.transform = "scale(0.95)";
      setTimeout(() => {
        terminal.style.display = "none";
        if (profileCard) profileCard.style.display = "block";
        document.body.classList.add("video-normal");
      }, 300);
    });
  }

  // Nút thu nhỏ
  if (minBtn) {
    let isMinimized = false;
    minBtn.addEventListener("click", () => {
      const content = document.getElementById("terminal-content");
      if (!isMinimized) {
        content.style.display = "none";
        terminal.style.height = "42px";
      } else {
        content.style.display = "block";
        terminal.style.height = "500px";
      }
      isMinimized = !isMinimized;
    });
  }

  // Nút phóng to toàn màn hình
  if (maxBtn) {
    let isMaximized = false;
    maxBtn.addEventListener("click", () => {
      if (!isMaximized) {
        terminal.style.top = "10px";
        terminal.style.left = "10px";
        terminal.style.width = "calc(100vw - 20px)";
        terminal.style.height = "calc(100vh - 20px)";
      } else {
        terminal.removeAttribute("style");
      }
      isMaximized = !isMaximized;
    });
  }
}

/* --------------------------------------------------------------------------
   3. Hiệu ứng gõ chữ Username lặp lại
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
   4. Quản lý Video Background & Thanh âm lượng / Tiến trình
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

  // Khắc phục chính sách Autoplay của trình duyệt khi click chuột lần đầu
  document.addEventListener("click", () => {
    if (video.paused) {
      video.play().catch(() => {});
    }
  }, { once: true });
}

/* --------------------------------------------------------------------------
   5. Hiệu ứng nghiêng 3D (Vanilla Tilt)
-------------------------------------------------------------------------- */
function initVanillaTiltEffect() {
  const card = document.getElementById("blurred-box");
  if (card && typeof VanillaTilt !== "undefined") {
    VanillaTilt.init(card, {
      max: 12,
      speed: 400,
      glare: true,
      "max-glare": 0.25,
    });
  }
}

/* --------------------------------------------------------------------------
   6. Discord Widget thời gian thực qua WebSocket Lanyard API
-------------------------------------------------------------------------- */
function initDiscordLanyard(userId) {
  if (!userId) return;

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

  const socket = new WebSocket("wss://api.lanyard.rest/socket");

  socket.onopen = () => {
    socket.send(JSON.stringify({
      op: 2,
      d: { subscribe_to_id: userId }
    }));
  };

  socket.onmessage = (event) => {
    const res = JSON.parse(event.data);

    // Heartbeat định kỳ giữ kết nối socket
    if (res.op === 1) {
      setInterval(() => {
        socket.send(JSON.stringify({ op: 3 }));
      }, res.d.heartbeat_interval);
    }

    if (res.t === "INIT_STATE" || res.t === "PRESENCE_UPDATE") {
      renderDiscord(res.d);
    }
  };

  function renderDiscord(data) {
    if (!data) return;

    // 1. Tên & Avatar
    const user = data.discord_user;
    if (usernameText) usernameText.textContent = user.global_name || user.username;
    if (avatarImg) {
      const ext = user.avatar && user.avatar.startsWith("a_") ? "gif" : "png";
      avatarImg.src = user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=128`
        : `https://cdn.discordapp.com/embed/avatars/0.png`;
    }

    // 2. Trạng thái online / idle / dnd / offline
    if (statusDot) {
      statusDot.className = "";
      statusDot.classList.add(`status-${data.discord_status}`);
    }
    if (statusText) {
      statusText.textContent = data.discord_status.toUpperCase();
    }

    // 3. Hoạt động (Spotify hoặc Game)
    const spotify = data.spotify;
    const activity = (data.activities || []).find(a => a.type === 0 || a.type === 2);

    if (spotify) {
      setActivityDisplay({
        title: spotify.song,
        sub1: `by ${spotify.artist}`,
        sub2: `on ${spotify.album}`,
        art: spotify.album_art_url
      });
    } else if (activity) {
      let icon = null;
      if (activity.assets && activity.assets.large_image) {
        const raw = activity.assets.large_image;
        icon = raw.startsWith("mp:external")
          ? `https://media.discordapp.net/${raw.replace("mp:", "")}`
          : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${raw}.png`;
      }
      setActivityDisplay({
        title: activity.name,
        sub1: activity.details || "",
        sub2: activity.state || "",
        art: icon
      });
    } else {
      if (actInfo) actInfo.style.display = "none";
      if (noAct) noAct.style.display = "flex";
    }
  }

  function setActivityDisplay({ title, sub1, sub2, art }) {
    if (noAct) noAct.style.display = "none";
    if (actInfo) actInfo.style.display = "flex";

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
