import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { selectHistory, useProgress } from '@/entities/progress'
import { RowLink, SettingsGroup } from '@/shared/ui'
import { useRunLines, type RunLine } from '../model/runs'
import { ProfileSection } from './ProfileSection'

/** A run as a row (canvas 160): its name, its time and count, its accuracy; it opens its results. */
export function RunRow({ id, name, detail, accuracy }: RunLine) {
  return (
    <RowLink
      title={name}
      detail={detail}
      trailing={<span className="text-[1.0625rem] font-bold">{accuracy}</span>}
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
      to="/profile/history"
      seeAll={lines.length > 0}
    >
      <SettingsGroup flush>
        {lines.length === 0 ? (
          <p className="px-4 py-3 text-pretty text-muted-foreground">{t('profile.history.none')}</p>
        ) : (
          lines.map((line) => <RunRow key={line.id} {...line} />)
        )}
      </SettingsGroup>
    </ProfileSection>
  )
}
