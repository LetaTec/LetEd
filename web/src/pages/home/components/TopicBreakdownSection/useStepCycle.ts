import { useCallback, useEffect, useState } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia(REDUCED_MOTION_QUERY).matches;

// Cycles through steps while the animation is on screen. With reduced
// motion it rests on the final step and never auto-advances.
export const useStepCycle = (
  stepCount: number,
  isActive: boolean,
  stepDurations: readonly number[],
) => {
  const [step, setStep] = useState(() =>
    prefersReducedMotion() ? stepCount - 1 : 0,
  );
  const [isPaused, setIsPaused] = useState(prefersReducedMotion);

  useEffect(() => {
    if (!isActive || isPaused) return undefined;

    const timeout = window.setTimeout(
      () => setStep(current => (current + 1) % stepCount),
      stepDurations[step] ?? stepDurations[0],
    );
    return () => window.clearTimeout(timeout);
  }, [isActive, isPaused, step, stepCount, stepDurations]);

  const goToStep = useCallback((nextStep: number) => {
    setStep(nextStep);
    setIsPaused(true);
  }, []);

  const togglePaused = useCallback(() => setIsPaused(paused => !paused), []);

  return { step, isPaused, goToStep, togglePaused };
};
