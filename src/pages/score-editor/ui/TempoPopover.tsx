import { Minus, Plus } from 'lucide-react'
import { useState, type ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { PIECE_TEMPO } from '@/entities/piece'
import { tempoNote } from '@/shared/lib/music'
import { Button } from '@/shared/ui/primitives/button'
import { Input } from '@/shared/ui/primitives/input'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { TEMPO_WORDS } from '../model/tempo-words'
import { SignPopover } from './SignPopover'

/**
 * The song's beats a minute: a beat less or more, or typed, saved as Enter is pressed or the field
 * is left (kept within the tempos a piece is written at).
 */
function TempoField() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const tempo = useEditorState((state) => state.draft.tempo)
  const set = (bpm: number) => actions.dispatch({ type: 'settings', tempo: bpm })
  // What the field holds, the song's tempo again whenever it changes.
  const [typed, setTyped] = useState({ tempo, text: String(tempo) })
  if (typed.tempo !== tempo) setTyped({ tempo, text: String(tempo) })
  const save = () => {
    const bpm = Number(typed.text)
    if (typed.text.trim() !== '' && Number.isFinite(bpm)) set(bpm)
    else setTyped({ tempo, text: String(tempo) })
  }
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        aria-label={t('printed.slower')}
        title={t('printed.slower')}
        disabled={tempo <= PIECE_TEMPO.min}
        onClick={() => set(tempo - 1)}
      >
        <Minus aria-hidden />
      </Button>
      <Input
        type="number"
        inputMode="numeric"
        aria-label={t('printed.bpm')}
        min={PIECE_TEMPO.min}
        max={PIECE_TEMPO.max}
        value={typed.text}
        onChange={(event) => setTyped({ tempo, text: event.target.value })}
        onBlur={save}
        onKeyDown={(event) => {
          if (event.key === 'Enter') save()
        }}
        className="flex-1 text-center text-lg font-semibold tabular-nums md:text-lg"
      />
      <Button
        variant="outline"
        size="icon"
        aria-label={t('printed.faster')}
        title={t('printed.faster')}
        disabled={tempo >= PIECE_TEMPO.max}
        onClick={() => set(tempo + 1)}
      >
        <Plus aria-hidden />
      </Button>
    </div>
  )
}

/** The tempo words a metronome marks, Largo to Presto, each setting its beats a minute at once. */
function TempoWords() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const tempo = useEditorState((state) => state.draft.tempo)
  const note = useEditorState((state) => tempoNote(state.draft.meter))
  return (
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
            onClick={() => actions.dispatch({ type: 'settings', tempo: bpm })}
          >
            <span className="w-full truncate font-serif text-sm">{name}</span>
            <span className="text-xs font-normal text-muted-foreground tabular-nums">
              <span className="font-music">{note}</span> = {bpm}
            </span>
          </Button>
        )
      })}
    </div>
  )
}

/**
 * The tempo mark's popover (ADR 0094), opened where the mark is printed: the beats a minute with − and
 * +, typed, or a tempo word Largo to Presto; the song's own tempo, saved with its music.
 */
export function TempoPopover({ trigger }: { trigger: ReactElement }) {
  const { t } = useTranslation('editor')
  return (
    <SignPopover label={t('song.tempo')} trigger={trigger}>
      <TempoField />
      <TempoWords />
    </SignPopover>
  )
}
