import { useFoldKeys, type KeysScreen } from '../model/use-fold-keys'
import { KeyboardTools, type KeyboardToolsProps } from './KeyboardTools'

/**
 * A page's keyboard controls (`KeyboardTools`) over its saved fold (`useFoldKeys`): the keys a page
 * docks (`PinnedKeyboard`) show and hide from its bar, upright and on its side apart.
 */
export function PageKeyboardTools({
  screen = 'reading',
  ...tools
}: KeyboardToolsProps & { screen?: KeysScreen }) {
  const { folded, fold } = useFoldKeys(screen)
  return <KeyboardTools shown={!folded} onShow={(shown) => fold(!shown)} {...tools} />
}
