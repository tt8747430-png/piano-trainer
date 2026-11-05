import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { RowLink, SettingRows, Sheet, SheetContent } from '@/shared/ui'
import { PianoEssentialRows } from './KeyboardSettingsFields'

/**
 * The piano's settings in place (R33, musicca's Settings): what matters while playing, over the
 * screen, from the rail's ⚙; the rest on the On-screen piano page, a row away. The rows are the
 * page's own first group, so each preference keeps one control.
 */
export function PianoSettingsSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation('common')
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title={t('pianoSheet.title')}>
        <div className="flex flex-col gap-4">
          <SettingRows>
            <PianoEssentialRows />
          </SettingRows>
          <RowLink
            title={t('pianoSheet.all')}
            render={<Link to="/settings/on-screen-piano" onClick={() => onOpenChange(false)} />}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
