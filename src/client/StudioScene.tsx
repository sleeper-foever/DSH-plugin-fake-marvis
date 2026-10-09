import type { CSSProperties } from 'react'

type Mode = 'idle' | 'working' | 'waiting' | 'error'

function Plant({ x, y, small = false }: { x: number; y: number; small?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${small ? .6 : 1})`}>
    <path d="M-2 0V-20h4V0M-2-12h-9v-6h-5v-7h9v7h5M2-18h9v-6h6v-7H8v7H2" fill="#688e76" />
    <path d="M-2-24v-12h6v12M-8-19h-6v-4h6M10-24v-5h5v5" fill="#98bfa0" />
    <path d="M-11 0h22v6H8v12H-8V6h-3" fill="#c99e83" /><path d="M-7 3H7v12H-7" fill="#e3b89a" />
  </g>
}

function Desk({ x, y, hair, shirt, index }: { x: number; y: number; hair: string; shirt: string; index: number }) {
  return <g transform={`translate(${x} ${y})`} data-worker={index} style={{ '--ff-worker-delay': (index * .26) + 's' } as CSSProperties}>
    <ellipse cx="44" cy="90" rx="43" ry="7" fill="#8ca59a" opacity=".16" />
    <path d="M16 47h14v39H16M79 47h7v39h-7" fill="#a18068" />
    <path d="M9 41h87v10H9z" fill="#c09e7d" /><path d="M9 41h87v4H9z" fill="#e1c5a1" />
    <path d="M58 14h29v23H58z" fill="#566c66" /><path d="M61 17h23v16H61z" fill="#aad4c4" />
    <path d="M69 37h6v5h-6M66 41h12v2H66" fill="#647d73" />
    <g className="ff-screen-lines" fill="#f0fff5"><path d="M64 21h12v2H64M64 25h17v2H64M64 29h8v2H64" /></g>
    <path d="M57 44h21v3H57" fill="#f0e9d9" />
    <path d="M88 34h6v7h-6M94 35h3v4h-3" fill="#f7ead3" /><path d="M88 34h6v2h-6" fill="#a9896e" />
    <path d="M13 35h15v3H13" fill="#aeabc6" /><path d="M15 32h15v3H15" fill="#ede2c5" />
    <path d="M23 67h27v12H23M33 79h6v8h-6M24 87h25v3H24" fill="#718a81" />
    <path d="M26 76h7v12h-7M43 76h7v12h-7" fill="#586b68" /><path d="M23 86h12v5H23M43 86h11v5H43" fill="#3d5351" />
    <g className="ff-worker-body">
      <path d="M24 42h23v5h5v22H20V49h4" fill={shirt} />
      <path d="M25 45h6v21h-6" fill="#fff" opacity=".2" />
      <g className="ff-worker-arms"><path d="M45 49h8v5h10v5H49v-4h-4" fill={shirt} /><path d="M59 51h7v6h-7" fill="#eac7ad" /><path d="M24 51h-6v9h6v-4h7v-5" fill={shirt} /><path d="M28 50h6v6h-6" fill="#efcfb5" /></g>
      <g className="ff-worker-head">
        <path d="M23 15h21v4h5v20h-5v7H25v-4h-7V22h5" fill={hair} />
        <path d="M30 25h17v13h-4v5H30z" fill="#efcdb2" />
        <path d="M43 27h3v4h-3M43 35h4v2h-4" fill="#4c554d" />
        <path d="M23 16h20v8H31v5h-8v10h-5V22h5" fill={hair} />
        <path d="M24 16h16v3H24M21 22h3v11h-3" fill="#fff" opacity=".24" />
        <rect x="30" y="39" width="7" height="6" fill="#e2b99b" />
      </g>
    </g>
    <path d="M18 60h21v15H18z" fill="#88a498" /><path d="M21 59h15v3H21z" fill="#a2b9ac" />
  </g>
}

/** Decorative coworkers visualize a single assistant; no simulated task counts or agent identities. */
export function StudioScene({ mode, label }: { mode: Mode; label: string }) {
  return <div data-firefly-studio data-mode={mode} role="img" aria-label={label}>
    <svg viewBox="0 0 440 204" fill="none" aria-hidden="true" shapeRendering="crispEdges">
      <path d="M0 0h440v204H0z" fill="#e8ede1" />
      <path d="M0 0h440v97H0z" fill="#e4eadb" /><path d="M0 97h440v107H0z" fill="#d9dfd0" />
      <path d="M0 97h440v5H0" fill="#bccabc" />
      <path d="M0 137h440M0 173h440M75 102v35M231 102v35M380 102v35M8 137v36M157 137v36M312 137v36M80 173v31M231 173v31M383 173v31" stroke="#c4cfc0" strokeWidth="1" />
      <path d="M38 13h113v65H38z" fill="#a4bcb0" /><path d="M42 17h105v57H42z" fill="#c5ded2" />
      <path d="M48 67V49h15V34h14v33M116 67V40h17v27" fill="#a3c5b5" /><path d="M76 67V42h23v25M99 67V55h14v12" fill="#b2d0bd" />
      <path d="M94 17v57M42 44h105" stroke="#eef3e7" strokeWidth="4" /><path d="M33 77h123v6H33z" fill="#abbcaf" />
      <path d="M185 27h46v33h-46z" fill="#b6a68f" /><path d="M189 31h38v25h-38z" fill="#f2edde" />
      <path d="M199 49v-7h6v7h5V37h6v12h5v3h-26v-3" fill="#a3b99c" />
      <path d="M288 36h97v5h-97zM299 57h74v5h-74z" fill="#b7a183" />
      <path d="M298 20h6v16h-6M306 18h7v18h-7M315 23h5v13h-5" fill="#87a896" /><path d="M322 18h7v18h-7M331 21h6v15h-6" fill="#c8a391" />
      <path d="M315 49h24v8h-24z" fill="#b6acc4" /><path d="M317 46h20v3h-20" fill="#e3d6bb" />
      <Plant x={365} y={28} small />
      <path d="M248 8h22v22h-22z" fill="#f4f0df" /><path d="M250 10h18v18h-18z" fill="#d4ddc9" /><path d="M259 13v7h5" stroke="#6e8273" strokeWidth="2" />
      <Desk x={30} y={86} hair="#d3ded6" shirt="#80b6a1" index={1} />
      <Desk x={164} y={62} hair="#826651" shirt="#d0b98d" index={2} />
      <Desk x={289} y={89} hair="#51596a" shirt="#afa4ca" index={3} />
      <Plant x={17} y={108} /><Plant x={416} y={133} />
      <path d="M159 171h11v17h-11zM156 169h17v4h-17z" fill="#ae9478" /><path d="M157 161h7v8h-7M161 154h7v10h-7M168 160h6v9h-6" fill="#739f7e" />
      <path d="M414 55v41h-3V55M402 55h23l-5-14h-13z" fill="#c7ad7e" /><path className="ff-office-lamp" d="M405 56h16l14 39h-44z" fill="#f9eabe" opacity=".18" />
      <path d="M247 179h38v11h-38z" fill="#c2cab8" /><path d="M250 181h32v2h-32" fill="#e4e5d4" />
    </svg>
  </div>
}
