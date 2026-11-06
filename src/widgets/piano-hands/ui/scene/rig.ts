import {
  Bone,
  BufferAttribute,
  Euler,
  Group,
  Matrix4,
  Mesh,
  Quaternion,
  SkinnedMesh,
  SphereGeometry,
  Vector3,
  type BufferGeometry,
  type Material,
  type Object3D,
} from 'three'
import { FINGERS, type Angles, type FingerName, type Side } from '../../model/fingers'
import { PLAY_Z } from '../../model/keys'

/**
 * The hands' rig (R36): the WebXR generic hand (MIT, © 2019 Amazon.com) posed on real-size keys. The
 * model's joints are siblings under its armature, not a chain, so every joint's place is worked out
 * here, finger by finger, from three angles each (`Angles`).
 */

/** A finger's joints from the palm out; the thumb has no middle phalanx. */
const chainOf = (finger: FingerName): readonly string[] =>
  finger === 'thumb'
    ? ['thumb-metacarpal', 'thumb-phalanx-proximal', 'thumb-phalanx-distal', 'thumb-tip']
    : ['metacarpal', 'phalanx-proximal', 'phalanx-intermediate', 'phalanx-distal', 'tip'].map(
        (joint) => `${finger}-finger-${joint}`,
      )

const basis = (x: Vector3, y: Vector3, z: Vector3) =>
  new Quaternion().setFromRotationMatrix(new Matrix4().makeBasis(x, y, z))

/**
 * The models point their fingers down −y, the right palm toward −x, the left (its mirror) toward +x.
 * Each is turned palm down with its fingers into the keys.
 */
export const MOUNT: Readonly<Record<Side, Quaternion>> = {
  rh: basis(new Vector3(0, 1, 0), new Vector3(0, 0, 1), new Vector3(1, 0, 0)),
  lh: basis(new Vector3(0, -1, 0), new Vector3(0, 0, 1), new Vector3(-1, 0, 0)),
}

/** The last joints bend with the ones before them, as a finger's do. */
const DIP_OF_PIP = 0.62
const IP_OF_MCP = 0.7

/**
 * The hand at the keys: its knuckles 68 mm over the keys and 42 mm in front of where the middle
 * finger plays, the wrist a little lower, turned in toward the body.
 */
export const PLACE = { height: 0.068, back: 0.042, yaw: 0.1, pitch: 0.18, roll: -0.05 } as const

/** A joint as the model rests: where it is and how it is turned, in the model's frame. */
export interface Rest {
  readonly p: Vector3
  readonly q: Quaternion
}

/** A finger's joints and the axes it turns about, in the model's frame. */
export interface FingerRig {
  readonly chain: readonly string[]
  /** The bend; the spread across the hand; the thumb's swing out from the palm. */
  readonly axes: { readonly flex: Vector3; readonly spread: Vector3; readonly abduct: Vector3 }
  /** Its last phalanx's joint, in `chain`: the nail's and the pad's. */
  readonly distal: number
  /** Where each joint is now, and how it is turned: written by `poseFinger`. */
  readonly at: readonly Vector3[]
  readonly turned: readonly Quaternion[]
}

export interface HandRig {
  readonly side: Side
  /** What the scene moves: the hand's place at the keys. */
  readonly root: Group
  readonly model: Object3D
  readonly mesh: SkinnedMesh
  readonly bones: ReadonlyMap<string, Bone>
  readonly rest: ReadonlyMap<string, Rest>
  /** Toward the palm, in the model's frame. */
  readonly palm: Vector3
  /** Each vertex's heaviest joint. */
  readonly main: readonly string[]
  readonly fingers: Readonly<Record<FingerName, FingerRig>>
}

const component = (attribute: BufferAttribute, i: number, c: number) =>
  c === 0
    ? attribute.getX(i)
    : c === 1
      ? attribute.getY(i)
      : c === 2
        ? attribute.getZ(i)
        : attribute.getW(i)

/** `a` with its part along unit `d` taken away, made unit. */
const across = (a: Vector3, d: Vector3) => a.clone().addScaledVector(d, -a.dot(d)).normalize()

function attribute(geometry: BufferGeometry, name: string): BufferAttribute {
  const found = geometry.getAttribute(name)
  if (!(found instanceof BufferAttribute)) throw new Error(`The hand has no ${name}.`)
  return found
}

