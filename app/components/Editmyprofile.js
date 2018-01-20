import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  Keyboard,
  Picker,
  Button,
} from 'react-native';
import {Actions as routes} from "react-native-router-flux";
import { SegmentedControls } from 'react-native-radio-buttons';

import Utils from 'app/common/Utils';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';

const { width, height } = Dimensions.get('window')
const options = [
  { label:'Male', value: 'male' },
    { label:'Female', value: 'female'}];

export default class Editmyprofile extends Component<{}> { 
    constructor(props) {
        super(props);        
        this.getKey = this.getKey.bind(this);      
        this.state={ 
            fullname: this.props.fullname, 
            email: this.props.email, 
            representative_name: this.props.representative_name, 
            device_type: (Platform.OS === 'ios') ? 'ios' : 'android',
            device_token: 'scfzdsncjJHEu3wqyuYUI3Y17Yuytt', 
            gender: this.props.gender, 
            phone_no: this.props.mobile, 
            country: '', 
            address: '', 
        };
        this.inputs = {};
    }
    componentDidMount (){
        this.getKey()
    }
       setSelectedOption(option){
      this.setState({
          gender: option,
        });
    }
    componentWillMount() {
        routes.refresh({ right: this._renderRightButton });    
    }
   _renderRightButton = () => {
        return(
            <TouchableOpacity onPress={() => this.uploadTocloud() } >
            <Text style={{color : '#fff'}}>ADD</Text>
            </TouchableOpacity>
        );
    };

    async getKey() {
        try { 
            const value = await AsyncStorage.getItem('data'); 
            var response = JSON.parse(value);  
            this.setState({ 
                u_id: response.userdetail.u_id ,
                country: response.userdetail.country 
            }); 
        } catch (error) {
            console.log("Error retrieving data" + error);
        }
    }

    submit(){
            Keyboard.dismiss();
        const { 
            u_id, 
            fullname, 
            representative_name, 
            device_type,
            email, 
            device_token, 
            gender,
            phone_no, 
            country, 
            address
        } = this.state;

        let formData = new FormData();
        formData.append('u_id', String(u_id));
        formData.append('fullname', String(fullname)); 
        formData.append('representative_name', String(representative_name)); 
        formData.append('device_type', String(device_type)); 
        formData.append('device_token', String(device_token)); 
        formData.append('gender', String(gender)); 
        formData.append('phone_no', String(phone_no)); 
        formData.append('country', String(country)); 
        formData.append('address', String(address)); 

        if (this.validate()) {
        const config = { 
                method: 'POST', 
                headers: { 
                    'Accept': 'application/json', 
                    'Content-Type': 'multipart/form-data;',
                },
                body: formData,
            }
        fetch(Utils.gurl('editProfile'), config) 
        .then((response) => response.json())
        .then((responseData) => {
            routes.pop();
        })
       .catch((error) => {
            console.log(error);
        })
        .done();

    }
    }  

    validate(){
    const { 
            u_id, 
            fullname, 
            representative_name, 
            device_type, 
            device_token, 
            gender,
            phone_no, 
            country, 
            address,
            email
        } = this.state;
        
        if(!fullname.length) 
        { 
            MessageBarManager.showAlert({
            message: "Please Enter Your FullName",
            alertType: 'alert',
            })
            return false;
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
        if (!phone_no.length)
        { 
            MessageBarManager.showAlert({
                message: "Please Enter Your Contact Number",
                alertType: 'alert',
            })
            return false
        }

        if (!country.length)
        { 
            MessageBarManager.showAlert({
                message: "Please Enter Your Country",
                alertType: 'alert',
            })
            return false
        }
        return true;
    }
    focusNextField(id) { 
        this.inputs[id].focus();
    }


    render() {
     
    return (
        <View style={{ flex : 1}}>
        <ScrollView style={styles.container} keyboardShouldPersistTaps={'handled'}>
     
        <TextInput style={ styles.input}
        placeholder='Full Name'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        // keyboardType='email-address'
        value={this.state.fullname}
        onSubmitEditing={() => { 
            this.focusNextField('two');
        }}
        returnKeyType={ "next" } 
        ref={ input => { 
            this.inputs['one'] = input;
        }}
 
        onChangeText={(text) => this.setState({ fullname: text })} /> 

        <TextInput style={ styles.input}
        placeholder='Email-Address'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        value={this.state.email}
        keyboardType={'email-address'}
        onSubmitEditing={() => { 
            this.focusNextField('three');
        }}
        returnKeyType={ "next" } 
        ref={ input => { 
            this.inputs['two'] = input;
        }}
        onChangeText={(text) => this.setState({ email: text })} />

        <TextInput style={ styles.input}
        placeholder='Phone No'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        value={this.state.phone_no} 
        keyboardType={'numeric'}
        onSubmitEditing={() => { 
                                this.submit();
        }}
        returnKeyType={ "done" } 
        ref={ input => { 
            this.inputs['three'] = input;
        }}
        onChangeText={(text) => this.setState({ phone_no: text })} />
        </ScrollView>
        <Button 
          onPress = {this.submit.bind(this)}
            title="Submit"
            color="orange"
            />

        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft : 20,
    paddingRight : 20,
    // justifyContent: 'space-around',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  input: {
    fontSize: 12,
    height : 40,
    borderColor : "#ccc",
    borderBottomWidth :1,
    width :width,
    // textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
