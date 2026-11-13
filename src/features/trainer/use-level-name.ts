import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { CUSTOM, runPlaceOf, type TrainerId } from './trainer-view'
import { LADDERS, ladderOf } from './trainers'
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
  cadences: isOneOf(LADDERS.cadences),
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
  cadences: (level, t) => (isLevelOf.cadences(level) ? t(`levels.cadences.${level}`) : null),
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

/**
 * A run's place as the history names it (canvas 160): the trainer's name, then its level's,
 * read from where its record is kept (`chords:quiz:c-main`); none for a key no trainer has now.
 */
export function useRunName(): (key: string) => string | null {
  const { t } = useTranslation('quiz')
  const levelName = useLevelName()
  return (key) => {
    const place = runPlaceOf(key)
    if (!place) return null
    const name = t(`trainers.${place.trainerId}`)
    return place.level === 'all' ? name : `${name} · ${levelName(place.trainerId, place.level)}`
  }
}
