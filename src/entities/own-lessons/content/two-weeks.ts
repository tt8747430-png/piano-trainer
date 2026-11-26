import type { Lesson, LessonBlock, LessonSection } from '@/entities/lesson'
import type { PatternId } from '@/entities/pattern'
import type { LocalText } from '@/shared/i18n'
import { note } from '@/shared/lib/music'
import type { OwnCourseTemplate } from '../model/template'

/*
 * Two weeks: F major and accompaniment. A fourteen-day course for an intermediate player who knows the
 * 7th chords in root position, some 2-5-1s, the octave bass and chord pulse. Built from the owner's
 * sources: Bobrova's seven kinds of accompaniment, Gorshkov's course (lessons 1 to 5), Called to Play,
 * Amanda Tero's left-hand patterns, Jazz Piano School's podcast (diatonic harmony, rootless voicings,
 * walking bass, bossa nova, harmonising a melody), Piano Lesson with Warren's gospel walking bass, and
 * the songs in the app: I Will Sing of Your Goodness (F), What a Friend (F), Daisy fields (Dm),
 * Snow-white robes (F), A blizzard again. Each section shows its example and says little, as every
 * lesson the app ships (`app/content/worksheets.test.ts`).
 */

const F = { tonic: note('F'), minor: false }
const B_FLAT = { tonic: note('B', -1), minor: false }

const t = (en: string, ru: string): LocalText => ({ en, ru })
const say = (en: string, ru: string): LessonBlock => ({ kind: 'text', text: t(en, ru) })
const steps = (...each: readonly (readonly [string, string])[]): LessonBlock => ({
  kind: 'steps',
  steps: each.map(([en, ru]) => t(en, ru)),
})
const chords = (...symbols: readonly string[]): LessonBlock => ({ kind: 'chords', symbols })
const apart = (...symbols: readonly string[]): LessonBlock => ({
  kind: 'chords',
  symbols,
  apart: true,
})
const pattern = (id: PatternId): LessonBlock => ({ kind: 'pattern', pattern: id, piece: 'friend' })
const part = (
  heading: LocalText,
  blocks: readonly LessonBlock[],
  takeaway?: LocalText,
): LessonSection => (takeaway ? { heading, blocks, takeaway } : { heading, blocks })

const TECHNIQUE = t('Technique · 10 min', 'Техника · 10 мин')
const HARMONY = t('Harmony · 15 min', 'Гармония · 15 мин')
const LEFT_HAND = t('Left hand and rhythm · 15 min', 'Левая рука и ритм · 15 мин')
const SONG = t('The song · 10 min', 'Песня · 10 мин')

const GOODNESS: LessonBlock = {
  kind: 'link',
  title: t('I Will Sing of Your Goodness', 'Voi cânta bunătatea Ta'),
  target: { opens: 'piece', piece: 'voi-canta' },
}
const FRIEND: LessonBlock = {
  kind: 'link',
  title: t('What a Friend We Have in Jesus', 'Что за Друг у нас Иисус'),
  target: { opens: 'piece', piece: 'friend' },
}
const DAISIES: LessonBlock = {
  kind: 'link',
  title: t('Daisy fields', 'Ромашковые поля'),
  target: { opens: 'piece', piece: 'romashki' },
}
const ROBES: LessonBlock = {
  kind: 'link',
  title: t('Snow-white robes', 'Белоснежные одежды'),
  target: { opens: 'piece', piece: 'bz10' },
}
const BLIZZARD: LessonBlock = {
  kind: 'link',
  title: t('A blizzard again', 'Опять метель'),
  target: { opens: 'piece', piece: 'metel' },
}

/** The first line of “Goodness”, as its chart has it. */
const GOODNESS_VERSE = chords('Fadd9', 'C/E', 'Dm7', 'Bbmaj7', 'C7sus4')
/** “What a Friend”’s first line. */
const FRIEND_LINE = chords('F', 'Bb', 'F', 'C', 'F')

const day = (
  n: number,
  title: LocalText,
  summary: LocalText,
  sections: readonly LessonSection[],
): Lesson => ({
  id: `two-weeks-day-${n}`,
  title: { en: `Day ${n}: ${title.en}`, ru: `День ${n}: ${title.ru}` },
  summary,
  sections,
})

