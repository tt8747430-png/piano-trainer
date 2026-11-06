// The hands' pose table (R36, ADR 0124): each finger's three angles hovering over a key and pressing it,
// white or black, at each distance across the keys from where it rests, for both hands. Solved here
// once, so the app only looks the angles up: `src/widgets/piano-hands/model/hand-poses.json`.
// Run: node scripts/hand-poses.mjs (about ten seconds). It prints how near each pose comes to its key.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { Matrix4 } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { createServer } from 'vite'

const root = fileURLToPath(new URL('..', import.meta.url))
const vite = await createServer({
  root,
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
  logLevel: 'error',
})
const load = (path) => vite.ssrLoadModule(path)
const rig = await load('/src/widgets/piano-hands/ui/scene/rig.ts')
const { KEY, PLAY_Z, whiteTop, blackTop, BLACK_FRONT, handIn } = await load(
  '/src/widgets/piano-hands/model/keys.ts',
)
const { FINGERS, restingPlace } = await load('/src/widgets/piano-hands/model/fingers.ts')
const { POSE_TABLE, HOVER } = await load('/src/widgets/piano-hands/model/pose-table.ts')
await vite.close()

const assets = `${root}src/widgets/piano-hands/assets`
const parse = (file) =>
  new Promise((resolve, reject) => {
    const bytes = readFileSync(`${assets}/${file}`)
    new GLTFLoader().parse(
      bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
      '',
      resolve,
      reject,
    )
  })

/** A resting finger touches its key without sinking into it. */
const GAP = 0.0005
/** Half the gap between two white keys. */
const SLIT = 0.00045

const component = (a, i, c) =>
  c === 0 ? a.getX(i) : c === 1 ? a.getY(i) : c === 2 ? a.getZ(i) : a.getW(i)

/** Every vertex a finger's moving joints carry, with each joint's weight (−1: a joint at rest). */
function fingerSkin(hand, finger) {
  const { chain, distal } = hand.fingers[finger]
  const geometry = hand.mesh.geometry
  const position = geometry.getAttribute('position')
  const index = geometry.getAttribute('skinIndex')
  const weight = geometry.getAttribute('skinWeight')
  const bones = hand.mesh.skeleton.bones
  const order = new Map(chain.map((joint, j) => [joint, j]))
  const first = finger === 'thumb' ? 0 : 1
  const ends = [chain[distal], chain[distal + 1]]
  const skin = []
  for (let v = 0; v < position.count; v += 1) {
    const carried = []
    let moves = false
    for (let c = 0; c < 4; c += 1) {
      const w = component(weight, v, c)
      if (!w) continue
      const j = order.get(bones[component(index, v, c)].name) ?? -1
      if (j >= first && w > 0.01) moves = true
      carried.push(j, w)
    }
    if (moves)
      skin.push({
        x: position.getX(v),
        y: position.getY(v),
        z: position.getZ(v),
        carried,
        pad: ends.includes(hand.main[v]),
      })
  }
  return skin
}

/** A finger's skin in the world, posed as the renderer skins it. */
function skinFinger(hand, finger, skin, angles, world) {
  const posed = rig.chainPose(hand, finger, angles)
  const e = world.elements
  const joints = posed.chain.map((joint, j) => ({
    m: new Matrix4().makeRotationFromQuaternion(
      posed.turned[j].clone().multiply(hand.rest.get(joint).q.clone().invert()),
    ).elements,
    a: hand.rest.get(joint).p,
    b: posed.at[j].clone(),
  }))
  const out = new Float64Array(skin.length * 3)
  for (let i = 0; i < skin.length; i += 1) {
    const s = skin[i]
    let x = 0
    let y = 0
    let z = 0
    for (let c = 0; c < s.carried.length; c += 2) {
      const j = s.carried[c]
      const w = s.carried[c + 1]
      if (j < 0) {
        x += w * s.x
        y += w * s.y
        z += w * s.z
        continue
      }
      const { m, a, b } = joints[j]
      const dx = s.x - a.x
      const dy = s.y - a.y
      const dz = s.z - a.z
      x += w * (m[0] * dx + m[4] * dy + m[8] * dz + b.x)
      y += w * (m[1] * dx + m[5] * dy + m[9] * dz + b.y)
      z += w * (m[2] * dx + m[6] * dy + m[10] * dz + b.z)
    }
    out[i * 3] = e[0] * x + e[4] * y + e[8] * z + e[12]
    out[i * 3 + 1] = e[1] * x + e[5] * y + e[9] * z + e[13]
    out[i * 3 + 2] = e[2] * x + e[6] * y + e[10] * z + e[14]
  }
  return out
}

