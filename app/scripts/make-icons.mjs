// Gera os ícones PWA (PNG) sem dependências: nó "concluído" do caminho —
// círculo relva com visto escuro sobre fundo verde-noite (tokens do Design System).
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')
mkdirSync(OUT, { recursive: true })

// ---- PNG mínimo (RGBA 8-bit) ----
const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})
function crc32(buf) {
  let c = 0xffffffff
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}
function png(size, pixelAt) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // RGBA
  const raw = Buffer.alloc(size * (1 + size * 4))
  for (let y = 0; y < size; y++) {
    const row = y * (1 + size * 4)
    raw[row] = 0 // sem filtro
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = pixelAt(x, y)
      const o = row + 1 + x * 4
      raw[o] = r
      raw[o + 1] = g
      raw[o + 2] = b
      raw[o + 3] = a
    }
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// ---- desenho ----
const PITCH = [0x0c, 0x17, 0x12]
const GRASS = [0x22, 0xc5, 0x5e]
const INK = [0x05, 0x20, 0x12]

function distToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax
  const dy = by - ay
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
  const cx = ax + t * dx
  const cy = ay + t * dy
  return Math.hypot(px - cx, py - cy)
}
function mix(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ]
}
function coverage(dist, edge) {
  // anti-alias suave numa banda de 1.5px
  return Math.max(0, Math.min(1, 0.5 + (edge - dist) / 1.5))
}

function drawIcon(size) {
  const c = size / 2
  const R = size * 0.36
  const stroke = size * 0.055
  // visto: dois segmentos em coordenadas relativas
  const p1 = [size * 0.36, size * 0.52]
  const p2 = [size * 0.46, size * 0.63]
  const p3 = [size * 0.67, size * 0.39]
  return png(size, (x, y) => {
    let color = PITCH
    const dCircle = Math.hypot(x - c, y - c) - R
    const inCircle = coverage(dCircle + R, R) // dist ao centro vs raio
    if (inCircle > 0) color = mix(color, GRASS, inCircle)
    const dCheck = Math.min(
      distToSegment(x, y, p1[0], p1[1], p2[0], p2[1]),
      distToSegment(x, y, p2[0], p2[1], p3[0], p3[1]),
    )
    const inCheck = coverage(dCheck, stroke / 2) * inCircle
    if (inCheck > 0) color = mix(color, INK, inCheck)
    return [color[0], color[1], color[2], 255]
  })
}

for (const [name, size] of [
  ['icon-512.png', 512],
  ['icon-192.png', 192],
  ['apple-touch-icon.png', 180],
]) {
  writeFileSync(join(OUT, name), drawIcon(size))
  console.log(`✓ ${name}`)
}
