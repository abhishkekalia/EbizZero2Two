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
	KeyboardAvoidingView
} from "react-native";
import {Loader} from "app/common/components";
import commonStyles from "app/common/styles";
import {Actions as routes} from "react-native-router-flux";
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SegmentedControls } from 'react-native-radio-buttons';
import Utils from 'app/common/Utils';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import { Picker } from 'react-native-picker-dropdown';
import KeyboardSpacer from 'react-native-keyboard-spacer';

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
const options = [
	{ label:'Male', value: 'male' },
    { label:'Female', value: 'female'}];

class Register extends Component {

	constructor(props) {
		super(props); 
		this.toggleSwitch = this.toggleSwitch.bind(this);
	    this.focusNextField = this.focusNextField.bind(this);
    	this.state = {
            userTypes: [], 
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
			type : '',
			os : (Platform.OS === 'ios') ? 2 : 1,
		};
	    this.inputs = {};

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
             method: "GET", headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }   
        })
        .then((response) => response.json())
        .then((responseData) => { 
                    // console.warn(JSON.stringify(responseData))
            this.setState({
                userTypes: responseData.response.data,
                 loaded: true
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

	render() {
		        let icon = this.state.hidden ? 'checkbox-blank-outline' : 'checkbox-marked' ;
		        // let icon = this.state.hidden ? 'ios-eye' : 'ios-eye-off';

		const {errorStatus, loading} = this.props;
		return (
			<ScrollView testID="Login">
						<KeyboardAvoidingView 
			 style={[ commonStyles.content,{ justifyContent: "flex-end"}]} 
			 behavior="padding" 
			>

				<View style ={[commonStyles.registerContent, {marginBottom : 10}]}>
					<View style ={[commonStyles.iconusername , { padding : 10}]}>
		
						<TextInput 
							style={[commonStyles.inputusername, { borderTopLeftRadius : 10, borderTopRightRadius:10}]}
							value={this.state.fullname}
							underlineColorAndroid = 'transparent'
							autoCorrect={false}
							placeholder="Fullname"
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
							style={[commonStyles.inputpassword , { padding : 10}]}
							value={this.state.email}
							underlineColorAndroid = 'transparent'
							autoCorrect={false}
							placeholder="Email Address"
							keyboardType={'email-address'}
							maxLength={140}
          					onSubmitEditing={() => { 
          						this.focusNextField('three');
          					}}
          					returnKeyType={ "next" }
 					        ref={ input => { 
 					        	this.inputs['two'] = input;
 					        }}
							onChangeText={(email) => this.setState({email})}
						/>
					</View>
					<View style ={[commonStyles.iconusername, { alignItems: 'center'}]}>
						
						<TextInput
							style={[commonStyles.inputpassword , { padding : 10}]}
                           	secureTextEntry={this.state.hidden}
                           	value={this.state.password}
							underlineColorAndroid = 'transparent'
							autoCorrect={false}
							placeholder="Password"
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
					<TouchableOpacity style ={[commonStyles.show, { flexDirection: 'row', alignItems: 'center'}]} onPress={()=> this.eye()}>
							<Icon name= {icon} size={25} style={{ right : 20}}/>
							<Text>Show Password </Text>
					</TouchableOpacity>

 				<View style={{borderBottomWidth: 0.5, borderColor: 'red'}}>
 				        			<Text/>

        			<SegmentedControls
        			  tint= {'#87cefa'}
        			  selectedTint= {'white'}
        			  backTint= {'#fff'}
        			  optionStyle= {{
        			    fontSize: 12,
        			    fontWeight: 'bold',
        			    fontFamily: 'Snell Roundhand'
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
							style={[commonStyles.inputusername , { padding : 10}]}
							value={this.state.contact}
							underlineColorAndroid = 'transparent'
							autoCorrect={false}
							placeholder="Mobile Number For (Order Update)"
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

<<<<<<< HEAD
					<View style={{ borderBottomWidth: 0.5, borderColor: 'red'}}>						
						<Picker
            selectedValue={this.state.selectCountry}
            onValueChange={(selectCountry) => this.setState({selectCountry})}
            mode="dropdown"
            style={{
                borderColor : '#ccc',
                alignSelf: 'stretch',
                color: 'black',
                padding:10
            }}
          >
            <Picker.Item label="India" value="1" />
            <Picker.Item label="UK" value="2" />
            <Picker.Item label="United States" value="3" />
          </Picker>
					</View>
=======
					<View style={[commonStyles.iconusername, {
					        				flexDirection: 'row',
					        				justifyContent: 'center',
					        				alignItems: 'center' ,
					        				marginBottom : 10
					        					}]}>						
						<Picker style={{ width: width-100, height: 40}}
                            mode="dropdown"
                            selectedValue={this.state.selectCountry}
                            onValueChange={(itemValue, itemIndex) => 
                                this.setState({selectCountry: itemValue})}>
                                
                                <Picker.Item label="Select country" value="" /> 
                               {this.loadUserTypes()}
                            </Picker>
                        </View>
>>>>>>> 81129869a12c0199cbd4f9a9928d2192d09df3de
					<View style ={commonStyles.iconusername}>
						<TextInput
							style={[commonStyles.inputpassword , { padding : 10}] }
							value={this.state.address}
							underlineColorAndroid = 'transparent'
							autoCorrect={false}
							placeholder="Address"
							maxLength={140}
          					returnKeyType={ "done" }
 					        ref={ input => { 
 					        	this.inputs['five'] = input;
 					        }}
							onChangeText={(address) => this.setState({address})}
						/>
					</View>
<<<<<<< HEAD
						<Picker style={{height: 40, backgroundColor: 'transparent'}}
=======
										<View style={[{
					        				flexDirection: 'row',
					        				justifyContent: 'center',
					        				alignItems: 'center' ,
					        					}]}>				
						<Picker style={{ width: width-100, height: 40}}
>>>>>>> 81129869a12c0199cbd4f9a9928d2192d09df3de
                        mode="dropdown"
                        selectedValue={this.state.type}
						onValueChange={(itemValue, itemIndex) => this.setState({type: itemValue})}>
							<Picker.Item label="Select Type"/>
							<Picker.Item label="USER" value="2" />
							<Picker.Item label="VENDOR" value="3" />
						</Picker>
<<<<<<< HEAD
=======
						
					</View>

>>>>>>> 81129869a12c0199cbd4f9a9928d2192d09df3de
				</View>
				<TouchableOpacity  onPress = {this.onSubmit.bind(this)}  style={[commonStyles.button , {backgroundColor : 'orange'}]}>
					<Text style={{ color : '#fff'}}>Create Acount</Text>
				</TouchableOpacity>
	    </KeyboardAvoidingView>
        <KeyboardSpacer/>

			</ScrollView>

		);
	}

	alert = (msg) => { MessageBarManager.showAlert({ 
		message: "please enter "+ msg, 
		alertType: 'warning', 
		// stylesheetWarning : { backgroundColor : '#ff9c00', strokeColor : '#fff' },
		animationType: 'SlideFromLeft',})}




validate(){
	const {fullname, email, password, gender, contact, selectCountry, os, address, type } = this.state;
	if (!fullname.length){
		MessageBarManager.showAlert({
            message: "Plese Enter Your Fullname",
            alertType: 'alert',
        	})		
		return false
	} 
	
	let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ; 
	if(reg.test(email) === false) 
		{ 
		MessageBarManager.showAlert({
           message: "Plese Enter Valid Email",
           alertType: 'alert', 
         })
		return false;
	}

	if (!password.length){ 
		MessageBarManager.showAlert({
            message: "Plese Enter Your Password",
            alertType: 'alert',
        	})
		return false
	}
	if( gender.value === undefined){
		MessageBarManager.showAlert({
           message: "Plese Select Gender",
           alertType: 'alert', 
         })
		return false;
	}
<<<<<<< HEAD
	if (!contact.length){ //? null : this.alert("Fullname")
=======
	if (!contact.length){
>>>>>>> 81129869a12c0199cbd4f9a9928d2192d09df3de
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
        	})
		return false
	} 
	if (!address.length){
		MessageBarManager.showAlert({
            message: "Plese Enter Address",
            alertType: 'alert',
        	})
		return false
	}
	if (!type.length){ 
		MessageBarManager.showAlert({
            message: "Plese Select User Type",
            alertType: 'alert',
        	})
		return false;
	}
		return true;
}

onSubmit() {
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
			formData.append('card_number', String('343454645664')); 
			formData.append('expiry_month', String('3')); 
			formData.append('expiry_year', String('20')); 
			formData.append('cvv', String('456')); 
<<<<<<< HEAD
			// console.warn(JSON.stringify(formData));
			// console.warn(this.state.os);
=======
>>>>>>> 81129869a12c0199cbd4f9a9928d2192d09df3de
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

export default Register;
