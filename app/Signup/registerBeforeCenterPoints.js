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
	Keyboard,
	Dimensions,
	StyleSheet,
	Image,
	Modal,
	ActivityIndicator
} from "react-native";
import {Loader} from "app/common/components";
import commonStyles from "app/common/styles";
import {Actions as routes} from "react-native-router-flux";
import {connect} from 'react-redux';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { SegmentedControls } from 'react-native-radio-buttons';
import Utils from 'app/common/Utils';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import { Picker } from 'react-native-picker-dropdown';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import FontAwesome from 'react-native-vector-icons/Feather';
import ActionSheet from 'react-native-actionsheet';
// import Modal from 'react-native-modal';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
// import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
Geocoder.setApiKey('AIzaSyAnZx1Y6CCB6MHO4YC_p04VkWCNjqOrqH8');

const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 0
const countryTitle = 'Select Country'
const { width, height } = Dimensions.get('window')
const INITIAL_STATE = {
	fullname: '',
	email: '',
	password: '',
	gender : '',
	contact: '',
	country: '',
	address: '',
};
const ASPECT_RATIO = width / height;
// const LATITUDE = 22.966425;
// const LONGITUDE = 72.615933;
const LATITUDE_DELTA = 0.0922;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_MAPS_APIKEY = 'AIzaSyAnZx1Y6CCB6MHO4YC_p04VkWCNjqOrqH8';

