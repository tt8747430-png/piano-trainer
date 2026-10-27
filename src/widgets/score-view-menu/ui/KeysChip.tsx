import { Piano } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PartChip } from './PartChip'

/**
 * The keys under the music, out or put away so the music has the screen (ADR 0064, 0085), a chip as
 * the View's other parts are (ADR 0115): each screen's own, the Player's saved in the View for every
 * view, the editor's its keys' fold.
 */
export function KeysChip({ shown, onShow }: { shown: boolean; onShow: (shown: boolean) => void }) {
  const { t } = useTranslation('music')
  return (
    <PartChip icon={<Piano />} label={t('view.keys')} pressed={shown} onPressedChange={onShow} />
  )
}
