const smoothScrollTo = (
  target: number,
  duration = 500,
  callback?: () => void
) => {
  const start = window.scrollY;
  const change = target - start;
  const startTime = performance.now();

  const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const animate = (time: number) => {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);

    window.scrollTo(0, start + change * eased);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      callback?.();
    }
  };

  requestAnimationFrame(animate);
};

export default smoothScrollTo;
