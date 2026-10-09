import { useId } from 'react'
import body from './assets/device-body.png?inline'
import leftShoulder from './assets/device-left.png?inline'
import rightShoulder from './assets/device-right.png?inline'

function WingFire({ ridge, vein, flame, paint }: { ridge: string; vein: string; flame: string; paint: string }) {
  return <g className="dshfa-wing-fire" aria-hidden="true">
    <path className="dshfa-flame-tongue" d={flame} fill={paint} />
    <path className="dshfa-fire-rim" d={ridge} stroke="#38EACA" strokeWidth="5.8" strokeLinecap="round" pathLength="100" />
    <path className="dshfa-fire-stream" d={ridge} stroke="#EDFFF0" strokeWidth="3.6" strokeLinecap="round" pathLength="100" />
    <path className="dshfa-fire-stream dshfa-fire-stream-secondary" d={vein} stroke="#8CFFF0" strokeWidth="2.8" strokeLinecap="round" pathLength="100" />
    <path className="dshfa-fire-ember" d={ridge} stroke="#FFDA83" strokeWidth="4.2" strokeLinecap="round" pathLength="100" />
  </g>
}

/** Reference-derived armor with independently hinged upper/lower light wings. See assets/NOTICE.md. */
export function TransformDevice({ size = 80, className, expanded = false }: { size?: number; className?: string; expanded?: boolean }) {
  const id = useId()
  const upper = id + '-upper-light'
  const lower = id + '-lower-light'
  const edge = id + '-circuit-edge'
  const flame = id + '-wing-fire'
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256"
      fill="none" className={className} data-wing-state={expanded ? 'open' : 'closed'} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={upper} x1="135" y1="66" x2="63" y2="160" gradientUnits="userSpaceOnUse">
          <stop stopColor="#CEFFF8" stopOpacity=".83" />
          <stop offset=".24" stopColor="#34DDD7" stopOpacity=".6" />
          <stop offset=".57" stopColor="#20B8B2" stopOpacity=".27" />
          <stop offset="1" stopColor="#AEC677" stopOpacity=".13" />
        </linearGradient>
        <linearGradient id={lower} x1="129" y1="105" x2="125" y2="212" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A3FFF1" stopOpacity=".85" />
          <stop offset=".35" stopColor="#14CFC5" stopOpacity=".55" />
          <stop offset=".68" stopColor="#77CCA0" stopOpacity=".27" />
          <stop offset="1" stopColor="#F5B736" stopOpacity=".77" />
        </linearGradient>
        <linearGradient id={edge} x1="105" y1="89" x2="98" y2="207" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A8FFF1" /><stop offset=".55" stopColor="#49E1CD" />
          <stop offset="1" stopColor="#FFCF5D" />
        </linearGradient>
        <linearGradient id={flame} x1="128" y1="76" x2="128" y2="210" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C7FFF0" stopOpacity=".12" />
          <stop offset=".45" stopColor="#24E9CC" stopOpacity=".66" />
          <stop offset=".8" stopColor="#98FFCE" stopOpacity=".85" />
          <stop offset="1" stopColor="#FFE092" stopOpacity=".58" />
        </linearGradient>
      </defs>
      <g className="ff-device-wing">
        <g data-wing-side="left">
          <g className="dshfa-light-wing dshfa-light-wing-upper" data-wing-pair="upper">
            <path d="M104 83 83 79 57 93 30 116 7 143 36 139 51 129 40 148 65 139 94 112 114 102Z" fill={`url(#${upper})`} stroke={`url(#${edge})`} strokeWidth="1" />
            <path d="M100 87 82 86 54 103 18 134 45 128 67 113 88 100" fill="#A7FFF0" fillOpacity=".09" stroke="#B2FFF1" strokeWidth=".65" />
            <path d="M86 86 77 95 68 96 44 117 31 127M103 94 92 100 82 102 65 117 54 134M66 96 67 104 51 117 42 117 26 132M83 110 75 122 59 134M54 104 45 103 31 114" stroke="#95FFDB" strokeWidth=".9" strokeOpacity=".74" />
            <path d="M87 80 65 88 41 107 20 130" stroke="#B0FFF6" strokeWidth="2.1" strokeOpacity=".6" />
            <circle cx="67" cy="104" r="1.3" fill="#E4F3A8" /><circle cx="82" cy="102" r="1.2" fill="#D3FFF1" />
            <WingFire paint={`url(#${flame})`} ridge="M103 87 Q66 88 38 119 L10 141" vein="M107 97 85 109 65 134 44 146"
              flame="M104 85Q71 81 45 105L29 114 34 103 12 128 18 126 4 151 21 145 18 153 42 139 35 148 66 130 78 105 109 97Z" />
            <image href={leftShoulder} x="22" y="6" width="212" height="202" />
          </g>
          <g className="dshfa-light-wing dshfa-light-wing-lower" data-wing-pair="lower">
            <path d="M108 108 91 107 76 125 58 155 43 192 61 183 79 163 74 182 94 160 113 126Z" fill={`url(#${lower})`} stroke={`url(#${edge})`} strokeWidth="1" />
            <path d="M101 115 89 118 73 142 52 179 67 168 89 133Z" fill="#BFFFF0" fillOpacity=".15" />
            <path d="M101 116 88 127 85 141 71 157 60 176M84 127 74 137 70 148 61 157M98 131 91 149 81 163" stroke="#B6FFD2" strokeWidth=".9" strokeOpacity=".76" />
            <path d="M52 174 44 190 60 181 70 168" stroke="#FFD361" strokeWidth="1.3" />
            <WingFire paint={`url(#${flame})`} ridge="M103 112 Q80 134 66 160 L46 190" vein="M105 122 93 144 82 158 76 179"
              flame="M103 111Q79 126 67 154L56 166 57 154 44 180 34 202 52 192 48 205 72 178 68 193 95 157 108 126Z" />
            <path d="M97 107 106 110 110 116 101 124 96 116Z" fill="#D0D5BD" stroke="#8A9A89" strokeWidth=".7" />
          </g>
        </g>
        <g data-wing-side="right">
          <g className="dshfa-light-wing dshfa-light-wing-upper" data-wing-pair="upper">
            <path d="M150 74 169 70 193 78 219 94 248 121 217 115 202 105 216 127 188 116 156 92Z" fill={`url(#${upper})`} stroke={`url(#${edge})`} strokeWidth="1" />
            <path d="M163 79 177 79 199 88 234 112 208 105 189 95 169 87" fill="#A7FFF0" fillOpacity=".13" stroke="#B2FFF1" strokeWidth=".65" />
            <path d="M174 77 184 85 195 86 222 103M156 85 168 89 181 91 196 106 206 115M182 95 185 103 199 112M201 86 209 94 218 95" stroke="#95FFDB" strokeWidth=".85" strokeOpacity=".74" />
            <path d="M164 71 190 75 221 93 242 114" stroke="#B0FFF6" strokeWidth="2.1" strokeOpacity=".58" />
            <circle cx="195" cy="86" r="1.4" fill="#E4F3A8" /><circle cx="185" cy="103" r="1.1" fill="#D3FFF1" />
            <WingFire paint={`url(#${flame})`} ridge="M158 78 Q191 72 218 98 L244 118" vein="M156 86 178 99 197 109 213 125"
              flame="M157 77Q195 67 224 94L236 98 231 88 249 107 246 108 255 129 235 124 246 133 222 121 229 134 190 111 157 91Z" />
            <image href={rightShoulder} x="22" y="6" width="212" height="202" />
          </g>
          <g className="dshfa-light-wing dshfa-light-wing-lower" data-wing-pair="lower">
            <path d="M149 113 163 113 180 134 198 162 210 191 192 181 177 160 182 180 163 159 145 132Z" fill={`url(#${lower})`} stroke={`url(#${edge})`} strokeWidth="1" />
            <path d="M155 120 169 131 188 161 202 181 191 172 167 140Z" fill="#BFFFF0" fillOpacity=".14" />
            <path d="M157 123 166 134 168 146 182 161 194 179M173 135 182 144 185 156M155 140 164 156 173 165" stroke="#B6FFD2" strokeWidth=".9" strokeOpacity=".76" />
            <path d="M201 173 209 189 194 180 183 164" stroke="#FFD361" strokeWidth="1.3" />
            <WingFire paint={`url(#${flame})`} ridge="M154 117 Q180 139 190 160 L207 188" vein="M151 127 166 147 175 163 180 178"
              flame="M153 116Q179 128 195 157L207 169 204 153 221 184 230 203 211 192 217 205 193 181 200 196 171 160 147 130Z" />
            <path d="M149 111 159 114 164 122 155 128 149 122Z" fill="#D6DAC5" stroke="#91A097" strokeWidth=".7" />
          </g>
        </g>
      </g>
      <g className="ff-device-core"><image href={body} x="22" y="6" width="212" height="202" /></g>
    </svg>
  )
}
