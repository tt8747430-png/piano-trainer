import { VolumeX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { BeatLevel } from '@/shared/lib/schedule'
import { cn } from '@/shared/lib'

/** How full a square stands for its level: a downbeat and an accent full, a beat half, silence empty. */
const FILL: Readonly<Record<BeatLevel, string>> = {
  downbeat: 'scale-y-100',
  accent: 'scale-y-100',
  normal: 'scale-y-50',
  silent: 'scale-y-0',
}

/** How high a tall tile fills for its level: a downbeat and an accent full, a beat 58%, silence empty. */
const TALL: Readonly<Record<BeatLevel, string>> = {
  downbeat: 'scale-y-100',
  accent: 'scale-y-100',
  normal: 'scale-y-[0.58]',
  silent: 'scale-y-0',
}

/**
 * The beats of the bar (A39, as Soundbrenner's): a square for each, the first larger, filled as
 * high as its level (an accent full, a beat half, a silent beat empty); a tap moves it on to the
 * next level. The one sounding is ringed in honey, in a bar the bar trainer mutes "Muted" over the
 * row. The squares share the row's width, so twelve fit a 320px phone.
 */
export function BeatSquares({
  levels,
  sounding,
  muted,
  onTap,
  small = false,
  tall = false,
}: {
  levels: readonly BeatLevel[]
  sounding: number | null
  muted: boolean
  onTap: (beat: number) => void
  /** The quick Metronome's in the Tools sheet (B11): the same squares, a row the sheet's width. */
  small?: boolean
  /** The Metronome page's (canvas 179): equal tiles 110 high (220 on a laptop), filled from the foot to their level. */
  tall?: boolean
}) {
  const { t } = useTranslation('practice')
  if (tall)
    return (
      <div className="relative w-full">
        <ol
          aria-label={t('metronome.beats')}
          data-muted={muted || undefined}
          className="flex h-27.5 w-full gap-2 lg:h-28"
        >
          {levels.map((level, beat) => (
            <li key={beat} className="flex min-w-0 flex-1">
              <button
                type="button"
                aria-current={beat === sounding ? 'true' : undefined}
                aria-label={`${t('metronome.beat', { beat: beat + 1 })}: ${t(`metronome.levels.${level}`)}`}
                title={t('metronome.levels.tap')}
                onClick={() => onTap(beat)}
                className={cn(
                  'relative flex w-full items-end overflow-hidden rounded-xl bg-card ring-1 ring-border',
                  beat === sounding && !muted && 'ring-3 ring-primary',
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'h-full w-full origin-bottom transition-transform duration-100 ease-out motion-reduce:transition-none',
                    TALL[level],
                    level === 'normal' ? 'bg-muted-foreground/60' : 'bg-foreground',
                  )}
                />
                <span
                  aria-hidden
                  className={cn(
                    'absolute start-2 top-1.5 text-xs font-semibold tabular-nums',
                    level === 'normal' || level === 'silent'
                      ? 'text-muted-foreground'
                      : 'text-card',
                  )}
                >
                  {beat + 1}
                </span>
              </button>
            </li>
          ))}
        </ol>
        {/* Over the beats while a bar is silent, taking no room (the board draws none). */}
        <p
          aria-hidden={!muted}
          className={cn(
            'pointer-events-none absolute top-1/2 left-1/2 flex h-9 -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-pill bg-card px-3.5 text-sm font-semibold whitespace-nowrap text-foreground shadow-(--elevation-2) transition-opacity duration-150 ease-out',
            !muted && 'opacity-0',
          )}
        >
          <VolumeX aria-hidden className="size-4" />
          {t('metronome.muted')}
        </p>
      </div>
    )
  return (
    <div className={cn('flex w-full flex-col items-center', small ? 'gap-1' : 'gap-2')}>
      {/* Kept in its place while heard, so the squares never move. */}
      <p
        aria-hidden={!muted}
        className={cn(
          'flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-opacity duration-150 ease-out',
          !muted && 'opacity-0',
        )}
      >
        <VolumeX aria-hidden className="size-4" />
        {t('metronome.muted')}
      </p>
      <ol
        aria-label={t('metronome.beats')}
        data-muted={muted || undefined}
        className={cn(
          'flex w-full items-end justify-center',
          small ? 'max-w-xs gap-1.5' : 'max-w-md gap-1.5 sm:gap-3',
        )}
      >
        {levels.map((level, beat) => (
          <li
            key={beat}
            className={cn(
              'flex flex-1',
              small ? 'max-w-11' : 'max-w-12',
              beat === 0 && (small ? 'max-w-14 grow-2' : 'max-w-16 grow-2'),
            )}
          >
            <button
              type="button"
              aria-current={beat === sounding ? 'true' : undefined}
              aria-label={`${t('metronome.beat', { beat: beat + 1 })}: ${t(`metronome.levels.${level}`)}`}
              title={t('metronome.levels.tap')}
              onClick={() => onTap(beat)}
              className={cn(
                'relative flex aspect-square w-full items-end overflow-hidden rounded-control border border-input bg-muted transition-colors duration-75 ease-out',
                beat === 0 && 'rounded-card',
                beat === sounding && 'border-2 border-primary',
              )}
            >
              <span
                aria-hidden
                className={cn(
                  'h-full w-full origin-bottom transition-transform duration-100 ease-out motion-reduce:transition-none',
                  FILL[level],
                  beat === sounding && !muted ? 'bg-primary' : 'bg-primary/40',
                )}
              />
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
