import {StyleSheet, Dimensions,PixelRatio} from 'react-native';
const HEADER_HEIGHT = 64;
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: '#f9f9f9',
        padding :10
    },
    inputs : {
        width : width/2,
        paddingLeft: 0,
        height : 40,
        borderBottomWidth : 1,
        borderColor : '#ccc',
        color: '#424242',
    },
    feature : {
        flexDirection : 'row',
        justifyContent : 'space-between'
    },
    avatarContainer: {
        borderColor: '#9B9B9B',
        borderWidth: 1 / PixelRatio.get(),
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar: {
        // borderRadius: 50,
        width: 100,
        height: 100
    },
    ImageAdd :{
    	flex : 0.5,
    	borderColor : '#ccc',
    	borderWidth :1,
        alignItems: 'center',
        justifyContent : 'space-between',
        borderRadius : 5
    },
    formItems:{
        flex: 1,
      	borderColor : '#ccc',
    	borderWidth :1,
        backgroundColor: '#fff',
        top : 10,
        padding :10,
        borderRadius : 5

    },
    addCat : {
    	borderRadius : 5,
    	padding : 5,
    	margin : 15,
    	borderWidth : 1,
    	borderColor : '#ccc',
    	width : width-50
    },
    textField : {
    	// backgroundColor : '#ccc'
    },
    inputusername : {
    	width : width/1.1-30,
    	height : 40,
    	borderWidth : 1,
    	paddingLeft: 20,
    	borderColor: '#ccc',
    	color: '#424242',
    	left : 10
    },
    label : {
    	left : 10,
    	color : '#a9d5d1'
    },
    chip : {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    submit : {
        marginRight: 10,
        padding : 5,
        alignItems : 'center',
        borderRadius : 5,
        borderColor : '#fff',
        borderWidth : 1
    }

});