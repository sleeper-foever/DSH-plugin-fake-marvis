import { useId, type CSSProperties } from 'react'
import { PixelFirefly } from './PixelFirefly.tsx'
import { PixelCompanion, type CompanionKind } from './PixelCompanions.tsx'
import { StarRailScreen } from './StarRailScreen.tsx'

type Mode = 'idle' | 'working' | 'waiting' | 'error'

function Fan({ y }: { y: number }) {
  return <g transform={`translate(87 ${y})`}>
    <circle r="6" fill="#090d18" stroke="var(--ff-workstation-accent)" strokeWidth="1" />
    <g className="ff-pc-rotor" fill="var(--ff-workstation-accent)" opacity=".6">
      <path d="M0-1 0-5 3-3 2 0ZM1 0 5 0 3 3 0 2ZM0 1 0 5-3 3-2 0ZM-1 0-5 0-3-3 0-2Z" />
    </g><circle r="1.2" fill="#cfe9f5" />
  </g>
}

function Desk({ x, y, character, index }: { x: number; y: number; character: 'firefly' | CompanionKind; index: number }) {
  const accent = character === 'silver-wolf' ? '#aa83ff' : character === 'firefly' ? '#91edb1' : '#6baeff'
  return <g transform={`translate(${x} ${y})`} data-worker={index} style={{ '--ff-worker-delay': (index * .26) + 's', '--ff-workstation-accent': accent } as CSSProperties}>
    <ellipse className="ff-desk-aura" cx="47" cy="87" rx="46" ry="10" fill={accent} opacity=".07" />
    <path d="M17 48h8l-3 34H12v-4h5M81 48h7v33h8v4H80V51" fill="#263147" />
    <path d="M11 40h83l5 4v8H7v-8Z" fill="#172035" stroke="#3c4862" strokeWidth="1" />
    <path className="ff-desk-led" d="M8 48h87" stroke={accent} strokeWidth="1.5" />
    <path d="M13 42h70v3H13" fill="#283149" />
    <path d="M77 54h21v30H77Z" fill="#0b101e" stroke="#34425e" />
    <Fan y={62} /><Fan y={76} />
    <path d="M54 9h44v30H54z" fill="#101627" stroke="#485779" />
    <StarRailScreen />
    <path d="M72 39h6v4h-6M65 43h20v2H65" fill="#54607c" />
    <path d="M54 44h23v3H54" fill="#13172b" /><path className="ff-keyboard-led" d="M55 45h5m2 0h5m2 0h6" stroke={accent} strokeWidth="1" />
    <path d="M90 32h6v8h-6M96 33h2v4h-2" fill="#283550" /><path d="M91 33h4" stroke={accent} />
    <path d="M15 35h14v4H15" fill="#483955" /><path d="M17 32h14v3H17" fill="#74678b" />
    <path d="M22 50h17l5 6v18H20V57Z" fill="#1d283e" stroke="#415373" />
    <path d="M24 52h11v3H24M23 66h14" stroke={accent} opacity=".7" />
    <path d="M23 74h22v5H23M32 79h5v8h-5M22 87h27" stroke="#62708b" strokeWidth="2" />
    <g transform="translate(4 2) scale(.88)">{character === 'firefly' ? <PixelFirefly pose="reading" /> : <PixelCompanion kind={character} />}</g>
  </g>
}

