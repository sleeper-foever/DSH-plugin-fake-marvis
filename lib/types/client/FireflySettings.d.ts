import type { SettingsProps } from './contracts.ts';
/**
 * Browser-local visibility and off-screen recovery controls.
 * @param props - Framework locale/preference hooks and mutation callbacks.
 * @returns The General settings row.
 */
export declare function FireflySettings({ t, usePreferences, setEnabled, resetPosition }: SettingsProps): import("react").JSX.Element;
