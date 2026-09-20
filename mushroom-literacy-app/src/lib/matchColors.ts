import type { Mushroom } from '../data/mushrooms'
import { mushrooms } from '../data/mushrooms'

export type ColorSample = { h: number; s: number; l: number }

function rgbToHsl(r: number, g: number, b: number): ColorSample {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: l * 100 }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6
      break
    case g:
      h = ((b - r) / d + 2) / 6
      break
    default:
      h = ((r - g) / d + 4) / 6
  }
  return { h: h * 360, s: s * 100, l: l * 100 }
}

export async function sampleImageColors(
  source: HTMLImageElement | HTMLCanvasElement | ImageBitmap,
  maxSamples = 48,
): Promise<ColorSample[]> {
  const canvas = document.createElement('canvas')
  const size = 64
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return []
  ctx.drawImage(source as CanvasImageSource, 0, 0, size, size)
  const { data } = ctx.getImageData(0, 0, size, size)
  const samples: ColorSample[] = []
  const step = Math.max(4, Math.floor((size * size) / maxSamples))
  for (let i = 0; i < size * size; i += step) {
    const idx = i * 4
    const a = data[idx + 3]
    if (a < 180) continue
    const r = data[idx]
    const g = data[idx + 1]
    const b = data[idx + 2]
    // Skip near-white / near-black backgrounds
    const brightness = (r + g + b) / 3
    if (brightness > 245 || brightness < 12) continue
    samples.push(rgbToHsl(r, g, b))
  }
  return samples
}

function colorDistance(a: ColorSample, b: ColorSample) {
  const dh = Math.min(Math.abs(a.h - b.h), 360 - Math.abs(a.h - b.h)) / 180
  const ds = Math.abs(a.s - b.s) / 100
  const dl = Math.abs(a.l - b.l) / 100
  return dh * 0.5 + ds * 0.25 + dl * 0.25
}

function scoreAgainst(samples: ColorSample[], mushroom: Mushroom) {
  if (!samples.length) return 0
  let total = 0
  for (const sample of samples) {
    let best = Infinity
    for (const target of mushroom.colors) {
      best = Math.min(best, colorDistance(sample, target))
    }
    total += 1 - Math.min(1, best)
  }
  return total / samples.length
}

export type MatchResult = {
  mushroom: Mushroom
  score: number
}

export function matchMushrooms(samples: ColorSample[]): MatchResult[] {
  return mushrooms
    .map((mushroom) => ({
      mushroom,
      score: scoreAgainst(samples, mushroom),
    }))
    .sort((a, b) => b.score - a.score)
}
