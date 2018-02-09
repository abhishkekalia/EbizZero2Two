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
	Keyboard
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
const options = [
	{ label:'Male', value: 'male' },
    { label:'Female', value: 'female'},
    { label:'Other', value: 'other' }];

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
		const {errorStatus, loading} = this.props;
		return (
			<ScrollView
			showsVerticalScrollIndicator ={false}
			style={[ commonStyles.content]}
			testID="Login"
			keyboardShouldPersistTaps={'handled'}>
			<View>
				<View style ={[commonStyles.registerContent]}>
					<View style ={commonStyles.iconusername}>

						<TextInput
							style={[commonStyles.inputusername, { borderTopLeftRadius : 10, borderTopRightRadius:10, height:40}]}
							value={this.state.company}
							underlineColorAndroid = 'transparent'
							autoCorrect={false}
							placeholder="Company"
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
							style={[commonStyles.inputpassword,{ height:40}]}
							value={this.state.representative_name}
							underlineColorAndroid = 'transparent'
							autoCorrect={false}
							placeholder="Representative Name"
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
								style={[commonStyles.inputusername,{ height:40}]}
								value={this.state.contact}
								underlineColorAndroid = 'transparent'
								autoCorrect={false}
								placeholder="Mobile Number"
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
							style={[commonStyles.inputusername,{ height:40}]}
							value={this.state.email}
							underlineColorAndroid = 'transparent'
							autoCorrect={false}
							placeholder="Email"
							maxLength={140}
							keyboardType={'email-address'}
          					onSubmitEditing={() => {
          						this.focusNextField('five');
          					}}
          					returnKeyType={ "next" }
 						       ref={ input => {
 						       	this.inputs['four'] = input;
 						       }}
 						       onChangeText={(email) => this.setState({email})}
						/>
					</View>
					<View style ={commonStyles.iconusername}>

							<TextInput
								style={[commonStyles.inputusername,{ height:40}]}
								value={this.state.address}
								underlineColorAndroid = 'transparent'
								autoCorrect={false}
								placeholder="Address"
								maxLength={140}
          						onSubmitEditing={() => {
          							this.focusNextField('Six');
          						}}
          						returnKeyType={ "next" }
 						        ref={ input => {
 						        	this.inputs['five'] = input;
 						        }}
 						        onChangeText={(address) => this.setState({address})}
							/>
					</View>
					<View style ={[commonStyles.iconusername, { alignItems: 'center'}]}>

						<TextInput
							style={[commonStyles.inputpassword,{ height:40}]}
                           	secureTextEntry={this.state.hidden}
                           	value={this.state.password}
							underlineColorAndroid = 'transparent'
							autoCorrect={false}
							placeholder="Password"
							maxLength={140}
          					onSubmitEditing={() => {
          						this.focusNextField('seven');
          					}}
          					returnKeyType={ "next" }
 					        ref={ input => {
 						        	this.inputs['Six'] = input;
 					        }}
 					        onChangeText={ (password) => this.setState({ password }) }
						/>

					</View>
					<TouchableOpacity style ={[commonStyles.show, { flexDirection: 'row'}]} onPress={()=> this.eye()}>
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
					{/* <View style={{
					        	flexDirection: 'row',
					        	justifyContent: 'center',
					        	alignItems: 'center' ,
					        	}}>				 */}
					<View style={{flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center' ,
		marginLeft: 5
	}}
		>
						<Picker
                            style={{width: width-50, height: 40}}
                            mode="dropdown"
                            selectedValue={this.state.selectCountry}
                            onValueChange={(itemValue, itemIndex) =>
                            this.setState({selectCountry: itemValue})}>
                                {this.loadUserTypes()}

                            </Picker>

							{!this.state.selectCountry? <Text style={{position:'absolute', marginLeft:5, fontSize:12}} onPress={()=>console.log("echo")}>Select Country</Text>: undefined}
                    </View>
				</View>
				<Text style={{ paddingTop:5,paddingBottom:5}}>Add Social Media Acount</Text>
				<View style ={[commonStyles.registerContent, {marginBottom : 10}]}>
					<View style ={[commonStyles.iconusername, { alignItems : 'center'}]}>
							<Ionicons name="sc-facebook" size={25} color="#3b5998"  style={commonStyles.social}/>
						<TextInput
							style={[commonStyles.socialInput,{ height:40}]}
							value={this.state.facebook_id}
							underlineColorAndroid = 'transparent'
							autoCorrect={false}
							placeholder="Add Facebook Business Page"
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
					<View style ={[commonStyles.iconusername, { alignItems : 'center'}]}>
							<Icon name="twitter" size={25} color="#0084b4"  style={commonStyles.social}/>
						<TextInput
							style={[commonStyles.socialInput,{ height:40}]}
							value={this.state.twitter_id}
							underlineColorAndroid = 'transparent'
							autoCorrect={false}
							placeholder="Add Twitter Business Page"
							maxLength={140}
							keyboardType={'default'}
          					onSubmitEditing={() => {
          						this.focusNextField('nine');
          					}}
          					returnKeyType={ "next" }
 						       ref={ input => {
 						       	this.inputs['eight'] = input;
 						       }}
 						       onChangeText={(twitter_id) => this.setState({twitter_id})}
						/>
					</View>
					<View style ={[commonStyles.iconusername, { alignItems : 'center'}]}>
							<Icon name="instagram" size={25} color="#a9d5d1"  style={commonStyles.social}/>
						<TextInput
							style={[commonStyles.socialInput,{ height:40}]}
							value={this.state.instagram_id}
							underlineColorAndroid = 'transparent'
							autoCorrect={false}
							placeholder="Add Instagram Business Page"
							maxLength={140}
							keyboardType={'default'}
          					onSubmitEditing={() => {
          						this.focusNextField('ten');
          					}}
          					returnKeyType={ "next" }
 						       ref={ input => {
 						       	this.inputs['nine'] = input;
 						       }}
 						       onChangeText={(instagram_id) => this.setState({instagram_id})}
						/>
					</View>
					<View style ={{ flexDirection: 'row',
					backgroundColor : 'transparent',
					alignItems : 'center'}}>
							<Icon name="snapchat" size={25} color="orange"  style={commonStyles.social}/>
						<TextInput
							style={[commonStyles.socialInput,{ height:40}]}
							value={this.state.snapchat_id }
							underlineColorAndroid = 'transparent'
							autoCorrect={false}
							placeholder="Add Snapchat Business Page"
							maxLength={140}
							keyboardType={'default'}
          					onSubmitEditing={() => {
          						this.onSubmit()
          					}}
          					returnKeyType={ "done" }
 						       ref={ input => {
 						       	this.inputs['ten'] = input;
 						       }}
 						       onChangeText={(snapchat_id) => this.setState({snapchat_id})}
						/>
					</View>
				</View>
				</View>
				{/* <Button
				onPress = {this.onSubmit.bind(this)}
  				title="Create Acount"
  				color="orange"
  				// style={{bottom:50}}
				  /> */}
				  <TouchableOpacity style ={{justifyContent: 'center', alignItems: 'center', padding: 10, borderColor: '#ccc', flexDirection: 'row', alignItems: 'center', padding:0}} onPress={this.onSubmit.bind(this)}>
					<View style={{backgroundColor:"#FFCC7D", width:'100%', height:40, alignItems: 'center', justifyContent:'center', borderRadius:5}}>
							 <Text style = {{color:"#FFFFFF"}}>Create An Acount</Text>
					</View>
				</TouchableOpacity>
			</ScrollView>
		);
	}

