import {StyleSheet, Dimensions} from 'react-native';
const HEADER_HEIGHT = 64;
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
	container: {
		flex: 1,
		// paddingTop: HEADER_HEIGHT + 150
	},
	content: {
		flex: 1,
		paddingLeft: 20,
		paddingRight: 20,
		marginBottom: 20,
		marginTop: 20
	},
	iconusername : {
    	flexDirection: 'row',
    	borderBottomWidth: 0.5,
		borderColor: '#ccc',
		backgroundColor : 'transparent',
		borderColor:'#fbcdc5'
    },

	iconpassword : {
    	flexDirection: 'row',
    	backgroundColor : 'transparent'
    },

	inputcontent : {
		borderColor: '#ccc',
		borderWidth: 1,
		borderStyle: 'solid',
		borderRadius: 5,
		bottom : 10
	},
	inputusername: {
		width : width/1.5,
    	paddingLeft: 0,
    	// backgroundColor: '#fff',
    	color: '#424242',
		left : 10,
		// height : 40
    },
	inputpassword: {
		// flex: 1,
		width : width/1.5,
    	paddingLeft: 0,
    	// backgroundColor: '#fff',
    	color: '#424242',
		left : 10,
		height : 50
	},
	button : {
		height : 40,
		alignItems : 'center',
		justifyContent : 'center'
	},

	label: {
		color: 'orange',
		padding: 5,
		fontSize: 18,
		fontWeight: "700",
		fontStyle: 'italic'
	},
	errorText: {
		color: 'red',
		padding: 5,
		fontWeight: "700",
		fontStyle: 'italic'
	},
	show :{
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
   	borderBottomWidth: 0.5,
	borderColor: '#ccc',

	},
	registerContent : {
		borderColor: '#ccc',
		borderWidth: 0.5,
		borderStyle: 'solid',
		borderRadius: 5,
	},
	social : {
		left : 10,
		// borderColor:"#3b5998" ,
		height :25,
		width :25,
		justifyContent:'center',
	},
	socialInput : {
		width : width/1.5,
		color: '#424242',
		left : 10,
		justifyContent : 'center'

	}

});
