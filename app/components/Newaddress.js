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
// import { Picker } from 'react-native-picker-dropdown';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import Utils from 'app/common/Utils';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';

const { width, height } = Dimensions.get('window')

export default class Newaddress extends Component<{}> {
    constructor(props) {
        super(props);
        this.getKey = this.getKey.bind(this);
        this.state={
            countryList: [],
            full_name : '',
            mobile_number : '',
            block_no : '',
            houseno : '',
            alternate_number : '',
            appartment : '',
            street : '',
            floor : '',
            jadda : '',
            city : '',
            direction : '',
            country : '',
            address_type : '1',
            address_id : '',
            u_id: '',
        };
        this.inputs = {};
    }
    componentDidMount (){
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
                country: response.userdetail.country
            });
        } catch (error) {
            console.log("Error retrieving data" + error);
        }
    }
    fetchData(){
        fetch(Utils.gurl('countryList'),{
             method: "GET", headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((responseData) => {
                    // console.warn(JSON.stringify(responseData))
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

    submit(){
        const {
            u_id,
            full_name,
            mobile_number,
            block_no,
            houseno,
            alternate_number,
            appartment,
            street,
            floor,
            jadda,
            city,
            direction,
            country,
            address_type
   } = this.state;


        let formData = new FormData();
        formData.append('u_id', String(u_id));
        formData.append('full_name', String(full_name));
        formData.append('mobile_number', String(mobile_number));
        formData.append('block_no', String(block_no));
        formData.append('houseno', String(houseno));
        formData.append('alternate_number', String(alternate_number));
        formData.append('appartment', String(appartment));
        formData.append('street', String(street));
        formData.append('floor', String(floor));
        formData.append('jadda', String(jadda));
        formData.append('city', String(city));
        formData.append('direction', String(direction));
        formData.append('country', String(country));
        formData.append('address_type', String(address_type));

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
            if(responseData.response.status){
                    routes.pop();

                    MessageBarManager.showAlert({
                        message: responseData.response.data.message,
                        alertType: 'alert',
                        stylesheetWarning : { backgroundColor : '#87cefa', strokeColor : '#fff' },
                    })

                    }
        })
        .catch((error) => {
          console.log(error);
        })
        .done();
    }
    }

    validate(){
    const {
        full_name,
        mobile_number,
        block_no,
        houseno,
        alternate_number,
        appartment,
        street,
        floor,
        jadda,
        city,
        direction,
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
        if (!city.length)
        {
            MessageBarManager.showAlert({
                message: "Please Enter City",
                alertType: 'alert',
            })
            return false
        }
        if (!block_no.length )
        {
            MessageBarManager.showAlert({
                message: "Please Enter Block No",
                alertType: 'alert',
            })
            return false
        }
        if (!street.length)
        {
            MessageBarManager.showAlert({
                message: "Please Enter Street Name",
                alertType: 'alert',
            })
            return false
        }
        if (!houseno.length )
        {
            MessageBarManager.showAlert({
                message: "Please Enter  Houseno",
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
        if (!address_type.length)
        {
            MessageBarManager.showAlert({
                message: "Please Enter Address Code either 1 or 2",
                alertType: 'alert',
            })
            return false
        }
            return true;
    }
    focusNextField(id) {
        this.inputs[id].focus();
    }

    loadCountry() {
        return this.state.countryList.map(user => (
            <Picker.Item key={user.country_id} label={user.country_name} value={user.country_id} />
        ))
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
        <Ionicons name="ios-arrow-back" size={25} style={{ color:'#fff',paddingLeft: 10, top : 10}} onPress={()=> routes.pop()}/>

        <Text style={{color:'#fff' ,top:10}}>{ this.props.address_id ? 'Update Address' : 'Add New Address'}</Text>

        <TouchableOpacity style={{ backgroundColor:'transparent', top : 15, marginBottom : 10 ,padding: 10}}onPress={()=> this.submit()}>
        <Text style={{ color:'#fff',padding:5, borderColor:'#fff', borderWidth:1, borderRadius : 10}}>Save</Text>
        </TouchableOpacity>
        </View>
      <ScrollView style={styles.container} keyboardShouldPersistTaps={'handled'}>
        <View style={{ margin: 10}}>

        <TextInput style={ styles.input}
        placeholder='Full Name *'
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
        placeholder='Contact Number *'
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
        <View style={{ flexDirection : 'row', justifyContent:'space-between', alignItems:'center', borderBottomWidth:StyleSheet.hairlineWidth, borderColor:'#bbb'}}>
        <Text style={{ fontSize: 13, color:'#696969', left: 10}}>Select Country</Text>
        <Picker
        mode="dropdown"
        style={{height: 40, width: 100 }}
        selectedValue={this.state.country}
        onValueChange={(country) => this.setState({country})}>
            {this.loadCountry()}
        </Picker>
        </View>
        <TextInput style={ styles.input}
        placeholder='City'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        value={this.state.city}
        onSubmitEditing={() => {
            this.focusNextField('four');
        }}
        returnKeyType={ "next" }
        ref={ input => {
            this.inputs['three'] = input;
        }}
        onChangeText={(text) => this.setState({ city: text })} />

        <TextInput style={ styles.input}
        placeholder='Block Number *'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        value={this.state.block_no}
        keyboardType={'numeric'}
        maxLength={5}
         onSubmitEditing={() => {
            this.focusNextField('five');
        }}
        returnKeyType={ "next" }
        ref={ input => {
            this.inputs['four'] = input;
        }}
        onChangeText={(text) => this.setState({ block_no: text })} />

        <TextInput style={ styles.input}
        placeholder='street'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        value={this.state.street}
        onSubmitEditing={() => {
            this.focusNextField('six');
        }}
        returnKeyType={ "next" }
        ref={ input => {
            this.inputs['five'] = input;
        }}
        onChangeText={(text) => this.setState({ street: text })} />
        <TextInput style={ styles.input}
        placeholder='House/Building Number *'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        value={this.state.houseno}
        keyboardType={'numeric'}
        maxLength={5}
         onSubmitEditing={() => {
            this.focusNextField('seven');
        }}
        returnKeyType={ "next" }
        ref={ input => {
            this.inputs['six'] = input;
        }}
        onChangeText={(text) => this.setState({ houseno: text })} />
        <TextInput style={ styles.input}
        placeholder='Appartment/Office (Optional)'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        value={this.state.appartment}
        onSubmitEditing={() => {
            this.focusNextField('eight');
        }}
        returnKeyType={ "next" }
        ref={ input => {
            this.inputs['seven'] = input;
        }}
        onChangeText={(text) => this.setState({ appartment: text })} />


        <TextInput style={ styles.input}
        placeholder='Floor'
        autoCapitalize='none'
        keyboardType={'numeric'}
        underlineColorAndroid = 'transparent'
        value={this.state.floor}
        onSubmitEditing={() => {
            this.focusNextField('nine');
        }}
        returnKeyType={ "next" }
        ref={ input => {
            this.inputs['eight'] = input;
        }}
        onChangeText={(text) => this.setState({ floor: text })} />

        <TextInput style={ styles.input}
        placeholder='Jaddah'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        value={this.state.jadda}
        onSubmitEditing={() => {
            this.focusNextField('ten');
        }}
        returnKeyType={ "next" }
        ref={ input => {
            this.inputs['nine'] = input;
        }}
        onChangeText={(text) => this.setState({ jadda: text })} />


        <TextInput style={ styles.input}
        placeholder='Extra Direction'
        autoCapitalize='none'
        underlineColorAndroid = 'transparent'
        value={this.state.direction}
        onSubmitEditing={() => {
        }}
        returnKeyType={ "next" }
        ref={ input => {
            this.inputs['ten'] = input;
        }}
        onChangeText={(text) => this.setState({ direction: text })} />
        <KeyboardSpacer/>
        </View>

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
    borderBottomWidth :StyleSheet.hairlineWidth,
    width :width,
    // textAlign: 'center',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
