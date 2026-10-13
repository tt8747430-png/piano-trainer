import type { LocalText } from '@/shared/i18n'
import type { LibraryProgression, ModeLines, ProgressionStyle } from '../model/types'

type Extras = Pick<LibraryProgression, 'note' | 'pattern' | 'size'>

/** A progression of the library: one idea, with its line in each mode it has. */
const entry = <const Id extends string>(
  style: ProgressionStyle,
  id: Id,
  lines: ModeLines,
  en: string,
  ru: string,
  extras: Extras = {},
): LibraryProgression & { readonly id: Id } => ({
  id,
  style,
  ...lines,
  name: { en, ru },
  ...extras,
})

const note = (en: string, ru: string): LocalText => ({ en, ru })

/**
 * The Ultimate Piano's progressions by style (roadmap §10.1) with the app's own practice
 * progressions among them, one entry for each idea (ADR 0041): its line in a major key, in a minor
 * key, or both. A pop loop's minor line is the same loop heard from its relative minor; a cadence's
 * is its minor-key version, the dominant major. No line is another as a loop, in the same key or the
 * relative one: not from another chord, nor with a chord held. The blues write their 7ths (a blues I is
 * a dominant 7th); the gospel walk-up climbs to I from the flat side; the ♭9 resolution writes the
 * dominant's ♭9. The minor ii–V–i writes plain triads, so it grows with the chord size: the
 * half-diminished ii and the dominant at 7ths, the dominant's ♭9 at 9ths.
 */
