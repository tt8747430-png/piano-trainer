import {
  keyScale,
  LETTERS,
  midiOf,
  note,
  spellScale,
  type Key,
  type Midi,
  type SpelledNote,
} from '@/shared/lib/music'
import { clefOf, type StaffId } from '@/shared/lib/notation'

/** Each clef's top line, in steps from C0 (an octave is seven): F5 on the treble, A3 on the bass. */
const TOP_LINE = { treble: 5 * 7 + 3, bass: 3 * 7 + 5 } as const

/**
 * The note on a staff's line or space nearest a point `y`, given where the staff's lines are drawn,
 * as the key writes it (its signature's sharps and flats): where a tap on the staff puts a note.
 */
export function noteAtStaffY(
  staff: StaffId,
  y: number,
  lines: { readonly top: number; readonly bottom: number },
  key: Key,
): { readonly midi: Midi; readonly spelled: SpelledNote } {
  const step = (lines.bottom - lines.top) / 8
  const index = TOP_LINE[clefOf(staff)] - Math.round((y - lines.top) / step)
  const letter = LETTERS[((index % 7) + 7) % 7] ?? 'C'
  const accidental =
    spellScale(key.tonic, keyScale(key)).find((tone) => tone.note.letter === letter)?.note
      .accidental ?? 0
  const spelled = note(letter, accidental)
  return { midi: midiOf(spelled, Math.floor(index / 7)), spelled }
}

/** How many steps of a staff (a line to the next space) a drag of `dy` pixels covers, up positive. */
export const stepsDragged = (
  dy: number,
  lines: { readonly top: number; readonly bottom: number },
) => Math.round(-dy / ((lines.bottom - lines.top) / 8)) || 0
