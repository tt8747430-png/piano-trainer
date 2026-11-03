/**
 * Whether a mouse or trackpad can point and hover here: a computer, or a touch laptop with one. A phone
 * or a tablet alone has none, so the computer keys' settings and letters playing the piano are
 * not theirs.
 */
export const hasFinePointer = (): boolean =>
  typeof matchMedia === 'function' &&
  matchMedia('(any-hover: hover) and (any-pointer: fine)').matches
