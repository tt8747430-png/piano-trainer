import { useNavigate } from '@tanstack/react-router'
import { BellOff, CheckCheck, Flame, Medal, Target, Trash2, TrendingUp, X } from 'lucide-react'
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNotifications, useNotificationsStoreApi, type Notice } from '@/entities/notification'
import { isMilestoneId, localDay, type BadgeId } from '@/entities/progress'
import { useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import {
  BackButton,
  ConfirmDialog,
  MoreMenu,
  RoundButton,
  Said,
  ScreenHeader,
  SwipeRow,
  TileMark,
} from '@/shared/ui'
import { MILESTONE_ICON } from '../model/icons'

const GROUPS = ['today', 'yesterday', 'earlier'] as const

/** Which group a notice falls in, by the day on the learner's calendar. */
function groupOf(notice: Notice, now: Date): (typeof GROUPS)[number] {
  const day = localDay(new Date(notice.at))
  if (day === localDay(now)) return 'today'
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  return day === localDay(yesterday) ? 'yesterday' : 'earlier'
}

/** A notice's title, as the learner reads it. */
function useNoticeTitle(): (notice: Notice) => string {
  const { t } = useTranslation('account')
  return ({ kind, ref }) => {
    if (kind === 'level') return t('profile.notifications.level', { level: ref })
    if (kind === 'streak') return t('profile.notifications.streak', { count: Number(ref) })
    if (kind === 'accuracy') return t('profile.notifications.accuracy', { percent: ref })
    if (kind === 'milestone')
      return isMilestoneId(ref) ? t(`profile.achievements.names.${ref}`) : ref
    const [badge = '', tier = '1'] = ref.split(':')
    const tierName = ['bronze', 'silver', 'gold', 'platinum'][Number(tier) - 1] ?? 'bronze'
    return t('profile.notifications.tier', {
      tier: t(`profile.badges.tiers.${tierName as 'bronze'}`),
      badge: t(`profile.badges.names.${badge as BadgeId}`),
    })
  }
}

const KIND_ICON = { level: TrendingUp, tier: Medal, streak: Flame, accuracy: Target } as const

/**
 * Notifications (B1, memory-palaces'): Today, Yesterday and Earlier, each notice its picture, what
 * was reached and when, unread ones marked; a row swiped or its × removes it; opening one marks it
 * read and goes to its badge or record. The bar's ⋯: Mark all read, Clear all (asked first).
 * Opening the page marks nothing.
 */
export function NotificationsPage() {
  const { t } = useTranslation('account')
  const notices = useNotifications((held) => held.notices)
  const store = useNotificationsStoreApi()
  const [clearing, setClearing] = useState(false)
  const now = new Date()
  const set = (next: readonly Notice[]) => store.setState({ notices: next })
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('profile.notifications.title')}
        back={<BackButton />}
        more={
          notices.length > 0 ? (
            <MoreMenu
              label={t('profile.notifications.more')}
              actions={[
                {
                  key: 'read',
                  label: t('profile.notifications.markAll'),
                  icon: CheckCheck,
                  hidden: notices.every((notice) => notice.read),
                  onSelect: () => set(notices.map((notice) => ({ ...notice, read: true }))),
                },
                {
                  key: 'clear',
                  label: t('profile.notifications.clearAll'),
                  icon: Trash2,
                  destructive: true,
                  onSelect: () => setClearing(true),
                },
              ]}
            />
          ) : undefined
        }
      />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        {notices.length === 0 ? (
          <Said
            icon={BellOff}
            title={t('profile.notifications.emptyTitle')}
            description={t('profile.notifications.empty')}
            action={null}
          />
        ) : (
          GROUPS.map((group) => {
            const shown = notices.filter((notice) => groupOf(notice, now) === group)
            return shown.length > 0 ? (
              <Group
                key={group}
                title={t(`profile.notifications.${group}`)}
                notices={shown}
                onRemove={(id) => set(notices.filter((notice) => notice.id !== id))}
                onRead={(id) =>
                  set(
                    notices.map((notice) =>
                      notice.id === id ? { ...notice, read: true } : notice,
                    ),
                  )
                }
              />
            ) : null
          })
        )}
      </div>
      <ConfirmDialog
        open={clearing}
        onOpenChange={setClearing}
        title={t('profile.notifications.clearTitle')}
        body={t('profile.notifications.clearBody')}
        action={t('profile.notifications.clear')}
        cancel={t('profile.notifications.cancel')}
        destructive
        onConfirm={() => set([])}
      />
    </div>
  )
}

function Group({
  title,
  notices,
  onRemove,
  onRead,
}: {
  title: string
  notices: readonly Notice[]
  onRemove: (id: string) => void
  onRead: (id: string) => void
}) {
  const { t } = useTranslation('account')
  const id = useId()
  const locale = useLocale()
  const titleOf = useNoticeTitle()
  const navigate = useNavigate()
  const time = new Intl.DateTimeFormat(locale, { timeStyle: 'short' })
  const date = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' })
  const open = (notice: Notice) => {
    onRead(notice.id)
    if (notice.kind === 'tier')
      void navigate({
        to: '/profile/badges/$badgeId',
        params: { badgeId: notice.ref.split(':')[0] ?? '' },
      })
    else if (notice.kind === 'milestone')
      void navigate({
        to: '/profile/achievements/$achievementId',
        params: { achievementId: notice.ref },
      })
    else
      void navigate({ to: notice.kind === 'streak' ? '/profile/streak' : '/profile/achievements' })
  }
  return (
    <section aria-labelledby={id} className="flex flex-col gap-2">
      <h2 id={id} className="px-3 font-sans text-sm font-semibold text-muted-foreground">
        {title}
      </h2>
      <ul className="flex flex-col divide-y divide-border overflow-hidden card">
        {notices.map((notice) => {
          const at = new Date(notice.at)
          const Icon =
            notice.kind === 'milestone' && isMilestoneId(notice.ref)
              ? MILESTONE_ICON[notice.ref]
              : KIND_ICON[notice.kind === 'milestone' ? 'tier' : notice.kind]
          return (
            <li key={notice.id}>
              <SwipeRow
                trailing={[
                  {
                    id: 'remove',
                    icon: Trash2,
                    label: t('profile.notifications.remove'),
                    paint: 'sand',
                    onAction: () => onRemove(notice.id),
                  },
                ]}
              >
                <div className="flex min-h-16 items-center gap-1 bg-card pr-2">
                  <button
                    type="button"
                    onClick={() => open(notice)}
                    className="flex min-w-0 flex-1 items-center gap-3 py-2 pl-3 text-left focus-visible:-outline-offset-3"
                  >
                    <TileMark icon={Icon} paint={notice.read ? 'sand' : 'yellow'} />
                    <span className="flex min-w-0 flex-col">
                      <span className={cn('text-pretty', !notice.read && 'font-semibold')}>
                        {titleOf(notice)}
                      </span>
                      <span className="text-sm text-muted-foreground tabular-nums">
                        {groupOf(notice, new Date()) === 'earlier'
                          ? date.format(at)
                          : time.format(at)}
                      </span>
                    </span>
                    {!notice.read ? (
                      <span
                        aria-hidden
                        className="ml-auto size-2.5 shrink-0 rounded-pill bg-link"
                      />
                    ) : null}
                  </button>
                  <RoundButton
                    label={t('profile.notifications.remove')}
                    icon={X}
                    onClick={() => onRemove(notice.id)}
                  />
                </div>
              </SwipeRow>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
