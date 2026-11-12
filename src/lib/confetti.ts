import confetti from "canvas-confetti";

/**
 * Fires a dual-cannon celebration from both sides of the screen.
 * Perfect for completing an AI trip plan or finishing a major workflow.
 */
export function triggerTripCelebration() {
  if (typeof window === "undefined") return;

  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    colors: ["#10b981", "#14b8a6", "#f59e0b", "#3b82f6", "#ec4899"],
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

/**
 * Fires a joyful star burst when packing progress hits 100%.
 */
export function triggerChecklistComplete() {
  if (typeof window === "undefined") return;

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#10b981", "#34d399", "#fbbf24"],
  });
}

/**
 * Quick center burst when saving or copying a link.
 */
export function triggerSuccessBurst() {
  if (typeof window === "undefined") return;

  confetti({
    particleCount: 50,
    angle: 90,
    spread: 55,
    origin: { y: 0.8 },
    colors: ["#10b981", "#14b8a6"],
  });
}
