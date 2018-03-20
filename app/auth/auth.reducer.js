import * as types from "./auth.actions";
export const INITIAL_STATE = { token: null, errorStatus: ''};

export default function auth(state = INITIAL_STATE, action) {
	switch (action.type) {
		case types.AUTH_LOGIN_START:
			return {
				...state,
				loading: true,
				errorStatus: ''
			};
		case types.AUTH_LOGIN_SUCCESS:
			return {
				...state,
				loading: false,
				token: action.payload.token,
				user_type: action.payload.user_type,
				u_id: action.payload.u_id
			};
		case types.AUTH_LOGIN_FAIL:
			return {
				...state,
				loading: false,
				token: null,
				errorStatus: action.payload.message
			};
		case types.AUTH_LOGOUT:
			return {
				...state,
				token: null,
				user_type : null,
				// country : null,
				deviceId : null
			};
		case types.CHANGE_LANGUAGE:
				return {
					...state,
					errorStatus: '',
					lang: action.payload,
				};
		case types.SKIP_SIGNIN:
				return {
					...state,
					errorStatus: '',
					deviceId: action.payload,
				};
		case types.SET_COUNTRY:
				return {
					country: action.payload,
					lang: "en"
				};
		default:
			return state;
	}
}
