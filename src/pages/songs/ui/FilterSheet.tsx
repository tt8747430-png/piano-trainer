import { useTranslation } from 'react-i18next'
import { STAGES, type Stage } from '@/entities/step'
import { useSetSearch } from '@/shared/lib'
import { keyFromParam, type KeyParam } from '@/shared/lib/music'
import { useKeyName } from '@/shared/i18n'
import {
  FilterChoice,
  FilterFoot,
  FilterGroup,
  FilterSheet,
  Segmented,
  SwitchRow,
} from '@/shared/ui'
import { filtersOn, keysIn, stagesIn } from '../model/library-view'
import type { SongsFilter } from '../model/songs-filter'
import type { LibraryPage } from '../model/use-library-page'

/**
 * The Filter button and its filters (ADR 0106, the owner's example): the library's `FilterSheet` of
 * folding groups, Key (each key the songs here are in, with how many), Level (the levels they hold)
 * and Favourites, each change taken at once; at its foot Clear filters and Show, which counts the
 * songs the filters keep and closes.
 */
export function SongsFilterSheet({ page, filter }: { page: LibraryPage; filter: SongsFilter }) {
  return (
    <FilterSheet
      count={filtersOn(filter)}
      foot={(close) => <SongsFilterFoot page={page} filter={filter} onShow={close} />}
    >
      <FilterFields page={page} filter={filter} />
    </FilterSheet>
  )
}

/** The filters' groups, each folding under its name, open as they start. */
function FilterFields({ page, filter }: { page: LibraryPage; filter: SongsFilter }) {
  const { t } = useTranslation('songs')
  const { t: common } = useTranslation('common')
  const keyName = useKeyName()
  const set = useSetSearch<SongsFilter>()
  const { scope } = page.view
  const keys = keysIn(scope)
  const held = stagesIn(scope)
  // A choice in the URL stays offered while nothing here holds it, so it can be taken off.
  const stages = STAGES.filter((stage) => held.includes(stage) || stage === filter.stage)
  const keyed = keys.some((each) => each.key === filter.key) || filter.key === ''
  const keyChoices = keyed ? keys : [{ key: filter.key as KeyParam, count: 0 }, ...keys]
  return (
    <>
      {/* What has no folder (R31-S): a question for Home, where the folders are. */}
      {page.atHome ? (
        <FilterGroup title={t('filters.folder')} list={false}>
          <Segmented
            label={t('filters.folder')}
            value={filter.folder}
            options={[
              { value: 'any', label: t('filters.any') },
              { value: 'none', label: t('filters.noFolder') },
            ]}
            onChange={(folder) => set({ folder })}
          />
        </FilterGroup>
      ) : null}
      <FilterGroup title={t('filters.progress')} list={false}>
        <Segmented
          label={t('filters.progress')}
          value={filter.learned}
          options={[
            { value: 'any', label: t('filters.any') },
            { value: 'yes', label: t('filters.learned') },
            { value: 'no', label: t('filters.notLearned') },
          ]}
          onChange={(learned) => set({ learned })}
        />
      </FilterGroup>
      <FilterGroup title={t('filters.key')}>
        <FilterChoice pressed={filter.key === ''} onPress={() => set({ key: '' })}>
          {t('filters.anyKey')}
        </FilterChoice>
        {keyChoices.map(({ key, count }) => (
          <FilterChoice key={key} pressed={filter.key === key} onPress={() => set({ key })}>
            {t('filters.keyCount', { key: keyName(keyFromParam(key)), count })}
          </FilterChoice>
        ))}
      </FilterGroup>
      {stages.length > 0 ? (
        <FilterGroup title={t('stage')}>
          <FilterChoice pressed={filter.stage === 'any'} onPress={() => set({ stage: 'any' })}>
            {t('anyStage')}
          </FilterChoice>
          {stages.map((stage: Stage) => (
            <FilterChoice
              key={stage}
              pressed={filter.stage === stage}
              onPress={() => set({ stage })}
            >
              {common(`stage.${stage}`)}
            </FilterChoice>
          ))}
        </FilterGroup>
      ) : null}
      <FilterGroup title={common('library.favourites')} list={false}>
        <SwitchRow
          label={t('filters.onlyFavourites')}
          checked={filter.favourites}
          onCheckedChange={(favourites) => set({ favourites })}
        />
      </FilterGroup>
    </>
  )
}

/** The filters' foot: Clear filters, and Show, saying how many songs the filters keep. */
function SongsFilterFoot({
  page,
  filter,
  onShow,
}: {
  page: LibraryPage
  filter: SongsFilter
  onShow: () => void
}) {
  const { t } = useTranslation('songs')
  const set = useSetSearch<SongsFilter>()
  // What Show shows: the songs the filters keep here, or all the place holds while none is on.
  const shown = page.view.filtering ? page.view.shown : page.view.scope.length
  return (
    <FilterFoot
      on={filtersOn(filter) > 0}
      onClear={() =>
        set({ key: '', stage: 'any', favourites: false, folder: 'any', learned: 'any' })
      }
      show={shown > 0 ? t('filters.show', { count: shown }) : t('filters.showNone')}
      onShow={onShow}
    />
  )
}
