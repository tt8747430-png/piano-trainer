import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isMethodBookId } from '@/entities/book'
import {
  patternNeed,
  usePatternBook,
  useShelfName,
  type PatternChoice,
  type PatternFit,
} from '@/entities/pattern'
import { usePracticeLibraryStoreApi } from '@/entities/practice-library'
import { markPracticeUsed } from '@/features/manage-practice-library'
import { usePlayback } from '@/shared/lib/services'
import {
  ChoiceChips,
  FilterChips,
  PAGE_TILES,
  RowLink,
  SearchField,
  SettingsGroup,
} from '@/shared/ui'
import { patternSample } from '@/widgets/pattern-music'
import { ALL, FAVOURITES, MINE, RECENT, type PracticeLibraryView } from '@/widgets/practice-library'
import { foldsOpen, patternFolds } from '../model/pattern-folds'
import { usePatternLibrary } from '../model/use-pattern-library'
import { FilterButton } from './FilterButton'
import { PatternFoldCard } from './PatternFoldCard'
import { PatternRow } from './PatternRow'

/**
 * The sheet's page of patterns (the PlayerApp board's, the Accompaniment library's shape): the search
 * with Sort and filter beside it, its count on it; the places as chips that wrap (All, Favourites,
 * Recently used, each book, Mine); Close all or Open all; then the folds, Recently used and
 * Favourites open, each book closed while nothing narrows, and From the chart first where the chart
 * names its methods. A pattern the music cannot play is closed with what it needs. Choosing one plays
 * it at once and puts it first in Recently used, shared with Accompaniment. At its foot, making your
 * own pattern, and Accompaniment, where each is explained and the list is kept.
 */
