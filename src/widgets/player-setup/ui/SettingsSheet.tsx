import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { LAPTOP, useMediaQuery } from '@/shared/lib'
import { BackButton, RowButton, Sheet, SheetContent, SettingsGroup } from '@/shared/ui'
import { SetupTrigger } from './SetupTrigger'
import { useSettingsExtras, type SettingsAct } from './setup-extras'

/** A page the screen's own Settings open inside the sheet: its title and what it shows. */
export interface InnerPage {
  readonly title: string
  readonly content: ReactNode
}

/**
 * The Player's one Settings (R29, Flat's one menu): its gear and the sheet it opens. The first page
 * is `children`, the music's own choices, then the pages of how the Player works and the acts on
 * this music the screen provides (`SettingsExtrasContext`). On a laptop it is a panel at the right. The screen's own inner pages
 * (`inner`, by the page `page` names) open in the same sheet, so a sheet never opens over a sheet.
 */
export function SettingsSheet({
  page,
  onPage,
  inner,
  children,
}: {
  /** The page open: 'main', an extras page's id, or one of the screen's own. */
  page: string
  onPage: (page: string) => void
  /** The screen's own page open, when `page` is one of its own. */
  inner?: InnerPage | null | undefined
  children: ReactNode
}) {
  const { t } = useTranslation('player')
  const { pages, acts } = useSettingsExtras()
  const [open, setOpen] = useState(false)
  // On a laptop a panel at the right, the music in sight beside it (R29, screen 4.1).
  const laptop = useMediaQuery(LAPTOP)
  const extra = pages.find((each) => each.id === page)
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
            {pages.length > 0 || actsIn('play').length > 0 ? (
              <SettingsGroup flush title={t('settingsPage.whilePlaying')}>
                {pages.map(({ id, label, icon }) => (
                  <RowButton
                    key={id}
                    title={label}
                    icon={icon}
                    paint="sky"
                    onClick={() => onPage(id)}
                  />
                ))}
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
