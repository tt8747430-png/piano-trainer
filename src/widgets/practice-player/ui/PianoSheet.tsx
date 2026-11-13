import { Link } from '@tanstack/react-router'
import { Cable, EyeOff, Hand, Piano, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FloatingBarButton,
  RadioCards,
  RowLink,
  SettingsGroup,
  Sheet,
  SheetContent,
  SwitchRow,
} from '@/shared/ui'
import { DOCK_CAPTIONED } from './dock-sizes'

/** What stands in the keys' place, shown: the hands at the keys (3D) or the keys (2D). */
type Shown = 'hands' | 'keys'

/**
 * The transport's Keyboard (its canvas's Piano sheet): its button says what stands in the keys'
 * place (2D · 3D · Off) under its picture. The sheet: Show the piano, then the 3D piano (the hands at
 * the keys) or the 2D keys as two cards, choosing one shows it; then the rows to the piano's one home,
 * All piano settings (its range, labels, sound), and to Connect a piano.
 */
export function PianoSheet({
  keys,
  hands,
  onKeys,
  onHands,
}: {
  keys: boolean
  hands: boolean
  onKeys: (shown: boolean) => void
  onHands: (shown: boolean) => void
}) {
  const { t } = useTranslation(['player', 'common'])
  const [open, setOpen] = useState(false)
  const shown: Shown = hands ? 'hands' : 'keys'
  const Icon = !keys ? EyeOff : hands ? Hand : Piano
  const label = t('common:keyboardTools.keyboard')
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <FloatingBarButton
        label={label}
        caption={t(`common:keyboardTools.short.${keys ? shown : 'off'}`)}
        aria-haspopup="dialog"
        className={DOCK_CAPTIONED}
        onClick={() => setOpen(true)}
      >
        <Icon aria-hidden />
      </FloatingBarButton>
      <SheetContent title={t('pianoSheet.title')}>
        <div className="flex flex-col gap-5">
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
            cards={[
              { value: 'hands', label: t('pianoSheet.hands'), icon: Hand },
              { value: 'keys', label: t('pianoSheet.keys'), icon: Piano },
            ]}
            onChange={(next) => {
              onHands(next === 'hands')
              onKeys(true)
            }}
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
