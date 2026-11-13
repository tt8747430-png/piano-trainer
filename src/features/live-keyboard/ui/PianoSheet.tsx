import { Link } from '@tanstack/react-router'
import { Cable, SlidersHorizontal } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Piano2DPicture,
  Piano3DPicture,
  RadioCards,
  RowLink,
  SettingsGroup,
  Sheet,
  SheetContent,
  SwitchRow,
} from '@/shared/ui'

/** What stands in the keys' place, shown: the hands at the keys (3D) or the keys (2D). */
export type PianoShown = 'hands' | 'keys'

/**
 * The canvas's Piano sheet, one for every screen with keys (the Player's transport, Chords' bar),
 * opened by the screen's own button (`trigger`): Show the piano, then the 3D piano (the hands at the
 * keys) or the 2D keys as two cards, choosing one shows it; then the rows to the piano's one home,
 * All piano settings (its range, labels, sound), and to Connect a piano.
 */
export function PianoSheet({
  keys,
  hands,
  onKeys,
  onHands,
  trigger,
}: {
  keys: boolean
  hands: boolean
  onKeys: (shown: boolean) => void
  onHands: (shown: boolean) => void
  /** The screen's button that opens it, given how to open it. */
  trigger: (open: () => void) => ReactNode
}) {
  const { t } = useTranslation(['player', 'common'])
  const [open, setOpen] = useState(false)
  const shown: PianoShown = hands ? 'hands' : 'keys'
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {trigger(() => setOpen(true))}
      <SheetContent title={t('pianoSheet.title')}>
        <div className="flex flex-col gap-2">
          <SettingsGroup flush>
            <SwitchRow
              label={t('pianoSheet.show')}
              checked={keys}
              onCheckedChange={onKeys}
              className="px-4"
            />
          </SettingsGroup>
          <RadioCards
            label={t('pianoSheet.view')}
            value={shown}
            disabled={!keys}
            cards={[
              { value: 'hands', label: t('pianoSheet.hands'), picture: <Piano3DPicture /> },
              { value: 'keys', label: t('pianoSheet.keys'), picture: <Piano2DPicture /> },
            ]}
            onChange={(next) => onHands(next === 'hands')}
          />
          <SettingsGroup flush>
            <RowLink
              title={t('pianoSheet.all')}
              icon={SlidersHorizontal}
              paint="sand"
              render={<Link to="/settings/on-screen-piano" />}
            />
            <RowLink
              title={t('pianoSheet.connect')}
              icon={Cable}
              paint="sky"
              render={<Link to="/settings/connect-piano" />}
            />
          </SettingsGroup>
        </div>
      </SheetContent>
    </Sheet>
  )
}
