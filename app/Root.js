import React from "react";
import {View} from "react-native";
import {Provider} from "react-redux";
import store from "./store";
import Routes from "./Routes";

const Root = () => (
	<Provider store={store}>
		<View style={{flex: 1}}>
			<Routes />
		</View>
	</Provider>
);

export default Root;