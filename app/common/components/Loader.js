import React, {Component} from "react";
import {View, Text, StyleSheet} from "react-native";
import { LinesLoader } from 'react-native-indicator';
import SplashScreen from 'react-native-splash-screen';

	class Loader extends Component{
		componentWillMount() {
			// do stuff while splash screen is shown
			// After having done stuff (such as async tasks) hide the splash screen
			SplashScreen.hide();
		}
		render(){
			return(
				<View style={styles.container}>
				{/* <LinesLoader color= {'#6a5acd'} barWidth={5} barHeight={40} barNumber={2} betweenSpace={5}/>*/}

				</View>
			);
		}
	}
const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: 'rgba(150,150,150,0.2)',
		justifyContent: 'center',
		alignItems: 'center'
	},
	text: {
		padding: 10,
		fontSize: 25,
		alignSelf: 'center',
		color: 'orange'
	}
});

export default Loader;
