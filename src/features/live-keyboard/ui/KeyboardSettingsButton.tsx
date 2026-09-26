import { SlidersHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { RailButton } from '@/shared/ui'
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/shared/ui/primitives/popover'
import { KeyboardSettingsFields } from './KeyboardSettingsFields'

/** The rail's settings button: the keyboard settings in a popover, over the keys being played. */
export function KeyboardSettingsButton() {
  const { t } = useTranslation('common')
  return (
    <Popover>
      <PopoverTrigger render={<RailButton label={t('rail.settings')} icon={SlidersHorizontal} />} />
      <PopoverContent className="w-80 p-4">
        <PopoverHeader>
          <PopoverTitle>{t('rail.settings')}</PopoverTitle>
        </PopoverHeader>
        <KeyboardSettingsFields />
      </PopoverContent>
    </Popover>
  )
}