/** Ambient gaming-room illustration, still driven by one assistant's actual activity state. */
export function StudioScene({ mode, label }: { mode: Mode; label: string }) {
  const id = useId()
  return <div data-firefly-studio data-scene-theme="neon-gaming" data-mode={mode} role="img" aria-label={label}>
    <svg viewBox="0 0 440 204" fill="none" aria-hidden="true" shapeRendering="crispEdges">
      <defs>
        <linearGradient id={id + '-wall'} x2="1" y2="1"><stop stopColor="#0b101e" /><stop offset=".5" stopColor="#211c39" /><stop offset="1" stopColor="#121b2e" /></linearGradient>
        <linearGradient id={id + '-window'} x2="0" y2="1"><stop stopColor="#111830" /><stop offset="1" stopColor="#293458" /></linearGradient>
        <linearGradient id={id + '-rgb'}><stop stopColor="#8058ca" /><stop offset=".4" stopColor="#638bff" /><stop offset=".8" stopColor="#6de8c3" /><stop offset="1" stopColor="#9defad" /></linearGradient>
        <radialGradient id={id + '-pool'}><stop stopColor="#6446a3" stopOpacity=".35" /><stop offset="1" stopColor="#1a152b" stopOpacity="0" /></radialGradient>
      </defs>
      <path data-room-glass="base" d="M0 0h440v204H0Z" fill="#0a1020" fillOpacity=".16" />
      <path data-room-glass="wall" d="M0 0h440v103H0Z" fill={`url(#${id}-wall)`} fillOpacity=".52" />
      <path data-room-glass="floor" d="M0 103h440v101H0Z" fill="#101628" fillOpacity=".4" />
      <ellipse cx="228" cy="150" rx="220" ry="65" fill={`url(#${id}-pool)`} />
      <path d="M0 128h440M0 160h440M0 196h440M55 103 9 204M130 103 103 204M210 103 206 204M295 103 322 204M378 103 430 204" stroke="#26314c" />
      <path className="ff-room-traces" d="M0 102h84l16 16h42M440 101H331l-16 16h-43M15 193h79l17-17h31M428 191h-71l-13-13h-53" stroke={`url(#${id}-rgb)`} strokeWidth="1" opacity=".7" />
      <path d="M9 12h135l11-7h121l13 7h143M11 12v73M429 12v67" stroke="#3b3557" strokeWidth="2" />
      <path className="ff-room-pulse" d="M13 14h105M309 14h112" stroke={`url(#${id}-rgb)`} strokeWidth="2" />
      <path d="M30 25h121v52H30Z" fill="#090f21" stroke="#53618d" />
      <path d="M34 29h113v44H34Z" fill={`url(#${id}-window)`} />
      <path d="M36 70V58h10V48h12v22M61 70V43h14v27M80 70V54h13v16M99 70V39h13v31M116 70V48h13v22M134 70V55h11v15" fill="#141d36" />
      <path className="ff-city-lights" d="M49 53h3m-3 5h3M65 47h6m-6 5h6m-6 5h6M103 44h5m-5 6h5m-5 6h5M120 53h5m-5 5h5M137 61h4" stroke="#7f8ddb" strokeWidth="1" />
      <path d="M88 29v44M34 73h113" stroke="#3d4e75" strokeWidth="2" />
      <path className="ff-city-traffic" d="M38 66h17M114 61h15" stroke="#67bde1" strokeWidth="1" />
      <path d="M173 20h95v27h-95Z" fill="#10172b" stroke="#41385f" />
      <path className="ff-room-pulse" d="M182 40h77" stroke="#9cedae" opacity=".6" />
      <text x="220" y="35" textAnchor="middle" fontFamily="monospace" fontSize="10" letterSpacing="2" fill="#aedec9">FIREFLY</text>
      <path d="M304 27h36v29h-36Z" fill="#281a34" stroke="#755d87" />
      <path d="M313 34h17l-9 14-8-14Z" stroke="#a488d8" /><path d="M321 33v15" stroke="#c3aaeb" />
      <path d="M351 27h34v29h-34Z" fill="#311926" stroke="#6b3b54" />
      <path d="M357 46 364 33l5 13 10-13" stroke="#ab6578" strokeWidth="2" />
      <path d="M301 65h86v5h-86" fill="#252942" /><path d="M305 66h76" stroke="#7562b2" />
      <path d="M313 60v-9h6v9M325 60V49h8v11M340 60v-7h5v7" fill="#4f4971" />
      <path d="M10 111h13v52H10Z" fill="#14192a" stroke="#344258" />
      <path className="ff-server-status" d="M13 117h7m-7 8h7m-7 8h7m-7 8h7m-7 8h7" stroke="#7bd9ab" strokeWidth="2" />
      <path d="M410 98h22v66h-22Z" fill="#1c1525" stroke="#4b2840" />
      <path d="M414 104h14v16h-14M414 126h14v16h-14M414 148h14v10h-14" fill="#361b2d" />
      <path className="ff-server-status" d="M417 109h8m-8 6h5M417 132h8m-8 5h5M417 152h8" stroke="#9e4769" />
      <Desk x={30} y={86} character="silver-wolf" index={1} />
      <Desk x={164} y={62} character="firefly" index={2} />
      <Desk x={289} y={89} character="stelle" index={3} />
      <path d="M151 163h17v23h-17Z" fill="#192538" stroke="#365569" />
      <path className="ff-room-pulse" d="M156 168v12m6-12v12" stroke="#70dbb0" />
      <path d="M254 181h37v7h-37" fill="#172039" /><path d="M260 181h25" stroke="#655ca1" />
      <g className="ff-room-motes" fill="#83cdb7"><rect x="26" y="52" width="1" height="1" /><rect x="163" y="89" width="1" height="1" /><rect x="279" y="46" width="1" height="1" /><rect x="390" y="78" width="1" height="1" /></g>
    </svg>
  </div>
}
