import { Link, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { isOwnPatternId, isPatternRef, usePatternBook, type BookPattern } from '@/entities/pattern'
import { PublishScreen } from '@/features/publish'
import { localText, useLocale } from '@/shared/i18n'
import { BackButton, ButtonLink, NotFound, ScreenHeader } from '@/shared/ui'
import { usePatternPublish } from '../model/use-pattern-publish'

/** The route's pattern of the learner's own, or the way back where it is gone or one of the app's. */
export function PatternPublishPage() {
  const { t } = useTranslation('common')
  const { patternRef } = useParams({
    from: '/shell/practice/accompaniment/patterns/$patternRef/publish',
  })
  const book = usePatternBook()
  const pattern = isPatternRef(patternRef) ? book.get(patternRef) : undefined
  if (!pattern || !isOwnPatternId(pattern.ref))
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
  const { t } = useTranslation('editor')
  const { item, publishing } = usePatternPublish(pattern, name)
  if (!item) return null
  return (
    <div className="flex min-h-screen-free flex-col gap-2 lg:gap-6">
      <ScreenHeader title={t('publishPage.title')} back={<BackButton />} />
      <PublishScreen
        item={{ id: item.sourceId, kind: item.kind, title: item.title, meta: item.meta }}
        publishing={publishing}
      />
    </div>
  )
}
