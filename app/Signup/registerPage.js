import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Register from "./register";
import * as actions from "./auth.actions";

function mapStateToProps(state) {
	return {
		lang: state.auth.lang,
	};
}


export default connect(mapStateToProps)(Register);
