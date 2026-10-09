// Interactive Canvas Engine
const canvas = document.getElementById('heart-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let isHeartFormed = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Heart Mathematical Shape Equation Point Generator
function getHeartPoint(t, scale = 12) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
  return {
    x: canvas.width / 2 + x * scale,
    y: canvas.height / 2 + y * scale
  };
}

class HeartParticle {
  constructor(targetX, targetY, isExplosion = false) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.targetX = targetX;
    this.targetY = targetY;
    this.size = Math.random() * 12 + 8;
    this.speed = Math.random() * 0.05 + 0.03;
    this.color = `hsl(${Math.random() * 40 + 330}, 100%, 65%)`;
    this.isExplosion = isExplosion;
    this.vx = (Math.random() - 0.5) * 16;
    this.vy = (Math.random() - 0.5) * 16;
    this.alpha = 1;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    const topCurve = this.size * 0.3;
    ctx.moveTo(this.x, this.y + topCurve);
    ctx.bezierCurveTo(this.x, this.y, this.x - this.size / 2, this.y, this.x - this.size / 2, this.y + topCurve);
    ctx.bezierCurveTo(this.x - this.size / 2, this.y + (this.size + topCurve) / 2, this.x, this.y + this.size, this.x, this.y + this.size);
    ctx.bezierCurveTo(this.x, this.y + (this.size + topCurve) / 2, this.x + this.size / 2, this.y + (this.size + topCurve) / 2, this.x + this.size / 2, this.y + topCurve);
    ctx.bezierCurveTo(this.x + this.size / 2, this.y, this.x, this.y, this.x, this.y + topCurve);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  update() {
    if (!this.isExplosion) {
      // Move towards Heart Shape Target
      this.x += (this.targetX - this.x) * this.speed;
      this.y += (this.targetY - this.y) * this.speed;
    } else {
      // Explode Particles Outward
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= 0.015;
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].alpha <= 0) {
      particles.splice(i, 1);
      i--;
    }
  }
  requestAnimationFrame(animate);
}

// Passcode Validation & Transition Engine
function handlePasscodeSubmit(event) {
  event.preventDefault();
  const input = document.getElementById('passcode-input').value.trim();
  const errorMsg = document.getElementById('error-msg');

  // Verify input strictly equals "i love you" in lowercase
  if (input === 'i love you') {
    errorMsg.style.display = 'none';
    startHeartAssembly();
  } else {
    errorMsg.style.display = 'block';
  }
}

function startHeartAssembly() {
  const inputScreen = document.getElementById('input-screen');
  inputScreen.classList.remove('active');

  // Generate Giant Heart Target Points from Small Floating Hearts
  const totalParticles = 120;
  for (let i = 0; i < totalParticles; i++) {
    const t = (i / totalParticles) * Math.PI * 2;
    const point = getHeartPoint(t, Math.min(canvas.width, canvas.height) / 45);
    particles.push(new HeartParticle(point.x, point.y));
  }

  // After 2.5 seconds, explode the giant heart
  setTimeout(() => {
    explodeGiantHeart();
  }, 2500);
}

function explodeGiantHeart() {
  // Convert all assembled particles to explosion state
  particles.forEach(p => {
    p.isExplosion = true;
  });

  // Fire Confetti Blast
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#ff2a75', '#ff75a0', '#ffd700', '#ffffff']
    });
  }

  // Reveal Final Birthday Card
  setTimeout(() => {
    const greetingScreen = document.getElementById('greeting-screen');
    const finalCard = document.getElementById('final-card');
    greetingScreen.classList.add('active');
    finalCard.classList.add('show');
  }, 400);
}

// Init Animation Loop
animate();