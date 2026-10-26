import { useTranslation } from 'react-i18next'
import { ScaleChordGrid } from '@/features/play-example'
import { useLocale } from '@/shared/i18n'
import {
  printedSymbol,
  type Midi,
  type PlacedScaleChord,
  type ScaleKind,
  type SpelledNote,
} from '@/shared/lib/music'
import { heardName } from '../model/scale-keys'

/**
 * The key's chords: a tap plays one from its degree's key, pressed while it sounds. Listening for a
 * note (Keys play Notes), the chords that hold it are ringed and named, as the sheets print them.
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
  const { t } = useTranslation('practice')
  const locale = useLocale()
  const holds = new Set(holding.map((placed) => placed.chord.degree))
  const said =
    note === null
      ? ''
      : holding.length === 0
        ? t('scales.holdsNone', { note: heardName(note, root, kind) })
        : t('scales.holds', {
            note: heardName(note, root, kind),
            chords: new Intl.ListFormat(locale, { type: 'conjunction' }).format(
              holding.map((placed) => printedSymbol(placed.symbol)),
            ),
          })
  return (
    <section aria-label={t('scales.chordsIn')} className="flex flex-col gap-3">
      <ScaleChordGrid chords={chords} holds={holds} />
      {listening ? (
        <p aria-live="polite" className="min-h-7 text-lg">
          {said}
        </p>
      ) : null}
    </section>
  )
}
