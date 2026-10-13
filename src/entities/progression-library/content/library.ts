import type { LocalText } from '@/shared/i18n'
import type { LibraryProgression, ProgressionStyle } from '../model/types'

type Extras = Pick<LibraryProgression, 'note' | 'pattern' | 'size'>

/** A progression of the library: a major key's unless its style is the minor keys'. */
const entry = <const Id extends string>(
  style: ProgressionStyle,
  id: Id,
  numerals: string,
  en: string,
  ru: string,
  extras: Extras = {},
): LibraryProgression & { readonly id: Id } => ({
  id,
  style,
  numerals,
  name: { en, ru },
  minor: style === 'minor',
  ...extras,
})

const note = (en: string, ru: string): LocalText => ({ en, ru })

/**
 * The Ultimate Piano's progressions by style (roadmap §10.1) with the app's own practice
 * progressions among them, each line of numerals once in its mode. The blues write their 7ths (a
 * blues I is a dominant 7th); the gospel 7–3–6 writes its III a major chord, the dominant of vi; the
 * gospel walk-up climbs to I from the flat side; the resolutions write the dominant's ♭9 where they
 * teach it. The minor ii–V–i writes plain triads, so it grows with the chord size: the
 * half-diminished ii and the dominant at 7ths, the dominant's ♭9 only at 9ths. A name is the one
 * musicians give those chords, and a loop is held once: not again with a chord held.
 */