function restOf(rest: ReadonlyMap<string, Rest>, joint: string): Rest {
  const found = rest.get(joint)
  if (!found) throw new Error(`The hand has no ${joint}.`)
  return found
}

/** The hand's joints, its skin's main joints and each finger's axes, turned palm down. */
export function setUpHand(side: Side, model: Object3D): HandRig {
  const root = new Group()
  root.add(model)
  model.quaternion.copy(MOUNT[side])
  const bones = new Map<string, Bone>()
  const meshes: SkinnedMesh[] = []
  model.traverse((node) => {
    if (node instanceof Bone) bones.set(node.name, node)
    if (node instanceof SkinnedMesh) meshes.push(node)
  })
  const [skinned] = meshes
  if (!skinned) throw new Error('The hand has no skin.')
  const rest = new Map<string, Rest>(
    [...bones].map(([name, bone]) => [
      name,
      { p: bone.position.clone(), q: bone.quaternion.clone() },
    ]),
  )
  const palm = new Vector3(side === 'rh' ? -1 : 1, 0, 0)
  const position = attribute(skinned.geometry, 'position')
  const index = attribute(skinned.geometry, 'skinIndex')
  const weight = attribute(skinned.geometry, 'skinWeight')
  const main: string[] = []
  for (let v = 0; v < position.count; v += 1) {
    let best = 0
    let joint = 0
    for (let c = 0; c < 4; c += 1) {
      const w = component(weight, v, c)
      if (w > best) {
        best = w
        joint = component(index, v, c)
      }
    }
    main.push(skinned.skeleton.bones[joint]?.name ?? '')
  }
  const fingerOf = (finger: FingerName): FingerRig => {
    const chain = chainOf(finger)
    const p = chain.map((joint) => restOf(rest, joint).p)
    const [p0, p1, , p3, p4] = p
    if (!p0 || !p1 || !p3) throw new Error(`The hand's ${finger} is not whole.`)
    let axes: FingerRig['axes']
    if (finger === 'thumb') {
      const d = p3.clone().sub(p0).normalize()
      const dm = p3.clone().sub(p1).normalize()
      axes = {
        spread: palm.clone(),
        abduct: d.clone().cross(across(palm, d)).normalize(),
        flex: dm
          .clone()
          .cross(
            across(
              palm
                .clone()
                .multiplyScalar(0.6)
                .add(new Vector3(0, 0, 0.8)),
              dm,
            ),
          )
          .normalize(),
      }
    } else {
      if (!p4) throw new Error(`The hand's ${finger} is not whole.`)
      const d = p4.clone().sub(p1).normalize()
      const flex = d.clone().cross(across(palm, d)).normalize()
      axes = { flex, spread: palm.clone(), abduct: flex.clone() }
    }
    return {
      chain,
      axes,
      distal: finger === 'thumb' ? 2 : 3,
      at: p.map((joint) => joint.clone()),
      turned: chain.map((joint) => restOf(rest, joint).q.clone()),
    }
  }
  return {
    side,
    root,
    model,
    mesh: skinned,
    bones,
    rest,
    palm,
    main,
    fingers: {
      thumb: fingerOf('thumb'),
      index: fingerOf('index'),
      middle: fingerOf('middle'),
      ring: fingerOf('ring'),
      pinky: fingerOf('pinky'),
    },
  }
}

const turn = new Quaternion()
const centre = new Vector3()

/** Turns the joints from `from` on about joint `about`, by `angle` about `axis`. */
function rotate(
  at: readonly Vector3[],
  turned: readonly Quaternion[],
  from: number,
  about: number,
  axis: Vector3,
  angle: number,
) {
  if (!angle) return
  turn.setFromAxisAngle(axis, angle)
  const pivot = at[about]
  if (!pivot) return
  centre.copy(pivot)
  for (let j = from; j < at.length; j += 1) {
    at[j]?.sub(centre).applyQuaternion(turn).add(centre)
    turned[j]?.premultiply(turn)
  }
}

/**
 * A finger's joints for its angles, into its `at` and `turned`: the tip-most joints turned first, so
 * each turns about its own hinge. The thumb's angles are its spread, its swing from the palm and its
 * bend; another finger's its knuckle's bend, its middle joint's bend and its spread.
 */
