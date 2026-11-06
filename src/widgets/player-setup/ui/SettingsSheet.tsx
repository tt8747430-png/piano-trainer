import { useEffect, useEffectEvent, useState, type ReactElement, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { LAPTOP, useMediaQuery } from '@/shared/lib'
import {
  BackButton,
  RowButton,
  RowLink,
  Sheet,
  SheetContent,
  SettingsGroup,
  type Paint,
} from '@/shared/ui'
import { SetupTrigger } from './SetupTrigger'
import { useSettingsExtras, type SettingsAct, type SettingsRow } from './setup-extras'

/**
 * Where each page's row stands (R32, R36): by what a pianist reaches for most, the score's look
 * first, then how it plays, the hands at the keys, its staves, its accompaniment, the on-screen
 * piano. A page unlisted goes last.
 */
const PAGE_ORDER: readonly string[] = [
  'display',
  'playback',
  'hands',
  'staves',
  'accompaniment',
  'piano',
]
/** Each page's tile, one colour a page; the hands at the keys in the piano's sand. */
const PAGE_PAINT: Readonly<Record<string, Paint>> = {
  display: 'lilac',
  playback: 'grass',
  hands: 'sand',
  staves: 'sky',
  accompaniment: 'yellow',
  piano: 'sand',
}
const rank = (row: SettingsRow) => {
  const at = PAGE_ORDER.indexOf(row.id)
  return at === -1 ? PAGE_ORDER.length : at
}

/** A page the screen's own Settings open inside the sheet: its title and what it shows. */
export interface InnerPage {
  readonly title: string
  readonly content: ReactNode
}

/**
 * The Player's one Settings (R29, Flat's one menu): its gear and the sheet it opens. The first page
 * is `children`, the music's own choices, then one list of its pages (`music`, the screen's own, and
 * how the Player works, `SettingsExtrasContext`), ranked by what a pianist reaches for most, each
 * with a line on what it controls and what it is set to (R32), then the acts on this music. On a laptop it is a panel at the right. The screen's own inner pages
 * (`inner`, by the page `page` names) open in the same sheet, so a sheet never opens over a sheet.
 */
export function SettingsSheet({
  page,
  onPage,
  inner,
  music = [],
  children,
}: {
  /** The page open: 'main', an extras page's id, or one of the screen's own. */
  page: string
  onPage: (page: string) => void
  /** The screen's own page open, when `page` is one of its own. */
  inner?: InnerPage | null | undefined
  /** The music's own pages (a song's Staves and Accompaniment), ranked among the Player's. */
  music?: readonly SettingsRow[]
  children?: ReactNode
}) {
  const { t } = useTranslation('player')
  const { pages, links = [], acts, onPanel } = useSettingsExtras()
  const [open, setOpen] = useState(false)
  // On a laptop a panel at the right, the music in sight beside it (R29, screen 4.1).
  const laptop = useMediaQuery(LAPTOP)
  // Beside the music, the screen makes room for it, so nothing of the screen is under it.
  const panelled = open && laptop
  const tellPanel = useEffectEvent((shown: boolean) => onPanel?.(shown))
  useEffect(() => {
    tellPanel(panelled)
    return () => tellPanel(false)
  }, [panelled])
  const extra = pages.find((each) => each.id === page)
  const rows: readonly (SettingsRow & { readonly render?: ReactElement })[] = [
    ...music,
    ...pages,
    ...links,
  ].sort((a, b) => rank(a) - rank(b))
  const actsIn = (group: SettingsAct['group']) => acts.filter((each) => each.group === group)
  const act = ({ key, label, icon, disabled, reason, onSelect }: SettingsAct) => (
    <RowButton
      key={key}
      title={label}
      icon={icon}
      paint="sand"
      disabled={disabled}
      reason={reason}
      onClick={() => {
        setOpen(false)
        onPage('main')
        onSelect()
      }}
    />
  )
  const title =
    page === 'main'
      ? t('settingsPage.open')
      : (extra?.label ?? inner?.title ?? t('settingsPage.open'))
  return (
    <Sheet
      swipeDirection={laptop ? 'right' : 'down'}
      modal={!laptop}
      // Beside the music, it stays open as the music plays: Close, Escape and the gear close it.
      disablePointerDismissal={laptop}
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) onPage('main')
      }}
    >
      <SetupTrigger />
      <SheetContent title={title}>
        {page === 'main' ? (
          <div className="flex flex-col gap-5">
            {children}
            {rows.length > 0 || actsIn('play').length > 0 ? (
              <SettingsGroup flush>
                {rows.map(({ id, label, icon, description, value, render }) =>
                  // A row to a setting's home elsewhere is a link; the sheet's own pages turn in it.
                  render ? (
                    <RowLink
                      key={id}
                      title={label}
                      detail={description}
                      value={value}
                      icon={icon}
                      paint={PAGE_PAINT[id] ?? 'sky'}
                      render={render}
                    />
                  ) : (
                    <RowButton
                      key={id}
                      title={label}
                      detail={description}
                      value={value}
                      icon={icon}
                      paint={PAGE_PAINT[id] ?? 'sky'}
                      onClick={() => onPage(id)}
                    />
                  ),
                )}
                {actsIn('play').map(act)}
              </SettingsGroup>
            ) : null}
            {(['song', 'share'] as const).map((group) =>
              actsIn(group).length > 0 ? (
                <SettingsGroup key={group} flush title={t(`settingsPage.${group}Group`)}>
                  {actsIn(group).map(act)}
                </SettingsGroup>
              ) : null,
            )}
          </div>
        ) : extra ? (
          <div className="flex flex-col gap-5">
            <BackButton onClick={() => onPage('main')} />
            {extra.content}
          </div>
        ) : (
          inner?.content
        )}
      </SheetContent>
    </Sheet>
  )
}
