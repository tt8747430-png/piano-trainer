import type { LocalText } from '@/shared/i18n'
import type {
  LibraryProgression,
  ModeLines,
  ProgressionDetails,
  ProgressionStyle,
} from '../model/types'
import { CHARACTERS } from './characters'

/** An entry as written, its character added from `CHARACTERS`. */
type Written = ModeLines & Omit<ProgressionDetails, 'character'>

type Extras = Pick<LibraryProgression, 'note' | 'pattern' | 'size'>

/** A progression of the library: one idea, with its line in each mode it has. */
const entry = <const Id extends string>(
  style: ProgressionStyle,
  id: Id,
  lines: ModeLines,
  en: string,
  ru: string,
  extras: Extras = {},
): Written & { readonly id: Id } => ({
  id,
  style,
  ...lines,
  name: { en, ru },
  ...extras,
})

const note = (en: string, ru: string): LocalText => ({ en, ru })

/**
 * The Ultimate Piano's progressions by style with the app's own practice
 * progressions among them, one entry for each idea (ADR 0112): its line in a major key, in a minor
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
        'The most used pop progression. Started from the relative minor, it becomes i–VI–III–VII, the minor loop of many ballads.',
        'Самая распространённая последовательность в поп-музыке. Если начать её от параллельного минора, получится i–VI–III–VII, минорный круг многих баллад.',
      ),
    },
  ),
  entry('pop', 'let-it-be', { major: 'I V vi IV I V IV I' }, 'Let It Be', 'Let It Be', {
    note: note(
      'Only the key’s own chords. Most pop songs need no others.',
      'Только аккорды самой тональности. Большинству поп-песен других не нужно.',
    ),
  }),
  entry('pop', 'yesterday', { major: 'I V/vi vi IV V I vi V/V IV I' }, 'Yesterday', 'Yesterday', {
    note: note(
      'Two secondary dominants: chords that act as the V of a chord other than I. In C, E7 pulls to Am, and D7 pulls to G, which never comes. That broken expectation is a deceptive cadence.',
      'Две побочные доминанты: аккорды, которые служат V не для I, а для другого аккорда. В до мажоре E7 тянет к Am, а D7 к G, который так и не приходит. Обманутое ожидание — это прерванная каденция.',
    ),
  }),
  entry('pop', 'clocks', { major: 'I v v ii' }, 'Clocks', 'Clocks', {
    note: note(
      'The v is borrowed from the parallel minor, the minor key on the same tonic. In C that is Gm, from C minor, and it darkens the sound. This borrowing is called modal interchange.',
      'Аккорд v взят из одноимённого минора, минорной тональности с той же тоникой. В до мажоре это Gm из до минора, и он затемняет звучание. Такое заимствование называют модальным смешением.',
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
        'The left hand stays on the bass while the right hand moves through the key’s main triads, I, IV and V, over every chord. In a minor key the same loop is heard from its vi, as R&B’s vi–IV–V–I.',
        'Левая рука остаётся на басу, а правая над каждым аккордом движется по главным трезвучиям тональности: I, IV и V. В миноре тот же круг слышат от vi, как vi–IV–V–I в R&B.',
      ),
    },
  ),
  entry('pop', 'alternative-pop', { major: 'I IV vi V' }, 'Alternative pop', 'Альтернативный поп'),
  entry('pop', 'royal-road', { major: 'IV V iii vi' }, 'Royal Road', 'Royal Road', {
    note: note(
      'A favourite of Japanese pop, where it is called the Royal Road.',
      'Любимая последовательность японской поп-музыки, где её называют «Королевской дорогой».',
    ),
  }),
  entry(
    'pop',
    'pachelbel',
    { major: 'I V vi iii IV I IV V' },
    'Pachelbel’s Canon',
    'Канон Пахельбеля',
    {
      note: note(
        'The chords over the bass line of Pachelbel’s Canon, used in many pop songs since.',
        'Аккорды над басовой линией Канона Пахельбеля. С тех пор они звучат во многих поп-песнях.',
      ),
    },
  ),
  entry('rock', 'rock-shuffle', { major: 'I V IV' }, 'Rock shuffle', 'Рок-шаффл', {
    note: note(
      'Down from the dominant (V) through the subdominant (IV) to the tonic (I). This V–IV–I ending closes rock and gospel songs alike.',
      'Вниз от доминанты (V) через субдоминанту (IV) к тонике (I). Таким окончанием V–IV–I завершаются и рок-, и госпел-песни.',
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
        'The ♭VII is borrowed from the parallel minor. In C it is B♭, from C minor: rock’s bluesy step down from I.',
        'Аккорд ♭VII взят из одноимённого минора. В до мажоре это B♭ из до минора: блюзовый шаг рока вниз от I.',
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
        'The basic jazz cadence: m7, then 7, then Maj7. In minor the ii is half-diminished and the V stays major, with a ♭9 at 9ths, so it pulls into the minor tonic.',
        'Основная джазовая каденция: m7, затем 7, затем Maj7. В миноре ii полууменьшённый, а V остаётся мажорной, с ♭9 у нонаккордов, и тянет в минорную тонику.',
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
        'Each ii–V visits another key for a moment, every dominant falling a 5th, until the last one leads home.',
        'Каждый оборот ii–V ненадолго уводит в другую тональность, каждая доминанта опускается на квинту, пока последняя не приведёт домой.',
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
        'In C, C7 leads to F, then Bø and E7 are the minor ii–V into Am.',
        'В до мажоре C7 ведёт к F, затем Bø и E7 — минорный ii–V в Am.',
      ),
    },
  ),
  entry(
    'jazz',
    'rhythm-changes',
    { major: 'I vi ii V', minor: 'i VI ii° V' },
    'Rhythm changes',
    'Rhythm changes',
    {
      note: note(
        'The opening chords of Gershwin’s “I Got Rhythm”, the basis of many jazz tunes.',
        'Начальные аккорды песни Гершвина «I Got Rhythm», основа многих джазовых пьес.',
      ),
    },
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
        'In C, D♭7 stands in for G7, a tritone away. Both have the same 3rd and 7th, and the bass now falls by semitones into I.',
        'В до мажоре D♭7 заменяет G7, который отстоит от него на тритон. У них одни и те же терция и септима, а бас теперь спускается к I по полутонам.',
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
        'Into major, the ♭9 adds tension and slides down to the 5th of I. Into minor, it is the key’s own 9th: use it right away. The top four notes of V7♭9 form a diminished 7th chord.',
        'В мажоре ♭9 добавляет напряжения и соскальзывает на квинту I. В миноре это собственная нона тональности: берите её сразу. Четыре верхних звука V7♭9 образуют уменьшённый септаккорд.',
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
      note: note(
        'The most common blues form: twelve bars of I7, IV7 and V7. Try the blues scale on top.',
        'Самая распространённая форма блюза: двенадцать тактов на I7, IV7 и V7. Попробуйте сверху блюзовую гамму.',
      ),
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
        'Home on I, away to the subdominant (IV) and the dominant (V), then home again. In minor the V is major, taken from harmonic minor, so it leads home.',
        'Тоника, затем субдоминанта (IV) и доминанта (V), и снова тоника. В миноре V мажорная, из гармонического минора, поэтому ведёт к тонике.',
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
        'V to I closes on home. At 9ths the dominant takes the key’s own 9th: a plain 9 into major, smooth and bright, and a ♭9 into minor.',
        'V–I замыкает на тонике. У нонаккордов доминанта берёт нону тональности: простую в мажоре, мягко и светло, и ♭9 в миноре.',
      ),
    },
  ),
  entry(
    'classical',
    'deceptive',
    { major: 'I IV V vi', minor: 'i iv V VI' },
    'Deceptive cadence',
    'Прерванная каденция',
    {
      note: note(
        'V sets up a return home, but the progression lands on vi instead of I. In minor it lands on VI.',
        'V готовит возвращение к тонике, но последовательность приходит на vi вместо I. В миноре она приходит на VI.',
      ),
    },
  ),
  entry(
    'classical',
    'plagal',
    { major: 'I IV I', minor: 'i iv i' },
    'Plagal cadence',
    'Плагальная каденция',
    {
      note: note(
        'IV goes straight to I, with no V between. It is the “Amen” sung at the end of hymns.',
        'IV переходит прямо в I, без V. Это «аминь», которое поют в конце гимнов.',
      ),
    },
  ),
  entry(
    'classical',
    'andalusian',
    { minor: 'i VII VI V' },
    'Andalusian cadence',
    'Андалузская каденция',
    {
      note: note(
        'Four chords stepping down from the minor tonic to a major V. In A minor: Am, G, F, E.',
        'Четыре аккорда спускаются от минорной тоники к мажорной V. В ля миноре: Am, G, F, E.',
      ),
    },
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
        'Named after its bass notes, the 7th, 3rd and 6th degrees of the key. It is a ii–V–i into the relative minor, then a ii–V–I home.',
        'Названа по басу: VII, III и VI ступени тональности. Это ii–V–i в параллельный минор, затем ii–V–I домой.',
      ),
    },
  ),
  entry(
    'gospel',
    'gospel-walk-up',
    { major: '♭VI ♭VII I', minor: 'VI VII i' },
    'Gospel walk-up',
    'Госпел-подход',
    {
      note: note(
        'The bass climbs by whole tones into I. In major, ♭VI and ♭VII are borrowed from the parallel minor.',
        'Бас поднимается к I целыми тонами. В мажоре ♭VI и ♭VII взяты из одноимённого минора.',
      ),
    },
  ),
  entry(
    'theory',
    'key-chords',
    { major: 'I ii iii IV V vi vii°', minor: 'i ii° III iv v VI VII' },
    'The chords of the key',
    'Аккорды тональности',
    {
      note: note(
        'Lead into each chord by its V to hear the secondary dominants, or by its ii–V for a ii–V–I into every chord of the key.',
        'Подведите к каждому аккорду через его V, и прозвучат побочные доминанты. Через его ii–V получится ii–V–I к каждому аккорду тональности.',
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
        'Every degree of the key, each a 5th from the last, back home to I: the circle of fifths in the key’s own chords. In 7th chords, each chord’s 3rd becomes the next chord’s 7th. In minor, from iv, it is Autumn Leaves. Lead into each chord by its ii–V to go round the circle in ii–V–Is.',
        'Все ступени тональности, каждая через квинту от предыдущей, и домой к I: квинтовый круг на аккордах самой тональности. В септаккордах терция каждого аккорда становится септимой следующего. В миноре, от iv, это Autumn Leaves. Подведите к каждому аккорду через его ii–V, и круг пройдёт оборотами ii–V–I.',
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
        'Five m7 chords move clockwise round the circle of fifths, then four chords on major triads lead back home. Take it through all 12 keys.',
        'Пять аккордов m7 идут по квинтовому кругу по часовой стрелке, затем четыре аккорда на мажорных трезвучиях возвращают домой. Пройдите её во всех 12 тональностях.',
      ),
    },
  ),
] as const

/** A progression's id, as the library writes it. */
export type ProgressionId = (typeof LIBRARY)[number]['id']

/** The library, style by style in the order written. */
export const PROGRESSION_LIBRARY: readonly LibraryProgression[] = LIBRARY.map((each) => ({
  ...each,
  character: CHARACTERS[each.id],
}))
