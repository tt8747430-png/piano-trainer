import type { LocalText } from '@/shared/i18n'
import type { ProgressionId } from './library'

const line = (en: string, ru: string): LocalText => ({ en, ru })

/**
 * How each progression sounds, in one line (the reference app's tagline under a progression's name):
 * what it feels like to hear, which its numerals alone do not say.
 */
export const CHARACTERS: Readonly<Record<ProgressionId, LocalText>> = {
  axis: line(
    'Bright and singable, the sound of a thousand hits',
    'Светлый и певучий звук тысячи хитов',
  ),
  'let-it-be': line(
    'Calm and hymn-like, it settles home twice',
    'Спокойная, как гимн, дважды приходит домой',
  ),
  yesterday: line(
    'Wistful, with chords that lean somewhere else',
    'Грустная, аккорды тянутся куда-то в сторону',
  ),
  clocks: line(
    'Restless and dark, it never quite lands',
    'Тревожная и тёмная, так и не приземляется',
  ),
  'doo-wop': line(
    'Sweet and nostalgic, the 1950s slow dance',
    'Сладкая и ностальгическая, медленный танец 50-х',
  ),
  'alternative-pop': line(
    'Open and hopeful, it lifts at the end',
    'Открытая и светлая, поднимается в конце',
  ),
  'royal-road': line(
    'Yearning, always about to resolve',
    'Тоскующая, всё время на пороге разрешения',
  ),
  pachelbel: line(
    'Stately and stepwise, the wedding classic',
    'Величавая, шаг за шагом, свадебная классика',
  ),
  'rock-shuffle': line('Plain and strong, a rock ending', 'Простая и крепкая, роковая концовка'),
  'wild-thing': line(
    'Raw and stomping, three chords and a swagger',
    'Грубоватая и напористая: три аккорда и кураж',
  ),
  'borrowed-flat-seven': line(
    'Big and anthemic, a borrowed lift',
    'Большая, как гимн, с заимствованным подъёмом',
  ),
  'jazz-cadence': line(
    'Smooth and certain, jazz’s way home',
    'Мягкая и уверенная, путь домой в джазе',
  ),
  'two-five-chain': line(
    'Winding, each chord a step towards home',
    'Извилистая, каждый аккорд шаг к дому',
  ),
  'fly-me-to-the-moon': line('Swinging round the circle of fifths', 'Качается по квинтовому кругу'),
  'rhythm-changes': line('Quick and bouncy, the bebop loop', 'Быстрая и упругая, круг бибопа'),
  'full-turnaround': line(
    'Rolling, it brings the tune back round',
    'Катится и возвращает мелодию к началу',
  ),
  'sweet-jazz': line('Warm and easy, a lounge loop', 'Тёплая и лёгкая, круг для лаунжа'),
  'tritone-substitution': line(
    'Slippery, the bass slides down by semitones',
    'Скользкая, бас сползает по полутонам',
  ),
  'flat-nine-resolution': line(
    'Tense, then a sigh of relief',
    'Напряжение, а потом вздох облегчения',
  ),
  'blues-turnaround': line(
    'Gritty, it sends the blues round again',
    'Шершавый, отправляет блюз на новый круг',
  ),
  'twelve-bar': line('The blues itself, twelve bars long', 'Сам блюз, двенадцать тактов'),
  'complete-cadence': line(
    'Firm and final, the textbook ending',
    'Твёрдая и окончательная, как по учебнику',
  ),
  authentic: line(
    'The strongest close: away and home',
    'Самое сильное окончание: уйти и вернуться',
  ),
  deceptive: line('A surprise: home is promised, not given', 'Сюрприз: дом обещан, но не дан'),
  plagal: line('Soft and warm, the Amen ending', 'Мягкая и тёплая, концовка «Аминь»'),
  andalusian: line(
    'Dark and Spanish, stepping down to the dominant',
    'Тёмная, испанская, шагает вниз к доминанте',
  ),
  'neo-soul': line(
    'Laid-back and floating, never at rest',
    'Расслабленная и парящая, без остановки',
  ),
  'gospel-standard': line('Uplifting, it climbs towards V', 'Воодушевляющая, поднимается к V'),
  'gospel-hymn': line('Simple and sung, a church hymn', 'Простая и певучая, церковный гимн'),
  'seven-three-six': line(
    'Rich and churchy, falling home in fifths',
    'Богатая, церковная, падает домой по квинтам',
  ),
  'gospel-walk-up': line(
    'A climb that bursts into the tonic',
    'Подъём, который врывается в тонику',
  ),
  'key-chords': line('Every chord the key holds, in order', 'Все аккорды тональности по порядку'),
  'round-the-circle': line(
    'Falling fifths, each chord pulling to the next',
    'Нисходящие квинты, каждый аккорд тянет к следующему',
  ),
  'stack-your-chords': line(
    'A tour of the circle, then home through the borrowed',
    'По кругу, а домой через заимствованные',
  ),
  picardy: line(
    'Minor all the way, then a sudden bright ending',
    'Весь путь в миноре и внезапно светлый конец',
  ),
  amen: line('A soft, bittersweet amen', 'Мягкое, горьковато-сладкое «аминь»'),
  'phrygian-half': line(
    'Old and grave, it stops on a question',
    'Старинная и строгая, останавливается на вопросе',
  ),
  neapolitan: line('Dark and dramatic, a step off the path', 'Тёмная и драматичная, шаг в сторону'),
  lament: line('Grieving, the bass sinking step by step', 'Скорбная, бас опускается шаг за шагом'),
  'line-cliche': line('Brooding, one voice sliding down', 'Задумчивая, один голос сползает вниз'),
  backdoor: line(
    'Warm and sly, home by the side door',
    'Тёплая и хитрая, домой через боковую дверь',
  ),
  coltrane: line(
    'Dazzling, three keys in a few bars',
    'Ослепительная, три тональности за несколько тактов',
  ),
  ragtime: line(
    'Jaunty, each chord pulling to the next',
    'Задорная, каждый аккорд тянет к следующему',
  ),
  'diminished-turnaround': line(
    'Churchy and smooth, the bass climbing',
    'Церковный и плавный, бас поднимается',
  ),
  'quick-change': line(
    'Restless from the start, the classic blues',
    'Беспокойный с первых тактов, классический блюз',
  ),
  'minor-blues': line('Dark and smoky, the blues in minor', 'Тёмный и дымный, блюз в миноре'),
  'eight-bar': line(
    'Short and plain, the old folk blues',
    'Короткий и простой, старый народный блюз',
  ),
  'dorian-vamp': line(
    'Cool and funky, minor with a lift',
    'Прохладный и фанковый, минор с подъёмом',
  ),
  'mixolydian-vamp': line(
    'Bright but earthy, a rock anthem’s swagger',
    'Светлый, но приземлённый, размах рок-гимна',
  ),
  'lydian-vamp': line(
    'Dreamy and floating, film-score wonder',
    'Мечтательный и парящий, чудо из кино',
  ),
  'phrygian-vamp': line(
    'Tense and Spanish, a semitone away',
    'Напряжённый и испанский, на полутон в сторону',
  ),
}
