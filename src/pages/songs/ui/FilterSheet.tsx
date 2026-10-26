import { ListFilter } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { STAGES, type Stage } from '@/entities/step'
import { useMediaQuery, useViewChange } from '@/shared/lib'
import { keyFromParam, type KeyParam } from '@/shared/lib/music'
import { useKeyName } from '@/shared/i18n'
import { FoldGroup, Sheet, SheetContent, SwitchRow } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import { Toggle } from '@/shared/ui/primitives/toggle'
import { filtersOn, keysIn, stagesIn } from '../model/library-view'
import type { SongsFilter } from '../model/songs-filter'
import type { LibraryPage } from '../model/use-library-page'

/** From a laptop's width the filters open in a popover by their button, under it a sheet. */
const LAPTOP = '(min-width: 64rem)'

/**
 * The Filter button and its filters (ADR 0106, the owner's example): the button, its count on it
 * while filters are on; its sheet (a popover by it on a laptop) of folding groups, Key (each key the
 * songs here are in, with how many), Level (the levels they hold) and Favourites, each change taken
 * at once; at its foot Clear filters and Show, which counts the songs the filters keep and closes.
 */
export function FilterSheet({ page, filter }: { page: LibraryPage; filter: SongsFilter }) {
  const { t } = useTranslation('songs')
  const laptop = useMediaQuery(LAPTOP)
  const [open, setOpen] = useState(false)
  const count = filtersOn(filter)
  const label = count > 0 ? t('filters.on', { count }) : t('filters.title')
  const button = {
    variant: 'outline',
    size: 'icon',
    'aria-label': label,
    title: label,
    className: 'relative size-12 shrink-0 rounded-2xl bg-card [&_svg]:size-5',
  } as const
  const face = (
    <>
      <ListFilter aria-hidden />
      {count > 0 ? (
        <span
          aria-hidden
          data-slot="filter-count"
          className="pointer-events-none absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-foreground px-1 text-xs font-semibold text-background tabular-nums"
        >
          {count}
        </span>
      ) : null}
    </>
  )
  const foot = <FilterFoot page={page} filter={filter} onShow={() => setOpen(false)} />
  if (laptop)
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger render={<Button {...button} />}>{face}</PopoverTrigger>
        <PopoverContent
          aria-label={t('filters.title')}
          align="end"
          className="max-h-(--available-height) w-[min(26rem,calc(100vw-2rem))] gap-0 overflow-hidden p-0"
        >
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <FilterFields page={page} filter={filter} />
          </div>
          <div className="border-t border-hairline p-4">{foot}</div>
        </PopoverContent>
      </Popover>
    )
  return (
    <>
      <Button {...button} onClick={() => setOpen(true)}>
        {face}
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent title={t('filters.title')} footer={foot} tall>
          <FilterFields page={page} filter={filter} />
        </SheetContent>
      </Sheet>
    </>
  )
}

/** The filters' groups, each folding under its name, open as they start. */
function FilterFields({ page, filter }: { page: LibraryPage; filter: SongsFilter }) {
  const { t } = useTranslation('songs')
  const { t: common } = useTranslation('common')
  const keyName = useKeyName()
  const set = useViewChange<SongsFilter>()
  const { scope } = page.view
  const keys = keysIn(scope)
  const held = stagesIn(scope)
  // A choice in the URL stays offered while nothing here holds it, so it can be taken off.
  const stages = STAGES.filter((stage) => held.includes(stage) || stage === filter.stage)
  const keyed = keys.some((each) => each.key === filter.key) || filter.key === ''
  const keyChoices = keyed ? keys : [{ key: filter.key as KeyParam, count: 0 }, ...keys]
  return (
    <div className="flex flex-col gap-6">
      <FilterGroup title={t('filters.key')}>
        <Chip pressed={filter.key === ''} onPress={() => set({ key: '' })}>
          {t('filters.anyKey')}
        </Chip>
        {keyChoices.map(({ key, count }) => (
          <Chip key={key} pressed={filter.key === key} onPress={() => set({ key })}>
            {t('filters.keyCount', { key: keyName(keyFromParam(key)), count })}
          </Chip>
        ))}
      </FilterGroup>
      {stages.length > 0 ? (
        <FilterGroup title={t('stage')}>
          <Chip pressed={filter.stage === 'any'} onPress={() => set({ stage: 'any' })}>
            {t('anyStage')}
          </Chip>
          {stages.map((stage: Stage) => (
            <Chip key={stage} pressed={filter.stage === stage} onPress={() => set({ stage })}>
              {common(`stage.${stage}`)}
            </Chip>
          ))}
        </FilterGroup>
      ) : null}
      <FilterGroup title={t('favourites')} list={false}>
        <SwitchRow
          label={t('filters.onlyFavourites')}
          checked={filter.favourites}
          onCheckedChange={(favourites) => set({ favourites })}
        />
      </FilterGroup>
    </div>
  )
}

/** A group of the filters, folding under its name (the owner's example), open as the sheet opens. */
function FilterGroup({
  title,
  list = true,
  children,
}: {
  title: string
  /** Its choices as chips that wrap; else one row of its own. */
  list?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(true)
  return (
    <FoldGroup
      title={title}
      open={open}
      onToggle={() => setOpen((was) => !was)}
      listClassName={list ? 'flex flex-wrap gap-2' : 'flex flex-col'}
    >
      {children}
    </FoldGroup>
  )
}

/** One choice of a group: a chip pressed while it is the one chosen. */
function Chip({
  pressed,
  onPress,
  children,
}: {
  pressed: boolean
  onPress: () => void
  children: ReactNode
}) {
  return (
    <li>
      <Toggle
        pressed={pressed}
        onPressedChange={() => {
          if (!pressed) onPress()
        }}
        className="h-10 max-w-full min-w-14 text-muted-foreground aria-pressed:text-foreground"
      >
        <span className="truncate">{children}</span>
      </Toggle>
    </li>
  )
}

/** The filters' foot: Clear filters, and Show, saying how many songs the filters keep. */
function FilterFoot({
  page,
  filter,
  onShow,
}: {
  page: LibraryPage
  filter: SongsFilter
  onShow: () => void
}) {
  const { t } = useTranslation('songs')
  const set = useViewChange<SongsFilter>()
  // What Show shows: the songs the filters keep here, or all the place holds while none is on.
  const shown = page.view.filtering ? page.view.shown : page.view.scope.length
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        size="lg"
        variant="soft"
        disabled={filtersOn(filter) === 0}
        onClick={() => set({ key: '', stage: 'any', favourites: false })}
        className="flex-1"
      >
        {t('clearFilters')}
      </Button>
      <Button size="lg" onClick={onShow} className="flex-1">
        {shown > 0 ? t('filters.show', { count: shown }) : t('filters.showNone')}
      </Button>
    </div>
  )
}
