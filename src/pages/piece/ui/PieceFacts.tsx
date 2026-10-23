import { useTranslation } from 'react-i18next'
import { pieceStage } from '@/entities/course'
import { StageMark } from '@/entities/step'
import { entryTitles, pieceKey, selectHasVersion, usePieces, type Entry } from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import { keySymbol } from '@/shared/lib/music'

/**
 * A song's or listing's facts under its bar (`PieceHeader`), in one quiet line that reads and is not
 * pressed: its second title, then its key, meter and tempo, named for a screen reader, its stage's mark, and
 * Your version where the learner has one.
 */
export function PieceFacts({ entry }: { entry: Entry }) {
  const { t } = useTranslation('piece')
  const locale = useLocale()
  const { secondary } = entryTitles(entry, locale)
  const stage = entry.kind === 'listing' ? undefined : pieceStage(entry.id)
  const hasVersion = usePieces((state) => selectHasVersion(state, entry.id))
  return (
    <div className="-mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-lg text-muted-foreground">
      {secondary ? <p>{secondary}</p> : null}
      <dl className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <dt className="sr-only">{t('key')}</dt>
        <dd className="font-display font-semibold text-foreground tabular-nums">
          {keySymbol(pieceKey(entry))}
        </dd>
        <dd aria-hidden>·</dd>
        <dt className="sr-only">{t('meter')}</dt>
        {/* The key names a chord, in the serif; the meter and tempo are numbers, read alike. */}
        <dd className="font-medium text-foreground tabular-nums">{entry.meter}</dd>
        {entry.kind === 'listing' ? null : (
          <>
            <dd aria-hidden>·</dd>
            <dt className="sr-only">{t('tempo')}</dt>
            <dd className="font-medium text-foreground tabular-nums">
              {t('bpm', { tempo: entry.tempo })}
            </dd>
          </>
        )}
        {hasVersion ? (
          <>
            <dt className="sr-only">{t('music')}</dt>
            <dd className="ms-1 rounded-full bg-paint-yellow px-2.5 py-0.5 text-sm font-medium text-on-paint-yellow">
              {t('yourVersion')}
            </dd>
          </>
        ) : null}
      </dl>
      {stage ? <StageMark stage={stage} /> : null}
    </div>
  )
}
