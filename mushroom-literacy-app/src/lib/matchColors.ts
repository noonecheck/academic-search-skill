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
  maxSamples = 64,
): Promise<ColorSample[]> {
  const canvas = document.createElement('canvas')
  const size = 96
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return []

  // Center-crop so lawn/sky background influences matching less.
  const sw = 'width' in source ? Number(source.width) : size
  const sh = 'height' in source ? Number(source.height) : size
  const side = Math.min(sw, sh) * 0.72
  const sx = (sw - side) / 2
  const sy = (sh - side) / 2
  ctx.drawImage(source as CanvasImageSource, sx, sy, side, side, 0, 0, size, size)

  const { data } = ctx.getImageData(0, 0, size, size)
  const buckets = new Map<string, { sample: ColorSample; weight: number }>()

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4
      const a = data[idx + 3]
      if (a < 180) continue
      const r = data[idx]
      const g = data[idx + 1]
      const b = data[idx + 2]
      const brightness = (r + g + b) / 3
      if (brightness > 245 || brightness < 12) continue
      const sample = rgbToHsl(r, g, b)
      // Downweight leafy greens that usually come from grass/trees.
      const leafy = sample.h >= 75 && sample.h <= 165 && sample.s > 18 && sample.l > 25 && sample.l < 75
      const satBoost = sample.s > 35 ? 2.2 : sample.s > 18 ? 1.3 : 0.7
      const weight = (leafy ? 0.25 : 1) * satBoost
      const key = `${Math.round(sample.h / 12)}_${Math.round(sample.s / 12)}_${Math.round(sample.l / 12)}`
      const prev = buckets.get(key)
      if (prev) prev.weight += weight
      else buckets.set(key, { sample, weight })
    }
  }

  return [...buckets.values()]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, maxSamples)
    .flatMap(({ sample, weight }) => {
      const copies = Math.max(1, Math.round(weight))
      return Array.from({ length: Math.min(copies, 4) }, () => sample)
    })
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
