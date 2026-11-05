import { useParams, useRouter } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { selectView } from '@/entities/views'
import { useKeyName } from '@/shared/i18n'
import { firstLine, transpose, type TransposeApplies } from '@/features/score-editor'
import { transposedKey } from '@/shared/lib/music'
import { Button } from '@/shared/ui/primitives/button'
import { PreviewLine, TransposeFields } from '@/widgets/transpose'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/**
 * The editor's Transpose (ADR 0115, R31-E), a page of its gear: the Player's one control
 * (`TransposeFields`), − the key it lands in +, how far, Reset and the two switches; under it what
 * writing needs: the first line moved as a preview, and Transpose, which writes the song so in one
 * edit Undo takes back and turns back to the gear's first page (`onDone`). Opened afresh each time,
 * from the song's key with both applied; left, it changes nothing.
 */
export function EditorTranspose({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation(['editor', 'player'])
  const { actions } = useScoreEditorContext()
  const draft = useEditorState((state) => state.draft)
  const [semitones, setSemitones] = useState(0)
  const [applies, setApplies] = useState<TransposeApplies>({ key: true, chords: true })
  const moved = useMemo(() => transpose(draft, semitones, applies), [draft, semitones, applies])
  const line = useMemo(() => firstLine(moved), [moved])
  // How far the learner plays it in the Player (R29 T): said here, ready to write with Use this.
  const router = useRouter()
  const keyName = useKeyName()
  const { pieceId } = useParams({ strict: false })
  const played = pieceId
    ? (selectView(router.options.context.views.getState(), `/play/${pieceId}`)?.transpose ?? 0)
    : 0
  const playedBy = typeof played === 'number' ? played : 0
  const apply = () => {
    actions.dispatch({ type: 'transpose', semitones, applies })
    onDone()
  }
  return (
    <div className="flex flex-col gap-4">
      <TransposeFields
        landing={transposedKey(draft.key, semitones)}
        by={semitones}
        home={t('player:transpose.own.song')}
        onBy={setSemitones}
        signature={applies.key}
        chordSymbols={applies.chords}
        onSignature={(key) => setApplies({ ...applies, key })}
        onChordSymbols={(chords) => setApplies({ ...applies, chords })}
      />
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
      <PreviewLine draft={line} />
      <Button disabled={semitones === 0} onClick={apply}>
        {t('transpose.apply')}
      </Button>
    </div>
  )
}
