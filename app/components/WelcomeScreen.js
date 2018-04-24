import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Image,
  NetInfo,
  TextInput,
  ListView,
  Alert,
} from 'react-native';
import {bindActionCreators} from "redux";
import {Actions} from "react-native-router-flux";
import Utils from 'app/common/Utils';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/Feather';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import ActionSheet from 'react-native-actionsheet';
import {connect} from "react-redux";
import * as ebiztrait from "../auth/auth.actions";
import Modal from 'react-native-modal';
import I18n from 'react-native-i18n';

import Ionicons123 from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';

const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 0
const countryTitle = 'Select Country'
const deliveryTitle = 'Select Delivery Area'
const { width, height } = Dimensions.get('window');
class WelcomeScreen extends Component {
    constructor(props) {
        super(props);
        this.gotologin = this.gotologin.bind(this);
        this.state = {
            countries: ["0"],
            deliveryareas: ["cancel","Select Country First"],
            dataSource : [],
            selectCountry: '',
            animating: true,
            refreshing: false,
            loaded: false,
            deliveryarea : '',
            SelectedcountryId: "",
            isShowCity:false,
            text:'',
            arrCityList:[],
            arrCityListBackUp:[],
            dataSourceCity : new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2 }),
        }
        this.handlePress = this.handlePress.bind(this);
        this.handleDeliveryPress = this.handleDeliveryPress.bind(this);
        this.showCountrysheet = this.showCountrysheet.bind(this);
        this.showDelivery = this.showDelivery.bind(this);
    }
    showCountrysheet() {
        this.countrySheet.show()
    }
    handlePress(i) {
        const { dataSource , countries} = this.state;
        console.log("after selected",i);
        if(i === 0){
            this.setState({
                selectCountry: '',
                deliveryareas: ["cancel","Select Country First"],
            })
        }else{
            var data = this.state.dataSource.filter((data) => {
                return data.country_name === countries[i]
            });
            let countryId = data[0].country_id
            this.setState({
                selectCountry: i.toString(),
                SelectedcountryId: countryId
            })
            console.log("i.toString()",i.toString())
            console.log("countryId",countryId)

            // data = dataSource.filter((item)=>{
            //     return item.country_name == countries[i];
            // }).map((item)=>{
            //     return item;
            // });
            var source_data = data[0].city,
            length = data[0].city.length,
            city_list= []
            city_list.push('Cancel');
            city_name_list = []
            for(var i=0; i < length; i++) {
                order = source_data[i];
                city_name = order.city_name;
                city_list.push(city_name);
                city_name_list.push(city_name);
            }
            this.setState({
                deliveryareas: city_list,
                arrCityList: city_name_list,
                arrCityListBackUp: city_name_list,
                dataSourceCity: this.state.dataSourceCity.cloneWithRows(city_name_list),
            })
        }
    }
    showDelivery() {
        // this.deliverySheet.show()
        
        if (this.state.selectCountry === '') {
            MessageBarManager.showAlert({
                message: "Please select country",
                title:'',
                alertType: 'extra',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:'left'},
            })
        }
        else {
            this.setState({
                isShowCity:true
            })
        }
    }
    handleDeliveryPress(i) {
        if(i === 0){
            this.setState({
                deliveryarea : ''
            })
        }else {
            if (this.state.selectCountry == '') {
                this.showCountrysheet()
            }
            else {
                this.setState({
                    deliveryarea: i.toString()
                })
            }
        }
    }
    componentWillMount(){
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
        NetInfo.isConnected.fetch().done(
            (isConnected) => { this.setState({ netStatus: isConnected }); }
        );
        NetInfo.isConnected.fetch().done((isConnected) => {
            if (isConnected){
            }else{
                console.log(`is connected: ${this.state.netStatus}`);
            }
        });
    }
    componentDidMount(){
        this.fetchData()
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
        NetInfo.isConnected.fetch().done((isConnected) => {
            this.setState({
                netStatus: isConnected
            });
        });
    }
    handleConnectionChange = (isConnected) => {
        this.setState({ netStatus: isConnected });
        {
            this.state.netStatus ? this.fetchData() : MessageBarManager.showAlert({
                message: `Internet connection not available`,
                alertType: 'error',
                title:''
            })
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
            console.log("Response countryList:=",responseData)
            var data = responseData.response.data,
            length = data.length,
            optionsList= []
            optionsList.push('Cancel');
            for(var i=0; i < length; i++) {
                order = data[i];
                country_name = order.country_name;
                optionsList.push(country_name);
            }
            setTimeout( () => {
                this.setState({
                    countries: optionsList,
                    dataSource : responseData.response.data,
                    loaded: true
                })
            }, 10);
        })
        .catch((error) => {
            console.log(error);
        })
        .done();
    }
    renderLoadingView() {
        return (
            <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems : 'center',}}
                    >
                <Image style={{ flex: 1,
                        position: 'absolute',
                        left: 0,
                        width: '100%',
                        height: '100%'}}
                        source={require('../images/bg_img.jpg')} />
                <View style={{ flex:1, justifyContent : 'center', alignItems:'center'}}>
                    <Image
                        style={{
                            resizeMode : 'center',
                            width : 200,
                            height : 200,
                        }}
                        resizeMode='cover'
                        source={require('../images/logo.png')} />
                </View>
                <ActivityIndicator
                    style={[styles.centering]}
                    color="#a9d5d1"
                    size="large"/>
            </View>
        );
    }
    gotologin(){
        const { deliveryarea, selectCountry , SelectedcountryId} = this.state
        if (deliveryarea.length && selectCountry.length ) {
            this.props.SetCountry(SelectedcountryId)
            Actions.loginPage();
        }
    }
    render(){

        const { lang} =  'en', //this.props,
        direction = lang == 'ar'? 'row-reverse': 'row',
        align = lang == 'ar'? 'flex-end': 'flex-start',
        textline = lang == 'ar'? 'right': 'left';

        this.gotologin()
        const resizeMode = 'center';
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }

        return (
            <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems : 'center',
                }}>
                <Image style={{
                        flex: 1,
                        position: 'absolute',
                        left: 0,
                        width: '100%',
                        height: '100%'
                    }}
                    source={require('../images/bg_img.jpg')}/>
                <View style={{ flex:1, justifyContent : 'center', alignItems:'center'}}>
                    <Image style={{
                            resizeMode,
                            width : 200,
                            height : 200
                        }}
                        source={require('../images/logo.png')}
                        resizeMode='cover' />
                </View>
                <View style={styles.container}>
                    <TouchableOpacity onPress={this.showCountrysheet} style={styles.row}>
                        <View style={styles.countryIcon}>
                            <Image style={{
                                    resizeMode,
                                    width : 25,
                                    height : 25,
                                    alignSelf: 'center'
                                }}
                                resizeMode = 'cover'
                                source={require('../images/country_icon.png')} />
                        </View>
                        <Text style={{width: width/2, color: "#a9d5d1"}}>{ this.state.selectCountry ? this.state.countries[this.state.selectCountry] : countryTitle}</Text>
                        <FontAwesome
                            name="chevron-down"
                            size={20}
                            color="#FFCC7D"
                            style={{padding:5}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.showDelivery} style={styles.row}>
                        <View style={styles.countryIcon}>
                            <Image style={{
                                    resizeMode,
                                    width : 25,
                                    height : 25,
                                    alignSelf: 'center'
                                }}
                                resizeMode = 'cover'
                                source={require('../images/area_icon.png')} />
                        </View>
                        <Text style={{width: width/2, color: "#a9d5d1"}}>{ this.state.deliveryarea ? this.state.deliveryareas [this.state.deliveryarea] : deliveryTitle}</Text>
                        <FontAwesome
                            name="chevron-down"
                            size={20}
                            color="#FFCC7D"
                            style={{padding:5}}
                            />
                    </TouchableOpacity>
                </View>
                <ActionSheet
                    ref={o => this.countrySheet = o}
                    title={countryTitle}
                    options={this.state.countries}
                    cancelButtonIndex={CANCEL_INDEX}
                    // destructiveButtonIndex={DESTRUCTIVE_INDEX}
                    onPress={this.handlePress}/>
                <ActionSheet
                    ref={o => this.deliverySheet = o}
                    title={deliveryTitle}
                    options={this.state.deliveryareas}
                    cancelButtonIndex={CANCEL_INDEX}
                    // destructiveButtonIndex={DESTRUCTIVE_INDEX}
                    onPress={this.handleDeliveryPress}
                    style={{padding:20, width:'70%'}}
                    />


                <Modal isVisible={this.state.isShowCity}>
                    <View style={{
                        backgroundColor:'white',
                        // marginVertical:40,
                        width:width,
                        height:height,
                        borderRadius:5,
                        overflow:'hidden',
                        marginLeft:-20,
                    }}>
                        <View style={{
                            width:'100%',
                            height: 64,
                            backgroundColor: '#a9d5d1',
                            // alignItems:'center',
                            alignContent:'center',
                            // flexDirection: 'row',
                        }}>
                            <Text style={{
                                // backgroundColor:'red',
                                textAlign:'center',
                                marginTop: 25,
                                fontSize:19,
                                color:'white',
                                fontWeight:'bold'
                            }} >Selecy City</Text>

                            <Ionicons123 name= "x-circle" color="white" size={30}
                                onPress={this.hideCityList.bind(this)}
                                style={{
                                    position:'absolute',
                                    marginLeft : width-50,
                                    marginTop : Platform.OS === 'ios' ? 20 : 10,
                                    paddingHorizontal : 10,
                                    backgroundColor : 'transparent',
                                }}
                            />
                                
                        </View>

                        <View style={{
                                flexDirection: direction,
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: Platform.OS === 'ios' ? 0 : 0,
                                // backgroundColor:'red',
                            }}>
                            <TextInput
                                style={{ 
                                    width: width - (this.state.text.length > 0 ? 50 : 20),
                                    height: 40, 
                                    alignSelf: 'center', 
                                    textAlign: textline, 
                                    // color: "#fff", 
                                    borderWidth: StyleSheet.hairlineWidth, 
                                    // borderColor: '#fff', 
                                    borderRadius: 20, 
                                    paddingLeft:15,
                                    marginLeft:10,
                                    marginTop:5,
                                }}
                                onChangeText={(text) => this.SearchFilterFunction(text)}
                                // placeholderTextColor="#fff"
                                value={this.state.text}
                                controlled={true}
                                underlineColorAndroid='transparent'
                                placeholder={I18n.t('vendorproducts.searchHere', { locale: lang })}
                                tintColor={"rgba(86, 76, 205, 1)"}
                                />
                            <TouchableOpacity style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: "10%",
                                    borderRadius:  7,
                                    backgroundColor: "transparent"
                                }} >
                                {this.state.text.length > 0 ?
                                    <Icon size={25} color="black" name="ios-backspace-outline" style={{
                                        transform: lang == 'ar'? [{ rotate: '180deg'}] : [{ rotate: '0deg'}],
                                        // backgroundColor:'red',
                                        padding:5,
                                    }} onPress={()=>this.removeFilterFunction()}/>
                                    : <Text/>
                                }
                            </TouchableOpacity>
                        </View>
                        {this.state.selectCountry != '' ? 
                        <ListView
                            enableEmptySections={true}
                            automaticallyAdjustContentInsets={false}
                            showsVerticalScrollIndicator={false}
                            dataSource={this.state.dataSourceCity}
                            // renderSeparator= {this.ListViewItemSeparator}
                            renderRow={this.renderData.bind(this)}
                        /> 
                    : 
                    console.log("Select Country empty") }
                    </View>
                </Modal>
            </View>
        );
    }

    renderData(data) {
        console.log("data:=",data)
        return (
            <View style={{
                    width : width,
                    flexDirection: 'column' ,
                    marginTop : 2,
                    borderWidth : 0,
                    borderColor : "#ccc",
                    borderRadius : 5,
                    overflow: 'hidden'
                }}>
                <TouchableOpacity style={{
                        flexDirection: 'row',
                        backgroundColor : "#fff",
                        borderBottomWidth : StyleSheet.hairlineWidth,
                        borderColor : "#ccc",
                    }}
                    onPress={this.handleSelectedCity.bind(this,data)}>
                    <Text style={{
                        marginHorizontal:10,
                        marginVertical:10,
                    }}>{data}</Text>
                </TouchableOpacity>
                </View>
            );
        }

    handleSelectedCity(city){
        console.log("selected city",city)

        Alert.alert(
            'City Confirmation',
            'Do you want to proceed with \'' + city + '\' ?',
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'Proceed', onPress: () => this.setState({
                    deliveryarea:city,
                    isShowCity:false,
                })},
            ],
            { cancelable: false }
          )
    }

    hideCityList() {
        this.setState({
            isShowCity:false,
        })
    }

    SearchFilterFunction(text){
        console.log("this.state.arrCityList:=",this.state.arrCityList)
        const newData = this.state.arrCityList.filter(function(item){
            const itemData = item.toUpperCase()
            const textData = text.toUpperCase()
            return itemData.indexOf(textData) > -1
        })
        this.setState({
            dataSourceCity: this.state.dataSourceCity.cloneWithRows(newData),
            text: text
        })

        // this.setState({
        //     // dataSource: this.state.dataSource.cloneWithRows(newData),
        //     text: text
        // })
    }

    removeFilterFunction(){
        console.log("this.state.arrCityList:=",this.state.arrCityList)
        let text = ""
        const newData = this.state.arrCityList.filter(function(item){
            const itemData = item.toUpperCase()
            const textData = text.toUpperCase()
            return itemData.indexOf(textData) > -1
        })
        this.setState({
            dataSourceCity: this.state.dataSourceCity.cloneWithRows(this.state.arrCityListBackUp),
            text: text
        })
        this.setState({
            // dataSource: this.state.dataSource.cloneWithRows(newData),
            text: ''
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        // justifyContent : 'center',
        alignItems:'center',
        backgroundColor:'transparent',
        paddingTop:20
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#fbcdc5',
        // justifyContent: 'center',
        alignItems: 'center' ,
        backgroundColor: '#F6F6F6',
        marginBottom : 10
    },

    countryIcon: {width : 25,

        borderRightWidth: 1,
        borderColor: '#fbcdc5',
        width : 40,
        height:40,
        // marginLeft :10,
        marginRight :10,
        // paddingTop :5,
        justifyContent :'center',
    },
    centering : {
        flex : 1,
        justifyContent  :'center',
        alignItems : 'center'
    }
});

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		SetCountry: ebiztrait.SetCountry,
	}, dispatch);
}

export default connect(null, mapDispatchToProps)(WelcomeScreen);
