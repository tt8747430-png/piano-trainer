import { useTranslation } from 'react-i18next'
import { barAt, barLengths } from '@/features/score-editor'
import {
  TICKS_PER_BEAT,
  timeSignature,
  timeSignatureText,
  type TimeSignature,
} from '@/shared/lib/music'
import { ToolKey } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { BarIcon, type BarKeyEdit } from './palette-icons'
import { CaptionGrid, CaptionKey, GlyphGrid } from './palette-keys'

/** What the Bar section does to the bars chosen, else the caret's, in order. */
const BAR_KEYS: readonly BarKeyEdit[] = [
  'insertBefore',
  'insert',
  'delete',
  'newLine',
  'joinLine',
  'newSection',
]

/** A time signature drawn as printed: its figures one over the other. */
function Figures({ time }: { time: TimeSignature }) {
  return (
    <span className="flex flex-col items-center font-serif text-base leading-[0.85] font-bold">
      <span>{time.count}</span>
      <span>{time.unit}</span>
    </span>
  )
}

/**
 * Bar (spec 2026-10-23): what acts on the bars chosen, else the caret's: a bar added before or after,
 * the bars deleted, a line or a section begun there or the lines joined; their length (a pickup, or a
 * bar of another length), each saying what it does.
 */
export function BarKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const meter = useEditorState((state) => state.draft.meter)
  const barTicks = useEditorState((state) => barAt(state.draft, state.caret).bar.ticks)
  return (
    <>
      <CaptionGrid>
        {BAR_KEYS.map((edit) => (
          <CaptionKey
            key={edit}
            label={t(`bars.${edit}`)}
            onClick={() => actions.dispatch({ type: 'bars', edit })}
          >
            <BarIcon edit={edit} />
          </CaptionKey>
        ))}
      </CaptionGrid>
      <h4 className="pt-1 text-sm text-muted-foreground">{t('bars.length')}</h4>
      <GlyphGrid label={t('bars.length')}>
        {barLengths(meter).map((ticks) => {
          const time = timeSignature(ticks / TICKS_PER_BEAT, meter)
          return (
            <ToolKey
              key={ticks}
              label={t('bars.lengthOf', { time: timeSignatureText(time) })}
              pressed={ticks === barTicks}
              onClick={() => actions.dispatch({ type: 'barLength', ticks })}
            >
              <Figures time={time} />
            </ToolKey>
          )
        })}
      </GlyphGrid>
    </>
  )
}
