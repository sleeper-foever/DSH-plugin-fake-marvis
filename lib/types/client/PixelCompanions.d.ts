/** Reference-inspired decorative characters; they do not represent independent running agents. */
export type CompanionKind = 'silver-wolf' | 'stelle';
/** Pixel reinterpretations of the two character references, with distinct silhouettes and costumes. */
export declare function PixelCompanion({ kind }: {
    kind: CompanionKind;
}): import("react").JSX.Element;
