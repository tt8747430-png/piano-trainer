import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { noteName, type ScaleKind, type SpelledNote } from '@/shared/lib/music'

/** A scale's name in the learner's language: "E♭ harmonic minor". */
export function useScaleName(): (root: SpelledNote, kind: ScaleKind) => string {
  const { t } = useTranslation('theory')
  return useCallback((root, kind) => `${noteName(root)} ${t(`scaleName.${kind}`)}`, [t])
}
