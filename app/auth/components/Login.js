import React, {
	Component,
	PropTypes
} from 'react';
import {
	View,
	Text,
	ScrollView,
	TextInput,
	TouchableOpacity,
	Button,
	Platform,
	Image,
	Keyboard,
	Dimensions,
	NetInfo
} from "react-native";
import {Actions as routes} from "react-native-router-flux";
import {Loader} from "app/common/components";
import commonStyles from "app/common/styles";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import {CirclesLoader} from 'react-native-indicator';
import Modal from 'react-native-modal';
const { width, height } = Dimensions.get('window')
import Utils from 'app/common/Utils';

const INITIAL_STATE = {email: '', password: ''};

class Login extends Component {
	constructor() {
		super();
		this.state = {
      termsandcondition_title:'',
			termsandcondition_description:'',
			email: '',
			password: '',
			os : (Platform.OS === 'ios') ? 2 : 1,
			loading: false,
			visibleModal: false
		};
	    this.inputs = {};
	}
	componentwillMount(){
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);

        NetInfo.isConnected.fetch().done(
            (isConnected) => { this.setState({ netStatus: isConnected }); }
            );

        NetInfo.isConnected.fetch().done((isConnected) => {
            if (isConnected)
            {
            	this.gettermandcondition()
            }else{
                console.log(`is connected: ${this.state.netStatus}`);
            }
        });
    }
	componentDidMount(){
		this.gettermandcondition()
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
        NetInfo.isConnected.fetch().done((isConnected) => {
            this.setState({
                netStatus: isConnected
            });
        });
    }
    handleConnectionChange = (isConnected) => {
        this.setState({ netStatus: isConnected });
        {this.state.netStatus ? this.gettermandcondition() : MessageBarManager.showAlert({
                message: `Internet connection not available`,
                alertType: 'error',
            })
        }
    }

	focusNextField(id) {
    	this.inputs[id].focus();
    }
    gettermandcondition(){
        fetch(Utils.gurl('gettermandcondition'),{
             method: "GET", headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((responseData) => {
        	if (responseData.status) {
            	this.setState({
            	    termsandcondition_title: responseData.data.termsandcondition_title,
            	    termsandcondition_description: responseData.data.termsandcondition_description,
            	    loaded: true
        		});
        	}
		})
		.catch((error) => {
            console.log(error);
        }).done();
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
			<Text style={{color: '#fbcdc5' , fontSize : 12, width : '70%', marginTop:20}}>
			Use the email address and password used when you created your acount
			</Text>
			</View>

			<View style={{ padding : 20, top : 20}}>
				<View style ={[commonStyles.inputcontent,{borderColor:'#fbcdc5',borderWidth:0.5}]}>

					<View style ={[commonStyles.iconusername,{borderColor:'#fbcdc5'}]}>
						<Ionicons name="ios-mail-outline"
						size={30}
						color="#900"
						style= {{ padding: 10}}
						/>
						<TextInput
							style={[commonStyles.inputusername,{left:6.5}]}
							onBlur={ () => this.onBlurUser() }
							value={this.state.email}
							underlineColorAndroid = 'transparent'
							autoCorrect={false}
							keyboardType={'email-address'}
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
							style={[commonStyles.inputpassword,{}]}
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

				{/* <Button title ="Login" onPress={() => this.onSubmit()}  color="#a9d5d1"/> */}
				<TouchableOpacity style ={{top:10,justifyContent: 'center', alignItems: 'center', padding: 10, borderColor: '#ccc', flexDirection: 'row', alignItems: 'center', padding:0}} onPress={()=> this.onSubmit()}>
					<View style={{backgroundColor:"#a9d5d1", width:'100%', height:40, alignItems: 'center', justifyContent:'center', borderRadius:5}}>
							 <Text style = {{color:"#FFFFFF"}}>Login</Text>
					</View>
				</TouchableOpacity>

				<View style={{alignItems: 'center'}}>
				<Text style={{top:10, padding : 20 }}>Forgot your password</Text>
				<Text style={{color : '#87cefa' , padding : 20 }}>New Customer ?</Text>
				</View>
				{/* <Button title ="Create An Acount" onPress = {this.createAcount.bind(this)}   color="orange"/> */}
				<TouchableOpacity style ={{top:10,justifyContent: 'center', alignItems: 'center', padding: 10, borderColor: '#ccc', flexDirection: 'row', alignItems: 'center', padding:0}} onPress={this.createAcount.bind(this)}>
					<View style={{backgroundColor:"#FFCC7D", width:'100%', height:40, alignItems: 'center', justifyContent:'center', borderRadius:5}}>
							 <Text style = {{color:"#FFFFFF"}}>Create An Acount</Text>
					</View>
				</TouchableOpacity>

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
        	<Text style={{ fontSize : 10, width : width/2,}}>
			By Signing in you are agreeing to our
			</Text>
			<View style={{flexDirection:'row'}}>
			<TouchableOpacity
			onPress={()=> routes.terms({
  				title: this.state.termsandcondition_title,
  				description: this.state.termsandcondition_description
  			})}>
			<Text style={{color :'#a9d5d1', fontSize : 10, }}>
			terms and conditions
			</Text>
			</TouchableOpacity>
			<Text style={{color :'black', fontSize : 10, }}> of use and </Text>
			<TouchableOpacity
			onPress={()=> routes.terms({
  				title: this.state.termsandcondition_title,
  				description: this.state.termsandcondition_description
  			})}>
			<Text style={{color :'#fbcdc5', fontSize : 10, }}>
			 Privacy Policy
			</Text>
			</TouchableOpacity>
			</View>
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
	Keyboard.dismiss();
		const {email, password, os} = this.state;
		if (this.validate()) {
			this.setState({...INITIAL_STATE, visibleModal: true});
			this.props.login(email, password, os);
		}
	}
}

export default Login;
