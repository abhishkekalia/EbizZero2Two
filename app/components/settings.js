import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Switch,
  View
} from 'react-native';
import Utils from 'app/common/Utils';
import Icon from 'react-native-vector-icons/MaterialIcons';



const u_id = "2";
const country = '1';
const is_notification = '0'

export default class Settings extends Component { 
    constructor(props) {
        super(props);
        this.state = {
            toggled : false,
            is_notification : '',
        } 
    }
    componentDidMount(){
        this.fetchData()
    }

    fetchData(){ 
        let formData = new FormData();
        formData.append('u_id', String(2));
        formData.append('country', String(1));
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
            console.info(response.data);
            console.info(response.data.is_notification);
        //     this.setState({
        //         is_notification: responseData.data.is_notification
        // });
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
                    <View style={styles.locact}>
                        <Text>Country</Text>
                        <Text>Notification</Text>
                    </View>
                    <View style={styles.locact}>
                        <Text>Clear Hostory</Text>
                        <Text>Notification</Text>
                    </View>
                </View>

                <View style={{flexDirection : 'column', top : 10 }}>

                    <View style={styles.locact}>
                        <Text>Privacy</Text>
                        <Icon name="keyboard-arrow-right" size={25} color="#ccc"/>
                    </View>

                    <View style={styles.locact}>
                        <Text>Legal Notice</Text>
                        <Icon name="keyboard-arrow-right" size={25} color="#ccc"/>
                    </View>

                    <View style={styles.locact}>
                        <Text>Terms and Conditions</Text>
                        <Icon name="keyboard-arrow-right" size={25} color="#ccc"/>
                    </View>
                  
                    <View style={styles.locact}>
                        <Text>Return Policy</Text>
                        <Icon name="keyboard-arrow-right" size={25} color="#ccc"/>
                    </View>
                    <View style={styles.locact}>
                        <Text>Shipment Policy</Text>
                        <Icon name="keyboard-arrow-right" size={25} color="#ccc"/>
                    </View>
                    <View style={styles.locact}>
                        <Text>About Us</Text>
                        <Icon name="keyboard-arrow-right" size={25} color="#ccc"/>
                    </View>
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
