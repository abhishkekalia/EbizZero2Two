import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Switch,
  View,
  AsyncStorage,
  TouchableOpacity,
  Dimensions,
  Image,
//   Picker
} from 'react-native';
import Utils from 'app/common/Utils';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Actions as routes} from "react-native-router-flux";
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
const { width, height } = Dimensions.get('window');
import EventEmitter from "react-native-eventemitter";

import { Picker } from 'react-native-picker-dropdown';

const is_notification = '0'

export default class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            countryList:[],
            toggled : false,
            is_notification : this.props.is_notification,
            u_id: null,
            country : null,

        }
    }
    componentDidMount(){
        this.getKey()
        .then(()=>this.fetchcountryList())
        .done();

    }
    async getKey() {
        try {
            const value = await AsyncStorage.getItem('data');
            var response = JSON.parse(value);
            this.setState({
                u_id: response.userdetail.u_id ,
                country: response.userdetail.country ,
            });
        } catch (error) {
            console.log("Error retrieving data" + error);
        }
    }

    getprivacypolicy(){
        fetch(Utils.gurl('getprivacypolicy'),{
             method: "GET", headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((responseData) => {
            if (responseData.status) {
                routes.terms({
                title: "Privacy Policy",
                description: responseData.data.privacypolicy_description
            })
            }
        })
       .catch((error) => {
          console.log(error);
        })
        .done();

    }
    getlegalnotice(){
        fetch(Utils.gurl('getlegalnotice'),{
             method: "GET", headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((responseData) => {
            if (responseData.status) {
                routes.terms({
                title: "Legal Notice",
                description: responseData.data.legalnotice_description
            })
            }
        })
        .catch((error) => {
          console.log(error);
        })
        .done();
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
                routes.terms({
                title: "Terms & Condition",
                description: responseData.data.termsandcondition_description
            })
            }
        })
        .catch((error) => {
          console.log(error);
        })
        .done();
    }
    getreturnpolicy(){
        fetch(Utils.gurl('getreturnpolicy'),{
             method: "GET", headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((responseData) => {
            if (responseData.status) {
                routes.terms({
                title: "Return Policy",
                description: responseData.data.returnpolicy_description
            })
            }
        })
        .catch((error) => {
          console.log(error);
        })
        .done();
    }
    getshipmentpolicy(){
        fetch(Utils.gurl('getshipmentpolicy'),{
             method: "GET", headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((responseData) => {
            if (responseData.status) {
                routes.terms({
                title: "Shipment Policy",
                description: responseData.data.shipmentpolicy_description
            })
            }
        })
        .catch((error) => {
          console.log(error);
        })
        .done();
    }
    getaboutus(){
        fetch(Utils.gurl('getaboutus'),{
             method: "GET", headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((responseData) => {
            if (responseData.status) {
                routes.terms({
                title: "About Us",
                description: responseData.data.aboutus_description
            })
            }
        })
        .catch((error) => {
          console.log(error);
        })
        .done();
    }

    fetchData(){
        const { u_id,country, is_notification } = this.state;
        let formData = new FormData();
        formData.append('u_id', String(u_id));
        formData.append('country', String(country));
        formData.append('is_notification', String(is_notification));


        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }

        fetch(Utils.gurl('setting'), config)
        .then((response) => response.json())
        .then((response) => {
          EventEmitter.emit('reloadAddressProfile');
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        })
        .done();
    }

    clearOrderHistory(){
            const { u_id,country, } = this.state;

        let formData = new FormData();
        formData.append('u_id', String(u_id));
        formData.append('country', String(country));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }

        fetch(Utils.gurl('clearOrderHistory'), config)
        .then((response) => response.json())
        .then((response) => {
            if(response.status){
                MessageBarManager.showAlert({
                message: response.data.message,
                alertType: 'alert',
                title:''
                })
            }else{
                MessageBarManager.showAlert({
                message: response.data.message,
                alertType: 'alert',
                title:''
                })
            }

        })
        .catch((error) => {
          console.log(error);
        })
        .done();
    }

    fetchcountryList(){
        fetch(Utils.gurl('countryList'),{
             method: "GET", headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((responseData) => {
            console.log("CountryList:=-",responseData.response.data)
            this.setState({
                countryList: responseData.response.data,
                 loaded: true
        });
        })
        .catch((error) => {
          console.log(error);
        })
        .done();
    }
    loadCountry() {
        return this.state.countryList.map(user => (
            <Picker.Item key={user.country_id} label={user.country_name} value={user.country_id} />
        ))
    }

    render() {
      let notify = (this.state.is_notification === "1") ? true : false
      var selCountryObj = null
      for (let index = 0; index < this.state.countryList.length; index++) {
          let element = this.state.countryList[index];
          if (element.country_id == this.state.country) {
              selCountryObj = element
          }
      }
        return (
            <View style={styles.container}>
                <View style={styles.notify}>
                    <Text>Notification</Text>
                      <Switch
                      onValueChange={ (value) =>
                        this.setState({ is_notification : notify ? "0" : "1"},()=>this.fetchData())
                      }
                      value={notify}
                      onTintColor="#00ff00"
                      thumbTintColor="#fff"
                      tintColor="#000"
                      onTintColor="#a9d5d1"
                      thumbTintColor='black'/>
                </View>

                <View style={{ flexDirection : 'column'}}>
                    <View style={{
                        borderTopWidth : 1,
                        borderBottomWidth : 1,
                        borderColor : '#ccc',
                        height:40,
                        padding : Platform.OS === 'ios' ? 10 : 0,
                        paddingLeft : 10,
                        paddingRight : 10,
                        justifyContent:"space-between",
                        // top : 10,
                        flexDirection: 'row',
                        backgroundColor: '#fff',
                        alignItems: 'center'
                    }}>
                        <Text style={{width:'40%'}}>Country</Text>
                        {!this.state.country? undefined: <Image style={{height:30, width:40}}
							resizeMode = 'center'
							resizeMethod = 'resize'
							source={{uri : selCountryObj ? selCountryObj.flag : "" }}
							onLoadEnd={() => {  }}
							/>
						}
                        <Picker
                        mode="dropdown"
                        style={{width : width/3}}
                        selectedValue={this.state.country}
                        onValueChange={(itemValue, itemIndex) => this.setState({country: itemValue})}>
                            {this.loadCountry()}
                        </Picker>
                    </View>
                    <TouchableOpacity style={styles.locact} onPress={()=>this.clearOrderHistory()}>
                        <Text>Clear Order Hostory</Text>
                    </TouchableOpacity>
                </View>

                <View style={{flexDirection : 'column', top : 5 }}>

                    <TouchableOpacity style={styles.locact} onPress={()=> this.getprivacypolicy()}>
                        <Text>Privacy</Text>
                        <Icon name="keyboard-arrow-right" size={25} color="#ccc"/>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.locact} onPress={()=> this.getlegalnotice()}>
                        <Text>Legal Notice</Text>
                        <Icon name="keyboard-arrow-right" size={25} color="#ccc"/>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.locact} onPress={()=> this.gettermandcondition()}>
                        <Text>Terms and Conditions</Text>
                        <Icon name="keyboard-arrow-right" size={25} color="#ccc"/>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.locact} onPress={()=> this.getreturnpolicy()}>
                        <Text>Return Policy</Text>
                        <Icon name="keyboard-arrow-right" size={25} color="#ccc"/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.locact} onPress={()=> this.getshipmentpolicy()}>
                        <Text>Shipment Policy</Text>
                        <Icon name="keyboard-arrow-right" size={25} color="#ccc"/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.locact} onPress={()=> this.getaboutus()}>
                        <Text>About Us</Text>
                        <Icon name="keyboard-arrow-right" size={25} color="#ccc"/>
                    </TouchableOpacity>
                    <View style={styles.locact}>
                        <Text>Version</Text>
                        <Text>1.0.0</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#f6f6f6',
    },

    notify: {
        padding : 10,
        justifyContent:"space-between",
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    locact: {
        borderTopWidth : StyleSheet.hairlineWidth,
        borderBottomWidth : StyleSheet.hairlineWidth,
        borderColor : '#ccc',
        padding : 10,
        justifyContent:"space-between",
        top : 5,
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center'
    },
});
