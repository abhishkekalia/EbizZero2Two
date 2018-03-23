import React, {Component, PropTypes} from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Button,
	Switch,
	ScrollView,
	Platform,
	Dimensions,
	Keyboard,
	StyleSheet,
	Image
} from "react-native";
import {Loader} from "app/common/components";
import commonStyles from "app/common/styles";
import {Actions as routes} from "react-native-router-flux";
import Ionicons from 'react-native-vector-icons/EvilIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SegmentedControls } from 'react-native-radio-buttons';
import Utils from 'app/common/Utils';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import { Picker } from 'react-native-picker-dropdown';
import {connect} from 'react-redux';
import I18n from 'react-native-i18n';

import FontAwesome from 'react-native-vector-icons/Feather';
import ActionSheet from 'react-native-actionsheet';
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 0
const countryTitle = 'Select Country'
const { width, height } = Dimensions.get('window')

const INITIAL_STATE = {
	company: '',
	representative_name:'',
    selectCountry: '',
	email: '',
	password: '',
	gender : '',
	contact: '',
	country: '',
	address: '',
	facebook_id : '',
	twitter_id : '',
	instagram_id : '',
	snapchat_id	: '',
};
// const options = [
// 	{ label:'Male', value: 'male' },
//     { label:'Female', value: 'female'},
//     { label:'Other', value: 'other' }];

