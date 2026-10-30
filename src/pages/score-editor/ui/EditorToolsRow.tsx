import { ChevronDown, Eye } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useFoldKeys } from '@/features/live-keyboard'
import { PlayerTool, PlayerTools } from '@/widgets/practice-player'
import { KeysChip, PRINTED_PARTS, ScoreViewMenu, SheetViewFields } from '@/widgets/score-view-menu'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { useStaffHeads } from '../model/use-staff-heads'
import { EditorTranspose } from './EditorTranspose'

/**
 * The View, the tools row's first as the Player's is (ADR 0108, 0115): named Sheet music, the score
 * being all the editor shows; its menu the sheet music's part of the View, then the keys' fold.
 */
function EditorView({ disabled }: { disabled: boolean }) {
  const { t } = useTranslation(['player', 'music'])
  const keys = useFoldKeys()
  const staves = useStaffHeads()
  const piano = useEditorState((state) => !state.draft.leadSheet)
  return (
    <ScoreViewMenu
      trigger={
        <PlayerTool
          icon={Eye}
          label={t('music:view.label')}
          name={t('views.sheet')}
          disabled={disabled}
        >
          <ChevronDown
            aria-hidden
            className="text-muted-foreground transition-transform duration-200 ease-out group-data-popup-open/button:rotate-180"
          />
        </PlayerTool>
      }
      from="tools"
    >
      <SheetViewFields staves={staves} piano={piano} parts={PRINTED_PARTS}>
        <KeysChip shown={!keys.folded} onShow={(on) => keys.fold(!on)} />
      </SheetViewFields>
    </ScoreViewMenu>
  )
}

/**
 * The editor's tools (ADR 0115), the Player's in their place, so the sheet stands still as Practise ·
 * Edit switches: the View and Transpose, what is shown and in which key. What is done to the notes
 * chosen floats by them (`SelectionActions`). While a take records, they wait for Stop.
 */
export function EditorToolsRow() {
  const { t } = useTranslation('editor')
  const { takes } = useScoreEditorContext()
  const recording = takes.stage !== 'idle'
  return (
    <PlayerTools label={t('tools')}>
      <EditorView disabled={recording} />
      <EditorTranspose disabled={recording} />
    </PlayerTools>
  )
}
