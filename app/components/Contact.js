import React, { Component } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity,
    Dimensions, 
    Button ,
    Platform,
    StyleSheet,
    Picker,
    AsyncStorage
} from "react-native";
const { width, height } = Dimensions.get('window')
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Utils from 'app/common/Utils';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';

export default class Contact extends Component<{}> {
    constructor(props) {
        super(props);        
        this.state={ 
            name: '', 
            email: '', 
            issue: '', 
            message: '',
            u_id: '',
            country : '',
        }
    }
    componentDidMount(){
        this.getKey()
        .done()
        
        // var o = {"0":"1","1":"2","2":"3","3":"abhi"};
        // var arr = Object.keys(o).map(function(k) { return o[k] });
        // console.warn(arr)
    }
    async getKey() {
        try { 
            const value = await AsyncStorage.getItem('data'); 
            var response = JSON.parse(value);  
            this.setState({ 
                u_id: response.userdetail.u_id ,
                country: response.userdetail.country ,
                user_type: response.userdetail.user_type ,
                name: response.userdetail.fullname ,
                email: response.userdetail.email 
            }); 
        } catch (error) {
            console.log("Error retrieving data" + error);
        }
    }
    validate(){
        const {name, email, issue,message } = this.state;
        if (!name.length)
        {
            MessageBarManager.showAlert({
                message: "Please Enter Your Name",
                alertType: 'alert',
            })
            return false
        }
        if (!email.length)
        {
            MessageBarManager.showAlert({
                message: "Please Enter Your Email",
                alertType: 'alert',
            })
            return false
        }
        if (!issue.length)
        {
            MessageBarManager.showAlert({
                message: "Please Select Your Issue",
                alertType: 'alert',
            })
            return false
        }
        if (!message.length)
        {
            MessageBarManager.showAlert({
                message: "Please Enter Your Message",
                alertType: 'alert',
            })
            return false
        }
            return true;
    } 
    contactUS(){
        const { u_id,country, name, email , issue, message } = this.state;
        let formData = new FormData();
        formData.append('u_id', String(u_id));
        formData.append('country', String(country)); 
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
        if (this.validate()) {            
        fetch(Utils.gurl('contactUs'), config)  
        .then((response) => response.json())
        .then((responseData) => {
           MessageBarManager.showAlert({
                message: responseData.data.message,
                alertType: 'alert',
            })
        })
        .done();
    }
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
                <View style={{
                    borderWidth : 1, 
                    borderColor : "#ccc", 
                    borderRadius : 5,
                    margin: 5,
                }}>
                    <Picker
                    mode="dropdown"
                    selectedValue={this.state.issue}
                    onValueChange={(itemValue, itemIndex) => this.setState({issue: itemValue})
                    }>
                        <Picker.Item label="Select Issue" value="" />
                        <Picker.Item label="Damage" value="1" />
                        <Picker.Item label="Poor Quality" value="2" />
                        <Picker.Item label="Not Happy " value="3" />
                    </Picker>
                </View>
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
