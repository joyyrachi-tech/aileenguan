// Higher-resolution canvas keeps the original scene layout while adding finer pixel accents.
const canvas = document.querySelector('#world');
const ctx = canvas.getContext('2d');
ctx.scale(2, 2);

// Give Aileen her black, gold-streaked wolf cut while preserving the original walk cycle and outfit.
const originalCharacter = window.drawCharacter;
window.drawCharacter = function drawAileen(x, y, time, isJoy = false) {
  originalCharacter(x, y, time, isJoy);
  if (isJoy) return;

  const bob = player.moving ? Math.floor(Math.sin(time / 75) * 2) : 0;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.translate(Math.round(x * 2), Math.round((y + bob) * 2));
  if (player.facing < 0) ctx.scale(-1, 1);
  const pixel = (px, py, width, height, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(px * 2), Math.round(py * 2), Math.round(width * 2), Math.round(height * 2));
  };

  // Layered, choppy wolf-cut silhouette and shoulder-length side pieces.
  pixel(-10, -48, 20, 10, '#17151d');
  pixel(-11, -43, 5, 15, '#17151d');
  pixel(-9, -31, 4, 7, '#17151d');
  pixel(-6, -34, 3, 5, '#17151d');
  pixel(6, -33, 4, 7, '#17151d');
  pixel(8, -39, 4, 12, '#17151d');
  pixel(7, -29, 4, 5, '#17151d');
  // Face, fringe, and bright yellow-gold streaks.
  pixel(-7, -43, 14, 11, '#e3b398');
  pixel(-9, -46, 7, 5, '#17151d');
  pixel(-3, -45, 7, 4, '#17151d');
  pixel(4, -46, 6, 6, '#17151d');
  pixel(-5, -46, 2, 5, '#f3d45c');
  pixel(2, -45, 2, 4, '#f3d45c');
  pixel(-9, -38, 2, 9, '#eac84f');
  pixel(8, -36, 2, 8, '#f3d45c');
  pixel(-4, -36, 2, 2, '#382a35');
  pixel(3, -36, 2, 2, '#382a35');
  pixel(0, -32, 3, 1, '#bd7373');
  ctx.restore();
};

// A handful of tiny ambient pixels give the enlarged canvas more texture without clutter.
const originalScene = window.drawScene;
window.drawScene = function drawDetailedScene(time) {
  originalScene(time);
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const palette = scene === 'band'
    ? ['#ff9fc6', '#d2a9ff', '#ffd69a']
    : scene === 'beijing'
      ? ['#ffe2ae', '#f9b594', '#fff0ca']
      : ['#fff0c8', '#d9e7ff', '#f5d6b3'];
  for (let i = 0; i < 22; i += 1) {
    const px = ((i * 173 + Math.floor(time / 90) * (i % 3 + 1)) % 930) + 10;
    const py = 24 + ((i * 67) % 188);
    // Leave the walking character clear; tiny clusters read as windows, leaves, and distant glints.
    if (px > player.x * 2 - 28 && px < player.x * 2 + 28 && py > 395) continue;
    ctx.fillStyle = palette[i % palette.length];
    ctx.globalAlpha = i % 4 === 0 ? 0.82 : 0.48;
    ctx.fillRect(px, py, i % 5 === 0 ? 3 : 2, 2);
  }
  ctx.globalAlpha = 1;
  ctx.restore();
};
