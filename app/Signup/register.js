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
	Dimensions
} from "react-native";
import {Loader} from "app/common/components";
import commonStyles from "app/common/styles";
import {Actions as routes} from "react-native-router-flux";
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SegmentedControls } from 'react-native-radio-buttons';
import Utils from 'app/common/Utils';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
// import { Picker } from 'react-native-picker-dropdown';

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
    { label:'Female', value: 'female'},
    { label:'Other', value: 'other' }];

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
		};
	    this.inputs = {};

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
			<ScrollView style={[ commonStyles.content]} testID="Login" keyboardShouldPersistTaps={'handled'}>
				<View style ={[commonStyles.registerContent, {marginBottom : 10}]}>
					<View style ={commonStyles.iconusername}>

						<TextInput
							style={[commonStyles.inputusername, { borderTopLeftRadius : 10, borderTopRightRadius:10, height:40}]}
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
							style={[commonStyles.inputpassword,{ height:40}]}
							value={this.state.email}
							underlineColorAndroid = 'transparent'
							autoCorrect={false}
							placeholder="Email Address"
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
							style={[commonStyles.inputpassword,{height:40}]}
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

 				<View style={{borderBottomWidth: 0.5, borderColor: '#ccc'}}>
 				        			<Text/>

        			<SegmentedControls
        			  	tint= {'#a9d5d1'}
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
							style={[commonStyles.inputusername,{height:40}]}
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

					<TouchableOpacity style={[commonStyles.iconusername, {
					        				flexDirection: 'row',
					        				justifyContent: 'space-between',
					        				alignItems: 'center' ,
					        				marginBottom : 5
					        					}]}>
					{/* <View style={{flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center' ,
		marginLeft: 5,
	}}
		>					 */}
						<Picker
                            style={{width: width-50, height: 40}}
                            mode="dropdown"
                            selectedValue={this.state.selectCountry}
                            onValueChange={(itemValue, itemIndex) =>
                            this.setState({selectCountry: itemValue})}>
                                {this.loadUserTypes()}

                            </Picker>

							{!this.state.selectCountry? <Text style={{position:'absolute', marginLeft:5, fontSize:12}} onPress={()=>console.log("echo")}>Select Country</Text>: undefined}

						</TouchableOpacity>
						{/* </View> */}

					<View style={[{
					flexDirection: 'row',
					// justifyContent: 'center',
					// alignItems: 'center' ,
						}]}>
						<TextInput
    						style={[commonStyles.inputpassword,{height:40}] }
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

				</View>
				{/* <Button
				onPress = {this.onSubmit.bind(this)}
  				title="Create Acount"
  				color="orange"
  				/> */}
				  <TouchableOpacity style ={{justifyContent: 'center', alignItems: 'center', padding: 10, borderColor: '#ccc', flexDirection: 'row', alignItems: 'center', padding:0}} onPress={this.onSubmit.bind(this)}>
					<View style={{backgroundColor:"#FFCC7D", width:'100%', height:40, alignItems: 'center', justifyContent:'center', borderRadius:5}}>
							 <Text style = {{color:"#FFFFFF"}}>Create An Acount</Text>
					</View>
				</TouchableOpacity>
  				<View style={{flexDirection : 'column', alignItems : 'center', flex: 1}}>
  					<TouchableOpacity style={{padding :20}}
  					onPress={()=> routes.registerVendor()}>
  					<Text >If you are vendor ? Register Here</Text>
  					</TouchableOpacity>
  					<Text style={{ padding : 20}}>By Signing in You are agreeing to Our </Text>

  					<TouchableOpacity
  					onPress={()=> routes.terms({
  						title: this.state.termsandcondition_title,
  						description: this.state.termsandcondition_description
  					})}>
  					<Text> Terms and
  					Conditions of Use and Privacy Policy</Text>
  					</TouchableOpacity>
  				</View>
			</ScrollView>
		);
	}

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
