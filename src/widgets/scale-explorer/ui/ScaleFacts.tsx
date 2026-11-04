import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { IN_PLACE } from '@/shared/lib'
import {
  alteredFromMajor,
  noteParam,
  relatedScale,
  scaleDegreeNames,
  scaleGaps,
  type ScaleKind,
  type SpelledNote,
  type Tone,
} from '@/shared/lib/music'
import { useScaleName } from '@/shared/i18n'
import { ButtonLink, Fact } from '@/shared/ui'
import { DegreeList } from './DegreeList'

const CHARACTERISTIC = {
  dorian: true,
  phrygian: true,
  lydian: true,
  mixolydian: true,
  locrian: true,
} as const
type Characteristic = keyof typeof CHARACTERISTIC

/**
 * What a scale is made of (its degrees, a seven-note scale's each named by its function), and the
 * scale it shares its notes with: its relative, or a mode's parent major.
 */
export function ScaleFacts({
  root,
  kind,
  tones,
}: {
  root: SpelledNote
  kind: ScaleKind
  tones: readonly Tone[]
}) {
  const { t } = useTranslation(['practice', 'music'])
  const scaleName = useScaleName()
  const related = relatedScale(root, kind)
  const names = scaleDegreeNames(kind)
  const altered = alteredFromMajor(kind)
  // A mode is told by the note that sets it apart (A43), its degrees not named.
  const characteristic = kind in CHARACTERISTIC ? (kind as Characteristic) : null
  return (
    <dl className="flex flex-col gap-2">
      <Fact term={t('practice:scales.facts.formula')}>
        <DegreeList
          alteredLabel={t('practice:scales.facts.altered')}
          items={tones.map((tone, at) => ({
            top: tone.degree,
            name: names?.[at],
            altered: altered.includes(at),
          }))}
        />
      </Fact>
      {characteristic ? (
        <Fact term={t('practice:scales.facts.sound')}>
          {t(`practice:scales.facts.characteristic.${characteristic}`)}
        </Fact>
      ) : null}
      <Fact term={t('practice:scales.facts.gaps')}>
        {scaleGaps(kind)
          .map((gap) => t(`music:gap.${gap}`))
          .join(' ')}
      </Fact>
      {/* The relative key is the Key tab's (A32): a mode's parent major alone stays here. */}
      {related && related.relation === 'parent' ? (
        <Fact term={t('practice:scales.facts.modeOf')}>
          <ButtonLink
            variant="link"
            className="px-0"
            render={
              <Link
                from="/practice/scales"
                to="/practice/scales"
                search={(prev) => ({ ...prev, root: noteParam(related.root), kind: related.kind })}
                {...IN_PLACE}
              />
            }
          >
            {scaleName(related.root, related.kind)}
          </ButtonLink>
        </Fact>
      ) : null}
    </dl>
  )
}
