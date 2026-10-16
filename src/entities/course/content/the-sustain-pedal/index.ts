import type { Course } from '../../model/types'
import pedalIntro from './pedal-intro'
import handsAndFeet from './hands-and-feet'
import pedalChange from './pedal-change'
import whenToChange from './when-to-change'

const course: Course = {
  id: 'the-sustain-pedal',
  shelf: 'intermediate',
  stage: 'intermediate',
  title: { en: 'The Sustain Pedal', ru: 'Правая педаль' },
  summary: {
    en: 'What the right pedal does and how the foot works it, then the legato pedal change and when to change it, so chords join without a blur.',
    ru: 'Что делает правая педаль и как с ней работает нога, затем запаздывающая смена педали и когда её менять, чтобы аккорды связывались без грязи.',
  },
  weeks: 4,
  lessons: [pedalIntro, handsAndFeet, pedalChange, whenToChange],
  songs: ['brahms-lullaby', 'aura-lee', 'shenandoah'],
}

export default course
