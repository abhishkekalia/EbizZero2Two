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
  Image
} from 'react-native';
import {connect} from "react-redux";
import I18n from 'react-native-i18n'
import {Actions as routes} from "react-native-router-flux";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from 'react-native-picker-dropdown';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Utils from 'app/common/Utils';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import EventEmitter from "react-native-eventemitter";
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
// import Geocoder from 'react-native-geocoding';
// Geocoder.setApiKey('AIzaSyAnZx1Y6CCB6MHO4YC_p04VkWCNjqOrqH8');

// AIzaSyAnZx1Y6CCB6MHO4YC_p04VkWCNjqOrqH8

// import Geocoder from 'react-native-geocoder';
// // simply add your google key
// Geocoder.fallbackToGoogle('AIzaSyD4T7njRubC7I7zYNwE5wnuTw0X5E_1Cc4');

const { width, height } = Dimensions.get('window')

class Newaddress extends Component{
    constructor(props) {
        super(props);
        // this.getKey = this.getKey.bind(this);
        this.state={
            countryList: [],
            full_name : props.isFromEdit ? props.full_name : '',
            mobile_number : props.isFromEdit ? props.mobile_number : '',
            block_no : props.isFromEdit ? props.block_no : '',
            houseno : props.isFromEdit ? props.houseno : '',
            alternate_number : props.isFromEdit ? props.alternate_number : '',
            appartment : props.isFromEdit ? props.appartment : '',
            street : props.isFromEdit ? props.street : '',
            floor : props.isFromEdit ? props.floor : '',
            jadda : props.isFromEdit ? props.jadda : '',
            city : props.isFromEdit ? props.city : '',
            direction : props.isFromEdit ? props.direction : '',
            country : props.isFromEdit ? props.country : '',
            address_type : props.isFromEdit ? props.address_type : '1',
            address_id : props.isFromEdit ? props.address_id : '',
            u_id: '',
            initialRegion: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            region: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              },
            coordinate:{
                latitude: 37.78825,
                longitude: -122.4324,
            }
        };
        this.inputs = {};
    }
    componentDidMount (){
        // this.getKey()
        // .then(()=>this.fetchData())
        // .done();
        this.fetchData()
        navigator.geolocation.getCurrentPosition(
            (position) => {
              this.setState({
                coordinate: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                },
                region: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  },
              });
            },
            (error) => console.log(error.error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },);
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

    getInitialState() {
        return {
          region: {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
        };
    }

    onRegionChange(region) {
        // this.setState({ region:region });
        console.log("region:=",region)
        // this.setState({
        //     region: region,
        //     // coordinate: {
        //     //     latitude: region.latitude,
        //     //     longitude: region.longitude
        //     // }
        // });
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
        const { lang, u_id} = this.props,
        align = (lang === 'ar') ?  'right': 'left';

        let formData = new FormData();
        formData.append('u_id', String(u_id));
        formData.append('full_name', String(full_name));
        formData.append('mobile_number', String(mobile_number));
        formData.append('block_no', String(block_no));
        formData.append('houseno', String(houseno));
        // formData.append('alternate_number', String(alternate_number));
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
                    EventEmitter.emit("reloadAddressList")
                    EventEmitter.emit("reloadAddress")
                    routes.pop();
                    MessageBarManager.showAlert({
                        message: I18n.t('newAddress.addressadded', { locale: lang }),
                        alertType: 'extra',
                        title:'',
                        titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                        messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
                    })
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .done();
        }
    }
    editAddressAPICall() {
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
        formData.append('address_id', String(this.state.address_id))
        formData.append('u_id', String(u_id));
        formData.append('full_name', String(full_name));
        formData.append('mobile_number', String(mobile_number));
        formData.append('block_no', String(block_no));
        formData.append('houseno', String(houseno));
        // formData.append('alternate_number', String(alternate_number));
        formData.append('appartment', String(appartment));
        formData.append('street', String(street));
        formData.append('floor', String(floor));
        formData.append('jadda', String(jadda));
        formData.append('city', String(city));
        formData.append('direction', String(direction));
        formData.append('country', String(country));
        formData.append('address_type', String(address_type));

        console.log("formData:=",formData)

        if (this.validate()) {
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
                console.log("responseData:=",responseData)
                if(responseData.status){
                    EventEmitter.emit("reloadAddressList")
                    routes.pop();
                    MessageBarManager.showAlert({
                        message: responseData.response.data.message,
                        alertType: 'alert',
                        stylesheetWarning : { backgroundColor : '#87cefa', strokeColor : '#fff' },
                        title:''
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
        const { lang} = this.props,
        align = (lang === 'ar') ?  'right': 'left';
        if(!full_name.length)
        {
            MessageBarManager.showAlert({
                message: I18n.t('newAddress.enterfullnm', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false;
        }
        if (!mobile_number.length)
        {
            MessageBarManager.showAlert({
                message: I18n.t('newAddress.entercontact', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        if (!city.length)
        {
            MessageBarManager.showAlert({
                message: I18n.t('newAddress.entercity', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        if (!block_no.length )
        {
            MessageBarManager.showAlert({
                message: I18n.t('newAddress.enterblock', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        if (!street.length)
        {
            MessageBarManager.showAlert({
                message: I18n.t('newAddress.enterstreet', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        if (!houseno.length )
        {
            MessageBarManager.showAlert({
                message: I18n.t('newAddress.enterhouseno', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        if (!country.length)
        {
            MessageBarManager.showAlert({
                message: I18n.t('newAddress.entercountry', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
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
        const { lang, country, u_id, deviceId } = this.props,
        direction = lang == 'ar'? 'row-reverse': 'row',
        textline = lang == 'ar'? 'right': 'left';
        var selCountryObj = null
        for (let index = 0; index < this.state.countryList.length; index++) {
            let element = this.state.countryList[index];
            if (element.country_id == this.state.country) {
                selCountryObj = element
            }
        }
        return (
            <View style={{ flex : 1}}>
                <View style={{
                        height: (Platform.OS === 'ios') ? 64 : 54,
                        backgroundColor : '#a9d5d1',
                        flexDirection : direction,
                        justifyContent:"space-between",
                        alignItems : (Platform.OS === 'ios') ? 'flex-end' :'center',
                    }
                }>
                <Ionicons name="ios-arrow-back" size={25} color='#fff' style={lang == 'ar' ? {transform: [{ rotate: '180deg'}], padding: 10 }: {paddingLeft: (Platform.OS === 'ios') ? 10 : 10 , alignSelf: 'center'} } onPress={()=> routes.pop()}/>
                <Text style={{color:'#fff'}}>{ this.props.address_id ? I18n.t('newAddress.updateaddr', { locale: lang }) : I18n.t('newAddress.newaddrtitle', { locale: lang })}</Text>
                <TouchableOpacity style={{ backgroundColor:'transparent'}} onPress={()=> this.props.isFromEdit ? this.editAddressAPICall() : this.submit()}>
                    <Text style={{ color:'#fff',padding:5}}>{I18n.t('newAddress.savebtn', { locale: lang })}</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.container} keyboardShouldPersistTaps={'handled'} showsVerticalScrollIndicator={false}>
                <View style={{ margin: 0}}>
                    <TextInput style={[ styles.input, {textAlign: textline}]}
                        placeholder={I18n.t('newAddress.fullname', { locale: lang })}
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
                        onChangeText={(text) => this.setState({ full_name: text })}
                        />
                    <TextInput style={[ styles.input, {textAlign: textline}]}
                        placeholder={I18n.t('newAddress.contactnumber', { locale: lang })}
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
                        onChangeText={(text) => this.setState({ mobile_number: text })}
                        />
                    <View style={{
                            flexDirection : direction,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottomWidth: StyleSheet.hairlineWidth,
                            borderColor: '#bbb'
                        }
                    }>
                        <Text style={{ fontSize: 13, color:'#696969', left: 0}}>{I18n.t('newAddress.selectcountry', { locale: lang })}</Text>
                        {!this.state.country? undefined:
                            <Image style={{height:30, width:40}}
                                resizeMode = 'center'
                                resizeMethod = 'resize'
                                source={ selCountryObj ? {uri : selCountryObj.flag } : require('app/images/country_icon.png')}
                                onLoadEnd={() => {  }}
                                />
                        }
                        <Picker
                            mode="dropdown"
                            style={{height: 40, width: "50%" }}
                            selectedValue={this.state.country}
                            onValueChange={(country) => this.setState({country})}>
                            {this.loadCountry()}
                        </Picker>
                    </View>
                    <TextInput style={[ styles.input, {textAlign: textline}]}
                        placeholder={I18n.t('newAddress.city', { locale: lang })}
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
                        onChangeText={(text) => this.setState({ city: text })}
                        />
                    <TextInput style={[ styles.input, {textAlign: textline}]}
                        placeholder={I18n.t('newAddress.blockno', { locale: lang })}
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
                        onChangeText={(text) => this.setState({ block_no: text })}
                        />
                    <TextInput style={[ styles.input, {textAlign: textline}]}
                        placeholder={I18n.t('newAddress.street', { locale: lang })}
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
                        onChangeText={(text) => this.setState({ street: text })}
                        />
                    <TextInput style={[ styles.input, {textAlign: textline}]}
                        placeholder={I18n.t('newAddress.houseno', { locale: lang })}
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
                        onChangeText={(text) => this.setState({ houseno: text })}
                        />
                    <TextInput style={[ styles.input, {textAlign: textline}]}
                        placeholder={I18n.t('newAddress.appartment', { locale: lang })}
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
                        onChangeText={(text) => this.setState({ appartment: text })}
                        />
                    <TextInput style={[ styles.input, {textAlign: textline}]}
                        placeholder={I18n.t('newAddress.floor', { locale: lang })}
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
                        onChangeText={(text) => this.setState({ floor: text })}
                        />
                    <TextInput style={[ styles.input, {textAlign: textline}]}
                        placeholder={I18n.t('newAddress.jadda', { locale: lang })}
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
                        onChangeText={(text) => this.setState({ jadda: text })}
                        />
                    <TextInput style={[ styles.input, {textAlign: textline}]}
                        placeholder={I18n.t('newAddress.extradir', { locale: lang })}
                        autoCapitalize='none'
                        underlineColorAndroid = 'transparent'
                        value={this.state.direction}
                        onSubmitEditing={() => {
                        }}
                        returnKeyType={ "next" }
                        ref={ input => {
                            this.inputs['ten'] = input;
                        }}
                        onChangeText={(text) => this.setState({ direction: text })}
                        />
                    <View style={{ flex: 1}}>
                        <MapView
                            style = {{height:200, marginRight:0, marginBottom:10,  marginTop:5,}}
                            region={this.state.region}
                            onRegionChange={this.onRegionChange.bind(this)}>
                            <Marker draggable
                                coordinate={this.state.coordinate}
                                onDragEnd={(e) => this.setState({
                                    coordinate: e.nativeEvent.coordinate,
                                    region: {
                                        latitude:e.nativeEvent.coordinate.latitude,
                                        longitude:e.nativeEvent.coordinate.longitude,
                                        latitudeDelta: this.state.region.latitudeDelta,
                                        longitudeDelta: this.state.region.longitudeDelta
                                    }
                                })}/>
                            </MapView>
                        </View>
                        <TouchableOpacity style={{
                                borderWidth:1, borderColor:'#ccc',height:40, justifyContent:'center', alignItems:'center',
                                backgroundColor:'transparent', top : 0, marginBottom:10, alignItems:'center'}} onPress={()=>
                                this.loadAddressFromMap()
                            }>
                            <Text style={{ color:'grey',padding:0, borderColor:'grey', padding:10}} textAlign='center'>{I18n.t('newAddress.picklocation', { locale: lang })}</Text>
                        </TouchableOpacity>
                    </View>
                    <KeyboardSpacer/>
                </ScrollView>
            </View>
        );
    }
    loadAddressFromMap() {
        Geocoder.getFromLatLng(this.state.coordinate.latitude, this.state.coordinate.longitude).then(
            json => {
                console.log("json.results[0]:=",json.results[0])
                var address_component = json.results[0].address_components;
                for (let index = 0; index < address_component.length; index++) {
                    const element = address_component[index];
                    if (element.types.includes('street_number')) {
                        console.log("street_number matched")
                        this.setState({
                            block_no:element.long_name
                        });
                    }
                    else if (element.types.includes('locality')) {
                        this.setState({
                            city: element.long_name
                        });
                    }
                    else if (element.types.includes('administrative_area_level_1')) {
                        this.setState({
                            street:element.long_name
                        })
                    }
                }
                console.log("address_component:=",address_component[0].types[0])
                console.log("locality:=",json.results[0].address_components.locality)
            },
            error => {
                MessageBarManager.showAlert({
                    message: error,
                    alertType: 'alert',
                    title:''
                })
            }
        );
            // console.log("loadAddressFromMap")
            // var NY = {
                // lat: this.state.coordinate.latitude,
                // lng: this.state.coordinate.longitude
            // };

            // try {
                // const res = Geocoder.geocodePosition(NY);
                // console.log("res:=",res)
            // }
            // catch(err) {
                // console.log("err:=",err);
            // }
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
        width :width-40,
        // textAlign: 'center',
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
function mapStateToProps(state) {
    return {
        identity: state.identity,
		lang: state.auth.lang,
        country: state.auth.country,
        u_id: state.identity.u_id,
        deviceId: state.auth.deviceId,
    };
}
export default connect(mapStateToProps)(Newaddress);
