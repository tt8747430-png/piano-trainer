import type { PitchClass } from './pitch'
import type { ScaleKind } from './scale'

export type Finger = 1 | 2 | 3 | 4 | 5
export type Hand = 'rh' | 'lh'

type FingeringTable = 'major' | 'natural' | 'pent' | 'blues'

/** Harmonic and melodic minor are fingered as natural minor; the minor pentatonic has none taught. */
const TABLE_OF: Readonly<Record<ScaleKind, FingeringTable | null>> = {
  major: 'major',
  natural: 'natural',
  harmonic: 'natural',
  melodic: 'natural',
  pent: 'pent',
  mpent: null,
  blues: 'blues',
}

/** One octave up, a digit per note; the left hand is read from the bottom note up. */
type Fingering = Readonly<Record<Hand, string>>
const fingers = (rh: string, lh: string): Fingering => ({ rh, lh })
const C_SHAPE = fingers('12312345', '54321321')

/** By the root's pitch class. */
const FINGERINGS: Readonly<Record<FingeringTable, Readonly<Partial<Record<number, Fingering>>>>> = {
  major: {
    0: C_SHAPE,
    1: fingers('23123412', '32143212'),
    2: C_SHAPE,
    3: fingers('31234123', '32143213'),
    4: C_SHAPE,
    5: fingers('12341234', '54321321'),
    6: fingers('23412312', '43213212'),
    7: C_SHAPE,
    8: fingers('23123123', '32143213'),
    9: C_SHAPE,
    10: fingers('21231234', '32143213'),
    11: fingers('12312345', '43214321'),
  },
  natural: {
    0: C_SHAPE,
    1: fingers('23123123', '32143213'),
    2: C_SHAPE,
    3: fingers('21234123', '21432132'),
    4: C_SHAPE,
    5: fingers('12341234', '54321321'),
    6: fingers('23123123', '43213214'),
    7: C_SHAPE,
    8: fingers('23123123', '32132143'),
    9: C_SHAPE,
    10: fingers('21231234', '21321432'),
    11: fingers('12312345', '43214321'),
  },
  pent: {
    0: fingers('12312', '32121'),
    1: fingers('23123', '32132'),
    2: fingers('12312', '43212'),
    3: fingers('12312', '43212'),
    4: fingers('12312', '43212'),
    5: fingers('12312', '32121'),
    6: fingers('12312', '43212'),
    7: fingers('12312', '32121'),
    8: fingers('23121', '32132'),
    9: fingers('12312', '43212'),
    10: fingers('21212', '32121'),
    11: fingers('12312', '32132'),
  },
  blues: {
    0: fingers('1234123', '4214321'),
    1: fingers('2123412', '2143212'),
    2: fingers('1234123', '4214321'),
    3: fingers('1231234', '4321321'),
    4: fingers('1234123', '4214321'),
    5: fingers('1231234', '4321321'),
    6: fingers('2123412', '4321214'),
    7: fingers('1234123', '4214321'),
    8: fingers('1231234', '4321432'),
    9: fingers('1234123', '4214321'),
    10: fingers('1231234', '4321321'),
    11: fingers('1231234', '5321321'),
  },
}

const isFinger = (n: number): n is Finger => n >= 1 && n <= 5 && Number.isInteger(n)

function toFinger(digit: string): Finger {
  const n = Number(digit)
  if (!isFinger(n)) throw new RangeError(`"${digit}" is not a finger`)
  return n
}

/** The taught fingering for one octave, or null where none is taught. */
export function scaleFingering(root: PitchClass, kind: ScaleKind, hand: Hand): Finger[] | null {
  const table = TABLE_OF[kind]
  const fingering = table ? FINGERINGS[table][root] : undefined
  return fingering ? [...fingering[hand]].map(toFinger) : null
}
