import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'

/**
 * A notice floating over the screen, as the app says a save went wrong (an alert), as the AppLayers
 * board's Storage full: a crimson wash, its line in 16 bold, a detail in 14 under it where it needs
 * one, then Close and the actions it offers at its foot, in its deep ink.
 */
export function Notice({
  line,
  detail,
  onClose,
  children,
}: {
  line: string
  detail?: string
  onClose: () => void
  /** What it offers after Close: a way to put it right. */
  children?: ReactNode
}) {
  const { t } = useTranslation('common')
  return (
    <div
      role="alert"
      className="pointer-events-auto flex flex-col gap-1.5 rounded-2xl bg-alert pt-3.5 pe-3.5 pb-2.5 ps-4 text-alert-foreground shadow-(--elevation-3)"
    >
      <p className="font-bold text-pretty">{line}</p>
      {detail === undefined ? null : <p className="text-sm/[1.4] text-pretty">{detail}</p>}
      <div className="flex justify-end gap-1 *:h-11 *:text-[0.9375rem]">
        <Button
          variant="ghost"
          aria-label={t('notice.close')}
          className="px-3 font-normal text-alert-foreground hover:bg-alert-foreground/10 hover:text-alert-foreground"
          onClick={onClose}
        >
          {t('close')}
        </Button>
        {children}
      </div>
    </div>
  )
}
