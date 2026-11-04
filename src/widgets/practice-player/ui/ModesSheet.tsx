import { MODE_LOOK } from '../model/mode-look'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { selectOtherHand, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { PRACTICE_MODES, type PracticeMode } from '@/features/practice'
import { setOtherHand } from '@/features/set-preference'
import { cn } from '@/shared/lib'
import type { Hands } from '@/shared/lib/schedule'
import { PAINT, Segmented, Sheet, SheetContent, SwitchRow } from '@/shared/ui'
import { RadioGroup, RadioGroupItem } from '@/shared/ui/primitives/radio-group'

/** Practice's hands, left to right as they sit at the keys. */
const HANDS: readonly Hands[] = ['lh', 'both', 'rh']

/**
 * The Modes sheet (R29 B8, "What would you like to do?"): four cards, each its picture, its name, one
 * line of what it does (D11) and a radio; Practice opens its hands inline (Left · Both · Right) and
 * Hear the other hand, its one home (A35). A mode that listens to the keys says so where no piano is
 * there to play (`piano` false).
 */
export function ModesSheet({
  open,
  onOpenChange,
  mode,
  hands,
  twoHands = true,
  piano = true,
  onMode,
  onHands,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: PracticeMode
  hands: Hands
  /** Whether the music has both hands: Practice's hands are offered only then. */
  twoHands?: boolean
  /** Whether a piano is there to play: a MIDI keyboard connected, or the keys on screen. */
  piano?: boolean
  onMode: (mode: PracticeMode) => void
  onHands: (hands: Hands) => void
}) {
  const { t } = useTranslation('player')
  const id = useId()
  const settings = useSettingsStoreApi()
  const hearOther = useSettings((state) => selectOtherHand(state).play)
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title={t('modes.title')}>
        <RadioGroup
          aria-label={t('modes.title')}
          value={mode}
          onValueChange={(next) => onMode(next as PracticeMode)}
          className="gap-3"
        >
          {PRACTICE_MODES.map((each) => {
            const { icon: Icon, paint } = MODE_LOOK[each]
            const optionId = `${id}-${each}`
            const chosen = each === mode
            return (
              <div
                key={each}
                data-chosen={chosen || undefined}
                className="card flex flex-col gap-3 px-4 py-3 data-chosen:ring-2 data-chosen:ring-primary"
              >
                <label htmlFor={optionId} className="flex cursor-pointer items-center gap-3">
                  <span
                    aria-hidden
                    className={cn(
                      'grid size-10 shrink-0 place-items-center rounded-control',
                      PAINT[paint].fill,
                      PAINT[paint].ink,
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="font-semibold">{t(`modes.${each}.name`)}</span>
                    <span className="text-sm break-words text-muted-foreground">
                      {each !== 'listen' && !piano
                        ? t('modes.needsPiano')
                        : t(`modes.${each}.line`)}
                    </span>
                  </span>
                  <RadioGroupItem id={optionId} value={each} />
                </label>
                {each === 'practice' && chosen ? (
                  <div className="flex flex-col gap-1 border-t border-hairline pt-3">
                    {twoHands ? (
                      <Segmented
                        label={t('hands')}
                        value={hands}
                        options={HANDS.map((value) => ({
                          value,
                          label: t(`modes.hands.${value}`),
                        }))}
                        onChange={onHands}
                      />
                    ) : null}
                    <SwitchRow
                      setting="otherHand.play"
                      label={t('settingsPage.playOther')}
                      info={t('settingsPage.playOtherInfo')}
                      checked={hearOther}
                      onCheckedChange={(play) => setOtherHand(settings, { play })}
                      className="border-b-0 px-0"
                    />
                  </div>
                ) : null}
              </div>
            )
          })}
        </RadioGroup>
      </SheetContent>
    </Sheet>
  )
}