/**
 * The keys about the one played, at `x0`: white keys everywhere, and for a black key played, that key
 * standing on them. How deep a point is in them, with the key played `press` of the way down; under a
 * key counts as in it, since a finger could only get there through it.
 */
function keysAround(x0, black) {
  const over = (x) => {
    if (black) return false
    const off = (x - x0) / KEY.width
    return Math.abs(off) < 0.5 && Math.abs(x - x0) < KEY.width / 2 - SLIT
  }
  const inside = (x, y, z, press) => {
    if (z >= 0 || z <= -KEY.length) return 0
    let d = 0
    const k = Math.round((x - x0) / KEY.width)
    if (Math.abs(x - x0 - k * KEY.width) < KEY.width / 2 - SLIT) {
      const top = whiteTop(z, !black && k === 0 ? press : 0)
      if (y < top) d = top - y
    }
    if (black && z < BLACK_FRONT && Math.abs(x - x0) < KEY.blackWidth / 2) {
      const top = blackTop(z, press)
      if (y < top)
        d = Math.max(d, Math.min(top - y, KEY.blackWidth / 2 - Math.abs(x - x0), BLACK_FRONT - z))
    }
    return d
  }
  const top = (z, press) => (black ? blackTop(z, press) : whiteTop(z, press))
  const onKey = (x, z) =>
    black
      ? Math.abs(x - x0) < KEY.blackWidth / 2 && z < BLACK_FRONT && z > -KEY.length
      : over(x) && z < 0 && z > -KEY.length
  return { inside, top, onKey }
}

/**
 * Where a fingertip meets the key: how far its lowest pad skin is over the key's top and where that
 * skin is. `onKey` false: its lowest pad skin anywhere, over the key's top as if it reached that far.
 */
function padContact(points, skin, keys, press, onKey) {
  const near = []
  let clear = Infinity
  for (let i = 0; i < skin.length; i += 1) {
    if (!skin[i].pad) continue
    const x = points[i * 3]
    const y = points[i * 3 + 1]
    const z = points[i * 3 + 2]
    if (onKey && !keys.onKey(x, z)) continue
    const c = y - keys.top(Math.min(-0.001, Math.max(-KEY.length + 0.001, z)), press)
    near.push(c, x, z)
    if (c < clear) clear = c
  }
  let sx = 0
  let sz = 0
  let sw = 0
  for (let i = 0; i < near.length; i += 3) {
    const w = Math.exp(-(near[i] - clear) / 0.0006)
    sx += w * near[i + 1]
    sz += w * near[i + 2]
    sw += w
  }
  return { clear, x: sx / sw, z: sz / sw }
}

function solve3(A, b) {
  const m = A.map((row, i) => [...row, b[i]])
  for (let c = 0; c < 3; c += 1) {
    let p = c
    for (let r = c + 1; r < 3; r += 1) if (Math.abs(m[r][c]) > Math.abs(m[p][c])) p = r
    ;[m[c], m[p]] = [m[p], m[c]]
    for (let r = 0; r < 3; r += 1)
      if (r !== c) {
        const k = m[r][c] / m[c][c]
        for (let j = c; j < 4; j += 1) m[r][j] -= k * m[c][j]
      }
  }
  return [m[0][3] / m[0][0], m[1][3] / m[1][1], m[2][3] / m[2][2]]
}

