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

export default class Contact extends Component<{}> {
    constructor(props) {
        super(props);        
        this.state={ 
            name: '', 
            email: '', 
            issue: '', 
            message: '', 
        }
    }
    contactUS(){
        const { name, email , issue, message } = this.state;
        let formData = new FormData();
        formData.append('u_id', String(1));
        formData.append('country', String(1)); 
        formData.append('name', String(name)); 
        formData.append('email', String(email)); 
        formData.append('issue_type', String(issue)); 
        formData.append('message', String(message)); 
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
                    value={this.state.issue}
                    underlineColorAndroid = 'transparent'
                    autoCorrect={false}
                    placeholder="Issue"
                    maxLength={140}
                    onSubmitEditing={() => this.onSubmit()}
                    onChangeText={(issue) => this.setState({issue})}/>
                <TextInput
                    style={styles.input}
                    multiline={true}
                    numberOfLines={4}
                    value={this.state.message}
                    underlineColorAndroid = 'transparent'
                    autoCorrect={false}
                    placeholder="Message"
                    maxLength={140}
                    onSubmitEditing={() => this.onSubmit()}
                    onChangeText={(message) => this.setState({message})}
                    />
                <Button title="Send Request" onPress={()=> this.contactUS()}/>
                <Text style={{ padding : 10, fontSize :15, borderBottomWidth:0.5, borderColor : '#ccc'}}>Customer Service</Text>
                <Text style={{ color : '#87cefa' , fontSize : 15}}>Contact Us 24/7</Text>
                <View style={{ flexDirection: 'row'}}>
                    <Feather name="phone-call" size={25} color="#900"/>
                    <Text>+971 55 123456789</Text>
                </View>
                <View style={{ flexDirection: 'row'}}>
                    <Ionicons name="ios-stopwatch-outline" size={25} color="#900"/>
                    <Text>Daily 8 Am to 12 Pm</Text>
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
