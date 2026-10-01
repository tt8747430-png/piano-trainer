import { useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { isOwnPatternId, usePatterns } from '@/entities/pattern'
import { PatternEditor } from './PatternEditor'

/** One of the learner's own patterns changed: its name and figures to start from. */
export function EditPatternPage() {
  const { t } = useTranslation('learn')
  const { patternRef } = useParams({ from: '/shell/learn/patterns/$patternRef/edit' })
  const pattern = usePatterns((state) => state.own.find((own) => own.id === patternRef))
  if (!pattern || !isOwnPatternId(patternRef)) return null
  return (
    <PatternEditor
      key={pattern.id}
      title={t('patterns.editor.editTitle')}
      start={{ name: pattern.name, rh: pattern.rh, lh: pattern.lh }}
      id={pattern.id}
    />
  )
}
