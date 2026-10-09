import { Link, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ButtonLink, NotFound } from '@/shared/ui'

/** A take that is not there: the way back to its song's takes. */
export function TakeNotFound() {
  const { t } = useTranslation('common')
  const { pieceId } = useParams({ from: '/shell/edit/$pieceId/takes/$takeId' })
  return (
    <NotFound>
      <ButtonLink
        render={<Link to="/edit/$pieceId" params={{ pieceId }} search={{ record: true }} />}
      >
        {t('notFound.toTakes')}
      </ButtonLink>
    </NotFound>
  )
}
