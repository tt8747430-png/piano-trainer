import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { chordSymbol, type Chord, type PassingChords } from '@/shared/lib/music'
import { PlayLabel } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/**
 * One way from a chord to another: its name, the row From → … → To (each chord playing alone), in the
 * key or chromatic, why it works, and Play, which plays the row.
 */
export function SuggestionCard({
  way,
  from,
  to,
  inKey,
  isPlaying,
  onPlayChord,
  onPlayRow,
}: {
  way: PassingChords
  from: Chord
  to: Chord
  inKey: boolean
  /** Whether the row, or a chord of it by its place, still plays. */
  isPlaying: (what: 'row' | number) => boolean
  onPlayChord: (chord: Chord, place: number) => void
  onPlayRow: () => void
}) {
  const { t } = useTranslation('learn')
  const titleId = useId()
  const row = [from, ...way.chords, to]
  const [first, second] = way.chords
  return (
    <article
      aria-labelledby={titleId}
      className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4"
    >
      <header className="flex items-baseline justify-between gap-3">
        <h3 id={titleId} className="text-xl">
          {t(`passing.kind.${way.kind}.name`)}
        </h3>
        <span className="shrink-0 text-sm text-muted-foreground">
          {t(inKey ? 'passing.inKey' : 'passing.chromatic')}
        </span>
      </header>
      <ol className="flex flex-wrap items-center gap-2">
        {row.map((chord, place) => (
          <li key={`${place} ${chordSymbol(chord)}`}>
            <Button
              variant="outline"
              aria-pressed={isPlaying(place)}
              className="min-w-16 px-4 aria-pressed:bg-secondary aria-pressed:text-secondary-foreground"
              onClick={() => onPlayChord(chord, place)}
            >
              <span className="font-display text-xl font-semibold">{chordSymbol(chord)}</span>
            </Button>
          </li>
        ))}
      </ol>
      <p className="text-muted-foreground">
        {t(`passing.kind.${way.kind}.why`, {
          chord: first ? chordSymbol(first) : '',
          next: second ? chordSymbol(second) : '',
          to: chordSymbol(to),
        })}
      </p>
      <Button variant="soft" className="self-start" onClick={onPlayRow}>
        <PlayLabel playing={isPlaying('row')}>{t('play')}</PlayLabel>
      </Button>
    </article>
  )
}
