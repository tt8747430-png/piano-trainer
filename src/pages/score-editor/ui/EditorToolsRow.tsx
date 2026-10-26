import { ArrowUpDown, ChevronDown, Eye } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useFoldKeys } from '@/features/live-keyboard'
import { keySymbol, printedSymbol } from '@/shared/lib/music'
import { useKeyName } from '@/shared/i18n'
import { PlayerTool, PlayerTools } from '@/widgets/practice-player'
import {
  KeysSwitch,
  PRINTED_PARTS,
  ScoreViewMenu,
  SheetViewFields,
} from '@/widgets/score-view-menu'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { useStaffHeads } from '../model/use-staff-heads'
import { EditCommands } from './EditCommands'
import { TransposeSheet } from './TransposeSheet'

/**
 * The View, the tools row's first as the Player's is (ADR 0102, 0110): named Sheet music, the score
 * being all the editor shows, its icon alone on a phone held upright, where the edit row's commands
 * share the row; its menu the sheet music's part of the View, then the keys' fold.
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
          brief
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
        <KeysSwitch shown={!keys.folded} onShow={(on) => keys.fold(!on)} />
      </SheetViewFields>
    </ScoreViewMenu>
  )
}

/** Transpose, after the View as the Player's is (ADR 0104, 0110): the song's key, its sheet. */
function EditorTranspose({ disabled }: { disabled: boolean }) {
  const { t } = useTranslation('editor')
  const keyName = useKeyName()
  const key = useEditorState((state) => state.draft.key)
  const [open, setOpen] = useState(false)
  return (
    <>
      <PlayerTool
        icon={ArrowUpDown}
        label={t('transpose.of', { key: keyName(key) })}
        name={t('transpose.name')}
        value={<span className="font-display">{printedSymbol(keySymbol(key))}</span>}
        brief
        disabled={disabled}
        onClick={() => setOpen(true)}
      />
      <TransposeSheet open={open} onOpenChange={setOpen} />
    </>
  )
}

/**
 * The editor's tools row (ADR 0110), the Player's in its place and height, so the sheet stands still
 * as Practise · Edit switches: the View, Transpose, then the edit row's commands (Delete, Copy, Cut,
 * Paste). While a take records, it waits for Stop.
 */
export function EditorToolsRow() {
  const { t } = useTranslation('editor')
  const { takes } = useScoreEditorContext()
  const recording = takes.stage !== 'idle'
  return (
    <PlayerTools label={t('tools')}>
      <EditorView disabled={recording} />
      <EditorTranspose disabled={recording} />
      <EditCommands />
    </PlayerTools>
  )
}