const plan: Lesson = {
  id: 'two-weeks-plan',
  title: t('How the two weeks work', 'Как устроены две недели'),
  summary: t(
    'One session a day in five blocks, the map of F major, and the songs the course plays.',
    'Одно занятие в день из пяти блоков, карта фа мажора и песни курса.',
  ),
  sections: [
    part(
      t('The goal', 'Цель'),
      [
        say(
          'In two weeks: every chord of F in every inversion, arpeggios, ten left-hand patterns, five chords under one melody note, and “Goodness” played through in time.',
          'За две недели: все аккорды фа мажора во всех обращениях, арпеджио, десять фактур левой руки, пять аккордов под одной нотой мелодии и «Voi cânta» целиком в темпе.',
        ),
        GOODNESS_VERSE,
        GOODNESS,
      ],
      t(
        'One key, learned deeply, opens every other.',
        'Одна тональность, выученная глубоко, открывает остальные.',
      ),
    ),
    part(t('The daily session', 'Ежедневное занятие'), [
      steps(
        ['Recall · 3 min', 'Повторение · 3 мин'],
        ['Scales and arpeggios · 10 min', 'Гаммы и арпеджио · 10 мин'],
        ['Chords · 15 min', 'Аккорды · 15 мин'],
        ['Left hand, with the metronome · 15 min', 'Левая рука под метроном · 15 мин'],
        ['The song, then record it · 10 min', 'Песня, затем запись · 10 мин'],
      ),
      apart('F', 'Gm', 'Am', 'Bb', 'C', 'Dm', 'Edim'),
    ]),
    part(
      t('How to practise', 'Как заниматься'),
      [
        say(
          'Start at 60. Add 4 only after three clean passes. From day 4, the metronome clicks on 2 and 4. Say what you play: the numeral, the name, the notes.',
          'Начинайте с 60. Прибавляйте 4 только после трёх чистых проходов. С 4-го дня метроном щёлкает на 2 и 4. Называйте, что играете: ступень, название, звуки.',
        ),
        { kind: 'progression', numerals: 'I vi ii V', key: F },
      ],
      t('Slow and right beats fast and wrong.', 'Медленно и верно лучше, чем быстро и с ошибками.'),
    ),
    part(t('The songs', 'Песни'), [
      say(
        '“Goodness” is the main song. “What a Friend” takes the patterns, “Daisy fields” the 9ths and bossa nova, “Snow-white robes” Bobrova’s figuration.',
        '«Voi cânta» — главная песня. «Что за Друг» — для фактур, «Ромашковые поля» — для нонаккордов и босса-новы, «Белоснежные одежды» — для фигурации Бобровой.',
      ),
      FRIEND_LINE,
      FRIEND,
      DAISIES,
      ROBES,
    ]),
  ],
}

const day1 = day(
  1,
  t('the map of the key', 'карта тональности'),
  t(
    'The seven chords of F, the diatonic circle of fifths, the 1-5-8 left hand.',
    'Семь аккордов фа мажора, диатонический квинтовый круг, левая рука 1-5-8.',
  ),
  [
    part(TECHNIQUE, [
      say(
        'F major, two octaves, hands apart, eighths at 60. Right hand 1 2 3 4 1 2 3 4, the 4th on B♭. Left hand 5 4 3 2 1 3 2 1.',
        'Фа мажор, две октавы, отдельными руками, восьмыми на 60. Правая 1 2 3 4 1 2 3 4, четвёртый на си-бемоль. Левая 5 4 3 2 1 3 2 1.',
      ),
      { kind: 'scale', root: note('F'), scale: 'major' },
    ]),
    part(
      HARMONY,
      [
        say(
          'The seven 7th chords of F, saying each degree. Then by fourths: the diatonic circle of fifths, the way most songs move (Jazz Piano School).',
          'Семь септаккордов фа мажора, называя ступени. Затем по квартам: диатонический квинтовый круг, так движется большинство песен (Jazz Piano School).',
        ),
        { kind: 'progression', numerals: 'Imaj7 IVmaj7 viiø7 iii7 vi7 ii7 V7 Imaj7', key: F },
      ],
      t(
        'Learn the chords by number, not by name.',
        'Учите аккорды по ступеням, а не по названиям.',
      ),
    ),
    part(LEFT_HAND, [
      say(
        'Root, fifth, octave on each chord of the key: quarter, quarter, half (Amanda Tero’s first pattern).',
        'Основной тон, квинта, октава на каждом аккорде тональности: четверть, четверть, половинная (первая фактура Аманды Теро).',
      ),
      pattern('M4'),
    ]),
    part(SONG, [
      say(
        '“Goodness”, verse 1: the right hand in root position, the left on roots. Learn the line by eye and by ear.',
        '«Voi cânta», первый куплет: правая рука в основном виде, левая на басах. Выучите строку глазами и на слух.',
      ),
      GOODNESS_VERSE,
      GOODNESS,
    ]),
  ],
)

