import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { selectKeyboard, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setKeyboard } from '@/features/set-preference'
import { KEY_DOCKS, KEY_SIZES, NAMED_KEYS, PEDALS_SHOWN, SWIPES } from '@/shared/lib'
import { MIDDLE_OCTAVES } from '@/shared/lib/music'
import { GroupSegmented, SettingsGroup, SwitchRow } from '@/shared/ui'
import { LiveKeyboard } from './LiveKeyboard'

/** Key size as the board orders it: the usual first, then Large, then the whole piano. */
const KEY_SIZE_ORDER = [
  'fit',
  'large',
  'piano',
] as const satisfies readonly (typeof KEY_SIZES)[number][]

/**
 * The keys as they stand (the board's KEYPIC): the real piano over two octaves from middle C, in a
 * card, with the names and pedals chosen below it, playing what is tapped.
 */
function KeysPreview() {
  return (
    <div className="card overflow-hidden p-3">
      <LiveKeyboard range={MIDDLE_OCTAVES} height={96} spacePedal={false} />
    </div>
  )
}

/**
 * The on-screen piano's settings (the board's P_PIANO), saved for every on-screen piano, ordered by
 * what a pianist changes most: the keys previewed, then Keys (Key size, Note names, Pedals), the
 * page's Sound (`sound`), Display (the chord symbol, names on highlighted keys), While you play (the
 * swipe, play on selection) and Placement; each choice a segmented row, as the board draws them.
 * The keys' window is moved and sized where it floats, and showing them is the bar's Keyboard.
 */
export function KeyboardSettingsFields({ sound }: { sound?: ReactNode }) {
  const { t } = useTranslation(['common', 'settings'])
  const store = useSettingsStoreApi()
  const keyboard = useSettings(selectKeyboard)
  return (
    <>
      <KeysPreview />
      <SettingsGroup flush title={t('settings:piano.essentials')}>
        <GroupSegmented
          setting="keyboard.keySize"
          label={t('keyboardSettings.keySize.label')}
          value={keyboard.keySize}
          options={KEY_SIZE_ORDER.map((value) => ({
            value,
            label: t(`keyboardSettings.keySize.${value}`),
          }))}
          onChange={(keySize) => setKeyboard(store, { keySize })}
        />
        <GroupSegmented
          setting="keyboard.namedKeys"
          label={t('keyboardSettings.namedKeys.label')}
          value={keyboard.namedKeys}
          options={NAMED_KEYS.map((value) => ({
            value,
            label: t(`keyboardSettings.namedKeys.${value}`),
          }))}
          onChange={(namedKeys) => setKeyboard(store, { namedKeys })}
        />
        <GroupSegmented
          setting="keyboard.pedals"
          label={t('keyboardSettings.pedals.label')}
          value={keyboard.pedals}
          options={PEDALS_SHOWN.map((value) => ({
            value,
            label: t(`keyboardSettings.pedals.${value}`),
          }))}
          onChange={(pedals) => setKeyboard(store, { pedals })}
        />
      </SettingsGroup>
      {sound}
      <SettingsGroup flush title={t('settings:piano.look')}>
        <SwitchRow
          setting="keyboard.chordNames"
          label={t('keyboardSettings.chordNames')}
          checked={keyboard.chordNames}
          onCheckedChange={(chordNames) => setKeyboard(store, { chordNames })}
        />
        <SwitchRow
          setting="keyboard.markNotes"
          label={t('keyboardSettings.markNotes')}
          checked={keyboard.markNotes}
          onCheckedChange={(markNotes) => setKeyboard(store, { markNotes })}
        />
      </SettingsGroup>
      <SettingsGroup flush title={t('settings:piano.play')}>
        <GroupSegmented
          setting="keyboard.swipe"
          label={t('keyboardSettings.swipe.label')}
          value={keyboard.swipe}
          options={SWIPES.map((value) => ({
            value,
            label: t(`keyboardSettings.swipe.${value}`),
          }))}
          onChange={(swipe) => setKeyboard(store, { swipe })}
        />
        <SwitchRow
          setting="keyboard.autoplay"
          label={t('keyboardSettings.autoplay')}
          checked={keyboard.autoplay}
          onCheckedChange={(autoplay) => setKeyboard(store, { autoplay })}
        />
      </SettingsGroup>
      <SettingsGroup flush title={t('settings:piano.place')}>
        <GroupSegmented
          setting="keyboard.dock"
          label={t('keyboardSettings.dock.label')}
          value={keyboard.dock}
          options={KEY_DOCKS.map((value) => ({
            value,
            label: t(`keyboardSettings.dock.${value}`),
          }))}
          onChange={(dock) => setKeyboard(store, { dock })}
        />
      </SettingsGroup>
    </>
  )
}

/** Whether the computer keys play the on-screen piano: On-screen piano's Computer keyboard group. */
export function TypingSwitch() {
  const { t } = useTranslation('common')
  const store = useSettingsStoreApi()
  const typing = useSettings((state) => selectKeyboard(state).typing)
  return (
    <SwitchRow
      setting="keyboard.typing"
      label={t('keyboardSettings.typing')}
      checked={typing}
      onCheckedChange={(on) => setKeyboard(store, { typing: on })}
    />
  )
}
