import { useTranslation } from 'react-i18next'
import { CUSTOM, LADDERS, ladderOf, type TrainerId } from '@/features/trainer'
import { isOneOf } from '@/shared/lib'

const isLevelOf = {
  chords: isOneOf(LADDERS.chords),
  scales: isOneOf(LADDERS.scales),
  intervals: isOneOf(LADDERS.intervals),
  qualities: isOneOf(LADDERS.qualities),
  scalesByEar: isOneOf(LADDERS.scalesByEar),
  notes: isOneOf(LADDERS.notes),
  signatures: isOneOf(LADDERS.signatures),
  degrees: isOneOf(LADDERS.degrees),
  roles: isOneOf(LADDERS.roles),
}

/** A trainer's level as its name reads: its ladder's, or Custom. */
export function useLevelName(): (id: TrainerId, level: string) => string {
  const { t } = useTranslation('quiz')
  return (id, level) => {
    if (level === CUSTOM) return t('custom')
    const ladder = ladderOf(id)
    if (ladder === 'chords' && isLevelOf.chords(level)) return t(`levels.chords.${level}`)
    if (ladder === 'scales' && isLevelOf.scales(level)) return t(`levels.scales.${level}`)
    if (ladder === 'intervals' && isLevelOf.intervals(level)) return t(`levels.intervals.${level}`)
    if (ladder === 'qualities' && isLevelOf.qualities(level)) return t(`levels.qualities.${level}`)
    if (ladder === 'scalesByEar' && isLevelOf.scalesByEar(level))
      return t(`levels.scalesByEar.${level}`)
    if (ladder === 'notes' && isLevelOf.notes(level)) return t(`levels.notes.${level}`)
    if (ladder === 'signatures' && isLevelOf.signatures(level))
      return t(`levels.signatures.${level}`)
    if (ladder === 'degrees' && isLevelOf.degrees(level)) return t(`levels.degrees.${level}`)
    if (ladder === 'roles' && isLevelOf.roles(level)) return t(`levels.roles.${level}`)
    return level
  }
}
