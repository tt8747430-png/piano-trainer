import {
  BoxGeometry,
  Color,
  DynamicDrawUsage,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  Quaternion,
  Vector3,
} from 'three'
import { isBlackKey, midi, type Midi } from '@/shared/lib/music'
import { KEY, KEY_TILT, keyX } from '../../model/keys'

/** A real piano's 88 keys, A0 to C8. */
const KEYS: readonly Midi[] = Array.from({ length: 88 }, (_, i) => midi(21 + i))

/** The slit between two white keys. */
const SLIT = 0.0009

/** How high the case stands behind the keys, from the bed up: an upright's fallboard and front. */
const CASE_HEIGHT = 0.6

/** The cheeks at the keyboard's ends: a block of the case beside A0 and beyond C8, over the keys. */
const CHEEK = { width: 0.045, gap: 0.002, top: 0.035 } as const

/** The paints the piano is drawn in, from the app's tokens. */
export interface PianoPaint {
  readonly white: Color
  readonly black: Color
  readonly bed: Color
  readonly felt: Color
  readonly case: Color
}

/** The keyboard (R36): its keys, each pressed and painted on its own, on their bed, the fallboard behind. */
export interface Keyboard {
  readonly group: Group
  /** A key `press` of the way down (0–1) in `paint`. */
  set(key: Midi, press: number, paint: Color): void
  /** The keys' new places and paints, drawn next frame. */
  commit(): void
  /** Every key plain, and the bed, the felt and the case, in the theme's paints. */
  paint(paint: PianoPaint): void
  dispose(): void
}

/** A black key's body: narrower on top than at its foot, its front sloped. */
function blackKeyGeometry() {
  const height = KEY.blackHeight + 0.01
  const geometry = new BoxGeometry(KEY.blackWidth, height, KEY.blackLength)
  const position = geometry.getAttribute('position')
  for (let i = 0; i < position.count; i += 1) {
    if (position.getY(i) <= 0) continue
    position.setX(i, position.getX(i) * 0.74)
    if (position.getZ(i) > 0) position.setZ(i, position.getZ(i) - 0.006)
  }
  geometry.computeVertexNormals()
  // Its top at the black keys' height, its back end at the pivot.
  geometry.translate(0, KEY.blackHeight - height / 2, KEY.blackLength / 2)
  return geometry
}

/** A white key's body: its top at 0, its back end at the pivot, its front edge at the keys' edge. */
function whiteKeyGeometry() {
  const geometry = new BoxGeometry(KEY.width - SLIT, KEY.height, KEY.length)
  geometry.translate(0, -KEY.height / 2, KEY.length / 2)
  return geometry
}

