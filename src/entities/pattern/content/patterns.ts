import type { LocalText } from '@/shared/i18n'
import type { EventPattern, Pattern } from '@/shared/lib/arrangement'
import {
  PATTERN_IDS,
  type LeftFigureId,
  type PatternEntry,
  type PatternGroup,
  type PatternId,
  type RightFigureId,
} from '../model/types'
import { LEFT_FIGURES, RIGHT_FIGURES } from './figures'

export const PATTERN_GROUP_NAMES: Readonly<Record<PatternGroup, LocalText>> = {
  'lesson-3': {
    en: 'Called to Play — the 5 ways (lesson 3)',
    ru: 'Called to Play — 5 способов (урок 3)',
  },
  techniques: {
    en: 'Called to Play — right-hand techniques',
    ru: 'Called to Play — техники правой руки',
  },
  'seven-types': {
    en: '7 types of accompaniment (Боброва)',
    ru: '7 типов аккомпанемента (Боброва)',
  },
  genres: { en: 'Rhythm styles', ru: 'Ритмические стили' },
}

type WrittenPattern = Omit<PatternEntry, 'pattern'>

const WRITTEN: Readonly<Record<PatternId, WrittenPattern>> = {
  M1: {
    group: 'lesson-3',
    name: { en: '1 · Bass + chords', ru: '1 · Бас + аккорды' },
    description: {
      en: 'Left hand holds the bass in octaves, right hand plays the chord on every beat.',
      ru: 'Левая рука держит бас октавами, правая играет аккорд на каждую долю.',
    },
    rh: 'b1',
    lh: 'o',
  },
  M2: {
    group: 'lesson-3',
    name: { en: '2 · Broken chords', ru: '2 · Ломаные аккорды' },
    description: {
      en: 'Left hand holds the octave. Right hand rocks between the upper two notes and the root in 8ths.',
      ru: 'Левая рука держит октаву. Правая восьмыми чередует два верхних звука и основной тон.',
    },
    rh: 'b2',
    lh: 'o',
  },
  M3: {
    group: 'lesson-3',
    name: {
      en: '3 · Arpeggio (3rd, then 5th + octave)',
      ru: '3 · Арпеджио (терция, затем квинта + октава)',
    },
    description: {
      en: 'Left hand 1–5–8 (fingers 5–2–1), right hand continues with the 3rd and holds the 5th and octave.',
      ru: 'Левая рука 1–5–8 (пальцы 5–2–1), правая продолжает терцией и держит квинту с октавой.',
    },
    rh: 'b3',
    lh: 'arp',
  },
  M4: {
    group: 'lesson-3',
    name: { en: '4 · Arpeggio 1–5–8 · 3–5–8–5–3', ru: '4 · Арпеджио 1–5–8 · 3–5–8–5–3' },
    description: {
      en: 'The arpeggio runs up through the left hand and on through the right hand, then comes back down. All 8ths.',
      ru: 'Арпеджио поднимается через левую руку, продолжается в правой и возвращается вниз. Всё восьмыми.',
    },
    rh: 'b4',
    lh: 'arp',
  },
  M5: {
    group: 'lesson-3',
    name: { en: '5 · Bass + chords (dotted bass)', ru: '5 · Бас + аккорды (пунктирный бас)' },
    description: {
      en: 'Right hand plays the chord on every beat, left hand plays octaves in a long–short (♩. ♪) rhythm.',
      ru: 'Правая рука играет аккорд на каждую долю, левая — октавы в ритме «долго–коротко» (♩. ♪).',
    },
    rh: 'b1',
    lh: 'dot',
  },
  t1: {
    group: 'techniques',
    name: { en: '♪♩ Chord, then octave jumps', ru: '♪♩ Аккорд, затем скачки на октаву' },
    description: {
      en: 'Technique 1: the chord, then the root one and two octaves higher and back.',
      ru: 'Техника 1: аккорд, затем основной тон на одну и две октавы выше и обратно.',
    },
    rh: 't1',
    lh: 'o',
  },
  t2: {
    group: 'techniques',
    name: { en: '♪♪♪♪ Arpeggio up two octaves', ru: '♪♪♪♪ Арпеджио вверх на две октавы' },
    description: {
      en: 'Technique 2: right hand arpeggio 1–3–5–8 twice, fingers 1–2–3–5.',
      ru: 'Техника 2: арпеджио правой рукой 1–3–5–8 дважды, пальцы 1–2–3–5.',
    },
    rh: 't2',
    lh: 'o',
  },
  t3: {
    group: 'techniques',
    name: { en: '♬ Runs down from the top', ru: '♬ Пассажи вниз от верхнего звука' },
    description: {
      en: 'Technique 3: from the top of the chord down through the 3rd and 2nd to the root, then again an octave lower.',
      ru: 'Техника 3: от верхнего звука аккорда вниз через терцию и секунду к основному тону, затем ещё раз октавой ниже.',
    },
    rh: 't3',
    lh: 'o',
  },
  t4: {
    group: 'techniques',
    name: { en: '♬ Fast arpeggio up', ru: '♬ Быстрое арпеджио вверх' },
    description: {
      en: 'Technique 4: a quick rising arpeggio over two octaves that lands on the chord.',
      ru: 'Техника 4: быстрое восходящее арпеджио через две октавы, которое приходит на аккорд.',
    },
    rh: 't4',
    lh: 'o',
  },
  t5: {
    group: 'techniques',
    name: { en: '♩.♪♩ Dotted chords', ru: '♩.♪♩ Пунктирные аккорды' },
    description: {
      en: 'Technique 5: the chord in root position, 1st and 2nd inversion in a dotted rhythm. Left hand wide arpeggio (fingers 5–2–1–2–1–2).',
      ru: 'Техника 5: аккорд в основном виде, в 1-м и 2-м обращении в пунктирном ритме. Левая рука — широкое арпеджио (пальцы 5–2–1–2–1–2).',
    },
    rh: 't5',
    lh: 'wide',
  },
  c3: {
    group: 'techniques',
    name: { en: '3 chords', ru: '3 аккорда' },
    description: {
      en: 'Technique 6: three chords climbing through the inversions, the last one rolled.',
      ru: 'Техника 6: три аккорда поднимаются по обращениям, последний арпеджирован.',
    },
    rh: 'c3',
    lh: 'wide',
  },
  inv: {
    group: 'techniques',
    name: { en: 'Invers. · Inversions', ru: 'Обращ. · Обращения' },
    description: {
      en: 'Technique 7: root position, then the 1st and 2nd inversion.',
      ru: 'Техника 7: основной вид, затем 1-е и 2-е обращение.',
    },
    rh: 'inv',
    lh: 'wide',
  },
  p51: {
    group: 'techniques',
    name: { en: '5.1 · Root steps down to ♭7', ru: '5.1 · Основной тон спускается к ♭7' },
    description: {
      en: 'Technique 8: the top of the chord stays while the root steps down a whole tone (Dm → Dm7).',
      ru: 'Техника 8: верх аккорда остаётся, а основной тон спускается на целый тон (Dm → Dm7).',
    },
    rh: 'p51',
    lh: 'dot',
  },
  p52: {
    group: 'techniques',
    name: { en: '5.2 · Falling line 1–7–♭7–6', ru: '5.2 · Нисходящая линия 1–7–♭7–6' },
    description: {
      en: 'Technique 9: the lowest voice falls by half steps; on a major chord it stops at ♭7.',
      ru: 'Техника 9: нижний голос спускается по полутонам; на мажорном аккорде он останавливается на ♭7.',
    },
    rh: 'p52',
    lh: 'dot',
  },
  p53: {
    group: 'techniques',
    name: { en: '5.3 · The 3rd moves 3–2–4–3', ru: '5.3 · Терция движется 3–2–4–3' },
    description: {
      en: 'Technique 10: the 3rd moves to the 2nd, the 4th and back.',
      ru: 'Техника 10: терция переходит в секунду, в кварту и обратно.',
    },
    rh: 'p53',
    lh: 'dot',
  },
  s6u: {
    group: 'techniques',
    name: { en: '6th↑ · Rising sixths', ru: 'Сексты ↑ · Восходящие сексты' },
    description: {
      en: 'Technique 11: parallel sixths climb to the chord over a 1–5–8–5 bass.',
      ru: 'Техника 11: параллельные сексты поднимаются к аккорду над басом 1–5–8–5.',
    },
    rh: 's6u',
    lh: 'q',
  },
  s6d: {
    group: 'techniques',
    name: { en: '6th↓ · Falling sixths', ru: 'Сексты ↓ · Нисходящие сексты' },
    description: {
      en: 'Technique 12: parallel sixths fall to the chord.',
      ru: 'Техника 12: параллельные сексты спускаются к аккорду.',
    },
    rh: 's6d',
    lh: 'q',
  },
  r1: {
    group: 'seven-types',
    name: { en: '1 · Harmonic basis', ru: '1 · Гармоническая основа' },
    description: {
      en: 'Chords and bass together in long, even notes (chorale texture). Supports choirs and ensembles; good for prayer hymns and for the start or the end of a song.',
      ru: 'Аккорды и бас вместе, долгими ровными нотами (хоральная фактура). Поддерживает хор и ансамбль; подходит для молитвенных гимнов, для начала или конца песни.',
    },
    rh: 'r1',
    lh: 'h',
  },
  r2: {
    group: 'seven-types',
    name: { en: '2 · Bass–chord alternation', ru: '2 · Чередование бас-аккорд' },
    description: {
      en: 'The bass moves through the notes of the triad. A clear pulse, best for praise and joyful hymns. Play the chords lightly, the top note a little louder.',
      ru: 'Бас движется по звукам трезвучия. Ясная пульсация, лучше всего для хвалы и радостных гимнов. Аккорды играйте легко, верхний звук чуть громче.',
    },
    rh: 'r2',
    lh: 'alt',
  },
  r3: {
    group: 'seven-types',
    name: { en: '3 · Chord pulse', ru: '3 · Аккордовая пульсация' },
    description: {
      en: 'The right hand repeats the chord, the bass comes less often. Slow is calm and thoughtful, fast is excited: for words that need emotion.',
      ru: 'Правая рука повторяет аккорд, бас звучит реже. Медленно — спокойно и вдумчиво, быстро — взволнованно: для слов, которым нужна эмоция.',
    },
    rh: 'r3',
    lh: 'alt',
  },
  r4: {
    group: 'seven-types',
    name: { en: '4 · Harmonic figuration', ru: '4 · Гармонические фигурации' },
    description: {
      en: 'The arpeggio passes from the left hand (1–5–8, without the 3rd) into the right hand, which plays the chord notes in the order 1–3–2–4–3. The most used type in church: it brings movement and sings.',
      ru: 'Арпеджио переходит из левой руки (1–5–8, без терции) в правую, которая играет звуки аккорда в порядке 1–3–2–4–3. Самый употребительный тип в церкви: даёт движение и певучесть.',
    },
    rh: 'r4',
    lh: 'fig',
  },
  r4b: {
    group: 'seven-types',
    name: { en: '4b · Broken arpeggios', ru: '4b · Ломаные арпеджио' },
    description: {
      en: 'The right hand breaks the chord while the bass moves through the triad.',
      ru: 'Правая рука играет ломаное арпеджио, а бас движется по трезвучию.',
    },
    rh: 'r4b',
    lh: 'alt',
  },
  r5: {
    group: 'seven-types',
    name: { en: '5 · Melody doubling', ru: '5 · Дублирование мелодии' },
    description: {
      en: 'The right hand plays the tune, the left hand accompanies. Helps children and unsure singers; good for intros, interludes and endings too.',
      ru: 'Правая рука играет мелодию, левая аккомпанирует. Помогает детям и неуверенным певцам; хорошо и для вступлений, проигрышей и окончаний.',
    },
    rh: 'mel',
    lh: 'bro',
  },
  r6: {
    group: 'seven-types',
    name: { en: '6 · Elements of the melody', ru: '6 · С элементами мелодии' },
    description: {
      en: 'The melody sounds only at the start and the end of each phrase, as anchor points. Figuration fills the rest.',
      ru: 'Мелодия звучит только в начале и в конце каждой фразы, как опорные точки. Остальное заполняет фигурация.',
    },
    rh: 'melE',
    lh: 'fig',
  },
  r7: {
    group: 'seven-types',
    name: { en: '7 · Harmony in the melody', ru: '7 · Гармония в мелодии' },
    description: {
      en: 'The melody is the top voice; up to two chord notes join it under long notes, short notes stay single. Full and bright for congregational singing.',
      ru: 'Мелодия — верхний голос; под долгими нотами к ней добавляются до двух звуков аккорда, короткие остаются одиночными. Полно и ярко для общего пения.',
    },
    rh: 'melH',
    lh: 'q',
  },
  block: { group: 'genres', name: { en: 'Whole notes', ru: 'Целые ноты' }, rh: 'x1', lh: 'r' },
  flow: {
    group: 'genres',
    name: { en: 'Chord flow (I–IV–V shapes)', ru: 'Chord flow (обороты I–IV–V)' },
    rh: 'flow',
    lh: 'r',
  },
  pop8: { group: 'genres', name: { en: 'Pop 8ths', ru: 'Поп-восьмые' }, rh: 'r3', lh: 'pop' },
  popSync: {
    group: 'genres',
    name: { en: 'Pop syncopated', ru: 'Поп с синкопами' },
    rh: 'sync',
    lh: 'sync',
  },
  ballad: {
    group: 'genres',
    name: { en: 'Ballad arpeggio', ru: 'Арпеджио баллады' },
    rh: 'bal',
    lh: 'bal',
  },
  rock: { group: 'genres', name: { en: 'Rock', ru: 'Рок' }, rh: 'rock', lh: 'rock' },
  blues: {
    group: 'genres',
    name: { en: 'Blues shuffle', ru: 'Блюз-шаффл' },
    rh: 'blu',
    lh: 'shuf',
  },
  rnb: { group: 'genres', name: { en: 'R&B', ru: 'R&B' }, rh: 'rnb', lh: 'rnb' },
  jazz: {
    group: 'genres',
    name: { en: 'Jazz Charleston', ru: 'Джазовый чарльстон' },
    rh: 'jaz',
    lh: 'bal',
  },
  hiphop: { group: 'genres', name: { en: 'Hip-hop', ru: 'Хип-хоп' }, rh: 'hip', lh: 'r' },
  salsa: {
    group: 'genres',
    name: { en: 'Salsa montuno', ru: 'Монтуно сальсы' },
    rh: 'sal',
    lh: 'sal',
  },
  funk: { group: 'genres', name: { en: 'Funk', ru: 'Фанк' }, rh: 'fun', lh: 'fun' },
  gospel: { group: 'genres', name: { en: 'Gospel', ru: 'Госпел' }, rh: 'sync', lh: 'gos' },
  country: { group: 'genres', name: { en: 'Country', ru: 'Кантри' }, rh: 'cty', lh: 'bal' },
}

function eventPattern(id: PatternId, rh: RightFigureId, lh: LeftFigureId): EventPattern {
  const right = RIGHT_FIGURES[rh].figure
  if (right.kind !== 'events') throw new Error(`Pattern ${id}: ${rh} plays the tune`)
  return { id, rh: right, lh: LEFT_FIGURES[lh].figure }
}

/** What a pattern that plays the tune plays, both hands, on a piece with no melody. */
const WITHOUT_MELODY = eventPattern('r4', WRITTEN.r4.rh, WRITTEN.r4.lh)

function patternOf(id: PatternId): Pattern {
  if (id === WITHOUT_MELODY.id) return WITHOUT_MELODY
  const { rh, lh } = WRITTEN[id]
  const right = RIGHT_FIGURES[rh].figure
  if (right.kind === 'events') return eventPattern(id, rh, lh)
  return { id, rh: right, lh: LEFT_FIGURES[lh].figure, withoutMelody: WITHOUT_MELODY }
}

export const PATTERNS = Object.fromEntries(
  PATTERN_IDS.map((id) => [id, { ...WRITTEN[id], pattern: patternOf(id) }]),
) as Readonly<Record<PatternId, PatternEntry>>