const day2 = day(
  2,
  t('triad inversions', 'обращения трезвучий'),
  t(
    'Every triad of F in three positions, the nearest inversion, the 1-5-8-5 left hand.',
    'Каждое трезвучие фа мажора в трёх положениях, ближайшее обращение, левая рука 1-5-8-5.',
  ),
  [
    part(TECHNIQUE, [
      say(
        'F major, hands together. Triad arpeggios of F, B♭ and C, two octaves. F: right hand 1 2 3 5, left 5 4 2 1.',
        'Фа мажор двумя руками. Арпеджио трезвучий F, B♭ и C, две октавы. F: правая 1 2 3 5, левая 5 4 2 1.',
      ),
      apart('F', 'Bb', 'C'),
    ]),
    part(
      HARMONY,
      [
        say(
          'Each triad of F in root position, first and second inversion. Then take the nearest one: I, IV over F, V over E, I. The hand barely moves.',
          'Каждое трезвучие фа мажора в основном виде, первом и втором обращении. Затем берите ближайшее: I, IV с басом фа, V с басом ми, I. Рука почти не двигается.',
        ),
        chords('F', 'Bb/F', 'C/E', 'F'),
      ],
      t(
        'Play the next chord where your hand already is.',
        'Берите следующий аккорд там, где уже рука.',
      ),
    ),
    part(LEFT_HAND, [
      say(
        'Root, fifth, octave, fifth in eighths: F C F C.',
        'Основной тон, квинта, октава, квинта восьмыми: фа до фа до.',
      ),
      pattern('g3'),
    ]),
    part(SONG, [
      say(
        'Every slash chord in “Goodness” is an inversion. The right hand takes the nearest one, the left hand the note after the slash.',
        'Каждый аккорд с басом в «Voi cânta» — обращение. Правая рука берёт ближайшее, левая — ноту после косой.',
      ),
      chords('C/E', 'Dm7/C', 'F/A', 'C/Bb'),
      GOODNESS,
    ]),
  ],
)

const day3 = day(
  3,
  t('7th chords and the 2-5-1', 'септаккорды и 2-5-1'),
  t(
    'Four positions of each 7th chord, the 2-5-1 by its guide tones, the open tenth.',
    'Четыре положения каждого септаккорда, 2-5-1 по направляющим тонам, открытая децима.',
  ),
  [
    part(TECHNIQUE, [
      say(
        'Triad arpeggios of Dm, Gm and Am. F major in contrary motion.',
        'Арпеджио Dm, Gm и Am. Фа мажор в расходящемся движении.',
      ),
      apart('Dm', 'Gm', 'Am'),
    ]),
    part(
      HARMONY,
      [
        say(
          'Play Fmaj7, Gm7, C7 and Dm7 in four positions each. Then the 2-5-1 by its 3rds and 7ths: one note moves at a time (Gorshkov, lesson 3).',
          'Сыграйте Fmaj7, Gm7, C7 и Dm7 в четырёх положениях. Затем 2-5-1 по терциям и септимам: каждый раз движется один звук (Горшков, урок 3).',
        ),
        { kind: 'progression', numerals: 'ii7 V7 Imaj7', key: F, show: 'motion' },
      ],
      t('The 3rd and the 7th tell the chord.', 'Терция и септима называют аккорд.'),
    ),
    part(LEFT_HAND, [
      say(
        'Root, fifth, then the tenth: F C A. “Goodness” opens on it.',
        'Основной тон, квинта, затем децима: фа до ля. С неё начинается «Voi cânta».',
      ),
      pattern('M3'),
    ]),
    part(SONG, [
      say(
        '“Goodness”, chorus 1, the left hand in open tenths.',
        '«Voi cânta», первый припев, левая рука открытыми децимами.',
      ),
      chords('F', 'C/E', 'Dm7', 'Bbmaj7', 'Gm7', 'C13', 'F'),
      GOODNESS,
    ]),
  ],
)

