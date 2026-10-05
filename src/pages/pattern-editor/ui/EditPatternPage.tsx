import { Link, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { isOwnPatternId, selectOwnPattern, usePatterns } from '@/entities/pattern'
import { ButtonLink, NotFound } from '@/shared/ui'
import { PatternEditor } from './PatternEditor'

/** One of the learner's own patterns changed: its name and figures to start from. */
export function EditPatternPage() {
  const { t } = useTranslation(['learn', 'common'])
  const { patternRef } = useParams({ from: '/shell/practice/patterns/$patternRef/edit' })
  const pattern = usePatterns((state) =>
    isOwnPatternId(patternRef) ? selectOwnPattern(patternRef)(state) : undefined,
  )
  if (!pattern) {
    // Deleted in another tab while it was being changed.
    return (
      <NotFound>
        <ButtonLink render={<Link to="/practice/patterns" />}>
          {t('common:notFound.toPatterns')}
        </ButtonLink>
      </NotFound>
    )
  }
  return (
    <PatternEditor
      key={pattern.id}
      title={t('patterns.editor.editTitle')}
      start={{ name: pattern.name, rh: pattern.rh, lh: pattern.lh }}
      id={pattern.id}
    />
  )
}
