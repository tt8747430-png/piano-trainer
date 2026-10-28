import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { IN_PLACE } from '@/shared/lib'
import {
  degreeNames,
  noteParam,
  relatedScale,
  scaleGaps,
  type ScaleKind,
  type SpelledNote,
  type Tone,
} from '@/shared/lib/music'
import { useScaleName } from '@/shared/i18n'
import { ButtonLink, Fact } from '@/shared/ui'
import { DegreeList } from './DegreeList'

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
  const names = degreeNames(kind)
  return (
    <dl className="flex flex-col gap-2">
      <Fact term={t('practice:scales.facts.formula')}>
        <DegreeList items={tones.map((tone, at) => ({ top: tone.degree, name: names?.[at] }))} />
      </Fact>
      <Fact term={t('practice:scales.facts.gaps')}>
        {scaleGaps(kind)
          .map((gap) => t(`music:gap.${gap}`))
          .join(' ')}
      </Fact>
      {related ? (
        <Fact
          term={t(
            related.relation === 'parent'
              ? 'practice:scales.facts.modeOf'
              : 'practice:scales.facts.relative',
          )}
        >
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
