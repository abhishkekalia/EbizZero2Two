import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TextInput,
  AsyncStorage,
  ListView,
  Picker,
  StyleSheet,
//   Button,
  TouchableNativeFeedback,
  Platform,
  Clipboard,
    ToastAndroid,
    AlertIOS,
} from 'react-native';
import {Actions as routes} from "react-native-router-flux";
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import { BubblesLoader } from 'react-native-indicator';
import Ionicons from 'react-native-vector-icons/MaterialIcons';
import Utils from 'app/common/Utils';
import Slideshow from './Slideshow';
import DatePicker from 'react-native-datepicker';
import Share, {ShareSheet, Button} from 'react-native-share';
import {CirclesLoader} from 'react-native-indicator';
import EventEmitter from "react-native-eventemitter";
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import {connect} from 'react-redux';
import I18n from 'react-native-i18n';
import IoniconsWish from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import * as authActions from "app/auth/auth.actions";
import {bindActionCreators} from 'redux';

const {width,height} = Dimensions.get('window');
var bookingSlot = [
    "5:30 AM",
    "6:00 AM",
    "6:30 AM",
    "7:00 AM",
    "7:30 AM",
    "8:00 AM",
    "8:30 AM",
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
    "8:30 PM",
    "9:00 PM",
    "9:30 PM",
    "10:00 PM",
    "10:30 PM",
    "11:00 PM",
    "11:30 PM",
    "12:00 PM",
    "12:30 PM",
];