const LIBRARY = [
  entry('pop', 'axis', 'I V vi IV', 'Axis of Awesome', 'Axis of Awesome', {
    pattern: 'pop8',
    note: note(
      'The most common pop progression.',
      'Самая распространённая последовательность в поп-музыке.',
    ),
  }),
  entry('pop', 'let-it-be', 'I V vi IV I V IV I', 'Let It Be', 'Let It Be', {
    note: note(
      'Only the chords of the key, the chord family: most pop songs need no other.',
      'Только аккорды тональности, «семья аккордов»: большинству поп-песен других не нужно.',
    ),
  }),
  entry('pop', 'yesterday', 'I V/vi vi IV V I vi V/V IV I', 'Yesterday', 'Yesterday', {
    note: note(
      'Two secondary dominants: E7 pulls to Am, D7 to G — which never comes. A broken expectation is a deceptive cadence.',
      'Две вторичные доминанты: E7 тянет к Am, D7 — к G, который так и не приходит. Обманутое ожидание — прерванная каденция.',
    ),
  }),
  entry('pop', 'clocks', 'I v v ii', 'Clocks', 'Clocks', {
    note: note(
      'Gm is borrowed from C minor, the key’s darker parallel world: a chord of modal interchange.',
      'Gm взят из до минора, тёмного параллельного мира тональности: аккорд модального смешения.',
    ),
  }),
  entry('pop', 'sensitive', 'vi IV I V', 'Sensitive', 'Sensitive'),
  entry('pop', 'doo-wop', 'I vi IV V', '50s doo-wop', 'Ду-воп 50-х', {
    pattern: 'flow',
    note: note(
      'From the Chord Flow sheet: the left hand stays on the bass while the right hand moves through the key’s primary triads (I, IV, V) over every chord.',
      'Из листа Chord Flow: левая рука остаётся на басу, а правая над каждым аккордом движется по главным трезвучиям тональности (I, IV, V).',
    ),
  }),
  entry('pop', 'alternative-pop', 'I IV vi V', 'Alternative pop', 'Альтернативный поп'),
  entry('pop', 'royal-road', 'IV V iii vi', 'Royal Road', 'Royal Road'),
  entry('pop', 'pachelbel', 'I V vi iii IV I IV V', 'Pachelbel’s Canon', 'Канон Пахельбеля'),
  entry('rock', 'basic-rock', 'I IV V', 'Basic rock', 'Простой рок'),
  entry('rock', 'rock-shuffle', 'I V IV', 'Rock shuffle', 'Рок-шаффл'),
  entry('rock', 'wild-thing', 'I IV V IV', 'Wild Thing', 'Wild Thing'),
  entry('jazz', 'jazz-cadence', 'ii V I', 'Jazz cadence', 'Джазовая каденция', {
    pattern: 'jazz',
    size: 'sevenths',
    note: note(
      'The basic jazz cadence. With 9ths: m9 → 9 → Maj9.',
      'Основная джазовая каденция. С нонаккордами: m9 → 9 → Maj9.',
    ),
  }),
  entry(
    'jazz',
    'two-five-through-the-key',
    'ii V I ii°/ii V/ii ii ii°/iii V/iii iii ii/IV V/IV IV ii/V V/V V ii°/vi V/vi vi ii°/vii V/vii vii°',
    'ii–V–I to every chord of the key',
    'ii–V–I к каждому аккорду тональности',
    {
      pattern: 'jazz',
      size: 'sevenths',
      note: note(
        'Up the scale, each chord of the key in turn is home: a ii–V–I to I, then to ii, iii, IV, V, vi and vii, every one in the key’s own notes but its ii and V. A minor chord takes the minor ii–V.',
        'Вверх по гамме каждый аккорд тональности по очереди становится тоникой: ii–V–I к I, затем к ii, iii, IV, V, vi и vii, всё в звуках тональности, кроме своих ii и V. К минорному аккорду ведёт минорный ii–V.',
      ),
    },
  ),
  entry(
    'jazz',
    'two-five-round-the-circle',
    'ii V I ii/IV V/IV IV ii°/vii V/vii vii° ii°/iii V/iii iii ii°/vi V/vi vi ii°/ii V/ii ii ii/V V/V V',
    'ii–V–I round the circle in the key',
    'ii–V–I по квинтовому кругу в тональности',
    {
      pattern: 'jazz',
      size: 'sevenths',
      note: note(
        'The key’s chords a 5th apart (I IV vii iii vi ii V), each reached by its own ii–V: the circle of fifths without leaving the key.',
        'Аккорды тональности через квинту (I IV vii iii vi ii V), к каждому — свой ii–V: квинтовый круг, не выходя из тональности.',
      ),
    },
  ),
  entry(
    'jazz',
    'two-five-chain',
    'iiø7/iii V7♭9/iii iii7 V7/ii ii7 V7 I6',
    'ii–V chain',
    'Цепочка ii–V',
    {
      note: note(
        'From the 2-5-1 sheet: ii–Vs visit other keys for a moment, every dominant falling a 5th, until the last one leads home.',
        'Из листа 2-5-1: обороты ii–V ненадолго уводят в другие тональности, каждая доминанта опускается на квинту, пока последняя не приведёт домой.',
      ),
    },
  ),
  entry(
    'jazz',
    'fly-me-to-the-moon',
    'vi ii V I V/IV IV ii°/vi V/vi vi',
    'Fly Me to the Moon',
    'Fly Me to the Moon',
    {
      size: 'sevenths',
      note: note(
        'From the chord matrix: C7 leads to F, then Bø–E7 is the minor ii–V into Am.',
        'Из матрицы аккордов: C7 ведёт к F, затем Bø–E7 — минорный ii–V в Am.',
      ),
    },
  ),
  entry('jazz', 'rhythm-changes', 'I vi ii V', 'Rhythm changes', 'Rhythm changes'),
  entry('jazz', 'full-turnaround', 'iii vi ii V', 'Full turnaround', 'Полный оборот'),
  entry('jazz', 'autumn-leaves', 'ii V I IV', 'Autumn Leaves', 'Autumn Leaves'),
  entry('jazz', 'sweet-jazz', 'I IV ii V', 'Sweet jazz', 'Мягкий джаз'),
  entry('jazz', 'dominant-resolution', 'V I', 'Dominant resolution', 'Разрешение доминанты', {
    size: 'ninths',
    note: note(
      'Resolving into major, option 1: a plain 9 on the dominant. Smooth and bright.',
      'Разрешение в мажор, вариант 1: простая нона на доминанте. Мягко и светло.',
    ),
  }),
  entry('jazz', 'flat-nine-resolution', 'V7♭9 I', '♭9 resolution', 'Разрешение с ♭9', {
    size: 'ninths',
    note: note(
      'Resolving into major, option 2: the ♭9 adds tension and slides down to the 5th of the target.',
      'Разрешение в мажор, вариант 2: ♭9 добавляет напряжения и соскальзывает на квинту целевого аккорда.',
    ),
  }),
  entry('blues', 'blues-turnaround', 'I7 IV7 I7 V7', 'Blues turnaround', 'Блюзовый оборот'),
  entry('blues', 'basic-blues', 'I7 IV7 V7', 'Basic blues', 'Простой блюз'),
  entry(
    'blues',
    'twelve-bar',
    'I7 I7 I7 I7 IV7 IV7 I7 I7 V7 IV7 I7 V7',
    '12-bar blues',
    'Блюз, 12 тактов',
    {
      pattern: 'blues',
      note: note('Great with the blues scale on top.', 'Хорошо звучит с блюзовой гаммой сверху.'),
    },
  ),
  entry('classical', 'complete-cadence', 'I IV V I', 'Complete cadence', 'Полная каденция', {
    note: note(
      'Home, away to the subdominant and the dominant, and home.',
      'Тоника, субдоминанта, доминанта и снова тоника.',
    ),
  }),
  entry('classical', 'authentic', 'I V I', 'Authentic cadence', 'Автентическая каденция'),
  entry('classical', 'classical-standard', 'I ii V I', 'Classical standard', 'Классический оборот'),
  entry('classical', 'deceptive', 'I IV V vi', 'Deceptive cadence', 'Прерванная каденция'),
  entry('classical', 'plagal', 'I IV I', 'Plagal cadence', 'Плагальная каденция'),
  entry('soul', 'neo-soul', 'vi V IV V', 'Neo-soul', 'Нео-соул'),
  entry('soul', 'emotional-rnb', 'vi IV V I', 'Emotional R&B', 'Лирический R&B'),
  entry('gospel', 'gospel-standard', 'I iii IV V', 'Gospel standard', 'Госпел-стандарт'),
  entry('gospel', 'gospel-hymn', 'I IV I V', 'Gospel hymn', 'Госпел-гимн'),
  entry('gospel', 'seven-three-six', 'vii° III vi', 'Gospel 7–3–6', 'Госпел 7–3–6', {
    size: 'sevenths',
    note: note(
      'Named by its bass, the 7th, 3rd and 6th notes of the key: a ii–V–i into the relative minor.',
      'Названа по басу, VII, III и VI ступеням тональности: ii–V–i в параллельный минор.',
    ),
  }),
  entry('gospel', 'gospel-resolution', 'V IV I', 'Gospel resolution', 'Госпел-разрешение'),
  entry('gospel', 'gospel-walk-up', '♭VI ♭VII I', 'Gospel walk-up', 'Госпел-подход'),
  entry('minor', 'minor-cadence', 'i iv V i', 'Minor cadence', 'Минорная каденция', {
    note: note(
      'The dominant is major, from harmonic minor, and leads home.',
      'Доминанта мажорная, из гармонического минора, и ведёт к тонике.',
    ),
  }),
  entry('minor', 'minor-pop', 'i VI III VII', 'Minor pop', 'Минорный поп', {
    pattern: 'pop8',
    note: note('The minor-key loop of pop and rock ballads.', 'Минорный круг поп- и рок-баллад.'),
  }),
  entry(
    'minor',
    'minor-two-five-through-the-key',
    'ii° V i ii°/ii V/ii ii° ii/III V/III III ii°/iv V/iv iv ii°/v V/v v ii/VI V/VI VI ii/VII V/VII VII',
    'ii–V–i to every chord of the minor key',
    'ii–V–i к каждому аккорду минорной тональности',
    {
      pattern: 'jazz',
      size: 'sevenths',
      note: note(
        'Natural minor’s chords in turn, each with its own ii–V: minor ones by the minor ii–V, major ones by the major.',
        'Аккорды натурального минора по очереди, к каждому свой ii–V: к минорным — минорный, к мажорным — мажорный.',
      ),
    },
  ),
  entry('minor', 'andalusian', 'i VII VI V', 'Andalusian cadence', 'Андалузская каденция'),
  entry('minor', 'minor-two-five', 'ii° V i', 'Minor ii–V–i', 'Минорный ii–V–i', {
    pattern: 'jazz',
    size: 'ninths',
    note: note(
      'The ♭9 of the dominant belongs to the minor key, so it pulls into the minor chord.',
      '♭9 доминанты принадлежит минорной тональности, поэтому тянет в минорный аккорд.',
    ),
  }),
  entry(
    'minor',
    'minor-flat-nine-resolution',
    'V7♭9 i',
    '♭9 resolution into minor',
    'Разрешение с ♭9 в минор',
    {
      size: 'ninths',
      note: note(
        'Into minor, use the ♭9 right away. The top four notes of V7♭9 form a diminished 7th chord.',
        'При разрешении в минор сразу берите ♭9. Четыре верхних звука V7♭9 образуют уменьшённый септаккорд.',
      ),
    },
  ),
  entry(
    'theory',
    'key-chords',
    'I ii iii IV V vi vii°',
    'The chords of the key',
    'Аккорды тональности',
  ),
  entry(
    'theory',
    'round-the-circle',
    'I IV vii° iii vi ii V I',
    'Round the circle',
    'По квинтовому кругу',
    {
      size: 'sevenths',
      note: note(
        'Every degree of the key a 5th apart, home to I: the circle of fifths in the key’s own chords. In 7ths each 3rd falls to the next chord’s 7th.',
        'Все ступени тональности через квинту и домой к I: квинтовый круг на аккордах самой тональности. В септаккордах терция каждого аккорда переходит в септиму следующего.',
      ),
    },
  ),
  entry(
    'theory',
    'secondary-dominants',
    'I V/ii ii V/iii iii V/IV IV V/V V V/vi vi V I',
    'Secondary dominants',
    'Вторичные доминанты',
    {
      size: 'sevenths',
      note: note(
        'The chord matrix’s second row: each chord of the key led to by its own dominant, a 5th above it (A7 to Dm, B7 to Em, C7 to F, D7 to G, E7 to Am).',
        'Второй ряд матрицы аккордов: к каждому аккорду тональности ведёт своя доминанта, на квинту выше (A7 к Dm, B7 к Em, C7 к F, D7 к G, E7 к Am).',
      ),
    },
  ),
  entry(
    'theory',
    'stack-your-chords',
    'I iv7 i7 v7 ii7 vi7 ♭VI ♭III ♭VII IV',
    'Stack Your Chords',
    'Stack Your Chords',
    {
      note: note(
        'Five m7 chords move clockwise around the circle of fifths, then four chords on major triads lead back home. Take it through all 12 keys.',
        'Пять аккордов m7 идут по квинтовому кругу по часовой стрелке, затем четыре аккорда на мажорных трезвучиях возвращают домой. Пройдите её во всех 12 тональностях.',
      ),
    },
  ),
] as const

/** A progression's id, as the library writes it. */
export type ProgressionId = (typeof LIBRARY)[number]['id']

/** The library, style by style in the order written. */
export const PROGRESSION_LIBRARY: readonly LibraryProgression[] = LIBRARY

/**
 * A cadence and its version in the minor key of the same tonic, the major one first: what a key turned
 * minor takes it to, and back. The jazz cadence's is the minor ii–V–i (the 2-5-1 sheet's minor version).
 */
export const MODE_VERSIONS: readonly (readonly [major: ProgressionId, minor: ProgressionId])[] = [
  ['jazz-cadence', 'minor-two-five'],
  ['flat-nine-resolution', 'minor-flat-nine-resolution'],
  ['complete-cadence', 'minor-cadence'],
  ['two-five-through-the-key', 'minor-two-five-through-the-key'],
]
