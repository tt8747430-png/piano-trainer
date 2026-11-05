# R32: the Player's Settings in professional wording, each option with its one-line description.
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[2]

EN = """  settingsPage: {
    follow: {
      label: 'Follow the music',
      detail: 'Keeps the passage being played in view.',
      info: 'Grid and Chords over lyrics keep the line being played in view. Scrolling by hand pauses following until you return to the playhead.',
      return: 'Return to the playhead',
      returnInfo: 'How long after a manual scroll the view resumes following the music.',
      off: 'Never',
      seconds: 'After {{count}} s',
    },
    annotations: 'Annotations',
    annotationsDetail: 'Shows the text and circles you have added to the score.',
    open: 'Player settings',
    whilePlaying: 'While you play',
    songGroup: 'This song',
    shareGroup: 'Share',
    audio: 'Levels',
    audioInfo:
      'The level of each staff, the recording and the metronome, for every song. Chords only mutes the recording and raises the piano, so the harmony is heard on its own.',
    metronome: 'Metronome sound and beats',
    onScreenPiano: 'On-screen piano',
    speed: 'Playback speed',
    speedStepInfo: 'The tempo increase after each clean pass while speed training works up to the song’s tempo.',
    speedStepDetail: 'Tempo increase after each clean pass.',
    accompaniment: 'Accompaniment',
    playback: 'Playback',
    display: 'Score view',
    about: {
      display: 'Layout, cursor and what appears on the score',
      playback: 'Count-in, pedalling, metronome and practice tempo',
      staves: 'Which staves sound and appear, and their levels',
      accompaniment: 'Pattern, chord voicing and swing',
      piano: 'Key size, note names and pedals',
    },
    countdown: {
      label: 'Count-in',
      detail: 'A bar counted before the music begins.',
      info: 'Audible: one bar of clicks, its beats counted on screen. Silent: counted on screen only. Off: the music begins at once.',
      none: 'Off',
      audible: 'Audible',
      visual: 'Silent',
    },
    cursor: {
      label: 'Cursor',
      detail: 'How the playhead moves with the music.',
      info: 'Continuous: it glides with the beat. By note: it steps to each note as it sounds. Off: no playhead.',
      none: 'Off',
      beats: 'By note',
      continuous: 'Continuous',
    },
    keys: 'Show the keyboard',
    practice: 'One hand',
    practiceInfo: 'When you practise one hand (Hands: Left or Right).',
    otherHand: {
      label: 'Other hand in practice',
      detail: 'How the hand you are not practising appears.',
      info: 'Show: its staff as written. Dim: its notes greyed. Hide: only your hand’s staff remains.',
      show: 'Show',
      dim: 'Dim',
      hide: 'Hide',
    },
    playOther: 'Hear the other hand',
    playOtherInfo: 'In Wait mode the app plays the hand you are not practising as you play yours.',
    pedal: {
      label: 'Pedalling',
      detail: 'How the sustain pedal is played back.',
      info: 'As marked: the sustain pedal as the score marks it. Automatic: pedalled with each chord and changed with the harmony, for music written without pedal marks. Off: no pedal.',
      written: 'As marked',
      off: 'Off',
      automatic: 'Automatic',
    },
  },
"""

RU = """  settingsPage: {
    follow: {
      label: 'Следить за музыкой',
      detail: 'Держит исполняемый фрагмент на виду.',
      info: 'Сетка и аккорды над текстом держат исполняемую строку на виду. Ручная прокрутка приостанавливает слежение, пока вы не вернётесь к курсору.',
      return: 'Возврат к курсору',
      returnInfo: 'Через сколько после ручной прокрутки вид снова следует за музыкой.',
      off: 'Никогда',
      seconds: 'Через {{count}} с',
    },
    annotations: 'Пометки',
    annotationsDetail: 'Показывает добавленные вами надписи и обводки в нотах.',
    open: 'Настройки плеера',
    whilePlaying: 'Во время игры',
    songGroup: 'Эта песня',
    shareGroup: 'Поделиться',
    audio: 'Громкость',
    audioInfo:
      'Громкость каждого нотоносца, записи и метронома для всех песен. «Только аккорды» заглушает запись и делает фортепиано громче, чтобы гармония звучала отдельно.',
    metronome: 'Звук и доли метронома',
    onScreenPiano: 'Экранное фортепиано',
    speed: 'Скорость воспроизведения',
    speedStepInfo: 'Прибавка темпа после каждого чистого прохода, пока тренировка темпа доходит до темпа песни.',
    speedStepDetail: 'Прибавка темпа после каждого чистого прохода.',
    accompaniment: 'Аккомпанемент',
    playback: 'Воспроизведение',
    display: 'Вид нот',
    about: {
      display: 'Раскладка, курсор и обозначения в нотах',
      playback: 'Отсчёт, педаль, метроном и темп занятий',
      staves: 'Какие нотоносцы звучат и видны, их громкость',
      accompaniment: 'Фактура, расположение аккордов и свинг',
      piano: 'Размер клавиш, названия нот и педали',
    },
    countdown: {
      label: 'Отсчёт',
      detail: 'Такт отсчёта перед началом музыки.',
      info: 'Со звуком: такт щелчков, доли отсчитываются на экране. Без звука: отсчёт только на экране. Выкл.: музыка начинается сразу.',
      none: 'Выкл.',
      audible: 'Со звуком',
      visual: 'Без звука',
    },
    cursor: {
      label: 'Курсор',
      detail: 'Как курсор движется вместе с музыкой.',
      info: 'Плавно: движется вместе с долей. По нотам: перескакивает к каждой звучащей ноте. Выкл.: курсора нет.',
      none: 'Выкл.',
      beats: 'По нотам',
      continuous: 'Плавно',
    },
    keys: 'Показывать клавиатуру',
    practice: 'Одна рука',
    practiceInfo: 'Когда вы учите одну руку (Руки: левая или правая).',
    otherHand: {
      label: 'Другая рука при разучивании',
      detail: 'Как выглядит рука, которую вы сейчас не учите.',
      info: 'Показать: её нотоносец как написан. Приглушить: её ноты серые. Скрыть: остаётся только нотоносец вашей руки.',
      show: 'Показать',
      dim: 'Приглушить',
      hide: 'Скрыть',
    },
    playOther: 'Слышать другую руку',
    playOtherInfo:
      'В режиме ожидания приложение играет руку, которую вы не учите, пока вы играете свою.',
    pedal: {
      label: 'Педализация',
      detail: 'Как воспроизводится правая педаль.',
      info: 'Как в нотах: правая педаль по знакам партитуры. Автоматически: берётся с каждым аккордом и меняется со сменой гармонии — для музыки без педальных знаков. Выкл.: без педали.',
      written: 'Как в нотах',
      off: 'Выкл.',
      automatic: 'Автоматически',
    },
  },
"""

for lang, block in (('en', EN), ('ru', RU)):
    path = ROOT / f'src/shared/i18n/locales/{lang}/player.ts'
    text = path.read_text()
    start = text.index('  settingsPage: {\n')
    end = text.index('\n  },\n', start) + len('\n  },\n')
    # The block holds nested objects, each closed by '    },': its own close is the first '  },' at two spaces.
    end = re.search(r'\n  \},\n', text[start:]).end() + start
    path.write_text(text[:start] + block + text[end:])
