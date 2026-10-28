import { C_MAJOR, note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const G_MAJOR = { tonic: note('G'), minor: false }

/**
 * Modulation: moving to a new key and staying there, by a pivot chord both keys share, directly at a
 * phrase's start, or by step (the "truck driver's" lift); how a new key shows itself; the keys
 * closest to a home key.
 */
const modulation: Lesson = {
  id: 'modulation',
  after: ['progressions-in-order', 'passing-chords'],
  title: { en: 'Modulation', ru: 'Модуляция' },
  summary: {
    en: 'Move a song into a new key: through a chord both keys share, straight at a new phrase, or up a step.',
    ru: 'Переводить песню в новую тональность: через общий аккорд, сразу с новой фразы или на ступень вверх.',
  },
  sections: [
    {
      heading: { en: 'A new home', ru: 'Новый дом' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A modulation', ru: 'Модуляция' },
          text: {
            en: 'moves the music to a new tonic and stays there. The new key is confirmed by its own V to I.',
            ru: 'переводит музыку к новой тонике, и она там остаётся. Новую тональность закрепляет её собственная V – I.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Am', 'D7', 'G'] },
      ],
      takeaway: {
        en: 'A new key needs its own cadence. One borrowed V is only a visit.',
        ru: 'Новой тональности нужна своя каденция. Одна чужая V — только гость.',
      },
    },
    {
      heading: { en: 'The pivot chord', ru: 'Общий аккорд' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A pivot chord', ru: 'Общий аккорд' },
          text: {
            en: 'belongs to both keys. Am is vi in C and ii in G, so it can lead either way.',
            ru: 'принадлежит обеим тональностям. Am — это vi в до мажоре и ii в соль мажоре, поэтому он ведёт в обе стороны.',
          },
        },
        {
          kind: 'variants',
          variants: [
            {
              label: { en: 'In C', ru: 'В до мажоре' },
              caption: { en: 'Am is vi', ru: 'Am — это vi' },
              example: { kind: 'progression', numerals: 'I IV vi', key: C_MAJOR },
            },
            {
              label: { en: 'In G', ru: 'В соль мажоре' },
              caption: { en: 'the same Am is ii', ru: 'тот же Am — это ii' },
              example: { kind: 'progression', numerals: 'ii V7 I', key: G_MAJOR },
            },
          ],
        },
      ],
      takeaway: {
        en: 'A chord both keys share hides the door between them.',
        ru: 'Общий для двух тональностей аккорд прячет дверь между ними.',
      },
    },
    {
      heading: {
        en: 'Direct: a new phrase, a new key',
        ru: 'Прямая: новая фраза, новая тональность',
      },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A direct modulation', ru: 'Прямая модуляция' },
          text: {
            en: 'needs no shared chord. A phrase ends in one key, and the next begins in another.',
            ru: 'обходится без общего аккорда. Фраза кончается в одной тональности, а следующая начинается в другой.',
          },
        },
        { kind: 'chords', symbols: ['C', 'F', 'G', 'C', 'E♭', 'A♭', 'B♭', 'E♭'] },
      ],
      takeaway: {
        en: 'A direct modulation simply starts the next phrase in the new key.',
        ru: 'Прямая модуляция просто начинает следующую фразу в новой тональности.',
      },
    },
    {
      heading: { en: 'By step: the lift', ru: 'На ступень: подъём' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Pop songs often lift the last chorus a half or a whole step. A V of the new key smooths the join.',
            ru: 'Поп-песни часто поднимают последний припев на полутон или на тон. Доминанта новой тональности сглаживает стык.',
          },
        },
        {
          kind: 'variants',
          variants: [
            {
              label: { en: 'Up a half step', ru: 'На полутон' },
              caption: { en: 'C to D♭, through A♭7', ru: 'из C в D♭ через A♭7' },
              example: { kind: 'chords', symbols: ['C', 'G', 'Am', 'F', 'A♭7', 'D♭'] },
            },
            {
              label: { en: 'Up a whole step', ru: 'На тон' },
              caption: { en: 'C to D, through A7', ru: 'из C в D через A7' },
              example: { kind: 'chords', symbols: ['C', 'G', 'Am', 'F', 'A7', 'D'] },
            },
          ],
        },
      ],
      takeaway: {
        en: 'A lift by step raises the energy of a last chorus.',
        ru: 'Подъём на ступень добавляет энергии последнему припеву.',
      },
    },
    {
      heading: { en: 'Hearing the new key', ru: 'Как услышать новую тональность' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Look for new accidentals: F♯ in C points to G.',
              ru: 'Ищите новые знаки: фа-диез в до мажоре указывает на соль.',
            },
            { en: 'Find a new V to I.', ru: 'Найдите новую V – I.' },
            { en: 'Compare the ending with the start.', ru: 'Сравните конец с началом.' },
          ],
        },
        {
          kind: 'scale',
          root: note('G'),
          scale: 'major',
        },
      ],
      takeaway: {
        en: 'The keys closest to C are G, F, Am, Dm and Em: one accidental apart at most.',
        ru: 'Ближайшие к до мажору — G, F, Am, Dm и Em: не больше одного знака разницы.',
      },
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the pivot chord that is vi in C and ii in G.',
            ru: 'Сыграйте общий аккорд: vi в до мажоре и ii в соль мажоре.',
          },
          answer: { chord: 'Am' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the V of D♭ major, the chord that lifts a song from C to D♭.',
            ru: 'Сыграйте V ре-бемоль мажора — аккорд, поднимающий песню из C в D♭.',
          },
          answer: { chord: 'A♭' },
        },
        {
          kind: 'link',
          title: { en: 'C, Am, D7, G on Progressions', ru: 'C, Am, D7, G в «Последовательностях»' },
          target: { opens: 'song-chords', chords: 'C Am D7 G' },
        },
      ],
    },
  ],
}

export default modulation
