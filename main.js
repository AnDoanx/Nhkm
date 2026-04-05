const images = document.querySelectorAll("#spin-container img");
const count = images.length;
const angle = 360 / count;

images.forEach((img, i) => {
  img.style.transform = `rotateY(${i * angle}deg) translateZ(300px)`;
});

// 🎵 MUSIC CONTROL
const music = document.getElementById("music");
const btn = document.getElementById("musicBtn");

btn.onclick = () => {
  if (music.paused) {
    music.play();
    btn.innerHTML = "🔊";
  } else {
    music.pause();
    btn.innerHTML = "🔇";
  }
};

// 📱 FIX iPhone autoplay
document.body.addEventListener("click", () => {
  music.play().catch(()=>{});
}, { once: true });


// 🌌 BACKGROUND PARTICLES
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];

for (let i = 0; i < 100; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  stars.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

animate();