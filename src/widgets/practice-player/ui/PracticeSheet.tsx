import { Hourglass, Metronome, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { selectPlayback, useSettings, useSettingsStoreApi } from '@/entities/settings'
import type { PracticeMode } from '@/features/practice'
import { setPlayback } from '@/features/set-preference'
import {
  FloatingBarButton,
  Labelled,
  RadioCards,
  Segmented,
  Sheet,
  SheetContent,
  TempoSteps,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { DOCK_CAPTIONED } from './dock-sizes'

/** The two ways to practise (its canvas, R37): the music waits for your notes, or plays at its tempo. */
type Way = 'wait' | 'play'
const WAYS: readonly Way[] = ['wait', 'play']
const WAY_ICON: Readonly<Record<Way, LucideIcon>> = { wait: Hourglass, play: Metronome }
const wayOf = (mode: PracticeMode): Way => (mode === 'listen' ? 'play' : 'wait')

/** The metronome with the music (Flat's three): silent, one bar counted in, or counting in and clicking on. */
type Click = 'off' | 'countIn' | 'on'
const CLICKS: readonly Click[] = ['off', 'countIn', 'on']

/**
 * The transport's Practice (its canvas's Practice sheet, R37): its button wears the way chosen, its
 * picture over its name. The sheet holds Wait and Play as two cards, then the tempo (the Metronome's
 * face: −10 −1, the BPM, +1 +10; the score's tempo to go back to where it differs) and the metronome,
 * Off · Count-in · On. Each works in both ways; nothing disables another.
 */
export function PracticeSheet({
  mode,
  tempo,
  ownTempo,
  piano,
  handsAtKeys = false,
  click,
  onWait,
  onPlay,
  onTempo,
  onClick,
}: {
  mode: PracticeMode
  tempo: number
  ownTempo: number
  /** Whether a piano is there to play: a MIDI keyboard connected, or the keys on screen. */
  piano: boolean
  /** The hands stand in the keys' place: the keys on screen are theirs, not to be played. */
  handsAtKeys?: boolean
  /** The metronome clicking with the music. */
  click: boolean
  onWait: () => void
  onPlay: (tempo: number) => void
  onTempo: (tempo: number) => void
  onClick: (on: boolean) => void
}) {
  const { t } = useTranslation('player')
  const settings = useSettingsStoreApi()
  const { countdown } = useSettings(selectPlayback)
  const [open, setOpen] = useState(false)
  const way = wayOf(mode)
  const Icon = WAY_ICON[way]
  const name = t(`practiceSheet.${way}`)
  const metronome: Click = click ? 'on' : countdown === 'none' ? 'off' : 'countIn'
  const setMetronome = (next: Click) => {
    setPlayback(settings, { countdown: next === 'off' ? 'none' : 'audible' })
    onClick(next === 'on')
  }
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <FloatingBarButton
        label={t('practiceSheet.of', { mode: name })}
        caption={name}
        aria-haspopup="dialog"
        className={DOCK_CAPTIONED}
        onClick={() => setOpen(true)}
      >
        <Icon aria-hidden />
      </FloatingBarButton>
      <SheetContent title={t('practiceSheet.title')}>
        <div className="flex flex-col gap-5">
          <RadioCards
            label={t('practiceSheet.title')}
            value={way}
            cards={WAYS.map((each) => ({
              value: each,
              label: t(`practiceSheet.${each}`),
              picture: (() => {
                const Icon = WAY_ICON[each]
                return <Icon className="size-6" />
              })(),
            }))}
            onChange={(next) => (next === 'play' ? onPlay(tempo) : onWait())}
          />
          {way === 'wait' && !piano ? (
            <p className="-mt-2 text-sm text-pretty text-muted-foreground">
              {t(handsAtKeys ? 'pace.needsKeysNotHands' : 'pace.needsPiano')}
            </p>
          ) : null}
          <Labelled label={t('practiceSheet.tempo')}>
            <div className="card flex flex-col items-center gap-3 p-4">
              <TempoSteps bpm={tempo} onStep={(by) => onTempo(tempo + by)} />
              {tempo === ownTempo ? null : (
                <Button variant="soft" onClick={() => onTempo(ownTempo)}>
                  {t('practiceSheet.scoreTempo', { tempo: ownTempo })}
                </Button>
              )}
            </div>
          </Labelled>
          <Labelled label={t('practiceSheet.metronome')}>
            <div data-setting="playback.countdown">
              <Segmented
                label={t('practiceSheet.metronome')}
                value={metronome}
                options={CLICKS.map((each) => ({
                  value: each,
                  label: t(
                    `practiceSheet.metronome${each === 'off' ? 'Off' : each === 'on' ? 'On' : 'CountIn'}`,
                  ),
                }))}
                onChange={setMetronome}
              />
            </div>
          </Labelled>
        </div>
      </SheetContent>
    </Sheet>
  )
}
