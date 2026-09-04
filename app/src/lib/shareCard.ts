import { positionLabel } from '../hooks/usePlayer'
import { ATTRIBUTE_CODES, ATTRIBUTE_ORDER } from './attributes'
import type { AttributeKey, PlayerProfile } from '../types'

// Partilha por imagem (Modo Amigos fase 1, escolha do Nicolas: "imagem bonita
// para mandar pelo WhatsApp, Snapchat, Instagram"). Formato story 9:16 —
// é assim que os amigos dele vivem. Sem contas, sem backend (ADR-0004).

export interface ShareCardData {
  player: PlayerProfile
  rating: number
  title: string
  values: Record<AttributeKey, number>
  streak: number
  medals: { name: string; level: number }[]
  /** faixa extra de recorde (ex.: "NOVO RECORDE · 45 toques — Juggling Pé Fraco") */
  record?: { value: number; unit: string; drillName: string }
  lang?: 'pt' | 'en'
}

const W = 1080
const H = 1920

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export async function generateShareImage(data: ShareCardData): Promise<Blob> {
  // garantir que a Anton está disponível no canvas (já carregada via Google Fonts)
  try {
    await document.fonts.load('120px Anton')
    await document.fonts.load('700 40px Barlow')
  } catch {
    // segue com as fontes de recurso
  }
  const anton = "Anton, 'Arial Narrow', sans-serif"
  const barlow = 'Barlow, Arial, sans-serif'

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  // fundo: relva à noite com holofote
  const bg = ctx.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, '#0C1712')
  bg.addColorStop(1, '#0A130F')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)
  const glow = ctx.createRadialGradient(W / 2, -100, 50, W / 2, -100, 1100)
  glow.addColorStop(0, 'rgba(18,48,31,.95)')
  glow.addColorStop(1, 'rgba(18,48,31,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, H)

  // círculo central de giz
  ctx.strokeStyle = 'rgba(244,251,246,.14)'
  ctx.lineWidth = 4
  ctx.setLineDash([10, 24])
  ctx.beginPath()
  ctx.arc(W / 2, 0, 420, 0, Math.PI * 2)
  ctx.stroke()
  ctx.setLineDash([])

  const lang = data.lang ?? 'pt'
  const tr = (pt: string, en: string) => (lang === 'en' ? en : pt)

  // cabeçalho
  ctx.textAlign = 'center'
  ctx.fillStyle = '#8AA79A'
  ctx.font = `700 34px ${barlow}`
  ctx.fillText(tr('O   M E U   C A R T Ã O', 'M Y   P L A Y E R   C A R D'), W / 2, 200)

  // faixa de recorde (opcional)
  let cardTop = 300
  if (data.record) {
    roundRect(ctx, 90, 250, W - 180, 170, 28)
    ctx.fillStyle = 'rgba(234,179,8,.16)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(234,179,8,.55)'
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.fillStyle = '#F6CE55'
    ctx.font = `44px ${anton}`
    ctx.fillText(
      `${tr('NOVO RECORDE', 'NEW RECORD')} · ${data.record.value} ${data.record.unit.toUpperCase()}`,
      W / 2,
      325,
    )
    ctx.fillStyle = '#D8ECE0'
    ctx.font = `700 30px ${barlow}`
    ctx.fillText(data.record.drillName, W / 2, 385)
    cardTop = 480
  }

  // cartão dourado
  const cardX = 90
  const cardW = W - 180
  const cardH = 900
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,.6)'
  ctx.shadowBlur = 60
  ctx.shadowOffsetY = 24
  roundRect(ctx, cardX, cardTop, cardW, cardH, 44)
  const gold = ctx.createLinearGradient(cardX, cardTop, cardX + cardW, cardTop + cardH)
  gold.addColorStop(0, '#F6CE55')
  gold.addColorStop(0.4, '#EAB308')
  gold.addColorStop(1, '#D97706')
  ctx.fillStyle = gold
  ctx.fill()
  ctx.restore()

  // brilho diagonal
  ctx.save()
  roundRect(ctx, cardX, cardTop, cardW, cardH, 44)
  ctx.clip()
  const shine = ctx.createLinearGradient(cardX, cardTop, cardX + 500, cardTop + 700)
  shine.addColorStop(0, 'rgba(255,255,255,.34)')
  shine.addColorStop(0.55, 'rgba(255,255,255,0)')
  ctx.fillStyle = shine
  ctx.fillRect(cardX, cardTop, cardW, cardH)
  ctx.restore()

  const ink = '#3A2C05'
  // rating + posição
  ctx.textAlign = 'left'
  ctx.fillStyle = ink
  ctx.font = `170px ${anton}`
  ctx.fillText(String(data.rating), cardX + 60, cardTop + 200)
  ctx.font = `52px ${anton}`
  ctx.fillText(
    `${data.player.position} · ${positionLabel(data.player.position, lang).toUpperCase()}`,
    cardX + 60,
    cardTop + 275,
  )

  // título
  ctx.textAlign = 'right'
  const chipW = ctx.measureText(data.title.toUpperCase()).width
  roundRect(ctx, cardX + cardW - 60 - chipW - 200, cardTop + 70, chipW + 200, 76, 38)
  ctx.fillStyle = 'rgba(58,44,5,.85)'
  ctx.fill()
  ctx.fillStyle = '#F6CE55'
  ctx.font = `40px ${anton}`
  ctx.fillText(data.title.toUpperCase(), cardX + cardW - 130, cardTop + 122)

  // nome
  ctx.textAlign = 'left'
  ctx.strokeStyle = 'rgba(58,44,5,.3)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(cardX + 60, cardTop + 320)
  ctx.lineTo(cardX + cardW - 60, cardTop + 320)
  ctx.stroke()
  ctx.fillStyle = ink
  ctx.font = `64px ${anton}`
  ctx.fillText(data.player.name.toUpperCase(), cardX + 60, cardTop + 400)

  // atributos 3×3
  const colW = (cardW - 120 - 60) / 3
  ATTRIBUTE_ORDER.forEach((k, i) => {
    const col = i % 3
    const row = Math.floor(i / 3)
    const x = cardX + 60 + col * (colW + 30)
    const y = cardTop + 470 + row * 110
    ctx.fillStyle = ink
    ctx.font = `700 32px ${barlow}`
    ctx.textAlign = 'left'
    ctx.fillText(ATTRIBUTE_CODES[k], x, y)
    ctx.textAlign = 'right'
    ctx.fillText(String(data.values[k]), x + colW, y)
    ctx.textAlign = 'left'
    roundRect(ctx, x, y + 16, colW, 12, 6)
    ctx.fillStyle = 'rgba(58,44,5,.2)'
    ctx.fill()
    roundRect(ctx, x, y + 16, Math.max(10, colW * (data.values[k] / 99)), 12, 6)
    ctx.fillStyle = ink
    ctx.fill()
  })

  // medalhas
  if (data.medals.length > 0) {
    let mx = cardX + 60
    const my = cardTop + cardH - 90
    ctx.font = `700 30px ${barlow}`
    for (const m of data.medals) {
      const label = `🥇 ${m.name.toUpperCase()} · ${tr('NÍVEL', 'LEVEL')} ${m.level}`
      const w = ctx.measureText(label).width + 60
      roundRect(ctx, mx, my - 46, w, 66, 33)
      ctx.fillStyle = 'rgba(58,44,5,.85)'
      ctx.fill()
      ctx.fillStyle = '#F6CE55'
      ctx.fillText(label, mx + 30, my)
      mx += w + 20
    }
  }

  // streak + rodapé
  ctx.textAlign = 'center'
  ctx.fillStyle = '#FB923C'
  ctx.font = `86px ${anton}`
  ctx.fillText(
    lang === 'en'
      ? `🔥 ${data.streak}-DAY STREAK`
      : `🔥 ${data.streak} ${data.streak === 1 ? 'DIA' : 'DIAS'} DE STREAK`,
    W / 2,
    cardTop + cardH + 150,
  )
  ctx.fillStyle = '#8AA79A'
  ctx.font = `700 32px ${barlow}`
  ctx.fillText(
    tr('Treinado na vida real · construído no jogo', 'Trained in real life · built in the game'),
    W / 2,
    H - 160,
  )
  ctx.fillStyle = '#22C55E'
  ctx.font = `44px ${anton}`
  ctx.fillText('TREINO DO NICOLAS', W / 2, H - 95)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('canvas vazio'))), 'image/png')
  })
}

