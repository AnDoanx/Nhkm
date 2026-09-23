/**
 * Configuration & State
 */
const CONFIG = {
  // Thay ID Discord của bạn vào đây để Lanyard kéo avatar, status và activity
  DISCORD_USER_ID: "c0mplex07", // Nhập Discord ID dạng số (VD: "928374928374928374")
  TYPING_SPEED: 40,
  TERMINAL_TEXT: `Initializing complex_os v2.4.1...
Loading kernel modules... [OK]
Mounting local filesystems... [OK]
Connecting to Lanyard WebSocket... [CONNECTED]
IoT Node Bridge initialized.

Welcome, guest!
Type 'help' to see available commands or wait to open profile view...
`,
  USERNAME_TEXT: "c0mplex",
};

document.addEventListener("DOMContentLoaded", () => {
  initTerminal();
  initUsernameAnimation();
  initMediaControls();
  initDiscordLanyard(CONFIG.DISCORD_USER_ID);
  initVanillaTilt();
});

/* ==========================================================================
   1. Terminal Window Logic & Typing Animation
   ========================================================================== */
function initTerminal() {
  const terminal = document.getElementById("terminal");
  const terminalText = document.getElementById("terminal-text");
  const closeBtn = document.getElementById("close-button");
  const minBtn = document.getElementById("minimize-button");
  const maxBtn = document.getElementById("maximize-button");
  const profileCard = document.getElementById("blurred-box");

  let charIndex = 0;

  function typeText() {
    if (charIndex < CONFIG.TERMINAL_TEXT.length) {
      terminalText.textContent += CONFIG.TERMINAL_TEXT.charAt(charIndex);
      charIndex++;
      setTimeout(typeText, CONFIG.TYPING_SPEED);
    } else {
      // Khi gõ xong terminal, tự động hiển thị Profile Card và làm mờ overlay
      setTimeout(() => {
        if (profileCard) profileCard.style.display = "block";
      }, 500);
    }
  }

  typeText();

  // Nút đóng terminal
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      terminal.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      terminal.style.opacity = "0";
      terminal.style.transform = "scale(0.9)";
      setTimeout(() => {
        terminal.style.display = "none";
        if (profileCard) profileCard.style.display = "block";
        document.body.classList.add("video-normal");
      }, 300);
    });
  }

  // Nút thu nhỏ
  if (minBtn) {
    let minimized = false;
    minBtn.addEventListener("click", () => {
      const content = document.getElementById("terminal-content");
      if (!minimized) {
        content.style.display = "none";
        terminal.style.height = "42px";
      } else {
        content.style.display = "block";
        terminal.style.height = "500px";
      }
      minimized = !minimized;
    });
  }

  // Nút phóng to
  if (maxBtn) {
    let maximized = false;
    maxBtn.addEventListener("click", () => {
      if (!maximized) {
        terminal.dataset.prevStyle = terminal.getAttribute("style") || "";
        terminal.style.top = "10px";
        terminal.style.left = "10px";
        terminal.style.width = "calc(100vw - 20px)";
        terminal.style.height = "calc(100vh - 20px)";
      } else {
        terminal.removeAttribute("style");
      }
      maximized = !maximized;
    });
  }
}

/* ==========================================================================
   2. Username Typing / Looping Effect
   ========================================================================== */
function initUsernameAnimation() {
  const usernameEl = document.getElementById("username");
  if (!usernameEl) return;

  const targetText = CONFIG.USERNAME_TEXT;
  let index = 0;
  let isDeleting = false;

  function loop() {
    usernameEl.textContent = targetText.substring(0, index);

    if (!isDeleting && index < targetText.length) {
      index++;
      setTimeout(loop, 120);
    } else if (isDeleting && index > 0) {
      index--;
      setTimeout(loop, 60);
    } else {
      isDeleting = !isDeleting;
      setTimeout(loop, isDeleting ? 2000 : 500);
    }
  }

  loop();
}

/* ==========================================================================
   3. Background Video & Audio Controls
   ========================================================================== */
function initMediaControls() {
  const video = document.getElementById("myVideo");
  const volumeSlider = document.getElementById("volume-slider");
  const progressBar = document.getElementById("progress-bar");

  if (video && volumeSlider) {
    // Trình duyệt chặn autoplay có tiếng -> bắt đầu với muted, bật volume khi user kéo slider
    video.volume = volumeSlider.value / 100;

    volumeSlider.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value) / 100;
      video.volume = val;
      video.muted = val === 0;
      if (video.paused) video.play();
    });

    // Cập nhật thanh tiến trình video
    video.addEventListener("timeupdate", () => {
      if (progressBar && video.duration) {
        const progress = (video.currentTime / video.duration) * 100;
        progressBar.style.width = `${progress}%`;
      }
    });
  }

  // Tự động phát khi user click lần đầu tiên nếu autoplay bị trình duyệt chặn
  document.addEventListener("click", () => {
    if (video && video.paused) {
      video.play().catch(() => {});
    }
  }, { once: true });
}

