/** What a tap on the Player's screen does to its floating transport. */
export type DockTap = 'show' | 'toggle' | 'none'

/** The controls a tap works itself: a tap on one leaves the transport as it is. */
const CONTROL =
  'button, a, input, select, textarea, label, [role="slider"], [role="dialog"], [role="menu"], [role="listbox"]'

/**
 * Where a tap on the Player's screen leaves its transport (as a reading app's bars, forScore's): on
 * the transport or another control, as it is; on a note of the sheet, in sight, since Play is what
 * comes after a jump; anywhere else on the screen (the sheet's margins, the toolbar's room), shown or
 * hidden in turn, the music given the room.
 */
export function dockTap(target: Element): DockTap {
  if (target.closest('[data-area="dock"], [data-area="keys"]')) return 'none'
  if (target.closest('[data-area="sheet"]')?.contains(target) && target.closest('button'))
    return 'show'
  if (target.closest(CONTROL)) return 'none'
  return 'toggle'
}
