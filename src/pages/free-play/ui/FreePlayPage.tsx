import { useSearch } from '@tanstack/react-router'
import { Eraser } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { useViewChange } from '@/shared/lib'
import { midi } from '@/shared/lib/music'
import { BackButton, KeyChoice, Labelled, NO_KEYS, ScreenHeader, Segmented } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { LiveScore } from '@/widgets/live-score'
import { FREE_PLAY_MODES, type FreePlayView } from '../model/free-play-view'
import { useFreePlay } from '../model/use-free-play'

/** The keyboard at its widest: C2–C7. */
const WIDEST = { from: midi(36), to: midi(96) }

/**
 * Free play (spec 2026-10-09 §5): the piano played freely, the keyboard at its widest and the live
 * score over it, each chord played written and named; Clear starts again.
 */
export function FreePlayPage() {
  const { t } = useTranslation('practice')
  const view = useSearch({ from: '/shell/practice/free-play' })
  const change = useViewChange<FreePlayView>()
  const free = useFreePlay()
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('freePlay.title')}
        back={<BackButton fallback={{ to: '/practice' }} />}
      />
      <ExplorerKeyboard shown={NO_KEYS} range={WIDEST} onKeyPress={free.play} />
      <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
        <Labelled label={t('freePlay.mode')}>
          <Segmented
            label={t('freePlay.mode')}
            value={view.mode}
            options={FREE_PLAY_MODES.map((mode) => ({ value: mode, label: t(`freePlay.${mode}`) }))}
            onChange={(mode) => change({ mode })}
          />
        </Labelled>
        <KeyChoice value={view.key} onChange={(key) => change({ key })} />
        <Button variant="outline" onClick={free.clear}>
          <Eraser data-icon="inline-start" />
          {t('freePlay.clear')}
        </Button>
      </div>
      <LiveScore chords={free.chords} keyParam={view.key} />
    </div>
  )
}
