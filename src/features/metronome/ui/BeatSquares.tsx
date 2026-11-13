import { VolumeX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { BeatLevel } from '@/shared/lib/schedule'
import { cn } from '@/shared/lib'

/** How full a square stands for its level: a downbeat and an accent full, a beat half, silence empty. */
const FILL: Readonly<Record<BeatLevel, string>> = {
  downbeat: 'h-full',
  accent: 'h-full',
  normal: 'h-1/2',
  silent: 'h-0',
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
}: {
  levels: readonly BeatLevel[]
  sounding: number | null
  muted: boolean
  onTap: (beat: number) => void
  /** The quick Metronome's in the Tools sheet (B11): the same squares, a row the sheet's width. */
  small?: boolean
}) {
  const { t } = useTranslation('practice')
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
                  'w-full transition-[height] duration-100',
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