/** Levenberg–Marquardt on a finger's three angles: the residuals `resid` gives, and a pull to `prior`. */
function fit(start, resid, prior, stiff) {
  const sq = Math.sqrt(stiff)
  const R = (t) => {
    const r = resid(t)
    for (let i = 0; i < 3; i += 1) r.push(sq * (t[i] - prior[i]))
    return r
  }
  const cost = (r) => r.reduce((sum, x) => sum + x * x, 0)
  let th = start.slice()
  let r0 = R(th)
  let c0 = cost(r0)
  let mu = 1e-7
  for (let it = 0; it < 200; it += 1) {
    const J = [0, 1, 2].map((j) => {
      const t = th.slice()
      t[j] += 1e-4
      return R(t).map((x, i) => (x - r0[i]) / 1e-4)
    })
    const A = [0, 1, 2].map((i) =>
      [0, 1, 2].map((j) => J[i].reduce((sum, x, k) => sum + x * J[j][k], 0)),
    )
    const g = [0, 1, 2].map((i) => -J[i].reduce((sum, x, k) => sum + x * r0[k], 0))
    let gain = 0
    while (mu < 1) {
      const d = solve3(
        A.map((row, i) => row.map((x, j) => (i === j ? x + mu : x))),
        g,
      )
      const big = Math.max(...d.map(Math.abs))
      const k = big > 0.15 ? 0.15 / big : 1
      const t = th.map((x, i) => x + d[i] * k)
      const r = R(t)
      const c = cost(r)
      if (c < c0) {
        th = t
        r0 = r
        gain = c0 - c
        c0 = c
        mu = Math.max(mu / 3, 1e-10)
        break
      }
      mu *= 10
    }
    if (gain < 1e-15) break
  }
  return { th, cost: c0 }
}

/** The best of `fit` from each start. */
const best = (starts, resid, prior, stiff) =>
  starts
    .map((start) => fit(start, resid, prior, stiff))
    .reduce((chosen, found) => (found.cost < chosen.cost ? found : chosen)).th

/** A finger inside a key matters more than a millimetre off its spot. */
const DEPTH = 4
const depths = (r, points, keys, press) => {
  for (let i = 0; i < points.length; i += 3)
    r.push(DEPTH * keys.inside(points[i], points[i + 1] - 0.0002, points[i + 2], press))
  return r
}
const deepest = (points, keys, press) => {
  let d = 0
  for (let i = 0; i < points.length; i += 3)
    d = Math.max(d, keys.inside(points[i], points[i + 1], points[i + 2], press))
  return d
}

/** A finger at ease, the left hand's spread mirrored. */
const NATURAL = {
  thumb: [0.35, 0.5, 0.35],
  index: [0.5, 0.85, 0],
  middle: [0.5, 0.85, 0],
  ring: [0.5, 0.85, 0],
  pinky: [0.45, 0.75, 0],
}
const natural = (side, finger) =>
  NATURAL[finger].map((x, j) => (side === 'lh' && j === (finger === 'thumb' ? 0 : 2) ? -x : x))

const round = (x) => Math.round(x * 1e4) / 1e4
const mm = (x) => (x * 1000).toFixed(1)
const offsets = Array.from(
  { length: POSE_TABLE.count },
  (_, i) => POSE_TABLE.from + i * POSE_TABLE.step,
)
const middle = offsets.findIndex((dx) => Math.abs(dx) < 1e-9)

