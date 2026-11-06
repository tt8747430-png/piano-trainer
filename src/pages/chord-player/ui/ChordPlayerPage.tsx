import { Link } from '@tanstack/react-router'
import { PageKeyboardTools } from '@/features/live-keyboard'
import { FilePlus2, Link2, Save, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SHEET_NAME_MAX } from '@/entities/chord-sheet'
import { BackButton, MoreMenu, NewSheet, RoundLink, ScreenHeader } from '@/shared/ui'
import { ChordPlayer } from '@/widgets/chord-player'
import { ToolsButton } from '@/widgets/tools-sheet'
import { useChordPlayerPage } from '../model/use-chord-player-page'

/**
 * The Chord player (`/practice/chord-player`, R29 CP1–CP6): its bar ‹ · Chord player · ⋯ (New, Save
 * as my chord sheet…, Share link) · gear (its Settings), over the sheet and its transport.
 */
export function ChordPlayerPage() {
  const { t } = useTranslation('practice')
  const page = useChordPlayerPage()
  const { hand } = page
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('pages.chordPlayer')}
        back={<BackButton />}
        tools={
          <>
            <PageKeyboardTools />
            <ToolsButton />
          </>
        }
        more={
          <MoreMenu
            label={t('chordPlayer.more')}
            actions={[
              {
                key: 'new',
                label: t('chordPlayer.newSheet'),
                icon: FilePlus2,
                onSelect: () => void page.startNew(),
              },
              {
                key: 'save',
                label: t('chordPlayer.saveAs'),
                icon: Save,
                onSelect: () => page.setSaving(''),
              },
              {
                key: 'share',
                label: t('chordPlayer.share'),
                icon: Link2,
                onSelect: () => void page.share(),
              },
            ]}
          />
        }
        settings={
          <RoundLink
            label={t('settings.open', { page: t('pages.chordPlayer') })}
            icon={Settings}
            render={
              <Link
                to="/practice/chord-player/settings"
                search={page.sheetId === undefined ? {} : { sheet: page.sheetId }}
              />
            }
          />
        }
      />
      {hand ? (
        <ChordPlayer hand={hand} sheetId={page.sheetId} name={page.name} routes={page.routes} />
      ) : null}
      <NewSheet
        open={page.saving !== null}
        onOpenChange={(open) => page.setSaving(open ? '' : null)}
        title={t('chordPlayer.save.title')}
        nameLabel={t('chordPlayer.save.name')}
        name={page.saving ?? ''}
        maxLength={SHEET_NAME_MAX}
        onName={page.setSaving}
        createLabel={t('chordPlayer.save.create')}
        onCreate={() => page.saveAs(page.saving ?? '')}
      />
    </div>
  )
}