validate(){
	const {company, representative_name, contact, email,
		address, password, gender,  selectCountry,
		facebook_id, twitter_id, instagram_id, snapchat_id } = this.state;
	if (!company.length){
		MessageBarManager.showAlert({
            message: "Plese Enter Company Name",
            alertType: 'warning',
        	})
		return false
	}
	if (!representative_name.length){
		MessageBarManager.showAlert({
            message: "Plese Enter Representative Name",
            alertType: 'warning',
        	})
		return false
	}
	if (!contact.length){
		MessageBarManager.showAlert({
            message: "Plese Enter Your Contact Number",
            alertType: 'warning',
        	})
		return false
	}

	let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
	if(reg.test(email) === false)
		{
		MessageBarManager.showAlert({
           message: "Plese Enter Valid Email",
           alertType: 'warning',
         })
		return false;
	}
	if (!address.length){
		MessageBarManager.showAlert({
            message: "Plese Enter Address",
            alertType: 'warning',
        	})
		return false
	}

	if (!password.length){
		MessageBarManager.showAlert({
            message: "Plese Enter Your Password",
            alertType: 'warning',
        	})
		return false
	}
	if( gender.value === undefined){
		MessageBarManager.showAlert({
           message: "Plese Select Gender",
           alertType: 'warning',
         })
		return false;
	}

	if (!selectCountry.length){
		MessageBarManager.showAlert({
            message: "Plese Select Country",
            alertType: 'warning',
        	})
		return false
	}
	if (!facebook_id.length){
		MessageBarManager.showAlert({
            message: "Plese Enter Facebook Bussiness Page",
            alertType: 'warning',
        	})
		return false
	}
	if (!twitter_id.length){
		MessageBarManager.showAlert({
            message: "Plese Enter Twitter Bussiness Page",
            alertType: 'warning',
        	})
		return false
	}
	if (!instagram_id.length){
		MessageBarManager.showAlert({
            message: "Plese Enter Instagram Bussiness Page",
            alertType: 'warning',
        	})
		return false
	}
	if (!snapchat_id.length){
		MessageBarManager.showAlert({
            message: "Plese Enter Snapchat Bussiness Page",
            alertType: 'warning',
        	})
		return false
	}
		return true;
}

onSubmit() {
	Keyboard.dismiss();
		const {company, representative_name, email, password, gender, contact, selectCountry, os, address, type,
		facebook_id, twitter_id, instagram_id, snapchat_id } = this.state;

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

export default Vendorreg;