class Register extends Component {
	constructor(props) {
		super(props);
		this.toggleSwitch = this.toggleSwitch.bind(this);
		this.focusNextField = this.focusNextField.bind(this);
		this.state = {
			userTypes: [],
			termsandcondition_title:'',
			termsandcondition_description:'',
            selectCountry: '',
			fullname: '',
			email: '',
			password: '',
			gender : '',
			contact: '',
			country: '',
			address: '',
			gender : '',
			u_id: '',
			otp : '',
			hidden : true,
			userType : null,
			type : '2',
			os : (Platform.OS === 'ios') ? 2 : 1,
			countries: ["0"],
			otpVarification: false,
			ShowMapLocation: false,
			isLoading: true,
			LATITUDE : 22.966425,
			LONGITUDE : 72.615933,
			LATITUDE_DELTA : 0.0922,
			LONGITUDE_DELTA : LATITUDE_DELTA * ASPECT_RATIO,
			region: {
				latitude: 22.966425,
				longitude: 72.615933,
				latitudeDelta: 0.0922,
				longitudeDelta: LATITUDE_DELTA * ASPECT_RATIO,
			  },
			  initialRegion: {
                latitude: 22.966425,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            coordinate:{
                latitude: 22.966425,
                longitude: 72.615933,
                latitudeDelta:  0.0922,
                longitudeDelta: LATITUDE_DELTA * ASPECT_RATIO
            }
		};
		this.inputs = {};
		this.showCountrysheet = this.showCountrysheet.bind(this)
		this.handlePress = this.handlePress.bind(this)
	}
	componentDidMount(){
		this.watchID = navigator.geolocation.watchPosition((position) => {
			let region = {
				latitude:       position.coords.latitude,
				longitude:      position.coords.longitude,
				latitudeDelta:  0.00922*1.5,
				longitudeDelta: 0.00421*1.5
			}
			// console.warn(region);

			this.onRegionChange(region, region.latitude, region.longitude);
		});
        this.fetchData();
        this.gettermandcondition()
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
	componentWillUnmount() {
		navigator.geolocation.clearWatch(this.watchID);
	}
	focusNextField(id) {
		this.inputs[id].focus();
    }
    eye() {
		this.setState({
			hidden : !this.state.hidden
    	})
    }
	loadAddressFromMap(latitude, longitude) {
		Geocoder.getFromLatLng(latitude, longitude).then(
			json => {
				var address_component = json.results[0].formatted_address;
				this.setState({
					address:address_component,
					LATITUDE : latitude,
					LONGITUDE : longitude
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
			console.log("CountryList:=-",responseData.response.data)
			var data = responseData.response.data,
        	length = data.length,
        	optionsList= []
        	optionsList.push('Cancel');

        	for(var i=0; i < length; i++) {
            	order = data[i];
            	// console.warn(order);
            	country_name = order.country_name;
            	optionsList.push(country_name);
        	}
			this.setState({
				userTypes: responseData.response.data,
				loaded: true,
				countries: optionsList
			});
		})
		.catch((error) => {
			console.log(error);
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
				selectCountry: ''
			})
		}else{
			this.setState({
				selectCountry: this.state.userTypes[i-1].country_id.toString()
			})
		}
	}
	vendorRegister(){
		navigator.geolocation.clearWatch(this.watchID);
		routes.registerVendor()
	}
	renderLoadingView() {
		const {lang} = this.props;
		let side = lang === "ar" ? "right" : "left";
		return (
			<View style={{flex: 1}}>
				<ActivityIndicator
					style={[styles.centering]}
					color="#a9d5d1"
					size="large"/>
			</View>
		);
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
		let icon = this.state.hidden ? 'checkbox-blank-outline' : 'checkbox-marked';
		var selCountryObj = null
		for (let index = 0; index < this.state.userTypes.length; index++) {
			let element = this.state.userTypes[index];
			if (element.country_id == this.state.selectCountry) {
				selCountryObj = element
			}
		}
		// if (this.state.isLoading) {
		// 	return (
		// 		<View style={{flex: 1, zIndex: 1, position: 'absolute'}}>
		// 			<ActivityIndicator
		// 				style={[styles.centering]}
		// 				color="#a9d5d1"
		// 				size="large"/>
		// 		</View>
		// 	);
		// }
		return (
			<View style={{flex: 1}}>
				<ScrollView style={[ commonStyles.content,{marginTop:0,marginBottom:0,paddingTop:20,paddingBottom:20}]}
					testID="Login"
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps={'handled'}>
					<View style ={[commonStyles.registerContent, {marginBottom : 10, borderColor:'#fbcdc5'}]}>
						<View style ={commonStyles.iconusername}>
							<TextInput
								style={[commonStyles.inputusername, { borderTopLeftRadius : 10, borderTopRightRadius:10, height:40, textAlign: textline, marginLeft : lang == 'ar'? 0 : 5}]}
								value={this.state.fullname}
								underlineColorAndroid = 'transparent'
								autoCorrect={false}
								placeholder={I18n.t('userregister.fullname', { locale: lang })}
								maxLength={140}
          					onSubmitEditing={(event) => {
          						this.focusNextField('two');
          					}}
					  		autoFocus = {true}
          					returnKeyType={ "next" }
 				        	ref={ input => {
 				        		this.inputs['one'] = input;
 				        	}}
							onChangeText={(fullname) => this.setState({fullname})}/>
					</View>
					<View style ={commonStyles.iconusername}>
						<TextInput
							style={[commonStyles.inputpassword,{ height:40, textAlign: textline, marginLeft : lang == 'ar'? 0 : 5}]}
							value={this.state.email}
							underlineColorAndroid = 'transparent'
							autoCorrect={false}
							placeholder={I18n.t('userregister.emailaddress', { locale: lang })}
							maxLength={140}
          					onSubmitEditing={(event) => {
          						this.focusNextField('three');
          					}}
          					returnKeyType={ "next" }
							// autoFocus = {true}
 				        	ref={ input => {
 				        		this.inputs['two'] = input;
						 	}}
						 	keyboardType = {"email-address"}
							onChangeText={(email) => this.setState({email})}
							/>
					</View>
					<View style ={[commonStyles.iconusername, { alignItems: align}]}>
						<TextInput
							style={[commonStyles.inputpassword,{height:40, textAlign: textline, marginLeft : lang == 'ar'? 0 : 5}]}
                       		secureTextEntry={this.state.hidden}
                       		value={this.state.password}
							underlineColorAndroid = 'transparent'
							autoCorrect={false}
							placeholder={I18n.t('userregister.password', { locale: lang })}
							maxLength={140}
          					onSubmitEditing={(event) => {
          						this.focusNextField('four');
          					}}
          					returnKeyType={ "next" }
 				        	ref={ input => {
 				        		this.inputs['three'] = input;
 				        	}}
 				        	onChangeText={ (password) => this.setState({ password }) }
							/>
					</View>
					<TouchableOpacity style ={{
							flexDirection: direction,
							borderBottomColor:'#fbcdc5',
							alignItems: 'center',
							padding: 10,
							borderBottomWidth: StyleSheet.hairlineWidth,
							borderColor: '#ccc',
						}} onPress={()=> this.eye()}>
						<Icon name= {icon} size={25} color="#FFCC7D" style={ lang == 'ar' ? { right : 10} :{ right : 10}  }/>
						<Text style={{textAlign: textline}}>{I18n.t('userregister.showpassword', { locale: lang })}</Text>
					</TouchableOpacity>
					<View style={{borderBottomWidth: 0.5, borderColor: '#fbcdc5'}}>
						<Text/>
						<SegmentedControls
							tint= {'#a9d5d1'}
							selectedTint= {'white'}
							backTint= {'#fff'}
							optionStyle= {{
								fontSize: 15,
								fontWeight: 'bold',
								alignItems: align
							}}
							containerStyle= {{
								marginLeft: 10,
								marginRight: 10,
							}}
							options={ options }
							onSelection={ this.setSelectedOption.bind(this) }
							selectedOption={ this.state.gender }
							extractText={ (option) => option.label }
							testOptionEqual={ (a, b) => {
								if (!a || !b) {
									return false;
								}
								return a.label === b.label
							}}
							/>
						<Text/>
					</View>
					<View style ={commonStyles.iconusername}>
						<TextInput
							style={[commonStyles.inputusername,{height:40, textAlign: textline, marginLeft : lang == 'ar'? 0 : 5}]}
							value={this.state.contact}
							underlineColorAndroid = 'transparent'
							autoCorrect={false}
							placeholder={I18n.t('userregister.mobilenumber', { locale: lang })}
							maxLength={140}
							keyboardType={'numeric'}
          					onSubmitEditing={(event) => {
          						this.focusNextField('five');
          					}}
          					returnKeyType={ "next" }
 				        	ref={ input => {
 				        		this.inputs['four'] = input;
 				        	}}
 				        	onChangeText={(contact) => this.setState({contact})}
							/>
					</View>
					<TouchableOpacity onPress={this.showCountrysheet}
						style={[
							commonStyles.iconusername,
							{
								flexDirection: direction,
								justifyContent: 'space-between',
								alignItems: 'center' ,
								// marginBottom : 5,
								paddingLeft:5,
								height:40,
								overflow:'hidden'
							}
						]}>
						{
							!this.state.selectCountry ? undefined:
							<Image style={{height:40, width:40}}
								resizeMode = 'center'
								res100izeMethod = 'resize'
								source={{uri : selCountryObj ? selCountryObj.flag : "" }}
								onLoadEnd={() => {  }}
								/>
						}
						<Text style={{ }} >{this.state.selectCountry? selCountryObj.country_name  : I18n.t('userregister.selectcountry', { locale: lang }) }</Text>
						<FontAwesome
							name="chevron-down"
							size={20}
							color="#FFCC7D"
							style={{padding:5, marginRight:5}}/>
					</TouchableOpacity>
					<ActionSheet
						ref={o => this.countrySheet = o}
						// title={!this.state.selectCountry? this.state.selectCountry : selCountryObj.country_name  }
                    	options={this.state.countries}
                    	cancelButtonIndex={CANCEL_INDEX}
                    	// destructiveButtonIndex={DESTRUCTIVE_INDEX}
                    	onPress={this.handlePress}/>
					<View style={{ flexDirection: direction}}>
						<TextInput
							style={[commonStyles.inputpassword,{height:40, width: width-75, textAlign: textline, marginLeft : lang == 'ar'? 0 : 5, zIndex: 1, position: 'relative'}] }
							value={this.state.address}
							underlineColorAndroid = 'transparent'
							autoCorrect={false}
							placeholder={I18n.t('userregister.address', { locale: lang })}
							maxLength={140}
							returnKeyType={ "done" }
							ref={ input => {
								this.inputs['five'] = input;
							}}
							onChangeText={(address) => this.setState({address})}/>
						<Entypo name="location" size={20} color="#FFCC7D" style={{ alignSelf: 'center'}} onPress={()=>this.setState({
								ShowMapLocation : true
							})}/>
						</View>
					</View>
					<TouchableOpacity style ={{justifyContent: 'center', alignItems: 'center', padding: 10, borderColor: '#ccc', flexDirection: 'row', alignItems: 'center', padding:0}} onPress={this.onSubmit.bind(this)}>
						<View style={{backgroundColor:"#FFCC7D", width:'100%', height:40, alignItems: 'center', justifyContent:'center', borderRadius:5}}>
							<Text  style = {{color:"#FFFFFF", textAlign:textline}}>{I18n.t('userregister.createbtn', { locale: lang })}</Text>
						</View>
					</TouchableOpacity>
					<View style={{flexDirection : 'column', alignItems : 'center', flex: 1}}>
						<TouchableOpacity style={{padding :20}}
							onPress={()=> this.vendorRegister()}>
							<Text style={{textAlign: textline}} >{I18n.t('userregister.venderregister', { locale: lang })}</Text>
						</TouchableOpacity>
						<View style={{
								flex: 1,
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								marginTop:20
							}}>

							<View style={{flexDirection: direction}}>
								<TouchableOpacity onPress={()=> routes.terms({ title: this.state.termsandcondition_title, description: this.state.termsandcondition_description})}>
									<Text style={{color :'#6969', fontSize : 10,textAlign:'center' }}>
										{I18n.t('login.privacypolicy', { locale: lang })}
									</Text>
								</TouchableOpacity>
							</View>
						</View>
						<View style={{height:40,width:'100%'}}>
						</View>
					</View>
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
							backgroundColor: "transparent"}
						}>
						<Text style={{ fontSize: 12, color: "#6969"}}>{I18n.t('userregister.greetings', { locale: lang })}</Text>

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
								maxLength={140}
								returnKeyType={ "done" }
								onChangeText={ (otp) => this.setState({ otp }) }/>
						</View>
						<View style={{ flexDirection: 'row', backgroundColor: "#fff", alignItems: 'center', justifyContent: 'space-between'}}>
							<Icon name="refresh" size={25} color="#a9d5d1"/>
							<Text style={{ fontSize: 10, color: "#6969"}}>{I18n.t('userregister.resendOtp', { locale: lang })}</Text>
						</View>
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
						height: 40,
						width: "90%",
						alignSelf: 'center',
						marginTop: Platform.OS === 'ios' ? 20 : 10 ,
						borderRadius:5,
						// backgroundColor:'red'
						paddingVertical:10,
						// alignItems:'center'
					}}>
						<TextInput
							style={{
								width: "85%",
								height: Platform.OS === 'ios' ? 40 : 40,
								backgroundColor: "#fff",
								alignSelf: 'center',
								textAlign: 'center' ,//textline,
								marginLeft : lang == 'ar'? 0 : 5,
								// backgroundColor:'yellow'
								borderRadius:5,
							}}
							editable = {false}
							multiline = {false}
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
						{
							Platform.OS === 'ios' ?
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
							>

							<MapView.Marker draggable
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
					</MapView.Marker>
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
							onPress={this.onMapPress}
							// onRegionChange={this.onRegionChange.bind(this)}
							>

							<MapView.Marker draggable
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

								<View style={{ position: 'absolute'}}>
								<FontAwesome name="map-pin" size={35} color="green"/>
								</View>

							</MapView.Marker>
						</MapView>
						}
					</View>
					{
						this.state.isLoading ?
							<ActivityIndicator
								style={{alignSelf: 'center', position: 'absolute', marginTop: height/2-40 }}
								color="#a9d5d1"
								size="large"/>
						: undefined
					}
				</Modal>
			</View>
		);
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
		this.OtpVerification()
		// .then(()=> this.openOtpVarification())
		// .then(()=>routes.loginPage())
		.catch((error) => {
			console.log(error);
		})
		// .done();
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
				if(responseData.response.status){
					this.openOtpVarification()
					routes.loginPage()
				}else{
					MessageBarManager.showAlert({
						message: "Otp Varification Failed",
						title:'',
						alertType: 'extra',
						titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
						messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
					})
					this.openOtpVarification()
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
		const {fullname, email, password, gender, contact, selectCountry, os, address, type } = this.state;
		const { lang } = this.props,
		align = lang === 'ar' ? "right" : "left";
		const emailArr = email.split('.');
		if (!fullname.length){
			MessageBarManager.showAlert({
				message: I18n.t('userregister.pleaseenterfullname', { locale: lang }),
				title:'',
				alertType: 'extra',
				titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
				messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
    		})
			return false
		}
		let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
		if(reg.test(email) === false)
		{
			MessageBarManager.showAlert({
				message: I18n.t('userregister.pleaseentervalidmail', { locale: lang }),
				title:'',
				alertType: 'extra',
				titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
				messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
			})
			return false;
		}
		if(emailArr[emailArr.length- 1] !== "com"){
			MessageBarManager.showAlert({
				message: I18n.t('userregister.maildomain', { locale: lang }),
				title:'',
				alertType: 'extra',
				titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
				messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
			});
			return false;
		}
		if (!password.length){
			MessageBarManager.showAlert({
				message: I18n.t('userregister.pleaseenterpwd', { locale: lang }),
				title:'',
				alertType: 'extra',
				titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
				messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
			})
			return false
		}
		if(password.length < 6){
			MessageBarManager.showAlert({
				message: I18n.t('userregister.passwordvalidation', { locale: lang }),
				title:'',
				alertType: 'extra',
				titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
				messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
			})
			return false
		}
		if( gender.value === undefined){
			MessageBarManager.showAlert({
				message: I18n.t('userregister.pleaseselectgender', { locale: lang }),
				title:'',
				alertType: 'extra',
				titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
				messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
			})
			return false;
		}
		if(contact.length !== 8 ){
			MessageBarManager.showAlert({
				message: I18n.t('userregister.mobileValidatetionText', {locale: lang}),
				title:'',
				alertType: 'extra',
				titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
				messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
			})
			return false
		}
		if (!contact.length){
			MessageBarManager.showAlert({
				message: I18n.t('userregister.pleaseentercontact', { locale: lang }),
				title:'',
				alertType: 'extra',
				titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
				messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
			})
			return false
		}
		if (!selectCountry.length){
			MessageBarManager.showAlert({
				message: I18n.t('userregister.pleaseselectcountry', { locale: lang }),
				title:'',
				alertType: 'extra',
				titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
				messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
			})
			return false
		}
		if (!address.length){
			MessageBarManager.showAlert({
				message: I18n.t('userregister.pleaseenteraddr', { locale: lang }),
				title:'',
				alertType: 'extra',
				titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
				messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
			})
			return false
		}
		if (!type.length){
			MessageBarManager.showAlert({
				message: I18n.t('userregister.pleaseenterusertype', { locale: lang }),
				title:'',
				alertType: 'extra',
				titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
				messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
			})
			return false;
		}
		return true;
	}
	register (){
		onSubmit()
		// .then(()=>this.openOtpVarification())
		// .then(()=>routes.loginPage())
		.done();
	}
	async onSubmit() {
		try {
			Keyboard.dismiss();
			const {fullname, email, password, gender, contact, selectCountry, os, address, type } = this.state;
			const { lang} = this.props,
			align = lang === 'ar' ? "right" : "left";
			let formData = new FormData();
			formData.append('fullname', String(fullname));
			formData.append('email', String(email));
			formData.append('password', String(password));
			formData.append('gender', String(gender.value));
			formData.append('country', String(selectCountry));
			formData.append('user_type', String(type));
			formData.append('device_type', String(os));
			formData.append('device_token', String('ADFCVNGWRETUOP'));
			formData.append('phone_no', String(contact));
			formData.append('address', String(address));
			formData.append('representative_name', String('Ankita'));
			formData.append('facebook_id', String('sdfs'));
			formData.append('twitter_id', String('fsdfsd'));
			formData.append('instagram_id', String('sdfsdf'));
			formData.append('snapchat_id', String('dfdsf'));
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
					// routes.loginPage()
					if(responseData.response.status){
						let u_id = responseData.response.data.u_id
						MessageBarManager.showAlert({
							message: I18n.t('userregister.greetings', { locale: lang }),
							title:'',
							alertType: 'extra',
							titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
							messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
						})
						this.openOtpVarification(u_id)
					}else{
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
		} catch (error) {
			console.log(error);
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
	};
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        // justifyContent : 'center',
        alignItems:'center',
        backgroundColor:'transparent',
        paddingTop:20
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#fbcdc5',
        // justifyContent: 'center',
        alignItems: 'center' ,
        backgroundColor: '#F6F6F6',
        marginBottom : 10
    },
    countryIcon: {
        borderRightWidth: 1,
        borderColor: '#fbcdc5',
        width : 40,
        height:40,
        marginLeft :10,
        marginRight :10,
        paddingTop :5,
        justifyContent :'center',
        alignItems : 'center'
    },
    centering : {
        flex : 1,
        justifyContent  :'center',
        alignItems : 'center'
    }
});
export default connect(mapStateToProps)(Register);