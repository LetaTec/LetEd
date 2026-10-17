import { act, renderHook } from '@testing-library/react';

import { useStepCycle } from './useStepCycle';

const DURATIONS = [1000, 1000, 2000] as const;

describe('useStepCycle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('advances through every step and loops while active', () => {
    const { result } = renderHook(() => useStepCycle(3, true, DURATIONS));
    expect(result.current.step).toBe(0);

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.step).toBe(1);

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.step).toBe(2);

    act(() => vi.advanceTimersByTime(2000));
    expect(result.current.step).toBe(0);
  });

  it('does not advance while off screen', () => {
    const { result } = renderHook(() => useStepCycle(3, false, DURATIONS));

    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.step).toBe(0);
  });

  it('jumps to a chosen step and pauses there', () => {
    const { result } = renderHook(() => useStepCycle(3, true, DURATIONS));

    act(() => result.current.goToStep(2));
    expect(result.current.step).toBe(2);
    expect(result.current.isPaused).toBe(true);

    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.step).toBe(2);

    act(() => result.current.togglePaused());
    act(() => vi.advanceTimersByTime(2000));
    expect(result.current.step).toBe(0);
  });
});
