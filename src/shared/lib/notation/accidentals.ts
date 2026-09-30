import {
  keyScale,
  spellScale,
  type Accidental,
  type Key,
  type Letter,
  type SpelledNote,
} from '@/shared/lib/music'

/** Each letter's accidental in a key's signature: its major or natural minor scale. */
export function keyAccidentals(key: Key): ReadonlyMap<Letter, Accidental> {
  return new Map(
    spellScale(key.tonic, keyScale(key)).map((tone) => [tone.note.letter, tone.note.accidental]),
  )
}

/**
 * The accidental each note of a staff's bar prints, its notes in time order (spec §2.4 step 6): one
 * that differs from the signature or an earlier note of its letter and octave in the bar, a natural
 * as 0; none on a tied continuation, which changes nothing.
 */
export function printedAccidentals(
  notes: readonly { spelled: SpelledNote; octave: number; continued: boolean }[],
  key: Key,
): (Accidental | null)[] {
  const signature = keyAccidentals(key)
  const inBar = new Map<string, Accidental>()
  return notes.map(({ spelled, octave, continued }) => {
    if (continued) return null
    const place = `${spelled.letter}${octave}`
    const current = inBar.get(place) ?? signature.get(spelled.letter) ?? 0
    if (spelled.accidental === current) return null
    inBar.set(place, spelled.accidental)
    return spelled.accidental
  })
}
