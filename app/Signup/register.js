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
	// Picker,
} from "react-native";
import {Loader} from "app/common/components";
import commonStyles from "app/common/styles";
import {Actions as routes} from "react-native-router-flux";
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SegmentedControls } from 'react-native-radio-buttons';
import Utils from 'app/common/Utils';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import { Picker } from 'react-native-picker-dropdown';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ActionSheet from 'react-native-actionsheet';
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
	address: ''
};

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
			hidden : true,
			userType : null,
			type : '2',
			os : (Platform.OS === 'ios') ? 2 : 1,
			countries: ["0"],
		};
	    this.inputs = {};
		this.showCountrysheet = this.showCountrysheet.bind(this)
		this.handlePress = this.handlePress.bind(this)
	}

	componentDidMount(){
        this.fetchData();
        this.gettermandcondition()
    }
    focusNextField(id) {
    	this.inputs[id].focus();
    }
    eye() {
    	this.setState({
    		hidden : !this.state.hidden
    	})
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
    fetchData(){
        fetch(Utils.gurl('countryList'),{
             method: "GET", headers: {
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
		console.log('handlePress:=',i)
		// const { userTypes , countries} = this.state;
		// this.handlePress[]

		if(i === 0){
			this.setState({
				selectCountry: '',
				// deliveryareas: ["cancel","Select Country First"],
		})
		}else{
			console.log("userTypes:=",this.state.userTypes[i-1].country_id)
		// console.log("countries:=",countries[i])
		  this.setState({
			selectCountry: this.state.userTypes[i-1].country_id.toString()
		  })

		//   data = userTypes.filter((item)=>{
		// 	return item.country_name == countries[i];
		//   }).map((item)=>{
		// 	// delete item.country_name;
		// 	return item;
		//   });
		}

		//   var source_data = data[0].city,
		// 		length = data[0].city.length,
		// 		city_list= []

		// 		city_list.push('Cancel');
		// 		for(var i=0; i < length; i++) {
		// 			order = source_data[i];
		// 			// console.warn(order);
		// 			city_name = order.city_name;
		// 			city_list.push(city_name);
		// 		}

		// 		this.setState({
		// 		  deliveryareas: city_list
		// 		})}

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

		return (
			<ScrollView style={[ commonStyles.content,{marginTop:0,marginBottom:0,paddingTop:20,paddingBottom:20}]} testID="Login" keyboardShouldPersistTaps={'handled'}>
				<View style ={[commonStyles.registerContent, {marginBottom : 10, borderColor:'#fbcdc5'}]}>
					<View style ={commonStyles.iconusername}>
						<TextInput
							style={[commonStyles.inputusername, { borderTopLeftRadius : 10, borderTopRightRadius:10, height:40, textAlign: textline, marginLeft : lang == 'ar'? 0 : 5}]}
							value={this.state.fullname}
							underlineColorAndroid = 'transparent'
							autoCorrect={false}
							placeholder={I18n.t('userregister.fullname', { locale: lang })}
							maxLength={140}
          					onSubmitEditing={() => {
          						this.focusNextField('two');
          					}}
          					returnKeyType={ "next" }
 					        ref={ input => {
 					        	this.inputs['one'] = input;
 					        }}

							onChangeText={(fullname) => this.setState({fullname})}
						/>
					</View>

					<View style ={commonStyles.iconusername}>

						<TextInput
							style={[commonStyles.inputpassword,{ height:40, textAlign: textline, marginLeft : lang == 'ar'? 0 : 5}]}
							value={this.state.email}
							underlineColorAndroid = 'transparent'
							autoCorrect={false}
							placeholder={I18n.t('userregister.emailaddress', { locale: lang })}
							maxLength={140}
          					onSubmitEditing={() => {
											let emailarr = this.state.email.split('.');
											 //[emailarr.lengrth- 1]
											if(emailarr[emailarr.length- 1] !== "com"){
												MessageBarManager.showAlert({
														message: "mail domain name must be .com",
														alertType: 'alert',
														title:''
												});
											}
          						this.focusNextField('three');

          					}}
          					returnKeyType={ "next" }
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
          					onSubmitEditing={() => {
          						this.focusNextField('four');
          					}}
          					returnKeyType={ "next" }
 					        ref={ input => {
 					        	this.inputs['three'] = input;
 					        }}
 					        onChangeText={ (password) => this.setState({ password }) }
						/>

					</View>
					<TouchableOpacity style ={{ flexDirection: direction, borderBottomColor:'#fbcdc5',
						// justifyContent: 'center',
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
        			    // fontFamily: 'Snell Roundhand'
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
          					onSubmitEditing={() => {
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
						style={[commonStyles.iconusername, {
					        				flexDirection: direction,
					        				justifyContent: 'space-between',
					        				alignItems: 'center' ,
											marginBottom : 5,
											paddingLeft:5,
											height:40,
											overflow:'hidden'
					        					}]}>
						{!this.state.selectCountry? undefined: <Image style={{height:40, width:40}}
						resizeMode = 'center'
						resizeMethod = 'resize'
						source={{uri : selCountryObj ? selCountryObj.flag : "" }}
						onLoadEnd={() => {  }}
						/>
						}
						<Text style={{ }} >{this.state.selectCountry? selCountryObj.country_name  : I18n.t('userregister.selectcountry', { locale: lang }) }</Text>
						<FontAwesome
                            name="chevron-down"
                            size={15}
                            color="#000"
                            style={{padding:5, marginRight:5}}/>
						{/* <Picker
							style=
							{{
								width: !this.state.selectCountry? width-50 : width-100, // width-50,
								height: 40,
								position:'relative',
								zIndex:999
							}}
                            mode="dropdown"
                            selectedValue={this.state.selectCountry}
							onValueChange={(itemValue, itemIndex) =>
							// console.log("(itemValue, itemIndex):=",itemValue,itemIndex)
							this.setState({
								selectCountry: itemValue
							})
						}
						>

							{this.loadUserTypes()}

                            </Picker> */}


						</TouchableOpacity>
						{/* </View> */}

						{/* <TouchableOpacity onPress={this.showCountrysheet} style={[commonStyles.iconusername, {
					        				flexDirection: 'row',
					        				justifyContent: 'space-between',
					        				alignItems: 'center' ,
											marginBottom : 5,
											paddingLeft:5
					        					}]}>
                        <View style={styles.countryIcon}>
                        <Image
                        style={{
                            resizeMode,
                            width : 25,
                            height : 25,
                        }}
                        resizeMode = 'cover'
                        source={require('../images/country_icon.png')} />
                        </View>
                        <Text style={{width: width/2, color: "#a9d5d1"}}>{ this.state.selectCountry ? this.state.countries[this.state.selectCountry] : countryTitle}</Text>
                        <FontAwesome
                            name="chevron-down"
                            size={20}
                            color="#FFCC7D"
                            style={{padding:5}}/>

                        </TouchableOpacity> */}

							<ActionSheet
                        ref={o => this.countrySheet = o}
                        // title={!this.state.selectCountry? this.state.selectCountry : selCountryObj.country_name  }
                        options={this.state.countries}
                        cancelButtonIndex={CANCEL_INDEX}
                        // destructiveButtonIndex={DESTRUCTIVE_INDEX}
                        onPress={this.handlePress}/>

					<View style={[{
					flexDirection: direction,
					// justifyContent: 'center',
					// alignItems: 'center' ,
						}]}>
						<TextInput
    						style={[commonStyles.inputpassword,{height:40, textAlign: textline, marginLeft : lang == 'ar'? 0 : 5}] }
							value={this.state.address}
							underlineColorAndroid = 'transparent'
							autoCorrect={false}
							placeholder={I18n.t('userregister.address', { locale: lang })}
							maxLength={140}
          					returnKeyType={ "done" }
 					        ref={ input => {
 					        	this.inputs['five'] = input;
 					        }}
							onChangeText={(address) => this.setState({address})}
						/>
					</View>

				</View>
				{/* <Button
				onPress = {this.onSubmit.bind(this)}
  				title="Create Acount"
  				color="orange"
  				/> */}
				  <TouchableOpacity style ={{justifyContent: 'center', alignItems: 'center', padding: 10, borderColor: '#ccc', flexDirection: 'row', alignItems: 'center', padding:0}} onPress={this.onSubmit.bind(this)}>
					<View style={{backgroundColor:"#FFCC7D", width:'100%', height:40, alignItems: 'center', justifyContent:'center', borderRadius:5}}>
							 <Text  style = {{color:"#FFFFFF", textAlign:textline}}>{I18n.t('userregister.createbtn', { locale: lang })}</Text>
					</View>
				</TouchableOpacity>

  				<View style={{flexDirection : 'column', alignItems : 'center', flex: 1}}>
  					<TouchableOpacity style={{padding :20}}
  					onPress={()=> routes.registerVendor()}>
  					<Text style={{textAlign: textline}} >{I18n.t('userregister.venderregister', { locale: lang })}</Text>
  					</TouchableOpacity>
  					{/* <Text style={{ padding : 20}}>By Signing in You are agreeing to Our </Text>

  					<TouchableOpacity
  					onPress={()=> routes.terms({
  						title: this.state.termsandcondition_title,
  						description: this.state.termsandcondition_description
  					})}>
  					<Text> Terms and
  					Conditions of Use and Privacy Policy</Text>
					  </TouchableOpacity> */}
					<View style={{
						flex: 1,
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						marginTop:20
					}}>
						<Text style={{ fontSize : 12, width : '80%', textAlign: textline}}>
						{I18n.t('userregister.privacypolicy1', { locale: lang })}
						</Text>
						<View style={{flexDirection: direction}}>
						<TouchableOpacity
						onPress={()=> routes.terms({
							title: this.state.termsandcondition_title,
							description: this.state.termsandcondition_description
						})}>
						<Text style={{color :'#a9d5d1', fontSize : 12, textAlign: textline}}>
							{I18n.t('userregister.privacypolicy2', { locale: lang })}
						</Text>
						</TouchableOpacity>
						<Text style={{color :'black', fontSize : 12, textAlign: textline}}> {I18n.t('userregister.privacypolicy3', { locale: lang })} </Text>
						<TouchableOpacity
						onPress={()=> routes.terms({
							title: this.state.termsandcondition_title,
							description: this.state.termsandcondition_description
						})}>
						<Text style={{color :'#fbcdc5', fontSize : 12,textAlign: textline }}>
							{I18n.t('userregister.privacypolicy4', { locale: lang })}
						</Text>
						</TouchableOpacity>
					</View>
			</View>
			<View style={{height:40,width:'100%'}}></View>
  			</View>

			</ScrollView>
		);
	}

validate(){
	const {fullname, email, password, gender, contact, selectCountry, os, address, type } = this.state;
	const emailArr = email.split('.');

	if (!fullname.length){
		MessageBarManager.showAlert({
            message: "Plese Enter Your Fullname",
			alertType: 'alert',
			title:''
        	})
		return false
	}

	let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
	if(reg.test(email) === false)
		{
		MessageBarManager.showAlert({
           message: "Plese Enter Valid Email",
		   alertType: 'alert',
		   title:''
         })
		return false;
	}

	if(emailArr[emailArr.length- 1] !== "com"){
		MessageBarManager.showAlert({
			message: "mail domain name must be .com",
			alertType: 'alert',
			title:''
		});
		return false;
	}

	if (!password.length){
		MessageBarManager.showAlert({
            message: "Plese Enter Your Password",
			alertType: 'alert',
			title:''
        	})
		return false
	}
	if( gender.value === undefined){
		MessageBarManager.showAlert({
           message: "Plese Select Gender",
		   alertType: 'alert',
		   title:''
         })
		return false;
	}
	if (!contact.length){
		MessageBarManager.showAlert({
            message: "Plese Enter Your Contact Number",
            alertType: 'alert',
        	})
		return false
	}
	if (!selectCountry.length){
		MessageBarManager.showAlert({
            message: "Plese Select Country",
			alertType: 'alert',
			title:''
        	})
		return false
	}
	if (!address.length){
		MessageBarManager.showAlert({
            message: "Plese Enter Address",
			alertType: 'alert',
			title:''
        	})
		return false
	}
	if (!type.length){
		MessageBarManager.showAlert({
            message: "Plese Select User Type",
			alertType: 'alert',
			title:''
        	})
		return false;
	}
		return true;
}
onSubmit() {
		Keyboard.dismiss();
		const {fullname, email, password, gender, contact, selectCountry, os, address, type } = this.state;

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
	        console.warn(JSON.stringify(responseData));

	    	routes.loginPage()
	    	MessageBarManager.showAlert({
            message: "Congratulations You Are Successfully Registered ",
            alertType: 'alert',
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