const day4 = day(
  4,
  t('keeping the rhythm', 'держать ритм'),
  t(
    'The metronome on 2 and 4, chord pulse, the 3-3-2 push, Bobrova’s first three types.',
    'Метроном на 2 и 4, аккордовая пульсация, ритм 3-3-2, первые три вида Бобровой.',
  ),
  [
    part(TECHNIQUE, [
      say(
        'F and Dm arpeggios, hands together. D harmonic minor, with C♯.',
        'Арпеджио F и Dm двумя руками. Ре гармонический минор, с до-диезом.',
      ),
      { kind: 'scale', root: note('D'), scale: 'harmonic' },
    ]),
    part(
      LEFT_HAND,
      [
        say(
          'From today the metronome clicks on 2 and 4. Chord pulse: the right hand in eighths, the bass on 1 and 3. Count aloud.',
          'С сегодняшнего дня метроном щёлкает на 2 и 4. Аккордовая пульсация: правая рука восьмыми, бас на 1 и 3. Считайте вслух.',
        ),
        pattern('r3'),
      ],
      t('The groove lives on 2 and 4.', 'Грув живёт на 2 и 4.'),
    ),
    part(t('The 3-3-2 push', 'Ритм 3-3-2'), [
      say(
        'Dotted quarter, dotted quarter, quarter. Then try three more from Pianote’s “10 must-know rhythm patterns”.',
        'Четверть с точкой, четверть с точкой, четверть. Затем ещё три ритма из «10 must-know rhythm patterns» Pianote.',
      ),
      pattern('popSync'),
    ]),
    part(SONG, [
      say(
        '“What a Friend” in Bobrova’s types 1, 2 and 3, one line each.',
        '«Что за Друг у нас Иисус» в видах Бобровой 1, 2 и 3, по строке каждый.',
      ),
      pattern('r1'),
      pattern('r2'),
      FRIEND,
    ]),
  ],
)

const day5 = day(
  5,
  t('figuration', 'фигурация'),
  t(
    'Arpeggios inside a song: 7th-chord arpeggios, Bobrova’s type 4, Called to Play’s five ways.',
    'Арпеджио внутри песни: арпеджио септаккордов, четвёртый вид Бобровой, пять способов «Призван играть».',
  ),
  [
    part(TECHNIQUE, [
      say(
        'Arpeggios of Fmaj7 and Dm7: right hand 1 2 3 4, the thumb passing under to the next F.',
        'Арпеджио Fmaj7 и Dm7: правая рука 1 2 3 4, первый палец подкладывается к следующему фа.',
      ),
      apart('Fmaj7', 'Dm7'),
    ]),
    part(
      LEFT_HAND,
      [
        say(
          'Bobrova’s type 4 runs the chord through both hands. Its variant keeps it in the right hand over the bass.',
          'Четвёртый вид Бобровой ведёт аккорд через обе руки. Его вариант оставляет его в правой руке над басом.',
        ),
        pattern('r4'),
        pattern('r4b'),
      ],
      t('Figuration is the chord in motion.', 'Фигурация — это аккорд в движении.'),
    ),
    part(t('The five ways', 'Пять способов'), [
      say(
        'Called to Play’s five ways on one line: bass and chords, broken chords, an arpeggio.',
        'Пять способов «Призван играть» на одной строке: бас и аккорды, ломаные аккорды, арпеджио.',
      ),
      pattern('M1'),
      pattern('M2'),
    ]),
    part(SONG, [
      say(
        'Bobrova’s “Snow-white robes”: read her accompaniment, then play it.',
        '«Белоснежные одежды» Бобровой: прочитайте её аккомпанемент, затем сыграйте.',
      ),
      chords('F', 'Bb', 'C', 'F'),
      ROBES,
    ]),
  ],
)

