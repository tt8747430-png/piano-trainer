import { useMemo } from 'react'
import { useLibrary } from '@/entities/library'
import { entryTitles, isPiece, shownCredits, useCreditNames, type Entry } from '@/entities/piece'
import { useLocale } from '@/shared/i18n'
import { incipitSteps } from '../model/incipit'
import { PieceCover } from './PieceCover'

/** The page's box, as the Songs board's shelf draws it (`cover`): 150 wide, 96 tall. */
const WIDTH = 150
const HEIGHT = 96
/** The staff's lines, top down, and the bottom line its notes are counted from. */
const LINES = [46, 51, 56, 61, 66]
const MIDDLE = 56
/** A step of the staff, a line to the next space. */
const STEP = 2.5
/** The title's room across the page, in font sizes times letters: a long title draws smaller. */
const TITLE_ROOM = 250

/**
 * A song's cover on Songs' Continue shelf (canvas 133): its first page in small, a printed page in
 * both themes, its title centred in serif over who wrote it (a folk tune's word said in the
 * learner's language), then a staff with the clef and the
 * tune's first notes. The picture the learner chose instead, where they chose one. Hidden from a
 * screen reader: the card names the song.
 */
export function PieceShelfCover({ entry }: { entry: Entry }) {
  const locale = useLocale()
  const look = useLibrary((state) => state.songLooks[entry.id])
  const said = useCreditNames()
  const steps = useMemo(() => (isPiece(entry) ? incipitSteps(entry, 7) : []), [entry])
  if (look) return <PieceCover entry={entry} decorative className="aspect-150/96 w-full" />
  const [writer] = isPiece(entry) ? shownCredits(entry) : []
  const title = entryTitles(entry, locale).primary
  const gap = steps.length > 0 ? (WIDTH - 44) / steps.length : 0
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="block w-full rounded-thumb bg-(--print-paper) text-(--print-ink) shadow-[0_0_0_1px_var(--color-border),0_6px_14px_-8px_color-mix(in_oklab,var(--shade)_25%,transparent)]"
    >
      <text
        x={WIDTH / 2}
        y={20}
        textAnchor="middle"
        fontSize={Math.min(12, TITLE_ROOM / title.length)}
        fill="currentColor"
        className="font-display"
      >
        {title}
      </text>
      {writer && 'names' in writer ? (
        <text x={WIDTH / 2} y={32} textAnchor="middle" fontSize={7} className="fill-(--print-soft)">
          {said(writer.names)}
        </text>
      ) : null}
      {LINES.map((y) => (
        <path key={y} d={`M8 ${y}H${WIDTH - 8}`} stroke="currentColor" strokeWidth={0.6} />
      ))}
      <text x={9} y={70} fontSize={24} fill="currentColor" className="font-music">
        𝄞
      </text>
      {steps.map((step, i) => (
        <ellipse
          key={i}
          cx={30 + i * gap}
          cy={MIDDLE - step * STEP}
          rx={3}
          ry={2.3}
          fill="currentColor"
        />
      ))}
    </svg>
  )
}
