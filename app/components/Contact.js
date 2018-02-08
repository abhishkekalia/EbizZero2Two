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
    ScrollView,
    Keyboard,
    AsyncStorage
} from "react-native";
const { width, height } = Dimensions.get('window')
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Utils from 'app/common/Utils';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import { Picker } from 'react-native-picker-dropdown';

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
        this.inputs = {};

    }
    focusNextField(id) { 
        this.inputs[id].focus();
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
            Keyboard.dismiss();

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
           this.setState({message : '', issue : ''})
        })
        .catch((error) => {
            console.log(error);
        })
        .done();

    }
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <TextInput
                    style={styles.input}
                    value={this.state.name}
                    underlineColorAndroid = 'transparent'
                    autoCorrect={false}
                    placeholder="Name"
                    maxLength={140}
                            onSubmitEditing={() => { 
                                this.focusNextField('two');
                            }}
                            returnKeyType={ "next" }
                            ref={ input => { 
                                this.inputs['one'] = input;
                            }}
                    onChangeText={(name) => this.setState({name})}/>
                <TextInput
                    style={styles.input}
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
                    onChangeText={(email) => this.setState({email})}/>
                <View style={{
                    borderWidth : 1, 
                    borderColor : "#ccc", 
                    borderRadius : 5,
                    margin: 5,
                    height:40,
                    alignItems :'center',
                    justifyContent:'center'
                }}>
                    <Picker
                    mode="dropdown"
                    selectedValue={this.state.issue}
                    onValueChange={(itemValue, itemIndex) => this.setState({issue: itemValue})}
                    style={{fontSize:15}}
                    >
                        <Picker.Item label="Select Issue" value="" />
                        <Picker.Item label="Damage" value="1" />
                        <Picker.Item label="Poor Quality" value="2" />
                        <Picker.Item label="Not Happy " value="3" />
                    </Picker>
                </View>
                <TextInput
                    style={[styles.input,{height:100}]}
                    numberOfLines={4}
                    value={this.state.message}
                    underlineColorAndroid = 'transparent'
                    autoCorrect={false}
                    placeholder="Message"
                    multiline={true}
                    maxLength={140}

                            returnKeyType={ "done" }
                            ref={ input => { 
                                this.inputs['three'] = input;
                            }}
                    onChangeText={(message) => this.setState({message})}
                    />
                {/* <Button title="Send Request" onPress={()=> this.contactUS()}/> */}

                <TouchableOpacity style ={{justifyContent: 'center', alignItems: 'center', padding: 10, borderColor: '#ccc', flexDirection: 'row', alignItems: 'center', padding:0}} onPress={()=> this.contactUS()}>
                    <View style={{backgroundColor:"#a9d5d1", width:'95%', height:40, alignItems: 'center', justifyContent:'center', borderRadius:5}}>
                             <Text style = {{color:"#FFFFFF"}}>Submit</Text>
                    </View>
                </TouchableOpacity>


                <Text style={{ padding : 10, fontSize :15, borderBottomWidth:0.5, borderColor : '#ccc'}}>CUSTOMER SERVICE</Text>
                <Text style={{ paddingLeft : 10, color : '#a9d5d1' , fontSize : 15}}>Contact Us 24/7</Text>
                <View style={{ flexDirection: 'row', alignItems:'center', paddingLeft:10,marginTop:10}}>
                    <Feather name="phone-call" size={13} color="#900"/>
                    <Text style={{paddingLeft:10}}>+971 55 123456789</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems :'center', paddingLeft:10, marginTop:5}}>
                    <Ionicons name="ios-stopwatch-outline" size={15} color="#900"/>
                    <Text style={{paddingLeft:10}}>Daily 8 Am to 12 PM</Text>
                </View>
            </ScrollView>
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
      height : 40,
      fontSize: 15,
      textAlign: 'left',
      margin: 5,
      padding:5
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
});
