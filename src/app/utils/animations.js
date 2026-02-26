"use client";
import confetti from 'canvas-confetti';

// Confetti for winning trades
export const celebrateWin = (amount = 0) => {
  const duration = amount > 100 ? 4000 : 2500;
  const particleCount = Math.min(150, 50 + Math.floor(amount / 10));

  // First burst - green and gold
  confetti({
    particleCount: particleCount,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#22c55e', '#16a34a', '#fbbf24', '#f59e0b', '#ffffff'],
    shapes: ['circle', 'square'],
    gravity: 0.8,
    scalar: 1.2,
  });

  // Second burst after delay
  setTimeout(() => {
    confetti({
      particleCount: Math.floor(particleCount * 0.6),
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#22c55e', '#16a34a', '#fbbf24'],
    });
    confetti({
      particleCount: Math.floor(particleCount * 0.6),
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#22c55e', '#16a34a', '#fbbf24'],
    });
  }, 250);

  // Big win extra celebration
  if (amount > 100) {
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#fbbf24', '#f59e0b', '#eab308'],
        shapes: ['star'],
        scalar: 1.5,
      });
    }, 500);
  }
};

// Fire/streak celebration
export const celebrateStreak = (streakCount) => {
  const intensity = Math.min(streakCount, 10);

  // Fire colors
  const fireColors = ['#ef4444', '#f97316', '#fbbf24', '#facc15'];

  confetti({
    particleCount: 50 + (intensity * 15),
    spread: 60 + (intensity * 5),
    origin: { y: 0.7 },
    colors: fireColors,
    shapes: ['circle'],
    gravity: 1.2,
    scalar: 1.5,
    drift: 0,
  });

  // Side bursts for big streaks
  if (streakCount >= 5) {
    setTimeout(() => {
      confetti({
        particleCount: 30,
        angle: 60,
        spread: 40,
        origin: { x: 0, y: 0.6 },
        colors: fireColors,
      });
      confetti({
        particleCount: 30,
        angle: 120,
        spread: 40,
        origin: { x: 1, y: 0.6 },
        colors: fireColors,
      });
    }, 200);
  }
};

// Goal reached celebration
export const celebrateGoal = () => {
  const duration = 5000;
  const animationEnd = Date.now() + duration;
  const colors = ['#a855f7', '#8b5cf6', '#6366f1', '#fbbf24', '#22c55e'];

  const frame = () => {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };

  frame();

  // Center explosion
  setTimeout(() => {
    confetti({
      particleCount: 150,
      spread: 180,
      origin: { y: 0.5 },
      colors: ['#fbbf24', '#f59e0b', '#a855f7'],
      shapes: ['star', 'circle'],
      scalar: 2,
    });
  }, 500);
};

// Money rain for big wins
export const moneyRain = () => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 90,
      spread: 180,
      origin: { y: -0.1 },
      colors: ['#22c55e', '#16a34a', '#15803d'],
      shapes: ['square'],
      gravity: 0.6,
      scalar: 2,
      drift: Math.random() - 0.5,
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };

  frame();
};

// Shake animation for losing trades (CSS class based)
export const triggerLossShake = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.add('animate-shake');
    setTimeout(() => {
      element.classList.remove('animate-shake');
    }, 500);
  }
};

// Flash animation for feedback
export const triggerFlash = (elementId, type = 'success') => {
  const element = document.getElementById(elementId);
  if (element) {
    const className = type === 'success' ? 'animate-flash-green' : 'animate-flash-red';
    element.classList.add(className);
    setTimeout(() => {
      element.classList.remove(className);
    }, 700);
  }
};

// Emoji burst
export const emojiBurst = (emoji = '🎉') => {
  // Create floating emoji elements
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
  `;
  document.body.appendChild(container);

  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      const emojiEl = document.createElement('div');
      const startX = Math.random() * 100;
      emojiEl.textContent = emoji;
      emojiEl.style.cssText = `
        position: absolute;
        font-size: ${24 + Math.random() * 24}px;
        left: ${startX}%;
        top: 100%;
        animation: floatUp 2s ease-out forwards;
        opacity: 0;
      `;
      container.appendChild(emojiEl);
    }, i * 100);
  }

  // Cleanup
  setTimeout(() => {
    container.remove();
  }, 3500);
};
