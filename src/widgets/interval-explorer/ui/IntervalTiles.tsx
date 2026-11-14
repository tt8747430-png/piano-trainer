import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { INTERVALS } from '@/shared/lib/music'
import type { RowInterval } from '../model/interval-rows'
import { useIntervalName } from './use-interval-name'

/**
 * The intervals as tiles, seven to a row (canvas 170): each its short name and its semitones under
 * it, the chosen one filled in ink (canvas 176). A tap chooses it and plays it.
 */
export function IntervalTiles({
  names,
  chosen,
  onPick,
}: {
  names: readonly RowInterval[]
  chosen: RowInterval
  onPick: (name: RowInterval) => void
}) {
  const { t } = useTranslation('practice')
  const said = useIntervalName()
  return (
    <ul aria-label={t('intervals.chosen')} className="grid grid-cols-7 gap-1.5">
      {names.map((name) => {
        const { title, short } = said(name)
        const on = name === chosen
        return (
          <li key={name}>
            <button
              type="button"
              aria-pressed={on}
              aria-label={title}
              title={title}
              onClick={() => onPick(name)}
              className={cn(
                'flex h-13 w-full flex-col items-center justify-center gap-px rounded-xl bg-card ring-1 ring-border transition-colors hover:bg-muted',
                on && 'bg-selected text-selected-foreground hover:bg-selected',
              )}
            >
              <span className="font-bold">{short}</span>
              <span
                className={cn('text-xs tabular-nums', on ? 'opacity-70' : 'text-muted-foreground')}
              >
                {INTERVALS[name].semitones}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
