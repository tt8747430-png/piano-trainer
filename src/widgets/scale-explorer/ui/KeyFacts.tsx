import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useScaleName } from '@/shared/i18n'
import { IN_PLACE } from '@/shared/lib'
import {
  enharmonicKey,
  keyParam,
  keySymbol,
  modesOfKey,
  neighbourKeys,
  parallelKey,
  noteParam,
  relativeKey,
  signatureNotes,
  type Key,
  printedNote,
  printedSymbol,
} from '@/shared/lib/music'
import { ButtonLink, Fact } from '@/shared/ui'
import { KeyLink } from './KeyLink'

/**
 * A key's signature and notes; its relative and parallel keys, its other spelling where the circle's
 * ends meet (each shown as a key too); its place on the circle, between its neighbours, opening the
 * Circle of fifths on it; and the modes that share
 * its notes (each as a scale). Every link changes the scale in place, keeping the view's other choices: a mode
 * has no Key view, so its page opens on its run.
 */
export function KeyFacts({ value }: { value: Key }) {
  const { t } = useTranslation('practice')
  const scaleName = useScaleName()
  const signature = signatureNotes(value)
  const relative = relativeKey(value)
  const enharmonic = enharmonicKey(value)
  const [before, after] = neighbourKeys(value)
  return (
    <dl className="flex flex-col gap-2">
      <Fact term={t('scales.key.signature')}>
        {signature.length === 0
          ? t('scales.key.noSignature')
          : t(signature[0]?.accidental === 1 ? 'scales.key.sharps' : 'scales.key.flats', {
              count: signature.length,
              notes: signature.map(printedNote).join(' '),
            })}
      </Fact>
      <Fact term={t('scales.facts.relative')}>
        <KeyLink value={relative} />
      </Fact>
      <Fact term={t('scales.key.parallel')}>
        <KeyLink value={parallelKey(value)} />
      </Fact>
      {enharmonic ? (
        <Fact term={t('scales.key.enharmonic')}>
          <KeyLink value={enharmonic} />
        </Fact>
      ) : null}
      <Fact term={t('scales.key.onCircle')}>
        <ButtonLink
          variant="link"
          className="px-0"
          render={<Link to="/practice/circle-of-fifths" search={{ key: keyParam(value) }} />}
        >
          {t('scales.key.between', {
            before: printedSymbol(keySymbol(before)),
            after: printedSymbol(keySymbol(after)),
          })}
        </ButtonLink>
      </Fact>
      <Fact term={t('scales.key.modes')}>
        <span className="flex flex-wrap gap-x-4">
          {modesOfKey(value).map(({ root, kind }) => (
            <ButtonLink
              key={kind}
              variant="link"
              className="px-0"
              render={
                <Link
                  from="/practice/scales"
                  to="/practice/scales"
                  search={(prev) => ({ ...prev, root: noteParam(root), kind })}
                  {...IN_PLACE}
                />
              }
            >
              {scaleName(root, kind)}
            </ButtonLink>
          ))}
        </span>
      </Fact>
    </dl>
  )
}
