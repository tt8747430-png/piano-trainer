/**
 * Where the sheet scrolls to keep the cursor in sight: nowhere while it is in the view's middle half,
 * else so it stands a quarter in.
 */
export function followScroll(x: number, view: { left: number; width: number }): number | null {
  if (x >= view.left + view.width / 4 && x <= view.left + (view.width * 3) / 4) return null
  return Math.max(0, x - view.width / 4)
}
