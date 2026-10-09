import { useId } from 'react'

const xs = [0, 65, 143, 228, 318, 393, 464]
const ys = [0, 64, 145, 236, 338, 447, 551, 642, 720]
const mesh = ys.map((y, row) => xs.map((x, column) => ({
  x: column === 0 || column === xs.length - 1 ? x : x + ((row + column * 2) % 3 - 1) * 13,
  y: row === 0 || row === ys.length - 1 ? y : y + ((row * 3 + column) % 4 - 1.5) * 8,
})))
const facets = mesh.slice(0, -1).flatMap((row, r) => row.slice(0, -1).flatMap((a, c) => {
  const b = row[c + 1]!
  const d = mesh[r + 1]![c + 1]!
  const e = mesh[r + 1]![c]!
  return [[a, b, (r + c) % 2 ? e : d], [(r + c) % 2 ? b : a, d, e]]
}))

/** Decorative reflections are geometry, not a content filter; controls and text remain above them. */
export function CrystalFacets() {
  const id = useId()
  return <svg className="dshfa-crystal-facets" data-crystal-facets viewBox="0 0 464 720" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id={id + '-silver'} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#edfaff" stopOpacity=".38" /><stop offset=".42" stopColor="#b9cadd" stopOpacity=".03" /><stop offset="1" stopColor="#e4dfff" stopOpacity=".18" />
      </linearGradient>
      <linearGradient id={id + '-smoke'} x1="1" y1="0" x2="0" y2="1">
        <stop stopColor="#060c1c" stopOpacity=".36" /><stop offset="1" stopColor="#8196b8" stopOpacity=".05" />
      </linearGradient>
      <linearGradient id={id + '-cool'} x1="0" y1="1" x2="1" y2="0">
        <stop stopColor="#a6dfd5" stopOpacity=".23" /><stop offset=".6" stopColor="#a6b6e6" stopOpacity=".02" /><stop offset="1" stopColor="#fff5e6" stopOpacity=".22" />
      </linearGradient>
      <linearGradient id={id + '-edge-mask'}>
        <stop stopColor="#fff" /><stop offset=".14" stopColor="#b0b0b0" /><stop offset=".3" stopColor="#303030" />
        <stop offset=".7" stopColor="#303030" /><stop offset=".88" stopColor="#aaa" /><stop offset="1" stopColor="#fff" />
      </linearGradient>
      <linearGradient id={id + '-top-mask'} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fff" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
      <mask id={id + '-readable-center'} maskUnits="userSpaceOnUse" x="0" y="0" width="464" height="720">
        <rect width="464" height="720" fill={`url(#${id}-edge-mask)`} />
        <rect width="464" height="75" fill={`url(#${id}-top-mask)`} />
      </mask>
      <filter id={id + '-frost'} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency=".82" numOctaves="2" seed="17" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <linearGradient id={id + '-rim'} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f3fcff" stopOpacity=".45" /><stop offset=".42" stopColor="#c9e0ed" stopOpacity=".1" /><stop offset="1" stopColor="#071021" stopOpacity=".35" /></linearGradient>
    </defs>
    <g mask={`url(#${id}-readable-center)`}>
      {facets.map((points, index) => {
        const center = { x: points.reduce((sum, p) => sum + p.x, 0) / 3, y: points.reduce((sum, p) => sum + p.y, 0) / 3 }
        const inset = points.map(p => ({ x: p.x + (center.x - p.x) * .12, y: p.y + (center.y - p.y) * .12 }))
        const polygon = (vertices: typeof points) => vertices.map(p => p.x + ',' + p.y).join(' ')
        return <g key={index} data-crystal-cell>
          <polygon points={polygon(points)} fill="rgba(3,9,22,.25)" transform="translate(2 2.7)" />
          <polygon data-crystal-face points={polygon(inset)}
            fill={`url(#${id}-${['silver', 'smoke', 'cool', 'smoke', 'silver', 'smoke'][index % 6]})`} />
          {points.map((p, side) => {
            const q = points[(side + 1) % 3]!
            const length = Math.hypot(q.x - p.x, q.y - p.y)
            const light = (-(q.y - p.y) * .6 + (q.x - p.x) * .8) / length
            return <polygon key={side} data-crystal-bevel
              points={polygon([p, q, inset[(side + 1) % 3]!, inset[side]!])}
              fill={light > 0 ? 'rgba(225,247,255,' + (.14 + light * .32) + ')' : 'rgba(4,12,30,' + (.12 - light * .28) + ')'} />
          })}
          <polygon points={polygon(points)} fill="none" stroke="rgba(224,243,255,.11)" strokeWidth=".55" vectorEffect="non-scaling-stroke" />
        </g>
      })}
      <path d="M0 0 78 56 0 151M464 0 380 70 464 160M0 338 92 434 0 551M464 338 372 447 464 551M0 720 70 638 143 720M464 720 393 642 318 720"
        fill="none" stroke="rgba(235,251,255,.36)" strokeWidth=".8" vectorEffect="non-scaling-stroke" />
    </g>
    <rect data-crystal-frost width="464" height="720" fill="#fff" filter={`url(#${id}-frost)`} opacity=".095" />
    <rect x="2" y="2" width="460" height="716" rx="18" fill="none" stroke={`url(#${id}-rim)`} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
  </svg>
}
