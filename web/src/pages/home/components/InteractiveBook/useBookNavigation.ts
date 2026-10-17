import { useCallback, useEffect, useReducer } from 'react';

import { bookReducer, getLeafZIndex, INITIAL_BOOK_STATE } from './bookState';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

// Safety net for when transitionend never fires (e.g. the tab is hidden
// mid-turn). Longer than the page-turn duration token.
const TURN_FALLBACK_MS = 1600;

const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia(REDUCED_MOTION_QUERY).matches;

export const useBookNavigation = (leafCount: number) => {
  const [state, dispatch] = useReducer(bookReducer, INITIAL_BOOK_STATE);

  useEffect(() => {
    dispatch({ type: 'clamp', leafCount });
  }, [leafCount]);

  // Without animation there is no transitionend, so finish immediately;
  // otherwise make sure a lost transitionend can never lock the book.
  useEffect(() => {
    if (state.turningLeaf === null) return undefined;

    const leaf = state.turningLeaf;

    if (prefersReducedMotion()) {
      dispatch({ type: 'finish', leaf });
      return undefined;
    }

    const timeout = window.setTimeout(
      () => dispatch({ type: 'finish', leaf }),
      TURN_FALLBACK_MS,
    );
    return () => window.clearTimeout(timeout);
  }, [state.turningLeaf]);

  const turnNext = useCallback(
    () => dispatch({ type: 'next', leafCount }),
    [leafCount],
  );
  const turnBack = useCallback(() => dispatch({ type: 'back' }), []);
  const finishTurn = useCallback(
    (leaf: number) => dispatch({ type: 'finish', leaf }),
    [],
  );

  return {
    index: state.index,
    isTurning: state.turningLeaf !== null,
    canTurnNext: state.index < leafCount,
    canTurnBack: state.index > 0,
    getZIndex: (leaf: number) => getLeafZIndex(leaf, state, leafCount),
    turnNext,
    turnBack,
    finishTurn,
  };
};
