import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { BackButton, RowButton, Sheet, SheetContent, SettingsGroup } from '@/shared/ui'
import { SetupTrigger } from './SetupTrigger'
import { useSettingsExtras } from './setup-extras'

/** A page the screen's own Settings open inside the sheet: its title and what it shows. */
export interface InnerPage {
  readonly title: string
  readonly content: ReactNode
}

/**
 * The Player's one Settings (R29, Flat's one menu): its gear and the sheet it opens. The first page
 * is `children`, the music's own choices, then the pages of how the Player works and the acts on
 * this music the screen provides (`SettingsExtrasContext`). The screen's own inner pages
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
  const extra = pages.find((each) => each.id === page)
  const title =
    page === 'main'
      ? t('settingsPage.open')
      : (extra?.label ?? inner?.title ?? t('settingsPage.open'))
  return (
    <Sheet
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
            {pages.length > 0 ? (
              <SettingsGroup flush title={t('settingsPage.howItWorks')}>
                {pages.map(({ id, label, icon }) => (
                  <RowButton
                    key={id}
                    title={label}
                    icon={icon}
                    paint="sky"
                    onClick={() => onPage(id)}
                  />
                ))}
              </SettingsGroup>
            ) : null}
            {acts.length > 0 ? (
              <SettingsGroup flush title={t('settingsPage.thisMusic')}>
                {acts.map(({ key, label, icon, disabled, reason, onSelect }) => (
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
                ))}
              </SettingsGroup>
            ) : null}
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