const day6 = day(
  6,
  t('one melody note, many chords', 'одна нота, много аккордов'),
  t(
    'Harmonising a melody note, diminished and augmented chords, the line cliché.',
    'Гармонизация ноты мелодии, уменьшённые и увеличенные аккорды, хроматический ход.',
  ),
  [
    part(TECHNIQUE, [
      say(
        'F, B♭ and C arpeggios hands together, two octaves, at 70.',
        'Арпеджио F, B♭ и C двумя руками, две октавы, на 70.',
      ),
      apart('F', 'Bb', 'C'),
    ]),
    part(
      HARMONY,
      [
        say(
          'Keep A on top and change the chord under it. A is the 3rd of F, the 5th of Dm, the 7th of B♭maj7.',
          'Держите ля наверху и меняйте аккорд под ним. Ля — терция F, квинта Dm, септима B♭maj7.',
        ),
        { kind: 'chords', symbols: ['F', 'Dm', 'Bbmaj7', 'Am'], melody: note('A') },
        {
          kind: 'link',
          title: t('Chords in F major', 'Аккорды фа мажора'),
          target: { opens: 'key', key: F },
        },
      ],
      t('A melody note belongs to many chords.', 'Нота мелодии входит во многие аккорды.'),
    ),
    part(t('Diminished and augmented', 'Уменьшённые и увеличенные'), [
      say(
        'Diminished is minor thirds stacked, augmented is major thirds. Between two chords they pass: F, F♯dim7, Gm7, as “Goodness” does.',
        'Уменьшённый — малые терции друг на друге, увеличенный — большие. Между двумя аккордами они проходящие: F, F♯dim7, Gm7, как в «Voi cânta».',
      ),
      chords('F', 'F#dim7', 'Gm7'),
    ]),
    part(t('The line cliché', 'Хроматический ход'), [
      say(
        'F, F+, F6, F7, then B♭: the top climbs C, C♯, D, E♭.',
        'F, F+, F6, F7, затем B♭: верхний голос поднимается до, до-диез, ре, ми-бемоль.',
      ),
      chords('F', 'F+', 'F6', 'F7', 'Bb'),
    ]),
    part(SONG, [
      say(
        'Find the passing chords in “Goodness” and play them slowly.',
        'Найдите проходящие аккорды в «Voi cânta» и сыграйте их медленно.',
      ),
      chords('C/E', 'C#dim7', 'Dm9', 'Bb', 'Bdim7', 'F/C'),
      GOODNESS,
    ]),
  ],
)

const day7 = day(
  7,
  t('review and record', 'повторение и запись'),
  t(
    'Week 1 at random, then “Goodness” recorded.',
    'Первая неделя вразброс, затем запись «Voi cânta».',
  ),
  [
    part(t('Check yourself', 'Проверьте себя'), [
      steps(
        [
          'All seven triads of F in three positions.',
          'Все семь трезвучий фа мажора в трёх положениях.',
        ],
        ['All seven 7th chords in four positions.', 'Все семь септаккордов в четырёх положениях.'],
        ['The 2-5-1 in F by its guide tones.', '2-5-1 в фа мажоре по направляющим тонам.'],
        ['Five left-hand patterns, four bars each.', 'Пять фактур левой руки, по четыре такта.'],
      ),
      apart('Fmaj7', 'Gm7', 'Am7', 'Bbmaj7', 'C7', 'Dm7', 'Em7b5'),
    ]),
    part(
      t('Record', 'Запись'),
      [
        say(
          '“Goodness”, verse and chorus 1, at 72: the verse in open tenths, the chorus in chord pulse. Keep it for day 14.',
          '«Voi cânta», первый куплет и припев, на 72: куплет открытыми децимами, припев пульсацией. Сохраните запись до 14-го дня.',
        ),
        GOODNESS_VERSE,
        GOODNESS,
      ],
      t('A recording tells the truth about the beat.', 'Запись говорит правду о пульсе.'),
    ),
  ],
)

const day8 = day(
  8,
  t('9ths and drop 2', 'ноны и drop 2'),
  t(
    '9th chords, the hands spread apart, drop-2 voicings, rising left-hand lines.',
    'Нонаккорды, широкое расположение, drop 2, восходящие фактуры левой руки.',
  ),
  [
    part(TECHNIQUE, [
      say(
        'Arpeggios of Gm7, C7 and B♭maj7. F major in sixteenths at 60.',
        'Арпеджио Gm7, C7 и B♭maj7. Фа мажор шестнадцатыми на 60.',
      ),
      apart('Gm7', 'C7', 'Bbmaj7'),
    ]),
    part(
      HARMONY,
      [
        say(
          'Spread the hands: the left plays root and fifth, the right the 3rd, 7th and 9th (Gorshkov, lesson 2).',
          'Разведите руки: левая играет основной тон и квинту, правая терцию, септиму и нону (Горшков, урок 2).',
        ),
        { kind: 'progression', numerals: 'ii V I', key: F, size: 'ninths' },
      ],
      t('Spread the hands and the chord opens up.', 'Разведите руки, и аккорд раскроется.'),
    ),
    part(t('Drop 2', 'Drop 2'), [
      say(
        'Take a close chord and drop its second note from the top an octave. Then play the 2-5-1 that way.',
        'Возьмите тесный аккорд и опустите второй сверху звук на октаву. Затем сыграйте так 2-5-1.',
      ),
      {
        kind: 'voicings',
        key: F,
        voicings: [
          { symbol: 'Gm7', hands: 'G2 | D4 G4 B♭4 F5' },
          { symbol: 'C7', hands: 'C3 | G4 C5 E5 B♭5' },
          { symbol: 'Fmaj7', hands: 'F2 | C4 F4 A4 E5' },
        ],
      },
    ]),
    part(LEFT_HAND, [
      say(
        'The pulse with the 2nd added, as verse 2 of “Goodness” plays its ninth.',
        'Пульсация с добавленной секундой, как нона во втором куплете «Voi cânta».',
      ),
      pattern('g2'),
    ]),
    part(SONG, [
      say('“Daisy fields” with its 7ths and 9ths.', '«Ромашковые поля» с септ- и нонаккордами.'),
      chords('Dm9', 'Gm9', 'C9', 'Fmaj9'),
      DAISIES,
    ]),
  ],
)

