import { useTranslation } from 'react-i18next'
import { barAt, barLengths, meterAt } from '@/features/score-editor'
import { TICKS_PER_BEAT, timeSignature, timeSignatureText } from '@/shared/lib/music'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { BarIcon, type BarKeyEdit } from './palette-icons'
import { TimeFigures } from './sign-pictures'
import { CaptionGrid, CaptionKey, GlyphGrid, GroupName, PaletteKey } from './palette-keys'

/** What the Bar section does to the bars chosen, else the caret's, in order. */
const BAR_KEYS: readonly BarKeyEdit[] = [
  'insertBefore',
  'insert',
  'delete',
  'newLine',
  'joinLine',
  'newSection',
]

/**
 * Bar (spec 2026-10-23): what acts on the bars chosen, else the caret's: a bar added before or after,
 * the bars deleted, a line or a section begun there or the lines joined; their length (a pickup, or a
 * bar of another length, as the ⓘ beside its name says), each saying what it does.
 */
export function BarKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  // The caret's section's meter, its own or the song's (ADR 0095).
  const meter = useEditorState((state) => meterAt(state.draft, state.caret))
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
      <GroupName name={t('bars.length')} info={t('bars.lengthInfo')} />
      <GlyphGrid label={t('bars.length')}>
        {barLengths(meter).map((ticks) => {
          const time = timeSignature(ticks / TICKS_PER_BEAT, meter)
          return (
            <PaletteKey
              key={ticks}
              label={t('bars.lengthOf', { time: timeSignatureText(time) })}
              pressed={ticks === barTicks}
              onClick={() => actions.dispatch({ type: 'barLength', ticks })}
            >
              <TimeFigures meter={time} />
            </PaletteKey>
          )
        })}
      </GlyphGrid>
    </>
  )
}
