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
  NetInfo
} from 'react-native';
import {bindActionCreators} from "redux";
import {Actions} from "react-native-router-flux";
import Utils from 'app/common/Utils';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import ActionSheet from 'react-native-actionsheet';
import {connect} from "react-redux";
import * as ebiztrait from "../auth/auth.actions";

const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 0

const countryTitle = 'Select Country'
const deliveryTitle = 'Select Deliveryarea'

const { width, height } = Dimensions.get('window')

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
        }
        this.handlePress = this.handlePress.bind(this)
        this.handleDeliveryPress = this.handleDeliveryPress.bind(this)
        this.showCountrysheet = this.showCountrysheet.bind(this)
        this.showDelivery = this.showDelivery.bind(this)
    }
    showCountrysheet() {
        this.countrySheet.show()
    }
    handlePress(i) {
        const { dataSource , countries} = this.state;
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
                selectCountry: i.toString()
            })
            data = dataSource.filter((item)=>{
                return item.country_name == countries[i];
            }).map((item)=>{
                return item;
            });
            var source_data = data[0].city,
            length = data[0].city.length,
            city_list= []
            city_list.push('Cancel');
            for(var i=0; i < length; i++) {
                order = source_data[i];
                city_name = order.city_name;
                city_list.push(city_name);
            }
            this.setState({
                deliveryareas: city_list
            })
            this.props.SetCountry(countryId)

        }
    }
    showDelivery() {
        this.deliverySheet.show()
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
    componentwillMount(){
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
            var data = responseData.response.data,
            length = data.length,
            optionsList= []
            optionsList.push('Cancel');
            for(var i=0; i < length; i++) {
                order = data[i];
                country_name = order.country_name;
                optionsList.push(country_name);
            }
            this.setState({
                countries: optionsList,
                dataSource : responseData.response.data,
                loaded: true
            })
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
                    color="#1e90ff"
                    size="large"/>
            </View>
        );
    }
    gotologin(){
        const { deliveryarea, selectCountry } = this.state
        if (deliveryarea.length && selectCountry.length ) {
            Actions.loginPage();
        }
    }
    render(){
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
            </View>
        );
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
