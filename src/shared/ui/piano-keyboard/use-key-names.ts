import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { PIANO_LAYOUT } from '@/shared/lib'
import { isBlackKey, octaveOf, pitchClass, plainSpelling, type Midi } from '@/shared/lib/music'

/** Every key's spoken name ("C sharp 4"), once per language: a render names none, and a glissando renders per key. */
export function useKeyNames(): ReadonlyMap<Midi, string> {
  const { t } = useTranslation('common')
  return useMemo(
    () =>
      new Map(
        PIANO_LAYOUT.keys.map(({ midi }) => {
          const spelled = plainSpelling(pitchClass(midi), true)
          const name = t(isBlackKey(midi) ? 'note.sharp' : 'note.natural', {
            letter: spelled.letter,
            octave: octaveOf(midi),
          })
          return [midi, name]
        }),
      ),
    [t],
  )
}