export function chainPose(hand: HandRig, finger: FingerName, angles: Angles): FingerRig {
  const rig = hand.fingers[finger]
  rig.chain.forEach((joint, j) => {
    const rest = restOf(hand.rest, joint)
    rig.at[j]?.copy(rest.p)
    rig.turned[j]?.copy(rest.q)
  })
  const { at, turned, axes } = rig
  if (finger === 'thumb') {
    const [spread, abduct, bend] = angles
    rotate(at, turned, 2, 2, axes.flex, bend * IP_OF_MCP)
    rotate(at, turned, 1, 1, axes.flex, bend)
    rotate(at, turned, 0, 0, axes.abduct, abduct)
    rotate(at, turned, 0, 0, axes.spread, spread)
  } else {
    const [knuckle, middle, spread] = angles
    rotate(at, turned, 3, 3, axes.flex, middle * DIP_OF_PIP)
    rotate(at, turned, 2, 2, axes.flex, middle)
    rotate(at, turned, 1, 1, axes.flex, knuckle)
    rotate(at, turned, 1, 1, axes.spread, spread)
  }
  return rig
}

/** Sets a finger's joints to its angles. */
export function poseFinger(hand: HandRig, finger: FingerName, angles: Angles) {
  const rig = chainPose(hand, finger, angles)
  for (let j = finger === 'thumb' ? 0 : 1; j < rig.chain.length; j += 1) {
    const bone = hand.bones.get(rig.chain[j] ?? '')
    const at = rig.at[j]
    const turned = rig.turned[j]
    if (bone && at && turned) {
      bone.position.copy(at)
      bone.quaternion.copy(turned)
    }
  }
}

/** Where the middle finger plays a white key: the hand's place is measured from it. */
const PLACE_Z = PLAY_Z.white.middle

/**
 * Where the hand sits with its middle finger over x = 0 (a five-finger position on the keys from
 * there), turned and raised as at the keys: the hand at any x is this moved along x.
 */
export function placeHand(hand: HandRig): { readonly p: Vector3; readonly q: Quaternion } {
  const sign = hand.side === 'rh' ? 1 : -1
  const q = new Quaternion().setFromEuler(
    new Euler(PLACE.pitch, PLACE.yaw * sign, PLACE.roll * sign, 'YXZ'),
  )
  const knuckle = restOf(hand.rest, 'middle-finger-phalanx-proximal')
    .p.clone()
    .applyQuaternion(MOUNT[hand.side])
    .applyQuaternion(q)
  const at = new Vector3(0, PLACE.height, PLACE_Z + PLACE.back)
  return { q, p: at.sub(knuckle) }
}

/** The model's frame in the world, for the hand placed at `place`. */
export const worldMatrix = (hand: HandRig, place: { p: Vector3; q: Quaternion }) =>
  new Matrix4()
    .compose(place.p, place.q, new Vector3(1, 1, 1))
    .multiply(new Matrix4().makeRotationFromQuaternion(MOUNT[hand.side]))

/** A finger's pad: the vertices its last phalanx and its tip carry most, in the model's frame. */
export function padOf(hand: HandRig, finger: FingerName): Vector3[] {
  const rig = hand.fingers[finger]
  const ends = [rig.chain[rig.distal], rig.chain[rig.distal + 1]]
  const position = attribute(hand.mesh.geometry, 'position')
  const pad: Vector3[] = []
  for (let v = 0; v < position.count; v += 1)
    if (ends.includes(hand.main[v])) pad.push(new Vector3().fromBufferAttribute(position, v))
  return pad
}

/**
 * Skin that is not flat (R36): rosier fingertips and knuckles, as a multiplier on the chosen tone,
 * written as the skin's vertex colours.
 */
