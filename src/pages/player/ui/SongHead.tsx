import { Ellipsis, Link2, Music2, PencilLine } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ActionMenu, RoundButton, TileMark, type MenuAction } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

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
        <TileMark large icon={Music2} paint="sand" />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-lg font-semibold">{title}</span>
          {detail ? (
            <span className="truncate text-sm text-muted-foreground tabular-nums">{detail}</span>
          ) : null}
        </div>
        {share ? (
          <RoundButton label={t('songs:library.shareLink')} icon={Link2} onClick={share} />
        ) : null}
        {acts.length > 0 ? (
          <ActionMenu
            label={t('settings:bars.more')}
            align="end"
            trigger={null}
            render={<RoundButton label={t('settings:bars.more')} icon={Ellipsis} />}
            actions={acts}
          />
        ) : null}
      </div>
      {onEdit ? (
        <Button
          className="h-11 bg-foreground text-background hover:bg-foreground/90"
          onClick={onEdit}
        >
          <PencilLine aria-hidden />
          {t('editScore')}
        </Button>
      ) : null}
    </div>
  )
}