class ProductVendor extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
            imgList : [] ,
            data : [],
            count : 1,
            date_in: '', //new Date(),
            date_out:new Date(),
            currDate:"",
            addressStatus : false,
            u_id: null,
            country : null,
            user_type: null,
            size: '',
            color: '',
            quantity:'',
            service_provider_id : '',
            address_id : '',
            selectedAddress : I18n.t('productdetail.selectaddress', { locale: this.props.lang }),
            ScheduleDate : {},
            dateSelected: "",
            service_date: "",
            scheduleTime: "",
            validTime : '',
            BookingTime : ["5.30 AM",],
            calanderShow : false,
            serviceFullDetail : {},
            visibleShareView : false,
            title: "",
            message: "",
            url:  "",
            subject: "Share Link"
        }
        this.loadHandle = this.loadHandle.bind(this)
    }
    loadHandle (i) {
        let loadQueue = this.state.loadQueue
        loadQueue[i] = 1
        this.setState({
            loadQueue
        })
    }
    onCancel() {
        console.log("CANCEL")
        this.setState({
            visible:false,
            calanderShow:false
        });
    }
    onOpen() {
        // if(this.validate()) {
            this.setState({visible:true});
        // }
    }
    componentDidMount(){
        var Items = this.props.productImages,
        length = Items.length,
        organization,
        Select =[],
        user,
        i;
        console.log("Items:=",Items)
        for (i = 0; i < length; i++) {
            organization = Items[i];
            Select.push ({
                // "title": organization.image_id,
                "url": organization.image,
            })
        }
        this.setState({ imgList : Select});
        this.getKey()
        .then( ()=>this.fetchAddress())
        .then( ()=>this.serviceDetail())
        .done()
        EventEmitter.removeAllListeners("reloadAddress");
        EventEmitter.on("reloadAddress", (value)=>{
            console.log("reloadAddress", value);
            this.fetchAddress()
        });

        EventEmitter.removeAllListeners("proceedToGuestCheckoutService");
        EventEmitter.on("proceedToGuestCheckoutService", (value)=>{
            console.log("proceedToGuestCheckoutService", value);
            this.addToOrder(value)
            .then(()=>this.setState({
                // visibleModal: true,
            }))
            .done()
        });
    }
    async getKey() {
        try {
            const value = await AsyncStorage.getItem('data');
            var response = JSON.parse(value);
            this.setState({
                u_id: response.userdetail.u_id ,
                country: response.userdetail.country ,
                user_type: response.userdetail.user_type
            });
        } catch (error) {
            console.log("Error retrieving data" + error);
        }
    }
    removeLoader = () => this.setState({
        visibleModal : false,
    })
    serviceDetail(){
        const {u_id, country } = this.props;
        let formData = new FormData();
        // formData.append('u_id', String(u_id));
        if (u_id) {
            formData.append('u_id', String(u_id));
        }
        // formData.append('country', String(country));
        formData.append('service_id', String(this.props.service_id));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        console.log("Request serviceDetail:=",config)
        fetch(Utils.gurl('serviceDetail'), config)
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.status){
                console.log("service responseData:=",responseData)
                let	data = responseData.data.booked_slot;
                // var data = ['2018-03-16','2018-03-17','2018-03-18','2018-03-19'];
                var arrNew = {};
                var timeArray = [];
                for (i=0;i<data.length;i++) {
                    var obj = { selected: true, selectedColor: '#a9d5d1'};
                    let strDate = data[i].date
                    let strTime = data[i].boking_time
                    // console.warn(strTime)
                    var objFinal = {
                        strDate : obj,
                    };
                    arrNew[strDate] = obj,
                    timeArray.push (strTime)
                }
                // console.warn(timeArray);
                this.setState({
                    service_provider_id : responseData.data.u_id,
                    ScheduleDate : arrNew,
                    BookingTime :  timeArray,
                    serviceFullDetail: responseData.data
                });
                console.log(this.state.ScheduleDate);
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .done();
    }
    fetchAddress(){
        const {u_id, country } = this.props;
        let formData = new FormData();
        // formData.append('u_id', String(u_id));
        if (u_id) {
            formData.append('u_id', String(u_id));
        }
        formData.append('country', String(country));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        fetch(Utils.gurl('addressList'), config)
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.status){
                this.setState({
                    addressStatus : responseData.status,
                    dataSource: this.state.dataSource.cloneWithRows(responseData.data),
                });
            }else{
                this.setState({
                    addressStatus : responseData.status,
                });
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .done();
    }
    validate(){
        const { date_in } = this.state;
        const { lang } = this.props,
        align = lang == 'ar'? 'right': 'left';
        if (!date_in.length){
            MessageBarManager.showAlert({
                message: I18n.t('productdetail.selectaddress', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        return true
    }
    validateSlot(time){
        const {dateSelected,ScheduleDate} = this.state;
        let timeString = this.state.BookingTime;
        console.log("timeString:=",timeString)
        if(ScheduleDate !== {})
        {
            let dt = new Date();
            let currentdate= dt.getFullYear() +'-'+ ((dt.getMonth() + 1) < 10 ? ('0' + parseInt(dt.getMonth()+1)) : parseInt(dt.getMonth()+1))  + '-'+ dt.getDate();
                console.log(currentdate);
            // ScheduleDate.forEach(function (item) {
            //     console.log(item);
            // });
            for (i=0;i< this.state.BookingTime.length;i++) {
                var obj = { selected: true, selectedColor: '#a9d5d1'};
                let strTime = timeString[i]
                if(timeString[i] === time){
                    MessageBarManager.showAlert({
                        message: I18n.t('servicedetail.anotherTimeslot', { locale: lang }),
                        alertType: 'extra',
                        title:'',
                        titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                        messageStyle: { color: 'white', fontSize: 16 , textAlign:"left"},
                    })
                    return false;
                }
            }
            return true;
        }
        return true;
    }
    buyNow(){
        routes.AddressLists();
    }
    ValidateBookservice(){
        const {service_date, validTime} = this.state;
        const { lang } = this.props,
        align = lang == 'ar'? 'right': 'left';

        if (!service_date.length){
            MessageBarManager.showAlert({
                message: I18n.t('servicedetail.selectDate', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        if (!validTime.length){
            MessageBarManager.showAlert({
                message: I18n.t('servicedetail.selectTime', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }

        return true

    }
    order (){
        const{ data , size, color, count , address_id } = this.state;
        var Select =[];
        var today = new Date();
        currentdate= today.getFullYear() +'-'+ parseInt(today.getMonth()+1) + '-'+ today.getDate() + ' '+  today.toLocaleTimeString() ;
        if(this.ValidateBookservice()){
            if (this.props.isGuest == '1') {
                routes.newaddress({isFromEdit:false})
            }
            else {
                this.addToOrder(address_id)
                .then(()=>this.setState({
                    // visibleModal: true,
                }))
                .done()
            }
        }
    }
    async addToOrder(value){
        const { country, date_in, service_provider_id, service_date, scheduleTim, validTime} = this.state;
        const { u_id} = this.props
        console.log("validTime:=",validTime)
        // currentdate = service_date + ' '+ new Date().toLocaleTimeString();
        currentdate = service_date + ' '+ validTime;
        try {
            let formData = new FormData();
            // formData.append('u_id', String(u_id));
            if (u_id) {
                formData.append('u_id', String(u_id));
            }
            formData.append('country', String(country));
            formData.append('service_id', String(this.props.service_id));
            formData.append('service_datetime', String(currentdate));
            // formData.append('service_date', String(service_date));
            // formData.append('service_time', String(scheduleTime));
            formData.append('address_id', String(value));
            formData.append('service_provider_id', String(service_provider_id));
            formData.append('amount', String(this.props.special_price > 0 ? this.props.special_price : this.props.price));
            const config = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data;',
                },
                body: formData,
            }
            console.log("Request bookService:=",config)
            fetch(Utils.gurl('bookService'), config)
            .then((response) => response.json())
            .then((responseData) => {
                console.log("Response bookService:=",responseData)
                if(responseData.status){
                    routes.bookmyservice({
                        uri : responseData.data.url,
                        service_id : this.props.service_id,
                        price : this.props.special_price > 0 ? this.props.special_price : this.props.price,
                        callback: this.removeLoader
                    })
                }else{
                    this.removeLoader()
                    MessageBarManager.showAlert({
                        message: responseData.data.message,
                        alertType: 'alert',
                        stylesheetWarning : { backgroundColor : '#87cefa', strokeColor : '#fff' },
                        title:'alert'
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .done();
        } catch (error) {
            console.log("Error retrieving data" + error);
        }
    }
    _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
        return (
            <View key={`${sectionID}-${rowID}`} style={{ height: adjacentRowHighlighted ? 4 : 1, backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC'}}/>
        );
    }
    noItemFound(){
        const { lang,logout,u_id} = this.props;
        return (
            <View style={{ flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                <Text style={{fontSize: 12, fontWeight: 'bold'}}>{I18n.t('servicedetail.noaddress', { locale: lang })}</Text>

                 {    u_id === undefined ? <Text onPress={
                        ()=>{ Utils.logout()
                            .then(logout)
                            .done()
                        } } style={{fontSize: 12, fontWeight: 'bold'}}> Please login / register to add address </Text> : <Text> </Text>
                    }
                    </View>
                );
            }
    validateService(){

        if (this.props.isGuest == '1') {
            this.setState({
                calanderShow: true
            });
        }
        else {
            if(this.state.selectedAddress == "Select Address"){
                MessageBarManager.showAlert({
                    message: "Please Select Address First",
                    alertType: 'alert',
                    stylesheetWarning : { backgroundColor : '#87cefa', strokeColor : '#fff' },
                    title:''
                });
                this.setState({
                    calanderShow: false
                });
            }else{
                this.setState({
                    calanderShow: true
                });
            }
        }
    }
    validateScheduleTimings(b){
        // var availabletime =  this.validateSlot(b);
        // if(this.validateSlot(b)){
            this.setState({
                validTime : b
            })
        //   MessageBarManager.showAlert({
        //       message: " Available to book time Slot",
        //       alertType: 'extra',
        //       title:'',
        //       titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
        //       messageStyle: { color: 'white', fontSize: 16 , textAlign:"left"},
        //   })
        // }
    }

    onClickShare() {
        console.log("onClickShare called")
        let {lang} = this.props
        this.setState({
            visibleShareView: true,
            title: lang === 'ar' ? this.state.serviceFullDetail.service_name_in_arabic : this.state.serviceFullDetail.service_name,
            message: lang === 'ar' ? this.state.serviceFullDetail.short_description_in_arabic : this.state.serviceFullDetail.short_description,
            url:  this.state.serviceFullDetail.serviceImages[0] ? this.state.serviceFullDetail.serviceImages[0].image : "" ,
            subject: "Share Link"
        })
    }

    onClickWishlist() {
        console.log("onClickWishlist called")
        if (this.state.serviceFullDetail.is_wishlist === '1') {
            this.removeToWishlist()
            // var detail = this.state.serviceFullDetail.is_wishlist = '0'
            // this.setState({
            //     serviceFullDetail: detail
            // })
        }
        else {
            this.addtoWishlist()
            // var detail = this.state.serviceFullDetail.is_wishlist = '1'
            // this.setState({
            //     serviceFullDetail: detail
            // })
        }
    }

    addtoWishlist ( ){
        console.log("addtoWishlist called")
        const {u_id, country, service_id, deviceId, lang} = this.props;
        let un_id= (u_id === undefined) ? '' : u_id,
        align = (lang === 'ar') ?  'right': 'left';
        let formData = new FormData();
        formData.append('u_id', String(un_id));
        formData.append('country', String(country));
        formData.append('service_id', String(this.state.serviceFullDetail.service_id));
        formData.append('device_uid', String(deviceId));
        const config = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data;',
                },
                body: formData,
            }
            console.log("addToWishlistService Request:=",config)
            fetch(Utils.gurl('addToWishlistService'), config)
            .then((response) => response.json())
            .then((responseData) => {
                console.log("addToWishlistService Response:=",responseData)
                if(responseData.status){
                    MessageBarManager.showAlert({
                        message: I18n.t('home.servicewishlistmsg1', { locale: lang }),
                        alertType: 'extra',
                        title:'',
                        titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                        messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
                        // stylesheetWarning : {{ backgroundColor : '#FFC0CB'}}
                    })
                }
            })
            .then(()=>this.reloadServices())
            .catch((error) => {
                console.log(error);
            })
            .done();
    }
    removeToWishlist (){
        console.log("removeToWishlist called")
        const {u_id, country, service_id, deviceId,lang} = this.props;
        let un_id= (u_id === undefined) ? '' : u_id,
        align = (lang === 'ar') ?  'right': 'left';
        let formData = new FormData();
        formData.append('u_id', String(un_id));
        formData.append('country', String(country));
        formData.append('service_id', String(this.state.serviceFullDetail.service_id));
        formData.append('device_uid', String(deviceId));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        console.log("removeFromWishlistService Request:=",config)
        fetch(Utils.gurl('removeFromWishlistService'), config)
        .then((response) => response.json())
        .then((responseData) => {
            console.log("removeFromWishlistService Response:=",responseData)
            MessageBarManager.showAlert({
                message: I18n.t('home.servicewishlistmsg2', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
        })
        .then(()=>this.reloadServices())
        .catch((error) => {
            console.log(error);
        })
        .done();
    }

    reloadServices() {
        this.serviceDetail()
        EventEmitter.emit("reloadProductsFromWhishlist","")
        EventEmitter.emit("reloadWishlist","");
    }

    render () {
        const { date_in, count, ScheduleDate, BookingTime } = this.state;
        let color = this.props.special_price ? '#a9d5d1' : '#000';
        let textDecorationLine = this.props.special_price > 0 ? 'line-through' : 'none';
        const { lang} = this.props,
        direction = lang == 'ar'? 'row-reverse': 'row',
        align = lang == 'ar'? 'flex-end': 'flex-start',
        textline = lang == 'ar'? 'right': 'left';
        const renderedButtons =  bookingSlot.map((b, i) => {
            return <TouchableOpacity onPress ={()=>this.validateScheduleTimings(b)}
                style={{ marginLeft: 10, width:50, height: 50, backgroundColor: "#a9d5d1", borderRadius:25, overflow:'hidden', flexDirection: 'row', justifyContent:"center"}}>
                <Text  style={{backgroundColor:"transparent" , color : '#fff', alignSelf: 'center',textAlign:'center' }}
                    key={i}
                    // onPress={()=>this.setState({
                    //     size: b.size,
                    //     sizeindex : i
                    // })}
                    >{b}</Text>
            </TouchableOpacity>
        });
        let listView = (<View></View>);
            listView = (
                <ListView
                contentContainerStyle={styles.list}
                dataSource={this.state.dataSource}
                renderRow={this.renderData.bind(this)}
                enableEmptySections={true}
                renderSeparator={this._renderSeparator}
                automaticallyAdjustContentInsets={false}
                showsVerticalScrollIndicator={false}
                />
            );

            let heartType,shareType
            if (this.state.serviceFullDetail.is_wishlist === '1')
                heartType = 'ios-heart' ;
            else
                heartType = 'ios-heart-outline';

            shareType = 'md-share'
        return (
            <View style={styles.container}>
                <ScrollView
                    keyboardShouldPersistTaps="always"
                    showsVerticalScrollIndicator={false}>
                    <View style={{ height : height/1.5}}>
                        <SlideshowTest imgList={this.state.imgList}/>
                        {this.props.is_user === true ? 
                            <IoniconsWish
                                style={{
                                    left : width-50,
                                    position : 'absolute' ,
                                    top : 20
                                }}
                                name={heartType}
                                size={30}
                                color="#a9d5d1"
                                onPress={this.onClickWishlist.bind(this)}
                            />
                            :
                                undefined
                            }

                        {this.props.is_user === true ? 
                            <EvilIcons 
                                style={{
                                    right : width-50,
                                    position : 'absolute' ,
                                    top : 20
                                }}
                                name="share-google"
                                size={30}
                                color="#a9d5d1"
                                onPress={this.onClickShare.bind(this)} 
                            />
                        : 
                            undefined
                        }
                        
                    </View>
                    <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            backgroundColor:'rgba(248,248,248,1)'
                        }}>
                        <View >
                            <Text style={{ padding : 10, color : '#696969', fontSize:15, textAlign: textline}}>{this.props.product_name}</Text>
                            <View style={{flexDirection: direction, justifyContent:'space-between', marginBottom : 10}}>
                                {this.props.special_price > 0 ? <Text style={{color : '#a9d5d1', fontWeight:'bold', marginLeft:10 }}>{this.props.special_price} KWD</Text> : undefined} 
                                <Text style={{color: color, textDecorationLine: textDecorationLine, fontWeight:'bold', paddingRight:5, marginLeft:10}}>{this.props.price} KWD</Text>
                            </View>
                            { this.props.is_user ?
                                <View style={{ borderColor :"#ccc", borderWidth:0.5, paddingTop : 10}}>
                                    <TouchableOpacity onPress={this.validateService.bind(this)}  style={{backgroundColor: "#a9d5d1", justifyContent: 'center',alignItems: 'center', height: 40, marginTop: 10}}>
                                        <Text style={{ fontSize: 15, color: "#fff", fontWeight: 'bold'}}>{I18n.t('servicedetail.schedule', { locale: lang })}</Text>
                                    </TouchableOpacity>
                                    {this.props.isGuest == '1' ? undefined : <TouchableOpacity style= {{ flexDirection :direction, justifyContent: "space-between", padding : 5, alignItems: "center"}} onPress={this.onOpen.bind(this)}>
                                            <Ionicons name ="location-on" size={25} style={{ padding :5}} color="#a9d5d1"/>
                                            <View style ={{
                                                    height:40,
                                                    width : width-50,
                                                    borderWidth : StyleSheet.hairlineWidth,
                                                    borderColor: "#ccc",
                                                    // textAlign: (lang === 'ar') ? 'right': 'left',
                                                    justifyContent: "center"
                                                }}
                                              >
                                              <Text style={{ padding : 10}}>
                                                {this.state.selectedAddress}
                                                </Text>
                                                </View>
                                    </TouchableOpacity> }
                                </View>
                                : undefined
                            }
                            <View style={{ borderColor :"#ccc", borderWidth:0.5, paddingLeft : 20, paddingRight:20, backgroundColor:'#fff'}}>
                                <Text style={{ height : 30 , color:'#FFCC7D', paddingTop:10, textAlign: (lang === 'ar') ? 'right': 'left' ,textDecorationLine : 'underline'}}>{I18n.t('productdetail.productinfo', { locale: lang })}</Text>
                                <Text style={{ color:'#696969', marginTop:5,textAlign: (lang === 'ar') ? 'right': 'left'}}>{this.props.short_description}
                                </Text>
                                <Text style={{ color:'#696969', marginBottom:10, textAlign: (lang === 'ar') ? 'right': 'left'}}>{this.props.detail_description}
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <ShareSheet visible={this.state.visible} onCancel={this.onCancel.bind(this)}>
                    <View style={{flexDirection:direction, justifyContent:'center', width:'100%', marginBottom: -30}}>
                        <View style={{flexDirection:direction, justifyContent:'center', width:'50%', alignItems:'center'}}>
                            <Text style={{ color:'#696969', marginTop:5,textAlign: (lang === 'ar') ? 'right': 'left'}}> {I18n.t('productdetail.selectaddress', { locale: lang })}</Text>
                        </View>
                        <View style={{flexDirection:'row', justifyContent:'center', width:'50%'}}>
                            <TouchableOpacity style={{padding:10, backgroundColor:'#a9d5d1', alignItems:'center', width:'80%'}} onPress={()=> routes.newaddress({isFromEdit:false})}>
                                <Text style={{color:'#fff'}}>{I18n.t('newAddress.newaddrtitle', { locale: lang })}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{margin: 35}}>
                        {(this.state.dataSource.getRowCount() < 1) ? this.noItemFound() : listView}
                    </View>
                </ShareSheet>
                <ShareSheet visible={this.state.calanderShow} onCancel={this.onCancel.bind(this)}>
                    <View style={{backgroundColor: "#a9d5d1", justifyContent: 'center', height: 30}}>
                        <Icon onPress= {this.onCancel.bind(this)} name="close" size={25} color="#fff" style={ lang === 'ar'?{alignSelf: 'flex-start'} :{alignSelf: 'flex-end'}} on/>
                    </View>
                    <Text style={{color:'#000', textAlign: (lang === 'ar') ? 'right': 'left'}}>{I18n.t('servicedetail.selectDate', { locale: lang })}</Text>
                    <View style= {{ flexDirection :direction, justifyContent: 'center', height: height/4}}>
                        <Agenda
                            markedDates={ScheduleDate}
                            // markedDates={{
                                //     '2018-03-16': {selected: true, marked: true, selectedColor: 'blue'},
                                //     '2018-03-17': {marked: true},
                                //     '2018-03-18': {marked: true, dotColor: 'red', activeOpacity: 0},
                                //     '2018-03-19': {disabled: true, disableTouchEvent: true}
                                // }}
                                current={[this.state.currDate]}
                                onDayPress={this.onDayPress}
                                monthFormat={'MMMM yyyy'}
                                firstDay={1}
                                hideDayNames={true}
                                minDate={[this.state.currDate]}
                                // ----------------
                                pastScrollRange={50}
                                futureScrollRange={50}
                                loadItemsForMonth={(month) => {console.log('trigger items loading')}}
                                onCalendarToggled={(calendarOpened) => {console.log(calendarOpened)}}
                                onDayPress={(day)=>{
                                    console.log("selected date :",day);
                                    this.setState({
                                        dateSelected : day.dateString,
                                        service_date: day.dateString
                                    })
                                }}
                                // ------
                                theme={{
                                    agendaDayTextColor: 'yellow',
                                    agendaDayNumColor: 'blue',
                                    calendarBackground: '#f9f9f9',
                                    textSectionTitleColor: '#a9d5d1',
                                    todayTextColor: '#a9d5d1',
                                    selectedDayTextColor: 'white',
                                    monthTextColor: 'white',
                                    selectedDayBackgroundColor: '#a9d5d1',
                                    arrowColor: 'white',
                                    monthTextColor: 'green',
                                    textDisabledColor: 'red',
                                    height : 100
                                }}
                                />
                        </View>
                        <Text style={{color:'#000', textAlign: (lang === 'ar') ? 'right': 'left'}}>{I18n.t('servicedetail.selectTime', { locale: lang })}</Text>
                        <ScrollView contentContainerStyle={styles.contentContainer}   horizontal={true}>
                            {renderedButtons}
                        </ScrollView>
                        <TouchableOpacity onPress= {()=>this.order()} style={{backgroundColor: "#fbcdc5", justifyContent: 'center',alignItems: 'center', height: 40, marginTop: 10}}>
                            <Text style={{ fontSize: 15, color: "#fff", fontWeight: 'bold'}}>{I18n.t('servicedetail.booknow', { locale: lang })}</Text>
                        </TouchableOpacity>
                    </ShareSheet>
                    {this.loadShareView()}
                    <Modal isVisible={this.state.visibleModal}>
                        <View style={{alignItems : 'center', padding:10}}>
                            <CirclesLoader />
                        </View>
                    </Modal>
            </View>
        )
    }

    loadShareView() {

        console.log("loadShareView: this.state.serviceFullDetail", this.state.serviceFullDetail)

        let {lang} = this.props
        let shareOptions = {
            title: this.state.title,
            message: this.state.message,
            url: this.state.url,
            subject: "Share Link" //  for email
        };

        return(
            <ShareSheet visible={this.state.visibleShareView} onCancel={this.onCancelShare.bind(this)}>
                        <Button iconSrc={{ uri: TWITTER_ICON }}
                            onPress={()=>{
                                this.onCancelShare();
                                setTimeout(() => {
                                    Share.shareSingle(Object.assign(shareOptions, {
                                        "social": "twitter"
                                    }));
                                },300);
                            }}>Twitter
                        </Button>
                        <Button iconSrc={{ uri: FACEBOOK_ICON }}
                            onPress={()=>{
                                this.onCancelShare();
                                setTimeout(() => {
                                    Share.shareSingle(Object.assign(shareOptions, {
                                        "social": "facebook"
                                    }));
                                },300);
                            }}>Facebook
                        </Button>
                        <Button iconSrc={{ uri: WHATSAPP_ICON }}
                            onPress={()=>{
                                this.onCancelShare();
                                setTimeout(() => {
                                    Share.shareSingle(Object.assign(shareOptions, {
                                        "social": "whatsapp"
                                    }));
                                },300);
                            }}>Whatsapp
                        </Button>
                        <Button iconSrc={{ uri: GOOGLE_PLUS_ICON }}
                            onPress={()=>{
                                this.onCancelShare();
                                setTimeout(() => {
                                    Share.shareSingle(Object.assign(shareOptions, {
                                        "social": "googleplus"
                                    }));
                                },300);
                            }}>Google +
                        </Button>
                        <Button iconSrc={{ uri: EMAIL_ICON }}
                            onPress={()=>{
                                this.onCancelShare();
                                setTimeout(() => {
                                    Share.shareSingle(Object.assign(shareOptions, {
                                        "social": "email"
                                    }));
                                },300);
                            }}>Email
                        </Button>
                        <Button
                            iconSrc={{ uri: CLIPBOARD_ICON }}
                            onPress={()=>{
                                this.onCancelShare();
                                setTimeout(() => {
                                    if(typeof shareOptions["url"] !== undefined) {
                                        Clipboard.setString(shareOptions["url"]);
                                        if (Platform.OS === "android") {
                                            ToastAndroid.show('Link copiado al portapapeles', ToastAndroid.SHORT);
                                        } else if (Platform.OS === "ios") {
                                            AlertIOS.alert('Link Copied');
                                        }
                                    }
                                },300);
                            }}>Copy Link
                        </Button>
                        <Button iconSrc={{ uri: MORE_ICON }}
                            onPress={()=>{
                                this.onCancelShare();
                                setTimeout(() => {
                                    Share.open(shareOptions)
                                },300);
                            }}>More
                        </Button>
                    </ShareSheet>
        )
    }

    onCancelShare() {
        console.log("CANCEL")
        this.setState({visibleShareView:false});
    }

    renderData(data, rowData: string, sectionID: number, rowID: number, index) {
        const { lang} = this.props,
        direction = lang == 'ar'? 'row-reverse': 'row',
        align = lang == 'ar'? 'flex-end': 'flex-start',
        textline = lang == 'ar'? 'right': 'left';
        return (
            <TouchableOpacity style={{ flexDirection: 'row' ,padding : 10}}
                onPress= {()=>this.setState({
                    address_id: data.address_id,
                    selectedAddress : data.full_name,
                    visible:false
                })}
                >
                <View style={{ flexDirection: 'column' }}>
                    <View style={{ width: width-125, flexDirection: 'row' , justifyContent: 'space-between'}}>
                        <Text style={{ fontSize: 15, color:'#696969'}}>{data.full_name}</Text>
                    </View>
                    <View style={{flexDirection:'row', alignItems : 'center'}}>
                        <Text style={{ fontSize : 13, color: '#a9d5d1'}}>{I18n.t('addressbook.mobile', { locale: lang })}</Text>
                        <Text style={{ fontSize : 10}}>{data.mobile_number}</Text>
                    </View>
                    <Text style={{fontSize:12, color:'#696969'}}>
                        {[data.block_no ," ", data.street , " ", data.houseno,"\n", data.appartment, " ",data.floor, " ", data.jadda,"\n",data.city," ",data.direction]}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}
class SlideshowTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: 0,
            interval: null,
        };
    }
    componentWillMount() {
        this.setState({
          interval: setInterval(() => {
            this.setState({
              position: this.state.position === (this.props.imgList.length-1) ? 0 : this.state.position + 1
            });
          }, 2000)
        });
    }
    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    render() {
        console.log("this.props.imgList:=",this.props.imgList)
        console.log("this.state.position:=",this.state.position)
        return (
        <Slideshow
        height ={height - 230}
        dataSource={this.props.imgList}
        position={this.state.position}
        onPositionChanged={position => this.setState({ position })} />
        );
    }
}
const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    description: {
        width : width/3
    },
    qtybutton: {
        width : 40,
        height : 40,
        padding: 10,
        alignItems: 'center',
        borderWidth : 1,
        borderColor : "#87cefa",
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    text: {
        color: '#000',
        fontSize: 12
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    image: {
        width,
        flex: 1,
        backgroundColor: 'transparent'
    },
    loadingView: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,.5)'
    },
    loadingImage: {
        width: 60,
        height: 60
    },
    button: {
        margin: 10,
        padding: 10,
        backgroundColor: 'orange',
        alignItems: 'center',
    },
    buttonCart: {
        width: width/2,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#87cefa',
        alignItems: 'center',
    },
    contentContainer: {
        // paddingHorizontal: 20
    }
}

//  twitter icon
const TWITTER_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAABvFBMVEUAAAAA//8AnuwAnOsAneoAm+oAm+oAm+oAm+oAm+kAnuwAmf8An+0AqtUAku0AnesAm+oAm+oAnesAqv8An+oAnuoAneoAnOkAmOoAm+oAm+oAn98AnOoAm+oAm+oAmuoAm+oAmekAnOsAm+sAmeYAnusAm+oAnOoAme0AnOoAnesAp+0Av/8Am+oAm+sAmuoAn+oAm+oAnOoAgP8Am+sAm+oAmuoAm+oAmusAmucAnOwAm+oAmusAm+oAm+oAm+kAmusAougAnOsAmukAn+wAm+sAnesAmeoAnekAmewAm+oAnOkAl+cAm+oAm+oAmukAn+sAmukAn+0Am+oAmOoAmesAm+oAm+oAm+kAme4AmesAm+oAjuMAmusAmuwAm+kAm+oAmuoAsesAm+0Am+oAneoAm+wAmusAm+oAm+oAm+gAnewAm+oAle0Am+oAm+oAmeYAmeoAmukAoOcAmuoAm+oAm+wAmuoAneoAnOkAgP8Am+oAm+oAn+8An+wAmusAnuwAs+YAmegAm+oAm+oAm+oAmuwAm+oAm+kAnesAmuoAmukAm+sAnukAnusAm+oAmuoAnOsAmukAqv9m+G5fAAAAlHRSTlMAAUSj3/v625IuNwVVBg6Z//J1Axhft5ol9ZEIrP7P8eIjZJcKdOU+RoO0HQTjtblK3VUCM/dg/a8rXesm9vSkTAtnaJ/gom5GKGNdINz4U1hRRdc+gPDm+R5L0wnQnUXzVg04uoVSW6HuIZGFHd7WFDxHK7P8eIbFsQRhrhBQtJAKN0prnKLvjBowjn8igenQfkQGdD8A7wAAAXRJREFUSMdjYBgFo2AUDCXAyMTMwsrGzsEJ5nBx41HKw4smwMfPKgAGgkLCIqJi4nj0SkhKoRotLSMAA7Jy8gIKing0KwkIKKsgC6gKIAM1dREN3Jo1gSq0tBF8HV1kvax6+moG+DULGBoZw/gmAqjA1Ay/s4HA3MISyrdC1WtthC9ebGwhquzsHRxBfCdUzc74Y9UFrtDVzd3D0wtVszd+zT6+KKr9UDX749UbEBgULIAbhODVHCoQFo5bb0QkXs1RAvhAtDFezTGx+DTHEchD8Ql4NCcSyoGJYTj1siQRzL/JKeY4NKcSzvxp6RmSWPVmZhHWnI3L1TlEFDu5edj15hcQU2gVqmHTa1pEXJFXXFKKqbmM2ALTuLC8Ak1vZRXRxa1xtS6q3ppaYrXG1NWjai1taCRCG6dJU3NLqy+ak10DGImx07LNFCOk2js6iXVyVzcLai7s6SWlbnIs6rOIbi8ViOifIDNx0uTRynoUjIIRAgALIFStaR5YjgAAAABJRU5ErkJggg==";

//  facebook icon
const FACEBOOK_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAYFBMVEUAAAAAQIAAWpwAX5kAX5gAX5gAX5gAXJwAXpgAWZ8AX5gAXaIAX5gAXpkAVaoAX5gAXJsAX5gAX5gAYJkAYJkAXpoAX5gAX5gAX5kAXpcAX5kAX5gAX5gAX5YAXpoAYJijtTrqAAAAIHRSTlMABFis4vv/JL0o4QvSegbnQPx8UHWwj4OUgo7Px061qCrcMv8AAAB0SURBVEjH7dK3DoAwDEVRqum9BwL//5dIscQEEjFiCPhubziTbVkc98dsx/V8UGnbIIQjXRvFQMZJCnScAR3nxQNcIqrqRqWHW8Qd6cY94oGER8STMVioZsQLLnEXw1mMr5OqFdGGS378wxgzZvwO5jiz2wFnjxABOufdfQAAAABJRU5ErkJggg==";

//  whatsapp icon
const WHATSAPP_ICON = "data:image/png;base64,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";

//  gplus icon
const GOOGLE_PLUS_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAACQ1BMVEUAAAD/RDP/STX9Sjb+STT+SjX+SjX+SjX+STT/SzP/Sjb/SzX/VVX/SDb+SDP+SjX9RzT9STT9SjT+STX+SjT9SjT/SST/TTP+SjX+SjX/RDP/RzP+SjX+SjX/STf9SDX/SjX/TU3+Sjb+SjX/Qyz/Szb+SjX/TTP+SjX9STX+SjP/TTX9Szb+Szb/YCD/SzX/SzX+Sjb+STX/TTX/SzX/Szb/TDT+SjX9SzX/STf+TDX/SjT9SzX9Szb+SjX/SjX/SzX/STT9SjT9TDT+SDT/VQD9STX/STX9SjX+SjX9STX+SzT/UDD9Sjb+SjX9RzT/QED+SjT+SjX/XS7+SjX/Ui7/RC3+SjX/TTz/RzP+SjX/TTP/STf+SjX/STT/RjP+Sjb/SzX/Szz/Rjr/RzL+RzP+SjX/Szf/SjX9Sjb+SjX+Sjb+SjX+SjX+SjX/STf/SjT/SjT9SjX9SzT+RzT+STT/STT+SjX/STP/Tjf+SjX/Szb/SjX/STX9SjX/SjT/AAD/SjH/STb+SzX+Sjb+SjT9SDT+Sjb+SjX9STf9STT/SDX/TDf+STb/TjT/TjH+SjX+SDT/Sjb9SzX9RzX+TDT/TUD/STX+SjX+STX/VTn/QjH/SjX+SjX/Ri7+Szb/TTP+SjX/SDX/STT9SjX+SjX/SDL/TjT9Sjb/RjL+SjX9SzX/QED/TDT+SjX+SjX9STX/RjX/VSv/Rzb/STX/ORz/UDD9SzX+Sjb/STT9SzP+SzX+SjX+SjX9Szb/Ti//ZjPPn7DtAAAAwXRSTlMAD1uiy+j5/8FBZHQDY9zvnYSc5dGhBwr+1S0Zqu44mz4KtNkXY7Yo8YLcfp3bCGZ+sLhWaks2z4wO6VOklrtWRFSXos4DoD+D/ZnoEKasjwS7+gvfHC3kHmjtMlTXYjfZXBEWa+/nQRiK5u7c8vVGRWepp6+5eulQF/dfSHSQdQEfdrzguZzm+4KSQyW1JxrAvCaCiLYUc8nGCR9h6gvzFM41MZHhYDGYTMejCEDi3osdBj1+CSCWyGyp1PC3hUEF/yhErwAAAjFJREFUSMft1tdfE0EQB/ADJD+JKAomHoqKxhJLFCnSpdgIxobYgqhYaJKIHVQUsSFiBSuCvWPv3T/N2ZPD3EucvVcyL3sz2W8+l73ZvShKKEIxcCIsPGJQpAV9MThK1KzAEAaNHjosZviI2DgBR9psVrvCx6Ni1fjRNI5JIDx2nF5m4ejxsCRqVxMmknZMksGTVUzpu5zqJD1NAodNB2boyUzCrlnK7CSKOUCyGJOC4BSan6onaWLN5irpCIwgOAMBt5eZRVk2H+fQx7n92TzK8pT8AopCwCbGgiB4Pk1fsFDPFlG2mL9gRTTdnahnxcASDx/nq6SX6tkyYLnEo1qxknBJ2t9kVSlcq2WaZM1a0qXrtOv18Jbp9Q3l5Rv/39ubHKQ3V2xRtm7bXlkluyGra2qJ76jzwb/TxH721O9K3U1fsMfsgbCXcLFZvI+wL8ok3i/6+ECDOdxYJ/TBQ9Kw+nDTkRyHtodKjjbLyGMtx304cTKi8NRpoVutfJp5xgtv21ntxGw/J7T3PNdeuAhcuqxn9o5W0p1Ma78CpF/9lzdfI3ydiStobrjhIL4BRN7k4WRa3i5D5RbQ3cPDMcDtO4ZKGXCXedtuQL1nqNwHHjDxQ/rNGYbKI/gfM/ETwv6ngafSM3RwH3O7eK86Wzz9L582PO9lN9iLl6KpXr2uf9P7tvHde4e75oNEZ3/85NQ2hKUyzg/1c57klur68vXbd9XtdP34+et36C9WKAZo/AEHHmXeIIIUCQAAAABJRU5ErkJggg==";

//  email icon
const EMAIL_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAABC1BMVEUAAAA/Pz8/Pz9AQEA/Pz8/Pz8+Pj4+Pj4/Pz8/Pz8/Pz8/Pz8+Pj4+Pj4/Pz8/Pz8/Pz9AQEA+Pj5AQEA/Pz87Ozs7Ozs/Pz8+Pj47OztAQEA/Pz89PT01NTVBQUFBQUE/Pz8/Pz8+Pj4/Pz9BQUE+Pj4/Pz8/Pz89PT0+Pj4/Pz9BQUFAQEA9PT09PT0/Pz87Ozs9PT05OTk/Pz8+Pj4/Pz9AQEA/Pz8/Pz8/Pz8/Pz+AgIA+Pj4/Pz8/Pz9AQEA/Pz8/Pz8/Pz8/Pz8+Pj4/Pz8/Pz8/Pz9AQEA+Pj4/Pz8+Pj4/Pz85OTk/Pz8/Pz8/Pz8/Pz88PDw9PT0/Pz88PDw8PDw+Pj45OTlktUJVAAAAWXRSTlMA/7N4w+lCWvSx8etGX/XlnmRO7+1KY/fjOGj44DU7UvndMec/VvLbLj7YKyiJdu9O7jZ6Um1w7DnzWQJz+tpE6uY9t8D9QehAOt7PVRt5q6duEVDwSEysSPRjqHMAAAEfSURBVEjH7ZTXUgIxGEa/TwURUFyKYgMURLCvbe2gYAV7ff8nMRksgEDiKl7lXOxM5p8zO3s2CWAwGAx/CjXontzT25Y+pezxtpv2+xTygJ+BYOvh4BBDwx1lKxxhNNZqNjLK+JjVWUYsykj4+2h8gpNTUMkIBuhPNE+SKU7PQC3D62E60ziYzXIuBx0Z+XRTc9F5fgF6MhKNzWXnRejKWGJdc9GZy8AP3kyurH52Ju01XTkjvnldNN+Qi03RecthfFtPlrXz8rmzi739Ax7mUCjy6FhH/vjPonmqVD6pdT718excLX/tsItLeRAqtc7VLIsFlVy/t6+ub27v7t8XD490niy3p+rZpv3i+jy/Or+5SUrdvcNcywaDwfD/vAF2TBl+G6XvQwAAAABJRU5ErkJggg==";

//  clipboard icon
const CLIPBOARD_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAB5lBMVEUAAAA8PDw+Pj4/Pz8/Pz8/Pz8/Pz8+Pj47OzsAAAA5OTk+Pj4/Pz8/Pz8+Pj49PT0/Pz8/Pz85OTlAQEA/Pz87Ozs+Pj4+Pj4/Pz8/Pz8/Pz8zMzNBQUE/Pz8/Pz8/Pz9AQEA7Ozs9PT0/Pz9AQEA+Pj4/Pz8+Pj4AAABAQEA/Pz87OztBQUE/Pz8+Pj4zMzNDQ0M/Pz89PT03Nzc/Pz8/Pz8/Pz8/Pz88PDw8PDwAAABCQkI7Ozs9PT0/Pz9AQEA/Pz8uLi4rKytAQEA/Pz89PT0+Pj4/Pz8/Pz8/Pz9CQkJAQEA/Pz9CQkI/Pz8/Pz8/Pz8+Pj49PT0/Pz8yMjI/Pz88PDw/Pz9BQUE8PDw/Pz9AQEA/Pz8/Pz8/Pz89PT0/Pz9CQkI9PT1EREQ9PT08PDw4ODg+Pj6AgIA/Pz8/Pz82NjZVVVU7Ozs/Pz81NTVAQEA/Pz8+Pj49PT1BQUE/Pz8/Pz8/Pz8vLy8/Pz87OztAQEA3Nzc9PT0+Pj4/Pz89PT0/Pz8/Pz89PT1AQEA9PT04ODgzMzM/Pz8/Pz9AQEA/Pz9AQEA/Pz83Nzc9PT0/Pz9AQEA/Pz8+Pj4+Pj5AQEA/Pz89PT1FRUU5OTk/Pz8/Pz8+Pj47Ozs/Pz89PT08PDw+Pj6z1Mg0AAAAonRSTlMAEXTG8/7pslICKMn//J0u2LcSLNu9Y0523KoKL9b7hggauZsEOuJ/ARS7VifkiwUX0bEq1f1p6KGQAz4NpnpY8AsGtMIyb46NbSOMcRuh+fGTFc0z1yKFKy/dpKff1CqKMoYPp+lAgAKd6kIDhdorJJExNjflktMr3nkQDoXbvaCe2d2EijIUn3JsbjDDF1jjOOdWvIDhmhoJfWrAK7bYnMgx8fGWAAACNUlEQVRIx+2W6V8SURSGBxEVeydMbVER1DCwRNTCEhMNsywqExXcUrNVU9NK2wy1fd9sMyvrP+1cmYH5eK5f5f3APef85hnuvfPeM6MoaaW1dWXKMGdasrJzrJtgc7dhQ+p2kzRry4OuHfmSbEEhUTt37d5TRGNxiRRrLwUczjKKyiuI3uuSYCv3ARa3ZyOu2k/xAT5b7aXra3xaVlsH1LPZg4cAvzM10wbgMBs+QqtsDKTyJroXGz7a7AgandECtPLXfKzFY8hCbcBxFudpP3Gy49RpQ8UXtgBnOOzZc53CU+e7Ism7uYnt5ji0p1e3pDmqzTnmAEr7GGz/AGEDg0MXaBgeERXrKIWFBQz2IvlYHbtEh/EycOUqVQLXVCDPxvGz+MPYdRGWjE/coGFyyg9M32SwM8PkydlQIim7JX6DxHpvM9g7c+SjoLESmqd9vjvDYO9NEzs1aahYY7SK+3Zm31Ddmp8jDx4qysIj2qt4O6dviH4xqvk5soj40vJjqjzh7HOf6BtPtb1SnulG6X3O6bHdqb5BejHbKtDOl+UcQ78iNuwzFKKvwx1v3npYJ+kd0BYynqz3Eu2OZvnB+IyCRVE+TD5qSmWBRuDjJzb8GWhIJq4xv36kWKoH6mr1vlFDnvRW86e9Qtd/qUrs1VeKv1VKbJjrOz3Wih8UrTpF37ArMlotFmfg58raLxrjvyXfifl/ku/TdZsiK9NfNcH+y93Ed4A1JzvLkmnOMClppbV19R+iQFSQ2tNASwAAAABJRU5ErkJggg==";

//  more icon
const MORE_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAQlBMVEUAAABEREQ9PT0/Pz8/Pz9AQEA7OzszMzM/Pz8/Pz9FRUU/Pz8/Pz9VVVUAAAA/Pz8+Pj4/Pz8/Pz9BQUFAQEA/Pz+e9yGtAAAAFnRSTlMAD5bv9KgaFJ/yGv+zAwGltPH9LyD5QNQoVwAAAF5JREFUSMft0EkKwCAQRFHHqEnUON3/qkmDuHMlZlVv95GCRsYAAAD+xYVU+hhprHPWjDy1koJPx+L63L5XiJQx9PQPpZiOEz3n0qs2ylZ7lkyZ9oyXzl76MAAAgD1eJM8FMZg0rF4AAAAASUVORK5CYII=";


function mapStateToProps(state) {
    return {
        lang: state.auth.lang,
        country: state.auth.country,
        u_id: state.identity.u_id,
        deviceId: state.auth.deviceId,
        isGuest: state.auth.isGuest,
    }
}
function dispatchToProps(dispatch) {
    return bindActionCreators({
        logout: authActions.logout,
    }, dispatch);
}
export default connect(mapStateToProps,dispatchToProps)(ProductVendor);
