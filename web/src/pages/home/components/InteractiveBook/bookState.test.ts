import {
  bookReducer,
  getLeafZIndex,
  INITIAL_BOOK_STATE,
  type BookState,
} from './bookState';

const LEAF_COUNT = 3;

describe('bookReducer', () => {
  it('turns forward and records the leaf in motion', () => {
    const state = bookReducer(INITIAL_BOOK_STATE, {
      type: 'next',
      leafCount: LEAF_COUNT,
    });
    expect(state).toEqual({ index: 1, turningLeaf: 0 });
  });

  it('ignores rapid repeated clicks until the current turn finishes', () => {
    let state: BookState = INITIAL_BOOK_STATE;
    for (let click = 0; click < 10; click += 1) {
      state = bookReducer(state, { type: 'next', leafCount: LEAF_COUNT });
      state = bookReducer(state, { type: 'back' });
    }
    expect(state).toEqual({ index: 1, turningLeaf: 0 });

    state = bookReducer(state, { type: 'finish', leaf: 0 });
    state = bookReducer(state, { type: 'next', leafCount: LEAF_COUNT });
    expect(state).toEqual({ index: 2, turningLeaf: 1 });
  });

  it('never moves past either cover', () => {
    expect(bookReducer(INITIAL_BOOK_STATE, { type: 'back' })).toBe(
      INITIAL_BOOK_STATE,
    );

    const lastSpread: BookState = { index: LEAF_COUNT, turningLeaf: null };
    expect(
      bookReducer(lastSpread, { type: 'next', leafCount: LEAF_COUNT }),
    ).toBe(lastSpread);
  });

  it('ignores a finish event from a leaf that is not turning', () => {
    const state: BookState = { index: 1, turningLeaf: 0 };
    expect(bookReducer(state, { type: 'finish', leaf: 2 })).toBe(state);
  });

  it('clamps the position when the number of leaves shrinks', () => {
    const state: BookState = { index: 3, turningLeaf: null };
    expect(bookReducer(state, { type: 'clamp', leafCount: 2 })).toEqual({
      index: 2,
      turningLeaf: null,
    });
  });
});

describe('getLeafZIndex', () => {
  it('keeps the latest turned page on top on the left', () => {
    const state: BookState = { index: 2, turningLeaf: null };
    const z = [0, 1, 2].map(leaf => getLeafZIndex(leaf, state, LEAF_COUNT));

    expect(z[1]).toBeGreaterThan(z[0]);
    expect(z[2]).toBeGreaterThan(0);
  });

  it('keeps the next page on top on the right', () => {
    const z = [0, 1, 2].map(leaf =>
      getLeafZIndex(leaf, INITIAL_BOOK_STATE, LEAF_COUNT),
    );
    expect(z[0]).toBeGreaterThan(z[1]);
    expect(z[1]).toBeGreaterThan(z[2]);
  });

  it('lifts the turning leaf above every other leaf', () => {
    const state: BookState = { index: 1, turningLeaf: 0 };
    const turning = getLeafZIndex(0, state, LEAF_COUNT);
    [1, 2].forEach(leaf => {
      expect(turning).toBeGreaterThan(getLeafZIndex(leaf, state, LEAF_COUNT));
    });
  });
});
