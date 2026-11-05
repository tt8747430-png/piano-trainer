import { Piano } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/primitives/button'
import { HeldChord } from './HeldChord'
import { SustainControl } from './SustainControl'

export interface KeyboardToolsProps {
  /** The bar's look: a screen bar's soft round buttons, or the score's bar's toolbar (ADR 0115). */
  variant?: 'bar' | 'tool'
  /** The bar names the chord a hand holds: off where the screen names it itself (the Chord finder). */
  namesChords?: boolean
  /** The music playing holds the sustain down (its score's pedal mark): the Sustain lit with it. */
  sustained?: boolean
  /**
   * Where the bar is full on a phone held upright (the editor's: Undo, Redo, Play), the Sustain stands
   * from 40rem only; Space and a MIDI foot still hold the pedal there.
   */
  pedalsFromSm?: boolean
}

/**
 * The on-screen keyboard's controls in the screen's bar (R34, Songscription's): the chord held, the
 * pedals (`SustainControl`) while the keys show, and **Keyboard**, which shows or hides them; nothing
 * of the keyboard floats or hangs under its keys. `shown`/`onShow`: the screen's own choice (the
 * Player's).
 */
export function KeyboardTools({
  shown,
  onShow,
  variant = 'bar',
  namesChords = true,
  sustained = false,
  pedalsFromSm = false,
}: KeyboardToolsProps & { shown: boolean; onShow: (shown: boolean) => void }) {
  const { t } = useTranslation('common')
  return (
    <>
      {namesChords && shown ? <HeldChord /> : null}
      {shown ? (
        <span className={pedalsFromSm ? 'contents max-sm:hidden' : 'contents'}>
          <SustainControl variant={variant} sustained={sustained} />
        </span>
      ) : null}
      <Button
        variant={variant}
        size="icon"
        aria-label={t('keyboardTools.keyboard')}
        title={t('keyboardTools.keyboard')}
        aria-pressed={shown}
        onClick={() => onShow(!shown)}
      >
        <Piano aria-hidden />
      </Button>
    </>
  )
}
