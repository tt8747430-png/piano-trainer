import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ScaleChordGrid } from '@/features/play-example'
import { useLocale } from '@/shared/i18n'
import { qualityParams } from '@/shared/lib'
import {
  noteName,
  noteParam,
  printedSymbol,
  type Midi,
  type PlacedScaleChord,
  type ScaleKind,
  type SpelledNote,
} from '@/shared/lib/music'
import { ButtonLink, ChordText } from '@/shared/ui'
import { heardName } from '../model/scale-keys'

/**
 * The key's chords: a tap plays one from its degree's key, pressed while it sounds. Listening for a
 * note (Keys play Notes), the chords that hold it are ringed and named, as the sheets print them.
 * Under them, each chord the Chords page builds is a link that opens it there, as the reference
 * app's chord rows do.
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
      <nav aria-label={t('scales.openInChords')} className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">{t('scales.openInChords')}</p>
        <ul className="flex flex-wrap gap-2">
          {chords.flatMap(({ chord }) =>
            chord.quality === undefined
              ? []
              : [
                  <li key={chord.degree}>
                    <ButtonLink
                      variant="outline"
                      className="gap-1 pr-2"
                      render={
                        <Link
                          to="/practice/chords"
                          search={{ root: noteParam(chord.root), ...qualityParams(chord.quality) }}
                        />
                      }
                    >
                      <ChordText symbol={`${noteName(chord.root)}${chord.suffix}`} />
                      <ChevronRight aria-hidden className="size-4 text-muted-foreground" />
                    </ButtonLink>
                  </li>,
                ],
          )}
        </ul>
      </nav>
      {listening ? (
        <p aria-live="polite" className="min-h-7 text-lg">
          {said}
        </p>
      ) : null}
    </section>
  )
}
