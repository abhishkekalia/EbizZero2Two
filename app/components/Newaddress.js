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
} from 'react-native';
import {Actions as routes} from "react-native-router-flux";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from 'react-native-picker-dropdown';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import Utils from 'app/common/Utils';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';

const { width, height } = Dimensions.get('window')

export default class Newaddress extends Component<{}> { 
    constructor(props) {
        super(props);        
        this.getKey = this.getKey.bind(this);      
        this.state={
        // full_name : this.props.full_name,
        // mobile_number : this.props.mobile_number, 
        // pincode : this.props.pincode, 
        // alternate_number : this.props.alternate_number, 
        // address_line1 : this.props.address_line1, 
        // address_line2 : this.props.address_line2, 
        // landmark : this.props.landmark, 
        // town : this.props.town, 
        // city : this.props.city, 
        // state : this.props.state, 
        // country : this.props.country, 
        // address_type : this.props.address_type,
        // // update : false,
        // address_id : this.props.address_id
        full_name : '',
        mobile_number : '', 
        pincode : '', 
        alternate_number : '', 
        address_line1 : '', 
        address_line2 : '', 
        landmark : '', 
        town : '', 
        city : '', 
        state : '', 
        country : '', 
        address_type : '',
        address_id : '',
        u_id: '',
        };
        this.inputs = {};
    }
    componentDidMount (){
        this.getKey()
    }
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

    
    fetchAddress(){
        const { u_id, country } = this.state;

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

          fetch(Utils.gurl('editAddress'), config)  
          .then((response) => response.json())
          .then((responseData) => { 
                           // console.warn(JSON.stringify(responseData));
               // this.setState({ 
               //  dataSource: this.state.dataSource.cloneWithRows(responseData.data),
               // });
          }).done();
    }
    updateAddress(){
        
        const { 
            full_name, 
            mobile_number, 
            pincode, 
            alternate_number, 
            address_line1, 
            address_line2, 
            landmark, 
            town, 
            city, 
            state, 
            country, 
            address_type,
            address_id ,
            u_id
        } = this.state;
        
        let formData = new FormData();
        formData.append('u_id', String(u_id));
        formData.append('address_id', String(address_id));
        formData.append('full_name', String(full_name));
        formData.append('mobile_number', String(mobile_number));
        formData.append('pincode', String(pincode));
        formData.append('alternate_number', String(alternate_number));
        formData.append('address_line1', String(address_line1));
        formData.append('address_line2', String(address_line2));
        formData.append('landmark', String(landmark));
        formData.append('town', String(town));
        formData.append('city', String(city));
        formData.append('state', String(state));
        formData.append('country', String(country));

        const config = { 
                method: 'POST', 
                headers: { 
                    'Accept': 'application/json', 
                    'Content-Type': 'multipart/form-data;',
                },
                body: formData,
            }
        fetch(Utils.gurl('editAddress'), config) 
        .then((response) => response.json())
        .then((responseData) => {
            routes.pop();
            // console.warn(JSON.stringify(responseData.status))
            // alert(responseData.data.message);
        }).done();
    }

    submit(){
        const {
            u_id, 
            full_name, 
            mobile_number, 
            pincode, 
            alternate_number, 
            address_line1, 
            address_line2, 
            landmark, 
            town, 
            city, 
            state, 
            country, 
            address_type
   } = this.state;


        let formData = new FormData();
        formData.append('u_id', String(u_id));
        formData.append('full_name', String(full_name));
        formData.append('mobile_number', String(mobile_number));
        formData.append('pincode', String(pincode));
        formData.append('alternate_number', String(alternate_number));
        formData.append('address_line1', String(address_line1));
        formData.append('address_line2', String(address_line2));
        formData.append('landmark', String(landmark));
        formData.append('town', String(town));
        formData.append('city', String(city));
        formData.append('state', String(state));
        formData.append('country', String(country));
        formData.append('address_type', String(0)); 

        if (this.validate()) {
        const config = { 
                method: 'POST', 
                headers: { 
                    'Accept': 'application/json', 
                    'Content-Type': 'multipart/form-data;',
                },
                body: formData,
            }
        fetch(Utils.gurl('addAddress'), config) 
        .then((response) => response.json())
        .then((responseData) => {
            routes.pop();
        }).done();
    }
    }  

