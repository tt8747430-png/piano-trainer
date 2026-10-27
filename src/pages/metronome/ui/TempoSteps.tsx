import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'

/** The steps either side of the tempo, slower first. */
const STEPS = [-10, -1, 1, 10] as const

/** A step's round button: 44px on the narrowest phones, 48px held upright, 56px from a tablet. */
const STEP =
  'size-12 rounded-full text-base tabular-nums narrow-phone:size-11 sm:size-14 sm:text-lg landscape-phone:size-11'

/**
 * The tempo, large in the middle, with −10 and −1 before it and +1 and +10 after it as round buttons
 * (ADR 0052). The number keeps its width as it changes, so the buttons never move.
 */
export function TempoSteps({ bpm, onStep }: { bpm: number; onStep: (step: number) => void }) {
  const { t } = useTranslation('practice')
  const step = (by: number) => {
    const name = by < 0 ? t('metronome.slower', { step: -by }) : t('metronome.faster', { step: by })
    return (
      <Button
        key={by}
        variant="soft"
        aria-label={name}
        title={name}
        onClick={() => onStep(by)}
        className={STEP}
      >
        {by < 0 ? `−${-by}` : `+${by}`}
      </Button>
    )
  }
  return (
    <div className="flex items-center justify-center gap-2 narrow-phone:gap-1.5 sm:gap-3">
      {STEPS.slice(0, 2).map(step)}
      <p className="flex min-w-[3ch] flex-col items-center font-display text-5xl leading-none font-semibold tabular-nums sm:text-7xl landscape-phone:text-5xl">
        <span className="sr-only">{t('metronome.tempo', { bpm })}</span>
        <span aria-hidden>{bpm}</span>
        <span aria-hidden className="mt-1 font-sans text-sm font-medium text-muted-foreground">
          {t('metronome.bpm')}
        </span>
      </p>
      {STEPS.slice(2).map(step)}
    </div>
  )
}
