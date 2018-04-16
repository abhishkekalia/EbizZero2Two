import { takeLatest } from 'redux-saga/effects'

/* ------------- Types ------------- */
import { StartupTypes } from '../Redux/StartupRedux'
import { SettingsTypes } from '../Redux/SettingsRedux'

/* ------------- Sagas ------------- */
// import { startup } from './StartupSagas'
import { updateLanguage } from './SettingsSaga'

/* ------------- StartupSagas ------------- */
import { put, select } from 'redux-saga/effects'
import SettingsActions from 'app/Redux/SettingsRedux'


/* ------------- Connect Types To Sagas ------------- */
export default function* root() {
  yield[
    takeLatest(StartupTypes.STARTUP, startup),
    takeLatest(SettingsTypes.CHANGE_LANGUAGE, updateLanguage)
  ]
}
export const selectLanguage = state => state.settings.language // get the language from the settings reducer

// process STARTUP actions
export function* startup(action) {
  const language = yield select(selectLanguage)

  // Always set the I18n locale to the language in the settings, or the views would render in the language of the device's locale and not that of the setting.
  yield put(SettingsActions.changeLanguage(language))
}
