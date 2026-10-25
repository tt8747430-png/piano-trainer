/** Whether an element stands wholly in sight in its scroller: a view opening leaves it there. */
export function inSight(element: Element, scroller: Element): boolean {
  const box = element.getBoundingClientRect()
  const room = scroller.getBoundingClientRect()
  return box.top >= room.top && box.bottom <= room.bottom
}
