import { useTranslation } from 'react-i18next'
import { SHEET_NAME_MAX } from '@/entities/chord-sheet'
import { ShareChordSheet } from '@/features/share-chord-sheet'
import { NewSheet } from '@/shared/ui'
import { ChordPlayer } from '@/widgets/chord-player'
import { useChordPlayerPage } from '../model/use-chord-player-page'

/**
 * The Chord player (`/practice/chord-player`, canvas R77): a screen of its own, the widget's band, rail
 * and chart, given the page's acts on the sheet's file (Save as my chord sheet… for the sheet in hand,
 * Share…, New sheet) and its view in the URL (the rail's panel, the keys).
 */
export function ChordPlayerPage() {
  const { t } = useTranslation('practice')
  const page = useChordPlayerPage()
  const { hand } = page
  return (
    <>
      {hand ? (
        <ChordPlayer
          hand={hand}
          sheetId={page.sheetId}
          name={page.name}
          routes={page.routes}
          panel={page.panel}
          onPanel={page.setPanel}
          keysShown={page.keysShown}
          onKeys={page.setKeysShown}
          onNew={page.startNew}
          onSaveAs={page.startSaving}
          onShare={page.share}
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
    </>
  )
}
