type Mode = 'idle' | 'working' | 'waiting' | 'error';
/** Decorative coworkers visualize a single assistant; no simulated task counts or agent identities. */
export declare function StudioScene({ mode, label }: {
    mode: Mode;
    label: string;
}): import("react").JSX.Element;
export {};
