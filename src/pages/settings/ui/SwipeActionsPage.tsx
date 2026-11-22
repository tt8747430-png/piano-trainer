import { Ban, Folder, Music, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BAR_CATALOG,
  barOf,
  useSettings,
  useSettingsStoreApi,
  type BarAct,
  type BarSurface,
} from '@/entities/settings'
import { setBar } from '@/features/set-preference'
import { cn } from '@/shared/lib'
import { GroupLink, GroupRows, MenuPicker, PAINT, Segmented, SettingsGroup } from '@/shared/ui'
import { BAR_ICONS, BAR_PAINTS } from '@/widgets/bar-editor'
import { SettingsScreen } from '@/widgets/settings-screen'

/** The rows a swipe acts on, each with its two sides. */
const KINDS = {
  songs: { right: 'swipe.songs.leading', left: 'swipe.songs.trailing' },
  folders: { right: 'swipe.folders.leading', left: 'swipe.folders.trailing' },
} as const satisfies Record<string, { right: BarSurface; left: BarSurface }>
type Kind = keyof typeof KINDS

/** A slot's value: an act, or none. */
type Slot = BarAct | 'none'

/** Each slot value's glyph: an act's the toolbar's, No action the ban sign (the board's ACTIC_ALL). */
const SLOT_ICONS: Readonly<Record<Slot, LucideIcon>> = { ...BAR_ICONS, none: Ban }

/** A side's acts with one slot changed: a slot left empty lets the one after it move up. */
const withSlot = (bar: readonly BarAct[], index: 0 | 1, next: Slot): BarAct[] => {
  const slots: (BarAct | undefined)[] = [bar[0], bar[1]]
  slots[index] = next === 'none' ? undefined : next
  return slots.filter((act): act is BarAct => act !== undefined)
}

/** One side of a swipe: its First and Second, each a picker of the side's acts or none. */
function Side({ surface, title, info }: { surface: BarSurface; title: string; info?: string }) {
  const { t } = useTranslation('settings')
  const settings = useSettingsStoreApi()
  const bar = useSettings((state) => barOf(state.bars, surface))
  const name = (slot: Slot) => (slot === 'none' ? t('bars.noAction') : t(`bars.act.${slot}`))
  const glyph = (slot: Slot, className: string) => {
    const Icon = SLOT_ICONS[slot]
    return <Icon aria-hidden className={className} />
  }
  return (
    <SettingsGroup bare title={title} info={info}>
      <GroupRows surface="sheet" label={title}>
        {([0, 1] as const).map((index) => {
          const value: Slot = bar[index] ?? 'none'
          const other = bar[index === 0 ? 1 : 0]
          const label = t(index === 0 ? 'bars.first' : 'bars.second')
          return (
            <MenuPicker<Slot>
              key={index}
              label={`${title}: ${label}`}
              value={value}
              options={[
                { value: 'none' as const, label: name('none'), icon: glyph('none', 'size-5') },
                ...BAR_CATALOG[surface]
                  .filter((act) => act !== other)
                  .map((act) => ({ value: act, label: name(act), icon: glyph(act, 'size-5') })),
              ]}
              onChange={(next) => setBar(settings, surface, withSlot(bar, index, next))}
              trigger={
                <GroupLink
                  label={label}
                  value={name(value)}
                  mark={glyph(value, 'size-4.5 shrink-0')}
                />
              }
            />
          )
        })}
      </GroupRows>
    </SettingsGroup>
  )
}

/**
 * The row as a leading swipe opens it (the board's SWPREVIEW): the first act's tray in its paint at
 * the start, the row slid past it; a song's, or a folder's.
 */
function SwipePreview({ kind }: { kind: Kind }) {
  const { t } = useTranslation('settings')
  const first = useSettings((state) => barOf(state.bars, KINDS[kind].right))[0]
  const Icon = first ? BAR_ICONS[first] : null
  const Tile = kind === 'songs' ? Music : Folder
  const tile = PAINT[kind === 'songs' ? 'sky' : 'yellow']
  return (
    <div
      role="img"
      aria-label={t('bars.preview')}
      className={cn(
        'relative h-16 overflow-hidden rounded-control shadow-[0_0_0_1px_var(--color-border)]',
        first ? PAINT[BAR_PAINTS[first]].tile : 'bg-muted',
      )}
    >
      {first && Icon ? (
        <span className="absolute inset-y-0 start-0 flex w-24 flex-col items-center justify-center gap-1 px-1 text-center text-footnote font-bold text-white">
          <Icon aria-hidden className="size-5" />
          {t(`bars.act.${first}`)}
        </span>
      ) : null}
      <div className="absolute inset-y-0 start-24 -end-24 flex items-center gap-3 bg-card px-4 shadow-[-1px_0_0_var(--color-border)]">
        <span
          className={cn(
            'grid size-10 shrink-0 place-items-center rounded-control',
            tile.fill,
            tile.ink,
          )}
        >
          <Tile aria-hidden className="size-5" />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate font-semibold">
            {t(kind === 'songs' ? 'bars.previewSong' : 'bars.previewFolder')}
          </span>
          <span className="truncate text-footnote text-muted-foreground">
            {t(kind === 'songs' ? 'bars.previewComposer' : 'bars.previewHolds')}
          </span>
        </span>
      </div>
    </div>
  )
}

/**
 * Settings › Library › Swipe actions (the board's P_SWIPE; iOS Mail's Swipe Options): Songs or
 * Folders, the row as its leading swipe opens it, then each side's First and Second, each picked
 * from the side's acts, each with its glyph, or No action (the ban sign). Archive and Delete happen
 * at once with Undo, as the trailing side's ⓘ says.
 */
export function SwipeActionsPage() {
  const { t } = useTranslation('settings')
  const [kind, setKind] = useState<Kind>('songs')
  return (
    <SettingsScreen title={t('pages.swipeActions')}>
      <Segmented
        label={t('pages.swipeActions')}
        value={kind}
        options={[
          { value: 'songs', label: t('bars.songRows') },
          { value: 'folders', label: t('bars.folderRows') },
        ]}
        onChange={setKind}
      />
      <SwipePreview kind={kind} />
      <Side key={`${kind}-right`} surface={KINDS[kind].right} title={t('bars.swipeRight')} />
      <Side
        key={`${kind}-left`}
        surface={KINDS[kind].left}
        title={t('bars.swipeLeft')}
        info={t('bars.swipeInfo')}
      />
    </SettingsScreen>
  )
}
