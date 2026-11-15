import { Ellipsis, Link2, Music, PencilLine } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ActionMenu, RoundButton, TileMark, type MenuAction } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

/**
 * Share link and ··· as the PlayerApp board draws them: white circles on the sheet's paper, a 6% ring
 * and a 1px shade (by Night, the hairline alone).
 */
const RAISED =
  'bg-card shadow-[0_0_0_1px_rgb(26_22_18/0.06),0_1px_2px_rgb(26_22_18/0.08)] hover:bg-card dark:shadow-[0_0_0_1px_var(--color-border)]'

/**
 * The head of the Player's Settings (its canvas's Song settings): the song, its name over what it
 * is, Share link and ··· (Print, Export, the music's own acts) beside it; Edit score the whole row
 * under it. Acts sit in the head, never among the settings.
 */
export function SongHead({
  title,
  detail,
  share,
  acts,
  onEdit,
}: {
  title: string
  detail?: string | undefined
  share?: (() => void) | undefined
  acts: readonly MenuAction[]
  onEdit?: (() => void) | undefined
}) {
  const { t } = useTranslation(['player', 'songs', 'settings'])
  return (
    <div className="flex flex-col gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <TileMark large icon={Music} paint="sand" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="truncate text-[1.0625rem]/[1.2] font-bold">{title}</span>
          {detail ? (
            <span className="truncate text-[0.8125rem] text-muted-foreground tabular-nums">
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
            label={t('settings:bars.more')}
            align="end"
            trigger={null}
            render={
              <RoundButton label={t('settings:bars.more')} icon={Ellipsis} className={RAISED} />
            }
            actions={acts}
          />
        ) : null}
      </div>
      {onEdit ? (
        <Button
          className="h-11 rounded-xl bg-foreground text-[0.9375rem] font-semibold text-background hover:bg-foreground/90"
          onClick={onEdit}
        >
          <PencilLine aria-hidden />
          {t('editScore')}
        </Button>
      ) : null}
    </div>
  )
}
