import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { INTERVAL_GROUP_IDS, INTERVALS } from '@/shared/lib/music'
import { INTERVAL_ROWS, type RowInterval } from '../model/interval-rows'
import { useIntervalName } from './use-interval-name'

/**
 * The intervals as tiles, seven to a row, in the musician's two groups (`r61_intervals.py`, GRID61):
 * Simple (P1 to P8) and Compound (beyond the octave), each under its caption on the column, 8 over
 * its tiles and 16 between the groups; one choice across both. Each tile is its short name with its
 * semitones under it, pressed and filled in ink when chosen (canvas 176). A tap chooses and plays it.
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
    <div role="group" aria-label={t('intervals.chosen')} className="flex flex-col gap-4">
      {INTERVAL_GROUP_IDS.map((group) => {
        const shown = INTERVAL_ROWS[group].filter((name) => names.includes(name))
        if (shown.length === 0) return null
        return (
          <section
            key={group}
            aria-labelledby={`interval-group-${group}`}
            className="flex flex-col gap-2"
          >
            <h3 id={`interval-group-${group}`} className="caps">
              {t(`intervals.group.${group}`)}
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {shown.map((name) => {
                const { title, short } = said(name)
                const on = name === chosen
                return (
                  <button
                    key={name}
                    type="button"
                    aria-pressed={on}
                    aria-label={title}
                    title={title}
                    onClick={() => onPick(name)}
                    className={cn(
                      'flex h-13 w-full flex-col items-center justify-center gap-px rounded-control bg-card leading-[normal] ring-1 ring-border transition-colors hover:bg-muted',
                      on && 'bg-selected text-selected-foreground hover:bg-selected',
                    )}
                  >
                    <span className="font-bold">{short}</span>
                    <span
                      className={cn(
                        'text-xs/[normal] tabular-nums',
                        on ? 'opacity-70' : 'text-muted-foreground',
                      )}
                    >
                      {INTERVALS[name].semitones}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
