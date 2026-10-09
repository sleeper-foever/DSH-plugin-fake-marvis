import { useId } from 'react'

export function TransformDevice({ size = 80, className }: { size?: number; className?: string }) {
  const id = useId()
  const silver = `${id}-silver`
  const bevel = `${id}-bevel`
  const gold = `${id}-gold`
  const glass = `${id}-glass`
  const energy = `${id}-energy`

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 96 96"
      fill="none" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={silver} x1="32" y1="24" x2="62" y2="74" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset=".28" stopColor="#F0EEE1" />
          <stop offset=".48" stopColor="#A7BBC1" />
          <stop offset=".57" stopColor="#F7F9F2" />
          <stop offset="1" stopColor="#687E89" />
        </linearGradient>
        <linearGradient id={bevel} x1="30" y1="40" x2="65" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#536774" />
          <stop offset=".3" stopColor="#D8E6E4" />
          <stop offset=".55" stopColor="#FAF9EB" />
          <stop offset="1" stopColor="#465B69" />
        </linearGradient>
        <linearGradient id={gold} x1="36" y1="12" x2="58" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF0B1" />
          <stop offset=".3" stopColor="#D9B968" />
          <stop offset=".5" stopColor="#8D6831" />
          <stop offset=".66" stopColor="#F4D998" />
          <stop offset="1" stopColor="#B98D47" />
        </linearGradient>
        <linearGradient id={glass} x1="6" y1="21" x2="36" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E3FFF7" stopOpacity=".85" />
          <stop offset=".42" stopColor="#8CE9DD" stopOpacity=".48" />
          <stop offset="1" stopColor="#219C9B" stopOpacity=".16" />
        </linearGradient>
        <linearGradient id={energy} x1="44" y1="33" x2="53" y2="68" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E1FFFF" />
          <stop offset=".36" stopColor="#88FFF1" />
          <stop offset=".7" stopColor="#29D9D2" />
          <stop offset="1" stopColor="#087B8B" />
        </linearGradient>
      </defs>
      <g className="ff-device-wing">
        {[false, true].map(mirrored => (
          <g key={String(mirrored)} transform={mirrored ? 'translate(96 0) scale(-1 1)' : undefined}>
            <path d="M4 18 20 25 37 40 36 56 22 43Z" fill={`url(#${glass})`} stroke="#B9EFE7" strokeOpacity=".7" strokeWidth=".8" />
            <path d="M4 18 27 35 36 50 22 40Z" fill="#E2FFF7" fillOpacity=".18" />
            <path d="M8 23 26 37 34 51" stroke="#E0FFF8" strokeOpacity=".8" strokeWidth=".8" />
            <path d="M10 39 24 45 36 57 38 66 24 56Z" fill={`url(#${glass})`} stroke="#95DCD5" strokeOpacity=".55" strokeWidth=".7" />
            <path d="M13 42 27 51 36 62" stroke="#D2FFF1" strokeOpacity=".55" strokeWidth=".7" />
            <path d="M25 32 37 38 38 48 32 44Z" fill={`url(#${gold})`} />
            <path d="M26 33 35 39 35 43" stroke="#FFF0C0" strokeWidth=".8" />
          </g>
        ))}
      </g>
      <path d="M48 15 64 26 67 40 61 66 48 88 35 66 29 40 32 26Z" fill="#101F28" stroke="#52636A" strokeWidth="1" />
      <path d="M33 27 43 23 39 39 40 59 48 80 36 65 30 40Z" fill={`url(#${silver})`} />
      <path d="M63 27 53 23 57 39 56 59 48 80 60 65 66 40Z" fill={`url(#${silver})`} />
      <path d="M33 28 38 31 34 42 38 62 46 77 35 64 30 40Z" fill={`url(#${bevel})`} />
      <path d="M63 28 58 31 62 42 58 62 50 77 61 64 66 40Z" fill={`url(#${bevel})`} />
      <path d="M34 28 40 26 36 40 40 60M62 28 56 26 60 40 56 60" stroke="#FFFFF0" strokeOpacity=".85" strokeWidth=".9" />
      <path d="M31 14 44 21 48 10 52 21 65 14 61 29 54 34 48 26 42 34 35 29Z" fill={`url(#${gold})`} stroke="#96773D" strokeWidth=".7" />
      <path d="M31 14 38 23 44 25 48 10 44 21Z M65 14 58 23 52 25 48 10 52 21Z" fill="#FFF0B9" fillOpacity=".7" />
      <path d="M38 27 44 29 48 23 52 29 58 27 53 36 48 31 43 36Z" fill="#101B23" />
      <path d="M48 19 52 27 48 31 44 27Z" fill={`url(#${silver})`} />
      <path d="M48 30 56 45 53 62 48 73 43 62 40 45Z" fill="#030F17" stroke="#748C8D" strokeWidth=".8" />
      <g className="ff-device-core">
        <path d="M48 33 53 46 51 60 48 69 45 60 43 46Z" fill={`url(#${energy})`} />
        <path d="M48 33 48 66 45 57 43 46Z" fill="#BBFFF5" fillOpacity=".65" />
        <path d="M48 33 53 46 48 51Z" fill="#F0FFFC" fillOpacity=".8" />
        <path d="M48 37 48 62" stroke="#E6FFFC" strokeWidth=".8" strokeOpacity=".9" />
      </g>
      <path d="M36 47 40 51 43 65 40 62Z M60 47 56 51 53 65 56 62Z" fill={`url(#${gold})`} />
      <path d="M39 66 48 76 57 66 48 87Z" fill={`url(#${silver})`} />
      <path d="M48 76 48 87 57 66Z" fill="#526A75" fillOpacity=".6" />
      <path d="M42 71 48 77 54 71" stroke="#FFF0C0" strokeWidth="1" />
      <path d="M48 78 48 84" stroke="#EDF8EE" strokeWidth=".8" />
    </svg>
  )
}
