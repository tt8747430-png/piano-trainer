import { Ellipsis, Link2, Music } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ActionMenu, RoundButton, TileMark, type MenuAction } from '@/shared/ui'

/**
 * Share link and ··· as the PlayerApp board draws them: white circles on the sheet's paper, a 6% ring
 * and a 1px shade (by Night, the hairline alone).
 */
const RAISED = 'bg-card elevation-thumb hover:bg-card dark:shadow-[0_0_0_1px_var(--color-border)]'

/**
 * The head of the Player's Settings (its canvas's Song settings): the song, its name over what it
 * is, Share link and ··· (Print, Export, the music's own acts) beside it. Acts sit in the head, never
 * among the settings; the editor is the bar's Edit (loop round 61), the one way in.
 */
export function SongHead({
  title,
  detail,
  share,
  acts,
}: {
  title: string
  detail?: string | undefined
  share?: (() => void) | undefined
  acts: readonly MenuAction[]
}) {
  const { t } = useTranslation(['player', 'songs', 'settings'])
  return (
    <div className="flex min-w-0 items-center gap-3">
      <TileMark large icon={Music} paint="sand" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate text-lg/[1.2] font-bold">{title}</span>
        {detail ? (
          <span className="truncate text-footnote text-muted-foreground tabular-nums">
            {detail}
          </span>
        ) : null}
      </div>
      {share ? (
        <RoundButton
          label={t('songs:library.shareLink')}
          icon={Link2}
          className={RAISED}
          onClick={share}
        />
      ) : null}
      {acts.length > 0 ? (
        <ActionMenu
          label={t('songMenu')}
          align="end"
          trigger={null}
          render={
            <RoundButton label={t('settings:bars.more')} icon={Ellipsis} className={RAISED} />
          }
          actions={acts}
        />
      ) : null}
    </div>
  )
}
