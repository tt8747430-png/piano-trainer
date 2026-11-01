import { Link, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { isPatternRef, usePatternBook, type BookPattern } from '@/entities/pattern'
import { PublishScreen } from '@/features/publish'
import { localText, useLocale } from '@/shared/i18n'
import { BackButton, ButtonLink, NotFound } from '@/shared/ui'
import { usePatternPublish } from '../model/use-pattern-publish'

/** The route's pattern of the learner's own, or the way back where it is gone. */
export function PatternPublishPage() {
  const { t } = useTranslation('common')
  const { patternRef } = useParams({
    from: '/shell/practice/accompaniment/patterns/$patternRef/publish',
  })
  const book = usePatternBook()
  const pattern = isPatternRef(patternRef) ? book.get(patternRef) : undefined
  if (!pattern)
    return (
      <NotFound>
        <ButtonLink render={<Link to="/practice/accompaniment" />}>
          {t('notFound.toAccompaniment')}
        </ButtonLink>
      </NotFound>
    )
  return <Publish key={pattern.ref} pattern={pattern} />
}

/** Publish in library for a pattern (round 27): the Publish screen, as a song's. */
function Publish({ pattern }: { pattern: BookPattern }) {
  const locale = useLocale()
  const name = localText(pattern.name, locale)
  const { item, publishing } = usePatternPublish(pattern, name)
  const back = (
    <BackButton
      fallback={{
        to: '/practice/accompaniment/patterns/$patternRef',
        params: { patternRef: pattern.ref },
      }}
    />
  )
  if (!item) return null
  return (
    <PublishScreen
      item={{ id: item.sourceId, kind: item.kind, title: item.title, meta: item.meta }}
      publishing={publishing}
      back={back}
    />
  )
}
