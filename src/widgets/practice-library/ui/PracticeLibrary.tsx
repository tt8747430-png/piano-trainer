import { useDeferredValue, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/shared/i18n'
import { useMediaQuery, useSetSearch } from '@/shared/lib'
import { FilteredNotice, FoldSection, GROUPED_LIST, LIBRARY_PANES } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import {
  FAVOURITES,
  HIDDEN,
  libraryShown,
  MINE,
  type LibraryGroup,
  type LibraryItem,
  type PracticeLibraryView,
  type ShownSection,
} from '../model/library-view'
import type { GroupWord, LibraryKind } from '../model/library-words'
import { useArrangedLibrary, type ArrangeSheet } from '../model/use-arranged-library'
import { ArrangeList } from './ArrangeList'
import { ArrangeSheets } from './ArrangeSheets'
import { LibraryEmpty } from './LibraryEmpty'
import { LibraryRow } from './LibraryRow'
import { LibrarySearch } from './LibrarySearch'
import { LibraryTable } from './LibraryTable'
import { LibraryTree } from './LibraryTree'

/** How many rows a phone's run shows before Show all. */
const FOLDED = 5

/** A phone's run of rows under its name and count, folding away, after five Show all n; a book's links over it. */
function Section({
  section,
  folds,
  links,
}: {
  section: ShownSection
  folds: boolean
  links?: ReactNode
}) {
  const { t } = useTranslation('practice')
  const [open, setOpen] = useState(false)
  const [shut, setShut] = useState(false)
  const folded = folds && !open && section.items.length > FOLDED
  return (
    <FoldSection
      title={section.name}
      count={section.items.length}
      fold={{ open: !shut, toggle: () => setShut((now) => !now) }}
    >
      {links ? <div className="flex flex-wrap gap-2">{links}</div> : null}
      <ul className={GROUPED_LIST}>
        {(folded ? section.items.slice(0, FOLDED) : section.items).map((item) => (
          <LibraryRow key={item.id} item={item} />
        ))}
      </ul>
      {folded ? (
        <Button variant="soft" className="self-start" onClick={() => setOpen(true)}>
          {t('library.showAll', { count: section.items.length })}
        </Button>
      ) : null}
    </FoldSection>
  )
}

/**
 * One library for Exercises, Accompaniment and Progressions (R30-4), the Songs library's shape: the
 * search with Sort and Filter. On a phone, Favourites while there are some, then each book (or style,
 * or the learner's folder) a run of rows, folded after five, Mine last; from a laptop's width, two
 * panes, the tree of its places beside the table, which its headings sort. Arranged by the learner
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
  extra,
  mine,
  screen,
  editing = false,
}: {
  kind: LibraryKind
  view: PracticeLibraryView
  items: readonly LibraryItem[]
  /** Its books, or its styles, in their order. */
  groups: readonly LibraryGroup[]
  groupWord: GroupWord
  /** Whether its content has levels to show, sort and filter by. */
  levels: boolean
  /** The table's own column, named. */
  extra?: string
  /** Mine, where the learner makes rows of their own: what an empty Mine offers. */
  mine?: { empty: ReactNode }
  /** The screen's name, for the search's shortcut. */
  screen: string
  /** Edit: the places and rows to arrange, each with its handle. */
  editing?: boolean
}) {
  const { t } = useTranslation(['practice', 'common'])
  const locale = useLocale()
  const wide = useMediaQuery(LIBRARY_PANES)
  const set = useSetSearch<PracticeLibraryView>()
  const q = useDeferredValue(view.q)
  const names = {
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
  const linksOf = (place: string) => arranged.groups.find((group) => group.id === place)?.links
  if (editing)
    return (
      <>
        <ArrangeList
          kind={kind}
          places={arranged.places}
          items={arranged.items}
          onSheet={setSheet}
        />
        {sheets}
      </>
    )
  const collator = new Intl.Collator(locale)
  const shown = libraryShown(
    arranged.items,
    { ...view, q },
    { groups: arranged.groups, mine: mine !== undefined, compare: collator.compare, names },
  )
  const narrowed = shown.filtering || shown.place !== 'all'
  const body = (
    <div className="flex min-w-0 flex-col gap-4">
      <LibrarySearch
        kind={kind}
        view={view}
        shown={shown}
        groups={arranged.groups}
        groupWord={groupWord}
        levels={levels}
        wide={wide}
        screen={screen}
        names={names}
        mine={mine !== undefined}
      />
      <FilteredNotice
        shown={shown.items.length}
        hidden={shown.filtering ? shown.scope - shown.items.length : 0}
        onClear={() => set({ q: '', stage: 'any' })}
      />
      {shown.items.length === 0 ? (
        <LibraryEmpty
          kind={kind}
          view={view}
          place={shown.place}
          filtering={shown.filtering}
          mine={mine?.empty}
        />
      ) : wide ? (
        <>
          {linksOf(shown.place) ? (
            <div className="flex flex-wrap gap-2">{linksOf(shown.place)}</div>
          ) : null}
          <LibraryTable
            items={shown.items}
            view={view}
            groups={arranged.groups}
            groupWord={groupWord}
            levels={levels}
            extra={extra}
            names={names}
          />
        </>
      ) : (
        <div className="flex flex-col gap-6">
          {shown.sections.map((section) => (
            <Section
              key={section.id}
              section={section}
              folds={!narrowed}
              links={linksOf(section.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
  if (!wide)
    return (
      <>
        {body}
        {sheets}
      </>
    )
  return (
    <div className="grid grid-cols-[17rem_minmax(0,1fr)] items-start gap-8">
      <aside className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto pb-4">
        <LibraryTree
          kind={kind}
          place={shown.place}
          groups={arranged.groups}
          groupWord={groupWord}
          mine={mine !== undefined}
          counts={shown.counts}
        />
      </aside>
      {body}
      {sheets}
    </div>
  )
}
