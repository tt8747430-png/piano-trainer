import { useMemo, useState, type ComponentProps, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { selectKeyboard, useSettings } from '@/entities/settings'
import { useHeldKeys } from '@/features/connect-midi'
import { nameChords, printedSymbol, rangeOf, type Midi } from '@/shared/lib/music'
import { hasFinePointer } from '@/shared/lib'
import { useLiveVoice, useSoundingKeys } from '@/shared/lib/services'
import { useShortcuts } from '@/shared/lib/shortcuts'
import { PianoKeyboard, RailButton, RailGroup } from '@/shared/ui'
import { useSpacePedal } from '../model/use-space-pedal'
import { useTyping } from '../model/use-typing'
import { Settings2 } from 'lucide-react'
import { KeyPedals } from './KeyPedals'
import { KeyZoom } from './KeyZoom'
import { PianoSettingsSheet } from './PianoSettingsSheet'

/** A key plays itself unless the screen says otherwise. */
const ALONE = (key: Midi): readonly Midi[] => [key]
/** No keys: what a keyboard shows of a sound that is the question. */
const NOTHING: ReadonlySet<Midi> = new Set()

/**
 * The keyboard every screen shows, set up as the learner chose (the keyboard settings): a key goes
 * down while the app sounds it, a MIDI keyboard holds it, or a finger or a typed key presses it;
 * a tapped or typed key sounds while it is held (on under the pedal) and before it does whatever
 * else the screen makes it mean. Nothing stands above its keys (R32): its rail beneath them holds the
 * chord a hand holds, the pedals centred on their lyre as a piano's, the keys' size (− +) and ⚙ to the
 * piano's own settings (`onSettings`: the screen's sheet, else the piano's sheet in place, R33). With chord names on, the rail names the chord a
 * hand holds (three notes or more, held or on under the pedal; never what the app sounds). Unless the
 * screen says which keys to keep in sight, it follows the keys the app sounds. With `spotlight`,
 * the keys the app puts down are the ones struck last: an arpeggio's or a run's key alone, a
 * chord's keys together, every mark kept. With `keyPlays`, a key a hand plays may sound more than
 * itself (a degree's chord), all of it down while the key is held.
 */
export function LiveKeyboard({
  keyPlays,
  onKeyPress,
  inView,
  spotlight = false,
  spacePedal = true,
  namesChords = true,
  namesKeys = true,
  showsSound = true,
  railEnd,
  onSettings,
  sustained = false,
  ...keyboard
}: Omit<
  ComponentProps<typeof PianoKeyboard>,
  | 'down'
  | 'keySize'
  | 'swipe'
  | 'namedKeys'
  | 'markNotes'
  | 'keyLength'
  | 'letters'
  | 'caption'
  | 'children'
  | 'onKeyPress'
> & {
  /** What a tap means besides its sound: a quiz's choice, Wait mode's answer. */
  onKeyPress?: ((key: Midi) => void) | undefined
  /** The explorers' keyboards: the keys struck last go down, alone or together. */
  spotlight?: boolean
  /** Space holds the pedal while typing plays the keys: off where the screen gives Space a job. */
  spacePedal?: boolean
  /** The rail may name the chord a hand holds: off where its name is the question (a round). */
  namesChords?: boolean
  /**
   * The keys carry their names as the learner chose: off where a key's name is the answer (a round
   * played on the keys), whatever the setting.
   */
  namesKeys?: boolean
  /** The keys the app sounds go down: off where what sounds is the question (a round by ear). */
  showsSound?: boolean
  /** The rail's last control: a page's keys fold away from it. */
  railEnd?: ReactNode
  /** The piano's settings where the screen keeps them (the Player's sheet); else the piano's sheet. */
  onSettings?: (() => void) | undefined
  /** The music playing holds the sustain pedal down (its score's pedal mark): drawn down. */
  sustained?: boolean
}) {
  const { typing, chordNames, keySize, swipe, namedKeys, markNotes, keyLength } =
    useSettings(selectKeyboard)
  const settings = {
    keySize,
    swipe,
    namedKeys: namesKeys ? namedKeys : ('none' as const),
    markNotes,
    keyLength,
  }
  const heard = useSoundingKeys(spotlight ? 'struck' : 'sounding')
  const sounding = showsSound ? heard : NOTHING
  const live = useSoundingKeys('live')
  const held = useHeldKeys()
  const voice = useLiveVoice()
  const plays = keyPlays ?? ALONE
  const play = (key: Midi) => {
    voice.down(key, plays(key))
    onKeyPress?.(key)
  }
  const letGo = (key: Midi) => voice.up(key)
  // The keys the app sounds or MIDI holds lead the view; a tapped or typed key is where the hand already is.
  const soundingRange = useMemo(() => rangeOf([...sounding, ...held]), [sounding, held])
  // Letters play only where there are letters to type: a setting synced from a laptop does nothing on
  // a phone, which has no way to turn it off (R29).
  const typingPlays = typing && hasFinePointer()
  const typed = useTyping({
    enabled: typingPlays,
    onKey: play,
    onKeyUp: letGo,
    inView: inView ?? soundingRange,
  })
  useSpacePedal({ enabled: typingPlays && spacePedal })
  // The typing keys are heard by `useTyping` and the pedal's hook: here they are only listed.
  const { t } = useTranslation('common')
  useShortcuts(
    t('shortcuts.piano'),
    [
      { label: t('shortcuts.typing'), shown: ['A', '–', '’'] },
      { label: t('shortcuts.octave'), shown: ['Z', 'X'] },
      ...(spacePedal ? [{ label: t('shortcuts.pedal'), shown: ['Space'] }] : []),
    ],
    { enabled: typing, scope: 'piano' },
  )
  // A key the live voice sounds is down until its damper falls: held, or on under the pedal.
  const down = useMemo(
    () =>
      held.size === 0 && typed.held.size === 0 && live.size === 0
        ? sounding
        : new Set([...sounding, ...live, ...held, ...[...typed.held].flatMap(plays)]),
    [sounding, live, held, typed.held, plays],
  )
  // What a hand plays: the live voice's keys and a MIDI keyboard's, held or on under the pedal,
  // named as the sheets print a chord (`C♯m`).
  const chord = useMemo(
    () =>
      namesChords && chordNames
        ? printedSymbol(nameChords([...live, ...held])[0]?.symbol ?? '')
        : null,
    [namesChords, chordNames, live, held],
  )
  const [sheet, setSheet] = useState(false)
  const openSettings = onSettings ?? (() => setSheet(true))
  return (
    <>
      <PianoKeyboard
        {...keyboard}
        {...settings}
        inView={typed.inView}
        down={down}
        letters={typed.letters}
        caption={chord === null ? undefined : { label: t('rail.chord'), text: chord }}
        keyPlays={keyPlays}
        onKeyPress={play}
        onKeyRelease={letGo}
        pedals={<KeyPedals sustained={sustained} />}
        railEnd={railEnd}
      >
        <RailGroup>
          <KeyZoom />
          <RailButton label={t('rail.settings')} icon={Settings2} onClick={openSettings} />
        </RailGroup>
      </PianoKeyboard>
      {onSettings ? null : <PianoSettingsSheet open={sheet} onOpenChange={setSheet} />}
    </>
  )
}
