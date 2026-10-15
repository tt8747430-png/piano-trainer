export {
  STAGES,
  isStage,
  isStepId,
  lessonStepId,
  pieceStepId,
  stageRank,
  stepIdOf,
  type Course,
  type PracticeStep,
  type Stage,
  type Step,
  type StepId,
} from './model/types'
export {
  courseById,
  courseNumber,
  coursesIn,
  curriculumSteps,
  firstOpenStep,
  lessonPlace,
  nextCourse,
  nextLessonId,
  stageOf,
  stepById,
  stepsOf,
  type LessonPlace,
  type PlacedStep,
} from './model/selectors'
export { skillsOfStep, stepOfSkill } from './model/skills'
export { COURSES } from './content/courses'

export { useStepTitle, type StepKind } from './ui/use-step-title'
export { StepLink } from './ui/StepLink'
export { STEP_PAINT } from './ui/step-paint'
export { courseIcon, STAGE_PAINT } from './ui/course-look'
export { StageMark } from './ui/StageMark'
export { CourseIcon } from './ui/CourseIcon'
