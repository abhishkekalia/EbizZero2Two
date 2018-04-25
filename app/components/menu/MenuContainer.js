import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Menu from './Menu';
import * as authActions from "app/auth/auth.actions";
import SettingsActions from 'app/Redux/SettingsRedux'

function mapStateToProps(state) {
    return {
        identity: state.identity,
        lang: state.auth.lang,
        u_id: state.identity.u_id,
        deviceId: state.auth.deviceId,
        isGuest: state.auth.isGuest,
    }
}

function dispatchToProps(dispatch) {
    return bindActionCreators({
        logout: authActions.logout,
        languageChange : authActions.languageChange,
        changeLanguage: (newLang) =>
        SettingsActions.changeLanguage(newLang)
    }, dispatch);
}

export default connect(mapStateToProps, dispatchToProps)(Menu);