export function tint(hand: HandRig) {
  const geometry = hand.mesh.geometry
  const position = attribute(hand.mesh.geometry, 'position')
  const colours = new Float32Array(position.count * 3)
  const back = hand.palm.clone().negate()
  const knuckles: Vector3[] = []
  for (const finger of FINGERS) {
    const { chain } = hand.fingers[finger]
    for (const j of finger === 'thumb' ? [1, 2] : [1, 2, 3])
      knuckles.push(restOf(hand.rest, chain[j] ?? '').p)
  }
  const v = new Vector3()
  const off = new Vector3()
  for (let i = 0; i < position.count; i += 1) {
    v.fromBufferAttribute(position, i)
    let r = 1
    let g = 1
    let b = 1
    for (const finger of FINGERS) {
      const rig = hand.fingers[finger]
      const from = rig.chain[rig.distal] ?? ''
      const to = rig.chain[rig.distal + 1] ?? ''
      if (hand.main[i] !== from && hand.main[i] !== to) continue
      const p3 = restOf(hand.rest, from).p
      const p4 = restOf(hand.rest, to).p
      const along = off.copy(v).sub(p3).dot(p4.clone().sub(p3).normalize()) / p3.distanceTo(p4)
      const k = Math.max(0, Math.min(1, (along - 0.1) / 0.9))
      r *= 1 - 0.03 * k
      g *= 1 - 0.13 * k
      b *= 1 - 0.12 * k
    }
    for (const knuckle of knuckles) {
      off.copy(v).sub(knuckle)
      const d = off.length()
      if (d < 0.011 && off.dot(back) > 0) {
        const k = 1 - d / 0.011
        r *= 1 - 0.02 * k
        g *= 1 - 0.08 * k
        b *= 1 - 0.08 * k
      }
    }
    colours[i * 3] = r
    colours[i * 3 + 1] = g
    colours[i * 3 + 2] = b
  }
  geometry.setAttribute('color', new BufferAttribute(colours, 3))
}

/** A nail on each fingertip, carried by its last joint: curved to the finger, its free edge paler. */
export function addNails(hand: HandRig, material: Material) {
  for (const finger of FINGERS) {
    const rig = hand.fingers[finger]
    const p3 = restOf(hand.rest, rig.chain[rig.distal] ?? '').p
    const p4 = restOf(hand.rest, rig.chain[rig.distal + 1] ?? '').p
    const d = p4.clone().sub(p3).normalize()
    const dorsal = across(hand.palm.clone().negate(), d)
    const lateral = new Vector3().crossVectors(dorsal, d)
    const pad = padOf(hand, finger).map((vertex) => {
      const r = vertex.clone().sub(p3)
      return { u: r.dot(d), t: r.dot(dorsal), l: r.dot(lateral) }
    })
    const end = Math.max(...pad.map((p) => p.u))
    const u0 = end * (finger === 'thumb' ? 0.44 : finger === 'pinky' ? 0.46 : 0.4)
    const u1 = end - 0.0018
    const uc = (u0 + u1) / 2
    const length = u1 - u0
    const ring = pad.filter((p) => Math.abs(p.u - uc) < 0.0025)
    const top = Math.max(...ring.map((p) => p.t))
    const lMin = Math.min(...ring.map((p) => p.l))
    const lMax = Math.max(...ring.map((p) => p.l))
    const half = (lMax - lMin) / 2
    const width = 2 * half * (finger === 'thumb' ? 0.72 : 0.76)
    const curve = Math.max(0.004, half)
    const geometry = new SphereGeometry(1, 32, 16)
    const position = attribute(geometry, 'position')
    const colours = new Float32Array(position.count * 3)
    for (let i = 0; i < position.count; i += 1) {
      const zn = position.getZ(i)
      const x = (position.getX(i) * width) / 2
      const z = (zn * length) / 2
      position.setXYZ(i, x, position.getY(i) * 0.0006 - (x * x) / (2 * curve) - (z * z) / 0.06, z)
      const free = Math.max(0, Math.min(1, (zn - 0.55) / 0.35))
      colours[i * 3] = 1 + 0.1 * free
      colours[i * 3 + 1] = 1 + 0.16 * free
      colours[i * 3 + 2] = 1 + 0.18 * free
    }
    geometry.setAttribute('color', new BufferAttribute(colours, 3))
    geometry.computeVertexNormals()
    const nail = new Mesh(geometry, material)
    const facing = basis(lateral, dorsal, d)
    const at = p3
      .clone()
      .addScaledVector(d, uc)
      .addScaledVector(dorsal, top - 0.0002)
      .addScaledVector(lateral, (lMin + lMax) / 2)
    const inverse = restOf(hand.rest, rig.chain[rig.distal] ?? '')
      .q.clone()
      .invert()
    nail.position.copy(at.sub(p3).applyQuaternion(inverse))
    nail.quaternion.copy(inverse.multiply(facing))
    nail.castShadow = true
    hand.bones.get(rig.chain[rig.distal] ?? '')?.add(nail)
  }
}
