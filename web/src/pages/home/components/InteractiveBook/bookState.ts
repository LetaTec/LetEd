// The book is a stack of leaves on the right that turn, one at a time, onto
// the left. A reducer (rather than ad-hoc flags) guarantees that rapid clicks
// can never start a second turn before the first one finishes.

export type BookState = {
  index: number;
  turningLeaf: number | null;
};

export type BookAction =
  | { type: 'next'; leafCount: number }
  | { type: 'back' }
  | { type: 'finish'; leaf: number }
  | { type: 'clamp'; leafCount: number };

export const INITIAL_BOOK_STATE: BookState = { index: 0, turningLeaf: null };

export const bookReducer = (
  state: BookState,
  action: BookAction,
): BookState => {
  switch (action.type) {
    case 'next':
      if (state.turningLeaf !== null || state.index >= action.leafCount) {
        return state;
      }
      return { index: state.index + 1, turningLeaf: state.index };

    case 'back':
      if (state.turningLeaf !== null || state.index <= 0) {
        return state;
      }
      return { index: state.index - 1, turningLeaf: state.index - 1 };

    case 'finish':
      return state.turningLeaf === action.leaf
        ? { ...state, turningLeaf: null }
        : state;

    case 'clamp':
      return state.index > action.leafCount
        ? { index: action.leafCount, turningLeaf: null }
        : state;

    default:
      return state;
  }
};

// Stacking order: unturned leaves stack with the next page on top on the
// right; turned leaves stack with the most recent on top on the left; the
// leaf in motion is always above both.
export const getLeafZIndex = (
  leaf: number,
  state: BookState,
  leafCount: number,
) => {
  if (leaf === state.turningLeaf) return leafCount + 2;
  return leaf < state.index ? leaf + 1 : leafCount - leaf;
};
