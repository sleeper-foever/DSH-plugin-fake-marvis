/** Pixel offsets from the viewport's right and bottom edges. */
export interface Position {
  right: number
  bottom: number
}

/** Dimensions of a viewport or the floating assistant. */
export interface Size {
  width: number
  height: number
}

/**
 * Keep the entire dock visible, including after a smaller viewport restores saved offsets.
 * @param position - Desired viewport offsets.
 * @param viewport - Current viewport dimensions.
 * @param dock - Measured dock dimensions, including an expanded panel.
 * @returns Offsets with an 8px clearance where space permits.
 */
export function clampPosition(position: Position, viewport: Size, dock: Size): Position {
  const clamp = (offset: number, available: number): number => {
    const max = Math.max(0, available)
    const margin = Math.min(8, max / 2)
    return Math.round(Math.min(Math.max(offset, margin), Math.max(margin, max - margin)))
  }
  return {
    right: clamp(position.right, viewport.width - dock.width),
    bottom: clamp(position.bottom, viewport.height - dock.height),
  }
}
