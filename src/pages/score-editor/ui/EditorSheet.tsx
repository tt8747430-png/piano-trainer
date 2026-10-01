import { valueTicks } from '@/features/score-editor'
import { TICKS_PER_BEAT } from '@/shared/lib/music'
import { ScoreSheet } from '@/widgets/score-sheet'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { SectionHeading } from './SectionHeading'

/** The sheet the editor writes on: the caret where the next note or chord goes. */
export function EditorSheet() {
  const { actions } = useScoreEditorContext()
  const draft = useEditorState((state) => state.draft)
  const caret = useEditorState((state) => state.caret)
  const layer = useEditorState((state) => state.layer)
  const value = useEditorState((state) => state.value)
  const selection = useEditorState((state) => state.selection)
  return (
    <ScoreSheet
      draft={draft}
      caret={caret}
      layer={layer}
      caretTicks={layer === 'chords' ? TICKS_PER_BEAT : valueTicks(value, draft.meter)}
      selection={
        selection
          ? {
              from: Math.min(selection.anchor, selection.head),
              to: Math.max(selection.anchor, selection.head),
            }
          : null
      }
      onPlace={(tick, to, extend) => actions.dispatch({ type: 'place', tick, layer: to, extend })}
      heading={(section) => <SectionHeading section={section} />}
    />
  )
}
