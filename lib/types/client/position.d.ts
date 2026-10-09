/** Pixel offsets from the viewport's right and bottom edges. */
export interface Position {
    right: number;
    bottom: number;
}
/** Dimensions of a viewport or the floating assistant. */
export interface Size {
    width: number;
    height: number;
}
/**
 * Keep the entire dock visible, including after a smaller viewport restores saved offsets.
 * @param position - Desired viewport offsets.
 * @param viewport - Current viewport dimensions.
 * @param dock - Measured dock dimensions, including an expanded panel.
 * @returns Offsets with an 8px clearance where space permits.
 */
export declare function clampPosition(position: Position, viewport: Size, dock: Size): Position;