// ---- imagem de destaque genérica (conquista / progresso / exercício-desafio) ----
export interface HighlightData {
  eyebrow: string // "DESBLOQUEEI" · "O MEU PROGRESSO" · "CONSEGUES FAZER ISTO?"
  big: string // título da conquista / nome do exercício / número grande
  sub?: string // descrição / detalhe
  footerName: string // linha do jogador
  accent: string
  lang?: 'pt' | 'en'
  /** linhas extra centradas (ex.: passos do exercício) */
  lines?: string[]
  /** link visível em baixo (ex.: "joga em nicoappp.netlify.app") */
  footerUrl?: string
}

export async function generateHighlightImage(data: HighlightData): Promise<Blob> {
  try {
    await document.fonts.load('120px Anton')
    await document.fonts.load('700 40px Barlow')
  } catch {
    /* fontes de recurso */
  }
  const anton = "Anton, 'Arial Narrow', sans-serif"
  const barlow = 'Barlow, Arial, sans-serif'
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  const bg = ctx.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, '#0C1712')
  bg.addColorStop(1, '#0A130F')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)
  const glow = ctx.createRadialGradient(W / 2, H * 0.32, 60, W / 2, H * 0.32, 900)
  glow.addColorStop(0, `${data.accent}2E`)
  glow.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, H)

  // círculo de giz
  ctx.strokeStyle = 'rgba(244,251,236,.14)'
  ctx.lineWidth = 4
  ctx.setLineDash([10, 24])
  ctx.beginPath()
  ctx.arc(W / 2, 0, 420, 0, Math.PI * 2)
  ctx.stroke()
  ctx.setLineDash([])

  ctx.textAlign = 'center'
  // eyebrow
  ctx.fillStyle = '#8AA79A'
  ctx.font = `700 40px ${barlow}`
  ctx.fillText(data.eyebrow.toUpperCase(), W / 2, 360)

  // medalhão grande com o acento
  const cy = 720
  ctx.beginPath()
  ctx.arc(W / 2, cy, 210, 0, Math.PI * 2)
  const badge = ctx.createLinearGradient(W / 2 - 210, cy - 210, W / 2 + 210, cy + 210)
  badge.addColorStop(0, data.accent)
  badge.addColorStop(1, `${data.accent}bb`)
  ctx.fillStyle = badge
  ctx.shadowColor = `${data.accent}88`
  ctx.shadowBlur = 80
  ctx.fill()
  ctx.shadowBlur = 0
  // marca de visto/estrela simples no centro do medalhão
  ctx.strokeStyle = '#0C1712'
  ctx.lineWidth = 22
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(W / 2 - 70, cy)
  ctx.lineTo(W / 2 - 15, cy + 55)
  ctx.lineTo(W / 2 + 80, cy - 55)
  ctx.stroke()

  // título grande
  ctx.fillStyle = '#F4FBF6'
  ctx.font = `92px ${anton}`
  wrapText(ctx, data.big.toUpperCase(), W / 2, 1080, W - 160, 96)

  // subtítulo
  if (data.sub) {
    ctx.fillStyle = '#D8ECE0'
    ctx.font = `700 40px ${barlow}`
    wrapText(ctx, data.sub, W / 2, 1230, W - 220, 52)
  }

  // linhas extra (passos)
  if (data.lines?.length) {
    ctx.fillStyle = '#8AA79A'
    ctx.font = `600 34px ${barlow}`
    data.lines.slice(0, 3).forEach((line, i) => {
      ctx.fillText(`${i + 1}. ${line}`, W / 2, 1420 + i * 60)
    })
  }

  // rodapé com nome + marca
  ctx.fillStyle = '#8AA79A'
  ctx.font = `700 34px ${barlow}`
  ctx.fillText(data.footerName, W / 2, H - 160)
  ctx.fillStyle = '#22C55E'
  ctx.font = `46px ${anton}`
  ctx.fillText('TREINO DO NICOLAS', W / 2, data.footerUrl ? H - 105 : H - 95)
  if (data.footerUrl) {
    ctx.fillStyle = '#8AA79A'
    ctx.font = `600 30px ${barlow}`
    ctx.fillText(data.footerUrl, W / 2, H - 55)
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('canvas vazio'))), 'image/png')
  })
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(' ')
  let line = ''
  const lines: string[] = []
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  const startY = y - ((lines.length - 1) * lineHeight) / 2
  lines.forEach((l, i) => ctx.fillText(l, x, startY + i * lineHeight))
}

