import {
  Color,
  DirectionalLight,
  HemisphereLight,
  Mesh,
  MeshPhysicalMaterial,
  NeutralToneMapping,
  PCFShadowMap,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import type { PerformanceNote } from '@/shared/lib/arrangement'
import type { Midi } from '@/shared/lib/music'
import { keyFill, type KeyFill, type KeyMark } from '@/shared/ui'
import { followed, frame, VIEW, type Framing } from '../../model/camera'
import { KEY, keyX } from '../../model/keys'
import {
  choreograph,
  handPose,
  handsApart,
  pressHeld,
  type Choreography,
  type HandPose,
} from '../../model/choreography'
import { FINGERS, type Side } from '../../model/fingers'
import { fingerAngles } from '../../model/poses'
import { createKeyboard, type Keyboard, type PianoPaint } from './keyboard'
import { addNails, placeHand, poseFinger, setUpHand, tint, type HandRig } from './rig'
import { withPaint } from './paint'

/** What the stage shows: the music, where it is, and what the learner holds. */
export interface StageInput {
  readonly notes: readonly PerformanceNote[]
  /** The music's ticks a second at the tempo it plays. */
  readonly perSecond: number
  /** Where the music is now, in ticks: the audio clock while it plays, else the notes awaited. */
  readonly now: () => number
  readonly playing: boolean
  /** Keys the learner holds down: a finger standing on one presses it. */
  readonly held: ReadonlySet<Midi>
  /** The notes awaited, each in its hand's wash; a wrong key in the wrong colour. */
  readonly marks: ReadonlyMap<Midi, KeyMark>
  readonly wrong: ReadonlySet<Midi> | undefined
  /** The hand not practised, faded to a third. */
  readonly faded: Side | null
  /** The music's lowest and highest keys, for the camera. */
  readonly range: { readonly low: Midi; readonly high: Midi } | null
  /**
   * What a pressed key is painted by: the hand pressing it (the Player's), or its chord tone, as its
   * mark says (Chords' stage, its canvas).
   */
  readonly pressedPaint?: 'hand' | 'tone'
}

/** Where a key's far end stands on the canvas, from 0 to 1 across and down: what a tag is put over. */
export type KeyPlace = (key: Midi, black: boolean) => readonly [number, number]

export interface Stage {
  update(input: StageInput): void
  resize(width: number, height: number): void
  dispose(): void
}

/** The hands' one tone (R37: no skin tone, one neutral hand): a warm clay, read on either theme. */
const SKIN = '#c7b8a8'

/** A nail: the skin's tone toward a pale pink. */
const NAIL = '#f2d8d2'

/** How fast the drawn hands catch up with the music: at once while it plays, softly as it steps. */
const EASE = { playing: 0.012, stepping: 0.06, place: 0.08, camera: 0.4, fade: 0.15 } as const

/** A hand's paints, at rest and down, as the flat keys paint them (`Key`). */
const REST: Readonly<Record<KeyFill, string>> = {
  white: 'var(--key-white)',
  black: 'var(--key-black)',
  lit: 'var(--primary)',
  selected: 'var(--primary)',
  wrong: 'var(--destructive)',
  root: 'var(--role-root-wash)',
  '3rd': 'var(--role-3rd-wash)',
  '5th': 'var(--role-5th-wash)',
  '7th': 'var(--role-7th-wash)',
  '9th': 'var(--role-9th-wash)',
  '11th': 'var(--role-11th-wash)',
  '13th': 'var(--role-13th-wash)',
  rh: 'var(--hand-rh-wash)',
  lh: 'var(--hand-lh-wash)',
  staff: 'var(--hand-staff-wash)',
  tonic: 'var(--key-tonic)',
  scale: 'var(--key-scale)',
}
const DOWN: Readonly<Record<KeyFill, string>> = {
  ...REST,
  white: 'var(--key-down)',
  black: 'var(--key-down)',
  root: 'var(--role-root)',
  '3rd': 'var(--role-3rd)',
  '5th': 'var(--role-5th)',
  '7th': 'var(--role-7th)',
  '9th': 'var(--role-9th)',
  '11th': 'var(--role-11th)',
  '13th': 'var(--role-13th)',
  rh: 'var(--hand-rh)',
  lh: 'var(--hand-lh)',
  staff: 'var(--hand-staff)',
  tonic: 'var(--key-tonic-down)',
  scale: 'var(--key-scale-down)',
}

const FILLS = Object.keys(REST).filter((fill): fill is KeyFill => fill in REST)

interface Paints {
  readonly rest: ReadonlyMap<KeyFill, Color>
  readonly down: ReadonlyMap<KeyFill, Color>
  readonly hand: Readonly<Record<Side, Color>>
  readonly piano: PianoPaint
}

const readPaints = (host: HTMLElement): Paints =>
  withPaint(host, (paint) => ({
    rest: new Map(FILLS.map((fill) => [fill, paint(REST[fill])])),
    down: new Map(FILLS.map((fill) => [fill, paint(DOWN[fill])])),
    hand: { rh: paint('var(--hand-rh)'), lh: paint('var(--hand-lh)') },
    piano: {
      white: paint('var(--key-white)'),
      black: paint('var(--key-black)'),
      bed: paint('var(--key-bed)'),
      felt: paint('var(--key-felt)'),
      case: paint('var(--key-black)'),
    },
  }))

/** A hand as drawn: eased toward its pose, faded in once loaded. */
interface DrawnHand {
  readonly rig: HandRig
  readonly skin: MeshPhysicalMaterial
  readonly nail: MeshPhysicalMaterial
  readonly place: ReturnType<typeof placeHand>
  pose: HandPose | null
  opacity: number
}

const approach = (from: number, to: number, k: number) =>
  Math.abs(to - from) < 1e-5 ? to : from + (to - from) * k

/** The hands' paints: the skin, and its nails toward a pale pink. */
function dressing(): { readonly skin: Color; readonly nail: Color } {
  const skin = new Color().setStyle(SKIN, SRGBColorSpace)
  return { skin, nail: skin.clone().lerp(new Color().setStyle(NAIL, SRGBColorSpace), 0.6) }
}

/** Loads a hand's model and sets it up, its skin still to be dressed. */
async function loadHand(side: Side): Promise<DrawnHand> {
  const file =
    side === 'rh'
      ? new URL('../../assets/right.glb', import.meta.url).href
      : new URL('../../assets/left.glb', import.meta.url).href
  const gltf = await new GLTFLoader().loadAsync(file)
  const rig = setUpHand(side, gltf.scene)
  tint(rig)
  const skinMaterial = new MeshPhysicalMaterial({
    roughness: 0.58,
    metalness: 0,
    sheen: 0.35,
    sheenRoughness: 0.7,
    vertexColors: true,
    transparent: true,
    opacity: 0,
  })
  const nailMaterial = new MeshPhysicalMaterial({
    roughness: 0.3,
    clearcoat: 0.6,
    vertexColors: true,
    transparent: true,
    opacity: 0,
  })
  rig.mesh.material = skinMaterial
  rig.mesh.castShadow = true
  rig.mesh.frustumCulled = false
  addNails(rig, nailMaterial)
  return {
    rig,
    skin: skinMaterial,
    nail: nailMaterial,
    place: placeHand(rig),
    pose: null,
    opacity: 0,
  }
}

/**
 * The hands at the keys (R36): a piano seen from above the seat, two hands playing the music on it,
 * each note pressed by its finger, the keys the hands press in their colour. Draws only while
 * something moves. Throws where the device cannot draw 3D (no WebGL).
 */
export function createStage(
  canvas: HTMLCanvasElement,
  input: StageInput,
  events: {
    readonly onLoaded: () => void
    readonly onFailed: () => void
    /** After each frame: where the keys stand now, for what is drawn over them. */
    readonly onDrawn?: (place: KeyPlace) => void
  },
): Stage {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'low-power',
  })
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = NeutralToneMapping
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFShadowMap
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
  const scene = new Scene()
  const pmrem = new PMREMGenerator(renderer)
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = environment
  scene.environmentIntensity = 0.45
  scene.add(new HemisphereLight(0xffffff, 0x2a2622, 0.85))
  // The light from over the player's shoulder, the hands' shadows falling on the keys ahead of them.
  const sun = new DirectionalLight(0xffffff, 1.7)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  sun.shadow.bias = -0.0004
  sun.shadow.normalBias = 0.002
  sun.shadow.radius = 3
  sun.shadow.camera.near = 0.2
  sun.shadow.camera.far = 3
  scene.add(sun, sun.target)
  const keyboard: Keyboard = createKeyboard()
  scene.add(keyboard.group)
  const camera = new PerspectiveCamera((VIEW.fov * 180) / Math.PI, 1, 0.05, 5)
  camera.rotation.x = -VIEW.pitch

  let now = input
  let size = { width: 1, height: 1 }
  let part: Choreography = choreograph(now.notes)
  let apart = handsApart(part)
  let framing: Framing = frame(size, now.range, apart)
  let cameraX = framing.x
  let paints = readPaints(canvas.parentElement ?? document.body)
  const hands: Partial<Record<Side, DrawnHand>> = {}
  const painted = new Map<Midi, Color>()
  const keyPress = new Map<Midi, number>()
  let frameId = 0
  let last = 0
  let disposed = false

  const dress = (hand: DrawnHand) => {
    const { skin, nail } = dressing()
    hand.skin.color.copy(skin)
    hand.nail.color.copy(nail)
  }

  /** The light and its shadow over what the camera sees. */
  const aim = () => {
    const across = (2 * Math.tan(VIEW.fov / 2) * framing.y * size.width) / size.height
    sun.target.position.set(cameraX, 0, -0.05)
    sun.position.set(cameraX + 0.35, 1.1, 0.75)
    const reach = across / 2 + 0.15
    sun.shadow.camera.left = -reach
    sun.shadow.camera.right = reach
    sun.shadow.camera.top = 0.45
    sun.shadow.camera.bottom = -0.45
    sun.shadow.camera.updateProjectionMatrix()
  }

  // With less motion asked for, a step, the hands' fading and the camera land at once; the hands
  // playing still play, as a film of them would.
  const still = window.matchMedia('(prefers-reduced-motion: reduce)')
  const eased = (dt: number, tau: number) => (still.matches ? 1 : 1 - Math.exp(-dt / tau))

  /** One frame: the hands and keys eased toward where the music has them; whether they settled. */
  const step = (dt: number): boolean => {
    let moving = false
    const tick = now.now()
    const k = now.playing ? 1 - Math.exp(-dt / EASE.playing) : eased(dt, EASE.stepping)
    const kPlace = now.playing ? k : eased(dt, EASE.place)
    const pressedBy = new Map<Midi, { side: Side; press: number }>()
    const centres: number[] = []
    for (const side of ['rh', 'lh'] as const) {
      const hand = hands[side]
      const music = part[side]
      if (!hand) continue
      const target = music ? pressHeld(handPose(music, tick, now.perSecond), now.held) : null
      hand.rig.root.visible = target !== null
      const fadeTo = target === null ? 0 : now.faded === side ? 1 / 3 : 1
      const kFade = eased(dt, EASE.fade)
      hand.opacity = approach(hand.opacity, fadeTo, kFade)
      if (hand.opacity !== fadeTo) moving = true
      for (const material of [hand.skin, hand.nail]) {
        material.opacity = hand.opacity
        material.transparent = hand.opacity < 1
        material.depthWrite = hand.opacity >= 1
      }
      if (!target) continue
      const drawn = hand.pose ?? target
      const fingers = drawn.fingers.map((finger, i) => {
        const to = target.fingers[i] ?? finger
        return {
          dx: approach(finger.dx, to.dx, k),
          black: approach(finger.black, to.black, k),
          press: approach(finger.press, to.press, k),
          key: to.key,
        }
      })
      const pose: HandPose = {
        x: approach(drawn.x, target.x, kPlace),
        depth: approach(drawn.depth, target.depth, kPlace),
        lift: approach(drawn.lift, target.lift, kPlace),
        fingers,
        keys: target.keys,
      }
      if (
        pose.x !== target.x ||
        pose.depth !== target.depth ||
        pose.lift !== target.lift ||
        fingers.some((finger, i) => {
          const to = target.fingers[i]
          return (
            !to || finger.dx !== to.dx || finger.black !== to.black || finger.press !== to.press
          )
        })
      )
        moving = true
      hand.pose = pose
      const { root } = hand.rig
      root.position.copy(hand.place.p).add(new Vector3(pose.x, pose.lift, pose.depth))
      root.quaternion.copy(hand.place.q)
      FINGERS.forEach((name, i) => {
        const aim = pose.fingers[i]
        if (aim) poseFinger(hand.rig, name, fingerAngles(side, name, aim))
      })
      for (const [key, press] of target.keys) {
        const had = pressedBy.get(key)
        if (!had || had.press < press) pressedBy.set(key, { side, press })
      }
      if (now.faded !== side) centres.push(pose.x)
    }
    // The keys: each eased to how far down its finger or the learner has it, painted as it goes.
    const keys = new Set<Midi>([
      ...painted.keys(),
      ...now.marks.keys(),
      ...(now.wrong ?? []),
      ...now.held,
      ...pressedBy.keys(),
    ])
    for (const key of keys) {
      const by = pressedBy.get(key)
      const held = now.held.has(key)
      const target = Math.max(by?.press ?? 0, held ? 1 : 0)
      const press = approach(keyPress.get(key) ?? 0, target, k)
      if (press !== target) moving = true
      const fill = keyFill(key, { marks: now.marks, ...(now.wrong ? { wrong: now.wrong } : {}) })
      const rest = paints.rest.get(fill) ?? paints.piano.white
      const plain = fill === 'white' || fill === 'black'
      const toned = now.pressedPaint === 'tone' && !plain ? (paints.down.get(fill) ?? rest) : null
      const paint = by
        ? rest.clone().lerp(toned ?? paints.hand[by.side], Math.min(1, press * 1.5))
        : held
          ? (paints.down.get(fill) ?? rest)
          : rest
      keyboard.set(key, press, paint)
      if (press === 0 && plain && !held) {
        painted.delete(key)
        keyPress.delete(key)
      } else {
        painted.set(key, paint)
        keyPress.set(key, press)
      }
    }
    keyboard.commit()
    // The camera: over the music's range, or following the hands it shows whole.
    const handsX =
      centres.length === 0 ? framing.x : centres.reduce((sum, x) => sum + x, 0) / centres.length
    const toX = followed(framing, handsX)
    cameraX = approach(cameraX, toX, eased(dt, EASE.camera))
    if (cameraX !== toX) moving = true
    camera.position.set(cameraX, framing.y, framing.z)
    aim()
    renderer.render(scene, camera)
    events.onDrawn?.((key, black) => {
      const at = new Vector3(keyX(key), black ? KEY.blackHeight : 0, -KEY.length).project(camera)
      return [(at.x + 1) / 2, (1 - at.y) / 2]
    })
    return !moving
  }

  const loop = (time: number) => {
    frameId = 0
    if (disposed) return
    const dt = last === 0 ? 1 / 60 : Math.min(0.1, (time - last) / 1000)
    last = time
    const settled = step(dt)
    if (!settled || now.playing) frameId = requestAnimationFrame(loop)
    else last = 0
  }
  const wake = () => {
    if (frameId === 0 && !disposed) frameId = requestAnimationFrame(loop)
  }

  // The theme's paints, read again when it changes; the keys it marked are painted again next frame.
  const repaint = () => {
    paints = readPaints(canvas.parentElement ?? document.body)
    keyboard.paint(paints.piano)
    wake()
  }
  keyboard.paint(paints.piano)
  const theme = new MutationObserver(repaint)
  theme.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'class'],
  })
  const dark = window.matchMedia('(prefers-color-scheme: dark)')
  dark.addEventListener('change', repaint)

  const lost = (event: Event) => {
    event.preventDefault()
    events.onFailed()
  }
  canvas.addEventListener('webglcontextlost', lost)

  Promise.all([loadHand('rh'), loadHand('lh')]).then(
    ([rh, lh]) => {
      if (disposed) return
      hands.rh = rh
      hands.lh = lh
      dress(rh)
      dress(lh)
      scene.add(rh.rig.root, lh.rig.root)
      events.onLoaded()
      wake()
    },
    () => {
      if (!disposed) events.onFailed()
    },
  )

  return {
    update: (next) => {
      const notesChanged = next.notes !== now.notes
      const rangeChanged =
        next.range?.low !== now.range?.low || next.range?.high !== now.range?.high
      now = next
      if (notesChanged) {
        part = choreograph(next.notes)
        apart = handsApart(part)
      }
      if (notesChanged || rangeChanged) framing = frame(size, next.range, apart)
      wake()
    },
    resize: (width, height) => {
      size = { width: Math.max(1, width), height: Math.max(1, height) }
      renderer.setSize(size.width, size.height, false)
      camera.aspect = size.width / size.height
      camera.updateProjectionMatrix()
      framing = frame(size, now.range, apart)
      wake()
    },
    dispose: () => {
      disposed = true
      if (frameId !== 0) cancelAnimationFrame(frameId)
      theme.disconnect()
      dark.removeEventListener('change', repaint)
      canvas.removeEventListener('webglcontextlost', lost)
      keyboard.dispose()
      for (const hand of [hands.rh, hands.lh]) {
        if (!hand) continue
        hand.rig.root.traverse((node) => {
          if (node instanceof Mesh) node.geometry.dispose()
        })
        hand.skin.dispose()
        hand.nail.dispose()
      }
      environment.dispose()
      pmrem.dispose()
      renderer.dispose()
    },
  }
}
