import { useTranslation } from 'react-i18next'
import { noteName, type FoundChord, type Midi } from '@/shared/lib/music'
import { ToneChip } from '@/shared/ui'
import { toneOfKey, type Finding } from '../model/finding'
import { useChordAbout } from './use-chord-about'

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
  return <FoundName keys={keys} best={finding.best} others={finding.others} />
}

/** A chord found: its symbol, what it is and leaves out, its notes by degree, and its other names. */
function FoundName({
  keys,
  best,
  others,
}: {
  keys: readonly Midi[]
  best: FoundChord
  others: readonly FoundChord[]
}) {
  const { t } = useTranslation('learn')
  const about = useChordAbout()(best)
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
          {t('finder.also', {
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
