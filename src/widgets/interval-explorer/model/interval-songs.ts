import type { Locale } from '@/shared/i18n'
import type { RowInterval } from './interval-rows'

/** Songs by title, in each language its own list: a Russian learner knows other songs. */
export type SongTitles = Readonly<Record<Locale, readonly string[]>>

/** The songs that open with an interval, rising and falling; the unison has one list. */
export interface IntervalSongs {
  readonly up: SongTitles
  readonly down?: SongTitles
}

/** The intervals a song is known by: those within the octave, the tritone once. */
type SongInterval = Exclude<RowInterval, 'A4' | 'd5' | `${string}${9 | 11 | 13}`> | 'tritone'

const titles = (en: readonly string[], ru: readonly string[]): SongTitles => ({ en, ru })

/**
 * A song for each interval, up and down, as ear training names them: the first notes of a tune
 * the learner already knows (each checked against its melody), so the interval is heard before it
 * is played. A Russian learner's list keeps the songs known in both languages, under their Russian
 * titles, and adds the songs every Russian learner knows.
 */
const SONGS: Readonly<Record<SongInterval, IntervalSongs>> = {
  r: {
    up: titles(['Jingle Bells', 'Happy Birthday'], ['Jingle Bells', 'С днём рождения тебя']),
  },
  m2: {
    up: titles(['Jaws (theme)', 'White Christmas'], ['Челюсти (тема)', 'White Christmas']),
    down: titles(['Für Elise', 'Joy to the World'], ['К Элизе', 'Joy to the World']),
  },
  M2: {
    up: titles(['Frère Jacques', 'Silent Night'], ['Братец Яков', 'Тихая ночь']),
    down: titles(['Mary Had a Little Lamb', 'Yesterday'], ['Yesterday', 'У Мэри был барашек']),
  },
  m3: {
    up: titles(
      ['Greensleeves', 'Smoke on the Water'],
      ['Подмосковные вечера', 'Greensleeves', 'Smoke on the Water'],
    ),
    down: titles(['Hey Jude', 'The Star-Spangled Banner'], ['Hey Jude', 'Гимн США']),
  },
  M3: {
    up: titles(
      ['When the Saints Go Marching In', 'Morning Has Broken'],
      ['When the Saints Go Marching In', 'Morning Has Broken'],
    ),
    down: titles(
      ['Beethoven’s Fifth Symphony', 'Swing Low, Sweet Chariot'],
      ['Пятая симфония Бетховена', 'Swing Low, Sweet Chariot'],
    ),
  },
  P4: {
    up: titles(
      ['Here Comes the Bride', 'Amazing Grace', 'Auld Lang Syne'],
      ['Гимн России', 'Свадебный хор (Вагнер)', 'Amazing Grace'],
    ),
    down: titles(
      ['Eine kleine Nachtmusik', 'Shave and a Haircut'],
      ['Маленькая ночная серенада (Моцарт)'],
    ),
  },
  tritone: {
    up: titles(
      ['The Simpsons (theme)', 'Maria (West Side Story)'],
      ['Симпсоны (тема)', 'Мария (Вестсайдская история)'],
    ),
    down: titles(['Black Sabbath (Black Sabbath)'], ['Black Sabbath (Black Sabbath)']),
  },
  P5: {
    up: titles(
      ['Twinkle, Twinkle, Little Star', 'Star Wars (main theme)'],
      ['Звёздные войны (главная тема)', 'Twinkle, Twinkle, Little Star'],
    ),
    down: titles(
      ['The Flintstones (theme)', 'Minuet in G (Petzold)'],
      ['Менуэт соль мажор (Петцольд)', 'Флинтстоуны (тема)'],
    ),
  },
  m6: {
    up: titles(['The Entertainer (chorus)'], ['The Entertainer (припев)']),
    down: titles(['Love Story (theme)'], ['История любви (тема)']),
  },
  M6: {
    up: titles(
      ['My Bonnie Lies over the Ocean', 'Jingle Bells (verse)'],
      ['В лесу родилась ёлочка', 'My Bonnie Lies over the Ocean'],
    ),
    down: titles(
      ['Nobody Knows the Trouble I’ve Seen', 'The Music of the Night'],
      ['Музыка ночи (Призрак оперы)', 'Nobody Knows the Trouble I’ve Seen'],
    ),
  },
  m7: {
    up: titles(
      ['Somewhere (West Side Story)', 'Star Trek (theme)'],
      ['Somewhere (Вестсайдская история)', 'Звёздный путь (тема)'],
    ),
    down: titles(
      ['Watermelon Man', 'An American in Paris'],
      ['Американец в Париже', 'Watermelon Man'],
    ),
  },
  M7: {
    up: titles(['Take On Me (chorus)', 'Bali Ha’i'], ['Take On Me (припев)']),
    down: titles(['I Love You (Cole Porter)'], ['I Love You (Коул Портер)']),
  },
  P8: {
    up: titles(
      ['Over the Rainbow', 'Singin’ in the Rain'],
      ['Over the Rainbow (Волшебник страны Оз)', 'Поющие под дождём'],
    ),
    down: titles(['Willow Weep for Me'], ['Willow Weep for Me']),
  },
}

/** The songs that open with a row's interval; none for an interval past the octave. */
export function intervalSongs(name: RowInterval): IntervalSongs | undefined {
  if (name === 'A4' || name === 'd5') return SONGS.tritone
  return name in SONGS ? SONGS[name as SongInterval] : undefined
}
