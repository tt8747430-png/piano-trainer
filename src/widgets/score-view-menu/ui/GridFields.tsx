import { ViewSwitch } from './ViewSwitch'

/**
 * The Grid's own part of the View (ADR 0108, Chordify's Lyrics button): its words under the beats
 * they are sung on, greyed where the music has none (`noWords`, why).
 */
export function GridFields({ noWords }: { noWords?: string }) {
  return (
    <div className="flex flex-col [&>[data-slot=switch-row]]:border-b-0">
      <ViewSwitch part="lyrics" reason={noWords} />
    </div>
  )
}
