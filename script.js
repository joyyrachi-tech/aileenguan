const noteButton = document.querySelector('#open-note');
const birthdayMessage = document.querySelector('#birthday-message');
const celebrateButton = document.querySelector('#celebrate');

noteButton.addEventListener('click', () => {
  const isOpening = birthdayMessage.hidden;
  birthdayMessage.hidden = !isOpening;
  noteButton.setAttribute('aria-expanded', String(isOpening));
  noteButton.innerHTML = isOpening
    ? 'Keep this close <span aria-hidden="true">♡</span>'
    : 'Open your note <span aria-hidden="true">♡</span>';
  if (isOpening) birthdayMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

function sendSparkle() {
  const colors = ['#e88991', '#f4c369', '#b7a0ce', '#a8c8a0', '#f2a887', '#fff0d0'];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const amount = reducedMotion ? 18 : 95;

  for (let i = 0; i < amount; i += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti';
    piece.setAttribute('aria-hidden', 'true');
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    piece.style.setProperty('--drift', `${Math.random() * 180 - 90}px`);
    piece.style.setProperty('--fall-time', `${2.2 + Math.random() * 2.2}s`);
    piece.style.animationDelay = `${Math.random() * 0.8}s`;
    document.body.appendChild(piece);
    window.setTimeout(() => piece.remove(), 6000);
  }
}

celebrateButton.addEventListener('click', () => {
  sendSparkle();
  celebrateButton.innerHTML = 'You deserve all the sparkle! <span aria-hidden="true">♡</span>';
  celebrateButton.setAttribute('aria-label', 'You deserve all the sparkle!');
});
