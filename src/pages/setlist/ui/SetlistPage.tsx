import { Link, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { selectSetlist, useLibrary } from '@/entities/library'
import { ButtonLink, NotFound } from '@/shared/ui'
import { SetlistView } from './SetlistView'

/** A setlist's page (ADR 0103): the route's setlist, or not found once it is gone (another tab's delete). */
export function SetlistPage() {
  const { t } = useTranslation('common')
  const { setlistId } = useParams({ from: '/shell/songs/setlists/$setlistId' })
  const setlist = useLibrary(selectSetlist(setlistId))
  if (!setlist)
    return (
      <NotFound>
        <ButtonLink render={<Link to="/songs" />}>{t('notFound.toSongs')}</ButtonLink>
      </NotFound>
    )
  return <SetlistView key={setlist.id} setlist={setlist} />
}
