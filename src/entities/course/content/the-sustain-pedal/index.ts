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
    en: 'Learn what the right pedal does and how the foot works it. Then learn the legato pedal change and when to make it, so chords join without a blur.',
    ru: 'Что делает правая педаль и как работать с ней ногой. Затем запаздывающая педаль и то, когда её менять, чтобы аккорды связывались без грязи.',
  },
  weeks: 4,
  lessons: [pedalIntro, handsAndFeet, pedalChange, whenToChange],
  songs: ['brahms-lullaby', 'aura-lee', 'shenandoah'],
}

export default course