/* ==========================================================================
   4. Discord Status via Lanyard WebSocket API
   ========================================================================== */
function initDiscordLanyard(userId) {
  if (!userId || userId === "c0mplex07") return; // Bỏ qua nếu chưa đổi sang ID số

  const avatarImg = document.getElementById("discord-avatar");
  const usernameText = document.getElementById("discord-username");
  const statusDot = document.getElementById("discord-status-dot");
  const statusText = document.getElementById("discord-status-text");

  const activityBox = document.getElementById("discord-activity-info");
  const noActivityBox = document.getElementById("discord-no-activity");
  const activityName = document.getElementById("discord-activity-name");
  const activityDetails = document.getElementById("discord-activity-details");
  const activityState = document.getElementById("discord-activity-state");
  const albumArt = document.getElementById("discord-album-art");

  const socket = new WebSocket("wss://api.lanyard.rest/socket");

  socket.addEventListener("open", () => {
    // Gửi heartbeat khởi tạo
    socket.send(JSON.stringify({
      op: 2,
      d: { subscribe_to_id: userId }
    }));
  });

  socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);

    // Heartbeat định kỳ
    if (data.op === 1) {
      const interval = data.d.heartbeat_interval;
      setInterval(() => {
        socket.send(JSON.stringify({ op: 3 }));
      }, interval);
    }

    // Cập nhật dữ liệu người dùng
    if (data.t === "INIT_STATE" || data.t === "PRESENCE_UPDATE") {
      updateDiscordUI(data.d);
    }
  });

  function updateDiscordUI(presence) {
    if (!presence) return;

    // 1. User & Avatar
    const user = presence.discord_user;
    if (usernameText) usernameText.textContent = user.global_name || user.username;
    if (avatarImg) {
      const avatarHash = user.avatar;
      const ext = avatarHash && avatarHash.startsWith("a_") ? "gif" : "png";
      avatarImg.src = avatarHash
        ? `https://cdn.discordapp.com/avatars/${user.id}/${avatarHash}.${ext}?size=128`
        : `https://cdn.discordapp.com/embed/avatars/0.png`;
    }

    // 2. Status Dot
    if (statusDot) {
      statusDot.className = "";
      statusDot.classList.add(`status-${presence.discord_status}`);
    }
    if (statusText) {
      statusText.textContent = presence.discord_status.toUpperCase();
    }

    // 3. Activity / Spotify
    const activities = presence.activities || [];
    const spotify = presence.spotify;
    const currentActivity = activities.find(a => a.type === 0 || a.type === 2); // Playing hoặc Listening

    if (spotify) {
      showActivity({
        name: spotify.song,
        details: `by ${spotify.artist}`,
        state: `on ${spotify.album}`,
        image: spotify.album_art_url
      });
    } else if (currentActivity) {
      let image = null;
      if (currentActivity.assets && currentActivity.assets.large_image) {
        const rawImg = currentActivity.assets.large_image;
        image = rawImg.startsWith("mp:external")
          ? `https://media.discordapp.net/${rawImg.replace("mp:", "")}`
          : `https://cdn.discordapp.com/app-assets/${currentActivity.application_id}/${rawImg}.png`;
      }

      showActivity({
        name: currentActivity.name,
        details: currentActivity.details || "",
        state: currentActivity.state || "",
        image: image
      });
    } else {
      hideActivity();
    }
  }

  function showActivity({ name, details, state, image }) {
    if (noActivityBox) noActivityBox.classList.add("hidden");
    if (activityBox) activityBox.classList.remove("hidden");

    if (activityName) activityName.textContent = name;
    if (activityDetails) activityDetails.textContent = details;
    if (activityState) activityState.textContent = state;

    if (albumArt) {
      if (image) {
        albumArt.style.backgroundImage = `url('${image}')`;
        albumArt.style.display = "block";
      } else {
        albumArt.style.display = "none";
      }
    }
  }

  function hideActivity() {
    if (activityBox) activityBox.classList.add("hidden");
    if (noActivityBox) noActivityBox.classList.remove("hidden");
  }
}

/* ==========================================================================
   5. Vanilla Tilt Card Effect
   ========================================================================== */
function initVanillaTilt() {
  if (typeof VanillaTilt !== "undefined") {
    const card = document.getElementById("blurred-box");
    if (card) {
      VanillaTilt.init(card, {
        max: 12,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
      });
    }
  }
}
