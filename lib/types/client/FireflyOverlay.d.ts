import type { OverlayProps } from './contracts.ts';
/**
 * Read framework hook seats once and retain draft state while the active dock is hidden.
 * @param props - Root-scoped assistant, locale and preference bindings.
 * @returns The independent chat dock or no floating UI when disabled.
 */
export declare function FireflyOverlay(props: OverlayProps): import("react").JSX.Element | null;
