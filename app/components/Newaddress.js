import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableOpacity
} from 'react-native';
import {Actions as routes} from "react-native-router-flux";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Utils from 'app/common/Utils';

const { width, height } = Dimensions.get('window')

export default class Newaddress extends Component<{}> { 
    constructor(props) {
        super(props);        
        this.state={
        full_name : this.props.full_name,
        mobile_number : this.props.mobile_number, 
        pincode : this.props.pincode, 
        alternate_number : this.props.alternate_number, 
        address_line1 : this.props.address_line1, 
        address_line2 : this.props.address_line2, 
        landmark : this.props.landmark, 
        town : this.props.town, 
        city : this.props.city, 
        state : this.props.state, 
        country : this.props.country, 
        address_type : this.props.address_type,
        // update : false,
        address_id : this.props.address_id
        }
    }
    componentDidMount (){}
    
    fetchAddress(){
        let formData = new FormData();
        formData.append('u_id', String(2));
        formData.append('country', String(1)); 

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
            address_id 
        } = this.state;
        
        let formData = new FormData();
        formData.append('u_id', String('2'));
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
        formData.append('u_id', String('2'));
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
        formData.append('address_type', String(address_type)); 

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
            // console.warn(JSON.stringify(responseData.status))
            // alert(responseData.data.message);
        }).done();
    }  
  render() {
     
    return (
        <View style={{ flex : 1}}>
        <View style={ { 
            height : 30, 
            backgroundColor : '#87cefa', 
            flexDirection : 'row', 
            justifyContent:"space-between", 
            alignItems : 'center',
        }}>
        <Ionicons name="ios-arrow-back" size={25} style={{padding:10, color:'#fff'}} onPress={()=> routes.pop()}/>
        
        <Text style={{color:'#fff'}}>{ this.props.address_id ? 'Update Address' : 'Add New Address'}</Text>
        
        <TouchableOpacity style={{padding:10}}onPress={()=> this.props.address_id ? this.updateAddress() : this.submit()}>
        <Text style={{ color:'#fff'}}>Save</Text>
        </TouchableOpacity> 
        </View>
      <ScrollView style={styles.container}>
     
        <TextInput style={ styles.input}
        placeholder='Full Name'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        // autoCorrect={false} 
        // autoFocus={true} 
        // keyboardType='email-address'
        value={this.state.full_name} 
        onChangeText={(text) => this.setState({ full_name: text })} /> 

        <TextInput style={ styles.input}
        placeholder='Contact Number'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        value={this.state.mobile_number} 
        onChangeText={(text) => this.setState({ mobile_number: text })} />

        <TextInput style={ styles.input}
        placeholder='Pincode'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        value={this.state.pincode} 
        onChangeText={(text) => this.setState({ pincode: text })} />

        <TextInput style={ styles.input}
        placeholder='Alternate Contact'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        value={this.state.alternate_number} 
        onChangeText={(text) => this.setState({ alternate_number: text })} />

        <TextInput style={ styles.input}
        placeholder='Address Line1'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        value={this.state.address_line1} 
        onChangeText={(text) => this.setState({ address_line1: text })} />

        <TextInput style={ styles.input}
        placeholder='Address Line2'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        value={this.state.address_line2} 
        onChangeText={(text) => this.setState({ address_line2: text })} />

        <TextInput style={ styles.input}
        placeholder='Landmark'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        value={this.state.landmark} 
        onChangeText={(text) => this.setState({ landmark: text })} />

        <TextInput style={ styles.input}
        placeholder='Town'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        value={this.state.town} 
        onChangeText={(text) => this.setState({ town: text })} /> 

        <TextInput style={ styles.input}
        placeholder='City'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        value={this.state.city} 
        onChangeText={(text) => this.setState({ city: text })} />

        <TextInput style={ styles.input}
        placeholder='State'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        value={this.state.state} 
        onChangeText={(text) => this.setState({ state: text })} />

        <TextInput style={ styles.input}
        placeholder='Country'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        value={this.state.country} 
        onChangeText={(text) => this.setState({ country: text })} />

        <TextInput style={ styles.input}
        placeholder='Address Type'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        value={this.state.address_type} 
        onChangeText={(text) => this.setState({ address_type: text })} />    
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
