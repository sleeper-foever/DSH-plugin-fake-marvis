/** Decorative poses share the same reference-inspired character, not separate agent identities. */
export type FireflyPose = 'typing' | 'reading' | 'thinking'

/** Pixel-grid artwork: silver hair, two-tone eyes, leaf ornament, black/gold jacket and teal dress. */
export function PixelFirefly({ pose = 'typing' }: { pose?: FireflyPose }) {
  const gaze = pose === 'typing' ? 1 : 0
  return <g data-pixel-character="firefly" data-pose={pose} shapeRendering="crispEdges">
    <g className="ff-worker-body">
      <g data-pixel-detail="long-hair">
        <path d="M16 6h29v3h7v6h4v10h3v27h-3v8h-4v8h-8v-6H18v5H9v-5H5V50h4V23h3V12h4Z" fill="#7f9691" />
        <path d="M16 10h31v5h6v15h3v23h-4v9h-6v-7H17v7h-7V50H8v-9h4V22h4Z" fill="#d4ddd4" />
        <path d="M13 38h7v18h-3v7h-6V52H8v-6h5M46 36h7v13h3v9h-5v7h-6V50h1" fill="#b5d7cd" />
        <path d="M12 51h6v7h-2v5h-5v-5H8v-5h4M48 52h8v6h-5v7h-6v-5h3" fill="#76b8b2" />
        <path d="M13 26h3v20h-3M48 26h3v20h-3" fill="#eef0e4" />
      </g>
      <g data-pixel-detail="boots">
        <path d="M23 74h8v15h-9V78h1M36 74h8v15h-9V78h1" fill="#273e48" />
        <path d="M24 76h6v9h-7v-6h1M37 76h6v9h-7v-6h1" fill="#27777f" />
        <path d="M21 82h11v4H21M34 82h11v4H34" fill="#77c4b4" />
        <path d="M23 85h7v4h-2v2h-3v-2h-2M36 85h7v4h-2v2h-3v-2h-2" fill="#dfbc72" />
        <path d="M23 89h8v5H20v-3h3M36 89h8v2h3v3H35v-5" fill="#fcf7e9" />
        <path d="M20 93h11v2H20M35 93h12v2H35" fill="#687d7b" />
      </g>
      <g data-pixel-detail="teal-dress">
        <path d="M21 46h22v5h4v12h3v7h4v9h-9v-3H23v3H12v-8h4V58h5Z" fill="#343d43" />
        <path d="M21 48h5v5h-5v4h-4v-2h-2v-3h6M40 48h5v5h6v3h-4v-2h-7" fill="#d6b86d" />
        <path d="M28 44h10v7H28" fill="#e6c4b0" />
        <path d="M25 47h5v4h4v-4h7v10h-4v5H26v-7h-4v-5h3" fill="#369ea0" />
        <path d="M28 47h3v6h-5v-3h2M36 47h3v5h-3" fill="#8dd5c4" />
        <path d="M26 60h13v5h3v6h4v8H18v-6h3v-6h3v-6Z" fill="#63bfb0" />
        <path d="M28 61h6v7h-2v8h-5v4h-9v-4h4v-5h3v-6h3M37 64h3v6h3v5h3v5h-8v-8h-1" fill="#e1efc7" />
        <path d="M25 64h5v8h-3v5h-7v-4h3v-5h2M36 64h3v6h3v6h-4v-3h-2" fill="#329eaa" />
        <path d="M24 69h3v4h-3M38 69h3v4h-3" fill="#e0d398" />
        <path d="M17 77h10v3h10v-2h10v4H17Z" fill="#e8edc6" />
        <path d="M18 81h28v2H18" fill="#bcceaf" />
        <path d="M15 62h3v8h-3v8h-5v-3h2v-7h3M46 63h3v8h4v7h-5v-5h-2" fill="#d0b878" />
      </g>
      <g className="ff-worker-arms" data-pixel-detail="sleeves">
        <path d="M18 50h7v6h-4v10h-8v-9h2v-5h3M41 50h7v4h4v12h-8v-9h-3Z" fill="#f1eee4" />
        <path d="M14 57h3v7h-3M48 55h3v8h-3" fill="#b7c7c2" />
        <path d="M13 63h8v3h-8M44 63h8v3h-8" fill="#343f48" />
        {pose === 'typing' && <>
          <path d="M19 63h7v-3h8v4h-7v4h-8M48 62h7v-4h6v5h-4v5h-9Z" fill="#f0d2c1" />
          <path d="M25 62h8v2h-8M55 58h6v2h-6" fill="#fff0df" />
        </>}
        {pose === 'reading' && <>
          <path d="M18 63h8v6h-8M43 62h7v7h-7" fill="#f0d2c1" />
          <path d="M25 58h18v15H25Z" fill="#667f76" /><path d="M27 59h7v12h-7M35 59h6v12h-6" fill="#f7e8c4" />
          <path d="M34 59h1v12h-1M28 63h5v1h-5M36 63h4v1h-4M28 66h5v1h-5" fill="#c3b58d" />
        </>}
        {pose === 'thinking' && <>
          <path d="M18 63h8v5h-8M46 60h6V47h-3v-5h-6v6h3Z" fill="#f0d2c1" />
          <path d="M44 42h4v3h-4" fill="#fff0df" />
        </>}
      </g>
      <g data-pixel-detail="gold-bow">
        <path d="M30 52h6v4h-6M22 53h7v3h3v3h-7v-2h-3M37 53h7v5h-3v2h-7v-4h3" fill="#e7bc66" />
        <path d="M25 59h6v4h-3v5h-4v-3h1M35 59h5v5h3v4h-5v-4h-3" fill="#d69f43" />
        <path d="M24 54h4v1h-4M37 54h5v2h-5M31 52h3v2h-3" fill="#fff0b0" />
      </g>
      <g className="ff-worker-head">
        <path d="M18 3h23v2h7v4h5v8h3v17h-3v9h-7v5H20v-4h-7v-8h-3V19h3V9h5Z" fill="#899b99" />
        <path d="M18 6h24v2h7v6h3v19h-4v10H20v-3h-5v-8h-2V20h3V11h2Z" fill="#ebe9df" />
        <path d="M21 8h18v2h-8v3H19v6h-3v-7h5M42 12h6v7h3v11h-3V20h-6Z" fill="#fbf7eb" />
        <path d="M18 23h29v4h4v11h-3v6h-6v3H25v-3h-6v-7h-3V27h2Z" fill="#f3d7c8" />
        <path d="M20 37h6v3h-6M41 37h6v3h-6" fill="#eeb7b2" />
        <g data-pixel-detail="eyes">
          <path d="M20 28h9v3h-1v8h-6v-2h-2M37 28h10v9h-2v2h-7V30h-1Z" fill="#55495f" />
          <g transform={`translate(${gaze} 0)`}>
            <path d="M22 31h5v6h-5M39 31h6v6h-6" fill="#79bed1" />
            <path d="M22 35h5v3h-5M39 35h6v3h-6" fill="#ba9bd4" />
            <path d="M24 31h2v4h-2M41 31h2v4h-2" fill="#577bae" />
            <path d="M22 31h2v2h-2M39 31h2v2h-2M25 36h1v1h-1M43 36h1v1h-1" fill="#fffcf1" />
          </g>
          <path d="M31 42h5v1h-5" fill="#b78985" />
        </g>
        <g data-pixel-detail="headband">
          <path d="M19 13h25v2h4v7H16v-5h3Z" fill="#d4ba81" />
          <path d="M20 14h23v2h4v5H17v-3h3Z" fill="#413e45" />
          <path d="M27 14h7v2h-2v2h-1v1h2v2h-6v-2h2v-2h-2Z" fill="#e8cf8f" />
          <path d="M29 15h3v1h-1v2h-1v2h1v1h-2v-2h1v-2h-1Z" fill="#c9f2df" />
        </g>
        <g data-pixel-detail="bangs">
          <path d="M17 21h10v5h-3v7h-3v6h-4v-6h-2V25h2M27 20h11v8h-3v8h-3v3h-3v-8h-2M39 21h8v4h4v10h-3v5h-4v-6h-3v-6h-2" fill="#e7e7de" />
          <path d="M18 22h3v8h-2v4h-2M28 21h3v9h-2M41 22h3v5h2v5h-2v-4h-3" fill="#fff9ea" />
          <path d="M24 24h2v8h-2v5h-3v-4h2v-5h1M34 23h3v6h-2v8h-3v-4h2M47 25h3v10h-3v4h-2v-6h2" fill="#bcc8c2" />
        </g>
        <g data-pixel-detail="leaf-ornament">
          <path d="M52 18h4v-7h3V6h3v8h-2v6h-5v4h-3Z" fill="#d7e6a9" />
          <path d="M54 22h5v-3h5v-5h2v9h-5v4h-7Z" fill="#bfda99" />
          <path d="M52 25h4v5h-4M55 29h4v15h-3V33h-1M51 29h3v12h-3" fill="#344965" />
          <path d="M52 25h3v3h-3" fill="#e7ce8b" />
        </g>
      </g>
    </g>
  </g>
}
