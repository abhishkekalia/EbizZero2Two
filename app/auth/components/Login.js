import React, { Component, PropTypes } from 'react';
import {
	View,
	Text,
	ScrollView,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	Button,
	Platform,
	Image,
	Keyboard,
	Dimensions,
	NetInfo,
	Picker,
	TouchableHighlight,
	TouchableWithoutFeedback,
} from "react-native";
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {Actions as routes} from "react-native-router-flux";
import SettingsActions from 'app/Redux/SettingsRedux'
import I18n from 'react-native-i18n'
import DeviceInfo from 'react-native-device-info';
import {Loader} from "app/common/components";
import commonStyles from "app/common/styles";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import {CirclesLoader} from 'react-native-indicator';
import Modal from 'react-native-modal';
import Utils from 'app/common/Utils';
import ActionSheet from 'react-native-actionsheet';
import EventEmitter from "react-native-eventemitter";

const { width, height } = Dimensions.get('window')

const INITIAL_STATE = {email: '', password: ''};
const deviceId = DeviceInfo.getUniqueID();

const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 0

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
			arrLanguageType:['Cancel','عربي','English'],
		};
		this.inputs = {};
	}
	componentwillMount(){
		NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
        NetInfo.isConnected.fetch().done((isConnected) => { this.setState({ netStatus: isConnected }); });
        NetInfo.isConnected.fetch().done((isConnected) => {
			if (isConnected){
				this.gettermandcondition()
            }else{
                console.log(`is connected: ${this.state.netStatus}`);
            }
		});
		
		EventEmitter.removeAllListeners("hideLoader");
        EventEmitter.on("hideLoader", (value)=>{
            console.log("hideLoader", value);
            this.setState({
				visibleModal:false,
			})
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
		const { language} = this.props,
		align = (language === 'ar') ?  'right': 'left';

		this.setState({ netStatus: isConnected });
		{this.state.netStatus ? this.gettermandcondition() : MessageBarManager.showAlert({
			message: I18n.t('login.internetconnection', { locale: language }),
			alertType: 'extra',
			title:'',
			titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
			messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
		})}
	}
	focusNextField(id) {
		this.inputs[id].focus();
    }
    gettermandcondition(){
		fetch(Utils.gurl('gettermandcondition'),{
			method: "GET",
			headers: {
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
		this.setState({ isForgotPassword:  false});
		const { forgotemail } = this.state;
		const { language} = this.props,
		align = (language === 'ar') ?  'right': 'left';

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
			MessageBarManager.showAlert({
				message: I18n.t('forgotpassword.pleasecheckyourmail', { locale: language }),
				alertType: 'extra',
				title:'',
				titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
				messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
			})
			}else {
				MessageBarManager.showAlert({
					message: I18n.t('forgotpassword.usernotexists', { locale: language }),
					alertType: 'extra',
					title:'',
					titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
					messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
				})
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
		const { language} = this.props,
		align = (language === 'ar') ?  'right': 'left';

		if (!email.length){
			MessageBarManager.showAlert({
				message: I18n.t('login.pleaseenteremail', { locale: language }),
				alertType: 'extra',
				title:'',
				titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
				messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
			})
			return false
		}
		let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
		if(reg.test(email) === false){
			MessageBarManager.showAlert({
				message: I18n.t('login.pleaseenter_validemail', { locale: language }),
				alertType: 'extra',
				title:'',
				titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
				messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
			})
			return false;
		}
	}
	SampleFunction=(newLang)=>{
		this.props.languageChange(newLang)
	}
	onSkip(){
		console.log("country:=",this.props.country)
		this.props.skipSignIN(deviceId,String(this.props.country))
	}
	render() {
		const {errorStatus, loading, language, changeLanguage} = this.props;
		const {setParams} = this.props.navigation
		return (
			<View style={{flex:1}}>
				<View style= {{height:64,backgroundColor: '#a9d5d1', zIndex: 0}}>

					{Platform.OS === 'ios' ? 
					<TouchableWithoutFeedback style={{
						position:'absolute'
						}}onPress={this.onClickLanguage.bind(this)}>
						<View style={{
						height:25,
						width:80,
						// backgroundColor:'grey',
						position:'absolute',
						zIndex:50,
						marginTop:28,
						marginLeft:5,
						alignItems:'center',
						borderColor:'white',
						borderWidth:1,
						borderRadius:10,
						justifyContent:'center'
						}}>
						<Text style={{
							color:'white'
						}}>
							Language
						</Text>
						</View>
					</TouchableWithoutFeedback>
					:      
					// <TouchableHighlight style={{position:'absolute'}}onPress={this.onClickLanguage.bind(this)}>
						<View style={{
						height:25,
						width:80,
						// backgroundColor:'grey',
						position:'absolute',
						zIndex:50,
						marginTop:20,
						marginLeft:5,
						alignItems:'center',
						borderColor:'white',
						borderWidth:1,
						borderRadius:10,
						justifyContent:'center'
						}}>
						<TouchableWithoutFeedback style={{
							position:'absolute',
							height:'100%',  
							width:'100%',
						}}onPress={this.onClickLanguage.bind(this)}>
						<Text style={{
							textAlign:'center',
							color:'white',
						}}>
							Language
						</Text>
						</TouchableWithoutFeedback>
						</View>
				
					}

					<Text style = {{color : "#FFF", alignSelf: 'center', paddingTop: Platform.OS === 'ios' ? 28 : 22, fontSize:16}}>
						{I18n.t('login.logintitle', { locale: language })}
					</Text>
					{/* <View style={{ flexDirection: (language === 'ar') ? 'row' : 'row-reverse', zIndex: 1}}>
						{
							Object.keys(I18n.translations).map((item, key)=>( language === item ?
								undefined
								:
								<Text style={{ bottom:  Platform.OS === 'ios' ? 17 : 5, marginRight:Platform.OS === 'ios' ? 5 : 0, color: '#fff'}}
									key={key}
									// {I18n.translations[item].id }
									onPress={ this.SampleFunction.bind(this, item) }>
									{console.log("language:=",language)}
									{I18n.t('login.language', { locale: language })}
								</Text>)
							)
						}
					</View> */}
				</View>
				{ Platform.OS === 'ios' ? this.getIOSView() : this.getAndroidView()}
				<ActionSheet
					ref='laguageSheet'
					options={this.state.arrLanguageType}
					cancelButtonIndex={CANCEL_INDEX}
					onPress={this.onLanguageSelection.bind(this)}/>
			</View>
		);
	}
	
	onClickLanguage() {
		this.refs['laguageSheet'].show()
		console.log("language Id:=", this.state.languageId)
	}

	onLanguageSelection(selected) {
		console.log("onLanguageSelection clicked:=",selected);
		if(selected === 0) {
		  
		}
		else if (selected === 1) {
			this.props.languageChange('ar')
		}
		else if (selected === 2) {
			this.props.languageChange('en')
		}
	}

	getIOSView () {
		const {errorStatus, loading, language} = this.props;
		return(
			<ScrollView keyboardShouldPersistTaps={'handled'} showsVerticalScrollIndicator={false}>
				<View style={[commonStyles.container, commonStyles.content]} testID="Login">
					<View style={{
							flex : 1,
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems : 'center'}}>
						<Image
							source={require('../../images/login_img.png')}
							style={{ width : '100%', height : '50%',
							marginTop:10,
							resizeMode : 'contain' }}/>
						<Text style={{color: '#fbcdc5' , fontSize : 12, width : '100%', marginTop:20, textAlign:'center'}}>
							{I18n.t('login.loginmsg', { locale: language })}
						</Text>
					</View>
					<View style={{ padding : 20, top : 20}}>
						
							<View style ={[commonStyles.inputcontent,{borderColor:'#fbcdc5',borderWidth:0.5}]}>
								<View style ={[commonStyles.iconusername,{borderColor:'#fbcdc5', flexDirection: (this.props.language == 'ar') ? 'row-reverse' : 'row'}]}>
									<Ionicons
										name="ios-mail-outline"
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
									<Ionicons
										name="ios-lock-outline"
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
										onChangeText={(password) => this.setState({password})}/>
								</View>
							</View>
						
						<TouchableOpacity style ={{backgroundColor:"#a9d5d1", width:'100%', height:40, alignItems: 'center', justifyContent:'center', borderRadius:5}} onPress={()=> this.onSubmit()}>
							<Text style = {{color:"#FFFFFF"}}>{I18n.t('login.login_btn', { locale: language })}</Text>
						</TouchableOpacity>
						<TouchableOpacity style ={{marginTop : 10, backgroundColor:"#a9d5d1", width:'100%', height:40, alignItems: 'center', justifyContent:'center', borderRadius:5}} onPress={()=> this.onSkip()}>
							<Text style = {{color:"#FFFFFF"}}>{I18n.t('login.skip', { locale: language })}</Text>
						</TouchableOpacity>
						<View style={{alignItems: 'center'}}>
							<TouchableOpacity style ={{top:10,justifyContent: 'center', alignItems: 'center', padding: 10, borderColor: '#ccc', flexDirection: 'row', alignItems: 'center', padding:0}} onPress={()=> this.setState({isForgotPassword:true})}>
								<Text style={{top:10, padding : 20 }}>{I18n.t('login.forgotpassword', { locale: language })}</Text>
							</TouchableOpacity>
							<Text style={{color : '#87cefa' , padding : 20 }}>{I18n.t('login.newcustomer', { locale: language })}</Text>
						</View>
						<TouchableOpacity style ={{top:10,justifyContent: 'center', alignItems: 'center', padding: 10, borderColor: '#ccc', flexDirection: 'row', alignItems: 'center', padding:0}} onPress={this.createAcount.bind(this)}>
							<View style={{backgroundColor:"#FFCC7D", width:'100%', height:40, alignItems: 'center', justifyContent:'center', borderRadius:5}}>
								<Text style = {{color:"#FFFFFF"}}>{I18n.t('login.createaccountbtn', { locale: language })}</Text>
							</View>
						</TouchableOpacity>
						<Modal isVisible={this.state.visibleModal}>
							<View style={{alignItems : 'center', padding:10}}>
								{errorStatus ?  <View style={{ backgroundColor: '#fff', padding : 10, borderRadius :10}}><Text>{errorStatus}</Text></View> : undefined }
								{errorStatus ? <Text onPress = {()=> this.setState({ visibleModal : false})} style={{ color : '#fff', backgroundColor : 'transparent' ,padding : 20, borderRadius: 20 }}>Close</Text> : <CirclesLoader />}
							</View>
						</Modal>

					</View>
					<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 10, paddingTop: 10 }}>
						<View style={{flexDirection:(this.props.language == 'ar') ? 'row-reverse' : 'row', width:'100%', justifyContent:'center'}}>
							<TouchableOpacity onPress={()=> routes.terms({ title: this.state.termsandcondition_title, description: this.state.termsandcondition_description})}>
								<Text style={{color :'#6969', fontSize : 10,textAlign:'center' }}>
									{I18n.t('login.privacypolicy', { locale: language })}
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
				</View>
				<KeyboardSpacer/>
			</ScrollView>
		);
	}
	getAndroidView () {
		const {errorStatus, loading, language} = this.props;
		return(
			<ScrollView style={[commonStyles.container, commonStyles.content]} testID="Login" keyboardShouldPersistTaps="handled">
				<View style={{
						flex : 1,
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems : 'center'}}>
					<Image
						source={require('../../images/login_img.png')}
						style={{ width : '100%', height : '50%',
		 				marginTop:10,
		 				resizeMode : 'contain' }}/>
					<Text style={{color: '#fbcdc5' , fontSize : 12, width : '100%', marginTop:20, textAlign:'center'}}>
						{I18n.t('login.loginmsg', { locale: language })}
					</Text>
				</View>
				<View style={{ padding : 20, top : 20}}>
					<View style ={[commonStyles.inputcontent,{borderColor:'#fbcdc5',borderWidth:0.5}]}>
						<View style ={[commonStyles.iconusername,{borderColor:'#fbcdc5', flexDirection: (this.props.language == 'ar') ? 'row-reverse' : 'row'}]}>
							<Ionicons
								name="ios-mail-outline"
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
							<Ionicons
								name="ios-lock-outline"
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
								onChangeText={(password) => this.setState({password})}/>
						</View>
					</View>
					<TouchableOpacity style ={{backgroundColor:"#a9d5d1", width:'100%', height:40, alignItems: 'center', justifyContent:'center', borderRadius:5}} onPress={()=> this.onSubmit()}>
						<Text style = {{color:"#FFFFFF"}}>{I18n.t('login.login_btn', { locale: language })}</Text>
					</TouchableOpacity>
					<TouchableOpacity style ={{marginTop : 10, backgroundColor:"#a9d5d1", width:'100%', height:40, alignItems: 'center', justifyContent:'center', borderRadius:5}} onPress={()=> this.onSkip()}>
						<Text style = {{color:"#FFFFFF"}}>{I18n.t('login.skip', { locale: language })}</Text>
					</TouchableOpacity>
					<View style={{alignItems: 'center'}}>
						<TouchableOpacity style ={{top:10,justifyContent: 'center', alignItems: 'center', padding: 10, borderColor: '#ccc', flexDirection: 'row', alignItems: 'center', padding:0}} onPress={()=> this.setState({isForgotPassword:true})}>
							<Text style={{top:10, padding : 20 }}>{I18n.t('login.forgotpassword', { locale: language })}</Text>
						</TouchableOpacity>
						<Text style={{color : '#87cefa' , padding : 20 }}>{I18n.t('login.newcustomer', { locale: language })}</Text>
					</View>
					<TouchableOpacity style ={{top:10,justifyContent: 'center', alignItems: 'center', padding: 10, borderColor: '#ccc', flexDirection: 'row', alignItems: 'center', padding:0}} onPress={this.createAcount.bind(this)}>
						<View style={{backgroundColor:"#FFCC7D", width:'100%', height:40, alignItems: 'center', justifyContent:'center', borderRadius:5}}>
							<Text style = {{color:"#FFFFFF"}}>{I18n.t('login.createaccountbtn', { locale: language })}</Text>
						</View>
					</TouchableOpacity>
					<Modal isVisible={this.state.visibleModal}>
						<View style={{alignItems : 'center', padding:10}}>
							{errorStatus ?  <View style={{ backgroundColor: 'transparent', padding : 10, borderRadius :10}}><Text  style={{ color : '#fff', backgroundColor : 'transparent' }}>{I18n.t('login.passsnotmatch', { locale: language })}</Text></View> : undefined }
							{errorStatus ? <Text onPress = {()=> this.setState({ visibleModal : false})} style={{ color : '#fff', backgroundColor : '#a9d5d1' ,padding : 10, borderRadius: 10 , borderWidth: StyleSheet.hairlineWidth, borderColor: "#fff"}}>{I18n.t('login.close', { locale: language })}</Text> : <CirclesLoader />}
						</View>
					</Modal>
				</View>
				<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 10, paddingTop: 10 }}>
					<View style={{flexDirection:(this.props.language == 'ar') ? 'row-reverse' : 'row', width:'100%', justifyContent:'center'}}>
						<TouchableOpacity onPress={()=> routes.terms({ title: this.state.termsandcondition_title, description: this.state.termsandcondition_description})}>
							<Text style={{color :'#6969', fontSize : 10,textAlign:'center' }}>
								{I18n.t('login.privacypolicy', { locale: language })}
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
		const { language} = this.props,
		align = (language === 'ar') ?  'right': 'left';
		let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
		if(reg.test(email) === false){
			MessageBarManager.showAlert({
				message: I18n.t('login.pleaseenteremail', { locale: language }),
				alertType: 'extra',
				title:'',
				titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
				messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
			return false;
		}
		if (!password.length)
		{
			MessageBarManager.showAlert({
				message: I18n.t('login.pleaseenterpwd', { locale: language }),
				alertType: 'extra',
				title:'',
				titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
				messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
        	})
			return false
		}
		if (password.length < 6)
		{
			MessageBarManager.showAlert({
				message: I18n.t('login.passwordvalidation', { locale: language }),
				alertType: 'extra',
				title:'',
				titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
				messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
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
