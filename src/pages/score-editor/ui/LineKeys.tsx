import { useTranslation } from 'react-i18next'
import { lineDrawn, type Line } from '@/features/score-editor'
import { ToolKey } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { GlyphGrid } from './palette-keys'
import { LineIcon } from './palette-icons'
import { usePaletteReason } from './palette-reason'

/**
 * A line's key (ADR 0080): drawn in one go over the notes chosen, else from the note at the caret to
 * its bar's end; pressed where it is drawn there already (tapped again, taken away); greyed where no
 * note starts.
 */
function LineKey({ line }: { line: Line }) {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const drawn = useEditorState((state) => lineDrawn(state, line))
  return (
    <ToolKey
      label={t(`lines.${line}`)}
      reason={usePaletteReason()}
      pressed={drawn === true}
      disabled={drawn === null}
      onClick={() => actions.dispatch({ type: 'line', line })}
    >
      <span aria-hidden className="size-7">
        <LineIcon line={line} />
      </span>
    </ToolKey>
  )
}

/** The lines' keys, in the order given: the slur and octave lines, or the hairpins. */
export function LineKeys({ lines }: { lines: readonly Line[] }) {
  return (
    <GlyphGrid>
      {lines.map((line) => (
        <LineKey key={line} line={line} />
      ))}
    </GlyphGrid>
  )
}
