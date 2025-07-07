// Projekt-Filterfunktion für die Projekte-Seite

document.addEventListener('DOMContentLoaded', function() {
  // Projekt-Filterfunktion (bereits vorhanden)
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      filterButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.getAttribute('data-filter');
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || (category && category.includes(filter))) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Hamburger-Menü Funktionalität
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
      navMenu.classList.toggle('show');
    });
  }
});

// Sternenbild- und interaktive Partikel-Animation (mehr, kleinere, bunte Partikel, magnetische Maus-Abstoßung)
(function() {
  const canvas = document.getElementById('bg-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = window.innerWidth;
  let h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;

  // Verschiedene Größen, große selten
  const PARTICLE_COUNT = Math.max(350, Math.min(1200, Math.floor((w * h) / 900)));
  const rSmall = Math.max(0.12, Math.min(0.5, (w + h) / 9000));
  const rBig = Math.max(1.2, Math.min(2.5, (w + h) / 1200));
  const colors = ['#fff', '#b3e6ff', '#e0cfff', '#fff9c4', '#aee7ff', '#e3e3ff']; // Weiß, hellblau, blasslila, blassgelb
  const particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // 1 von 25 ist ein großer Partikel
    const isBig = Math.random() < 1/25;
    const radius = isBig ? rBig + Math.random() * 1.2 : rSmall + Math.random() * rSmall * 2.5;
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: radius,
      dx: (Math.random() - 0.5) * (isBig ? 0.07 : 0.16),
      dy: (Math.random() - 0.5) * (isBig ? 0.07 : 0.16),
      alpha: isBig ? 0.22 + Math.random() * 0.18 : Math.random() * 0.4 + 0.18,
      color: colors[Math.floor(Math.random() * colors.length)],
      isBig: isBig
    });
  }

  let mouse = { x: null, y: null };
  let attract = false;
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });
  window.addEventListener('mousedown', () => { attract = true; });
  window.addEventListener('mouseup', () => { attract = false; });

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      // Große Partikel bekommen keine Linien
      if (particles[i].isBig) continue;
      for (let j = i + 1; j < particles.length; j++) {
        if (particles[j].isBig) continue;
        // Nur ca. 40% der Paare bekommen eine Linie
        if (Math.random() > 0.4) continue;
        const a = particles[i];
        const b = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 60) {
          ctx.save();
          ctx.globalAlpha = 0.02 + 0.06 * (1 - dist / 60);
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 0.3;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          ctx.restore();
        }
      }
      // Linie zur Maus, wenn nah genug (nur kleine Partikel)
      if (mouse.x !== null && mouse.y !== null) {
        const a = particles[i];
        if (a.isBig) continue;
        const dist = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (dist < 70) {
          ctx.save();
          ctx.globalAlpha = 0.01 + 0.04 * (1 - dist / 70);
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 0.3;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    drawLines();
    for (const p of particles) {
      // Interaktion mit Maus: Abstoßen oder Anziehen (je nach attract)
      if (mouse.x !== null && mouse.y !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80 && dist > 0) {
          if (attract) {
            // Anziehen zur Maus (langsamer, smooth)
            const force = (80 - dist) / 180;
            const angle = Math.atan2(-dy, -dx);
            p.x += Math.cos(angle) * force * 1.1;
            p.y += Math.sin(angle) * force * 1.1;
          } else {
            // Abstoßen wie vorher
            const force = (80 - dist) / 80;
            const angle = Math.atan2(dy, dx);
            p.x += Math.cos(angle) * force * 3.2;
            p.y += Math.sin(angle) * force * 3.2;
          }
        }
      }
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = p.isBig ? 12 : 4;
      ctx.fill();
      ctx.restore();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    // Partikel bleiben erhalten, nur das Canvas wird angepasst
  });

  draw();
})(); 