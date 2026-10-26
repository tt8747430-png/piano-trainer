import { FilePenLine, GraduationCap, Music, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { pieceStage } from '@/entities/course'
import { pieceStepId, StageMark } from '@/entities/step'
import { entryTitles, PieceLink, pieceChords, pieceKey, type Entry } from '@/entities/piece'
import { selectIsLearned, useProgress } from '@/entities/progress'
import { useLocale } from '@/shared/i18n'
import { keySymbol, printedSymbol } from '@/shared/lib/music'
import { LearnedBadge, RowLink, type Paint } from '@/shared/ui'

/** Between a row's chords: an en space, half the type's size, so each chord stands apart. */
const CHORD_SPACE = '\u2002'

/** A kind of entry's tile where the book gives it no number: a song yellow, a study grass. */
const KIND_TILE: Readonly<Record<Entry['kind'], { icon: LucideIcon; paint: Paint }>> = {
  song: { icon: Music, paint: 'yellow' },
  listing: { icon: FilePenLine, paint: 'sand' },
  study: { icon: GraduationCap, paint: 'grass' },
}

/**
 * A piece or listing in a list, linking to its page on its shelf: its number in its book on its tile
 * (else its kind's icon; no `tile` where every row of its list would wear the same one), its title
 * over its second one and how many chords it has (a listing: "no chart yet") and its first chords
 * (Chordify's song cards), then its key (named for a screen reader, as `PieceFacts` names it), its
 * stage's mark and, once learned, the learned badge.
 */
export function EntryRow({ entry, tile = true }: { entry: Entry; tile?: boolean }) {
  const { t } = useTranslation(['songs', 'common', 'music'])
  const locale = useLocale()
  const { primary, secondary } = entryTitles(entry, locale)
  const step = pieceStepId(entry.id)
  const learned = useProgress(selectIsLearned(step))
  const stage = pieceStage(entry.id)
  const kind = KIND_TILE[entry.kind]
  const number = entry.source?.number
  const chords = pieceChords(entry)
  // How many it has, each once over any bass (ADR 0103): said, as the chords' line is not.
  const count = pieceChords(entry, Number.POSITIVE_INFINITY).length
  const detail =
    entry.kind === 'listing'
      ? t('songs:noChart')
      : [secondary, count > 0 ? t('songs:chordCount', { count }) : undefined]
          .filter((part) => part !== undefined)
          .join(' · ') || undefined
  return (
    <li>
      <RowLink
        title={primary}
        detail={detail}
        {...(!tile ? {} : number === undefined ? kind : { numeral: number, paint: kind.paint })}
        trailing={
          entry.kind === 'listing' ? null : (
            <>
              <span className="sr-only">{t('music:key.label')}</span>{' '}
              <span className="shrink-0 font-display font-semibold tabular-nums">
                {printedSymbol(keySymbol(pieceKey(entry)))}
              </span>
              {stage ? <StageMark stage={stage} /> : null}
              {learned ? <LearnedBadge label={t('common:learned.done')} /> : null}
            </>
          )
        }
        render={<PieceLink entry={entry} />}
      >
        {chords.length > 0 ? (
          // A screen reader passes them by: the row names the song, its page lists its chords, and
          // a symbol read aloud (`C♯m`) says little.
          <span
            data-slot="row-chords"
            aria-hidden
            className="block truncate font-display text-sm font-medium text-muted-foreground"
          >
            {chords.map(printedSymbol).join(CHORD_SPACE)}
          </span>
        ) : null}
      </RowLink>
    </li>
  )
}
