import { ChevronDown, Eye } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PlayerTool, PlayerTools } from '@/widgets/practice-player'
import { PRINTED_PARTS, ScoreViewMenu, SheetViewFields } from '@/widgets/score-view-menu'
import { useScoreEditorContext } from '../model/editor-context'
import { EditorTranspose } from './EditorTranspose'

/**
 * The View, the tools row's first as the Player's is (ADR 0108, 0115): named Sheet music, the score
 * being all the editor shows; its menu the sheet music's part of the View; the keys are the bar's Piano keys.
 */
function EditorView({ disabled }: { disabled: boolean }) {
  const { t } = useTranslation(['player', 'music'])
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
      <SheetViewFields parts={PRINTED_PARTS} />
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
