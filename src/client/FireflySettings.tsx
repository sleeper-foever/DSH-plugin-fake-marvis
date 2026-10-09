import type { SettingsProps } from './contracts.ts'

/**
 * Browser-local visibility and off-screen recovery controls.
 * @param props - Framework locale/preference hooks and mutation callbacks.
 * @returns The General settings row.
 */
export function FireflySettings({ t, usePreferences, setEnabled, resetPosition }: SettingsProps) {
  const { values, storageUnavailable } = usePreferences(snapshot => snapshot)
  return (
    <section data-firefly-settings className="ff-settings">
      <div className="ff-settings-heading">
        <div>
          <div className="ff-settings-title">{t('title')}</div>
          <p>{t('settings.description')}</p>
        </div>
        <label className="ff-switch">
          <input type="checkbox" role="switch" aria-label={t('settings.enabled')}
            checked={values.enabled} onChange={event => { setEnabled(event.currentTarget.checked) }} />
          <span aria-hidden="true" />
        </label>
      </div>
      <button type="button" className="ff-reset" onClick={resetPosition}>{t('settings.reset')}</button>
      {storageUnavailable && <p role="status">{t('storage')}</p>}
    </section>
  )
}
