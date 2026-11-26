import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { selectChordFinder, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { useMidiSummary } from '@/features/connect-midi'
import { setChordFinder } from '@/features/set-preference'
import { GroupAction, GroupLink, GroupRows, GroupSwitch, sayUndo } from '@/shared/ui'

/**
 * Chord finder settings, as ChordFinderLaptop draws them (`CF_SET66`): one group of what each
 * reading shows (an inversion as a slash chord, the keys that hold the chord, the key's scale on the
 * keyboard), whether the chords played are kept, and Forget them, at once with Undo in its toast;
 * then MIDI devices, its home's link. Forget is dimmed while nothing is kept.
 */
export function ChordFinderSettings({
  canForget,
  onForget,
}: {
  canForget: boolean
  /** Forgets the chords played and returns what brings them back. */
  onForget: () => () => void
}) {
  const { t } = useTranslation(['practice', 'settings'])
  const store = useSettingsStoreApi()
  const finder = useSettings(selectChordFinder)
  const midi = useMidiSummary()
  return (
    <>
      <GroupRows label={t('practice:chordFinder.settings')}>
        <GroupSwitch
          setting="chordFinder.slash"
          label={t('practice:chordFinder.slash')}
          checked={finder.slash}
          onCheckedChange={(slash) => setChordFinder(store, { slash })}
        />
        <GroupSwitch
          setting="chordFinder.inKeys"
          label={t('practice:chordFinder.inKeysShown')}
          checked={finder.inKeys}
          onCheckedChange={(inKeys) => setChordFinder(store, { inKeys })}
        />
        <GroupSwitch
          setting="chordFinder.scale"
          label={t('practice:chordFinder.scaleShown')}
          checked={finder.scale}
          onCheckedChange={(scale) => setChordFinder(store, { scale })}
        />
        <GroupSwitch
          setting="chordFinder.remember"
          label={t('practice:chordFinder.remember')}
          checked={finder.remember}
          onCheckedChange={(remember) => setChordFinder(store, { remember })}
        />
        <GroupAction
          label={t('practice:chordFinder.forget')}
          disabled={!canForget}
          onClick={() => {
            const undo = onForget()
            sayUndo(t('practice:chordFinder.forgotten'), undo)
          }}
        />
      </GroupRows>
      <GroupRows>
        <GroupLink
          label={t('settings:pages.connectPiano')}
          value={midi}
          render={<Link to="/settings/connect-piano" />}
        />
      </GroupRows>
    </>
  )
}
