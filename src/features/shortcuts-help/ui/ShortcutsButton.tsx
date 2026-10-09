import { Keyboard } from 'lucide-react'
import { use } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'
import { OpenShortcutsContext } from './open-shortcuts'

/** Opens the shortcuts' sheet: for a screen with a keyboard, so a finger's screen does not see it. */
export function ShortcutsButton() {
  const { t } = useTranslation('common')
  const open = use(OpenShortcutsContext)
  return (
    <Button variant="outline" className="self-start pointer-coarse:hidden" onClick={open}>
      <Keyboard data-icon="inline-start" />
      {t('shortcuts.title')}
    </Button>
  )
}
