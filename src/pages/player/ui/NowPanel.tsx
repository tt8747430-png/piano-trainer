import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import type { PracticeState } from '@/features/practice'
import { TICKS_PER_BEAT, type Performance } from '@/shared/lib/arrangement'
import { cn } from '@/shared/lib'
import { Button } from '@/shared/ui/primitives/button'
import type { TurnFeedback } from '../model/turn-feedback'

function feedbackLine(feedback: TurnFeedback, t: TFunction<'player'>): string {
  switch (feedback.kind) {
    case 'play':
      return t('playThese', { notes: feedback.notes.join(' ') })
    case 'not':
      return t('notThat', { note: feedback.note })
    case 'right':
      return t('right')
    case 'finished':
      return t('finished')
  }
}

/** The chord now at display size, the next one, the bar's beats, and Your turn's feedback line. */
export function NowPanel({
  performance,
  state,
  feedback,
  onAgain,
}: {
  performance: Performance
  state: PracticeState
  feedback: TurnFeedback | null
  onAgain: () => void
}) {
  const { t } = useTranslation('player')
  const group = performance.beatGroups[state.beatGroup]
  const chord = group ? performance.chords[group.chord] : undefined
  const next = group ? performance.chords[group.chord + 1] : undefined
  const bar = group ? performance.bars[group.bar] : undefined
  const beat = group && bar ? Math.floor((group.tick - bar.startTick) / TICKS_PER_BEAT) : 0
  const beats = bar ? Math.ceil(bar.beats) : 0
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-4">
        <p className="text-6xl font-extrabold tracking-tight">{chord?.symbol ?? '–'}</p>
        {next ? (
          <p className="text-right text-sm text-muted-foreground">
            {t('nextChord')}
            <span className="block text-2xl font-bold text-foreground">{next.symbol}</span>
          </p>
        ) : null}
      </div>
      <div aria-hidden className="flex gap-1.5">
        {Array.from({ length: beats }, (_, i) => (
          <span
            key={i}
            className={cn('h-1.5 w-6 rounded-full', i <= beat ? 'bg-primary' : 'bg-border')}
          />
        ))}
      </div>
      {state.mode === 'turn' ? (
        <div className="flex min-h-11 items-center gap-3">
          <p
            aria-live="polite"
            className={cn('text-lg font-semibold', feedback?.kind === 'not' && 'text-destructive')}
          >
            {feedback ? feedbackLine(feedback, t) : null}
          </p>
          {feedback?.kind === 'finished' ? (
            <Button variant="soft" onClick={onAgain}>
              {t('again')}
            </Button>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
