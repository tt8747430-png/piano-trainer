import { useTranslation } from 'react-i18next'
import { SHEET_NAME_MAX } from '@/entities/chord-sheet'
import { ShareChordSheet } from '@/features/share-chord-sheet'
import { NewSheet } from '@/shared/ui'
import { ChordPlayer } from '@/widgets/chord-player'
import { useChordPlayerPage } from '../model/use-chord-player-page'
import { ChordPlayerSettings } from './ChordPlayerSettings'

/**
 * The Chord player (`/practice/chord-player`, canvas R76): the widget's bar, chart and panels, given
 * the page's acts on the sheet's file (Save as my chord sheet… for the sheet in hand, Share…, New
 * sheet), Edit layout in the URL, and its gear.
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
          editing={page.editing}
          onEditing={page.setEditing}
          onNew={() => void page.startNew()}
          more={[
            {
              key: 'save',
              group: 'draft',
              unnamed: true,
              label: t('chordPlayer.saveAs'),
              // The sheet in hand is kept by naming it; one of mine saves its draft.
              hidden: page.sheetId !== undefined,
              onSelect: page.startSaving,
            },
            { key: 'share', label: t('chordPlayer.shareMenu'), onSelect: page.share },
          ]}
          settings={
            <ChordPlayerSettings
              sheetId={page.sheetId}
              onEditLayout={() => page.setEditing(true)}
            />
          }
        />
      ) : null}
      {page.saved ? (
        <ShareChordSheet open={page.sharing} onOpenChange={page.setSharing} sheet={page.saved} />
      ) : null}
      <NewSheet
        open={page.saving !== null}
        onOpenChange={(open) => (open ? page.startSaving() : page.closeSaving())}
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
