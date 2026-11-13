import { useTranslation } from 'react-i18next'
import { pieceStage } from '@/entities/course'
import { StageMark } from '@/entities/step'
import {
  entryTitles,
  pieceKey,
  selectHasVersion,
  TempoText,
  usePieces,
  type Entry,
} from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import { keySymbol, printedSymbol } from '@/shared/lib/music'
import { ScaleLink } from './PieceAbout'

/**
 * A listing's facts under its bar (`PieceHeader`), in one quiet line that reads and is not pressed:
 * its second title, then its key, meter and tempo, named for a screen reader, its stage's mark, and
 * Your version where the learner has one. A song's page has them as a line of chips (`PieceFactLine`).
 */
export function PieceFacts({ entry }: { entry: Entry }) {
  const { t } = useTranslation(['piece', 'music'])
  const locale = useLocale()
  const { secondary } = entryTitles(entry, locale)
  const stage = entry.kind === 'listing' ? undefined : pieceStage(entry.id)
  const hasVersion = usePieces((state) => selectHasVersion(state, entry.id))
  return (
    <div className="-mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-lg text-muted-foreground">
      {secondary ? <p>{secondary}</p> : null}
      <dl className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <dt className="sr-only">{t('music:key.label')}</dt>
        <dd className="relative font-display font-semibold text-foreground tabular-nums">
          {/* The key is the way to its scale (A28), as on a song's page. */}
          <ScaleLink entry={entry}>{printedSymbol(keySymbol(pieceKey(entry)))}</ScaleLink>
        </dd>
        <dd aria-hidden>·</dd>
        <dt className="sr-only">{t('meter')}</dt>
        {/* The key names a chord, in the serif as the sheets print one; the meter and tempo are
            numbers, read alike. */}
        <dd className="font-medium text-foreground tabular-nums">{entry.meter}</dd>
        {entry.kind === 'listing' ? null : (
          <>
            <dd aria-hidden>·</dd>
            <dt className="sr-only">{t('tempo')}</dt>
            <dd className="font-medium text-foreground tabular-nums">
              <TempoText piece={entry} />
            </dd>
          </>
        )}
        {hasVersion ? (
          <>
            <dt className="sr-only">{t('music')}</dt>
            <dd className="ms-1 rounded-pill bg-paint-yellow px-2.5 py-0.5 text-sm font-medium text-on-paint-yellow">
              {t('yourVersion')}
            </dd>
          </>
        ) : null}
      </dl>
      {stage ? <StageMark stage={stage} /> : null}
    </div>
  )
}
