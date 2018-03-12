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
	NetInfo,
	Picker
} from "react-native";
import {Actions as routes} from "react-native-router-flux";
import SettingsActions from 'app/Redux/SettingsRedux'
import I18n from 'react-native-i18n'

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
			visibleModal: false,
			isForgotPassword: false,
			forgotemail: '',
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
				title:''
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
Forgotpassword(){
	const { forgotemail } = this.state;
	let formData = new FormData();
	formData.append('email', String(forgotemail));
	const config = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data;',
                },
                body: formData,
            }
    fetch(Utils.gurl('Forgotpassword'), config)
    .then((response) => response.json())
    .then((responseData) => {
    	 if (responseData.response.status) {
				 alert('email sent')
    	}else {
				alert('you are not registerd user')
    	}
    })
		.then(()=>this.setState({
			isForgotPassword:false,
			forgotemail : '',
		 }))
    .catch(err => {
    	console.log(err);
    })
    .done();
}
	onBlurUser() {
		const { email } = this.state;
		if (!email.length)
		{
			MessageBarManager.showAlert({
				message: "Please Enter Email Address",
				alertType: 'alert',
				title:''
					})
			return false
		}

		let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;

		if(reg.test(email) === false)
			{
			MessageBarManager.showAlert({
            message: "Please Enter Email Address",
			alertType: 'alert',
			title:''
            })
			return false;
		}
	}
	_languageChanged = (changeLanguage, setParams) => (newLang) => {
    this.props.changeLanguage(newLang)
	this.props.languageChange(newLang)

    setParams({
      title: I18n.t('settings.title', { locale: newLang })
    })
  }
  SampleFunction=(newLang)=>{
	this.props.changeLanguage(newLang)
	this.props.languageChange(newLang)

  }
	render() {
		const {errorStatus, loading, language, changeLanguage} = this.props;
		const {setParams} = this.props.navigation
		return (
			<View style={{flex:1}}>
				<View style= {{height:64,backgroundColor: '#a9d5d1', zIndex: 0}}>
				<Text style = {{color : "#FFF", alignSelf: 'center', paddingTop:28, fontSize:16}}>
					Login into Zero2Two
				</Text>
				<View style={{ flexDirection: (language === 'ar') ? 'row' : 'row-reverse', zIndex: 1}}>
					{ Object.keys(I18n.translations).map((item, key)=>(
						language === item ? undefined: <Text
						style={{ bottom:  5, color: '#fff'}}
						key={key}
						// {I18n.translations[item].id }
						onPress={ this.SampleFunction.bind(this, item) }>
						{I18n.t('login.language', { locale: language })}
					</Text>
				)
			)}
		</View>

				</View>
				{
			Platform.OS === 'ios' ?
			this.getIOSView()
			:
			this.getAndroidView()
				}
			</View>
		);
	}

	getIOSView () {
		const {errorStatus, loading} = this.props;
		// <ScrollView style={[commonStyles.container, commonStyles.content]} testID="Login" keyboardShouldPersistTaps="handled">
		return(
			<View style={[commonStyles.container, commonStyles.content]} testID="Login">

			{/* navigationBarStyle={{ backgroundColor: '#a9d5d1' }}
                        titleStyle={{color : "#FFF", alignSelf: 'center'}}/> */}
		<View style={{ flex : 1,
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems : 'center'}}>
		<Image
		source={require('../../images/login_img.png')}
		style={{ width : '100%', height : '50%',
		 marginTop:10,
		 resizeMode : 'contain' }}
		/>
		<Text style={{color: '#fbcdc5' , fontSize : 12, width : '100%', marginTop:20, textAlign:'center'}}>
		Use the email address and password used {'\n'} when you created your acount
		</Text>
		</View>

		<View style={{ padding : 20, top : 20}}>
			<View style ={[commonStyles.inputcontent,{borderColor:'#fbcdc5',borderWidth:0.5}]}>

				<View style ={[commonStyles.iconusername,{borderColor:'#fbcdc5'}]}>
					<Ionicons name="ios-mail-outline"
					size={30}
					color="#fbcdc5"
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
					color="#fbcdc5"
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
			<TouchableOpacity style ={{top:10,justifyContent: 'center', alignItems: 'center', padding: 10, borderColor: '#ccc', flexDirection: 'row', alignItems: 'center', padding:0}} onPress={()=> this.setState({isForgotPassword:true})}>
			<Text style={{top:10, padding : 20 }}>Forgot your password?</Text>
			</TouchableOpacity>
			<Text style={{color : '#87cefa' , padding : 20 }}>New Customer?</Text>
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
		alignItems: 'center',
				// marginTop: 10,
				// paddingTop: 10
	}}>
		<Text style={{ fontSize : 10, width : '100%', textAlign:'center'}}>
		By Signing in you are agreeing to our
		</Text>
		<View style={{flexDirection:'row', width:'100%', justifyContent:'center'}}>
		<TouchableOpacity
		onPress={()=> routes.terms({
			  title: this.state.termsandcondition_title,
			  description: this.state.termsandcondition_description
		  })}>
		<Text style={{color :'#a9d5d1', fontSize : 10,textAlign:'center' }}>
		Terms and Conditions
		</Text>
		</TouchableOpacity>
		<Text style={{color :'#696969', fontSize : 10, textAlign:'center'}}> of use and </Text>
		<TouchableOpacity
		onPress={()=> routes.terms({
			  title: this.state.termsandcondition_title,
			  description: this.state.termsandcondition_description
		  })}>
		<Text style={{color :'#fbcdc5', fontSize : 10, textAlign:'center'}}>
		 Privacy Policy
		</Text>
		</TouchableOpacity>
		</View>
	</View>

	<Modal isVisible={this.state.isForgotPassword}>
			<View style={{alignItems : 'center', padding:10, backgroundColor: '#fff'}}>
			<View style ={[commonStyles.iconusername,{borderColor:'#fbcdc5'}]}>
				<Ionicons name="ios-mail-outline"
				size={30}
				color="#fbcdc5"
				style= {{ padding: 10}}
				/>
				<TextInput
					style={[commonStyles.inputusername,{left:6.5}]}
					onBlur={ () => this.onBlurUser() }
					value={this.state.forgotemail}
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
							onChangeText={(forgotemail) => this.setState({forgotemail})}
				/>
			</View>
			<View style={{flexDirection: 'row', height: 40}}>
			<TouchableOpacity
			onPress={()=> this.setState({ isForgotPassword:  false})}>
			<Text style={{color :'#fbcdc5', fontSize : 15, textAlign:'center', height: 25, margin: 10, width: '80%'}}>
			 Cancel
			</Text>
			</TouchableOpacity>
			<TouchableOpacity
			onPress={()=> this.Forgotpassword()}>
			<Text style={{color :'#fbcdc5', fontSize : 15, textAlign:'center', height: 25, margin: 10, width: '80%'}}>
			 Submit
			</Text>
			</TouchableOpacity>
			</View>
			</View>
	</Modal>
		{/* </ScrollView> */}
		</View>

		);
	}

	getAndroidView () {
		const {errorStatus, loading, language} = this.props;
		return(
			<ScrollView style={[commonStyles.container, commonStyles.content]} testID="Login" keyboardShouldPersistTaps="handled">
		<View style={{ flex : 1,
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems : 'center'}}>
		<Image
		source={require('../../images/login_img.png')}
		style={{ width : '100%', height : '50%',
		 marginTop:10,
		 resizeMode : 'contain' }}
		/>
		<Text style={{color: '#fbcdc5' , fontSize : 12, width : '100%', marginTop:20, textAlign:'center'}}>
			{I18n.t('login.loginmsg', { locale: language })}
		</Text>
		</View>

		<View style={{ padding : 20, top : 20}}>
			<View style ={[commonStyles.inputcontent,{borderColor:'#fbcdc5',borderWidth:0.5}]}>

				<View style ={[commonStyles.iconusername,{borderColor:'#fbcdc5', flexDirection: (this.props.language == 'ar') ? 'row-reverse' : 'row'}]}>
					<Ionicons name="ios-mail-outline"
					size={30}
					color="#fbcdc5"
					style= {{ padding: 10, width: '20%'}}
					/>
					<TextInput
						style={[commonStyles.inputusername,{ textAlign: (this.props.language == 'ar') ? 'right' : 'left', width: '80%'}]}
						onBlur={ () => this.onBlurUser() }
						value={this.state.email}
						underlineColorAndroid = 'transparent'
						autoCorrect={false}
						keyboardType={'email-address'}
						placeholder={I18n.t('login.emailaddress', { locale: language })}
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
				<View style ={[commonStyles.iconpassword, {flexDirection: (this.props.language == 'ar') ? 'row-reverse' : 'row'}]}>
					<Ionicons name="ios-lock-outline"
					size={30}
					color="#fbcdc5"
					style= {{ padding: 10, width: '20%'}}
					/>
					<TextInput
						style={[commonStyles.inputpassword,{textAlign: (this.props.language == 'ar') ? 'right' : 'left',  width: '80%'}]}
						value={this.state.password}
						underlineColorAndroid = 'transparent'
						autoCorrect={false}
						placeholder={I18n.t('login.password', { locale: language })}
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
						 <Text style = {{color:"#FFFFFF"}}>{I18n.t('login.login_btn', { locale: language })}</Text>
				</View>
			</TouchableOpacity>

			<View style={{alignItems: 'center'}}>
			<TouchableOpacity style ={{top:10,justifyContent: 'center', alignItems: 'center', padding: 10, borderColor: '#ccc', flexDirection: 'row', alignItems: 'center', padding:0}} onPress={()=> this.setState({isForgotPassword:true})}>
			<Text style={{top:10, padding : 20 }}>{I18n.t('login.forgotpassword', { locale: language })}</Text>
			</TouchableOpacity>
			<Text style={{color : '#87cefa' , padding : 20 }}>{I18n.t('login.newcustomer', { locale: language })}</Text>
			</View>
			{/* <Button title ="Create An Acount" onPress = {this.createAcount.bind(this)}   color="orange"/> */}
			<TouchableOpacity style ={{top:10,justifyContent: 'center', alignItems: 'center', padding: 10, borderColor: '#ccc', flexDirection: 'row', alignItems: 'center', padding:0}} onPress={this.createAcount.bind(this)}>
				<View style={{backgroundColor:"#FFCC7D", width:'100%', height:40, alignItems: 'center', justifyContent:'center', borderRadius:5}}>
						 <Text style = {{color:"#FFFFFF"}}>{I18n.t('login.createaccountbtn', { locale: language })}</Text>
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
		alignItems: 'center',
				marginTop: 10,
				paddingTop: 10
	}}>
		<Text style={{ fontSize : 10, width : '100%', textAlign:'center'}}>
			{I18n.t('login.privacypolicy1', { locale: language })}
		</Text>
		<View style={{flexDirection:(this.props.language == 'ar') ? 'row-reverse' : 'row', width:'100%', justifyContent:'center'}}>
		<TouchableOpacity
		onPress={()=> routes.terms({
			  title: this.state.termsandcondition_title,
			  description: this.state.termsandcondition_description
		  })}>
		<Text style={{color :'#a9d5d1', fontSize : 10,textAlign:'center' }}>
			{I18n.t('login.privacypolicy2', { locale: language })}
		</Text>
		</TouchableOpacity>
		<Text style={{color :'#696969', fontSize : 10, textAlign:'center'}}>{I18n.t('login.privacypolicy3', { locale: language })} </Text>
		<TouchableOpacity
		onPress={()=> routes.terms({
			  title: this.state.termsandcondition_title,
			  description: this.state.termsandcondition_description
		  })}>
		<Text style={{color :'#fbcdc5', fontSize : 10, textAlign:'center'}}>
			{I18n.t('login.privacypolicy4', { locale: language })}
		</Text>
		</TouchableOpacity>
		</View>
	</View>

	<Modal isVisible={this.state.isForgotPassword}>
			<View style={{alignItems : 'center', padding:10, backgroundColor: '#fff'}}>
			<View style ={[commonStyles.iconusername,{borderColor:'#fbcdc5', flexDirection: (this.props.language == 'ar') ? 'row-reverse' : 'row', height :40}]}>
				<Ionicons name="ios-mail-outline"
				size={30}
				color="#fbcdc5"
				style= {{width: '20%', alignItems: 'center', textAlign: 'center', justifyContent: 'center'}}
				/>
				<TextInput
					style={[commonStyles.inputusername,{width: '80%', textAlign: (this.props.language == 'ar') ? 'right' : 'left'}]}
					onBlur={ () => this.onBlurUser() }
					value={this.state.forgotemail}
					underlineColorAndroid = 'transparent'
					autoCorrect={false}
					keyboardType={'email-address'}
					placeholder={I18n.t('login.emailaddress', { locale: language })}
					maxLength={140}
					onSubmitEditing={() => {
									this.focusNextField('two');
								}}
								returnKeyType={ "done" }
							ref={ input => {
								this.inputs['one'] = input;
							}}
				onChangeText={(forgotemail) => this.setState({forgotemail})}
				/>
			</View>
			<View style={{flexDirection: (this.props.language == 'ar') ? 'row-reverse' : 'row', height: 40}}>
			<TouchableOpacity
			onPress={()=> this.setState({ isForgotPassword:  false})}>
			<Text style={{color :'#fbcdc5', fontSize : 15, textAlign:'center', height: 25, margin: 10, width: '80%'}}>
			 {I18n.t('login.cancel', { locale: language })}
			</Text>
			</TouchableOpacity>
			<TouchableOpacity
			onPress={()=> this.Forgotpassword()}>
			<Text style={{color :'#fbcdc5', fontSize : 15, textAlign:'center', height: 25, margin: 10, width: '80%'}}>
				{I18n.t('login.submit', { locale: language })}
			</Text>
			</TouchableOpacity>
			</View>
			</View>
	</Modal>
		</ScrollView>
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
			title:''
            })
			return false;
		}
		if (!password.length)
		{
			MessageBarManager.showAlert({
            	message: "Please Enter Your Password",
				alertType: 'alert',
				title:''
        	})
			return false
		}
		if (password.length < 4)
		{
			MessageBarManager.showAlert({
							message: "Password Must have Six Character",
				alertType: 'alert',
				title:''
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
