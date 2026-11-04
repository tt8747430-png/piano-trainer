import { useTranslation } from 'react-i18next'
import { VOICE_IDS, VOICES } from '@/features/edit-piece'
import { localText, useLocale } from '@/shared/i18n'
import type { InstrumentFamily } from '@/widgets/instrument-list'
import { useEditorState, useScoreEditorContext } from './editor-context'
import { instrumentCount, type ScoreInstrument } from './instruments'

/**
 * The score's instruments by family, as New song lists them (round 28): each with how many the score
 * has and its − and +, the same in the score's Settings and the editor's Instruments panel (A40).
 */
export function useInstrumentFamilies(): InstrumentFamily[] {
  const { t } = useTranslation(['editor', 'songs'])
  const locale = useLocale()
  const { actions } = useScoreEditorContext()
  const draft = useEditorState((state) => state.draft)
  const count = (instrument: ScoreInstrument) => {
    const { count, fewer, more } = instrumentCount(draft, instrument)
    return {
      key: instrument,
      count,
      onFewer: fewer ? () => actions.dispatch(fewer) : undefined,
      onMore: more ? () => actions.dispatch(more) : undefined,
    }
  }
  return [
    {
      key: 'vocals',
      title: t('songs:setup.families.vocals'),
      rows: VOICE_IDS.map((voice) => ({
        ...count(voice),
        name: localText(VOICES[voice].name, locale),
      })),
    },
    {
      key: 'keyboards',
      title: t('songs:setup.families.keyboards'),
      rows: [{ ...count('piano'), name: t('songs:setup.piano') }],
    },
    {
      key: 'other',
      title: t('scoreSettings.families.other'),
      rows: [{ ...count('staff'), name: t('scoreSettings.staff') }],
    },
  ]
}
