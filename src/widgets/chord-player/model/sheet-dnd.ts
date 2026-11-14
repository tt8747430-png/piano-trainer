import type { ChordPlace } from '@/shared/lib/arrangement'

/**
 * The Chord player's drag ids (R32): one drag context for the whole sheet, as memory-palaces keeps
 * one per surface, so a section and a chord never answer the same pointer. A section is `section-2`,
 * a chord `chord-2-5` (its section, its place there), a section's end (its + after the last bar)
 * `end-2`, one of the key's chords beside the sheet on a laptop `key-3` (its place in the row).
 */
export type SheetDragId =
  `section-${number}` | `chord-${number}-${number}` | `end-${number}` | `key-${number}`

/** What a drag id names: a section, a chord in its section, or the end of a section. */
export type SheetDragged =
  | { readonly kind: 'section'; readonly section: number }
  | { readonly kind: 'chord'; readonly section: number; readonly index: number }
  | { readonly kind: 'end'; readonly section: number }
  | { readonly kind: 'key'; readonly index: number }

export const sectionDragId = (section: number): SheetDragId => `section-${section}`
export const chordDragId = (section: number, index: number): SheetDragId =>
  `chord-${section}-${index}`
export const endDragId = (section: number): SheetDragId => `end-${section}`
export const keyDragId = (index: number): SheetDragId => `key-${index}`

/** Reads a drag id back; null for one that is not the sheet's. */
export function readDragId(id: unknown): SheetDragged | null {
  if (typeof id !== 'string') return null
  const section = /^section-(\d+)$/.exec(id)
  if (section) return { kind: 'section', section: Number(section[1]) }
  const chord = /^chord-(\d+)-(\d+)$/.exec(id)
  if (chord) return { kind: 'chord', section: Number(chord[1]), index: Number(chord[2]) }
  const end = /^end-(\d+)$/.exec(id)
  if (end) return { kind: 'end', section: Number(end[1]) }
  const key = /^key-(\d+)$/.exec(id)
  if (key) return { kind: 'key', index: Number(key[1]) }
  return null
}

/**
 * Where a dragged thing may land: a section among the sections; a chord before any chord of any
 * section, or at a section's end, an empty section's too (owner, 2026-11-13: "dragggin into other
 * sections should be possible").
 */
export function landsOn(active: SheetDragged, over: SheetDragged): boolean {
  if (active.kind === 'section') return over.kind === 'section'
  return (
    (active.kind === 'chord' || active.kind === 'key') &&
    (over.kind === 'chord' || over.kind === 'end')
  )
}

/** Past the last chord: the drop lands at the section's end. */
const END = Number.MAX_SAFE_INTEGER

/** The move a drop asks for, or null where it moves nothing or may not land. */
export function dropMove(
  activeId: unknown,
  overId: unknown,
):
  | { readonly kind: 'section'; readonly from: number; readonly to: number }
  | { readonly kind: 'chord'; readonly from: ChordPlace; readonly to: ChordPlace }
  | { readonly kind: 'key'; readonly key: number; readonly to: ChordPlace }
  | null {
  const active = readDragId(activeId)
  const over = readDragId(overId)
  if (!active || !over || !landsOn(active, over)) return null
  if (active.kind === 'section') {
    if (over.kind !== 'section' || active.section === over.section) return null
    return { kind: 'section', from: active.section, to: over.section }
  }
  if (over.kind !== 'chord' && over.kind !== 'end') return null
  const to = { section: over.section, index: over.kind === 'chord' ? over.index : END }
  if (active.kind === 'key') return { kind: 'key', key: active.index, to }
  if (active.kind !== 'chord') return null
  if (to.section === active.section && to.index === active.index) return null
  return { kind: 'chord', from: { section: active.section, index: active.index }, to }
}
