import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { selectScoreView, useSettings } from '@/entities/settings'
import { firstLine, transpose, type Draft, type TransposeApplies } from '@/features/score-editor'
import { transposedKey } from '@/shared/lib/music'
import { SwitchRow } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { ScoreSheet, type EditPrinted } from '@/widgets/score-sheet'
import { TransposeTool } from '@/widgets/transpose'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/** What a sheet only shown prints as it is: its printed things are no buttons to open. */
const shownAsPrinted: EditPrinted = (_printed, trigger) => trigger
const NO_TITLE = () => null
const NOTHING = () => undefined
const NO_TICKS = () => [] as const
/** The preview's height in CSS px: its line drawn small enough to read whole in the popover. */
const PREVIEW_ROOM = 150

/** The first line moved, only shown: no caret, nothing to click, in one line across. */
function PreviewLine({ draft }: { draft: Draft }) {
  const shown = useSettings(selectScoreView)
  return (
    <div inert className="pointer-events-none">
      <ScoreSheet
        draft={draft}
        caret={null}
        layer="chords"
        selection={null}
        onPlace={NOTHING}
        onReach={NOTHING}
        onDeselect={NOTHING}
        placesOf={NO_TICKS}
        tapsOf={NO_TICKS}
        chordNames={shown.chordNames}
        lyrics={shown.lyrics}
        hidden={shown.hidden}
        edit={shownAsPrinted}
        view="horizontal"
        room={PREVIEW_ROOM}
        title={NO_TITLE}
      />
    </div>
  )
}

/**
 * The editor's Transpose (ADR 0110, 0115): the Player's one Transpose, its trigger the key the song is
 * written in and its control the same − the key it lands in +, how far, and Reset; under it what
 * writing needs: Apply to key and Apply to chords, each its ⓘ, the first line moved as a preview, and
 * Transpose, which writes the song so in one edit Undo takes back. Opened afresh each time, from the
 * song's key with both applied; closed, it changes nothing. While a take records it waits for Stop.
 */
export function EditorTranspose({ disabled }: { disabled: boolean }) {
  const { t } = useTranslation(['editor', 'player'])
  const { actions } = useScoreEditorContext()
  const draft = useEditorState((state) => state.draft)
  const [open, setOpen] = useState(false)
  const [semitones, setSemitones] = useState(0)
  const [applies, setApplies] = useState<TransposeApplies>({ key: true, chords: true })
  const moved = useMemo(
    () => (open ? transpose(draft, semitones, applies) : draft),
    [open, draft, semitones, applies],
  )
  const line = useMemo(() => firstLine(moved), [moved])
  const change = (opened: boolean) => {
    if (opened) {
      setSemitones(0)
      setApplies({ key: true, chords: true })
    }
    setOpen(opened)
  }
  const apply = () => {
    actions.dispatch({ type: 'transpose', semitones, applies })
    setOpen(false)
  }
  return (
    <TransposeTool
      current={draft.key}
      moved={false}
      landing={transposedKey(draft.key, semitones)}
      by={semitones}
      home={t('player:transpose.own.song')}
      onBy={setSemitones}
      disabled={disabled}
      open={open}
      onOpenChange={change}
    >
      <div className="flex flex-col border-t border-hairline pt-2">
        <SwitchRow
          label={t('transpose.key')}
          info={t('transpose.keyInfo')}
          checked={applies.key}
          onCheckedChange={(key) => setApplies({ ...applies, key })}
        />
        <SwitchRow
          label={t('transpose.chords')}
          info={t('transpose.chordsInfo')}
          checked={applies.chords}
          onCheckedChange={(chords) => setApplies({ ...applies, chords })}
          className="border-b-0"
        />
      </div>
      <section aria-label={t('transpose.preview')} className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-muted-foreground">{t('transpose.preview')}</h3>
        <div className="max-w-full overflow-x-auto overscroll-x-contain rounded-xl border border-border bg-background p-2">
          <PreviewLine draft={line} />
        </div>
      </section>
      <Button disabled={semitones === 0} onClick={apply}>
        {t('transpose.apply')}
      </Button>
    </TransposeTool>
  )
}