const day9 = day(
  9,
  t('2-5-1 around F', '2-5-1 вокруг фа'),
  t(
    'The 2-5-1 in F, B♭, C and E♭, rootless voicings, the minor 2-5-1 in D minor.',
    '2-5-1 в F, B♭, C и E♭, аккорды без основного тона, минорный 2-5-1 в ре миноре.',
  ),
  [
    part(TECHNIQUE, [
      say('B♭ and C major, scales and arpeggios.', 'Си-бемоль мажор и до мажор, гаммы и арпеджио.'),
      { kind: 'scale', root: note('B', -1), scale: 'major' },
    ]),
    part(
      HARMONY,
      [
        say(
          'The 2-5-1 in F, B♭, C and E♭, first by guide tones, then rootless: the left hand drops the root (Jazz Piano School).',
          '2-5-1 в F, B♭, C и E♭, сначала по направляющим тонам, затем без основного тона: левая рука не играет бас (Jazz Piano School).',
        ),
        { kind: 'progression', numerals: 'ii7 V7 Imaj7', key: B_FLAT },
        {
          kind: 'link',
          title: t('The 2-5-1 round the keys', '2-5-1 по тональностям'),
          target: { opens: 'player', numerals: 'ii7 V7 Imaj7', key: F, walk: 'fifths' },
        },
      ],
      t('One shape, every key.', 'Одна форма, все тональности.'),
    ),
    part(t('The minor 2-5-1', 'Минорный 2-5-1'), [
      say(
        'In D minor: a half-diminished ii, a dominant with a flat 9th, then i.',
        'В ре миноре: полууменьшённый ii, доминанта с малой ноной, затем i.',
      ),
      chords('Em7b5', 'A7b9', 'Dm7'),
    ]),
    part(SONG, [
      say('The bridge of “Goodness” is all 2-5s.', 'Бридж «Voi cânta» — сплошные 2-5.'),
      chords('Dm9', 'Gm11', 'Bbmaj7', 'C7sus4'),
      GOODNESS,
    ]),
  ],
)

const day10 = day(
  10,
  t('walking bass', 'шагающий бас'),
  t(
    'The 3-6-2-5-1, secondary dominants, a walking bass in three steps.',
    '3-6-2-5-1, побочные доминанты, шагающий бас в три шага.',
  ),
  [
    part(TECHNIQUE, [
      say('Arpeggios of C7, F7 and B♭7, hands apart.', 'Арпеджио C7, F7 и B♭7 отдельными руками.'),
      apart('C7', 'F7', 'Bb7'),
    ]),
    part(HARMONY, [
      say(
        'The 3-6-2-5-1 in F. Then make each chord a dominant into the next: A7 into Dm, D7 into Gm, G7 into C.',
        '3-6-2-5-1 в фа мажоре. Затем сделайте каждый аккорд доминантой к следующему: A7 к Dm, D7 к Gm, G7 к C.',
      ),
      { kind: 'progression', numerals: 'iii7 vi7 ii7 V7 Imaj7', key: F },
      chords('A7', 'D7', 'G7', 'C7', 'Fmaj7'),
    ]),
    part(
      LEFT_HAND,
      [
        steps(
          ['Half notes: root, then fifth.', 'Половинными: основной тон, затем квинта.'],
          [
            'Quarters: root, 3rd, 5th, then a half step into the next root.',
            'Четвертями: основной тон, терция, квинта, затем полутон к следующему басу.',
          ],
          [
            'Warren’s gospel walk, short chords on 2 and 4.',
            'Госпел-ход Уоррена, короткие аккорды на 2 и 4.',
          ],
        ),
        pattern('gospel'),
      ],
      t(
        'Every fourth note leans into the next chord.',
        'Каждая четвёртая нота тянется к следующему аккорду.',
      ),
    ),
    part(SONG, [
      say(
        'The chorus of “What a Friend” over a walking bass.',
        'Припев «Что за Друг» с шагающим басом.',
      ),
      FRIEND_LINE,
      FRIEND,
    ]),
  ],
)

