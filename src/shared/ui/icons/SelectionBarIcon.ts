import { createLucideIcon } from 'lucide-react'

/**
 * The selection toolbar (the canvas's Settings picture): a bar of actions under the selected rows, drawn
 * as lucide draws its icons, for the toolbar's Settings page.
 */
export const SelectionBarIcon = createLucideIcon('selection-bar', [
  ['rect', { x: '3', y: '14', width: '18', height: '6', rx: '3', key: 'bar' }],
  ['path', { d: 'M7 17h.01M12 17h.01M17 17h.01M5 4h14M5 9h9', key: 'rows' }],
])
