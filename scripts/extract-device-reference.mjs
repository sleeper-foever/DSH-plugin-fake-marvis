import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const input = process.argv[2]
if (!input) throw new Error('Pass the 212×202 reference crop as a PNG path.')
const data = 'data:image/png;base64,' + (await readFile(input)).toString('base64')
const masks = {
  body: 'M76 20 L84 26 L94 24 L108 33 L120 36 L137 59 L142 79 L138 100 L150 129 L153 150 L144 163 L127 153 L122 157 L106 147 L93 133 L90 116 L76 104 L62 99 L63 90 L74 78 L70 62 L73 49 L71 42 Z',
  left: 'M70 39 L76 43 L75 61 L69 77 L51 88 L18 101 L29 76 L39 61 L58 49 Z',
  right: 'M126 27 L150 27 L169 32 L184 40 L198 47 L184 54 L161 61 L142 62 L137 54 L139 45 L129 38 Z',
}
const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage()
  await page.route('**/*', route => route.abort())
  const images = await page.evaluate(async ({ data, masks }) => {
    const image = new Image(); image.src = data; await image.decode()
    if (image.width !== 212 || image.height !== 202) throw new Error('Expected a 212×202 crop')
    return Object.fromEntries(Object.entries(masks).map(([name, path]) => {
      const canvas = document.createElement('canvas'); canvas.width = 212; canvas.height = 202
      const ctx = canvas.getContext('2d'); ctx.clip(new Path2D(path)); ctx.drawImage(image, 0, 0)
      return [name, canvas.toDataURL('image/png').split(',')[1]]
    }))
  }, { data, masks })
  const folder = new URL('../src/client/assets/', import.meta.url)
  await mkdir(folder, { recursive: true })
  for (const [name, bytes] of Object.entries(images)) await writeFile(new URL('device-' + name + '.png', folder), Buffer.from(bytes, 'base64'))
  console.log('Wrote three transparent reference-derived device layers; no backdrop or pedestal.')
} finally { await browser.close() }
