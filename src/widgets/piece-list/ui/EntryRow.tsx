import { FilePenLine, GraduationCap, ListMusic, Music, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { levelOf, pieceStepId } from '@/entities/path'
import { entryTitles, PieceLink, pieceKey, type Entry } from '@/entities/piece'
import { selectIsLearned, useProgress } from '@/entities/progress'
import { useLocale } from '@/shared/i18n'
import { keySymbol } from '@/shared/lib/music'
import { LearnedBadge, LevelMark, RowLink, type Paint } from '@/shared/ui'

/** A kind of entry's tile where the book gives it no number: a song yellow, a study grass, a progression lilac. */
const KIND_TILE: Readonly<Record<Entry['kind'], { icon: LucideIcon; paint: Paint }>> = {
  song: { icon: Music, paint: 'yellow' },
  listing: { icon: FilePenLine, paint: 'sand' },
  study: { icon: GraduationCap, paint: 'grass' },
  progression: { icon: ListMusic, paint: 'lilac' },
}

/**
 * A piece or listing in a list, linking to its page on its shelf: its number in its book on its tile
 * (else its kind's icon), its title over its second one (a listing: "no chart yet"), then its key, its
 * level's mark and, once learned, the learned badge.
 */
export function EntryRow({ entry }: { entry: Entry }) {
  const { t } = useTranslation('songs')
  const locale = useLocale()
  const { primary, secondary } = entryTitles(entry, locale)
  const step = pieceStepId(entry.id)
  const learned = useProgress(selectIsLearned(step))
  const level = levelOf(step)
  const tile = KIND_TILE[entry.kind]
  const number = entry.source?.number
  return (
    <li>
      <RowLink
        title={primary}
        detail={entry.kind === 'listing' ? t('noChart') : secondary}
        {...(number === undefined ? tile : { numeral: number, paint: tile.paint })}
        trailing={
          entry.kind === 'listing' ? null : (
            <>
              <span className="shrink-0 font-display font-semibold tabular-nums">
                {keySymbol(pieceKey(entry))}
              </span>
              {level ? <LevelMark level={level} /> : null}
              {learned ? <LearnedBadge label={t('learned')} /> : null}
            </>
          )
        }
        render={<PieceLink entry={entry} />}
      />
    </li>
  )
}
