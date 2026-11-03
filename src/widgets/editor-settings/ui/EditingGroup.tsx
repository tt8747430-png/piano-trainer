import { Link } from '@tanstack/react-router'
import { Cable, Mic, SlidersHorizontal, Volume2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectEditing, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setEditing } from '@/features/set-preference'
import { RowLink, SettingsGroup, SwitchRow, TileMark } from '@/shared/ui'

/**
 * The score editor's own settings (B7, the editor's kind page): notes heard as they are edited, then
 * the ways in, each a row to its one home (R18): a connected piano, sound and recording, and the
 * Player's settings, where each staff's volume is. The same group on Settings › Score editor and on a
 * score's Settings.
 */
export function EditingGroup() {
  const { t } = useTranslation(['editor', 'settings'])
  const settings = useSettingsStoreApi()
  const editing = useSettings(selectEditing)
  return (
    <SettingsGroup flush title={t('scoreSettings.editing')}>
      <SwitchRow
        setting="editing.hearNotes"
        icon={<TileMark icon={Volume2} paint="sand" />}
        label={t('scoreSettings.hearNotes')}
        info={t('scoreSettings.hearNotesInfo')}
        checked={editing.hearNotes}
        onCheckedChange={(hearNotes) => setEditing(settings, { hearNotes })}
        className="gap-3 border-0 pr-3 pl-2 font-semibold"
      />
      <RowLink
        title={t('scoreSettings.midi')}
        icon={Cable}
        paint="lilac"
        render={<Link to="/settings/connect-piano" />}
      />
      <RowLink
        title={t('scoreSettings.sound')}
        icon={Mic}
        paint="grass"
        render={<Link to="/settings/sound-and-recording" />}
      />
      <RowLink
        title={t('settings:pages.player')}
        icon={SlidersHorizontal}
        paint="sky"
        render={<Link to="/settings/player" />}
      />
    </SettingsGroup>
  )
}
