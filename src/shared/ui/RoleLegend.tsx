import { useTranslation } from 'react-i18next'
import type { ChordRole } from '@/shared/lib/music'
import { cn } from '@/shared/lib'
import { ROLE_BG } from './role-classes'

/** What each key colour means, for the roles on the keyboard now. */
export function RoleLegend({ roles }: { roles: readonly ChordRole[] }) {
  const { t } = useTranslation('common')
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
      {roles.map((role) => (
        <li key={role} className="flex items-center gap-1.5">
          <span aria-hidden className={cn('size-2.5 rounded-full', ROLE_BG[role])} />
          {t(`roles.${role}`)}
        </li>
      ))}
    </ul>
  )
}
