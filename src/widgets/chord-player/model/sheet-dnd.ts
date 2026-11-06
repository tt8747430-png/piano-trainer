/**
 * The Chord player's drag ids (R32): one drag context for the whole sheet, as memory-palaces keeps
 * one per surface, so a section and a chord never answer the same pointer. A section is `section-2`,
 * a chord `chord-2-5` (its section, its place there).
 */
export type SheetDragId = `section-${number}` | `chord-${number}-${number}`

/** What a drag id names: a section, or a chord in its section. */
export type SheetDragged =
  | { readonly kind: 'section'; readonly section: number }
  | { readonly kind: 'chord'; readonly section: number; readonly index: number }

export const sectionDragId = (section: number): SheetDragId => `section-${section}`
export const chordDragId = (section: number, index: number): SheetDragId =>
  `chord-${section}-${index}`

/** Reads a drag id back; null for one that is not the sheet's. */
export function readDragId(id: unknown): SheetDragged | null {
  if (typeof id !== 'string') return null
  const section = /^section-(\d+)$/.exec(id)
  if (section) return { kind: 'section', section: Number(section[1]) }
  const chord = /^chord-(\d+)-(\d+)$/.exec(id)
  if (chord) return { kind: 'chord', section: Number(chord[1]), index: Number(chord[2]) }
  return null
}

/**
 * Where a dragged thing may land: a section among the sections, a chord among its own section's
 * chords (moving a chord to another section is its sheet's Cut and Add, never a drop).
 */
export function landsOn(active: SheetDragged, over: SheetDragged): boolean {
  if (active.kind === 'section') return over.kind === 'section'
  return over.kind === 'chord' && over.section === active.section
}

/** The move a drop asks for, or null where it moves nothing or may not land. */
export function dropMove(
  activeId: unknown,
  overId: unknown,
):
  | { readonly kind: 'section'; readonly from: number; readonly to: number }
  | { readonly kind: 'chord'; readonly section: number; readonly from: number; readonly to: number }
  | null {
  const active = readDragId(activeId)
  const over = readDragId(overId)
  if (!active || !over || !landsOn(active, over)) return null
  if (active.kind === 'section') {
    if (active.section === over.section) return null
    return { kind: 'section', from: active.section, to: over.section }
  }
  if (over.kind !== 'chord' || active.index === over.index) return null
  return { kind: 'chord', section: active.section, from: active.index, to: over.index }
}
