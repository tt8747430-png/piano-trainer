import { useTranslation } from 'react-i18next'
import { RankMark } from '@/shared/ui'
import { stageRank, type Stage } from '../model/types'

/** A stage as four rising pips, named by the stage: an exercise's, a piece's. */
export function StageMark({ stage }: { stage: Stage }) {
  const { t } = useTranslation('common')
  return <RankMark rank={stageRank(stage)} label={t(`stage.${stage}`)} />
}
