import { describe, expect, it } from 'vitest'
import { clampPosition } from '../src/client/position.ts'

describe('dock position', () => {
  const dock = { width: 360, height: 420 }
  it('restores an off-screen saved pet-style offset inside the viewport', () => {
    expect(clampPosition({ right: 1954, bottom: 65 }, { width: 1280, height: 800 }, dock))
      .toEqual({ right: 912, bottom: 65 })
  })
  it('keeps the expanded panel visible after a window shrink', () => {
    expect(clampPosition({ right: 800, bottom: 600 }, { width: 390, height: 520 }, dock))
      .toEqual({ right: 22, bottom: 92 })
  })
  it('clamps negative drag offsets and rounds fractional pixels', () => {
    expect(clampPosition({ right: -20, bottom: 20.7 }, { width: 1280, height: 800 }, dock))
      .toEqual({ right: 8, bottom: 21 })
  })
  it('does not produce negative offsets in a viewport smaller than the dock', () => {
    expect(clampPosition({ right: 24, bottom: 80 }, { width: 240, height: 200 }, dock))
      .toEqual({ right: 0, bottom: 0 })
  })
})
