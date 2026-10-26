import { Piano } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SwitchRow } from '@/shared/ui'

/**
 * The keys under the music, out or put away so the music has the screen (ADR 0064, 0085): each
 * screen's own, the Player's saved in the View for every view, the editor's its keys' fold.
 */
export function KeysSwitch({
  shown,
  onShow,
}: {
  shown: boolean
  onShow: (shown: boolean) => void
}) {
  const { t } = useTranslation('music')
  return (
    <SwitchRow icon={<Piano />} label={t('view.keys')} checked={shown} onCheckedChange={onShow} />
  )
}