/**
 * Partilha nativa do telemóvel: imagem + (opcional) texto e link. Sem suporte a
 * partilha, copia o link e descarrega a imagem.
 */
export async function shareImage(
  blob: Blob,
  filename: string,
  extra?: { text?: string; url?: string },
) {
  const file = new File([blob], filename, { type: 'image/png' })
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean }

  // 1) tentar partilhar imagem + texto + link juntos
  const full: ShareData = { files: [file] }
  if (extra?.text) full.text = extra.text
  if (extra?.url) full.url = extra.url
  if (nav.share && nav.canShare?.(full)) {
    try {
      await nav.share(full)
      return
    } catch {
      /* cancelado — segue */
    }
  }
  // 2) alguns alvos não aceitam ficheiro + texto: partilhar só a imagem
  if (nav.share && nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file] })
      return
    } catch {
      /* cancelado — segue */
    }
  }
  // 3) sem partilha de ficheiros: partilhar o link, ou copiá-lo, + descarregar a imagem
  if (extra?.url && nav.share) {
    try {
      await nav.share({ text: extra.text, url: extra.url })
    } catch {
      /* segue */
    }
  } else if (extra?.url) {
    try {
      await navigator.clipboard?.writeText(extra.url)
    } catch {
      /* segue */
    }
  }
  const objUrl = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = objUrl
  a.download = filename
  a.click()
  URL.revokeObjectURL(objUrl)
}
