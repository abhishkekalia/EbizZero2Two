import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Register from "./Register";
import * as actions from "./auth.actions";

function mapStateToProps(state) {
	return {
		loading: state.auth.loading,
		errorStatus: state.auth.errorStatus
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({register: actions.register}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
