import { useTranslation } from 'react-i18next'
import { useShortcuts, type Shortcut } from '@/shared/lib/shortcuts'
import { PLAYER_KEYS } from './player-keys'
import type { PracticeView } from './practice-view'
import { stepTempo } from './speeds'
import type { PracticePlayer } from './use-practice-player'

/**
 * The Player from the computer's keys: Space plays or stops, the arrows step and (in Listen) take
 * the tempo 5% up or down, R loops the bar, Home goes back to the first bar; Shift with ← → moves the
 * loop's far end a bar, with Home or End to the first or last bar, as the editor's Shift extends what
 * is chosen (ADR 0088); Escape lets go of the loop, else closes.
 */
export function usePlayerShortcuts(
  player: PracticePlayer,
  view: PracticeView,
  onClose: () => void,
): void {
  const { t } = useTranslation('player')
  const { practice } = player
  const { playing } = practice.state
  const pace = (by: -1 | 1): Shortcut => ({
    label: t(by > 0 ? 'shortcuts.faster' : 'shortcuts.slower'),
    combo: by > 0 ? PLAYER_KEYS.faster : PLAYER_KEYS.slower,
    repeat: true,
    // From the tempo heard: speed training's climb may be past the one chosen.
    run: () => player.listenAt(stepTempo(player.shownTempo, player.ownTempo, by)),
  })
  useShortcuts(t('shortcuts.group'), [
    {
      label: t('shortcuts.playStop'),
      combo: PLAYER_KEYS.play,
      run: playing ? practice.stop : practice.play,
    },
    { label: t('shortcuts.back'), combo: PLAYER_KEYS.back, run: practice.prev },
    { label: t('shortcuts.next'), combo: PLAYER_KEYS.next, run: practice.next },
    // Wait mode has no tempo to step.
    ...(view.mode === 'listen' ? [pace(1), pace(-1)] : []),
    { label: t('shortcuts.loop'), combo: PLAYER_KEYS.loop, run: player.toggleLoop },
    {
      label: t('shortcuts.start'),
      combo: PLAYER_KEYS.start,
      run: () => practice.jumpToBeatGroup(0),
    },
    {
      label: t('shortcuts.reachBack'),
      combo: PLAYER_KEYS.reachBack,
      repeat: true,
      run: () => player.reachLoop('bar', -1),
    },
    {
      label: t('shortcuts.reachNext'),
      combo: PLAYER_KEYS.reachNext,
      repeat: true,
      run: () => player.reachLoop('bar', 1),
    },
    {
      label: t('shortcuts.reachStart'),
      combo: PLAYER_KEYS.reachStart,
      run: () => player.reachLoop('end', -1),
    },
    {
      label: t('shortcuts.reachEnd'),
      combo: PLAYER_KEYS.reachEnd,
      run: () => player.reachLoop('end', 1),
    },
    {
      label: t('shortcuts.close'),
      combo: PLAYER_KEYS.close,
      run: () => (player.loop ? player.setLoop(null) : onClose()),
    },
  ])
}
