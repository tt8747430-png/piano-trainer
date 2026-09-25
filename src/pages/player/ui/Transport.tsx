import { ChevronLeft, Play, RotateCcw, SkipForward, Square, Volume2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Practice } from '@/features/practice'
import { RoundButton } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/** The primary action, by mode: Play or Stop; Back, Next and Next bar; or Hear these notes. */
export function Transport({ practice, onHear }: { practice: Practice; onHear: () => void }) {
  const { t } = useTranslation('player')
  const { mode, playing } = practice.state
  return (
    <div className="flex items-center justify-center gap-4 pb-2">
      {mode === 'listen' ? (
        <>
          <RoundButton label={t('restart')} icon={RotateCcw} onClick={practice.restart} />
          <Button
            size="play"
            aria-label={playing ? t('stop') : t('play')}
            onClick={playing ? practice.stop : practice.play}
          >
            {playing ? <Square aria-hidden /> : <Play aria-hidden />}
          </Button>
          <span aria-hidden className="size-11" />
        </>
      ) : mode === 'step' ? (
        <>
          <RoundButton label={t('back')} icon={ChevronLeft} onClick={practice.prev} />
          <Button size="pill" className="flex-1" onClick={practice.next}>
            {t('next')}
          </Button>
          <RoundButton label={t('nextBar')} icon={SkipForward} onClick={practice.nextBar} />
        </>
      ) : (
        <>
          <RoundButton label={t('restart')} icon={RotateCcw} onClick={practice.restart} />
          <Button size="pill" variant="soft" className="flex-1" onClick={onHear}>
            <Volume2 data-icon="inline-start" />
            {t('hear')}
          </Button>
        </>
      )}
    </div>
  )
}
