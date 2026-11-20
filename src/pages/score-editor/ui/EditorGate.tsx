import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useUp } from '@/shared/lib'
import { Button } from '@/shared/ui/primitives/button'

/**
 * Why the editor is not open yet (opening, offline, failed), as the EditorDraft boards' gates draw it:
 * the editor's Close in its bar, so there is always a way out, and the reason centred on the screen.
 */
export function EditorGate({ children }: { children: ReactNode }) {
  const { t } = useTranslation('common')
  const up = useUp()
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex h-15 shrink-0 items-center px-4 py-2 lg:px-6 lg:py-3">
        <Button variant="bar" size="icon" aria-label={t('close')} title={t('close')} onClick={up}>
          <X aria-hidden />
        </Button>
      </header>
      <main className="flex flex-1 flex-col justify-center pb-15">{children}</main>
    </div>
  )
}
