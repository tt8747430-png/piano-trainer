import { useTranslation } from 'react-i18next'
import { barAt, barLengths, isHandLayer } from '@/features/score-editor'
import {
  TICKS_PER_BEAT,
  timeSignature,
  timeSignatureText,
  type TimeSignature,
} from '@/shared/lib/music'
import { ToolKey } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
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
export function Figures({ time }: { time: TimeSignature }) {
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
 * bar of another length); and, on a hand's staff, the bar written out as notes or given back to the
 * pattern, each saying what it does.
 */
export function BarKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const meter = useEditorState((state) => state.draft.meter)
  const barTicks = useEditorState((state) => barAt(state.draft, state.caret).bar.ticks)
  const layer = useEditorState((state) => state.layer)
  const written = useEditorState((state) =>
    isHandLayer(state.layer) ? barAt(state.draft, state.caret).bar[state.layer] : false,
  )
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
      {isHandLayer(layer) ? (
        <div className="flex flex-col items-start gap-2 pt-1">
          <p className="text-sm text-pretty text-muted-foreground">
            {written ? t('bars.patternAgainNote') : t('bars.fromPattern')}
          </p>
          {written ? (
            <Button variant="soft" onClick={() => actions.dispatch({ type: 'backToPattern' })}>
              {t('bars.patternAgain')}
            </Button>
          ) : (
            <Button variant="soft" onClick={actions.writeOut}>
              {t('bars.writeOut')}
            </Button>
          )}
        </div>
      ) : null}
    </>
  )
}
