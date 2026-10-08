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
  entry('pop', 'sensitive', 'vi IV I V', 'Sensitive', 'Чувствительная'),
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
  entry('minor', 'andalusian', 'i VII VI V', 'Andalusian cadence', 'Андалузская каденция'),
  entry('minor', 'minor-two-five', 'ii° V i', 'Minor ii–V–i', 'Минорная II–V–I', {
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
        'В минор используйте ♭9 сразу. Четыре верхних звука V7♭9 образуют уменьшённый септаккорд.',
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
      note: note(
        'Every degree of the key a 5th apart, home to I.',
        'Все ступени тональности через квинту и домой к I.',
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
        'Five m7 chords move clockwise around the circle of fifths, then four major chords lead back home. Take it through all 12 keys.',
        'Пять аккордов m7 идут по кварто-квинтовому кругу по часовой стрелке, затем четыре мажорных аккорда возвращают домой. Пройдите её во всех 12 тональностях.',
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
]
