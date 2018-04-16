import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Login from "./components/Login";
import * as actions from "./auth.actions";
import SettingsActions from 'app/Redux/SettingsRedux'

function mapStateToProps(state) {
	return {
		language: state.auth.lang,
		loading: state.auth.loading,
		errorStatus: state.auth.errorStatus
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		login: actions.login,
		languageChange : actions.languageChange,
		skipSignIN : actions.skipSignIN,
		// changeLanguage: (newLang) =>
		// SettingsActions.changeLanguage(newLang)
	}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
