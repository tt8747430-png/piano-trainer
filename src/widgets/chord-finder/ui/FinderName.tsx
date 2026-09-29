import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import {
  noteName,
  pitchClass,
  plainSpelling,
  spanInterval,
  type FoundChord,
  type Midi,
} from '@/shared/lib/music'
import { ROLE_BG } from '@/shared/ui'

/**
 * What the keys make: nothing yet, a note, an interval, or a chord, its notes from the bass up by
 * degree and the other names they have; or no chord at all.
 */
export function FinderName({
  keys,
  best,
  others,
}: {
  keys: readonly Midi[]
  best: FoundChord | undefined
  others: readonly FoundChord[]
}) {
  const { t } = useTranslation(['learn', 'music'])
  const [lowest] = keys
  if (lowest === undefined) {
    return <p className="text-lg text-muted-foreground">{t('learn:finder.choose')}</p>
  }
  const other = keys.find((key) => pitchClass(key) !== pitchClass(lowest))
  if (other === undefined) {
    return <h2 className="text-7xl">{noteName(plainSpelling(pitchClass(lowest), false))}</h2>
  }
  if (!best) {
    return new Set(keys.map((key) => pitchClass(key))).size === 2 ? (
      <h2 className="text-5xl">{t(`music:interval.${spanInterval(other - lowest)}.name`)}</h2>
    ) : (
      <p className="text-lg text-muted-foreground">{t('learn:finder.none')}</p>
    )
  }
  const about = [
    best.chord.quality ? t(`music:quality.${best.chord.quality}`) : null,
    best.no5th ? t('learn:finder.no5th') : null,
  ].filter((each) => each !== null)
  return (
    <div className="flex flex-col gap-3">
      <hgroup>
        <h2 className="text-7xl">{best.symbol}</h2>
        {about.length > 0 ? <p className="text-muted-foreground">{about.join(' · ')}</p> : null}
      </hgroup>
      <ol className="flex flex-wrap gap-2">
        {keys.map((key) => {
          const tone = best.chord.tones.find((each) => each.pitchClass === pitchClass(key))
          return tone ? (
            <li
              key={key}
              className="flex items-center gap-2 rounded-xl border border-border bg-card py-1 pr-3 pl-1"
            >
              <span
                className={cn(
                  'grid size-7 place-items-center rounded-lg text-sm font-bold text-on-role',
                  ROLE_BG[tone.role],
                )}
              >
                {tone.degree}
              </span>
              <span className="font-semibold">{noteName(tone.note)}</span>
            </li>
          ) : null
        })}
      </ol>
      {others.length > 0 ? (
        <p>
          {t('learn:finder.also', {
            names: others
              .slice(0, 4)
              .map((each) => each.symbol)
              .join(' · '),
          })}
        </p>
      ) : null}
    </div>
  )
}