    validate(){
    const { 
        full_name, 
        mobile_number, 
        pincode, 
        alternate_number, 
        address_line1, 
        address_line2, 
        landmark, 
        town, 
        city, 
        state, 
        country, 
        address_type,
        address_id 
        } = this.state;
        
        if(!full_name.length) 
        { 
            MessageBarManager.showAlert({
            message: "Please Enter Your FullName",
            alertType: 'alert',
            })
            return false;
        }
        if (!mobile_number.length)
        { 
            MessageBarManager.showAlert({
                message: "Please Enter Your Contact Number",
                alertType: 'alert',
            })
            return false
        }
        if (!pincode.length)
        { 
            MessageBarManager.showAlert({
                message: "Please Enter Postal code",
                alertType: 'alert',
            })
            return false
        }
        if (!alternate_number.length)
        { 
            MessageBarManager.showAlert({
                message: "Please Enter Your Alternate Contact Number",
                alertType: 'alert',
            })
            return false
        }
        if (!address_line1.length)
        { 
            MessageBarManager.showAlert({
                message: "Please Enter Your Address First Line",
                alertType: 'alert',
            })
            return false
        }
        if (!address_line2.length)
        { 
            MessageBarManager.showAlert({
                message: "Please Enter Your Address Secound Line",
                alertType: 'alert',
            })
            return false
        }
        if (!landmark.length)
        { 
            MessageBarManager.showAlert({
                message: "Please Enter Landmark",
                alertType: 'alert',
            })
            return false
        }
        if (!town.length)
        { 
            MessageBarManager.showAlert({
                message: "Please Enter Your Town",
                alertType: 'alert',
            })
            return false
        }
        if (!city.length)
        { 
            MessageBarManager.showAlert({
                message: "Please Enter City",
                alertType: 'alert',
            })
            return false
        }
        if (!state.length)
        { 
            MessageBarManager.showAlert({
                message: "Please Enter State",
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
        // if (!address_type.length)
        // { 
        //     MessageBarManager.showAlert({
        //         message: "Please Enter Address Code either 1 or 2",
        //         alertType: 'alert',
        //     })
        //     return false
        // }
        // if (!address_id.length)
        // { 
        //     MessageBarManager.showAlert({
        //         message: "Please Enter Your address_id",
        //         alertType: 'alert',
        //     })
        //     return false
        // }

            return true;
    }
    focusNextField(id) { 
        this.inputs[id].focus();
    }


    render() {
     
    return (
        <View style={{ flex : 1}}>
        <View style={ { 
            height : 59, 
            backgroundColor : '#a9d5d1', 
            flexDirection : 'row', 
            justifyContent:"space-between", 
            alignItems : 'center',
        }}>
        <Ionicons name="ios-arrow-back" size={25} style={{ color:'#fff',paddingLeft: 10, top : 15}} onPress={()=> routes.pop()}/>
        
        <Text style={{color:'#fff' ,top : 15}}>{ this.props.address_id ? 'Update Address' : 'Add New Address'}</Text>
        
        <TouchableOpacity style={{ backgroundColor:'transparent', top : 15, marginBottom : 10}}onPress={()=> this.props.address_id ? this.updateAddress() : this.submit()}>
        <Text style={{ color:'#fff',padding:5, borderColor:'#fff', borderWidth:1, borderRadius : 10}}>Save</Text>
        </TouchableOpacity> 
        </View>
      <ScrollView style={styles.container}>
     
        <TextInput style={ styles.input}
        placeholder='Full Name'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        // keyboardType='email-address'
        value={this.state.full_name}
        onSubmitEditing={() => { 
            this.focusNextField('two');
        }}
        returnKeyType={ "next" } 
        ref={ input => { 
            this.inputs['one'] = input;
        }}
 
        onChangeText={(text) => this.setState({ full_name: text })} /> 

        <TextInput style={ styles.input}
        placeholder='Contact Number'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        value={this.state.mobile_number}
        keyboardType={'numeric'}
        onSubmitEditing={() => { 
            this.focusNextField('three');
        }}
        returnKeyType={ "next" } 
        ref={ input => { 
            this.inputs['two'] = input;
        }}
        onChangeText={(text) => this.setState({ mobile_number: text })} />

        <TextInput style={ styles.input}
        placeholder='Pincode'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        value={this.state.pincode} 
        keyboardType={'numeric'}
        onSubmitEditing={() => { 
            this.focusNextField('four');
        }}
        returnKeyType={ "next" } 
        ref={ input => { 
            this.inputs['three'] = input;
        }}
        onChangeText={(text) => this.setState({ pincode: text })} />

        <TextInput style={ styles.input}
        placeholder='Alternate Contact'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        keyboardType={'numeric'}
        value={this.state.alternate_number} 
        onSubmitEditing={() => { 
            this.focusNextField('five');
        }}
        returnKeyType={ "next" } 
        ref={ input => { 
            this.inputs['four'] = input;
        }}
        onChangeText={(text) => this.setState({ alternate_number: text })} />

        <TextInput style={ styles.input}
        placeholder='Address Line1'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        value={this.state.address_line1} 
        onSubmitEditing={() => { 
            this.focusNextField('six');
        }}
        returnKeyType={ "next" } 
        ref={ input => { 
            this.inputs['five'] = input;
        }}
        onChangeText={(text) => this.setState({ address_line1: text })} />

        <TextInput style={ styles.input}
        placeholder='Address Line2'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        value={this.state.address_line2} 
        onSubmitEditing={() => { 
            this.focusNextField('seven');
        }}
        returnKeyType={ "next" } 
        ref={ input => { 
            this.inputs['six'] = input;
        }}
        onChangeText={(text) => this.setState({ address_line2: text })} />

        <TextInput style={ styles.input}
        placeholder='Landmark'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        value={this.state.landmark} 
        onSubmitEditing={() => { 
            this.focusNextField('eight');
        }}
        returnKeyType={ "next" } 
        ref={ input => { 
            this.inputs['seven'] = input;
        }}
        onChangeText={(text) => this.setState({ landmark: text })} />

        <TextInput style={ styles.input}
        placeholder='Town'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        value={this.state.town} 
        onSubmitEditing={() => { 
            this.focusNextField('nine');
        }}
        returnKeyType={ "next" } 
        ref={ input => { 
            this.inputs['eight'] = input;
        }}
        onChangeText={(text) => this.setState({ town: text })} /> 

        <TextInput style={ styles.input}
        placeholder='City'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        value={this.state.city} 
        onSubmitEditing={() => { 
            this.focusNextField('ten');
        }}
        returnKeyType={ "next" } 
        ref={ input => { 
            this.inputs['nine'] = input;
        }}
        onChangeText={(text) => this.setState({ city: text })} />

        <TextInput style={ styles.input}
        placeholder='State'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        value={this.state.state} 
        onSubmitEditing={() => { 
            this.focusNextField('eleven');
        }}
        returnKeyType={ "next" } 
        ref={ input => { 
            this.inputs['ten'] = input;
        }}
        onChangeText={(text) => this.setState({ state: text })} />

        <Picker 
        mode="dropdown"
        style={{height: 40, }} 
        selectedValue={this.state.country} 
        onValueChange={(country) => this.setState({country})}> 
            <Picker.Item label="Select Country" value="" /> 
            <Picker.Item label="United States" value="1" /> 
            <Picker.Item label="India" value="2" /> 
        </Picker>
        <KeyboardSpacer/>
        </ScrollView>
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
