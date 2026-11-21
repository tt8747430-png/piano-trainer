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
        <span className="grid h-11 w-13 shrink-0 place-items-center rounded-xl bg-muted text-subhead font-bold tabular-nums">
          {accuracy}
        </span>
      }
      title={name}
      detail={detail}
      render={<Link to="/profile/history/$runId" params={{ runId: id }} />}
    />
  )
}

/** No run kept yet (the board's first run): what the history holds, and Open Practice, its one next step. */
export function NoHistory() {
  const { t } = useTranslation('account')
  return (
    <div className="flex flex-col items-start gap-1 px-4 pt-4 pb-2">
      <p className="text-subhead leading-[1.45] text-pretty text-muted-foreground">
        {t('profile.history.none')}
      </p>
      <Link
        to="/practice"
        className="flex h-11 items-center rounded-control text-subhead font-semibold text-link"
      >
        {t('profile.history.open')}
      </Link>
    </div>
  )
}

/** The Profile's Practice history (canvas 160): the last three runs, then See all; none yet, said so with Open Practice, its one next step. */
export function HistoryPreview() {
  const { t } = useTranslation('account')
  const lines = useRunLines()(useProgress(selectHistory).slice(0, 3))
  return (
    <ProfileSection
      fold="history"
      title={t('profile.history.title')}
      to={lines.length > 0 ? '/profile/history' : undefined}
    >
      <ProfileList>
        {lines.length === 0 ? (
          <NoHistory />
        ) : (
          lines.map((line) => <RunRow key={line.id} {...line} />)
        )}
      </ProfileList>
    </ProfileSection>
  )
}
