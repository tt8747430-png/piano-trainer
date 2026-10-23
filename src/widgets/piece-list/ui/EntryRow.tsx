import { FilePenLine, GraduationCap, Music, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { pieceStage } from '@/entities/course'
import { pieceStepId, StageMark } from '@/entities/step'
import { entryTitles, PieceLink, pieceKey, type Entry } from '@/entities/piece'
import { selectIsLearned, useProgress } from '@/entities/progress'
import { useLocale } from '@/shared/i18n'
import { keySymbol } from '@/shared/lib/music'
import { LearnedBadge, RowLink, type Paint } from '@/shared/ui'

/** A kind of entry's tile where the book gives it no number: a song yellow, a study grass. */
const KIND_TILE: Readonly<Record<Entry['kind'], { icon: LucideIcon; paint: Paint }>> = {
  song: { icon: Music, paint: 'yellow' },
  listing: { icon: FilePenLine, paint: 'sand' },
  study: { icon: GraduationCap, paint: 'grass' },
}

/**
 * A piece or listing in a list, linking to its page on its shelf: its number in its book on its tile
 * (else its kind's icon; no `tile` where every row of its list would wear the same one), its title over its second one (a listing: "no chart yet"), then its key, its
 * stage's mark and, once learned, the learned badge.
 */
export function EntryRow({ entry, tile = true }: { entry: Entry; tile?: boolean }) {
  const { t } = useTranslation(['songs', 'common'])
  const locale = useLocale()
  const { primary, secondary } = entryTitles(entry, locale)
  const step = pieceStepId(entry.id)
  const learned = useProgress(selectIsLearned(step))
  const stage = pieceStage(entry.id)
  const kind = KIND_TILE[entry.kind]
  const number = entry.source?.number
  return (
    <li>
      <RowLink
        title={primary}
        detail={entry.kind === 'listing' ? t('songs:noChart') : secondary}
        {...(!tile ? {} : number === undefined ? kind : { numeral: number, paint: kind.paint })}
        trailing={
          entry.kind === 'listing' ? null : (
            <>
              <span className="shrink-0 font-display font-semibold tabular-nums">
                {keySymbol(pieceKey(entry))}
              </span>
              {stage ? <StageMark stage={stage} /> : null}
              {learned ? <LearnedBadge label={t('common:learned.done')} /> : null}
            </>
          )
        }
        render={<PieceLink entry={entry} />}
      />
    </li>
  )
}
