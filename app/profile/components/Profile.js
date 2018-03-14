import React, {Component, PropTypes} from "react";
import {View, Text, StyleSheet, TouchableOpacity, AsyncStorage, TextInput } from "react-native";
import { Actions} from "react-native-router-flux";
import Feather from 'react-native-vector-icons/Feather';
import I18n from 'react-native-i18n'

import Entypo from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Utils from 'app/common/Utils';
import EventEmitter from "react-native-eventemitter";
import Modal from 'react-native-modal';

class Profile extends Component {
	constructor(props) {
        super(props);

        this.getKey = this.getKey.bind(this);
        this.state={
        	dataSource: [],
        	status : false,
            u_id: null,
            address : [],
            country : null,
            email : null,
            phone_no : null,
			visibleModal: false,
        };
    }

    componentDidMount(){
	    this.getKey()
	    .then(()=>this.getAddress())
		.done()

		EventEmitter.removeAllListeners("reloadAddressProfile");
        EventEmitter.on("reloadAddressProfile", (value)=>{
            console.log("reloadAddressProfile", value);
            this.getAddress()
        });
    }
    componentWillMount() {
		Actions.refresh({ left: this._renderLeftButton, right: this._renderRightButton,});
    }
	_renderLeftButton = () => {
		 return(
			 <Feather name="menu" size={20} onPress={()=> Actions.drawerOpen()} color="#fff" style={{ padding : 10}}/>
		 );
	 };

   _renderRightButton = () => {
        return(
            <Text style={{color : '#fff'}}></Text>
        );
    };

    async getKey() {
        try {
            const value = await AsyncStorage.getItem('data');
            var response = JSON.parse(value);

            this.setState({
                u_id: response.userdetail.u_id ,
                email: response.userdetail.email,
                phone_no: response.userdetail.phone_no,
                country: response.userdetail.country
            });
        } catch (error) {
            console.log("Error retrieving data" + error);
        }
    }
    getAddress(){
    	const { u_id, country } = this.state;
    	let formData = new FormData();
    	formData.append('u_id', String(u_id));
    	formData.append('country', String(country));
    		const config = {
               	method: 'POST',
               	headers: {
               		'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data;'
                },
            	body: formData,
            }
        fetch(Utils.gurl('MyProfile'), config)
        .then((response) => response.json())
        .then((responseData) => {
        this.setState({
            	status : responseData.response.status,
            	dataSource : responseData.response.data,
            	address : responseData.response.address
            });
		})
		.catch((error) => {
            console.log(error);
        })
        .done();
    }

