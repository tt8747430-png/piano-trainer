import { Link } from '@tanstack/react-router'
import { LifeBuoy, ScrollText, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { APP_BUILD } from '@/shared/config'
import { RowLink, SettingsGroup as Group } from '@/shared/ui'
import { SettingsScreen } from './SettingsScreen'

/**
 * Settings › Help: How to use (ADR 0052), Privacy and Terms (ADR 0116), and About: the app's version and
 * what it is made with.
 */
export function HelpPage() {
  const { t } = useTranslation('settings')
  return (
    <SettingsScreen title={t('groups.help.label')}>
      <Group title={t('help.label')} flush>
        <RowLink
          title={t('help.howToUse')}
          detail={t('help.howToUseLine')}
          icon={LifeBuoy}
          paint="sky"
          render={<Link to="/settings/how-to-use" />}
        />
        <RowLink
          title={t('help.privacy')}
          detail={t('help.privacyLine')}
          icon={ShieldCheck}
          paint="grass"
          render={<Link to="/legal/privacy" />}
        />
        <RowLink
          title={t('help.terms')}
          detail={t('help.termsLine')}
          icon={ScrollText}
          paint="sand"
          render={<Link to="/legal/terms" />}
        />
      </Group>
      <Group title={t('about.label')}>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
          <dt className="text-muted-foreground">{t('about.version')}</dt>
          <dd className="font-medium tabular-nums">{APP_BUILD}</dd>
          <dt className="text-muted-foreground">{t('about.made')}</dt>
          <dd>{t('about.madeWith')}</dd>
        </dl>
      </Group>
    </SettingsScreen>
  )
}