class Vendorreg extends Component {
	constructor(props) {
		super(props);
		this.toggleSwitch = this.toggleSwitch.bind(this);
	    this.focusNextField = this.focusNextField.bind(this);
    	this.state = {
            userTypes: [],
            selectCountry: '',
			company: '',
			representative_name:'',
			email: '',
			password: '',
			gender : '',
			contact: '',
			address: '',
			hidden : true,
			facebook_id : '',
			twitter_id : '',
			instagram_id : '',
			snapchat_id	: '',
			type : '3',
			os : (Platform.OS === 'ios') ? 2 : 1,
			countries: ["0"],
		};
	    this.inputs = {};
		this.showCountrysheet = this.showCountrysheet.bind(this)
		this.handlePress = this.handlePress.bind(this)
	}
	componentDidMount(){
        this.fetchData();
    }
    focusNextField(id) {
    	this.inputs[id].focus();
    }
    eye() {
    	this.setState({
    		hidden : !this.state.hidden
    	})
    }
    fetchData(){
		fetch(Utils.gurl('countryList'),{
             method: "GET",
			 headers: {
				 'Accept': 'application/json',
				 'Content-Type': 'application/json'
			 }
		 })
        .then((response) => response.json())
        .then((responseData) => {
			var data = responseData.response.data,
			length = data.length,
			optionsList= []
			optionsList.push('Cancel');

			for(var i=0; i < length; i++) {
				order = data[i];
				country_name = order.country_name;
				optionsList.push(country_name);
			}
			this.setState({
				userTypes: responseData.response.data,
				loaded: true,
				countries: optionsList
			});
		}).done();
	}
	toggleSwitch() {
	 	this.setState({ showPassword: !this.state.showPassword });
	 }
	 setSelectedOption(option){
     	this.setState({
        	gender: option,
      	});
    }
    loadUserTypes() {
        return this.state.userTypes.map(user => (
            <Picker.Item key={user.country_id} label={user.country_name} value={user.country_id} />
        ))
	}
	showCountrysheet() {
		this.countrySheet.show()
	}
	handlePress(i) {
		if(i === 0){
			this.setState({
				selectCountry: '',
			})
		}else{
			console.log("userTypes:=",this.state.userTypes[i-1].country_id)
			this.setState({
				selectCountry: this.state.userTypes[i-1].country_id.toString()
			})
		}
	}
	render() {
		const { lang , errorStatus, loading} = this.props,
		direction = lang == 'ar'? 'row-reverse': 'row',
		textline = lang == 'ar'? 'right': 'left',
		align = lang == 'ar'? 'flex-end': 'flex-start',
		options = [
			{ label:I18n.t('userregister.male', { locale: lang }), value: I18n.t('userregister.male', { locale: lang })},
			{ label:I18n.t('userregister.female', { locale: lang }), value: I18n.t('userregister.female', { locale: lang })},
			// { label:I18n.t('userregister.other', { locale: lang }), value: I18n.t('userregister.other', { locale: lang })},
		];
		let icon = this.state.hidden ? 'checkbox-blank-outline' : 'checkbox-marked' ;
		var selCountryObj = null
		for (let index = 0; index < this.state.userTypes.length; index++) {
			let element = this.state.userTypes[index];
			if (element.country_id == this.state.selectCountry) {
				selCountryObj = element
			}
		}
		return (
			<ScrollView
				showsVerticalScrollIndicator ={false}
				style={[ commonStyles.content]}
				testID="Login"
				keyboardShouldPersistTaps={'handled'}>
				<View>
					<View style ={[commonStyles.registerContent, {marginBottom : 10, borderColor:'#fbcdc5'}]}>
						<View style ={[commonStyles.iconusername, { borderColor : '#fbcdc5'}]}>
							<TextInput
								style={[commonStyles.inputusername, { borderTopLeftRadius : 10, borderTopRightRadius:10, height:40, textAlign: textline, marginLeft : lang == 'ar'? 0 : 5}]}
								value={this.state.company}
								underlineColorAndroid = 'transparent'
								autoCorrect={false}
								placeholder={I18n.t('venderregister.company', { locale: lang })}
								maxLength={140}
								onSubmitEditing={() => {
									this.focusNextField('two');
								}}
								returnKeyType={ "next" }
								ref={ input => {
									this.inputs['one'] = input;
								}}
								onChangeText={(company) => this.setState({company})}
								/>
						</View>
						<View style ={commonStyles.iconusername}>
							<TextInput
								style={[commonStyles.inputusername, {  height:40, textAlign: textline, marginLeft : lang == 'ar'? 0 : 5}]}
								value={this.state.representative_name}
								underlineColorAndroid = 'transparent'
								autoCorrect={false}
								placeholder={I18n.t('venderregister.representative_name', { locale: lang })}
								maxLength={140}
								onSubmitEditing={() => {
									this.focusNextField('three');
								}}
								returnKeyType={ "next" }
								ref={ input => {
									this.inputs['two'] = input;
								}}
								onChangeText={(representative_name) => this.setState({representative_name})}
								/>
						</View>
						<View style ={commonStyles.iconusername}>
							<TextInput
								style={[commonStyles.inputusername, {  height:40, textAlign: textline, marginLeft : lang == 'ar'? 0 : 5}]}
								value={this.state.contact}
								underlineColorAndroid = 'transparent'
								autoCorrect={false}
								placeholder={I18n.t('venderregister.mobilenumber', { locale: lang })}
								maxLength={140}
								keyboardType={'numeric'}
								onSubmitEditing={() => {
									this.focusNextField('four');
								}}
								returnKeyType={ "next" }
								ref={ input => {
									this.inputs['three'] = input;
								}}
								onChangeText={(contact) => this.setState({contact})}
								/>
						</View>
						<View style ={commonStyles.iconusername}>
							<TextInput
								style={[commonStyles.inputusername, {  height:40, textAlign: textline, marginLeft : lang == 'ar'? 0 : 5}]}
								value={this.state.email}
								underlineColorAndroid = 'transparent'
								autoCorrect={false}
								placeholder={I18n.t('venderregister.email', { locale: lang })}
								maxLength={140}
								keyboardType={'email-address'}
								onSubmitEditing={() => {
									this.focusNextField('five');
								}
							}
							returnKeyType={ "next" }
							ref={ input => {
								this.inputs['four'] = input;
							}}
							onChangeText={(email) => this.setState({email})}/>
					</View>
					<View style ={commonStyles.iconusername}>
						<TextInput
							style={[commonStyles.inputusername, {  height:40, textAlign: textline, marginLeft : lang == 'ar'? 0 : 5}]}
							value={this.state.address}
							underlineColorAndroid = 'transparent'
							autoCorrect={false}
							placeholder={I18n.t('venderregister.address', { locale: lang })}
							maxLength={140}
							onSubmitEditing={() => {
								this.focusNextField('Six');
							}}
							returnKeyType={ "next" }
							ref={ input => {
								this.inputs['five'] = input;
							}}
							onChangeText={(address) => this.setState({address})}/>
					</View>
					<View style ={[commonStyles.iconusername, { alignItems: 'center'}]}>
						<TextInput
							style={[commonStyles.inputusername, {  height:40, textAlign: textline, marginLeft : lang == 'ar'? 0 : 5}]}
							secureTextEntry={this.state.hidden}
							value={this.state.password}
							underlineColorAndroid = 'transparent'
							autoCorrect={false}
							placeholder={I18n.t('venderregister.password', { locale: lang })}
							maxLength={140}
							onSubmitEditing={() => {
								this.focusNextField('seven');
							}}
							returnKeyType={ "next" }
							ref={ input => {
								this.inputs['Six'] = input;
							}}
							onChangeText={ (password) => this.setState({ password }) }/>
					</View>
					<TouchableOpacity style ={{
							flexDirection: direction, borderBottomColor:'#fbcdc5',
							alignItems: 'center',
							padding: 10,
							borderBottomWidth: StyleSheet.hairlineWidth,
							borderColor: '#ccc'
						}} onPress={()=> this.eye()}>
						<Icon name= {icon} size={25} color="#FFCC7D" style={ lang == 'ar' ? { right : 10} :{ right : 10}  }/>
						<Text style={{textAlign: textline}}>{I18n.t('userregister.showpassword', { locale: lang })}</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={this.showCountrysheet} style={[commonStyles.iconusername, {
							flexDirection: direction,
							justifyContent: 'space-between',
							alignItems: 'center' ,
							marginBottom : 5,
							paddingLeft:5,
							height:40,
							overflow:'hidden',
							borderBottomWidth:0
						}]}>
						{!this.state.selectCountry? undefined:
							<Image style={{height:40, width:40}}
								resizeMode = 'center'
								resizeMethod = 'resize'
								source={{uri : selCountryObj ? selCountryObj.flag : "" }}
								onLoadEnd={() => {  }}
								/>
						}
						<Text style={{ }} >{this.state.selectCountry? selCountryObj.country_name  : this.state.selectCountry }</Text>
						<FontAwesome name="chevron-down" size={20} color="#FFCC7D" style={{padding:5, marginRight:5}}/>
						{!this.state.selectCountry? <Text style={{position:'absolute', marginLeft:5, fontSize:12}} onPress={()=>console.log("echo")}>{I18n.t('userregister.selectcountry', { locale: lang })}</Text>: undefined}
					</TouchableOpacity>
					<ActionSheet
						ref={o => this.countrySheet = o}
						// title={!this.state.selectCountry? this.state.selectCountry : selCountryObj.country_name  }
						options={this.state.countries}
						cancelButtonIndex={CANCEL_INDEX}
						// destructiveButtonIndex={DESTRUCTIVE_INDEX}
						onPress={this.handlePress}/>
				</View>
				<Text style={{ paddingTop:5,paddingBottom:5, textAlign: textline}}>{I18n.t('venderregister.addsocialmedia', { locale: lang })}</Text>
				<View style ={[commonStyles.registerContent, {marginBottom : 10}]}>
					<View style ={[commonStyles.iconusername, { alignItems : 'center', flexDirection:direction,}]}>
						<Ionicons name="sc-facebook" size={25} color="#3b5998"  style={commonStyles.social}/>
						<TextInput
							style={[commonStyles.socialInput,{height:40, textAlign: textline, }]}
							value={this.state.facebook_id}
							underlineColorAndroid = 'transparent'
							autoCorrect={false}
							placeholder={I18n.t('venderregister.fb_page', { locale: lang })}
							maxLength={140}
							keyboardType={'default'}
							onSubmitEditing={() => {
								this.focusNextField('eight');
							}}
							returnKeyType={ "next" }
							ref={ input => {
								this.inputs['seven'] = input;
							}}
							onChangeText={(facebook_id) => this.setState({facebook_id})}
							/>
					</View>
					<View style ={[commonStyles.iconusername, {flexDirection:direction, alignItems : 'center'}]}>
						<Icon name="twitter" size={25} color="#0084b4"  style={commonStyles.social}/>
						<TextInput
							style={[commonStyles.socialInput,{height:40, textAlign: textline, }]}
							value={this.state.twitter_id}
							underlineColorAndroid = 'transparent'
							autoCorrect={false}
							placeholder={I18n.t('venderregister.twitter_page', { locale: lang })}
							maxLength={140}
							keyboardType={'default'}
							onSubmitEditing={() => {
								this.focusNextField('nine');
							}}
							returnKeyType={ "next" }
							ref={ input => {
								this.inputs['eight'] = input;
							}}
							onChangeText={(twitter_id) => this.setState({twitter_id})}/>
					</View>
					<View style ={[commonStyles.iconusername, {flexDirection:direction, alignItems : 'center'}]}>
						<Icon name="instagram" size={25} color="#a9d5d1"  style={commonStyles.social}/>
						<TextInput
							style={[commonStyles.socialInput,{height:40, textAlign: textline, }]}
							value={this.state.instagram_id}
							underlineColorAndroid = 'transparent'
							autoCorrect={false}
							placeholder={I18n.t('venderregister.insta_page', { locale: lang })}
							maxLength={140}
							keyboardType={'default'}
							onSubmitEditing={() => {
								this.focusNextField('ten');
							}}
							returnKeyType={ "next" }
							ref={ input => {
								this.inputs['nine'] = input;
							}}
							onChangeText={(instagram_id) => this.setState({instagram_id})}/>
					</View>
					<View style ={{ flexDirection:direction,
							backgroundColor : 'transparent',
							alignItems : 'center'
						}}>
						<Icon name="snapchat" size={25} color="#FFCC7D"  style={commonStyles.social}/>
						<TextInput
							style={[commonStyles.socialInput,{height:40, textAlign: textline, }]}
							value={this.state.snapchat_id }
							underlineColorAndroid = 'transparent'
							autoCorrect={false}
							placeholder={I18n.t('venderregister.snap_page', { locale: lang })}
							maxLength={140}
							keyboardType={'default'}
							onSubmitEditing={() => {
								this.onSubmit()
							}}
							returnKeyType={ "done" }
							ref={ input => {
								this.inputs['ten'] = input;
							}}
							onChangeText={(snapchat_id) => this.setState({snapchat_id})}/>
					</View>
				</View>
			</View>
			<TouchableOpacity style ={{justifyContent: 'center', alignItems: 'center', padding: 10, borderColor: '#fbcdc5', flexDirection: 'row', alignItems: 'center', padding:0}} onPress={this.onSubmit.bind(this)}>
				<View style={{backgroundColor:"#FFCC7D", width:'100%', height:40, alignItems: 'center', justifyContent:'center', borderRadius:5}}>
					<Text style = {{color:"#FFFFFF"}}>{I18n.t('venderregister.createbtn', { locale: lang })}</Text>
				</View>
			</TouchableOpacity>
		</ScrollView>
		);
	}
	validate(){
		const {company, representative_name, contact, email,
			address, password, gender,  selectCountry,
			facebook_id, twitter_id, instagram_id, snapchat_id } = this.state;
			const { lang } = this.props,
			align = lang === 'ar' ? "right" : "left";

			const emailArr = email.split('.');


			if (!company.length){
				MessageBarManager.showAlert({
					message: I18n.t('venderregister.pleaseentercompany', { locale: lang }),
					title:'',
					alertType: 'extra',
					titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
					messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
				})
				return false
			}
			if (!representative_name.length){
				MessageBarManager.showAlert({
					message: I18n.t('venderregister.pleaseenterrepresentative', { locale: lang }),
					title:'',
					alertType: 'extra',
					titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
					messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
				})
				return false
			}
			if (!contact.length){
				MessageBarManager.showAlert({
					message: I18n.t('venderregister.pleaseentercontact', { locale: lang }),
					title:'',
					alertType: 'extra',
					titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
					messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
				})
				return false
			}
			if(contact.length !== 12){
				MessageBarManager.showAlert({
					message: "Please enter valid Mobile number ",
					title:'',
					alertType: 'extra',
					titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
					messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
				})
				return false
			}

			let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
			if(reg.test(email) === false){
				MessageBarManager.showAlert({
					message: I18n.t('venderregister.pleaseenteremail', { locale: lang }),
					title:'',
					alertType: 'extra',
					titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
					messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
				})
				return false;
			}
			if(emailArr[emailArr.length- 1] !== "com"){
				MessageBarManager.showAlert({
					message: I18n.t('venderregister.maildomain', { locale: lang }),
					title:'',
					alertType: 'extra',
					titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
					messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
				});
				return false;
			}
			if (!address.length){
				MessageBarManager.showAlert({
					message: I18n.t('venderregister.pleaseenteraddr', { locale: lang }),
					title:'',
					alertType: 'extra',
					titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
					messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
				})
				return false
			}
			if (!password.length){
				MessageBarManager.showAlert({
					message: I18n.t('venderregister.pleaseenterpwd', { locale: lang }),
					title:'',
					alertType: 'extra',
					titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
					messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
        	})
			return false
		}
		if(password.length < 6){
			MessageBarManager.showAlert({
				message: "Please enter atleast 6 character password ",
				title:'',
				alertType: 'extra',
				titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
				messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
			})
			return false
		}
		if (!selectCountry.length){
			MessageBarManager.showAlert({
				message: I18n.t('venderregister.pleaseselectcountry', { locale: lang }),
				title:'',
				alertType: 'extra',
				titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
				messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
        	})
			return false
		}
		if (!facebook_id.length){
			MessageBarManager.showAlert({
				message: I18n.t('venderregister.fbpage', { locale: lang }),
				title:'',
				alertType: 'extra',
				titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
				messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
        	})
			return false
		}
		if (!twitter_id.length){
			MessageBarManager.showAlert({
				message: I18n.t('venderregister.twitterpage', { locale: lang }),
				title:'',
				alertType: 'extra',
				titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
				messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
			})
			return false
		}
		if (!instagram_id.length){
			MessageBarManager.showAlert({
				message: I18n.t('venderregister.instapage', { locale: lang }),
				title:'',
				alertType: 'extra',
				titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
				messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
			})
			return false
		}
		if (!snapchat_id.length){
			MessageBarManager.showAlert({
				message: I18n.t('venderregister.snapchatpage', { locale: lang }),
				title:'',
				alertType: 'extra',
				titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
				messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
			})
			return false
		}
		return true;
	}
	onSubmit() {
		Keyboard.dismiss();
		const {company, representative_name, email, password, gender, contact, selectCountry, os, address, type,
			facebook_id, twitter_id, instagram_id, snapchat_id
		} = this.state;
		let formData = new FormData();
		formData.append('fullname', String(company));
		formData.append('email', String(email));
		formData.append('password', String(password));
		formData.append('gender', String(gender.value));
		formData.append('phone_no', String(contact));
		formData.append('country', String(selectCountry));
		formData.append('user_type', String(type));
		formData.append('device_type', String(os));
		formData.append('device_token', String('ADFCVNGWRETUOP'));
		formData.append('address', String(address));
		formData.append('representative_name', String(representative_name));
		formData.append('facebook_id', String(facebook_id));
		formData.append('twitter_id', String(twitter_id));
		formData.append('instagram_id', String(instagram_id));
		formData.append('snapchat_id', String(snapchat_id));
		// formData.append('card_number', String('343454645664'));
		// formData.append('expiry_month', String('3'));
		// formData.append('expiry_year', String('20'));
		// formData.append('cvv', String('456'));
		if(this.validate()) {
			this.setState({...INITIAL_STATE, loading: true});
			const config = {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'multipart/form-data;',
				},
				body: formData,
			}
			fetch(Utils.gurl('register'), config)
			.then((response) => response.json())
			.then((responseData) => {
				// console.warn(JSON.stringify(responseData));
				routes.loginPage()
				MessageBarManager.showAlert({
					message: "Congratulations You Are Successfully Registered ",
					alertType: 'alert',
					title:''
				})
			})
			.catch(err => {
				console.log(err);
			})
			.done();
		}
	}
}
function mapStateToProps(state) {
    return {
        lang: state.auth.lang,
    }
}
export default connect(mapStateToProps)(Vendorreg);
