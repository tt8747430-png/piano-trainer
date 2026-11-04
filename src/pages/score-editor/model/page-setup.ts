import { fullLayout, NOTE_SPACING, pageMm, type PieceLayout } from '@/entities/piece'
import type { PageSetup } from '@/shared/ui/score'

/** Millimetres in a centimetre: the Layout's margins are typed in centimetres (Flat's). */
const MM_PER_CM = 10

/**
 * The printed page a score's Layout sets (A40), as the engraver takes it: the page turned as it is,
 * its margins in millimetres, the notes' spacing from Compact (0) to Wide (1), the bars a system.
 */
export function pageSetup(layout: PieceLayout | undefined): PageSetup {
  const full = fullLayout(layout)
  const { width, height } = pageMm(layout)
  return {
    width,
    height,
    margins: {
      top: full.margins.top * MM_PER_CM,
      bottom: full.margins.bottom * MM_PER_CM,
      left: full.margins.left * MM_PER_CM,
      right: full.margins.right * MM_PER_CM,
    },
    staffMm: full.staffSize,
    staffSpace: full.staffSpace,
    systemSpace: full.systemSpace,
    noteSpacing: (full.noteSpacing - NOTE_SPACING.min) / (NOTE_SPACING.max - NOTE_SPACING.min),
    measureNumbers: full.measureNumbers,
    hideEmpty: full.hideEmpty,
    font: full.font,
    systemBars: full.barsPerLine ?? undefined,
  }
}
