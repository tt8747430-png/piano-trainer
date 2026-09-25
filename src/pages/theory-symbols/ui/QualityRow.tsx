import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { note, noteName, qualitySpellings, spellChord, type ChordQuality } from '@/shared/lib/music'
import { usePlayChord } from '@/shared/lib/services'
import { ButtonLink } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'

const C = note('C')

/** One quality in the dictionary: how it is written, what it is, and on C. */
export function QualityRow({ quality }: { quality: ChordQuality }) {
  const { t } = useTranslation('theory')
  const playChord = usePlayChord()
  const name = t(`quality.${quality}`)
  const tones = spellChord(C, quality)
  return (
    <li aria-label={name} className="flex flex-col gap-1 px-4 py-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xl font-bold">
          {qualitySpellings(quality)
            .map((s) => `C${s}`)
            .join(', ')}
        </span>
        <span className="text-right text-muted-foreground">{name}</span>
      </div>
      <p className="text-muted-foreground">
        <span className="font-semibold text-foreground">
          {tones.map((tone) => tone.degree).join(' ')}
        </span>
        {' · '}
        {tones.map((tone) => noteName(tone.note)).join(' ')}
      </p>
      <div className="flex gap-2">
        <Button variant="link" className="px-0" onClick={() => playChord({ root: C, quality })}>
          {t('symbols.hear')}
        </Button>
        <ButtonLink
          variant="link"
          className="px-3"
          render={<Link to="/theory/chords" search={{ quality }} />}
        >
          {t('symbols.open')}
        </ButtonLink>
      </div>
    </li>
  )
}
