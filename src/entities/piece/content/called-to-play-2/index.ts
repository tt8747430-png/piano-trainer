import type { Collection } from '../../model/types'
import angely from './angely'
import brat from './brat'
import buri from './buri'
import derznovenie from './derznovenie'
import dveri from './dveri'
import idti from './idti'
import kryl from './kryl'
import ktoya from './ktoya'
import legenda from './legenda'
import letom from './letom'
import milost from './milost'
import molitva from './molitva'
import nebesa from './nebesa'
import nuzhdayus from './nuzhdayus'
import otchizna from './otchizna'
import posmotri from './posmotri'
import posylaet from './posylaet'
import potoki from './potoki'
import prosti from './prosti'
import prostil from './prostil'
import skala from './skala'
import vboge from './vboge'
import vselennaya from './vselennaya'
import vyshina from './vyshina'
import zemlya from './zemlya'

/**
 * The songs of «Призван играть для Него», level 2, in the order its lessons teach on them: the
 * workbook’s plans, each chord a bar with the way it names (spec 2026-10-14).
 */
const calledToPlayTwo: Collection = {
  id: 'called-to-play-2',
  name: { en: 'Called to Play, level 2', ru: 'Призван играть, уровень 2' },
  entries: [
    molitva,
    zemlya,
    otchizna,
    dveri,
    angely,
    idti,
    posmotri,
    brat,
    prosti,
    vyshina,
    legenda,
    ktoya,
    vboge,
    buri,
    kryl,
    potoki,
    posylaet,
    derznovenie,
    skala,
    milost,
    nuzhdayus,
    vselennaya,
    letom,
    prostil,
    nebesa,
  ],
}

export default calledToPlayTwo
