import { useTranslation } from 'react-i18next'
import { lineDrawn, type Line } from '@/features/score-editor'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { isTool } from '../model/shortcuts'
import { PaletteKey } from './palette-keys'
import { LineIcon } from './palette-icons'
import { usePaletteReason } from './palette-reason'

/**
 * A line's key (ADR 0114): drawn in one go over the notes chosen, else from the note at the caret to
 * its bar's end; pressed where it is drawn there already (tapped again, taken away); greyed where no
 * note starts. Each line's shortcut is Flat's (`TOOL_SHORTCUTS`), named in its tooltip.
 */
function LineKey({ line }: { line: Line }) {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const drawn = useEditorState((state) => lineDrawn(state, line))
  return (
    <PaletteKey
      label={t(`lines.${line}`)}
      tool={isTool(line) ? line : undefined}
      reason={usePaletteReason()}
      pressed={drawn === true}
      disabled={drawn === null}
      onClick={() => actions.dispatch({ type: 'line', line })}
    >
      <span aria-hidden className="size-7">
        <LineIcon line={line} />
      </span>
    </PaletteKey>
  )
}

/** The lines' keys, in the order given: the slur, the octave lines, or the hairpins. */
export function LineKeys({ lines }: { lines: readonly Line[] }) {
  return lines.map((line) => <LineKey key={line} line={line} />)
}
