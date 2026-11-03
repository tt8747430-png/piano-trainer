import { useTranslation } from 'react-i18next'
import {
  selectKeyboard,
  useSettings,
  useSettingsStoreApi,
  type KeyboardSettings,
} from '@/entities/settings'
import { setKeyboard } from '@/features/set-preference'
import { KEY_DOCKS, KEY_LENGTHS, KEY_SIZES, NAMED_KEYS, SWIPES } from '@/shared/lib'
import {
  DockPicture,
  FoldPicture,
  KeyLengthPicture,
  KeySizePicture,
  NoteNamesPicture,
  PictureChoice,
  SettingRows,
  SettingsGroup,
  SwipePicture,
  SwitchRow,
} from '@/shared/ui'
import { RailControlsField } from './RailControlsField'

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
 * The on-screen piano's settings (R21, R22), saved for every on-screen piano, in Settings' groups:
 * Look (key size, key length and note names as pictures of the keys; names on marked keys, chord
 * names), Position (where a page's keys sit, when they fold away), Playing (a swipe, playing what
 * is chosen) and the buttons the bar over the keys holds. Each row's ⓘ says what it does where its
 * name can't (ADR 0096). The computer keys have their own page (`TypingSwitch`).
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
            info={t('keyboardSettings.keySize.detail')}
            value={keyboard.keySize}
            options={KEY_SIZES.map((value) => ({
              value,
              label: t(`keyboardSettings.keySize.${value}`),
              picture: <KeySizePicture size={value} />,
            }))}
            onChange={(keySize) => setKeyboard(store, { keySize })}
          />
          <PictureChoice
            setting="keyboard.keyLength"
            label={t('keyboardSettings.keyLength.label')}
            value={keyboard.keyLength}
            options={KEY_LENGTHS.map((value) => ({
              value,
              label: t(`keyboardSettings.keyLength.${value}`),
              picture: <KeyLengthPicture length={value} />,
            }))}
            onChange={(keyLength) => setKeyboard(store, { keyLength })}
          />
          <PictureChoice
            setting="keyboard.namedKeys"
            label={t('keyboardSettings.namedKeys.label')}
            value={keyboard.namedKeys}
            options={NAMED_KEYS.map((value) => ({
              value,
              label: t(`keyboardSettings.namedKeys.${value}`),
              picture: <NoteNamesPicture names={value} />,
            }))}
            onChange={(namedKeys) => setKeyboard(store, { namedKeys })}
          />
          <SwitchRow
            setting="keyboard.markNotes"
            label={t('keyboardSettings.markNotes')}
            info={t('keyboardSettings.markNotesNote')}
            checked={keyboard.markNotes}
            onCheckedChange={(markNotes) => setKeyboard(store, { markNotes })}
          />
          <SwitchRow
            setting="keyboard.chordNames"
            label={t('keyboardSettings.chordNames')}
            info={t('keyboardSettings.chordNamesNote')}
            checked={keyboard.chordNames}
            onCheckedChange={(chordNames) => setKeyboard(store, { chordNames })}
          />
        </SettingRows>
      </SettingsGroup>
      <SettingsGroup title={t('settings:piano.place')}>
        <SettingRows>
          <PictureChoice
            setting="keyboard.dock"
            label={t('keyboardSettings.dock.label')}
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
            info={t('keyboardSettings.fold.detail')}
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
      <SettingsGroup title={t('settings:piano.play')}>
        <SettingRows>
          <PictureChoice
            setting="keyboard.swipe"
            label={t('keyboardSettings.swipe.label')}
            info={t('keyboardSettings.swipe.detail')}
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
            info={t('keyboardSettings.autoplayNote')}
            checked={keyboard.autoplay}
            onCheckedChange={(autoplay) => setKeyboard(store, { autoplay })}
          />
        </SettingRows>
      </SettingsGroup>
      <SettingsGroup title={t('settings:piano.bar')}>
        <RailControlsField />
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
      info={
        <>
          <p>{t('keyboardSettings.typingNote')}</p>
          <p>{t('keyboardSettings.typingHint')}</p>
        </>
      }
      checked={typing}
      onCheckedChange={(on) => setKeyboard(store, { typing: on })}
    />
  )
}
