import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { selectHistory, useProgress } from '@/entities/progress'
import { RowLink } from '@/shared/ui'
import { useRunLines, type RunLine } from '../model/runs'
import { ProfileList } from './ProfileList'
import { ProfileSection } from './ProfileSection'

/**
 * A run as a row (RUNROW9): its score leading in a 52 tile, the row's picture as every list row leads
 * with one, then its name and its time and count; it opens its results.
 */
export function RunRow({ id, name, detail, accuracy }: RunLine) {
  return (
    <RowLink
      mark={
        <span className="grid h-11 w-13 shrink-0 place-items-center rounded-xl bg-muted text-[0.9375rem] font-bold tabular-nums">
          {accuracy}
        </span>
      }
      title={name}
      detail={detail}
      render={<Link to="/profile/history/$runId" params={{ runId: id }} />}
    />
  )
}

/** The Profile's Practice history (canvas 160): the last three runs, then See all; none yet, said so. */
export function HistoryPreview() {
  const { t } = useTranslation('account')
  const lines = useRunLines()(useProgress(selectHistory).slice(0, 3))
  return (
    <ProfileSection
      title={t('profile.history.title')}
      to={lines.length > 0 ? '/profile/history' : undefined}
    >
      <ProfileList>
        {lines.length === 0 ? (
          <p className="px-4 py-3 text-pretty text-muted-foreground">{t('profile.history.none')}</p>
        ) : (
          lines.map((line) => <RunRow key={line.id} {...line} />)
        )}
      </ProfileList>
    </ProfileSection>
  )
}
