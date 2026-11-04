import { useParams, useRouter } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { selectScoreView, useSettings } from '@/entities/settings'
import { selectView } from '@/entities/views'
import { useKeyName } from '@/shared/i18n'
import { firstLine, transpose, type Draft, type TransposeApplies } from '@/features/score-editor'
import { transposedKey } from '@/shared/lib/music'
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
        edit={shownAsPrinted}
        view="panorama"
        room={PREVIEW_ROOM}
        title={NO_TITLE}
      />
    </div>
  )
}

/**
 * The editor's Transpose (ADR 0115): the Player's one Transpose, its trigger the key the song is
 * written in and its control the same − the key it lands in +, how far, and Reset; under it what
 * writing needs, after the shared Transpose key signature and Transpose chord symbols: the first line moved as a preview, and
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
  // How far the learner plays it in the Player (R29 T): said here, ready to write with Use this.
  const router = useRouter()
  const keyName = useKeyName()
  const { pieceId } = useParams({ strict: false })
  const played = pieceId
    ? (selectView(router.options.context.views.getState(), `/play/${pieceId}`)?.transpose ?? 0)
    : 0
  const playedBy = typeof played === 'number' ? played : 0
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
      signature={applies.key}
      chordSymbols={applies.chords}
      onSignature={(key) => setApplies({ ...applies, key })}
      onChordSymbols={(chords) => setApplies({ ...applies, chords })}
      disabled={disabled}
      open={open}
      onOpenChange={change}
    >
      {playedBy !== 0 ? (
        <p className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
          {t('transpose.inPlayer', {
            by: playedBy > 0 ? `+${playedBy}` : `−${-playedBy}`,
            key: keyName(transposedKey(draft.key, playedBy)),
          })}
          <Button variant="soft" size="pill" onClick={() => setSemitones(playedBy)}>
            {t('transpose.useThis')}
          </Button>
        </p>
      ) : null}
      <section aria-label={t('transpose.preview')} className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-muted-foreground">{t('transpose.preview')}</h3>
        <div className="max-w-full overflow-x-auto overscroll-x-contain rounded-control border border-border bg-background p-2">
          <PreviewLine draft={line} />
        </div>
      </section>
      <Button disabled={semitones === 0} onClick={apply}>
        {t('transpose.apply')}
      </Button>
    </TransposeTool>
  )
}
