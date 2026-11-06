// A static server with the SPA fallback, reading files fresh on each request (a deploy swaps them).
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join } from 'node:path'
const [dir, port] = process.argv.slice(2)
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.wasm': 'application/wasm', '.m4a': 'audio/mp4', '.wav': 'audio/wav' }
createServer(async (req, res) => {
  let path = join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname))
  try { if ((await stat(path)).isDirectory()) path = join(path, 'index.html') } catch { path = join(dir, 'index.html') }
  try {
    const body = await readFile(path)
    res.writeHead(200, { 'content-type': TYPES[extname(path)] ?? 'application/octet-stream', 'cache-control': 'no-cache' })
    res.end(body)
  } catch { res.writeHead(404); res.end() }
}).listen(Number(port))
