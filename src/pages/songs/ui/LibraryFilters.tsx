import { Heart, ListMusic } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { LIBRARY_SORTS, type LibrarySort } from '@/entities/library'
import { STAGES } from '@/entities/step'
import { chordListParam, readChordList, useViewChange } from '@/shared/lib'
import { Dropdown, SearchField } from '@/shared/ui'
import { Toggle } from '@/shared/ui/primitives/toggle'
import { chordChoices } from '../model/known-chords'
import { stagesIn } from '../model/library-view'
import type { SongsFilter } from '../model/songs-filter'
import type { LibraryPage } from '../model/use-library-page'
import { KnownChordsFilter } from './KnownChordsFilter'

/**
 * The library's search and filters (ADR 0106): the search its own row on a phone, then the sort
 * (Manual · Name · Recently played, kept in the library), Level (only the levels the songs here
 * hold), With chords, Favourites and Chords I know, each whole, wrapping where they do not fit. The
 * filters are the URL's; the sort is the library's.
 */
export function LibraryFilters({
  page,
  filter,
  screen,
}: {
  page: LibraryPage
  filter: SongsFilter
  /** The screen's name, for the search's. */
  screen: string
}) {
  const { t } = useTranslation('songs')
  const { t: common } = useTranslation('common')
  const set = useViewChange<SongsFilter>()
  const { scope } = page.view
  const held = stagesIn(scope)
  const stages = STAGES.filter((stage) => held.includes(stage) || stage === filter.stage)
  const choices = useMemo(() => chordChoices([{ entries: scope }]), [scope])
  const known = readChordList(filter.known).filter((chord) => choices.includes(chord))
  return (
    <div className="flex flex-wrap items-center gap-2 lg:max-w-5xl">
      <div className="min-w-0 basis-full sm:basis-0 sm:flex-1">
        <SearchField
          value={filter.q}
          onChange={(q) => set({ q })}
          label={t('search')}
          screen={screen}
        />
      </div>
      <Dropdown<LibrarySort>
        label={t('sort.label')}
        value={page.sort}
        onChange={page.setSort}
        options={LIBRARY_SORTS.map((value) => ({ value, label: t(`sort.${value}`) }))}
        className="flex-auto sm:flex-none"
      />
      {stages.length > 0 ? (
        <Dropdown
          label={t('stage')}
          value={filter.stage}
          onChange={(stage) => set({ stage })}
          options={[
            { value: 'any', label: t('anyStage') },
            ...stages.map((stage) => ({ value: stage, label: common(`stage.${stage}`) })),
          ]}
          className="flex-auto sm:flex-none"
        />
      ) : null}
      <Toggle
        pressed={filter.withChords}
        onPressedChange={(withChords) => set({ withChords })}
        className="flex-auto sm:flex-none"
      >
        <ListMusic aria-hidden />
        {t('withChords')}
      </Toggle>
      <Toggle
        pressed={filter.favourites}
        onPressedChange={(favourites) => set({ favourites })}
        className="flex-auto sm:flex-none"
      >
        <Heart aria-hidden />
        {t('favourites')}
      </Toggle>
      <KnownChordsFilter
        choices={choices}
        known={known}
        onChange={(chords) => set({ known: chordListParam(chords) })}
      />
    </div>
  )
}
