import { useId } from 'react'

/** Local decorative miniature; no game connection, credentials or launch action. */
export function StarRailScreen() {
  const id = useId()
  return <svg data-monitor-screen="star-rail-login" x="56" y="13" width="37" height="23" viewBox="0 0 160 100" aria-hidden="true" shapeRendering="geometricPrecision" overflow="hidden">
    <defs>
      <linearGradient id={id + '-space'} x2="1" y2="1"><stop stopColor="#091328" /><stop offset=".55" stopColor="#293d72" /><stop offset="1" stopColor="#798bbe" /></linearGradient>
      <radialGradient id={id + '-glow'}><stop stopColor="#dddffa" stopOpacity=".85" /><stop offset="1" stopColor="#8b9bd3" stopOpacity="0" /></radialGradient>
      <linearGradient id={id + '-scan'} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#8bdfff" stopOpacity="0" /><stop offset=".5" stopColor="#baf7ff" stopOpacity=".2" /><stop offset="1" stopColor="#8bdfff" stopOpacity="0" /></linearGradient>
    </defs>
    <rect width="160" height="100" fill={`url(#${id}-space)`} />
    <ellipse className="ff-screen-nebula" cx="132" cy="62" rx="54" ry="40" fill={`url(#${id}-glow)`} />
    <g className="ff-screen-stars" fill="#edf3ff">
      <circle cx="14" cy="14" r=".8" /><circle cx="32" cy="26" r="1" /><circle cx="73" cy="11" r=".8" /><circle cx="139" cy="16" r="1.2" />
      <circle cx="151" cy="47" r=".8" /><circle cx="101" cy="16" r=".6" /><circle cx="23" cy="63" r=".8" /><circle cx="48" cy="8" r=".6" />
      <path d="M119 15v8m-4-4h8" stroke="#d9e5ff" strokeWidth=".8" />
    </g>
    <path d="M-8 91Q80 64 169 66M-8 96Q80 70 169 69" stroke="#dce6ff" strokeWidth="1.2" opacity=".55" />
    <g transform="translate(11 68) rotate(-8)"><g className="ff-screen-train">
      <path d="M0 0h83l13 6-13 6H0Z" fill="#131d34" stroke="#929ebc" strokeWidth=".7" />
      <path d="M5 2h12v5H5M22 2h12v5H22M39 2h12v5H39M56 2h12v5H56M73 2h9v5h-9" fill="#eadcb3" />
      <path d="M1 11h82" stroke="#bc9f71" /><path d="M91 6h8" stroke="#eff4ff" strokeWidth="2" />
    </g></g>
    <text x="78" y="35" textAnchor="middle" fill="#fff" fontFamily="'Noto Sans CJK SC','Microsoft YaHei',sans-serif" fontSize="13" fontWeight="700">崩坏</text>
    <path d="M30 39h33m28 0h32" stroke="#e5e9ff" strokeWidth=".8" />
    <text x="80" y="55" textAnchor="middle" fill="#fff" fontFamily="'Noto Sans CJK SC','Microsoft YaHei',sans-serif" fontSize="20" fontWeight="800" letterSpacing="1">星穹铁道</text>
    <rect className="ff-screen-scan" x="0" y="-12" width="160" height="12" fill={`url(#${id}-scan)`} />
    <g className="ff-screen-lines"><text x="80" y="93" textAnchor="middle" fill="#f7f5ed" fontFamily="sans-serif" fontSize="8">点击进入</text></g>
  </svg>
}