const LIBRARY = [
  entry(
    'pop',
    'axis',
    { major: 'I V vi IV', minor: 'i VI III VII' },
    'Axis of Awesome',
    'Axis of Awesome',
    {
      pattern: 'pop8',
      note: note(
        'The most common pop progression. In a minor key it is heard from the relative minor: i–VI–III–VII, the ballads’ minor loop.',
        'Самая распространённая последовательность в поп-музыке. В миноре её слышат от параллельного минора: i–VI–III–VII, минорный круг баллад.',
      ),
    },
  ),
  entry('pop', 'let-it-be', { major: 'I V vi IV I V IV I' }, 'Let It Be', 'Let It Be', {
    note: note(
      'Only the chords of the key, the chord family: most pop songs need no other.',
      'Только аккорды тональности, «семья аккордов»: большинству поп-песен других не нужно.',
    ),
  }),
  entry('pop', 'yesterday', { major: 'I V/vi vi IV V I vi V/V IV I' }, 'Yesterday', 'Yesterday', {
    note: note(
      'Two secondary dominants: E7 pulls to Am, D7 to G — which never comes. A broken expectation is a deceptive cadence.',
      'Две вторичные доминанты: E7 тянет к Am, D7 — к G, который так и не приходит. Обманутое ожидание — прерванная каденция.',
    ),
  }),
  entry('pop', 'clocks', { major: 'I v v ii' }, 'Clocks', 'Clocks', {
    note: note(
      'Gm is borrowed from C minor, the key’s darker parallel world: a chord of modal interchange.',
      'Gm взят из до минора, тёмного параллельного мира тональности: аккорд модального смешения.',
    ),
  }),
  entry(
    'pop',
    'doo-wop',
    { major: 'I vi IV V', minor: 'i VI VII III' },
    '50s doo-wop',
    'Ду-воп 50-х',
    {
      pattern: 'flow',
      note: note(
        'From the Chord Flow sheet: the left hand stays on the bass while the right hand moves through the key’s primary triads (I, IV, V) over every chord. In a minor key the same loop is heard from its vi, R&B’s vi–IV–V–I.',
        'Из листа Chord Flow: левая рука остаётся на басу, а правая над каждым аккордом движется по главным трезвучиям тональности (I, IV, V). В миноре тот же круг слышат от vi, как vi–IV–V–I в R&B.',
      ),
    },
  ),
  entry('pop', 'alternative-pop', { major: 'I IV vi V' }, 'Alternative pop', 'Альтернативный поп'),
  entry('pop', 'royal-road', { major: 'IV V iii vi' }, 'Royal Road', 'Royal Road'),
  entry(
    'pop',
    'pachelbel',
    { major: 'I V vi iii IV I IV V' },
    'Pachelbel’s Canon',
    'Канон Пахельбеля',
  ),
  entry('rock', 'rock-shuffle', { major: 'I V IV' }, 'Rock shuffle', 'Рок-шаффл', {
    note: note(
      'Down from the dominant through the subdominant: V–IV–I closes rock and gospel songs alike.',
      'Вниз от доминанты через субдоминанту: V–IV–I завершает и рок-, и госпел-песни.',
    ),
  }),
  entry('rock', 'wild-thing', { major: 'I IV V IV' }, 'Wild Thing', 'Wild Thing'),
  entry(
    'rock',
    'borrowed-flat-seven',
    { major: 'I ♭VII IV I' },
    'Borrowed ♭VII',
    'Заимствованная ♭VII',
    {
      note: note(
        'B♭ is borrowed from C minor, the key’s parallel world: rock’s bluesy step down from I.',
        'B♭ взят из до минора, параллельного мира тональности: блюзовый шаг рока вниз от I.',
      ),
    },
  ),
  entry(
    'jazz',
    'jazz-cadence',
    { major: 'ii V I', minor: 'ii° V i' },
    'Jazz cadence',
    'Джазовая каденция',
    {
      pattern: 'jazz',
      size: 'sevenths',
      note: note(
        'The basic jazz cadence: m7 → 7 → Maj7. In minor the ii is half-diminished and the dominant major, its ♭9 at 9ths, pulling into the minor chord.',
        'Основная джазовая каденция: m7 → 7 → Maj7. В миноре ii полууменьшённый, а доминанта мажорная, с ♭9 у нонаккордов, и тянет в минорный аккорд.',
      ),
    },
  ),
  entry(
    'jazz',
    'two-five-chain',
    { major: 'iiø7/iii V7♭9/iii iii7 V7/ii ii7 V7 I6' },
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
    { major: 'vi ii V I V/IV IV ii°/vi V/vi vi' },
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
  entry(
    'jazz',
    'rhythm-changes',
    { major: 'I vi ii V', minor: 'i VI ii° V' },
    'Rhythm changes',
    'Rhythm changes',
  ),
  entry('jazz', 'full-turnaround', { major: 'iii vi ii V' }, 'Full turnaround', 'Полный оборот'),
  entry('jazz', 'sweet-jazz', { major: 'I IV ii V' }, 'Sweet jazz', 'Мягкий джаз'),
  entry(
    'jazz',
    'tritone-substitution',
    { major: 'ii7 ♭II7 Imaj7' },
    'Tritone substitution',
    'Тритоновая замена',
    {
      size: 'sevenths',
      note: note(
        'D♭7 stands for G7, a tritone away: the same 3rd and 7th, and the bass falls by semitones into I.',
        'D♭7 заменяет G7, отстоящий на тритон: те же терция и септима, а бас спускается к I по полутонам.',
      ),
    },
  ),
  entry(
    'jazz',
    'flat-nine-resolution',
    { major: 'V7♭9 I', minor: 'V7♭9 i' },
    '♭9 resolution',
    'Разрешение с ♭9',
    {
      size: 'ninths',
      note: note(
        'Into major the ♭9 adds tension and slides down to the 5th of I. Into minor it is the key’s own 9th: use it right away. The top four notes of V7♭9 form a diminished 7th chord.',
        'В мажор ♭9 добавляет напряжения и соскальзывает на квинту I. В минор это собственная нона тональности: берите её сразу. Четыре верхних звука V7♭9 образуют уменьшённый септаккорд.',
      ),
    },
  ),
  entry(
    'blues',
    'blues-turnaround',
    { major: 'I7 IV7 I7 V7' },
    'Blues turnaround',
    'Блюзовый оборот',
  ),
  entry(
    'blues',
    'twelve-bar',
    { major: 'I7 I7 I7 I7 IV7 IV7 I7 I7 V7 IV7 I7 V7' },
    '12-bar blues',
    'Блюз, 12 тактов',
    {
      pattern: 'blues',
      note: note('Great with the blues scale on top.', 'Хорошо звучит с блюзовой гаммой сверху.'),
    },
  ),
  entry(
    'classical',
    'complete-cadence',
    { major: 'I IV V I', minor: 'i iv V i' },
    'Complete cadence',
    'Полная каденция',
    {
      note: note(
        'Home, away to the subdominant and the dominant, and home. In minor the dominant is major, from harmonic minor, and leads home.',
        'Тоника, субдоминанта, доминанта и снова тоника. В миноре доминанта мажорная, из гармонического минора, и ведёт к тонике.',
      ),
    },
  ),
  entry(
    'classical',
    'authentic',
    { major: 'I V I', minor: 'i V i' },
    'Authentic cadence',
    'Автентическая каденция',
    {
      note: note(
        'V–I closes home. At 9ths the dominant takes the key’s own 9th: a plain 9 into major, smooth and bright; the ♭9 into minor.',
        'V–I замыкает на тонике. У нонаккордов доминанта берёт нону тональности: простую в мажор, мягко и светло; ♭9 в минор.',
      ),
    },
  ),
  entry(
    'classical',
    'deceptive',
    { major: 'I IV V vi', minor: 'i iv V VI' },
    'Deceptive cadence',
    'Прерванная каденция',
  ),
  entry(
    'classical',
    'plagal',
    { major: 'I IV I', minor: 'i iv i' },
    'Plagal cadence',
    'Плагальная каденция',
  ),
  entry(
    'classical',
    'andalusian',
    { minor: 'i VII VI V' },
    'Andalusian cadence',
    'Андалузская каденция',
  ),
  entry('soul', 'neo-soul', { major: 'vi V IV V', minor: 'i VII VI VII' }, 'Neo-soul', 'Нео-соул'),
  entry('gospel', 'gospel-standard', { major: 'I iii IV V' }, 'Gospel standard', 'Госпел-стандарт'),
  entry('gospel', 'gospel-hymn', { major: 'I IV I V' }, 'Gospel hymn', 'Госпел-гимн'),
  entry(
    'gospel',
    'seven-three-six',
    { major: 'vii° III vi ii V I' },
    'Gospel 7–3–6',
    'Госпел 7–3–6',
    {
      size: 'sevenths',
      note: note(
        'Named by its bass, the 7th, 3rd and 6th notes of the key: a ii–V–i into the relative minor, then ii–V–I home.',
        'Названа по басу, VII, III и VI ступеням тональности: ii–V–i в параллельный минор, затем ii–V–I домой.',
      ),
    },
  ),
  entry(
    'gospel',
    'gospel-walk-up',
    { major: '♭VI ♭VII I', minor: 'VI VII i' },
    'Gospel walk-up',
    'Госпел-подход',
  ),
  entry(
    'theory',
    'key-chords',
    { major: 'I ii iii IV V vi vii°', minor: 'i ii° III iv v VI VII' },
    'The chords of the key',
    'Аккорды тональности',
    {
      note: note(
        'Lead into each by its V for the secondary dominants, or by its ii–V for a ii–V–I to every chord of the key.',
        'Подведите к каждому через его V — получатся вторичные доминанты, или через его ii–V — ii–V–I к каждому аккорду тональности.',
      ),
    },
  ),
  entry(
    'theory',
    'round-the-circle',
    { major: 'I IV vii° iii vi ii V I', minor: 'i iv VII III VI ii° V i' },
    'Round the circle',
    'По квинтовому кругу',
    {
      size: 'sevenths',
      note: note(
        'Every degree of the key a 5th apart, home to I: the circle of fifths in the key’s own chords. In 7ths each 3rd falls to the next chord’s 7th. In minor, from iv, it is Autumn Leaves. Lead into each by its ii–V to go round the circle by ii–V–Is.',
        'Все ступени тональности через квинту и домой к I: квинтовый круг на аккордах самой тональности. В септаккордах терция каждого аккорда переходит в септиму следующего. В миноре, от iv, это Autumn Leaves. Подведите к каждому через его ii–V — пройдёте круг оборотами ii–V–I.',
      ),
    },
  ),
  entry(
    'theory',
    'stack-your-chords',
    { major: 'I iv7 i7 v7 ii7 vi7 ♭VI ♭III ♭VII IV' },
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
