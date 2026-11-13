import { useTranslation } from 'react-i18next'
import type { Hands } from '@/shared/lib/schedule'
import { FloatingBarButton, HandsPicture } from '@/shared/ui'
import { DOCK_CAPTIONED } from './dock-sizes'

/** The transport's Hands (its canvas): the hands that play, drawn; it opens the Hands sheet. */
export function HandsButton({ hands, onOpen }: { hands: Hands; onOpen: () => void }) {
  const { t } = useTranslation(['player', 'common'])
  const short = t(`common:handsShort.${hands}`)
  const name = t('handsOf', { hands: short })
  return (
    <FloatingBarButton
      label={name}
      title={name}
      aria-haspopup="dialog"
      caption={short}
      className={DOCK_CAPTIONED}
      onClick={onOpen}
    >
      <HandsPicture hands={hands} />
    </FloatingBarButton>
  )
}
