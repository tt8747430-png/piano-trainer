import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { CUSTOM, LADDERS, ladderOf, type TrainerId } from '@/features/trainer'
import { isOneOf } from '@/shared/lib'

type Ladder = keyof typeof LADDERS

const isLevelOf = {
  chords: isOneOf(LADDERS.chords),
  scales: isOneOf(LADDERS.scales),
  intervals: isOneOf(LADDERS.intervals),
  scalesByEar: isOneOf(LADDERS.scalesByEar),
  notes: isOneOf(LADDERS.notes),
  signatures: isOneOf(LADDERS.signatures),
  degrees: isOneOf(LADDERS.degrees),
  roles: isOneOf(LADDERS.roles),
  progressions: isOneOf(LADDERS.progressions),
}

/** Every ladder's levels by name: a ladder added without its names fails to compile. */
const NAMES: Readonly<Record<Ladder, (level: string, t: TFunction<'quiz'>) => string | null>> = {
  chords: (level, t) => (isLevelOf.chords(level) ? t(`levels.chords.${level}`) : null),
  scales: (level, t) => (isLevelOf.scales(level) ? t(`levels.scales.${level}`) : null),
  intervals: (level, t) => (isLevelOf.intervals(level) ? t(`levels.intervals.${level}`) : null),
  scalesByEar: (level, t) =>
    isLevelOf.scalesByEar(level) ? t(`levels.scalesByEar.${level}`) : null,
  notes: (level, t) => (isLevelOf.notes(level) ? t(`levels.notes.${level}`) : null),
  signatures: (level, t) => (isLevelOf.signatures(level) ? t(`levels.signatures.${level}`) : null),
  degrees: (level, t) => (isLevelOf.degrees(level) ? t(`levels.degrees.${level}`) : null),
  roles: (level, t) => (isLevelOf.roles(level) ? t(`levels.roles.${level}`) : null),
  progressions: (level, t) =>
    isLevelOf.progressions(level) ? t(`levels.progressions.${level}`) : null,
}

/** A trainer's level as its name reads: its ladder's, or Custom. */
export function useLevelName(): (id: TrainerId, level: string) => string {
  const { t } = useTranslation('quiz')
  return (id, level) => {
    if (level === CUSTOM) return t('custom')
    const ladder = ladderOf(id)
    return (ladder && NAMES[ladder](level, t)) ?? level
  }
}
