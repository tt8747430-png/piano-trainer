import { FilePenLine, GraduationCap, Music, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { entryTitles, pieceChords, pieceKey, type Entry } from '@/entities/piece'
import { selectIsLearned, useProgress } from '@/entities/progress'
import { pieceStepId } from '@/entities/step'
import { useKeyName, useLocale } from '@/shared/i18n'
import { printedSymbol } from '@/shared/lib/music'
import { LearnedBadge, type Paint } from '@/shared/ui'

/** Between a row's chords: an en space, half the type's size, so each chord stands apart. */
const CHORD_SPACE = ' '

/** A kind of entry's tile where the book gives it no number: a song yellow, a study grass. */
const KIND_TILE: Readonly<Record<Entry['kind'], { icon: LucideIcon; paint: Paint }>> = {
  song: { icon: Music, paint: 'yellow' },
  listing: { icon: FilePenLine, paint: 'sand' },
  study: { icon: GraduationCap, paint: 'grass' },
}

/** What a song's row shows, wherever it is listed: its `RowFace`'s, and its kind's tile. */
export interface EntryFace {
  readonly face: {
    readonly title: string
    readonly detail: string | undefined
    readonly count: string | undefined
    readonly trailing: ReactNode
    readonly children: ReactNode
  }
  /** Its kind's tile: its icon, and the paint its number in a book wears. */
  readonly kind: { readonly icon: LucideIcon; readonly paint: Paint }
}

/** The credit a row names as its author: who wrote the music, else who wrote it all. */
const AUTHOR_ROLES = ['music', 'words-and-music', 'authors'] as const

/**
 * A piece's or listing's row's face, wherever it is listed (the library, Search, the archive; canvas
 * 133): its title over its second title or its composer and its key ("Beethoven · A minor"; a
 * listing: "no chart yet"), its first chords under them where its place shows them (Chordify's song
 * cards), and once learned, the learned badge at its end.
 */
export function useEntryFace(
  entry: Entry,
  /** What it shows, as its place's Card style says (R29 B9): its key, its chords, its progress. */
  show: { readonly key: boolean; readonly chords: boolean; readonly progress: boolean } = {
    key: true,
    chords: false,
    progress: true,
  },
): EntryFace {
  const { t } = useTranslation(['songs', 'common'])
  const locale = useLocale()
  const keyName = useKeyName()
  const { primary, secondary } = entryTitles(entry, locale)
  const learned = useProgress(selectIsLearned(pieceStepId(entry.id)))
  const chords = pieceChords(entry)
  const author = AUTHOR_ROLES.flatMap((role) =>
    (entry.credits ?? []).flatMap((credit) =>
      credit.role === role && 'names' in credit ? [credit.names] : [],
    ),
  )[0]
  const said =
    entry.kind === 'listing'
      ? [t('noChart')]
      : [secondary ?? author, show.key ? keyName(pieceKey(entry)) : undefined]
  const detail = said.filter((part) => part !== undefined).join(' · ')
  return {
    face: {
      title: primary,
      detail: detail === '' ? undefined : detail,
      count: undefined,
      trailing: show.progress && learned ? <LearnedBadge label={t('common:learned.done')} /> : null,
      children:
        show.chords && chords.length > 0 ? (
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
    },
    kind: KIND_TILE[entry.kind],
  }
}
