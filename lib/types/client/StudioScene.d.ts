type Mode = 'idle' | 'working' | 'waiting' | 'error';
/** Ambient gaming-room illustration, still driven by one assistant's actual activity state. */
export declare function StudioScene({ mode, label }: {
    mode: Mode;
    label: string;
}): import("react").JSX.Element;
export {};
