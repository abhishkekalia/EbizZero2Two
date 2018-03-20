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
    Picker,
    Button,
    ListView,
    StyleSheet,
    ActivityIndicator,
    TouchableHighlight
} from 'react-native';
import {Actions as routes} from "react-native-router-flux";

import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import { BubblesLoader } from 'react-native-indicator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Utils from 'app/common/Utils';
import Slider from './slider'
import DatePicker from 'react-native-datepicker';
import Moreproduct from './Moreproduct';
import Share, {ShareSheet} from 'react-native-share';
import {CirclesLoader} from 'react-native-indicator';
import {
    MaterialDialog,
    MultiPickerMaterialDialog,
    SinglePickerMaterialDialog,
} from 'react-native-material-dialog';
import { material } from 'react-native-typography';
import EventEmitter from "react-native-eventemitter";
import {connect} from 'react-redux';
import I18n from 'react-native-i18n'

const {width,height} = Dimensions.get('window');
const buttons = [
    {
      text: 'button one',
      action: () => console.log('pressed button one'),
    },
    {
      text: 'button two',
      action: () => console.log('pressed button two')
    }
];

class ProductDescription extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
            imgList : [] ,
            data : [],
            count : '1',
            address : '',
            u_id: null,
            country : null,
            user_type: null,
            size: '',
            color: '',
            quantity:'',
            status : false,
            visible: false,
            visibleModal: false,
            addressStatus :false,
            Size : [],
            selectColor: false,
            sizeindex : null
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
    componentDidMount(){
        this.getKey()
        .then( ()=>this.fetchData())
        .then( ()=>this.fetchAddress())
        .done()
        EventEmitter.removeAllListeners("reloadAddress");
        EventEmitter.on("reloadAddress", (value)=>{
            console.log("reloadAddress", value);
            this.fetchAddress()
        });
    }
    onCancel() {
        console.log("CANCEL")
        this.setState({visible:false});
    }
    onOpen() {
        if (this.validate()) {
            console.log("OPEN")
            this.setState({visible:true});
        }
    }
    validate(){
        const { size, count} = this.state;
        const{ lang } = this.props,
        align = (lang === 'ar') ?  'right': 'left';

        if (!size.length)
        {
            MessageBarManager.showAlert({
                message: I18n.t('productdetail.sizeerr', { locale: lang }),
                title:'',
                alertType: 'extra',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        // if (!color.length)
        // {
        //     MessageBarManager.showAlert({
        //         message: I18n.t('productdetail.colorerr', { locale: lang }),
        //         title:'',
        //         alertType: 'extra',
        //         titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
        //         messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
        //     })
        //     return false
        // }
        return true;
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

    async openAndroidDatePicker() {
        try {
            const {action, year, month, day} = await DatePickerAndroid.open({
                date: new Date()
            });
        } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
        }
    }
    async addToOrder(value){
        try {
            const { u_id, country,data ,count} = this.state;
            let formData = new FormData();
            formData.append('u_id', String(u_id));
            formData.append('country', String(country));
            formData.append('order_detail', JSON.stringify(value));
            formData.append('amount', String(data.special_price*count));
            const config = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data;',
                },
                body: formData,
            }
            fetch(Utils.gurl('addToOrder'), config)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.status){
                    // console.warn("calling my Fatureh")
                    routes.myfaturah({ uri : responseData.data.url, order_id : responseData.data.order_id, callback: this.removeLoader})
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
    removeLoader = () => this.setState({
            visibleModal : false
        })
    addtoCart(){
        const { size, color, count } = this.state;
        const {lang, deviceId, country, u_id} = this.props,
        align = (lang === 'ar') ?  'right': 'left';

        if (this.validate()) {
            let formData = new FormData();
            // formData.append('u_id', String(u_id));
            formData.append('product_id', String(this.props.product_id));
            formData.append('country', String(country));
            formData.append('size', String(size));
            formData.append('color', String("blue"));
            formData.append('quantity', String(count));
            formData.append('device_uid', String(deviceId));
            const config = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data;',
                },
                body: formData,
            }
            fetch(Utils.gurl('addTocart'), config)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.status){
                    MessageBarManager.showAlert({
                        message: I18n.t('productdetail.addtocart', { locale: lang }),
                        alertType: 'extra',
                        title:'',
                        titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                        messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
                    })
                    // routes.shopingCart()
                }else{
                    MessageBarManager.showAlert({
                        message: responseData.data.message,
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
    fetchData(){
        const {u_id, country, user_type } = this.state;
        let formData = new FormData();
        formData.append('u_id', String(user_type));
        formData.append('country', String(country));
        formData.append('product_id', String(this.props.product_id));

        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        fetch(Utils.gurl('productDetail'), config)
        .then((response) => response.json())
        .then((responseData) => {
            var Items = responseData.data.productImages,
            length = Items.length,
            organization,
            Select =[],
            user,
            i;
            for (i = 0; i < length; i++) {
                organization = Items[i];
                Select.push (organization.image)
            }
            if(responseData.status){
                this.setState({
                    imgList : Select,
                    data : responseData.data,
                    Size : responseData.data.size,
                    status : true
                });
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .done();
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
    order (delivery_address_id){
        const{ data , size, color, count  } = this.state;
        var Select =[];
        var today = new Date();
        var nextDay = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        currentdate= today.getFullYear() +'-'+ parseInt(today.getMonth()+1) + '-'+ today.getDate() + ' '+  today.toLocaleTimeString() ;
        nextdate= nextDay.getFullYear() +'-'+ parseInt(nextDay.getMonth()+1) + '-'+ nextDay.getDate() + ' '+  nextDay.toLocaleTimeString() ;
        Select.push ({
                "product_id": data.product_id,
                "size": size,
                "quantity": count,
                "delivery_address_id": delivery_address_id,
                "vendor_id":data.vendor_id,
                "price":(data.special_price*count),
                "delivery_datetime": currentdate,
                "order_date": nextdate
            }
        )
        this.addToOrder(Select)
        .then(()=>this.setState({
            visible:false,
            visibleModal: true,
        }))
        .done()
    }
    renderLoading() {
        return (
            <ActivityIndicator
                style={styles.centering}
                color="#a9d5d1"
                size="small"/>
        );
    }
    _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{
                    height: adjacentRowHighlighted ? 4 : 1,
                    backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
                }
            }/>
        );
    }
    noItemFound(){
        return (
            <View style={{ flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                <Text style={{fontSize: 12, fontWeight: 'bold'}}>No Address Found </Text>
            </View>
        );
    }
    render () {
        const { date_in, count } = this.state;
        const { lang, country, u_id, deviceId } = this.props;
        let direction = (lang === 'ar') ? 'row-reverse' :'row',
        align = (lang === 'ar') ?  'right': 'left',
        product_name = (lang == 'ar')? this.state.data.product_name_in_arabic : this.state.data.product_name,
        short_description = (lang == 'ar')? this.state.data.short_description_in_arabic : this.state.data.short_description,
        detail_description = (lang == 'ar')? this.state.data.detail_description_in_arabic : this.state.data.detail_description,
        price = (lang == 'ar')? this.state.data.price_in_arabic : this.state.data.price,
        special_price = (lang == 'ar')? this.state.data.special_price_in_arabic : this.state.data.special_price;
        let titleColor = this.state.size ? '#a9d5d1' : '#ccc';
        let color = this.state.data.special_price ? '#a9d5d1' : '#000';
        let textDecorationLine = this.state.data.special_price ? 'line-through' : 'none';
        let colorOffer = this.state.data.special_price ? 'orange' : '#fff';
        if (!this.state.status) {
            return this.renderLoading();
        }
        const renderedButtons =  this.state.Size.map((b, i) => {
            return <View style={{borderColor:this.state.sizeindex === i ? '#a9d5d1' : '#ccc', borderWidth:1, borderRadius:10, overflow:'hidden'}}>
                <Button
                    color = {this.state.sizeindex === i ? '#a9d5d1' : '#ccc'}
                    key={b.size}
                    title={b.size}
                    onPress={()=>this.setState({
                        size: b.size,
                        sizeindex : i
                    })}
                    />
            </View>
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
                    <View style={{ height : height/2}}>
                        <Slider imgList={this.state.imgList}
                            updateState={this.props.updateState}
                            wishlist= {this.props.is_wishlist }
                            u_id= {this.state.u_id }
                            country= {this.state.country }
                            product_id={this.props.product_id}/>
                    </View>
                    <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'space-between',backgroundColor:'rgba(248,248,248,1)'}
                        }>
                        <View>
                            <View style={{backgroundColor:'rgba(248,248,248,1)', borderTopColor:'#ccc', borderTopWidth:0.5, margin: 10}}>
                                <Text style={{ color : '#696969', fontSize:15, textAlign: align}}>{product_name}</Text>
                                <Vendor
                                    vendor_id= {this.state.data.vendor_id}
                                    u_id={this.state.u_id}
                                    country={this.state.country}
                                    lang={lang}
                                    />
                                <View style={{flexDirection: direction, justifyContent:'space-between', marginBottom : 10}}>
                                    <Text style={{color : '#a9d5d1', fontWeight:'bold',textAlign: align }}>  {special_price} KWD</Text>
                                    <Text style={{color: '#696969', textDecorationLine: textDecorationLine, fontWeight:'bold', paddingRight:5, textAlign: align}}>{price} KWD</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: direction}}>
                                <TouchableOpacity style={[styles.button,{}]} onPress={this.onOpen.bind(this)}>
                                    <Text style={{ color:'#fff', textAlign: align}}>{I18n.t('productdetail.buyitnowbtn', { locale: lang })}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.buttonCart,{ flexDirection:direction, justifyContent:'center'}]} onPress={()=> this.addtoCart()}>
                                    <Ionicons name="md-basket" size={25} color="#fff" />
                                    <Text style={{ color:'#fff', paddingLeft:5, textAlign: align}}>{I18n.t('productdetail.addtocartbtn', { locale: lang })}</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <View style={{flexDirection:direction, padding : 10,height:50,backgroundColor:'rgba(248,248,248,1)'}}>
                                    <Icon
                                        name="select-all"
                                        size={25}
                                        color="#FFCC7D"
                                        />
                                    <Text style={{color:'#a9d5d1', textAlign: align, alignSelf: 'center'}}>{I18n.t('productdetail.selctsize', { locale: lang })}</Text>
                                </View>
                                <View style={{flexDirection : direction, justifyContent: 'space-around'}}>
                                    {renderedButtons}
                                </View>
                                <View style={{flexDirection : direction ,alignItems:'center', justifyContent:'space-around'}}>
                                    { /*<TouchableOpacity
                                        style={{ borderWidth: StyleSheet.hairlineWidth, borderColor:'#a9d5d1', padding : 10, borderRadius: 10}}
                                        onPress={() => this.setState({ selectColor: true })}>
                                        <Text style={{}}>{I18n.t('productdetail.selctcolor', { locale: lang })}</Text>
                                    </TouchableOpacity>
                                    <View style={{backgroundColor: this.state.color ? this.state.color.toString() : '#fff', width:25, height:25}} />
                                    */}
                                    <View style={{
                                            flexDirection: direction,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            padding :10
                                        }}>
                                        <TouchableOpacity  style={styles.qtybutton} onPress= {()=> this.decrement()}>
                                            <Text style={styles.text}>-</Text>
                                        </TouchableOpacity>
                                        <View  style={styles.qtybutton} onPress= {()=> this.decrement()}>
                                            <Text style={styles.text}>{count}</Text>
                                        </View>
                                        <TouchableOpacity  style={styles.qtybutton} onPress={()=> this.setState({count: parseInt(this.state.count)+1})}>
                                            <Text style={styles.text}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View style={{ borderColor :"#ccc", borderWidth:0.5, paddingLeft : 20, paddingRight:20, backgroundColor:'#fff'}}>
                                <Text style={{ height : 30 , color:'#FFCC7D', paddingTop:10, textAlign: align ,textDecorationLine : 'underline'}}>{I18n.t('productdetail.productinfo', { locale: lang })}</Text>
                                <Text style={{ color:'#696969', marginTop:5,textAlign: align}}> {short_description}
                                </Text>
                                <Text style={{ color:'#696969', marginBottom:10, textAlign: align}}> {detail_description}
                                </Text>

                            </View>
                            <Text style={{padding:10, textAlign: align}}>{I18n.t('productdetail.moreProducts', { locale: lang })}</Text>
                            <Moreproduct product_category={this.state.data.product_category} vendor_id={this.state.data.vendor_id} lang={lang} country={country} u_id={u_id} deviceId={deviceId}/>
                        </View>
                    </View>
                    <SinglePickerMaterialDialog
                        title={I18n.t('productdetail.selctcolor', { locale: lang })}
                        items={SHORT_LIST.map((row, index) => ({ value: index, label: row }))}
                        visible={this.state.selectColor}
                        selectedItem={this.state.singlePickerSelectedItem}
                        onCancel={() => this.setState({ selectColor: false })}
                        onOk={result => {
                            this.setState({ selectColor: false });
                            this.setState({ color: result.selectedItem.label });
                        }}
                        cancelLabel={I18n.t('productdetail.cancel', { locale: lang })}
                        okLabel={I18n.t('productdetail.ok', { locale: lang })}
                        />
                </ScrollView>
                <ShareSheet visible={this.state.visible} onCancel={this.onCancel.bind(this)}>
                    <View style={{flexDirection:direction, justifyContent:'center', width:'100%', marginBottom: -30}}>
                        <View style={{flexDirection:direction, justifyContent:'center', width:'50%', alignItems:'center'}}>
                            <Text>{I18n.t('productdetail.selectaddress', { locale: lang })}</Text>
                        </View>
                        <View style={{flexDirection: direction, justifyContent:'center', width:'50%'}}>
                            <TouchableOpacity style={{padding:10, backgroundColor:'#a9d5d1', alignItems:'center', width:'80%'}} onPress={()=> routes.newaddress({isFromEdit:false})}>
                                <Text style={{color:'#fff'}}>{I18n.t('productdetail.addaddresslbl', { locale: lang })}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{margin: 35}}>
                        {(this.state.dataSource.getRowCount() < 1) ? this.noItemFound() : listView}
                    </View>
                </ShareSheet>
                <Modal isVisible={this.state.visibleModal}>
                    <View style={{alignItems : 'center', padding:10}}>
                        <CirclesLoader />
                    </View>
                </Modal>
            </View>
        )
    }
    decrement () {
        if(this.state.count > 1) {
            this.setState({
                count : parseInt(this.state.count)-1
            });
        }
    }

    renderData(data, rowData: string, sectionID: number, rowID: number, index) {
        const {lang} = this.props,
        direction = (lang === 'ar') ? 'row-reverse' :'row',
        align = (lang === 'ar') ?  'right': 'left';


        if (!this.state.addressStatus) {
            return this.noItemFound();
        }
        return (
            <TouchableOpacity style={{ flexDirection: direction ,padding : 10}} onPress= {()=>this.order(data.address_id)}>
                <View style={{ flexDirection: 'column' }}>
                    <View style={{ width: width-125, flexDirection: direction , justifyContent: 'space-between'}}>
                        <Text style={{ fontSize: 15,  textAlign: align}}>{data.full_name}</Text>
                    </View>
                    <Text style={{ fontSize : 10,  textAlign: align}}>{data.mobile_number}</Text>
                    <Text style={{fontSize:12, textAlign: align}}>
                        {[data.block_no ," ", data.street , " ", data.houseno,"\n", data.appartment, " ",data.floor, " ",
                            data.jadda,"\n",data.city," ",data.direction]}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        }
    }
const SHORT_LIST = ['red', 'yellow', 'pink'];

class Vendor extends Component{
    constructor(props){
        super(props);
        this.state = {
            vendor_id : [],
            isLoading : true
        }
    }
    componentDidMount(){
        this.fetchData();
    }
    search = (nameKey, myArray)=>{
        const { lang} = this.props;

        for (var i = 0; i < myArray.length; i++) {
            if(lang === 'ar') {
                if (myArray[i].u_id === nameKey) {
                    return myArray[i].ShopName_in_arabic;
                }
            }else{
                if (myArray[i].u_id === nameKey) {
                    return myArray[i].ShopName;
                }
            }
        }
    }
    fetchData(){
        const {u_id, country , lang} = this.props;
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
        fetch(Utils.gurl('listOfAllShop'), config)
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.status){
                this.setState({
                    vendor_id: responseData.data,
                });
            }
            else{
                this.setState({
                    isLoading : false
                })
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .done();
    }
    render() {
        const { lang} = this.props;
        let product_id = this.props.vendor_id
        let product = this.state.vendor_id
        let resultObject = this.search(product_id, product);
        return (
            <Text style={[styles.category,{ textAlign: (lang === 'ar') ? 'right': 'left'}]}>{  this.state.vendor_id ? resultObject: undefined}
            </Text>
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
    centering: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    qtybutton: {
        padding: 10,
        alignItems: 'center',
        borderWidth : 1,
        borderColor : "#ccc",
        shadowOpacity: 0.2,
        shadowRadius: 2,
        width : '25%'
        // shadowOffset:{width:2,height:4}
    },
    text: {
        color: '#a9d5d1',
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
        width: width/2,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#fbcdc5',
        alignItems: 'center',
        justifyContent:'center'
    },
    buttonCart: {
        width: width/2,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#a9d5d1',
        alignItems: 'center',
    },
    category:{
        color :'#696969',
        fontSize : 12,
        marginBottom : 10
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

export default connect(mapStateToProps)(ProductDescription);
