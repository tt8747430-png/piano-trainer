import { useNavigate, useSearch } from '@tanstack/react-router'
import { ListMusic } from 'lucide-react'
import { useDeferredValue, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { piecesIn, selectFavourites, useLibrary } from '@/entities/library'
import { SONG_COLLECTIONS, useRepertoire } from '@/entities/piece'
import { STAGES } from '@/entities/step'
import { localText, useLocale } from '@/shared/i18n'
import { chordListParam, readChordList, useViewChange } from '@/shared/lib'
import { Dropdown, FloatingActions, ScreenHeader, SearchField } from '@/shared/ui'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/primitives/tabs'
import { Toggle } from '@/shared/ui/primitives/toggle'
import { PieceList } from '@/widgets/piece-list'
import { chordChoices } from '../model/known-chords'
import type { SongsFilter, SongsTab } from '../model/songs-filter'
import { songsView, stagesIn } from '../model/songs-view'
import { KnownChordsFilter } from './KnownChordsFilter'
import { NewSongSheet } from './NewSongSheet'
import { SetlistShelf } from './SetlistShelf'
import { SongsEmpty } from './SongsEmpty'

/**
 * Songs: All, then the learner's library (ADR 0103: Favourites, Setlists), then the learner's own
 * songs and the collections, as tabs in its bar; a search, Stage (a song's course's, ADR 0005; only
 * the stages its shelves hold), With chords (no song whose chart is still to come) and Chords I know
 * (only the songs that use no other chord); the songs as cards in as many columns as the width
 * holds, under their collection while All shows. The Setlists tab lists the setlists, its search
 * theirs, and offers none of the songs' filters. New song floats.
 */
export function SongsPage() {
  const { t } = useTranslation('songs')
  const { t: common } = useTranslation('common')
  const locale = useLocale()
  const search = useSearch({ from: '/shell/songs' })
  const navigate = useNavigate({ from: '/songs' })
  const query = useDeferredValue(search.q)
  const set = useViewChange<SongsFilter>()
  // No search, stage, With chords or chords known: the route fills its defaults; the tab stays.
  const clear = () => void navigate({ search: { collection: search.collection }, replace: true })
  const pieces = useRepertoire()
  const favourites = useLibrary(selectFavourites)
  // The favourites, then the learner's songs, then the songbooks', each entry in the learner's version.
  const favouriteShelf = useMemo(
    () => ({
      id: 'favourites' as const,
      name: t('favourites'),
      entries: piecesIn(favourites, pieces),
    }),
    [t, favourites, pieces],
  )
  const collections = useMemo(
    () => [
      { id: 'mine' as const, name: t('yours'), entries: pieces.ownSongs },
      ...SONG_COLLECTIONS.map((collection) => ({
        id: collection.id,
        name: localText(collection.name, locale),
        entries: collection.entries.map((entry) => pieces.entry(entry.id) ?? entry),
      })),
    ],
    [t, locale, pieces],
  )
  const shelves = useMemo(() => [favouriteShelf, ...collections], [favouriteShelf, collections])
  const tabs = collections.filter(
    (shelf) => shelf.entries.length > 0 || shelf.id === search.collection,
  )
  const isTab = (value: unknown): value is SongsTab =>
    value === 'all' ||
    value === 'favourites' ||
    value === 'setlists' ||
    tabs.some((shelf) => shelf.id === value)
  // Only the stages these shelves hold are offered (a choice that shows nothing is not), and the
  // one chosen, which a link may carry.
  const held = stagesIn(shelves, search)
  const stages = STAGES.filter((stage) => held.includes(stage) || stage === search.stage)
  // The chords the songs use, and those of them the learner ticked.
  const choices = useMemo(() => chordChoices(shelves), [shelves])
  const known = readChordList(search.known).filter((chord) => choices.includes(chord))
  const groups = songsView(shelves, { ...search, q: query }).map((g) => ({
    id: g.shelf.id,
    heading: search.collection === 'all' ? g.shelf.name : null,
    entries: g.entries,
  }))
  const setlists = search.collection === 'setlists'

  return (
    <Tabs
      value={search.collection}
      onValueChange={(next: unknown) => {
        if (isTab(next)) set({ collection: next })
      }}
      className="gap-4"
    >
      <ScreenHeader
        title={t('title')}
        tabs={
          <TabsList aria-label={t('collection')} className="-mx-gutter px-gutter">
            <TabsTrigger value="all">{t('all')}</TabsTrigger>
            <TabsTrigger value="favourites">{t('favourites')}</TabsTrigger>
            <TabsTrigger value="setlists">{t('setlists')}</TabsTrigger>
            {tabs.map((shelf) => (
              <TabsTrigger key={shelf.id} value={shelf.id}>
                {shelf.name}
              </TabsTrigger>
            ))}
          </TabsList>
        }
      />
      {/* The search its own row on a phone, the filters under it, each whole: where they do not
          all fit (a chosen stage in Russian at 360px) they wrap, never cut. One row from a tablet.
          A setlist is no song: over the setlists, the search alone. */}
      <div className="flex flex-wrap items-center gap-2 lg:max-w-4xl">
        <div className="min-w-0 basis-full sm:basis-0 sm:flex-1">
          <SearchField
            value={search.q}
            onChange={(q) => set({ q })}
            label={setlists ? t('searchSetlists') : t('search')}
            screen={t('title')}
          />
        </div>
        {setlists ? null : (
          <>
            {stages.length > 0 ? (
              <Dropdown
                label={t('stage')}
                value={search.stage}
                onChange={(stage) => set({ stage })}
                options={[
                  { value: 'any', label: t('anyStage') },
                  ...stages.map((stage) => ({ value: stage, label: common(`stage.${stage}`) })),
                ]}
                className="flex-auto sm:flex-none"
              />
            ) : null}
            <Toggle
              pressed={search.withChords}
              onPressedChange={(withChords) => set({ withChords })}
              className="flex-auto sm:flex-none"
            >
              <ListMusic aria-hidden />
              {t('withChords')}
            </Toggle>
            <KnownChordsFilter
              choices={choices}
              known={known}
              onChange={(chords) => set({ known: chordListParam(chords) })}
            />
          </>
        )}
      </div>
      {setlists ? (
        <SetlistShelf query={query} onClear={clear} />
      ) : groups.length > 0 ? (
        <PieceList groups={groups} />
      ) : (
        <SongsEmpty
          shelf={
            search.collection === 'mine' && pieces.ownSongs.length === 0
              ? 'mine'
              : search.collection === 'favourites' && favouriteShelf.entries.length === 0
                ? 'favourites'
                : 'filtered'
          }
          filter={search}
          onClear={clear}
        />
      )}
      <FloatingActions>
        <NewSongSheet />
      </FloatingActions>
    </Tabs>
  )
}
