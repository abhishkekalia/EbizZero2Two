import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Switch,
  View,
  Picker,
  AsyncStorage,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import Utils from 'app/common/Utils';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Actions as routes} from "react-native-router-flux";
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
const { width, height } = Dimensions.get('window');

const is_notification = '0'

export default class Settings extends Component { 
    constructor(props) {
        super(props);
        this.state = {
            toggled : false,
            is_notification : '',
            u_id: null,
            country : null,

        } 
    }
    componentDidMount(){
        this.getKey()
        .then(()=>this.fetchData())
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
        const { u_id,country, } = this.state; 
        let formData = new FormData();
        formData.append('u_id', String(u_id));
        formData.append('country', String(country));
        formData.append('is_notification', 1);  
  

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
            // console.warn(response.data);
            // console.warn(response.data.is_notification);
        //     this.setState({
        //         is_notification: responseData.data.is_notification
        // });
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
                })
            }else{
                MessageBarManager.showAlert({ 
                message: response.data.message, 
                alertType: 'alert', 
                })
            }

        })
        .catch((error) => {
          console.log(error);
        })       
        .done();
    }


    render() {
        // console.warn(this.state.is_notification);
        return (
            <View style={styles.container}>
                <View style={styles.notify}>
                    <Text>Notification</Text>
                      <Switch 
                      onValueChange={ (value) => this.setState({ toggled: value })}  
                      value={ this.state.toggled } 
                      // onTintColor="#00ff00"  
                      thumbTintColor="#fff" 
                      tintColor="#000" />
                </View> 

                <View style={{ flexDirection : 'column'}}>
                    <View style={{
                                borderTopWidth : 1,
        borderBottomWidth : 1,
        borderColor : '#ccc',
        // padding : 10, 
        justifyContent:"space-between", 
        // top : 10,  
        flexDirection: 'row',  
        backgroundColor: '#fff', 
        alignItems: 'center'

                    }}>
                        <Text>Country</Text>
                        <Picker 
                        mode="dropdown"
                        style={{width : width/3}} 
                        selectedValue={this.state.country}
                        onValueChange={(itemValue, itemIndex) => this.setState({country: itemValue})}>
                            <Picker.Item label="Select Country" value="" />
                            <Picker.Item label="India" value="1" />
                            <Picker.Item label="Us" value="2" />
                            <Picker.Item label="Uk" value="3" />
                        </Picker> 
                    </View>
                    <TouchableOpacity style={styles.locact} onPress={()=>this.clearOrderHistory()}>
                        <Text>Clear Order Hostory</Text>
                    </TouchableOpacity>
                </View>

                <View style={{flexDirection : 'column', top : 10 }}>

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
        backgroundColor: '#ccc', 
    },

    notify: { 
        padding : 10,
        justifyContent:"space-between", 
        flexDirection: 'row', 
        backgroundColor: '#fff', 
        alignItems: 'center' 
    }, 
    locact: {
        borderTopWidth : 1,
        borderBottomWidth : 1,
        borderColor : '#ccc',
        padding : 10, 
        justifyContent:"space-between", 
        top : 10,  
        flexDirection: 'row',  
        backgroundColor: '#fff', 
        alignItems: 'center'
    },
});
