import { createLucideIcon } from 'lucide-react'

/**
 * The piano's keys (the canvas's `KEYSI`): a keyboard seen from above, its frame and three keys, drawn
 * as lucide draws its icons. One glyph for the piano wherever it is shown or opened (the Piano sheet's
 * buttons, the keys' place, the editor's keys).
 */
export const KeysIcon = createLucideIcon('piano-keys', [
  ['rect', { x: '3', y: '5', width: '18', height: '14', rx: '2', key: 'frame' }],
  ['path', { d: 'M8 5v8M12 5v14M16 5v8', key: 'keys' }],
])
