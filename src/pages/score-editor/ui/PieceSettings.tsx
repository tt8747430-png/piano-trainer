import { Settings } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { PIECE_TEMPO } from '@/entities/piece'
import { MidiButton } from '@/features/connect-midi'
import { keyFromParam, keyParam } from '@/shared/lib/music'
import { metersFor } from '@/features/score-editor'
import {
  KeyChoice,
  Labelled,
  Segmented,
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetLayoutField,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Slider, SliderLabel } from '@/shared/ui/primitives/slider'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { StaffList } from './StaffList'
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

/** One part of the settings, under its heading. */
function Part({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
      {children}
    </section>
  )
}

/**
 * The editor's settings, one sheet behind the gear (spec §6.4, ADR 0065): the song (an own song's
 * title, the key, the tempo, the meter of its kind); what the score shows and how (the tune's staff,
 * the layout down the screen, on A4 pages or as one line, ADR 0064); the staves, each shown or hidden
 * and a part removed, with what it is played on (ADR 0070, 0072); and the MIDI keyboard. Opened from the bar, or from the sheet's clef, key and time signature.
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
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label={t('settings')}
            title={t('settings')}
            disabled={takes.stage !== 'idle'}
          />
        }
      >
        <Settings aria-hidden />
      </SheetTrigger>
      <SheetContent title={t('settings')}>
        <div className="flex flex-col gap-8">
          <Part title={t('song.label')}>
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
          </Part>
          <Part title={t('viewMenu.label')}>
            <SheetLayoutField value={view.layout} onChange={view.setLayout} />
          </Part>
          <Part title={t('staves.label')}>
            <StaffList />
          </Part>
          <Part title={t('viewMenu.midi')}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground">{t('viewMenu.midiDetail')}</span>
              <MidiButton />
            </div>
          </Part>
        </div>
      </SheetContent>
    </Sheet>
  )
}