const table = { ...POSE_TABLE, hands: {} }
const worst = []
for (const side of ['rh', 'lh']) {
  const gltf = await parse(side === 'rh' ? 'right.glb' : 'left.glb')
  const hand = rig.setUpHand(side, gltf.scene)
  table.hands[side] = {}
  for (const [i, finger] of FINGERS.entries()) {
    const skin = fingerSkin(hand, finger)
    const resting = restingPlace(side, i + 1) * KEY.width
    const angles = { white: { up: [], down: [] }, black: { up: [], down: [] } }
    for (const colour of ['white', 'black']) {
      const black = colour === 'black'
      // The hand moves into the keys for a short finger to play a black key (`handIn`).
      const depth = black ? handIn(finger) : 0
      const place = rig.placeHand(hand)
      place.p.z += depth
      const world = rig.worldMatrix(hand, place)
      const z0 = PLAY_Z[colour][finger] + depth
      // Out from where the finger rests, each pose drawn toward its neighbour's, so the table is smooth.
      const order = [
        middle,
        ...offsets.map((_, k) => middle + k + 1).filter((k) => k < offsets.length),
        ...offsets.map((_, k) => middle - k - 1).filter((k) => k >= 0),
      ]
      for (const k of order) {
        const x0 = resting + offsets[k]
        const keys = keysAround(x0, black)
        const at = (t) => skinFinger(hand, finger, skin, t, world)
        const neighbour =
          k === middle ? null : k > middle ? angles[colour].up[k - 1] : angles[colour].up[k + 1]
        const ease = natural(side, finger)
        const spreadAt = finger === 'thumb' ? 0 : 2
        const starts = [
          ease,
          ...[-1, -0.75, -0.5, -0.25, 0.25, 0.5, 0.75, 1].map((by) =>
            ease.map((x, j) => (j === spreadAt ? x + by : x)),
          ),
          ...(neighbour ? [neighbour] : []),
          ...(black && angles.white.up[k] ? [angles.white.up[k]] : []),
        ]
        const up = best(
          starts,
          (t) => {
            const points = at(t)
            const c = padContact(points, skin, keys, 0, false)
            return depths([c.x - x0, c.clear - HOVER, c.z - z0], points, keys, 0)
          },
          neighbour ?? ease,
          neighbour ? 2e-5 : 2e-6,
        )
        const down = best(
          [up],
          (t) => {
            const points = at(t)
            const c = padContact(points, skin, keys, 1, true)
            const r = Number.isFinite(c.clear)
              ? [c.clear - GAP, c.x - x0, 0.6 * (c.z - z0)]
              : [0.05, 0.05, 0.05]
            return depths(r, points, keys, 1)
          },
          up,
          4e-7,
        )
        angles[colour].up[k] = up
        angles[colour].down[k] = down
        const u = padContact(at(up), skin, keys, 0, false)
        const d = padContact(at(down), skin, keys, 1, true)
        const miss = (c, over) =>
          Number.isFinite(c.clear)
            ? Math.max(Math.abs(c.x - x0), Math.abs(c.z - z0), Math.abs(c.clear - over))
            : 1
        worst.push({
          where: `${side} ${finger} ${colour} dx ${mm(offsets[k])}`,
          up: `x ${mm(u.x - x0)} z ${mm(u.z - z0)} over ${mm(u.clear)}`,
          down: `x ${mm(d.x - x0)} z ${mm(d.z - z0)} over ${mm(d.clear)} in ${mm(deepest(at(down), keys, 1))}`,
          miss: Math.max(miss(u, HOVER), miss(d, GAP)),
        })
      }
    }
    table.hands[side][finger] = {
      white: {
        up: angles.white.up.map((t) => t.map(round)),
        down: angles.white.down.map((t) => t.map(round)),
      },
      black: {
        up: angles.black.up.map((t) => t.map(round)),
        down: angles.black.down.map((t) => t.map(round)),
      },
    }
  }
}

writeFileSync(`${root}src/widgets/piano-hands/model/hand-poses.json`, `${JSON.stringify(table)}\n`)
worst.sort((a, b) => b.miss - a.miss)
for (const w of worst.filter((w) => w.miss >= 0.002))
  console.log(`${w.where.padEnd(30)} up: ${w.up.padEnd(28)} down: ${w.down}`)
const within = worst.filter((w) => w.miss < 0.002).length
console.log(`${within} of ${worst.length} poses within 2 mm of their key`)
