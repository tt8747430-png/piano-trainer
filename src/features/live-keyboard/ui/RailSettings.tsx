import { SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib'
import { RailButton } from '@/shared/ui'
import { KeyboardRailSettings } from './KeyboardRailSettings'

/**
 * The keyboard settings in the rail: in sight from a laptop's width; on a narrower screen behind the
 * settings button, which opens them in the rail itself (scrolling sideways), never over the keys.
 */
export function RailSettings() {
  const { t } = useTranslation('common')
  const [open, setOpen] = useState(false)
  return (
    <>
      <div
        role="group"
        aria-label={t('rail.settings')}
        className={cn(
          'min-w-0 overflow-x-auto overscroll-x-contain scrollbar-none',
          open ? 'flex' : 'flex max-lg:hidden',
        )}
      >
        <KeyboardRailSettings />
      </div>
      <RailButton
        label={t('rail.settings')}
        icon={SlidersHorizontal}
        aria-expanded={open}
        aria-pressed={open}
        onClick={() => setOpen(!open)}
        className="lg:hidden"
      />
    </>
  )
}
