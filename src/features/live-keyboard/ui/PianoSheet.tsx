import { Link } from '@tanstack/react-router'
import { useState, type ReactElement } from 'react'
import { selectKeyboard, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { setKeyboard } from '@/features/set-preference'
import {
  CAMERA_ANGLES,
  CHORD_LABELS,
  type CameraAngle,
  type ChordLabels,
  LAPTOP,
  useMediaQuery,
  useOnline,
} from '@/shared/lib'
import { printedKeyName, type Midi } from '@/shared/lib/music'
import { KeyStrip } from './KeyStrip'
import { useTranslation } from 'react-i18next'
import {
  Piano2DPicture,
  Piano3DPicture,
  RadioCards,
  RowLink,
  SettingsGroup,
  Sheet,
  Segmented,
  SheetContent,
  SheetTrigger,
  SwitchRow,
  PanelPopover,
} from '@/shared/ui'

/** The canvas's BLOCK: a card, 12 round, 12 16 16 inside, its name over its choice, 8 apart. */
const BLOCK = 'flex flex-col gap-2 rounded-xl bg-card px-4 pt-3 pb-4 ring-1 ring-foreground/7'

/** What stands in the keys' place, shown: the hands at the keys (3D) or the keys (2D). */
export type PianoShown = 'hands' | 'keys'

/**
 * The canvas's Piano sheet, one for every screen with keys (the Player's transport, Chords' bar),
 * opened by the screen's own button (`trigger`): Show the piano, then the 3D piano (the hands at the
 * keys) or the 2D keys as two cards, choosing one shows it; then Labels (a chord's own where the
 * screen offers them, else Note names | None, every on-screen piano's); then the Sound and the MIDI
 * keyboard, each a row to its home with its value now. On a laptop it is the boards' card: over its
 * button where that is the transport's (`anchored`, PlayerDesk's, 380 wide), else hung at the bar's
 * right (Chords' and the Practice pages').
 */
export function PianoSheet<R extends string>({
  keys,
  hands,
  onKeys,
  onHands,
  trigger,
  anchored = false,
  labels,
  range,
  stage,
  midi,
}: {
  keys: boolean
  onKeys: (shown: boolean) => void
  /**
   * The hands at the keys (3D) or the keys (2D), as two cards, where the screen offers the hands (the
   * Player, Chords); without it the sheet shows the keys alone (the Chord finder's, played on).
   */
  hands?: boolean
  onHands?: (shown: boolean) => void
  /** The screen's button that opens it (and, over a laptop's transport, closes it). */
  trigger: ReactElement
  /** Opened from the transport: on a laptop a popover over its button, as PlayerDesk's Piano. */
  anchored?: boolean
  /** What the keys carry, where the screen offers a choice (Chords): the canvas's Labels. */
  labels?: { readonly value: ChordLabels; readonly onChange: (labels: ChordLabels) => void }
  /** How many keys it shows and which, where the screen offers a choice (Chords): the canvas's Range. */
  range?: {
    readonly value: R
    /** Its choices, each named (Chords' Fit the chord · 2 octaves · 4 octaves; the Player's keys). */
    readonly options: readonly { readonly value: R; readonly label: string }[]
    readonly low: Midi
    readonly high: Midi
    readonly onChange: (range: R) => void
    /** Where the strip is a slider (Chords'): the white keys it moves, and where it was dragged to. */
    readonly move?: { readonly whites: number; readonly onMove: (from: Midi) => void }
  }
  /** The 3D piano's own rows, under its card while it is chosen (Chords): Angle, Hands on the keys. */
  stage?: {
    readonly angle: CameraAngle
    readonly onAngle: (angle: CameraAngle) => void
    readonly handsOnKeys: boolean
    readonly onHandsOnKeys: (shown: boolean) => void
  }
  /** The MIDI keyboard heard, in a word or its name (`useMidiSummary`). */
  midi: string
}) {
  const { t } = useTranslation(['player', 'common'])
  const [open, setOpen] = useState(false)
  const online = useOnline()
  const store = useSettingsStoreApi()
  const named = useSettings((state) => selectKeyboard(state).namedKeys !== 'none')
  const laptop = useMediaQuery(LAPTOP)
  const shown: PianoShown = hands ? 'hands' : 'keys'
  const body = (
    <div className="flex flex-col gap-2">
      <SettingsGroup flush>
        <SwitchRow label={t('pianoSheet.show')} checked={keys} onCheckedChange={onKeys} />
      </SettingsGroup>
      {onHands ? (
        <RadioCards
          label={t('pianoSheet.view')}
          value={shown}
          disabled={!keys}
          cards={[
            {
              value: 'hands',
              label: t('pianoSheet.hands'),
              picture: <Piano3DPicture />,
              children: stage ? (
                <>
                  {/* The canvas's rows in the chosen card, a honey hairline over each. */}
                  <div className="flex min-h-12 items-center justify-between gap-3 px-4 py-2 shadow-[inset_0_1px_0_rgb(176_122_42/0.3)]">
                    <span className="text-base text-foreground">{t('pianoSheet.angle')}</span>
                    <div className="w-42 flex-none">
                      <Segmented
                        label={t('pianoSheet.angle')}
                        value={stage.angle}
                        options={CAMERA_ANGLES.map((each) => ({
                          value: each,
                          label: t(`pianoSheet.angles.${each}`),
                        }))}
                        onChange={stage.onAngle}
                      />
                    </div>
                  </div>
                  <SwitchRow
                    label={t('pianoSheet.handsOnKeys')}
                    checked={stage.handsOnKeys}
                    onCheckedChange={stage.onHandsOnKeys}
                    className="px-4 shadow-[inset_0_1px_0_rgb(176_122_42/0.3)]"
                  />
                </>
              ) : undefined,
            },
            { value: 'keys', label: t('pianoSheet.keys'), picture: <Piano2DPicture /> },
          ]}
          onChange={(next) => onHands(next === 'hands')}
        />
      ) : null}
      {range ? (
        <div className={`${BLOCK} ${keys ? '' : 'pointer-events-none opacity-45'}`}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-base text-foreground">{t('pianoSheet.range')}</span>
            <span className="text-sm text-muted-foreground tabular-nums">
              {printedKeyName(range.low)} – {printedKeyName(range.high)}
            </span>
          </div>
          <KeyStrip
            low={range.low}
            high={range.high}
            label={t('pianoSheet.rangeShown', {
              from: printedKeyName(range.low),
              to: printedKeyName(range.high),
            })}
            {...(range.move ? { move: range.move } : {})}
          />
          <Segmented
            label={t('pianoSheet.range')}
            value={range.value}
            options={range.options}
            onChange={range.onChange}
          />
        </div>
      ) : null}
      {labels ? (
        <div className={`${BLOCK} ${keys ? '' : 'pointer-events-none opacity-45'}`}>
          <span className="text-base text-foreground">{t('pianoSheet.labels')}</span>
          <Segmented
            label={t('pianoSheet.labels')}
            value={labels.value}
            options={CHORD_LABELS.map((each) => ({
              value: each,
              label: t(`pianoSheet.label.${each}`),
            }))}
            onChange={labels.onChange}
          />
        </div>
      ) : (
        <div
          data-setting="keyboard.namedKeys"
          className={`${BLOCK} ${keys ? '' : 'pointer-events-none opacity-45'}`}
        >
          <span className="text-base text-foreground">{t('pianoSheet.labels')}</span>
          <Segmented
            label={t('pianoSheet.labels')}
            value={named ? 'names' : 'none'}
            options={(['names', 'none'] as const).map((each) => ({
              value: each,
              label: t(`pianoSheet.label.${each}`),
            }))}
            onChange={(each) => setKeyboard(store, { namedKeys: each === 'names' ? 'c' : 'none' })}
          />
        </div>
      )}
      <SettingsGroup flush>
        <RowLink
          title={t('pianoSheet.sound')}
          value={t('pianoSheet.grand')}
          detail={online ? undefined : t('pianoSheet.offline')}
          render={<Link to="/settings/storage" />}
        />
        <RowLink
          title={t('pianoSheet.midi')}
          value={midi}
          render={<Link to="/settings/connect-piano" />}
        />
      </SettingsGroup>
    </div>
  )
  if (laptop && anchored)
    return (
      <PanelPopover
        title={t('pianoSheet.title')}
        open={open}
        onOpenChange={setOpen}
        trigger={trigger}
        side="top"
        sideOffset={12}
        className="w-95"
      >
        {body}
      </PanelPopover>
    )
  return (
    <Sheet open={open} onOpenChange={setOpen} hung="header">
      <SheetTrigger render={trigger} />
      <SheetContent title={t('pianoSheet.title')}>{body}</SheetContent>
    </Sheet>
  )
}
