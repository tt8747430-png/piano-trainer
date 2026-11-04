import { LocateFixed } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'
import type { Follow } from '../model/use-follow'

/**
 * "Back to the playhead" (A37): while a scroll by hand has paused following, a pill at the foot of
 * the view, above the transport, that brings the music playing back into sight.
 */
export function BackToPlayhead({ follow }: { follow: Follow }) {
  const { t } = useTranslation('player')
  if (!follow.paused) return null
  return (
    <div className="pointer-events-none sticky bottom-[calc(var(--float-room,0px)+0.5rem)] z-10 flex justify-center">
      <Button
        variant="secondary"
        className="pointer-events-auto rounded-pill elevation-2"
        onClick={follow.resume}
      >
        <LocateFixed data-icon="inline-start" />
        {t('views.backToPlayhead')}
      </Button>
    </div>
  )
}
