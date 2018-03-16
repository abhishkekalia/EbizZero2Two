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
  Button,
  TouchableNativeFeedback,
  Platform
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
import Share, {ShareSheet} from 'react-native-share';
import {CirclesLoader} from 'react-native-indicator';
import EventEmitter from "react-native-eventemitter";
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

import {connect} from 'react-redux';
import I18n from 'react-native-i18n';

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
            BookingTime : ["5.30 AM",],
            calanderShow : false
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
        fetch(Utils.gurl('serviceDetail'), config)
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.status){
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
                    BookingTime :  timeArray
                });
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
        let timeString = this.state.BookingTime
        for (i=0;i< this.state.BookingTime.length;i++) {
            var obj = { selected: true, selectedColor: '#a9d5d1'};
            let strTime = timeString[i]
            if(timeString[i] === time){
                MessageBarManager.showAlert({
                    message: " Please Select another time Slot",
                    alertType: 'extra',
                    title:'',
                    titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                    messageStyle: { color: 'white', fontSize: 16 , textAlign:"left"},
                })
                return false;
            }
        }
        return true

    }
    buyNow(){
        routes.AddressLists();
    }
    order (){
        const{ data , size, color, count , address_id } = this.state;
        var Select =[];
        var today = new Date();
        currentdate= today.getFullYear() +'-'+ parseInt(today.getMonth()+1) + '-'+ today.getDate() + ' '+  today.toLocaleTimeString() ;
            this.addToOrder(address_id)
            .then(()=>this.setState({
                // visibleModal: true,
            }))
            .done()
    }
    async addToOrder(value){
        const { u_id, country, date_in, service_provider_id} = this.state;
        currentdate = date_in + ' '+ new Date().toLocaleTimeString();
        try {
            let formData = new FormData();
            formData.append('u_id', String(u_id));
            formData.append('country', String(country));
            formData.append('service_id', String(this.props.service_id));
            formData.append('service_datetime', String(currentdate));
            formData.append('address_id', String(value));
            formData.append('service_provider_id', String(service_provider_id));
            formData.append('amount', String(this.props.special_price));
            const config = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data;',
                },
                body: formData,
            }
            fetch(Utils.gurl('bookService'), config)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.status){
                    routes.bookmyservice({
                        uri : responseData.data.url,
                        service_id : this.props.service_id,
                        price : this.props.special_price,
                        callback: this.removeLoader
                    })
                }else{
                    this.removeLoader
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
        const { lang} = this.props;
        return (
            <View style={{ flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                <Text style={{fontSize: 12, fontWeight: 'bold'}}>{I18n.t('servicedetail.noaddress', { locale: lang })}</Text>
            </View>
        );
    }

    render () {
        const { date_in, count, ScheduleDate, BookingTime } = this.state;
        let color = this.props.special_price ? '#a9d5d1' : '#000';
        let textDecorationLine = this.props.special_price ? 'line-through' : 'none';
        const { lang} = this.props,
        direction = lang == 'ar'? 'row-reverse': 'row',
        align = lang == 'ar'? 'flex-end': 'flex-start',
        textline = lang == 'ar'? 'right': 'left';
        const renderedButtons =  bookingSlot.map((b, i) => {
            return <TouchableOpacity onPress ={()=>this.validateSlot(b)}
                style={{ marginLeft: 10,width:50, height: 50, backgroundColor: "#a9d5d1", borderRadius:30, overflow:'hidden', flexDirection: 'row'}}>
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
        return (
            <View style={styles.container}>
                <ScrollView
                    keyboardShouldPersistTaps="always"
                    showsVerticalScrollIndicator={false}>
                    <View style={{ height : height/1.5}}>
                        <SlideshowTest imgList={this.state.imgList}/>
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
                                <Text style={{color : '#a9d5d1', fontWeight:'bold' }}>  {this.props.special_price} KWD</Text>
                                <Text style={{color: color, textDecorationLine: textDecorationLine, fontWeight:'bold', paddingRight:5}}>{this.props.price} KWD</Text>
                            </View>
                            { this.props.is_user ?
                                <View style={{ borderColor :"#ccc", borderWidth:0.5, paddingTop : 10}}>
                                    <TouchableOpacity onPress={()=>this.setState({
                                            calanderShow: true
                                        })} style={{backgroundColor: "#a9d5d1", justifyContent: 'center',alignItems: 'center', height: 40, marginTop: 10}}>
                                        <Text style={{ fontSize: 15, color: "#fff", fontWeight: 'bold'}}>{I18n.t('servicedetail.schedule', { locale: lang })}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this.onOpen.bind(this)} >
                                        <View style= {{ flexDirection :direction, justifyContent: "space-between", padding : 5}}>
                                            <Ionicons name ="location-on" size={25} style={{ padding :5}} color="#a9d5d1"/>
                                            <TextInput style ={{
                                                    height:40,
                                                    width : width-50,
                                                    borderWidth : StyleSheet.hairlineWidth,
                                                    borderColor: "#ccc",
                                                    textAlign: (lang === 'ar') ? 'right': 'left'
                                                }}
                                                value={this.state.selectedAddress}
                                                editable={false}
                                                underlineColorAndroid={'transparent'}
                                                />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                : undefined
                            }
                            <View style={{ borderColor :"#ccc", borderWidth:0.5, paddingLeft : 20, paddingRight:20, backgroundColor:'#fff'}}>
                                <Text style={{ height : 30 , color:'#FFCC7D', paddingTop:10, textAlign: (lang === 'ar') ? 'right': 'left' ,textDecorationLine : 'underline'}}>{I18n.t('productdetail.productinfo', { locale: lang })}</Text>
                                <Text style={{ color:'#696969', marginTop:5,textAlign: (lang === 'ar') ? 'right': 'left'}}> {this.props.short_description}
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
                                // ----------------
                                pastScrollRange={50}
                                futureScrollRange={50}
                                loadItemsForMonth={(month) => {console.log('trigger items loading')}}
                                onCalendarToggled={(calendarOpened) => {console.log(calendarOpened)}}
                                onDayPress={(day)=>{
                                    // console.warn('day pressed :', day)
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
                    <Modal isVisible={this.state.visibleModal}>
                        <View style={{alignItems : 'center', padding:10}}>
                            <CirclesLoader />
                        </View>
                    </Modal>
            </View>
        )
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
            position: 1,
            interval: null,
        };
    }
    componentWillMount() {
        this.setState({
          interval: setInterval(() => {
            this.setState({
              position: this.state.position ===this.props.imgList.length ? 0 : this.state.position + 1
            });
          }, 2000)
        });
    }
    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    render() {
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
function mapStateToProps(state) {
    return {
        lang: state.auth.lang,
        country: state.auth.country,
        u_id: state.identity.u_id,
        deviceId: state.auth.deviceId,
    }
}
export default connect(mapStateToProps)(ProductVendor);