export function PatternPage({
  value,
  fit,
  view,
  onView,
  onChoose,
  onFilter,
}: {
  value: PatternChoice
  fit: PatternFit
  /** What the sheet shows: its search, place, level and sort, kept while its filters' page is open. */
  view: PracticeLibraryView
  onView: (change: Partial<PracticeLibraryView>) => void
  onChoose: (pattern: PatternChoice) => void
  /** Opens Sort and filter, a page of the sheet. */
  onFilter: () => void
}) {
  const { t } = useTranslation(['player', 'practice', 'common'])
  const book = usePatternBook()
  const shelfName = useShelfName()
  const store = usePracticeLibraryStoreApi()
  const playback = usePlayback<string>()
  const { groups, shown, patterns, names } = usePatternLibrary(view, value)
  const narrowed = shown.filtering || shown.place !== ALL || view.sort !== 'group'
  const folds = patternFolds(shown, view.sort, {
    names: {
      az: t('player:patternSheet.az'),
      ungraded: t('player:patternSheet.ungraded'),
      stage: (stage) => t(`common:stage.${stage}`),
    },
    partOf: (item) => {
      const pattern = patterns.get(item.id)
      return pattern && pattern.group !== 'own' && isMethodBookId(item.group)
        ? shelfName({ shelf: pattern.group })
        : null
    },
  })
  // What the learner opened or closed, apart while the list is narrowed, as the board keeps it.
  const [opened, setOpened] = useState<Readonly<Record<string, boolean>>>({})
  const key = (id: string) => `${narrowed ? 'narrowed' : 'whole'}:${id}`
  const isChosen = (item: { id: string }) => patterns.get(item.id)?.ref === value
  const holdsChosen = (id: string) =>
    folds.some((fold) => fold.id === id && fold.parts.some((part) => part.rows.some(isChosen)))
  // Where no fold open of itself holds the pattern playing, its book opens too, so it is in sight.
  const chosenInSight = folds.some((fold) => foldsOpen(narrowed, fold.id) && holdsChosen(fold.id))
  const isOpen = (id: string) =>
    opened[key(id)] ?? (foldsOpen(narrowed, id) || (!chosenInSight && holdsChosen(id)))
  const anyOpen = folds.some((fold) => isOpen(fold.id))
  const page = useRef<HTMLDivElement>(null)
  // It opens on the pattern playing, so a keyboard user starts where they are.
  useEffect(() => {
    const chosen = page.current?.querySelector<HTMLElement>('[data-chosen]')
    chosen?.focus({ preventScroll: true })
    chosen?.scrollIntoView?.({ block: 'center' })
  }, [])
  const places = [ALL, FAVOURITES, RECENT, ...groups.map((group) => group.id), MINE]
  const placeName = (id: string) =>
    id === ALL
      ? t('practice:library.all')
      : (names[id] ?? groups.find((group) => group.id === id)?.name ?? id)
  const choose = (ref: PatternChoice, id?: string) => {
    if (id) markPracticeUsed(store, 'accompaniment', id)
    onChoose(ref)
  }
  return (
    <div ref={page} className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <SearchField
            value={view.q}
            onChange={(q) => onView({ q })}
            label={t('player:patternSheet.search')}
            surface="sheet"
          />
        </div>
        <FilterButton
          count={Number(view.stage !== 'any')}
          sorted={view.sort !== 'group'}
          onOpen={onFilter}
        />
      </div>
      <ChoiceChips
        label={t('practice:library.placesLabel')}
        tone="honey"
        value={places.includes(shown.place) ? shown.place : ALL}
        options={places.map((id) => ({ value: id, label: placeName(id) }))}
        onChange={(place) => onView({ place })}
      />
      <FilterChips
        chips={
          view.stage === 'any'
            ? []
            : [
                {
                  id: 'stage',
                  name: t(`common:stage.${view.stage}`),
                  off: () => onView({ stage: 'any' }),
                },
              ]
        }
      />
      {fit.methodCodes ? (
        <button
          type="button"
          aria-pressed={value === 'chart'}
          data-chosen={value === 'chart' ? '' : undefined}
          onClick={() => choose('chart')}
          className="flex min-h-15 items-center rounded-control bg-card px-3 text-left text-subhead font-medium transition-colors duration-200 ease-out hover:bg-muted focus-visible:-outline-offset-3 aria-pressed:bg-chosen-honey aria-pressed:font-bold"
        >
          {t('player:fromChart')}
        </button>
      ) : null}
      {folds.length > 1 ? (
        <div className="mx-0.5 -mt-3 -mb-3.5 flex justify-end">
          <button
            type="button"
            onClick={() =>
              setOpened({
                ...opened,
                ...Object.fromEntries(folds.map((fold) => [key(fold.id), !anyOpen])),
              })
            }
            className="min-h-11 rounded-control text-footnote font-semibold text-eyebrow transition-colors duration-200 ease-out hover:text-foreground"
          >
            {t(anyOpen ? 'player:patternSheet.closeAll' : 'player:patternSheet.openAll')}
          </button>
        </div>
      ) : null}
      {folds.length === 0 ? (
        <p className="px-4 py-7 text-center text-subhead text-muted-foreground">
          {t('player:patternSheet.noMatch')}
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {folds.map((fold) => (
            <PatternFoldCard
              key={fold.id}
              fold={fold}
              open={isOpen(fold.id)}
              onToggle={() => setOpened({ ...opened, [key(fold.id)]: !isOpen(fold.id) })}
              row={(item) => {
                const pattern = patterns.get(item.id)
                if (!pattern) return null
                const need = patternNeed(pattern, fit)
                return (
                  <PatternRow
                    key={item.id}
                    item={item}
                    pattern={pattern}
                    chosen={pattern.ref === value}
                    need={need ? t(`player:needs.${need}`) : null}
                    playing={playback.playing === item.id}
                    onChoose={() => choose(pattern.ref, item.id)}
                    onListen={() =>
                      playback.toggle(item.id, () => patternSample(pattern, book).sounds)
                    }
                    onFavourite={() =>
                      item.actions.find((action) => action.key === 'favourite')?.onSelect()
                    }
                  />
                )
              }}
            />
          ))}
        </div>
      )}
      <SettingsGroup flush>
        <RowLink
          title={t('player:ownPattern')}
          icon={Plus}
          paint="grass"
          render={<Link to="/practice/accompaniment/patterns/new" />}
        />
        <RowLink
          title={t('player:allPatterns')}
          {...PAGE_TILES.patterns}
          render={<Link to="/practice/accompaniment" />}
        />
      </SettingsGroup>
    </div>
  )
}