const day11 = day(
  11,
  t('bossa nova', 'босса-нова'),
  t(
    'The bossa nova bass and comping on 7ths and 9ths.',
    'Бас и компинг босса-новы на септ- и нонаккордах.',
  ),
  [
    part(TECHNIQUE, [
      say(
        'Am and Em arpeggios. F major faster, aiming for 80.',
        'Арпеджио Am и Em. Фа мажор быстрее, цель — 80.',
      ),
      apart('Am', 'Em'),
    ]),
    part(HARMONY, [
      say(
        'Bossa nova lives on 7ths and 9ths: your spread voicings of day 8.',
        'Босса-нова живёт на септ- и нонаккордах: ваши широкие расположения 8-го дня.',
      ),
      chords('Dm9', 'Gm9', 'C13', 'Fmaj9'),
    ]),
    part(
      LEFT_HAND,
      [
        say(
          'The bass: root on 1, fifth on 3, each with an eighth before it. The right hand pushes the chord onto the “and”s. Check it against Jazz Piano School’s bossa lesson.',
          'Бас: основной тон на 1, квинта на 3, каждый с восьмой перед ним. Правая рука сдвигает аккорд на «и». Сверьте с уроком босса-новы Jazz Piano School.',
        ),
        pattern('jazz'),
      ],
      t(
        'Bossa nova is quiet, even and a little early.',
        'Босса-нова тихая, ровная и чуть раньше доли.',
      ),
    ),
    part(SONG, [
      say(
        '“Daisy fields”, or the bridge of “Goodness”, as a bossa nova.',
        '«Ромашковые поля» или бридж «Voi cânta» как босса-нова.',
      ),
      chords('Dm9', 'Gm9', 'A7b9', 'Dm9'),
      DAISIES,
    ]),
  ],
)

const day12 = day(
  12,
  t('stride and passing chords', 'страйд и проходящие аккорды'),
  t(
    'Passing chords in F, stride, Amanda Tero’s left-hand patterns.',
    'Проходящие аккорды в фа мажоре, страйд, фактуры левой руки Аманды Теро.',
  ),
  [
    part(TECHNIQUE, [
      say('Two-hand arpeggios in F and Dm.', 'Арпеджио двумя руками в F и Dm.'),
      apart('F', 'Dm'),
    ]),
    part(HARMONY, [
      say(
        'Walk between chords: I to its first inversion to IV, then IV through a diminished 7th to I over its fifth.',
        'Переходите между аккордами: I через первое обращение к IV, затем IV через уменьшённый септаккорд к I с басом на квинте.',
      ),
      chords('F', 'F/A', 'Bb', 'Bdim7', 'F/C'),
    ]),
    part(
      LEFT_HAND,
      [
        say(
          'Stride: the bass or an octave on 1 and 3, the chord in the middle on 2 and 4. Then Tero’s broken octave and dotted push.',
          'Страйд: бас или октава на 1 и 3, аккорд в середине на 2 и 4. Затем ломаная октава и пунктирный толчок Теро.',
        ),
        pattern('oct'),
        pattern('t5'),
      ],
      t('The left hand is the band’s bass and drums.', 'Левая рука — это бас и барабаны.'),
    ),
    part(SONG, [
      say(
        '“Goodness”, chorus 3: rolling 1-5-8-10, then stride.',
        '«Voi cânta», третий припев: 1-5-8-10 волной, затем страйд.',
      ),
      chords('F', 'F7/A', 'Bb', 'Bdim7', 'F/C', 'Dm9', 'Gm11', 'C7sus4'),
      GOODNESS,
    ]),
  ],
)

