import { CHORD_QUALITIES, type ChordQuality } from './chord'
import { SCALE_KINDS, type ScaleKind } from './scale'

/** Something the quiz rates: one chord quality or one scale kind. */
export type SkillId = `chord:${ChordQuality}` | `scale:${ScaleKind}`
export type Skill =
  | { readonly kind: 'chord'; readonly quality: ChordQuality }
  | { readonly kind: 'scale'; readonly scale: ScaleKind }

export const chordSkill = (quality: ChordQuality): SkillId => `chord:${quality}`
export const scaleSkill = (kind: ScaleKind): SkillId => `scale:${kind}`

const SKILL_BY_ID = new Map<string, Skill>([
  ...CHORD_QUALITIES.map((quality) => [chordSkill(quality), { kind: 'chord', quality }] as const),
  ...SCALE_KINDS.map((scale) => [scaleSkill(scale), { kind: 'scale', scale }] as const),
])

/** All 40: the 33 chord qualities, then the 7 scale kinds. */
export const SKILLS = [...SKILL_BY_ID.keys()] as readonly SkillId[]

export const isSkillId = (value: unknown): value is SkillId =>
  typeof value === 'string' && SKILL_BY_ID.has(value)

export function skillOf(id: SkillId): Skill {
  const skill = SKILL_BY_ID.get(id)
  if (!skill) throw new RangeError(`Unknown skill "${id}"`)
  return skill
}
