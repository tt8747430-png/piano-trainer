import { useTranslation } from 'react-i18next'
import { ScaleChordGrid } from '@/features/play-example'
import { useLocale } from '@/shared/i18n'
import type { Midi, PlacedScaleChord, ScaleKind, SpelledNote } from '@/shared/lib/music'
import { heardName } from '../model/scale-keys'

/**
 * The key's chords: a tap plays one from its degree's key, pressed while it sounds. Listening for a
 * note (Keys play Notes), the chords that hold it are ringed and named.
 */
export function KeyChords({
  chords,
  root,
  kind,
  listening,
  note,
  holding,
}: {
  chords: readonly PlacedScaleChord[]
  root: SpelledNote
  kind: ScaleKind
  listening: boolean
  note: Midi | null
  holding: readonly PlacedScaleChord[]
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const holds = new Set(holding.map((placed) => placed.chord.degree))
  const said =
    note === null
      ? ''
      : holding.length === 0
        ? t('holdsNone', { note: heardName(note, root, kind) })
        : t('holds', {
            note: heardName(note, root, kind),
            chords: new Intl.ListFormat(locale, { type: 'conjunction' }).format(
              holding.map((placed) => placed.symbol),
            ),
          })
  return (
    <section aria-label={t('chordsIn')} className="flex flex-col gap-3">
      <ScaleChordGrid chords={chords} holds={holds} />
      {listening ? (
        <p aria-live="polite" className="min-h-7 text-lg">
          {said}
        </p>
      ) : null}
    </section>
  )
}
