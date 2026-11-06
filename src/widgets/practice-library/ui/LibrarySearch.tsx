import { useTranslation } from 'react-i18next'
import { STAGES } from '@/entities/step'
import { useSetSearch } from '@/shared/lib'
import {
  FilterChips,
  FilterChoice,
  FilterFoot,
  FilterGroup,
  FilterSheet,
  SearchField,
  SortChoice,
  type FilterChipOn,
} from '@/shared/ui'
import {
  ALL,
  FAVOURITES,
  HIDDEN,
  MINE,
  PRACTICE_SORTS,
  type LibraryGroup,
  type LibraryShown,
  libraryFiltersOn,
  type PracticeLibraryView,
} from '../model/library-view'
import type { GroupWord, LibraryKind } from '../model/library-words'

/**
 * A practice library's search and filters (R30-4, Songs' own): one search box with the sort joined to
 * its end on a phone (the table's headings sort on a laptop); beside it Filter, its count on it,
 * opening Level (the levels the place holds) and, for a library of styles, Style; under them, each
 * filter on and a phone's place as a chip that takes it off.
 */
export function LibrarySearch({
  kind,
  view,
  shown,
  groups,
  groupWord,
  levels,
  wide,
  screen,
  names,
}: {
  kind: LibraryKind
  view: PracticeLibraryView
  shown: LibraryShown
  groups: readonly LibraryGroup[]
  groupWord: GroupWord
  levels: boolean
  /** A laptop's two panes: the tree marks the place, and the table's headings sort. */
  wide: boolean
  screen: string
  names: Readonly<Record<string, string>>
}) {
  const { t } = useTranslation(['practice', 'common'])
  const set = useSetSearch<PracticeLibraryView>()
  const sorts = PRACTICE_SORTS.filter((sort) => levels || sort !== 'level')
  const sortName = (sort: (typeof PRACTICE_SORTS)[number]) =>
    sort === 'group' ? t('practice:library.sortManual') : t(`practice:library.table.${sort}`)
  const styles = groupWord === 'style'
  const placeName =
    view.place === FAVOURITES || view.place === MINE || view.place === HIDDEN
      ? names[view.place]
      : groups.find((group) => group.id === view.place)?.name
  const stages = STAGES.filter((stage) => shown.stages.includes(stage) || stage === view.stage)
  const chips: (FilterChipOn | null)[] = [
    view.stage === 'any'
      ? null
      : {
          id: 'stage',
          name: t('practice:library.chipLevel', {
            level: t(`common:stage.${view.stage}`),
          }),
          off: () => set({ stage: 'any' }),
        },
    shown.place === ALL || placeName === undefined || (wide && !styles)
      ? null
      : { id: 'place', name: placeName, off: () => set({ place: ALL }) },
  ]
  const count = libraryFiltersOn(view, groups, groupWord)
  const kept = shown.filtering ? shown.items.length : shown.scope
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <SearchField
            value={view.q}
            onChange={(q) => set({ q })}
            label={t(`practice:library.kinds.${kind}.search`)}
            hint={t('practice:library.searchHint')}
            screen={screen}
            end={
              wide ? undefined : (
                <SortChoice
                  value={view.sort}
                  options={sorts.map((sort) => ({
                    value: sort,
                    label: sortName(sort),
                    short: sortName(sort),
                  }))}
                  onChange={(sort) => set({ sort })}
                />
              )
            }
          />
        </div>
        <FilterSheet
          count={count}
          foot={(close) => (
            <FilterFoot
              on={count > 0}
              onClear={() =>
                set(styles && count > 0 ? { stage: 'any', place: ALL } : { stage: 'any' })
              }
              show={
                kept > 0
                  ? t('practice:library.show', { count: kept })
                  : t('practice:library.showNone')
              }
              onShow={close}
            />
          )}
        >
          {levels ? (
            <FilterGroup title={t('practice:library.table.level')}>
              <FilterChoice pressed={view.stage === 'any'} onPress={() => set({ stage: 'any' })}>
                {t('practice:library.anyLevel')}
              </FilterChoice>
              {stages.map((stage) => (
                <FilterChoice
                  key={stage}
                  pressed={view.stage === stage}
                  onPress={() => set({ stage })}
                >
                  {t(`common:stage.${stage}`)}
                </FilterChoice>
              ))}
            </FilterGroup>
          ) : null}
          {styles ? (
            <FilterGroup title={t('practice:library.table.style')}>
              <FilterChoice
                pressed={!groups.some((group) => group.id === view.place)}
                onPress={() => set({ place: ALL })}
              >
                {t('practice:library.anyStyle')}
              </FilterChoice>
              {groups.map((group) => (
                <FilterChoice
                  key={group.id}
                  pressed={view.place === group.id}
                  onPress={() => set({ place: group.id })}
                >
                  {group.name}
                </FilterChoice>
              ))}
            </FilterGroup>
          ) : null}
        </FilterSheet>
      </div>
      <FilterChips chips={chips.filter((chip) => chip !== null)} />
    </div>
  )
}
