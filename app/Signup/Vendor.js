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
	Image,
	Modal,
	ActivityIndicator,
	TouchableWithoutFeedback,
	Alert,
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
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/Feather';
import ActionSheet from 'react-native-actionsheet';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
// Geocoder.setApiKey('AIzaSyAnZx1Y6CCB6MHO4YC_p04VkWCNjqOrqH8');
Geocoder.setApiKey('AIzaSyBU5Uwb57A6jXutEHzAo8I3T7gRVbs8qHo');

import Permissions from 'react-native-permissions';

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
const ASPECT_RATIO = width / height;
const LATITUDE = 22.966425;
const LONGITUDE = 72.615933;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
// const GOOGLE_MAPS_APIKEY = 'AIzaSyAnZx1Y6CCB6MHO4YC_p04VkWCNjqOrqH8';
const GOOGLE_MAPS_APIKEY = 'AIzaSyBU5Uwb57A6jXutEHzAo8I3T7gRVbs8qHo';


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
			otpVarification: false,
			ShowMapLocation: false,
			u_id: '',
			otp : '',
			isLoading: true,
			LATITUDE : 29.389713, //22.966425,
			LONGITUDE : 48.003288, //72.615933,
			LATITUDE_DELTA : 0.0922,
			LONGITUDE_DELTA : LATITUDE_DELTA * ASPECT_RATIO,
			region: {
				latitude: 29.389713, //37.78825,
				longitude: 48.003288, //-122.4324,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			  },
			  initialRegion: {
                latitude: 29.389713, //22.966425,
                longitude: 48.003288, //-122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            coordinate:{
                latitude: 29.389713, //22.966425,
                longitude: 48.003288, //72.615933,
                latitudeDelta:  0.0922,
                longitudeDelta: LATITUDE_DELTA * ASPECT_RATIO
            }
		};
	    this.inputs = {};
		this.showCountrysheet = this.showCountrysheet.bind(this)
		this.handlePress = this.handlePress.bind(this)
	}
	componentDidMount(){
		
		Permissions.check('location','whenInUse')
            .then(response => {
              //returns once the user has chosen to 'allow' or to 'not allow' access
              //response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
              // this.setState({ photoPermission: response })
              console.log('location Permission:=',response)
              if (response == 'authorized') {
                this.setUpLocationWatch()
              }
              else if (response == 'undetermined') {
                  Permissions.request('location','whenInUse').then(response => {
                  // Returns once the user has chosen to 'allow' or to 'not allow' access
                  // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
                  if(response=='authorized') {
                    this.setUpLocationWatch()
                  }
                })
              }
              else {
                console.log('called error part')
                Alert.alert(
                    'Zero2Two',
                    Platform.OS === 'ios' ? 'Your location access is denied, Please allow location access' : 'Your location access is denied, Please allow location access from settings',
                    Platform.OS == 'ios' ?
                    [
                        {text: 'Cancel', onPress: () => console.log('cancel')},
                        {text: 'Okay', onPress: () => {Permissions.openSettings()}},
					] : 
					[
						{text: 'Okay', onPress: () => console.log('Android Okay')}
					],
                    { cancelable: false }
                )
            }
        });
        this.fetchData();
	}
	
	setUpLocationWatch() {
		this.watchID = navigator.geolocation.watchPosition((position) => {
			let region = {
				latitude:       position.coords.latitude,
				longitude:      position.coords.longitude,
				latitudeDelta:  0.00922*1.5,
				longitudeDelta: 0.00421*1.5
			}
			this.onRegionChange(region, region.latitude, region.longitude);
		});
	}

	onRegionChange(region, lastLat, lastLong) {
		this.setState({
			region: region,
			lastLat: lastLat || this.state.lastLat,
			lastLong: lastLong || this.state.lastLong,
			isLoading : false,
			coordinate: {
				latitude: region.latitude,
				longitude: region.longitude
			}
		});
	}
	onRegionChangeComplete(region) {
        console.log("region.latitude:=",region.latitude)
        console.log("region.longitude:=",region.longitude)
        this.setState({
            region: region,
            coordinate: {
                latitude: region.latitude,
                longitude: region.longitude
            }
        },this.loadAddressFromMap(region.latitude, region.longitude));
    }
	componentWillUnmount() {
		navigator.geolocation.clearWatch(this.watchID);
	}
	loadAddressFromMap(latitude, longitude) {
		Geocoder.getFromLatLng(latitude, longitude).then(
			json => {
				var address_component = json.results[0].formatted_address;
				this.setState({
					address:address_component
				});

				// for (let index = 0; index < address_component.length; index++) {
				// 	const element = address_component[index];
				// 	if (element.types.includes('street_number')) {
				// 		console.log("street_number matched")
				// 		this.setState({
				// 			block_no:element.long_name
				// 		});
				// 	}
				// 	else if (element.types.includes('locality')) {
				// 		this.setState({
				// 			city: element.long_name
				// 		});
				// 	}
				// 	else if (element.types.includes('administrative_area_level_1')) {
				// 		this.setState({
				// 			street:element.long_name
				// 		})
				// 	}
				// }
				// console.warn("address_component:=",address_component[0].types[0])
				// console.warn("locality:=",json.results[0].address_components.locality)
			},
			error => {
				MessageBarManager.showAlert({
					message: error,
					alertType: 'alert',
					title:''
				})
			}
		);
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
			<View style={{ flex: 1}}>
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
									// this.focusNextField('five');
								}
							}
							returnKeyType={ "next" }
							ref={ input => {
								this.inputs['four'] = input;
							}}
							onChangeText={(email) => this.setState({email})}/>
					</View>
					<TouchableWithoutFeedback style ={{backgroundColor:'red'}} onPress={this.onAddressClicked.bind(this)}>
					<View style ={[commonStyles.iconusername, { flexDirection: direction, height:40, paddingVertical:10}]}>
						{/* <TextInput
							style={[commonStyles.inputpassword,{height:40, width: width-75, textAlign: textline, marginLeft : lang == 'ar'? 0 : 5, zIndex: 1, position: 'relative'}] }
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
							onChangeText={(address) => this.setState({address})}/> */}
							<Text style={{
								height:20, 
								width: width-75, 
								textAlign: textline, 
								marginLeft : lang == 'ar'? 0 : 5,
								color : this.state.address ? 'black' : 'gray',
								// backgroundColor : 'red',
							}}
							numberOfLines={1}
							>{this.state.address ? this.state.address : I18n.t('userregister.address', { locale: lang })}</Text>
						<Entypo name="location" size={20} color="#FFCC7D" style={{ alignSelf: 'center'}} onPress={()=>this.setState({
								ShowMapLocation : true
							})}/>
					</View>
					</TouchableWithoutFeedback>
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
			<KeyboardSpacer/>
		</ScrollView>
		<Modal
					animationType="slide"
					transparent={false}
					visible={this.state.otpVarification}
					onRequestClose={() => this.setState({ otpVarification :false})}>
					<View style={{
							flex: 1,
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: "transparent"
						}}>
						<Text style={{ fontSize: 14, color: "#6969", margin:20, textAlign:'center'}}>{I18n.t('userregister.greetings', { locale: lang })}</Text>

						<View style={{ flexDirection: 'row', backgroundColor: "#fff", alignItems: 'center'}}>
							<Text style={{ fontSize: 15, color: "#6969"}}>{I18n.t('userregister.otplabel', { locale: lang })}</Text>
							<TextInput
								style={[commonStyles.inputpassword,{
									borderBottomWidth: 1,
									textAlign: 'center',
									height: 40,
									width: width/3, textAlign: textline, marginLeft : lang == 'ar'? 0 : 5}]
								}
								// secureTextEntry={this.state.hidden}
								value={this.state.otp}
								underlineColorAndroid = 'transparent'
								autoCorrect={false}
								placeholder={I18n.t('userregister.otpplchldr', { locale: lang })}
								maxLength={6}
								returnKeyType={ "done" }
								onChangeText={ (otp) => this.setState({ otp }) }/>
						</View>
						<TouchableOpacity style={{}} onPress={this.resendOTPAPI.bind(this)}>
						<View style={{ flexDirection: 'row', backgroundColor: "#fff", alignItems: 'center', justifyContent: 'space-between', margin:20}}>
							<Icon name="refresh" size={25} color="#a9d5d1"/>
							<Text style={{ fontSize: 10, color: "#6969"}}>{I18n.t('userregister.resendOtp', { locale: lang })}</Text>
						</View>
						</TouchableOpacity>
						<TouchableOpacity style={{ height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: "#a9d5d1", width: width/2, borderRadius: 10, marginTop: 10}} onPress={()=>this.varifyOtp()}>
							<Text style={{ fontSize: 15, fontWeight: 'bold', color: "#fff"}}>{I18n.t('userregister.submitbtn', { locale: lang })}</Text>
						</TouchableOpacity>
					</View>
			</Modal>
		<Modal
			animationType="slide"
			transparent={false}
			visible={this.state.ShowMapLocation}
			onRequestClose={() => this.setState({ ShowMapLocation :false})}>
			<View style={{
				flexDirection: direction,
				position: 'absolute',
				zIndex: 1,
				backgroundColor: "transparent",
				justifyContent: 'space-around',
				// height: 40,
				width: "90%",
				alignSelf: 'center',
				marginTop: Platform.OS === 'ios' ? 20 : 10,
				borderRadius:5,
				// backgroundColor:'red'
				paddingVertical:5,
				// alignItems:'center'
			}}>
				<TextInput
					style={{
						width: "85%",
						// height: Platform.OS === 'ios' ? 40 : 40,
						backgroundColor: "#fff",
						alignSelf: 'center',
						textAlign: 'center', //textline,
						marginLeft : lang == 'ar'? 0 : 5,
						// backgroundColor:'yellow'
						borderRadius:5,
						paddingVertical:5,
						color:'black',
					}}
					editable = {false}
					multiline = {true}
					value={this.state.address}
					placeholder={I18n.t('userregister.pickfromMap', { locale: lang })}
					underlineColorAndroid = 'transparent'/>
				{
					!this.state.address.length ?
					<Icon onPress ={()=>this.setState({ ShowMapLocation :false})} name="close" size={25} color="#000" style={ { alignSelf: 'center'} } />
					:
					<Icon onPress ={()=>this.setState({ ShowMapLocation :false})} name="check" size={25} color="#000" style={ { alignSelf: 'center'} } />
				}
			</View>
			<View style={{ flex : 1, justifyContent: 'center', zIndex: 0}}>
			{Platform.OS === 'ios' ?
				<MapView
				initialRegion={{
					latitude: this.state.LATITUDE,
					longitude: this.state.LONGITUDE,
					latitudeDelta: this.state.LATITUDE_DELTA,
					longitudeDelta: this.state.LONGITUDE_DELTA
				}}
				region={this.state.region}
				style={StyleSheet.absoluteFill}
				ref={c => this.mapView = c}
				// onPress={this.onMapPress}
				// onRegionChange={this.onRegionChange.bind(this)}
				onRegionChangeComplete={this.onRegionChangeComplete.bind(this)}
				>

				{/* <MapView.Marker draggable
					// annotations={markers}
					coordinate={{
						latitude: (this.state.lastLat + 0.00050) || -36.82339,
						longitude: (this.state.lastLong + 0.00050) || -73.03569,
					}}
					// loadAddressFromMap
					onDragEnd={(e) => this.onDragPinCallback(e) } //this.loadAddressFromMap(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)}

					// onDragEnd={(e) => this.setState({
					// 	coordinate: e.nativeEvent.coordinate,
					// 	region: {
					// 		latitude:e.nativeEvent.coordinate.latitude,
					// 		longitude:e.nativeEvent.coordinate.longitude,
					// 		latitudeDelta: this.state.region.latitudeDelta,
					// 		longitudeDelta: this.state.region.longitudeDelta
					// 	}})}
						>
				</MapView.Marker> */}
			</MapView>

					:

					<MapView
					provider={PROVIDER_GOOGLE}
					initialRegion={{
						latitude: this.state.LATITUDE,
						longitude: this.state.LONGITUDE,
						latitudeDelta: this.state.LATITUDE_DELTA,
						longitudeDelta: this.state.LONGITUDE_DELTA
					}}
					region={this.state.region}
					style={StyleSheet.absoluteFill}
					ref={c => this.mapView = c}
					// onPress={this.onMapPress}
					// onRegionChange={this.onRegionChange.bind(this)}
					onRegionChangeComplete={this.onRegionChangeComplete.bind(this)}
					>

					{/* <MapView.Marker draggable
						// annotations={markers}
						coordinate={{
							latitude: (this.state.lastLat + 0.00050) || -36.82339,
							longitude: (this.state.lastLong + 0.00050) || -73.03569,
						}}
						// loadAddressFromMap
						onDragEnd={(e) => this.onDragPinCallback(e) }  // this.loadAddressFromMap(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)}

						// onDragEnd={(e) => this.setState({
						// 	coordinate: e.nativeEvent.coordinate,
						// 	region: {
						// 		latitude:e.nativeEvent.coordinate.latitude,
						// 		longitude:e.nativeEvent.coordinate.longitude,
						// 		latitudeDelta: this.state.region.latitudeDelta,
						// 		longitudeDelta: this.state.region.longitudeDelta
						// 	}})}
							>
						<View style={{ position: 'absolute'}}>
							<FontAwesome name="map-pin" size={35} color="green"/>
						</View>
					</MapView.Marker> */}
				</MapView>
			}

			</View>
			{/* {
				this.state.isLoading ?
					<ActivityIndicator
						style={{alignSelf: 'center', position: 'absolute', marginTop: height/2-40 }}
						color="#a9d5d1"
						size="large"/>
				: undefined
			} */}
			<Image style={{
							position:'absolute',
							zIndex:5,
							marginLeft:(width/2)-25,
							marginTop:(height/2)-25,
							width:50,
							height:50,
							overflow:'hidden',
						}}
						source={require('EbizZero2Two/app/images/mapPinAnnotation.png')}
                	/>
		</Modal>
		</View>
		);
	}

	onAddressClicked() {
		console.log("onAddressClicked")
		this.setState({
			ShowMapLocation : true
		})
	}

	onDragPinCallback(e) {
		console.log("onDragPinCallback")
		this.setState({
			coordinate:  {
				latitude: e.nativeEvent.coordinate.latitude,
				longitude: e.nativeEvent.coordinate.longitude,
				latitudeDelta:  e.nativeEvent.coordinate.longitudeDelta,
				longitudeDelta:  e.nativeEvent.coordinate.latitudeDelta
			},
			region: {
				latitude:e.nativeEvent.coordinate.latitude,
				longitude:e.nativeEvent.coordinate.longitude,
				latitudeDelta: this.state.region.latitudeDelta,
				longitudeDelta: this.state.region.longitudeDelta
			}},this.loadAddressFromMap(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude))

		// this.loadAddressFromMap(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)
	}

	varifyOtp(){
		console.log("varifyOtp")
		const { lang } = this.props;
		console.log(lang)
		var align = lang === 'ar' ? "right" : "left";
		console.log(align)
		if (this.state.otp.length <= 0) {
			// MessageBarManager.showAlert({
			// 	message: I18n.t('userregister.otpValidate', { locale: lang }),
			// 	title:'',
			// 	alertType: 'extra',
			// 	titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
			// 	messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
    		// })
			// return
			Alert.alert(
				I18n.t('userregister.otplabel', { locale: lang }),
				I18n.t('userregister.otpValidate', { locale: lang }),
				[
				//   {text: I18n.t('sidemenu.cancel', { locale: lang }), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
				  {text: I18n.t('sidemenu.ok', { locale: lang }), onPress: () => 
				  		console.log('Cancel Pressed')    
					},
				],
				{ cancelable: false }
			  )
			  return
		}
		Keyboard.dismiss()
		this.OtpVerification()
		// .then(()=> this.openOtpVarification())
		// .then(()=>routes.loginPage())
		.catch((error) => {
			console.log(error);
		})
		// .done();
	}

	resendOTPAPI() {
		const { u_id} = this.state;
			let formData = new FormData();
			formData.append('u_id', String(u_id));
			const config = {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'multipart/form-data;',
				},
				body: formData,
			}
			console.log("Request RecentOtp:=",config)
			fetch(Utils.gurl('RecentOtp'), config)
			.then((response) => response.json())
			.then((responseData) => {
				console.log("RecentOtp:=",responseData)
				if(responseData.status){
					Alert.alert(
						'OTP',
						responseData.data.message,
						[
						  {text: 'ok', onPress: () => 
								  console.log('Cancel Pressed')    
							},
						],
						{ cancelable: false }
					  )
				}else{
					Alert.alert(
						'OTP',
						responseData.data.message,
						[
						  {text: 'ok', onPress: () => 
								  console.log('Cancel Pressed')    
							},
						],
						{ cancelable: false }
					  )
				}
			})
			.catch((error) => {
				console.log(error);
			})
			.done();
	}

	async OtpVerification(){
		const { lang } = this.props,
		align = lang === 'ar' ? "right" : "left";
		try {
			const { otp, u_id} = this.state;
			let formData = new FormData();
			formData.append('u_id', String(u_id));
			formData.append('otp', String(otp));
			const config = {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'multipart/form-data;',
				},
				body: formData,
			}
			fetch(Utils.gurl('OtpVerification'), config)
			.then((response) => response.json())
			.then((responseData) => {
				console.log("OtpVerification:=",responseData)
				if(responseData.response.status){
					this.openOtpVarification(u_id)
					routes.loginPage()
				}else{

					Alert.alert(
						'OTP',
						'Otp Varification Failed',
						[
						//   {text: I18n.t('sidemenu.cancel', { locale: lang }), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
						  {text: 'ok', onPress: () => 
								  console.log('Cancel Pressed')    
							},
						],
						{ cancelable: false }
					  )

					// MessageBarManager.showAlert({
					// 	message: "Otp Varification Failed",
					// 	title:'',
					// 	alertType: 'extra',
					// 	titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
					// 	messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
					// })
					// this.openOtpVarification()
				}
			})
			.catch((error) => {
				console.log(error);
			})
			.done();
		} catch (error) {
			console.log(error);
		}
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
			if(contact.length !== 8){
				MessageBarManager.showAlert({
					message: I18n.t('userregister.mobileValidatetionText', {locale: lang}),
					title:'',
					alertType: 'extra',
					titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
					messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
				})
				return false
			}

			let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,7})+$/ ;
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
			// if(emailArr[emailArr.length- 1] !== "com"){
			// 	MessageBarManager.showAlert({
			// 		message: I18n.t('venderregister.maildomain', { locale: lang }),
			// 		title:'',
			// 		alertType: 'extra',
			// 		titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
			// 		messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
			// 	});
			// 	return false;
			// }
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
				message: I18n.t('venderregister.passwordvalidation', { locale: lang }),
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
		const { lang} = this.props,
		align = lang === 'ar' ? "right" : "left";
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
			console.log("Request register:=",config)
			fetch(Utils.gurl('register'), config)
			.then((response) => response.json())
			.then((responseData) => {
				// console.warn(JSON.stringify(responseData));
				// routes.loginPage()
				console.log("Response register:=",responseData)
				if(responseData.response.status){
					let u_id = responseData.response.data.u_id
					MessageBarManager.showAlert({
						message: I18n.t('userregister.greetingsmsg', { locale: lang }),
						alertType: 'alert',
						title:''
					})
					this.openOtpVarification(u_id)
				}
				else {
					MessageBarManager.showAlert({
						// message: I18n.t('userregister.greetings', { locale: lang }),
						message: responseData.response.data.message,
						title:'',
						alertType: 'extra',
						titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
						messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
					})
				}
			})
			.catch(err => {
				console.log(err);
			})
			.done();
		}
	}

	openOtpVarification(u_id){
		this.setState({
			u_id: u_id,
			otpVarification : !this.state.otpVarification
		})
	}
}
function mapStateToProps(state) {
    return {
        lang: state.auth.lang,
    }
}
export default connect(mapStateToProps)(Vendorreg);
