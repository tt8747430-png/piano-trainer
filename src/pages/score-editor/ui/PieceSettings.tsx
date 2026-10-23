import { SlidersHorizontal } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { PIECE_TEMPO } from '@/entities/piece'
import { keyFromParam, keyParam } from '@/shared/lib/music'
import { metersFor } from '@/features/score-editor'
import {
  KeyChoice,
  Labelled,
  MenuSection,
  Segmented,
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Slider, SliderLabel } from '@/shared/ui/primitives/slider'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { TEMPO_WORDS } from '../model/song-sheet'
import { SongTitleField } from './SongTitleField'

/**
 * The tempo, moved freely and saved when let go, or set at once by a tempo word under it (Largo …
 * Presto, as a metronome marks them): it starts from the piece's each time the sheet opens.
 */
function SongTempo() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const saved = useEditorState((state) => state.draft.tempo)
  const [tempo, setTempo] = useState(saved)
  const save = (next: number) => actions.dispatch({ type: 'settings', tempo: next })
  return (
    <div className="flex flex-col gap-3">
      <Slider
        min={PIECE_TEMPO.min}
        max={PIECE_TEMPO.max}
        step={1}
        value={tempo}
        onValueChange={setTempo}
        onValueCommitted={save}
        className="flex flex-col gap-3"
      >
        <div className="flex justify-between">
          <SliderLabel>{t('song.tempo')}</SliderLabel>
          <span className="font-semibold tabular-nums">{t('song.bpm', { tempo })}</span>
        </div>
      </Slider>
      <div role="group" aria-label={t('song.tempoWords')} className="grid grid-cols-3 gap-1.5">
        {TEMPO_WORDS.map(([word, bpm]) => {
          const name = t(`song.tempos.${word}`)
          const label = t('song.tempoLabel', { word: name, bpm })
          return (
            <Button
              key={word}
              variant="outline"
              aria-label={label}
              title={label}
              aria-pressed={tempo === bpm}
              className="h-auto min-h-11 min-w-0 flex-col gap-0 px-1 py-1 aria-pressed:border-selected aria-pressed:bg-selected/10"
              onClick={() => {
                setTempo(bpm)
                save(bpm)
              }}
            >
              <span className="w-full truncate font-serif text-sm">{name}</span>
              <span className="text-xs font-normal text-muted-foreground tabular-nums">
                <span className="font-music">♩</span> = {bpm}
              </span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

/** One part of the sheet, under its heading; the first, the song's own, under the sheet's title alone. */
function Part({
  title,
  plain = false,
  children,
}: {
  title: string
  plain?: boolean
  children: ReactNode
}) {
  return plain ? (
    <section aria-label={title} className="flex flex-col gap-4">
      {children}
    </section>
  ) : (
    // The menus' one heading (ADR 0085), as the View's and the Setup's groups wear it.
    <MenuSection title={title} className="gap-4">
      {children}
    </MenuSection>
  )
}

/**
 * The Song sheet behind the bar's button (spec §6.4, ADR 0080, 0091): the song as a whole, each of its
 * settings here alone: an own song's title, the key, the time signature of its kind, the tempo with
 * its words. How the score is shown is the View's; the MIDI keyboard is the bar's, as in the Player
 * (ADR 0085). Opened from the bar, or from the sheet's clef, key and time signature.
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
            aria-label={t('song.label')}
            title={t('song.label')}
            disabled={takes.stage !== 'idle'}
          />
        }
      >
        {/* The Player's Setup wears the same sliders: the song's own settings, in either screen. */}
        <SlidersHorizontal aria-hidden />
        <span className="max-lg:sr-only">{t('song.label')}</span>
      </SheetTrigger>
      <SheetContent title={t('song.label')}>
        <div className="flex flex-col gap-8">
          <Part title={t('song.label')} plain>
            {meta.kind === 'song' ? <SongTitleField /> : null}
            <KeyChoice
              value={keyParam(key)}
              onChange={(key) => actions.dispatch({ type: 'settings', key: keyFromParam(key) })}
            />
            <Labelled label={t('song.meter')}>
              <Segmented
                label={t('song.meter')}
                value={meter}
                options={metersFor(meter).map((each) => ({ value: each, label: each }))}
                onChange={(next) => actions.dispatch({ type: 'settings', meter: next })}
              />
            </Labelled>
            <SongTempo />
          </Part>
        </div>
      </SheetContent>
    </Sheet>
  )
}
