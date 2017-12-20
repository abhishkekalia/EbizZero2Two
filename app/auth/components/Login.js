import React, { 
	Component, 
	PropTypes
} from 'react';

import { 
	View, 
	Text, 
	TextInput, 
	TouchableOpacity, 
	Button ,
	Platform
} from "react-native";
import {Actions as routes} from "react-native-router-flux";
import {Loader} from "app/common/components";
import commonStyles from "app/common/styles";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import {CirclesLoader} from 'react-native-indicator';

const INITIAL_STATE = {email: '', password: ''};

class Login extends Component {
	constructor() {
		super();
		this.state = {
			email: '', 
			password: '',
			os : (Platform.OS === 'ios') ? 2 : 1,
			loading: false

		};
	    this.inputs = {};
	}
	focusNextField(id) { 
    	this.inputs[id].focus();
    }
	onBlurUser() { 
		const { email } = this.state;
		let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ; 

		if(reg.test(email) === false) 
			{ 

			MessageBarManager.showAlert({
            message: "Plese Enter Valid Email",
            alertType: 'alert',
            })
				return false;
			}
	}

	render() {
		const {errorStatus, loading} = this.props;
		return (
			<View style={[commonStyles.container, commonStyles.content]} testID="Login">
				<View style={{alignItems : 'center', padding:10}}>
				    {this.state.loading ? <CirclesLoader /> : undefined}
				</View>
				<View style ={commonStyles.inputcontent}>
					<View style ={commonStyles.iconusername}>
						<Ionicons name="ios-mail-outline" 
						size={30} 
						color="#900"
						style= {{ padding: 10}}
						/>
						<TextInput
							style={commonStyles.inputusername}
							onBlur={ () => this.onBlurUser() }
							value={this.state.email}
							underlineColorAndroid = 'transparent'
							autoCorrect={false}
							placeholder="Email Address"
							maxLength={140}
							onSubmitEditing={() => { 
          						this.focusNextField('two');
          					}}
          					returnKeyType={ "next" }
 					        ref={ input => { 
 					        	this.inputs['one'] = input;
 					        }}
 					        onChangeText={(email) => this.setState({email})}
						/>
					</View>
					<View style ={commonStyles.iconpassword}>
						<Ionicons name="ios-lock-outline" 
						size={30} 
						color="#900"
						style= {{ padding: 10}}
						/>
						<TextInput
							style={commonStyles.inputpassword}
							value={this.state.password}
							underlineColorAndroid = 'transparent'
							autoCorrect={false}
							placeholder="Password"
							secureTextEntry
							maxLength={140}
							onSubmitEditing={() => { 
          						this.onSubmit();
          					}}
          					returnKeyType={ "done" }
 					        ref={ input => { 
 					        	this.inputs['two'] = input;
 					        }}
 					        onChangeText={(password) => this.setState({password})}
						/>
					</View>
				</View>
				<Button
  				onPress={() => this.onSubmit()}
  				title="Login"
  				color="#87cefa"
  				/>
				{errorStatus ? undefined : undefined}
				<View style={{alignItems: 'center'}}>
				<Text style={{ padding : 20 }}>Forgot password</Text>
				<Text style={{color : '#87cefa' }}>New Customer ?</Text>
				</View>
				<Button
					onPress = {this.createAcount.bind(this)}
  					title="Create An Acount"
  					color="orange"
  					/>
			</View>
		);
	}
	createAcount () { 
		routes.registerPage();
	}

	validate(){
		const {email, password} = this.state;
		let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ; 
		if(reg.test(email) === false) 
		{ 
			MessageBarManager.showAlert({
            message: "Please Enter Valid Email",
            alertType: 'alert',
            })
			return false;
		}
		if (!password.length)
		{
			MessageBarManager.showAlert({
            	message: "Please Enter Your Password",
            	alertType: 'alert',
        	})
			return false
		}
			return true;
	} 
	onSubmit() {
		const {email, password, os} = this.state;
		if (this.validate()) {
			this.setState({...INITIAL_STATE, loading: true});
			this.props.login(email, password, os);
		}
	}
}

export default Login;