const day13 = day(
  13,
  t('reharmonise a hymn', 'реармонизация гимна'),
  t(
    'Your own chords for “What a Friend”, and right-hand fills on its long notes.',
    'Свои аккорды для «Что за Друг», и заполнения правой рукой на долгих нотах.',
  ),
  [
    part(TECHNIQUE, [
      say(
        'Every arpeggio of the week at random, one octave, hands together.',
        'Все арпеджио недели вразброс, одна октава, двумя руками.',
      ),
      apart('F', 'Gm7', 'C7', 'Dm7', 'Bbmaj7'),
    ]),
    part(
      HARMONY,
      [
        steps(
          [
            'Under each long note, try three chords that hold it.',
            'Под каждой долгой нотой попробуйте три аккорда, которые её содержат.',
          ],
          ['Put a dominant before IV and before vi.', 'Поставьте доминанту перед IV и перед vi.'],
          [
            'Put one passing dim7 in each line.',
            'Поставьте по одному проходящему уменьшённому септаккорду в строке.',
          ],
          ['Write your best version into this lesson.', 'Запишите лучший вариант в этот урок.'],
        ),
        chords('F', 'F7', 'Bb', 'Bdim7', 'F/C', 'D7', 'Gm7', 'C7', 'F'),
      ],
      t(
        'Reharmonise for the singers, not against them.',
        'Реармонизуйте для поющих, а не против них.',
      ),
    ),
    part(LEFT_HAND, [
      say(
        'Where the voice holds, the right hand runs on beats 3 and 4, anchored on the 3rd and the 7th (Gorshkov, lesson 5).',
        'Где голос тянет, правая рука ведёт пассаж на 3 и 4, опираясь на терцию и септиму (Горшков, урок 5).',
      ),
      pattern('g6'),
    ]),
    part(SONG, [
      say('“A blizzard again”, in Gorshkov’s way.', '«Опять метель» по методу Горшкова.'),
      chords('Am7', 'Dm7', 'G7', 'Cmaj7'),
      BLIZZARD,
    ]),
  ],
)

const day14 = day(
  14,
  t('the whole song', 'вся песня'),
  t(
    '“Goodness” from start to end, each section fuller, recorded and compared.',
    '«Voi cânta» от начала до конца, каждая часть полнее, запись и сравнение.',
  ),
  [
    part(
      t('Verses and choruses', 'Куплеты и припевы'),
      [
        steps(
          ['Verse 1: open tenths.', 'Первый куплет: открытые децимы.'],
          [
            'Chorus 1: root, fifth, octave, fifth.',
            'Первый припев: основной тон, квинта, октава, квинта.',
          ],
          ['Verse 2: the ninth in eighths.', 'Второй куплет: нона восьмыми.'],
          ['Chorus 2: rootless voicings.', 'Второй припев: аккорды без основного тона.'],
          ['Chorus 3: rolling, then stride.', 'Третий припев: волной, затем страйд.'],
        ),
        GOODNESS_VERSE,
        GOODNESS,
      ],
      t('Each section one step fuller than the last.', 'Каждая часть на шаг полнее предыдущей.'),
    ),
    part(t('The bridge and the end', 'Бридж и конец'), [
      say(
        'The bridge as a bossa nova, the last chorus in octaves. Colour the long notes with the passing chords of day 6.',
        'Бридж как босса-нова, последний припев октавами. Раскрасьте долгие ноты проходящими аккордами 6-го дня.',
      ),
      chords('Dm9', 'Gm11', 'C13', 'F6/9'),
    ]),
    part(t('Compare', 'Сравните'), [
      say(
        'Record it and listen beside day 7. Then write three weak spots into this lesson: they are your next two weeks.',
        'Запишите и послушайте рядом с записью 7-го дня. Затем запишите в этот урок три слабых места: это ваши следующие две недели.',
      ),
      apart('F', 'Gm7', 'C7', 'Fmaj7'),
    ]),
  ],
)

/** The two weeks as a course to start from: the plan, then a lesson a day. */
export const TWO_WEEKS: OwnCourseTemplate = {
  id: 'two-weeks-f-major',
  title: t('Two weeks: F major and accompaniment', 'Две недели: фа мажор и аккомпанемент'),
  line: t(
    'Inversions, arpeggios, left-hand patterns and rhythm, 55 minutes a day.',
    'Обращения, арпеджио, фактуры левой руки и ритм, 55 минут в день.',
  ),
  look: { picture: 'piano', paint: 'yellow' },
  lessons: [
    plan,
    day1,
    day2,
    day3,
    day4,
    day5,
    day6,
    day7,
    day8,
    day9,
    day10,
    day11,
    day12,
    day13,
    day14,
  ],
}
