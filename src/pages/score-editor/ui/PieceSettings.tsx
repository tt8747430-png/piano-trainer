import { Settings } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PIECE_TEMPO } from '@/entities/piece'
import { keyFromParam, keyParam } from '@/shared/lib/music'
import { metersFor } from '@/features/score-editor'
import { KeyChoice, Labelled, Segmented, Sheet, SheetContent, SheetTrigger } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Slider, SliderLabel } from '@/shared/ui/primitives/slider'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { SongTitleField } from './SongTitleField'

/** The tempo, moved freely and saved when let go: it starts from the piece's each time the sheet opens. */
function SongTempo() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const saved = useEditorState((state) => state.draft.tempo)
  const [tempo, setTempo] = useState(saved)
  return (
    <Slider
      min={PIECE_TEMPO.min}
      max={PIECE_TEMPO.max}
      step={1}
      value={tempo}
      onValueChange={setTempo}
      onValueCommitted={(committed) => actions.dispatch({ type: 'settings', tempo: committed })}
      className="flex flex-col gap-3"
    >
      <div className="flex justify-between">
        <SliderLabel>{t('song.tempo')}</SliderLabel>
        <span className="font-semibold tabular-nums">{t('song.bpm', { tempo })}</span>
      </div>
    </Slider>
  )
}

/**
 * The piece's settings (spec §6.4): an own song's title, the key, the tempo and the meter (of its kind). Opened from
 * the toolbar, or from the sheet's clef, key and time signature.
 */
export function PieceSettings() {
  const { t } = useTranslation('editor')
  const { actions, meta, takes, view } = useScoreEditorContext()
  const key = useEditorState((state) => state.draft.key)
  const meter = useEditorState((state) => state.draft.meter)
  return (
    <Sheet open={view.settingsOpen} onOpenChange={view.openSettings}>
      <SheetTrigger
        render={
          <Button
            variant="surface"
            size="icon"
            className="lg:w-auto lg:gap-2 lg:px-4"
            disabled={takes.stage !== 'idle'}
          />
        }
      >
        <Settings aria-hidden />
        {/* Named on a laptop's toolbar, where there is room; its icon alone on a phone. */}
        <span className="max-lg:sr-only">{t('settings')}</span>
      </SheetTrigger>
      <SheetContent title={t('settings')}>
        <div className="flex flex-col gap-6">
          {meta.kind === 'song' ? <SongTitleField /> : null}
          <KeyChoice
            value={keyParam(key)}
            onChange={(key) => actions.dispatch({ type: 'settings', key: keyFromParam(key) })}
          />
          <SongTempo />
          <Labelled label={t('song.meter')}>
            <Segmented
              label={t('song.meter')}
              value={meter}
              options={metersFor(meter).map((each) => ({ value: each, label: each }))}
              onChange={(next) => actions.dispatch({ type: 'settings', meter: next })}
            />
          </Labelled>
        </div>
      </SheetContent>
    </Sheet>
  )
}
