import { Delete, Piano, Play, Square } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useFoldKeys } from '@/features/live-keyboard'
import { cn } from '@/shared/lib'
import { Button } from '@/shared/ui/primitives/button'
import { useLayerName } from '@/widgets/score-sheet'
import { caretSaid } from '../model/caret-said'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { useStaffHeads } from '../model/use-staff-heads'
import { useValueWord } from './use-value-word'

/** The strip's round buttons, 44 across. */
const ROUND = 'size-11 shrink-0 rounded-pill [&_svg:not([class*=size-])]:size-5'

/**
 * The palette's head (its canvas, the selection strip): what the caret is on, large ("C5 · half
 * note"), over where it is ("Bar 4 · beat 1 · Melody"); then what acts on it: Delete (the notes
 * chosen, else the ones before the caret, as Backspace), Piano keys (filled while shown) and Play
 * from here, the screen's one honey control, Stop while it sounds. While a take records, the acts
 * wait for Stop.
 */
export function SelectionStrip({ className }: { className?: string }) {
  const { t } = useTranslation('editor')
  const { actions, meta, takes } = useScoreEditorContext()
  const draft = useEditorState((state) => state.draft)
  const caret = useEditorState((state) => state.caret)
  const layer = useEditorState((state) => state.layer)
  const chordNote = useEditorState((state) => state.chordNote)
  const grace = useEditorState((state) => state.grace)
  const chords = layer === 'chords'
  const said = caretSaid({ draft, caret, layer, chordNote, grace })
  const valueWord = useValueWord()
  const layerName = useLayerName(useStaffHeads())
  const keys = useFoldKeys()
  const recording = takes.stage !== 'idle'
  const what =
    said.kind === 'end'
      ? t('strip.end')
      : said.kind === 'notes'
        ? said.value
          ? t('strip.notes', { what: said.what, value: valueWord(said.value) })
          : t('strip.at', { what: said.what })
        : said.kind === 'noChord' || said.kind === 'rest'
          ? t(`strip.${said.kind}`)
          : t(`strip.${said.kind}`, { what: said.what })
  const where =
    said.kind === 'end'
      ? null
      : t('strip.where', { bar: said.bar, beat: said.beat, part: layerName(layer) })
  const play = meta.playing ? t('stop') : t('strip.playFrom')
  const keysLabel = t('strip.keys')
  return (
    <div
      role="group"
      aria-label={t('strip.label')}
      className={cn('flex min-h-15 shrink-0 items-center gap-1', className)}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate text-base leading-tight font-semibold tabular-nums">{what}</span>
        {where ? (
          <span className="truncate text-[0.8125rem] leading-tight text-muted-foreground tabular-nums">
            {where}
          </span>
        ) : null}
      </div>
      <Button
        variant="tool"
        size="icon"
        aria-label={t(chords ? 'chord.delete' : 'deleteNotes')}
        title={t(chords ? 'chord.delete' : 'deleteNotes')}
        disabled={recording}
        className={ROUND}
        onClick={() => actions.dispatch({ type: 'delete', back: true })}
      >
        <Delete aria-hidden />
      </Button>
      <Button
        variant="tool"
        size="icon"
        aria-label={keysLabel}
        title={keysLabel}
        aria-pressed={!keys.folded}
        className={cn(
          ROUND,
          'aria-pressed:bg-foreground aria-pressed:text-background aria-pressed:hover:bg-foreground/90',
        )}
        onClick={() => keys.fold(!keys.folded)}
      >
        <Piano aria-hidden />
      </Button>
      <Button
        size="icon"
        aria-label={play}
        title={play}
        disabled={recording}
        className={ROUND}
        onClick={actions.togglePlay}
      >
        {meta.playing ? <Square aria-hidden className="fill-current" /> : <Play aria-hidden />}
      </Button>
    </div>
  )
}
