/** Decorative poses share the same reference-inspired character, not separate agent identities. */
export type FireflyPose = 'typing' | 'reading' | 'thinking';
/** Pixel-grid artwork: silver hair, two-tone eyes, leaf ornament, black/gold jacket and teal dress. */
export declare function PixelFirefly({ pose }: {
    pose?: FireflyPose;
}): import("react").JSX.Element;
