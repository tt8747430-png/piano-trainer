import { createLucideIcon } from 'lucide-react'

/** Sort and filter (the boards' `FILTERI`): two sliders, never Settings, which is the gear. */
export const FilterIcon = createLucideIcon('sort-and-filter', [
  ['path', { d: 'M4 7h10M18 7h2M4 17h4M12 17h8', key: 'rails' }],
  ['circle', { cx: '16', cy: '7', r: '2', key: 'upper' }],
  ['circle', { cx: '10', cy: '17', r: '2', key: 'lower' }],
])
