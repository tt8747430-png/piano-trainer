import { FilePenLine, GraduationCap, Music, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { pieceStage } from '@/entities/course'
import { entryTitles, pieceChords, pieceKey, type Entry } from '@/entities/piece'
import { selectIsLearned, useProgress } from '@/entities/progress'
import { pieceStepId, StageMark } from '@/entities/step'
import { useLocale } from '@/shared/i18n'
import { keySymbol, printedSymbol } from '@/shared/lib/music'
import { LearnedBadge, type Paint } from '@/shared/ui'

/** Between a row's chords: an en space, half the type's size, so each chord stands apart. */
const CHORD_SPACE = ' '

/** A kind of entry's tile where the book gives it no number: a song yellow, a study grass. */
const KIND_TILE: Readonly<Record<Entry['kind'], { icon: LucideIcon; paint: Paint }>> = {
  song: { icon: Music, paint: 'yellow' },
  listing: { icon: FilePenLine, paint: 'sand' },
  study: { icon: GraduationCap, paint: 'grass' },
}

/** What a song's row shows, wherever it is listed: a `RowFace`'s, and its kind's tile. */
export interface EntryFace {
  readonly title: string
  readonly detail: string | undefined
  readonly trailing: ReactNode
  readonly children: ReactNode
  /** Its kind's tile: its icon, and the paint its number in a sequence wears. */
  readonly kind: { readonly icon: LucideIcon; readonly paint: Paint }
}

/**
 * A piece's or listing's row's face, wherever it is listed (Songs, a setlist): its title over its
 * second one and how many chords it has, each once over any bass (a listing: "no chart yet"), its
 * first chords (Chordify's song cards), then its key (named for a screen reader, as `PieceFacts`
 * names it), its stage's mark and, once learned, the learned badge.
 */
export function useEntryFace(entry: Entry): EntryFace {
  const { t } = useTranslation(['songs', 'common', 'music'])
  const locale = useLocale()
  const { primary, secondary } = entryTitles(entry, locale)
  const learned = useProgress(selectIsLearned(pieceStepId(entry.id)))
  const stage = pieceStage(entry.id)
  const chords = pieceChords(entry)
  // Said, as the chords' line is not (ADR 0103).
  const count = pieceChords(entry, Number.POSITIVE_INFINITY).length
  return {
    title: primary,
    detail:
      entry.kind === 'listing'
        ? t('songs:noChart')
        : [secondary, count > 0 ? t('songs:chordCount', { count }) : undefined]
            .filter((part) => part !== undefined)
            .join(' · ') || undefined,
    trailing:
      entry.kind === 'listing' ? null : (
        <>
          <span className="sr-only">{t('music:key.label')}</span>{' '}
          <span className="shrink-0 font-display font-semibold tabular-nums">
            {printedSymbol(keySymbol(pieceKey(entry)))}
          </span>
          {stage ? <StageMark stage={stage} /> : null}
          {learned ? <LearnedBadge label={t('common:learned.done')} /> : null}
        </>
      ),
    children:
      chords.length > 0 ? (
        // A screen reader passes them by: the row names the song, its page lists its chords, and
        // a symbol read aloud (`C♯m`) says little.
        <span
          data-slot="row-chords"
          aria-hidden
          className="block truncate font-display text-sm font-medium text-muted-foreground"
        >
          {chords.map(printedSymbol).join(CHORD_SPACE)}
        </span>
      ) : null,
    kind: KIND_TILE[entry.kind],
  }
}
