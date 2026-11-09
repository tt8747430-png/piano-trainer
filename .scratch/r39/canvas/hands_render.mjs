import { readFileSync, writeFileSync } from 'node:fs'
import { chromium } from 'playwright'
const ROOT = '/home/user/piano-trainer/'
const [side, out, rot = '0'] = process.argv.slice(2)
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
const page = await browser.newPage({ viewport: { width: 520, height: 520 }, deviceScaleFactor: 1 })
page.on('pageerror', (e) => console.log('PAGEERROR', e.message))
page.on('console', (m) => console.log('LOG', m.text().slice(0, 400)))
await page.route('http://h.local/**', (route) => {
  const u = new URL(route.request().url())
  if (u.pathname === '/') return route.fulfill({ contentType: 'text/html', body: `<body style="margin:0;background:transparent"><canvas id=c width=520 height=520></canvas><script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script><script type="module">
import * as THREE from 'three'; import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const r = new THREE.WebGLRenderer({ canvas: document.getElementById('c'), alpha: true, antialias: true, preserveDrawingBuffer: true }); r.setClearColor(0, 0);
const scene = new THREE.Scene(); scene.add(new THREE.HemisphereLight(0xffffff, 0xb9a48c, 2.2)); const d = new THREE.DirectionalLight(0xffffff, 1.6); d.position.set(${rot === '180' ? -1 : 1}, 0.6, 0.3); scene.add(d);
new GLTFLoader().load('/src/widgets/piano-hands/assets/${side}.glb', (g) => { const o = g.scene; scene.add(o);
  o.traverse((m) => { if (m.isMesh) m.material = new THREE.MeshStandardMaterial({ color: 0xEBD5C1, roughness: 0.85, metalness: 0 }); });
  o.updateMatrixWorld(true); const box = new THREE.Box3().setFromObject(o); const c = box.getCenter(new THREE.Vector3()), s = box.getSize(new THREE.Vector3());
  const half = Math.max(s.y, s.z) * 0.54; const cam = new THREE.OrthographicCamera(-half, half, half, -half, 0.001, 10);
  cam.position.set(c.x + (${rot === '180' ? -1 : 1}), c.y, c.z); cam.up.set(0, -1, 0); cam.lookAt(c); cam.updateMatrixWorld(true);
  r.render(scene, cam);
  const names = []; const tips = {}; o.traverse((b) => { names.push(b.name); if (/tip$/.test(b.name) || /distal$/.test(b.name) || /proximal$/.test(b.name)) { const p = new THREE.Vector3().setFromMatrixPosition(b.matrixWorld).project(cam); tips[b.name] = [+(((p.x + 1) / 2) * 100).toFixed(2), +(((1 - p.y) / 2) * 100).toFixed(2)]; } });
  window.__out = { tips, size: [s.x, s.y, s.z], names: names.slice(0, 40) }; });
</script>` })
  try { return route.fulfill({ body: readFileSync(ROOT + u.pathname.slice(1)), contentType: u.pathname.endsWith('.js') ? 'text/javascript' : 'application/octet-stream' }) } catch { return route.fulfill({ status: 404, body: '' }) }
})
await page.goto('http://h.local/')
await page.waitForFunction('window.__out', null, { timeout: 20000 })
const data = await page.evaluate('window.__out'); writeFileSync(out + '.json', JSON.stringify(data))
await page.locator('#c').screenshot({ path: out + '.png', omitBackground: true })
console.log(JSON.stringify(data).slice(0, 900))
await browser.close()
