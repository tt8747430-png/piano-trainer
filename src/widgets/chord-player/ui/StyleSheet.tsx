import { Check, Play, Square } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useShelfName, type Style, type StyleBook } from '@/entities/pattern'
import { localText, useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import type { DrumGrid } from '@/shared/lib/arrangement'
import { usePlayback } from '@/shared/lib/services'
import { Sheet, SheetContent } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { styleBar } from '../model/engine'

/** The rows a groove's picture draws: the cymbals, the snare, the kick. */
const PICTURE_ROWS: readonly (readonly (keyof DrumGrid)[])[] = [
  ['hatClosed', 'hatOpen', 'ride', 'hatPedal'],
  ['snare', 'rim'],
  ['kick'],
]

/** A style's groove in one bar (its first variation's): a dot on each step a row's drums strike. */
function RhythmPicture({ grid }: { grid: DrumGrid }) {
  const steps = Math.max(...Object.values(grid).map((each) => each?.length ?? 0), 0)
  if (steps === 0) return null
  return (
    <span
      aria-hidden
      className="grid shrink-0 gap-0.5"
      style={{ gridTemplateColumns: `repeat(${steps}, 0.375rem)` }}
    >
      {PICTURE_ROWS.flatMap((voices, row) =>
        Array.from({ length: steps }, (_, step) => {
          const hit = voices.some((voice) => (grid[voice]?.[step] ?? 0) > 0)
          return (
            <span
              key={`${row}-${step}`}
              className={cn('size-1.5 rounded-pill', hit ? 'bg-foreground' : 'bg-border')}
            />
          )
        }),
      )}
    </span>
  )
}

/**
 * The styles by family, each with its rhythm drawn and a one-bar Listen; the chosen ticked. The
 * Style sheet's body on a phone, the laptop's side column under the key's chords.
 */
export function StyleList({
  book,
  value,
  onChoose,
}: {
  book: StyleBook
  value: string
  onChoose(style: Style): void
}) {
  const { t } = useTranslation('practice')
  const locale = useLocale()
  const shelfName = useShelfName()
  const playback = usePlayback<string>()
  return (
    <div className="flex flex-col gap-5">
      {book.families.map(({ family, styles }) => (
        <section key={family} className="flex flex-col gap-1">
          <h3 className="px-1 font-sans text-sm font-semibold text-muted-foreground">
            {t(`chordPlayer.families.${family}`)}
          </h3>
          <ul className="flex flex-col">
            {styles.map((style) => {
              const name = localText(style.name, locale)
              const chosen = style.id === value
              const grid = style.variations[0]?.drums
              return (
                <li key={style.id} className="flex min-h-12 items-center gap-1">
                  <button
                    type="button"
                    aria-pressed={chosen}
                    onClick={() => onChoose(style)}
                    className="flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-control px-2 text-left hover:bg-muted focus-visible:outline-3 focus-visible:outline-ring"
                  >
                    <Check
                      aria-hidden
                      className={cn('size-5 shrink-0', chosen ? 'opacity-100' : 'opacity-0')}
                    />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="font-semibold text-pretty">{name}</span>
                      {style.shelf ? (
                        <span className="text-sm text-muted-foreground">
                          {shelfName({ shelf: style.shelf, patterns: [] })}
                        </span>
                      ) : null}
                    </span>
                    {grid ? <RhythmPicture grid={grid} /> : null}
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-11 shrink-0"
                    aria-label={t('chordPlayer.hear', { style: name })}
                    title={t('chordPlayer.hear', { style: name })}
                    aria-pressed={playback.playing === style.id}
                    onClick={() => playback.toggle(style.id, () => styleBar(style))}
                  >
                    {playback.playing === style.id ? <Square aria-hidden /> : <Play aria-hidden />}
                  </Button>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}

/** The Style sheet, opened from the dock's Style. */
export function StyleSheet({
  open,
  onOpenChange,
  book,
  value,
  onChoose,
}: {
  open: boolean
  onOpenChange(open: boolean): void
  book: StyleBook
  value: string
  onChoose(style: Style): void
}) {
  const { t } = useTranslation('practice')
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title={t('chordPlayer.style')} tall>
        <StyleList book={book} value={value} onChoose={onChoose} />
      </SheetContent>
    </Sheet>
  )
}
