import { SlidersHorizontal } from 'lucide-react'
import { useRef } from 'react'
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

/**
 * The rail's settings button: the keyboard settings in a popover beside the keyboard, never over
 * it, so the keys show each change as it is made; it scrolls within the room it has.
 */
export function KeyboardSettingsButton() {
  const { t } = useTranslation('common')
  const trigger = useRef<HTMLButtonElement>(null)
  return (
    <Popover>
      <PopoverTrigger
        render={<RailButton ref={trigger} label={t('rail.settings')} icon={SlidersHorizontal} />}
      />
      <PopoverContent
        side="top"
        align="end"
        anchor={() => trigger.current?.closest('[data-slot="keys-scroller"]') ?? null}
        className="max-h-(--available-height) w-80 overflow-y-auto p-4"
      >
        <PopoverHeader>
          <PopoverTitle>{t('rail.settings')}</PopoverTitle>
        </PopoverHeader>
        <KeyboardSettingsFields />
      </PopoverContent>
    </Popover>
  )
}
