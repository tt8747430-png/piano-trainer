import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { entryTitles, PieceLink, type Entry } from '@/entities/piece'
import { useProgress, isLearned } from '@/entities/progress'
import { pieceStepId } from '@/entities/step'
import { useLocale } from '@/shared/i18n'
import { SectionHead, SeeAll } from '@/shared/ui'
import { PieceShelfCover } from '@/widgets/piece-cover'

/** How many songs the shelf holds: a shelf's worth, the rest behind See all. */
const SHOWN = 8

/**
 * My songs' All songs (the Songs board's RECENT; owner, 2026-11-17: "the recently played is not the
 * same as the flat editor: it has all scores"): every song, the latest played first, each its first
 * page, its title on up to two lines, a copper meter where it stopped part way, and where it stands
 * ("Bar 9 of 16", Learned, Not started). See all opens All songs.
 */
export function AllSongsShelf({ songs }: { songs: readonly Entry[] }) {
  const { t } = useTranslation('songs')
  const locale = useLocale()
  const plays = useProgress((state) => state.songs)
  const learned = useProgress((state) => state.learned)
  if (songs.length === 0) return null
  return (
    <section aria-labelledby="songs-all" className="flex flex-col gap-3">
      <SectionHead id="songs-all" title={t('all.title')}>
        <SeeAll label={t('all.seeAll')} render={<Link to="/songs/all" />} />
      </SectionHead>
      <ul className="-mx-gutter flex snap-x snap-mandatory scroll-px-gutter gap-3 overflow-x-auto px-gutter pb-0.5 [scrollbar-width:none]">
        {songs.slice(0, SHOWN).map((entry) => {
          const play = plays[entry.id]
          const done = isLearned(learned, pieceStepId(entry.id))
          const partway = !done && play !== undefined && play.at > 0
          return (
            <li key={entry.id} className="w-33 flex-none snap-start">
              <PieceLink
                entry={entry}
                className="flex flex-col gap-2 rounded-[10px] text-foreground focus-visible:outline-offset-2"
              >
                <PieceShelfCover entry={entry} />
                <span className="line-clamp-2 text-[0.9375rem] leading-[1.25] font-semibold">
                  {entryTitles(entry, locale).primary}
                </span>
                {partway ? (
                  <span aria-hidden className="block h-0.75 rounded-[2px] bg-muted">
                    <span
                      className="block h-full rounded-[2px] bg-played"
                      style={{ width: `${Math.round((play.at / play.bars) * 100)}%` }}
                    />
                  </span>
                ) : null}
                <span className="-mt-0.5 text-[0.8125rem] text-muted-foreground">
                  {done
                    ? t('all.learned')
                    : partway
                      ? t('continue.bar', { bar: play.at + 1, total: play.bars })
                      : t('row.notStarted')}
                </span>
              </PieceLink>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
