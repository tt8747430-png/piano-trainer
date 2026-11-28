import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'

/** The steps either side of the tempo, slower first. */
const STEPS = [-10, -1, 1, 10] as const

/**
 * The tempo as the Metronome's board draws it (canvas 179): its mark and BPM over it in Soft Ink
 * ("Allegro · BPM"), the number large and bold in the middle, −10 and −1 before it and +1 and +10
 * after it as filled pills 44 high. The number keeps its width as it changes, so the steps never
 * move (its digits proportional, as the board sets them: a tabular 1 stands apart). `size`: the
 * Metronome's page (`large`, 72, 120 on a laptop), or a tool's popover and page (`small`, 40: the
 * Chord player's Tempo, the board's `TEMPO(40)`).
 */
export function TempoSteps({
  bpm,
  mark,
  size = 'large',
  onStep,
}: {
  bpm: number
  /** The tempo's word before BPM (Allegro), where the page names it. */
  mark?: string | undefined
  size?: 'large' | 'small'
  onStep: (step: number) => void
}) {
  const { t } = useTranslation('practice')
  const step = (by: number) => {
    const name = by < 0 ? t('metronome.slower', { step: -by }) : t('metronome.faster', { step: by })
    return (
      <button
        key={by}
        type="button"
        aria-label={name}
        title={name}
        onClick={() => onStep(by)}
        className="h-11 w-13 min-w-11 shrink rounded-pill bg-muted text-subhead font-semibold tabular-nums transition-colors hover:bg-muted-foreground/15"
      >
        {by < 0 ? `−${-by}` : `+${by}`}
      </button>
    )
  }
  return (
    // On its own page, 14 under the bar's buttons as the Metronome board sets it.
    <div className="flex w-full flex-col items-center gap-0.5">
      <p aria-hidden className="text-subhead/[normal] text-muted-foreground">
        {mark ? `${mark} · ${t('metronome.bpm')}` : t('metronome.bpm')}
      </p>
      <div className="flex w-full items-center justify-between gap-1.5 min-[25rem]:gap-2">
        {STEPS.slice(0, 2).map(step)}
        <p
          className={cn(
            'min-w-[1.75em] shrink-0 text-center font-bold tracking-figures tabular-nums',
            // The board's number keeps the font's own line height, 2 under its tempo's word.
            size === 'large'
              ? 'text-[4.5rem]/[normal] lg:text-[7.5rem]/[normal]'
              : 'text-[2.5rem]/[normal]',
          )}
        >
          <span className="sr-only">{t('metronome.tempo', { bpm })}</span>
          <span aria-hidden>{bpm}</span>
        </p>
        {STEPS.slice(2).map(step)}
      </div>
    </div>
  )
}