/** Builds the keyboard: two instanced meshes, the bed under them, the felt and the fallboard behind. */
export function createKeyboard(): Keyboard {
  const group = new Group()
  const whites = KEYS.filter((key) => !isBlackKey(key))
  const blacks = KEYS.filter((key) => isBlackKey(key))
  const ivory = new MeshStandardMaterial({ roughness: 0.42, metalness: 0 })
  const ebony = new MeshStandardMaterial({ roughness: 0.32, metalness: 0 })
  const white = new InstancedMesh(whiteKeyGeometry(), ivory, whites.length)
  const black = new InstancedMesh(blackKeyGeometry(), ebony, blacks.length)
  for (const mesh of [white, black]) {
    mesh.instanceMatrix.setUsage(DynamicDrawUsage)
    mesh.castShadow = true
    mesh.receiveShadow = true
    group.add(mesh)
  }
  const at = new Map<Midi, { readonly mesh: InstancedMesh; readonly i: number }>([
    ...whites.map((key, i) => [key, { mesh: white, i }] as const),
    ...blacks.map((key, i) => [key, { mesh: black, i }] as const),
  ])
  const first = keyX(midi(21)) - KEY.width / 2
  const last = keyX(midi(108)) + KEY.width / 2
  const across = last - first
  const middle = (first + last) / 2
  const flat = (paint: number) => new MeshStandardMaterial({ color: paint, roughness: 0.8 })
  const bedMaterial = flat(0x000000)
  const feltMaterial = flat(0x000000)
  const caseMaterial = new MeshStandardMaterial({ roughness: 0.25, metalness: 0 })
  const part = (
    geometry: BoxGeometry,
    material: MeshStandardMaterial,
    x: number,
    y: number,
    z: number,
  ) => {
    const mesh = new Mesh(geometry, material)
    mesh.position.set(x, y, z)
    mesh.receiveShadow = true
    group.add(mesh)
    return mesh
  }
  // The bed the keys go down to, seen in the slits.
  part(
    new BoxGeometry(across + 0.02, 0.004, KEY.length + 0.01),
    bedMaterial,
    middle,
    -KEY.height - 0.002,
    -KEY.length / 2,
  )
  // The felt strip the keys' back ends run under.
  part(
    new BoxGeometry(across + 0.02, 0.006, 0.012),
    feltMaterial,
    middle,
    0.003,
    -KEY.length - 0.004,
  )
  // The fallboard and the case's front above it, as high as a camera standing back ever sees.
  const outer = across + 2 * (CHEEK.width + CHEEK.gap)
  part(
    new BoxGeometry(outer, CASE_HEIGHT, 0.02),
    caseMaterial,
    middle,
    CASE_HEIGHT / 2 - 0.02,
    -KEY.length - 0.02,
  )
  // The key slip, the rail along the keys' front, below their front edge.
  const slip = { bottom: -KEY.height - 0.022, front: 0.06 }
  part(new BoxGeometry(outer, 0.02, 0.06), caseMaterial, middle, slip.bottom + 0.01, slip.front / 2)
  // The cheeks, from the fallboard to the slip's front and from its foot to over the keys.
  const cheekDepth = slip.front + KEY.length + 0.01
  const cheekHeight = CHEEK.top - slip.bottom
  for (const x of [first - CHEEK.gap - CHEEK.width / 2, last + CHEEK.gap + CHEEK.width / 2])
    part(
      new BoxGeometry(CHEEK.width, cheekHeight, cheekDepth),
      caseMaterial,
      x,
      slip.bottom + cheekHeight / 2,
      slip.front - cheekDepth / 2,
    )

  const turn = new Quaternion()
  const xAxis = new Vector3(1, 0, 0)
  const place = new Vector3()
  const one = new Vector3(1, 1, 1)
  const matrix = new Matrix4()
  const set = (key: Midi, press: number, paint: Color) => {
    const found = at.get(key)
    if (!found) return
    // Pivoting at its back end: pressed, its front edge goes down by the dip.
    turn.setFromAxisAngle(xAxis, KEY_TILT * Math.min(1, Math.max(0, press)))
    place.set(keyX(key), 0, -KEY.length)
    found.mesh.setMatrixAt(found.i, matrix.compose(place, turn, one))
    found.mesh.setColorAt(found.i, paint)
  }
  const rest = new Color(0xffffff)
  for (const key of KEYS) set(key, 0, rest)
  const commit = () => {
    for (const mesh of [white, black]) {
      mesh.instanceMatrix.needsUpdate = true
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    }
  }
  commit()
  return {
    group,
    set,
    commit,
    paint: (paint) => {
      bedMaterial.color.copy(paint.bed)
      feltMaterial.color.copy(paint.felt)
      caseMaterial.color.copy(paint.case)
      for (const [key, { mesh, i }] of at)
        mesh.setColorAt(i, isBlackKey(key) ? paint.black : paint.white)
      commit()
    },
    dispose: () => {
      group.traverse((node) => {
        if (node instanceof Mesh) node.geometry.dispose()
      })
      for (const material of [ivory, ebony, bedMaterial, feltMaterial, caseMaterial])
        material.dispose()
      white.dispose()
      black.dispose()
    },
  }
}
