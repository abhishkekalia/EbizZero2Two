import React, { Component } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity,
  Dimensions, 
  Button ,
  Platform,
  StyleSheet
} from "react-native";
const { width, height } = Dimensions.get('window')
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Utils from 'app/common/Utils';

export default class Editmyprofile extends Component {
    constructor(props) {
        super(props);        
        this.state={ 
            fullname: '', 
            representative_name: '', 
            device_type: '', 
            device_token: '', 
            gender: '', 
            phone_no: '', 
            country: '', 
            address: '', 
        }
    }
    onSubmit(){
        const { name, email , issue, message } = this.state;
        let formData = new FormData();
        formData.append('u_id', String(1));
        formData.append('fullname', String(fullname)); 
        formData.append('representative_name', String(representative_name)); 
        formData.append('device_type', String(device_type)); 
        formData.append('device_token', String(device_token)); 
        formData.append('gender', String(gender)); 
        formData.append('phone_no', String(phone_no)); 
        formData.append('country', String(country)); 
        formData.append('address', String(address)); 
            const config = { 
                method: 'POST', 
                headers: { 
                    'Accept': 'application/json', 
                    'Content-Type': 'multipart/form-data;' 
                },
                body: formData,
            }
        fetch(Utils.gurl('contactUs'), config)  
        .then((response) => response.json())
        .then((responseData) => {
        console.warn(JSON.stringify(responseData)) 
        })
        .done();
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    value={this.state.name}
                    underlineColorAndroid = 'transparent'
                    autoCorrect={false}
                    placeholder="Name"
                    maxLength={140}
                    onSubmitEditing={() => this.onSubmit()}
                    onChangeText={(name) => this.setState({name})}/>
                <TextInput
                    style={styles.input}
                    value={this.state.email}
                    underlineColorAndroid = 'transparent'
                    autoCorrect={false}
                    placeholder="Email Address"
                    maxLength={140}
                    onSubmitEditing={() => this.onSubmit()}
                    onChangeText={(email) => this.setState({email})}/>
                <TextInput
                    style={styles.input}
                    value={this.state.contact}
                    underlineColorAndroid = 'transparent'
                    autoCorrect={false}
                    placeholder="Contact"
                    maxLength={140}
                    onSubmitEditing={() => this.onSubmit()}
                    onChangeText={(contact) => this.setState({contact})}/>
                
                <TouchableOpacity onPress={() => this.onSubmit()} style={{backgroundColor : '#a9d5d1', height : 40,
        alignItems : 'center',
        justifyContent : 'center'}}>
                <Text style={{ color : '#fff'}}>Submit</Text>
                </TouchableOpacity>
                            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      // justifyContent: 'center',
      // alignItems: 'center',
      backgroundColor: '#F5FCFF',
      padding : 10
    },
    input: {
      borderWidth : 1,
      borderColor : "#ccc",
      borderRadius : 5,
      // width : width,
      // height : 40,
      fontSize: 20,
      textAlign: 'left',
      margin: 5,
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
});