import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useLibrary } from '@/entities/library'
import { entryTitles, PieceLink, useRepertoire } from '@/entities/piece'
import { songsToContinue, useProgress } from '@/entities/progress'
import { pieceStepId } from '@/entities/step'
import { useLocale } from '@/shared/i18n'
import { PieceShelfCover } from '@/widgets/piece-cover'

/** How many songs Continue holds: the latest few, the rest scroll in from the edge. */
const SHOWN = 8

/**
 * Songs' Continue (canvas 133, Apple Music's Recently played): the songs stopped part way and not
 * learned (loop round 46: Continue and the table say one progress), the latest
 * first, each a card of its first page, its title, a copper meter of how far it got and "Bar 9 of 16";
 * a tap opens the song, where Continue from bar 9 waits. A shelf that scrolls sideways; nothing before
 * the first song is left part way.
 */
export function ContinueShelf({ more }: { more?: number } = {}) {
  const { t } = useTranslation('songs')
  const locale = useLocale()
  const repertoire = useRepertoire()
  const songs = useProgress((state) => state.songs)
  const learned = useProgress((state) => state.learned)
  const archived = useLibrary((state) => state.archive)
  const gone = new Set(archived.flatMap((entry) => (entry.kind === 'song' ? [entry.id] : [])))
  const shown = songsToContinue(songs, (id) => learned[pieceStepId(id)] !== undefined)
    .flatMap(([id, play]) => {
      const entry = gone.has(id) ? undefined : repertoire.entry(id)
      return entry && entry.kind !== 'listing' ? [{ entry, play }] : []
    })
    .slice(0, SHOWN)
  if (shown.length === 0) return null
  return (
    <section aria-labelledby="songs-continue" className="flex flex-col gap-2">
      <div className="mx-1 flex items-center justify-between gap-3">
        <h2 id="songs-continue" className="font-sans text-xl font-bold">
          {t('continue.title')}
        </h2>
        {/* See all n (the R72 board): every song, on All songs. */}
        {more ? (
          <Link
            to="/songs/all"
            className="flex min-h-11 items-center text-base font-semibold text-link hover:underline"
          >
            {t('continue.seeAll', { count: more })}
          </Link>
        ) : null}
      </div>
      <ul className="-mx-gutter flex snap-x snap-mandatory scroll-px-gutter gap-3 overflow-x-auto px-gutter pb-1 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:px-0">
        {shown.map(({ entry, play }) => (
          <li key={entry.id} className="w-33 flex-none snap-start lg:w-auto lg:min-w-0">
            <PieceLink
              entry={entry}
              className="flex flex-col gap-1.5 rounded-[10px] text-foreground focus-visible:outline-offset-2"
            >
              <PieceShelfCover entry={entry} />
              <span className="truncate text-[0.9375rem] font-semibold">
                {entryTitles(entry, locale).primary}
              </span>
              <span aria-hidden className="block h-0.75 rounded-[2px] bg-muted">
                <span
                  className="block h-full rounded-[2px] bg-played"
                  style={{ width: `${Math.round((play.at / play.bars) * 100)}%` }}
                />
              </span>
              <span className="text-[0.8125rem] text-muted-foreground">
                {t('continue.bar', { bar: play.at + 1, total: play.bars })}
              </span>
            </PieceLink>
          </li>
        ))}
      </ul>
    </section>
  )
}
