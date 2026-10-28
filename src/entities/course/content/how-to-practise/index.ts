import type { Course } from '../../model/types'
import dailyPlan from './daily-plan'
import mistakesToAvoid from './mistakes-to-avoid'
import scaleRoutine from './scale-routine'
import speedPlan from './speed-plan'

const course: Course = {
  id: 'how-to-practise',
  shelf: 'technique',
  stage: 'beginner',
  title: { en: 'How to Practise', ru: 'Как заниматься' },
  summary: {
    en: 'A plan for each day, a fifteen-minute scale routine with a tempo ladder, five days to faster fingers, and the mistakes that slow learners down.',
    ru: 'План на каждый день, пятнадцатиминутная работа над гаммой с лестницей темпов, пять дней к беглым пальцам и ошибки, которые тормозят учеников.',
  },
  weeks: 2,
  lessons: [dailyPlan, scaleRoutine, speedPlan, mistakesToAvoid],
  songs: [],
}

export default course
