import type { LibraryProgression, ProgressionStyle } from '../model/types'

/** A progression of the library: a major key's unless its style is the minor keys'. */
const entry = (
  style: ProgressionStyle,
  id: string,
  numerals: string,
  en: string,
  ru: string,
): LibraryProgression => ({ id, style, numerals, name: { en, ru }, minor: style === 'minor' })

/**
 * The Ultimate Piano's progressions by style (roadmap §10.1), written for the app. The blues write
 * their 7ths (a blues I is a dominant 7th); the gospel walk-up climbs to I from the flat side.
 */
export const PROGRESSION_LIBRARY: readonly LibraryProgression[] = [
  entry('pop', 'axis', 'I V vi IV', 'Axis of Awesome', 'Axis of Awesome'),
  entry('pop', 'sensitive', 'vi IV I V', 'Sensitive', 'Чувствительная'),
  entry('pop', 'doo-wop', 'I vi IV V', '50s doo-wop', 'Ду-воп 50-х'),
  entry('pop', 'alternative-pop', 'I IV vi V', 'Alternative pop', 'Альтернативный поп'),
  entry('pop', 'royal-road', 'IV V iii vi', 'Royal Road', 'Royal Road'),
  entry('pop', 'pachelbel', 'I V vi iii IV I IV V', 'Pachelbel’s Canon', 'Канон Пахельбеля'),
  entry('rock', 'basic-rock', 'I IV V', 'Basic rock', 'Простой рок'),
  entry('rock', 'rock-shuffle', 'I V IV', 'Rock shuffle', 'Рок-шаффл'),
  entry('rock', 'louie-louie', 'I IV V IV', 'Louie Louie', 'Louie Louie'),
  entry('rock', 'pop-rock', 'I V vi IV', 'Pop rock', 'Поп-рок'),
  entry('rock', 'rock-anthem', 'I IV V V', 'Rock anthem', 'Рок-гимн'),
  entry('jazz', 'jazz-cadence', 'ii7 V7 IMaj7', 'Jazz cadence', 'Джазовая каденция'),
  entry('jazz', 'rhythm-changes', 'I vi ii V', 'Rhythm changes', 'Rhythm changes'),
  entry('jazz', 'full-turnaround', 'iii vi ii V', 'Full turnaround', 'Полный оборот'),
  entry('jazz', 'jazz-standard', 'ii V I IV', 'Jazz standard', 'Джазовый стандарт'),
  entry('jazz', 'sweet-jazz', 'I IV ii V', 'Sweet jazz', 'Мягкий джаз'),
  entry('jazz', 'autumn-leaves', 'ii V I vi', 'Autumn Leaves', 'Autumn Leaves'),
  entry('blues', 'blues-turnaround', 'I7 IV7 I7 V7', 'Blues turnaround', 'Блюзовый оборот'),
  entry('blues', 'basic-blues', 'I7 IV7 V7', 'Basic blues', 'Простой блюз'),
  entry(
    'blues',
    'twelve-bar',
    'I7 I7 I7 I7 IV7 IV7 I7 I7 V7 IV7 I7 V7',
    '12-bar blues',
    'Блюз, 12 тактов',
  ),
  entry('classical', 'authentic', 'I IV V I', 'Authentic cadence', 'Полная каденция'),
  entry('classical', 'perfect', 'I V I', 'Perfect cadence', 'Совершенная каденция'),
  entry('classical', 'classical-standard', 'I ii V I', 'Classical standard', 'Классический оборот'),
  entry('classical', 'deceptive', 'I IV V vi', 'Deceptive cadence', 'Прерванная каденция'),
  entry('classical', 'plagal', 'I IV I', 'Plagal cadence', 'Плагальная каденция'),
  entry('soul', 'neo-soul', 'vi V IV V', 'Neo-soul', 'Нео-соул'),
  entry('soul', 'modern-rnb', 'I IV vi V', 'Modern R&B', 'Современный R&B'),
  entry('soul', 'soul-turnaround', 'I vi ii V', 'Soul turnaround', 'Соул-оборот'),
  entry('soul', 'emotional-rnb', 'vi IV V I', 'Emotional R&B', 'Лирический R&B'),
  entry('latin', 'bossa-nova', 'I vi ii V', 'Bossa nova', 'Босса-нова'),
  entry('latin', 'latin-groove', 'I IV V IV', 'Latin groove', 'Латинский грув'),
  entry('latin', 'samba-cadence', 'ii V I I', 'Samba cadence', 'Самба-каденция'),
  entry('gospel', 'gospel-lift', 'IV V iii vi', 'Gospel lift', 'Госпел-подъём'),
  entry('gospel', 'gospel-standard', 'I iii IV V', 'Gospel standard', 'Госпел-стандарт'),
  entry('gospel', 'gospel-hymn', 'I IV I V', 'Gospel hymn', 'Госпел-гимн'),
  entry('gospel', 'gospel-climb', 'VII III VI', 'Gospel climb', 'Госпел-восхождение'),
  entry('gospel', 'gospel-resolution', 'V IV I', 'Gospel resolution', 'Госпел-разрешение'),
  entry('gospel', 'gospel-walk-up', '♭VI ♭VII I', 'Gospel walk-up', 'Госпел-подход'),
  entry('minor', 'minor-cadence', 'i iv V i', 'Minor cadence', 'Минорная каденция'),
  entry('minor', 'minor-pop', 'i VI III VII', 'Minor pop', 'Минорный поп'),
  entry('minor', 'minor-two-five', 'ii° V i', 'Minor ii–V–i', 'Минорная II–V–I'),
  entry(
    'theory',
    'key-chords',
    'I ii iii IV V vi vii°',
    'The chords of the key',
    'Аккорды тональности',
  ),
]
