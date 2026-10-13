import { Link, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isOwnPatternId, selectOwnPattern, usePatterns } from '@/entities/pattern'
import { ButtonLink, NotFound } from '@/shared/ui'
import { PatternEditor } from './PatternEditor'

/** One of the learner's own patterns changed: its name and figures to start from. */
function Editing({ patternRef }: { patternRef: string }) {
  const { t } = useTranslation(['common', 'practice'])
  const now = usePatterns((state) =>
    isOwnPatternId(patternRef) ? selectOwnPattern(patternRef)(state) : undefined,
  )
  // The pattern as it was opened: deleted in another tab while it is changed, the changes stay, and
  // Save keeps them as a new pattern.
  const [pattern] = useState(now)
  if (!pattern) {
    return (
      <NotFound>
        <ButtonLink render={<Link to="/practice/accompaniment" />}>
          {t('common:notFound.toAccompaniment')}
        </ButtonLink>
      </NotFound>
    )
  }
  return (
    <PatternEditor
      title={t('practice:patterns.editor.editTitle')}
      start={{ name: pattern.name, rh: pattern.rh, lh: pattern.lh }}
      id={pattern.id}
    />
  )
}

export function EditPatternPage() {
  const { patternRef } = useParams({
    from: '/shell/practice/accompaniment/patterns/$patternRef/edit',
  })
  return <Editing key={patternRef} patternRef={patternRef} />
}
