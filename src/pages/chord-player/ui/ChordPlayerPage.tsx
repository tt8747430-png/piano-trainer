import { Link } from '@tanstack/react-router'
import { FilePlus2, Link2, Save, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SHEET_NAME_MAX } from '@/entities/chord-sheet'
import { NewSheet, RoundLink } from '@/shared/ui'
import { ChordPlayer } from '@/widgets/chord-player'
import { useChordPlayerPage } from '../model/use-chord-player-page'

/**
 * The Chord player (`/practice/chord-player`, canvas 171): the widget's bar, chart and dock, given
 * the page's acts on the sheet's file (New, Save as my chord sheet…, Share link) and its gear.
 */
export function ChordPlayerPage() {
  const { t } = useTranslation('practice')
  const page = useChordPlayerPage()
  const { hand } = page
  return (
    <div className="flex flex-col">
      {hand ? (
        <ChordPlayer
          hand={hand}
          sheetId={page.sheetId}
          name={page.name}
          routes={page.routes}
          more={[
            {
              key: 'new',
              label: t('chordPlayer.newSheet'),
              icon: FilePlus2,
              group: t('chordPlayer.file'),
              onSelect: () => void page.startNew(),
            },
            {
              key: 'save',
              group: t('chordPlayer.file'),
              label: t('chordPlayer.saveAs'),
              icon: Save,
              onSelect: () => page.setSaving(''),
            },
            {
              key: 'share',
              group: t('chordPlayer.file'),
              label: t('chordPlayer.share'),
              icon: Link2,
              onSelect: () => void page.share(),
            },
          ]}
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
