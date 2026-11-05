import { useTranslation } from 'react-i18next'
import {
  selectKeyboard,
  useSettings,
  useSettingsStoreApi,
  type KeyboardSettings,
} from '@/entities/settings'
import { setKeyboard } from '@/features/set-preference'
import { KEY_DOCKS, KEY_LENGTHS, KEY_SIZES, NAMED_KEYS, PEDALS_SHOWN, SWIPES } from '@/shared/lib'
import {
  DockPicture,
  FoldPicture,
  KeyLengthPicture,
  KeySizePicture,
  NoteNamesPicture,
  PedalPaddle,
  PictureChoice,
  SettingRows,
  SettingsGroup,
  SwipePicture,
  SwitchRow,
} from '@/shared/ui'

/** Fold the keys (R21): never, on a phone on its side, or always; the two saved folds as one choice. */
const FOLDS = ['never', 'side', 'always'] as const
type Fold = (typeof FOLDS)[number]

const foldOf = ({ folded, foldedLandscape }: KeyboardSettings): Fold =>
  folded ? 'always' : foldedLandscape ? 'side' : 'never'

const FOLD_SETTINGS: Readonly<Record<Fold, Pick<KeyboardSettings, 'folded' | 'foldedLandscape'>>> =
  {
    never: { folded: false, foldedLandscape: false },
    side: { folded: false, foldedLandscape: true },
    always: { folded: true, foldedLandscape: true },
  }

/**
 * The on-screen piano's settings (R21, R22, R32), saved for every on-screen piano, ordered by what a
 * pianist changes most: Keys (size, note names, depth), While you play (the chord symbol, names on
 * highlighted keys, the pedals, the swipe, play on selection), then Placement (where a page docks
 * the keys, when they hide). Each option says what it does in one line under its name; choices of
 * look are pictures of the keys. The computer keys have their own page (`TypingSwitch`).
 */
export function KeyboardSettingsFields() {
  const { t } = useTranslation(['common', 'settings'])
  const store = useSettingsStoreApi()
  const keyboard = useSettings(selectKeyboard)
  return (
    <>
      <SettingsGroup title={t('settings:piano.look')}>
        <SettingRows>
          <PictureChoice
            setting="keyboard.keySize"
            label={t('keyboardSettings.keySize.label')}
            description={t('keyboardSettings.keySize.detail')}
            value={keyboard.keySize}
            options={KEY_SIZES.map((value) => ({
              value,
              label: t(`keyboardSettings.keySize.${value}`),
              picture: <KeySizePicture size={value} />,
            }))}
            onChange={(keySize) => setKeyboard(store, { keySize })}
          />
          <PictureChoice
            setting="keyboard.namedKeys"
            label={t('keyboardSettings.namedKeys.label')}
            description={t('keyboardSettings.namedKeys.detail')}
            value={keyboard.namedKeys}
            options={NAMED_KEYS.map((value) => ({
              value,
              label: t(`keyboardSettings.namedKeys.${value}`),
              picture: <NoteNamesPicture names={value} />,
            }))}
            onChange={(namedKeys) => setKeyboard(store, { namedKeys })}
          />
          <PictureChoice
            setting="keyboard.keyLength"
            label={t('keyboardSettings.keyLength.label')}
            description={t('keyboardSettings.keyLength.detail')}
            value={keyboard.keyLength}
            options={KEY_LENGTHS.map((value) => ({
              value,
              label: t(`keyboardSettings.keyLength.${value}`),
              picture: <KeyLengthPicture length={value} />,
            }))}
            onChange={(keyLength) => setKeyboard(store, { keyLength })}
          />
        </SettingRows>
      </SettingsGroup>
      <SettingsGroup title={t('settings:piano.play')}>
        <SettingRows>
          <SwitchRow
            setting="keyboard.chordNames"
            label={t('keyboardSettings.chordNames')}
            description={t('keyboardSettings.chordNamesNote')}
            checked={keyboard.chordNames}
            onCheckedChange={(chordNames) => setKeyboard(store, { chordNames })}
          />
          <SwitchRow
            setting="keyboard.markNotes"
            label={t('keyboardSettings.markNotes')}
            description={t('keyboardSettings.markNotesNote')}
            checked={keyboard.markNotes}
            onCheckedChange={(markNotes) => setKeyboard(store, { markNotes })}
          />
          <PictureChoice
            setting="keyboard.pedals"
            label={t('keyboardSettings.pedals.label')}
            description={t('keyboardSettings.pedals.detail')}
            value={keyboard.pedals}
            options={PEDALS_SHOWN.map((value) => ({
              value,
              label: t(`keyboardSettings.pedals.${value}`),
              picture: (
                <span className="flex items-end gap-0.5">
                  {Array.from({ length: value === 'all' ? 3 : 1 }, (_, at) => (
                    <PedalPaddle key={at} down={false} className="h-5 w-7" />
                  ))}
                </span>
              ),
            }))}
            onChange={(pedals) => setKeyboard(store, { pedals })}
          />
          <PictureChoice
            setting="keyboard.swipe"
            label={t('keyboardSettings.swipe.label')}
            description={t('keyboardSettings.swipe.detail')}
            value={keyboard.swipe}
            options={SWIPES.map((value) => ({
              value,
              label: t(`keyboardSettings.swipe.${value}`),
              picture: <SwipePicture swipe={value} />,
            }))}
            onChange={(swipe) => setKeyboard(store, { swipe })}
          />
          <SwitchRow
            setting="keyboard.autoplay"
            label={t('keyboardSettings.autoplay')}
            description={t('keyboardSettings.autoplayNote')}
            checked={keyboard.autoplay}
            onCheckedChange={(autoplay) => setKeyboard(store, { autoplay })}
          />
        </SettingRows>
      </SettingsGroup>
      <SettingsGroup title={t('settings:piano.place')}>
        <SettingRows>
          <PictureChoice
            setting="keyboard.dock"
            label={t('keyboardSettings.dock.label')}
            description={t('keyboardSettings.dock.detail')}
            value={keyboard.dock}
            options={KEY_DOCKS.map((value) => ({
              value,
              label: t(`keyboardSettings.dock.${value}`),
              picture: <DockPicture dock={value} />,
            }))}
            onChange={(dock) => setKeyboard(store, { dock })}
          />
          <PictureChoice
            setting="keyboard.folded"
            label={t('keyboardSettings.fold.label')}
            description={t('keyboardSettings.fold.detail')}
            value={foldOf(keyboard)}
            options={FOLDS.map((value) => ({
              value,
              label: t(`keyboardSettings.fold.${value}`),
              picture: <FoldPicture fold={value} />,
            }))}
            onChange={(fold) => setKeyboard(store, FOLD_SETTINGS[fold])}
          />
        </SettingRows>
      </SettingsGroup>
    </>
  )
}

/** Whether the computer keys play the on-screen piano (R22): Settings › Computer keys. */
export function TypingSwitch() {
  const { t } = useTranslation('common')
  const store = useSettingsStoreApi()
  const typing = useSettings((state) => selectKeyboard(state).typing)
  return (
    <SwitchRow
      setting="keyboard.typing"
      label={t('keyboardSettings.typing')}
      description={t('keyboardSettings.typingNote')}
      info={t('keyboardSettings.typingHint')}
      checked={typing}
      onCheckedChange={(on) => setKeyboard(store, { typing: on })}
    />
  )
}
