import type { Mushroom } from '../data/mushrooms'

const tones: Record<Mushroom['svgTone'], { cap: string; spots?: string; stem: string; gills: string }> = {
  amber: { cap: '#B86B2E', stem: '#E8D2A8', gills: '#D9C19A' },
  ivory: { cap: '#F2E8D5', stem: '#E6DCC8', gills: '#D8CEB8' },
  crimson: { cap: '#C62828', spots: '#F7F2EA', stem: '#F0E6D2', gills: '#E8DCC4' },
  slate: { cap: '#6B7280', stem: '#D6D3D1', gills: '#A8A29E' },
  honey: { cap: '#D4A05A', stem: '#EFE0C4', gills: '#E2CFA8' },
  ink: { cap: '#2A1F1A', stem: '#3D2E28', gills: '#4A3830' },
}

type Props = {
  tone: Mushroom['svgTone']
  className?: string
  title?: string
}

export function MushroomArt({ tone, className, title }: Props) {
  const c = tones[tone]
  const isEar = tone === 'ink'
  const isShelf = tone === 'amber' && title?.includes('灵')

  if (isEar) {
    return (
      <svg viewBox="0 0 200 200" className={className} role="img" aria-label={title ?? '木耳插画'}>
        <ellipse cx="100" cy="110" rx="70" ry="42" fill={c.cap} opacity="0.95" />
        <ellipse cx="92" cy="98" rx="48" ry="28" fill="#3B2A24" />
        <ellipse cx="108" cy="118" rx="36" ry="18" fill="#1A120F" opacity="0.7" />
      </svg>
    )
  }

  if (isShelf) {
    return (
      <svg viewBox="0 0 200 200" className={className} role="img" aria-label={title ?? '灵芝插画'}>
        <path
          d="M40 130 C50 70, 150 55, 170 110 C145 145, 70 150, 40 130 Z"
          fill={c.cap}
        />
        <path d="M95 125 L108 168 L92 168 Z" fill={c.stem} />
        <ellipse cx="120" cy="95" rx="28" ry="16" fill="#E0A45A" opacity="0.55" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={title ?? '蘑菇插画'}>
      <ellipse cx="100" cy="168" rx="42" ry="8" fill="rgba(26,46,40,0.12)" />
      <rect x="88" y="108" width="24" height="55" rx="10" fill={c.stem} />
      <path
        d="M30 108 C30 58, 170 58, 170 108 C140 118, 60 118, 30 108 Z"
        fill={c.cap}
      />
      <path d="M40 108 C70 98, 130 98, 160 108" fill="none" stroke={c.gills} strokeWidth="3" />
      {c.spots
        ? [ [70, 78], [100, 68], [130, 82], [88, 92], [118, 90] ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 2 ? 7 : 5} fill={c.spots} />
          ))
        : null}
    </svg>
  )
}
