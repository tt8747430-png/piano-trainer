import { useTranslation } from 'react-i18next'
import { noteName, type Midi } from '@/shared/lib/music'
import { ToneChip } from '@/shared/ui'
import { toneOfKey, type Finding } from '../model/finding'

/**
 * What the keys make: nothing yet, a note, an interval, or a chord, its notes from the bass up by
 * degree and the other names they have; or no chord at all.
 */
export function FinderName({ keys, finding }: { keys: readonly Midi[]; finding: Finding }) {
  const { t } = useTranslation(['learn', 'music'])
  switch (finding.kind) {
    case 'empty':
      return <p className="text-lg text-muted-foreground">{t('learn:finder.choose')}</p>
    case 'note':
      return <h2 className="text-7xl">{noteName(finding.note)}</h2>
    case 'interval':
      return <h2 className="text-5xl">{t(`music:interval.${finding.interval}.name`)}</h2>
    case 'none':
      return <p className="text-lg text-muted-foreground">{t('learn:finder.none')}</p>
  }
  const { best, others } = finding
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
          const tone = toneOfKey(best, key)
          return tone ? (
            <li key={key}>
              <ToneChip face={tone.role} degree={tone.degree} note={noteName(tone.note)} />
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
