import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ScaleChordGrid } from '@/features/play-example'
import { useLocale } from '@/shared/i18n'
import { qualityParams } from '@/shared/lib'
import {
  degreeNames,
  keyParam,
  noteParam,
  printedSymbol,
  type Key,
  type Midi,
  type PlacedScaleChord,
  type ScaleKind,
  type SpelledNote,
} from '@/shared/lib/music'
import { OpensMark } from '@/shared/ui'
import { heardName } from '../model/scale-keys'

/**
 * The key's chords on the seven-degree spine (A21): each its symbol, its numeral and, in a key, its
 * degree's name (tonic … leading note); a tap plays one, pressed while it sounds. Listening for a
 * note (Keys play Notes), the chords that hold it are ringed and named, as the sheets print them.
 * Each chord the Chords page builds opens there from its card's corner, set to it in this key (its
 * colour notes following its degree, A33): one card, no second row of links (R29).
 */
export function KeyChords({
  chords,
  root,
  kind,
  listening,
  note,
  holding,
  musicKey,
}: {
  chords: readonly PlacedScaleChord[]
  /** The key the scale is the scale of, where it is one: its degrees named, its chords opened in it. */
  musicKey: Key | null
  root: SpelledNote
  kind: ScaleKind
  listening: boolean
  note: Midi | null
  holding: readonly PlacedScaleChord[]
}) {
  const { t } = useTranslation(['practice', 'music'])
  const locale = useLocale()
  const names = musicKey ? degreeNames(musicKey.minor) : null
  const holds = new Set(holding)
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
      <ScaleChordGrid
        chords={chords}
        holds={holds}
        detail={
          names
            ? ({ chord }) =>
                // The harmonic minor's vii° stands on the raised seventh: the leading note.
                t(
                  `music:degree.${chord.degree === 6 && chord.roman.startsWith('vii') ? 'leadingTone' : (names[chord.degree] ?? 'tonic')}`,
                )
            : undefined
        }
        open={({ chord, symbol }) =>
          chord.quality === undefined ? null : (
            <Link
              to="/practice/chords"
              search={{
                root: noteParam(chord.root),
                ...qualityParams(chord.quality),
                ...(musicKey ? { key: keyParam(musicKey) } : {}),
              }}
              aria-label={t('scales.openChord', { chord: printedSymbol(symbol) })}
              title={t('scales.openChord', { chord: printedSymbol(symbol) })}
              className="relative grid size-7 place-items-center rounded-pill before:absolute before:-inset-2 before:content-[''] hover:bg-muted"
            >
              <OpensMark className="size-4" />
            </Link>
          )
        }
      />
      {listening ? (
        <p aria-live="polite" className="min-h-7 text-lg">
          {said}
        </p>
      ) : null}
    </section>
  )
}
