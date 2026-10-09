/** Reference-inspired decorative characters; they do not represent independent running agents. */
export type CompanionKind = 'silver-wolf' | 'stelle'

/** Pixel reinterpretations of the two character references, with distinct silhouettes and costumes. */
export function PixelCompanion({ kind }: { kind: CompanionKind }) {
  if (kind === 'silver-wolf') return <g data-pixel-character="silver-wolf" data-pose="typing" shapeRendering="crispEdges">
    <g className="ff-worker-body">
      <g data-pixel-detail="asymmetric-boots">
        <path d="M23 69h8v16h-8M36 69h8v16h-8" fill="#ead1c6" />
        <path d="M37 78h8v8h-8" fill="#a390a9" />
        <path d="M38 79h2v2h-2M42 79h2v2h-2M40 81h2v2h-2M38 83h2v2h-2M42 83h2v2h-2" fill="#4d445f" />
        <path d="M21 83h11v12H18v-4h3M35 83h11v8h3v4H35" fill="#35394f" />
        <path d="M22 83h8v4h-5v4h-4M37 83h8v6h-5v3h-3" fill="#747cdf" />
        <path d="M20 95h12v2H18v-2M35 95h14v2H35" fill="#9dadd2" />
        <path d="M17 68h3v18h-4V73h1" fill="#4e526a" /><path d="M16 69h4v4h-4" fill="#a99be7" />
      </g>
      <g data-pixel-detail="purple-tech-jacket">
        <path d="M23 43h20v3h7v8h3v9H18V53h-4v-7h9Z" fill="#383649" />
        <path d="M24 45h6v11h-9v-5h-4v-4h7M38 44h8v4h4v6h-8v4h-4" fill="#8a83d0" />
        <path d="M28 46h12v10H27v-7h1" fill="#f0eff0" />
        <path d="M29 50h3v3h2v-3h4v4h-9" fill="#a5b9e2" />
        <path d="M26 57h17v5H26" fill="#edcfc3" />
        <path d="M21 63h25v9h3v5H35v-5h-4v5H20v-9h1" fill="#3f3c50" />
        <path d="M20 62h27v4H20" fill="#b8b4c0" /><path d="M29 62h6v5h-6" fill="#e6d5a0" /><path d="M31 63h2v2h-2" fill="#6c6289" />
        <path d="M39 63h8v5h4v7h-5v-5h-7" fill="#bda1df" />
        <path d="M19 45h7v3h-9v3h-3v-6h5M41 43h8v3h4v4h-5v-3h-7" fill="#dbe2e4" />
        <path d="M41 46h3v9h-3M22 49h2v7h-2" fill="#d4c4ef" />
      </g>
      <g className="ff-worker-arms">
        <path d="M17 50h7v9h8v5H19v-3h-4V54h2M43 50h7v10h6v5H44v-5h-1" fill="#444157" />
        <path d="M25 59h8v5h-8M52 59h8v5h-8" fill="#e6c8bc" />
        <path d="M29 60h5v5h-5M57 60h5v5h-5" fill="#454a61" />
        <path d="M18 54h5v2h-5M45 56h5v2h-5" fill="#a18dd5" />
      </g>
      <g className="ff-worker-head">
        <g data-pixel-detail="rabbit-ears">
          <path d="M26 11 19-6h5l9 16M35 9 47-3h4L42 13" fill="#454e81" />
          <path d="M24-2 29 7h-3L22-2M44 3h3l-7 7h-2" fill="#8e8bd3" />
          <path d="M27 11h14v3H27" fill="#e0e2e6" />
        </g>
        <path d="M20 11h22v3h7v5h4v17h-5v8h-6v4H23v-4h-6v-9h-3V22h3v-7h3Z" fill="#717383" />
        <path d="M22 14h20v3h6v6h3v12h-5v6H21v-6h-4V24h3v-7h2Z" fill="#b9bcc9" />
        <path d="M22 24h25v4h3v9h-5v7H25v-4h-5V29h2Z" fill="#efcfbf" />
        <path d="M23 29h7v8h-5v-5h-2M38 29h8v8h-6v-5h-2" fill="#53495e" />
        <path d="M25 31h4v5h-4M40 31h4v5h-4" fill="#bd99ca" />
        <path d="M25 31h2v2h-2M40 31h2v2h-2" fill="#f9f1ed" />
        <path d="M31 42h5v1h-5" fill="#b88983" />
        <g data-pixel-detail="goggles">
          <path d="M20 14h28v7H19v-4h1Z" fill="#4f5286" />
          <path d="M22 15h11v4H21v-3h1" fill="#80bded" /><path d="M35 15h11v4H35" fill="#b699ee" />
          <path d="M23 15h8v1h-8M36 15h8v1h-8" fill="#cce7ff" />
          <path d="M32 16h3v2h-3" fill="#e9dcef" />
        </g>
        <g data-pixel-detail="silver-bob">
          <path d="M19 22h9v3h-4v8h-3v8h-4V31h-2v-6h4M27 21h12v7h-3v7h-3v4h-3v-8h-3M41 21h7v5h3v9h-4v6h-3v-8h-3Z" fill="#bfc1ce" />
          <path d="M19 24h3v8h-3M29 23h3v6h-3M43 23h3v7h-3" fill="#e5e4ee" />
          <path d="M35 24h3v7h-3v5h-3v-6h3M48 28h2v8h-3v4h-2v-7h3" fill="#989bad" />
        </g>
      </g>
    </g>
  </g>
  return <g data-pixel-character="stelle" data-pose="sketching" shapeRendering="crispEdges">
    <g className="ff-worker-body">
      <g data-pixel-detail="gray-long-hair">
        <path d="M18 9h26v5h7v14h4v26h-4v13h-8V52H20v13h-8V54H8V39h5V20h5Z" fill="#69666a" />
        <path d="M20 13h24v8h5v29h-4v11h-5V42H23v17h-8v-9h-3v-9h4V23h4Z" fill="#959191" />
        <path d="M16 37h4v20h-4M45 32h3v18h-3v9h-3V46h3" fill="#b6aeaa" />
        <path d="M10 49h4v8h6v6h-8v-5H8v-5h2M45 51h7v7h-4v7h-6v-7h3" fill="#807d82" />
      </g>
      <g data-pixel-detail="trailblazer-coat">
        <path d="M23 44h20v5h7v13h3v16h-7v-8h-4V54H25v17h-6v13h-9v-5h3V63h4V49h6Z" fill="#343a43" />
        <path d="M20 49h7v18h-5v11h-4V61h2M39 47h7v11h4v13h-5v-9h-4v-9h-2" fill="#4e5259" />
        <path d="M20 47h5v14h-3v10h-4V59h2M39 46h5v8h3v11h-4V54h-4" fill="#e0b957" />
        <path d="M25 48h14v8h-2v8h3v7H24V60h2Z" fill="#e9e4dc" />
        <path d="M28 47h9v3h-4v5h-4v-3h-2" fill="#f7f4e9" />
        <path d="M24 60h4v4h8v3H25M34 53h3v8h-3" fill="#bfc3c6" />
        <path d="M20 71h25v5h4v5H18v-6h2" fill="#42444d" />
        <path d="M22 71h21v2H22M35 72h7v4h-7" fill="#89817a" />
        <path d="M16 70h3v11h-7v4H8v-4h6v-7h2M45 67h4v8h5v6h-6v-5h-3" fill="#c7ac68" />
      </g>
      <g data-pixel-detail="trailblazer-boots">
        <path d="M23 81h8v11h-8M36 81h8v11h-8" fill="#ebcaba" />
        <path d="M21 89h11v6H18v-3h3M35 89h10v3h4v3H35" fill="#3c424a" />
        <path d="M23 89h6v2h-6M37 89h6v2h-6" fill="#bda879" />
        <path d="M18 95h14v2H18M35 95h14v2H35" fill="#777979" />
      </g>
      <g className="ff-worker-arms" data-pixel-detail="notepad">
        <path d="M18 49h7v12h5v6H18V55h-3M43 48h8v12h-6V54h-2" fill="#4d5058" />
        <path d="M20 58h5v6h-5M46 54h5v6h-5" fill="#e6c5b5" />
        <path d="M25 61h7v5h-7M45 58h7v5h-7" fill="#363d49" />
        <path d="M31 55h18v19H29V57h2" fill="#777b83" /><path d="M32 57h14v15H32Z" fill="#eee5cb" />
        <path d="M34 61h10v2H34M34 66h7v2h-7" fill="#b7b49e" />
        <path d="M47 50h3v9h-3v5h-2V53h2Z" fill="#d4b36b" /><path d="M45 61h2v3h-2" fill="#4e5663" />
      </g>
      <g className="ff-worker-head">
        <path d="M20 7h22v4h7v7h4v19h-5v7h-6v4H24v-5h-6v-9h-4V20h3v-9h3Z" fill="#747177" />
        <path d="M23 11h18v3h7v9h3v11h-5v8H23v-5h-6V23h3v-8h3Z" fill="#a8a2a0" />
        <path d="M25 12h12v3H25M20 19h3v6h-3" fill="#d3cbc1" />
        <path d="M23 23h23v4h4v10h-5v7H25v-4h-6V29h4Z" fill="#f0d1be" />
        <g data-pixel-detail="gold-eyes">
          <path d="M23 29h8v8h-6v-5h-2M38 29h9v8h-6v-5h-3" fill="#605346" />
          <path d="M25 31h5v5h-5M41 31h5v5h-5" fill="#d4b657" />
          <path d="M27 31h2v4h-2M43 31h2v4h-2" fill="#937e40" />
          <path d="M25 31h2v2h-2M41 31h2v2h-2" fill="#fff2c7" />
        </g>
        <path d="M31 42h5v1h-5" fill="#b38779" />
        <path d="M20 22h9v5h-3v7h-3v5h-4V28h-2v-3h3M28 21h12v7h-3v7h-4v3h-3v-9h-2M42 22h6v5h3v8h-4v6h-4V30h-1" fill="#a8a29f" />
        <path d="M21 23h3v8h-3M30 23h3v5h-3M43 24h3v7h-3" fill="#d4cbc0" />
        <path d="M36 24h3v5h-2v7h-4v-4h3M48 27h2v9h-3v4h-2v-8h3" fill="#8b8990" />
      </g>
    </g>
  </g>
}
