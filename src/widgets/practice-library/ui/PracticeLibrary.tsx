import { selectRecent, usePracticeLibrary } from '@/entities/practice-library'
import { useFold } from '@/features/fold-section'
import { useDeferredValue, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { cn, useMediaQuery, useSetSearch, LAPTOP } from '@/shared/lib'
import {
  FilteredNotice,
  FoldSection,
  GROUPED_LIST,
  ScreenHeader,
  type ScreenHeaderProps,
  ShowAll,
} from '@/shared/ui'
import {
  FAVOURITES,
  RECENT,
  HIDDEN,
  libraryShown,
  MINE,
  type LibraryGroup,
  type LibraryItem,
  type PracticeLibraryView,
  type ShownSection,
} from '../model/library-view'
import { libraryFoldId, type GroupWord, type LibraryKind } from '../model/library-words'
import { useArrangedLibrary, type ArrangeSheet } from '../model/use-arranged-library'
import { ArrangeList } from './ArrangeList'
import { ArrangeSheets } from './ArrangeSheets'
import { LibraryEmpty } from './LibraryEmpty'
import { LibraryRow } from './LibraryRow'
import { LibrarySearch } from './LibrarySearch'
import { LibraryTable, type TableColumns } from './LibraryTable'

/** How many rows a phone's run shows before Show all. */
const FOLDED = 5

/** A phone's run of rows under its name and count, folding away, after five Show all n. */
function Section({
  section,
  folds,
  foldId,
}: {
  section: ShownSection
  folds: boolean
  /** Its fold's place in Settings, the laptop table's too. */
  foldId: string
}) {
  const { t } = useTranslation('practice')
  const [open, setOpen] = useState(false)
  const fold = useFold(foldId)
  const folded = folds && !open && section.items.length > FOLDED
  return (
    <FoldSection
      title={section.name}
      count={section.items.length}
      fold={fold}
      // the board's head: 44 with its words centred (6 under the section's top), the card 12 under its line, as every head
      className="gap-3 pt-1.5"
    >
      <ul className={GROUPED_LIST}>
        {(folded ? section.items.slice(0, FOLDED) : section.items).map((item) => (
          <LibraryRow key={item.id} item={item} />
        ))}
      </ul>
      {folded ? (
        <ShowAll
          label={t('library.showAll', { count: section.items.length })}
          onClick={() => setOpen(true)}
        />
      ) : null}
    </FoldSection>
  )
}

/**
 * One library for Exercises, Accompaniment and Progressions (R30-4), the Songs library's shape: the
 * search with Sort and Filter. On a phone, Favourites while there are some, then each book (or style,
 * or the learner's folder) a run of rows, folded after five, Mine last; from a laptop's width the
 * same place chips under the title on Back's edge and, under them, the table of those runs, sorted by
 * its Sort and filter sheet: no second pane of places beside the sidebar (canvas v439). Arranged by the learner
 * (R32): the places and rows in their order, renamed, moved and hidden as set, each row's More with
 * Rename…, Move to… and Hide; in Edit (`editing`, the pencil in the page's bar) every place and row
 * with its handle, a place's More and New folder. What it shows is the URL's (`view`); the rows,
 * their books and the words are the page's.
 */
export function PracticeLibrary({
  kind,
  view,
  items,
  groups,
  groupWord,
  levels,
  columns,
  mine,
  screen,
  header,
  editing = false,
}: {
  /** The page's bar: on a laptop the library's search and Sort and filter lead its tools. */
  header: ScreenHeaderProps
  kind: LibraryKind
  view: PracticeLibraryView
  items: readonly LibraryItem[]
  /** Its books, or its styles, in their order. */
  groups: readonly LibraryGroup[]
  groupWord: GroupWord
  /** Whether its content has levels to show, sort and filter by. */
  levels: boolean
  /** The laptop table's columns, named as the board names them. */
  columns: TableColumns
  /** Mine, where the learner makes rows of their own: what an empty Mine offers. */
  mine?: { empty: ReactNode }
  /** The screen's name, for the search's shortcut. */
  screen: string
  /** Edit: the places and rows to arrange, each with its handle. */
  editing?: boolean
}) {
  const { t } = useTranslation(['practice', 'common'])
  const locale = useLocale()
  const wide = useMediaQuery(LAPTOP)
  const set = useSetSearch<PracticeLibraryView>()
  const q = useDeferredValue(view.q)
  const recent = usePracticeLibrary(selectRecent(kind))
  const names = {
    [RECENT]: t('practice:library.recent'),
    [FAVOURITES]: t('common:library.favourites'),
    [MINE]: t('practice:library.mine'),
    [HIDDEN]: t('practice:library.hidden'),
  }
  const [sheet, setSheet] = useState<ArrangeSheet | null>(null)
  const arranged = useArrangedLibrary({ kind, items, groups, onSheet: setSheet })
  const sheets = (
    <ArrangeSheets
      sheet={sheet}
      onClose={() => setSheet(null)}
      kind={kind}
      places={arranged.places}
      placeOf={(id) => arranged.items.find((item) => item.id === id)?.group ?? ''}
    />
  )
  const collator = new Intl.Collator(locale)
  const shown = libraryShown(
    arranged.items,
    { ...view, q },
    { groups: arranged.groups, mine: mine !== undefined, compare: collator.compare, names, recent },
  )
  const narrowed = shown.filtering || shown.place !== 'all'
  const search = {
    kind,
    view,
    shown,
    groups: arranged.groups,
    groupWord,
    levels,
    // A Key filter where the rows carry their keys (Progressions).
    modes: items.some((item) => item.modes !== undefined),
    screen,
    names,
    mine: mine !== undefined,
  }
  const bar = (
    <ScreenHeader
      {...header}
      tools={
        wide ? (
          <>
            <div inert={editing} className={cn('contents', editing && '*:opacity-50')}>
              <LibrarySearch at="bar" {...search} />
            </div>
            {header.tools}
          </>
        ) : (
          header.tools
        )
      }
    />
  )
  const body = (
    // On a phone the search stands 8 under the bar, as the boards' library column.
    <div className="flex min-w-0 flex-col gap-4 max-lg:-mt-2">
      {/* In Edit the search and the places stay where they are, inert (the board's): nothing moves */}
      <div
        inert={editing}
        className={cn('flex flex-col gap-4 empty:hidden', editing && 'opacity-50')}
      >
        <LibrarySearch at={wide ? 'under' : 'row'} {...search} />
      </div>
      <FilteredNotice
        shown={shown.items.length}
        hidden={shown.filtering ? shown.scope - shown.items.length : 0}
        onClear={() => set({ q: '', stage: 'any', mode: 'any' })}
      />
      {editing ? (
        <ArrangeList
          kind={kind}
          places={arranged.places}
          items={arranged.items}
          onSheet={setSheet}
          table={wide ? { levels, columns } : undefined}
        />
      ) : shown.items.length === 0 ? (
        <LibraryEmpty
          kind={kind}
          view={view}
          place={shown.place}
          filtering={shown.filtering}
          mine={mine?.empty}
        />
      ) : wide ? (
        <LibraryTable kind={kind} sections={shown.sections} levels={levels} columns={columns} />
      ) : (
        <div className="flex flex-col gap-4">
          {shown.sections.map((section) => (
            <Section
              key={section.id}
              section={section}
              folds={!narrowed}
              foldId={libraryFoldId(kind, section.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
  return (
    <>
      {bar}
      {body}
      {sheets}
    </>
  )
}
