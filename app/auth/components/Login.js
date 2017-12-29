import React, { 
	Component, 
	PropTypes
} from 'react';

import { 
	View, 
	Text, 
	TextInput, 
	TouchableOpacity, 
	Button,
	Platform,
	Image,
	Dimensions
} from "react-native";
import {Actions as routes} from "react-native-router-flux";
import {Loader} from "app/common/components";
import commonStyles from "app/common/styles";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import {CirclesLoader} from 'react-native-indicator';
import Modal from 'react-native-modal';
const { width, height } = Dimensions.get('window')

const INITIAL_STATE = {email: '', password: ''};

class Login extends Component {
	constructor() {
		super();
		this.state = {
			email: '', 
			password: '',
			os : (Platform.OS === 'ios') ? 2 : 1,
			loading: false,
			visibleModal: false

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
			<View style={{ flex : 1, 
				flexDirection: 'column',
                justifyContent: 'center', 
                alignItems : 'center'}}>
			<Image 
			source={require('../../images/login_img.png')}
			style={{ width : '25%', height : '50%' }}
			/>	
			<Text style={{color: '#f53d3d' , fontSize : 10, width : width/2}}> 
			Use the email address and password used when you created your acount
			</Text>
			</View>	

			<View style={{ padding : 20, top : 30}}>		
				<View style ={[commonStyles.inputcontent,]}>
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

				<Button title ="Login" onPress={() => this.onSubmit()}  color="#a9d5d1"/>

				<View style={{alignItems: 'center'}}>
				<Text style={{ padding : 20 }}>Forgot password</Text>
				<Text style={{color : '#87cefa' , padding : 20 }}>New Customer ?</Text>
				</View>
				<Button title ="Create An Acount" onPress = {this.createAcount.bind(this)}   color="orange"/>

  					<Modal isVisible={this.state.visibleModal}>
  					<View style={{alignItems : 'center', padding:10}}>
				    {errorStatus ?  <View style={{ backgroundColor: '#fff', padding : 10, borderRadius :10}}><Text>{errorStatus}</Text></View> : undefined }
				    
				    {errorStatus ? <Text 
					onPress = {()=> this.setState({ visibleModal : false})} 
					style={{ color : '#fff', backgroundColor : 'transparent' ,padding : 20, borderRadius: 20 }}>Close</Text> : <CirclesLoader />}
					
				</View>
        	</Modal>
		</View>
		<View style={{ 
			flex: 1,
        	flexDirection: 'column',
        	justifyContent: 'center',
        	alignItems: 'center'
        }}>
        	<Text style={{ fontSize : 10, width : width/2}}> 
			By Signing in you are agreeing to our terms and conditions of use and Privacy Policy
			</Text>
		</View>
	
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
			this.setState({...INITIAL_STATE, visibleModal: true});
			this.props.login(email, password, os);
		}
	}
}

export default Login;