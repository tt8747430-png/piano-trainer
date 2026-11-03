import { Link, useSearch } from '@tanstack/react-router'
import { Cable, Piano } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useMidiSummary } from '@/features/connect-midi'
import { RowLink, SettingsGroup } from '@/shared/ui'
import { SettingsScreen } from '@/widgets/settings-screen'

/**
 * A Practice page's Settings (A24, R18): how the page sounds and looks every time, then rows to the
 * on-screen piano's and a connected piano's own pages, which keep their one home. Opened from the
 * page's gear it keeps Back to that page on a laptop too; from Settings, it is one of Settings' pages.
 */
export function PracticeSettingsScreen({
  title,
  children,
}: {
  title: string
  children?: ReactNode
}) {
  const { t } = useTranslation('settings')
  const midi = useMidiSummary()
  const { from } = useSearch({ strict: false })
  return (
    <SettingsScreen title={title} sub={from !== undefined}>
      {children}
      <SettingsGroup flush title={t('groups.playing.label')}>
        <RowLink
          title={t('pages.onScreenPiano')}
          icon={Piano}
          paint="lilac"
          render={<Link to="/settings/on-screen-piano" />}
        />
        <RowLink
          title={t('pages.connectPiano')}
          icon={Cable}
          paint="sky"
          value={midi}
          render={<Link to="/settings/connect-piano" />}
        />
      </SettingsGroup>
    </SettingsScreen>
  )
}
