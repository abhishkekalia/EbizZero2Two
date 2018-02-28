import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Menu from './Menu';
import * as authActions from "app/auth/auth.actions";
import SettingsActions from 'app/Redux/SettingsRedux'

function mapStateToProps(state) {
    return {
        identity: state.identity,
        lang: state.auth.lang,
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
