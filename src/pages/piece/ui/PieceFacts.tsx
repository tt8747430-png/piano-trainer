import { useTranslation } from 'react-i18next'
import { levelOf, pieceStepId } from '@/entities/path'
import { entryTitles, pieceKey, selectHasVersion, usePieces, type Entry } from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import { keySymbol } from '@/shared/lib/music'
import { LevelMark } from '@/shared/ui'

/** A fact as a small printed label: named for a screen reader, its value alone on screen. */
function FactChip({ term, children }: { term: string; children: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-1">
      <dt className="sr-only">{term}</dt>
      <dd className="font-semibold tabular-nums">{children}</dd>
    </div>
  )
}

/**
 * A song's or listing's facts under its bar (`PieceHeader`), in a line: its second title, then its
 * key and meter (and Your version, where the learner has one) as labels, and its level's mark.
 */
export function PieceFacts({ entry }: { entry: Entry }) {
  const { t } = useTranslation('piece')
  const locale = useLocale()
  const { secondary } = entryTitles(entry, locale)
  const level = entry.kind === 'listing' ? undefined : levelOf(pieceStepId(entry.id))
  const hasVersion = usePieces((state) => selectHasVersion(state, entry.id))
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {secondary ? <p className="text-lg text-muted-foreground">{secondary}</p> : null}
      <dl className="flex flex-wrap items-center gap-2">
        <FactChip term={t('key')}>{keySymbol(pieceKey(entry))}</FactChip>
        <FactChip term={t('meter')}>{entry.meter}</FactChip>
        {hasVersion ? <FactChip term={t('music')}>{t('yourVersion')}</FactChip> : null}
      </dl>
      {level ? <LevelMark level={level} /> : null}
    </div>
  )
}
