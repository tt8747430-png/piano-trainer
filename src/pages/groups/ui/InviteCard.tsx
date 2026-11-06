import { Link2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { LearnerGroup } from '@/shared/api/groups'
import { shareLink } from '@/shared/lib'
import { useGroups } from '@/shared/lib/groups'
import { RowButton, SettingsGroup, SwitchRow } from '@/shared/ui'

/**
 * A group's invite link (R32-C): Share invite link (the phone's share sheet, else copied), saying
 * whether anyone with it can join; its owner turns it on or off, which stops new joins only.
 */
export function InviteCard({
  group,
  onSaid,
  onChanged,
}: {
  group: LearnerGroup
  onSaid: (said: string | null) => void
  onChanged: (ok: boolean) => void
}) {
  const { t } = useTranslation('songs')
  const port = useGroups()
  const invite = async () => {
    const shared = await shareLink({
      title: t('groups.joinTitle', { name: group.name }),
      path: `/songs/groups/join?code=${group.inviteCode}`,
    })
    onSaid(
      shared === 'copied' ? t('groups.copied') : shared === 'failed' ? t('groups.failed') : null,
    )
  }
  return (
    <SettingsGroup flush title={t('groups.inviteTitle')}>
      <RowButton
        icon={Link2}
        paint="sky"
        title={t('groups.invite')}
        detail={t(group.inviteOpen ? 'groups.inviteLine' : 'groups.inviteOff')}
        disabled={!group.inviteOpen}
        onClick={() => void invite()}
      />
      {group.mine ? (
        <SwitchRow
          label={t('groups.linkOn')}
          className="min-h-16 border-b-0 pr-3 pl-4"
          checked={group.inviteOpen}
          onCheckedChange={(open) =>
            void port.setInviteOpen(group.id, open).then((r) => onChanged(r.ok))
          }
        />
      ) : null}
    </SettingsGroup>
  )
}