    address(address){
		const { lang } = this.props;
		if(this.state.address == '') {
			return (
				<View style={{padding:10}}>
					<Text  style={{ fontSize :15, color:'#696969', textAlign: lang == 'ar'? 'right' :'left'}}>
						{I18n.t('profile.addressbook', { locale: lang })}
					</Text>
				</View>
			)
		}else {
			return (
					<View style={{padding:10}}>
							<Text style={{ fontSize: 15, color:'#696969', textAlign: lang == 'ar' ? 'right' : 'left'}}>
							{address.full_name}
							</Text>
							<View style={{flexDirection: lang == 'ar' ? 'row-reverse': 'row'}}>
							<Text style={{ fontSize : 10, color:'#a9d5d1', textAlign: lang == 'ar' ? 'right' : 'left'}}>
							M
							</Text>
							<Text style={{ fontSize : 10, color:'#fbcdc5', }}>
							{' '}:{' '}
							</Text>
							<Text style={{ fontSize : 10, color:'#696969', textAlign: lang == 'ar' ? 'right' : 'left'}}>
							{address.mobile_number}
							</Text>

							</View>
							<Text style={{fontSize:12, color:'#696969', textAlign: lang == 'ar' ? 'right' : 'left'}}>
							{[address.block_no ," ", address.street , " ", address.houseno,"\n", address.appartment, " ",address.floor, " ",
                    address.jadda,"\n",address.city," ",address.direction]}
							</Text>
						</View>);
		}
	}
	render() {
		const {identity, logout, lang} = this.props,
		{data, u_id, address, dataSource, chart} = this.state,
		direction = lang == 'ar'? 'row-reverse': 'row',
		align = lang == 'ar'? 'flex-end': 'flex-start',
		textline = lang == 'ar'? 'right': 'left';

		return (
			<View style={{flex: 1, flexDirection: 'column', backgroundColor:'rgba(240,241,243,1)'}} testID="Profile">
				<View style={[styles.content, {flexDirection :direction, justifyContent: 'space-between' ,padding : 0, backgroundColor:'#fff'}]}>
					<View style={{ flexDirection : direction }}>
						<View style={{margin:10, width :40, height:40, justifyContent: 'center', alignItems : 'center', borderRadius:25, overflow:'hidden', backgroundColor:'rgba(240,241,243,1)'}}>
							<Entypo
							name="user"
							size={15}
							style={{
								padding :5,
								backgroundColor : 'transparent',
								alignItems : 'center',
								borderRadius : 30 ,
								// borderWidth:1
							}}/>
						</View>

						<View style={{flexDirection : 'column',marginTop:3}}>
							<Text style={[styles.label, { color : '#696969', fontSize:17, textAlign: lang == 'ar' ? 'right' : 'left'}]}>{dataSource.fullname}</Text>
							<Text style={[styles.label, { color : '#696969', textAlign: lang == 'ar' ? 'right' : 'left'}]}>{this.state.email}</Text>
							<Text style={[styles.label, { color : '#fbcdc5', textAlign: lang == 'ar' ? 'right' : 'left'}]}>Contact: {dataSource.mobile}</Text>
						</View>
					</View>

					<TouchableOpacity style={{right:-10  ,width :60, height:60, justifyContent: 'center', alignItems : 'center' }}
					onPress={()=> Actions.editProfile({
						title : this.state.dataSource.fullname,
						fullname : this.state.dataSource.fullname ,
						representative_name : this.state.dataSource.representative_name,
						address : this.state.dataSource.address,
						gender : this.state.dataSource.gender,
						mobile : this.state.dataSource.mobile,
						email : this.state.dataSource.email
					})} >
						<Entypo name="edit" size={20} color="#a9d5d1"/>
					</TouchableOpacity >
				</View>
				<View style={{width:'100%', backgroundColor:'transparent', height:5}}></View>
					<TouchableOpacity style={{ justifyContent: 'center', alignItems : 'center' }}
					onPress={()=> this.setState({
						visibleModal:true
					})} >
					<Text>Change Password</Text>
					</TouchableOpacity >
					<View style={{width:'100%', backgroundColor:'transparent', height:5}}></View>

				<View style={[styles.content, {flexDirection : 'row', justifyContent: 'space-between' ,padding : 0}]}>

					<View style={{ padding : 0, backgroundColor : '#fff', flex : 1, justifyContent : 'center'}}>
						<TouchableOpacity style={{
							flexDirection : lang == 'ar' ? 'row-reverse' : 'row',
							justifyContent: 'space-between',
							alignItems : 'center',
							paddingRight:15,
							paddingLeft:10,
							borderBottomWidth : 0.5,
							borderColor : '#ccc',
							height :40
						}}  onPress={()=>Actions.getmyaddress()} >
							<Text style={{ fontSize : 13, color:"#fbcdc5", textAlign: lang == 'ar' ? 'right' : 'left'}}>{I18n.t('profile.addressbook', { locale: lang })}</Text>

									<Ionicons name="ios-arrow-forward" size={20} color="#ccc" style={ lang == 'ar' ? {transform: [{ rotate: '180deg'}]}: ''} />
						</TouchableOpacity>
					{this.address(address)}

				</View>
				</View>
				<View style={{width:'100%', backgroundColor:'transparent', height:5}}></View>
				<TouchableOpacity onPress={()=>Actions.settings({is_notification : this.state.dataSource.is_notification})} style={[styles.setings, {flexDirection: lang == 'ar' ? 'row-reverse' : 'row'}]}>
					<Text style={{fontSize:12, color:'#696969', textAlign: lang == 'ar' ? 'right' : 'left'}}>{I18n.t('profile.settings', { locale: lang })}</Text>
					<Ionicons name="ios-arrow-forward" size={20} color="#ccc" style={ lang == 'ar' ? {transform: [{ rotate: '180deg'}]}: ''}/>
				</TouchableOpacity>

				<Modal isVisible={this.state.visibleModal}>
					<View style={{alignItems : 'center', padding:10, backgroundColor: '#fff'}}>
					<View style ={[{borderColor:'#fbcdc5'}]}>
						<Ionicons name="ios-mail-outline"
						size={30}
						color="#fbcdc5"
						style= {{ padding: 10}}
						/>
						<TextInput
							style={{left:6.5}}
							// onBlur={ () => this.onBlurUser() }
							value={this.state.forgotPassword}
							underlineColorAndroid = 'transparent'
							autoCorrect={false}
							keyboardType={'email-address'}
							placeholder="Change Password"
							maxLength={140}
							// onSubmitEditing={() => {
							// 				this.focusNextField('two');
							// 			}}
							// 			returnKeyType={ "next" }
							// 		ref={ input => {
							// 			this.inputs['one'] = input;
							// 		}}
							onChangeText={(forgotemail) => this.setState({forgotemail})}
						/>
					</View>
					<View style={{flexDirection: direction, height: 40}}>
					<TouchableOpacity
					onPress={()=> this.setState({ visibleModal:  false})}>
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

			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
	},
	content: {
		borderWidth : 0.5,
		borderColor :'#ccc',
	},
	setings : {
		// top : 5,
		backgroundColor : '#fff',
		padding : 10,
		// flexDirection: "row",
		justifyContent: "space-between",
		borderWidth : 0.5,
		borderColor :'#ccc',
		alignItems: 'center',
		paddingRight: 15
	},
	label: {
		color: '#ccc',
		fontSize: 12,
		fontStyle: 'italic'
	}
});
export default Profile;
