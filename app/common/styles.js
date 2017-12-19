import {StyleSheet, Dimensions} from 'react-native';
const HEADER_HEIGHT = 64;
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: HEADER_HEIGHT + 150
	},
	content: {
		flex: 1,
		padding: 20
	},
	iconusername : {
    	flexDirection: 'row', 
    	borderBottomWidth: 0.5,
		borderColor: 'red',
    },

	iconpassword : {
    	flexDirection: 'row',
    },

	inputcontent : { 
		borderColor: 'red',
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
    	left : 10
    },
	inputpassword: {
		// flex: 1,
		width : width/1.5,
    	paddingLeft: 0,
    	// backgroundColor: '#fff',
    	color: '#424242',
    	left : 10
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
	borderColor: 'red',

	},
	registerContent : { 
		borderColor: 'red',
		borderWidth: 0.5,
		borderStyle: 'solid',
		borderRadius: 5,
	},

});