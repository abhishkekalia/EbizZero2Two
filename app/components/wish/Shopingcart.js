import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableHighlight,
    StyleSheet,
    ListView,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    TextInput,
    AsyncStorage,
    Image,
    Picker,
    Platform,
    Clipboard,
    ToastAndroid,
    AlertIOS,
    ActivityIndicator,
} from 'react-native';
import Utils from 'app/common/Utils';
import {connect} from 'react-redux';
import I18n from 'react-native-i18n'
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MessageBarManager } from 'react-native-message-bar';
import  Countmanager  from './Countmanager';
import {Actions as routes} from "react-native-router-flux";
import { SinglePickerMaterialDialog, MaterialDialog } from 'react-native-material-dialog';
import { material } from 'react-native-typography';
import EventEmitter from "react-native-eventemitter";
import Drawer from 'react-native-drawer';
import Menu from '../menu/MenuContainer';
import api from "app/Api/api";
import Swipeout from 'react-native-swipeout';
import Share, {ShareSheet, Button} from 'react-native-share';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import {CirclesLoader} from 'react-native-indicator';

const { width, height } = Dimensions.get('window');
// const SHORT_LIST = ['Small', 'Medium', 'Large'];

class Shopingcart extends Component {
    constructor(props) {
        super(props);
        // this.getKey = this.getKey.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            ShopingItems : null,
            SetToList : null,
            itemcount : '',
            totalamount : '',
            subtotalamount : '',
            Quentity : 0,
            color: 'blue',
            // u_id: null,
            product_id : '',
            user_type : null,
            selectSize : false,
            // country : null,
            status : false,
            cartIdList:[],
            nologin: false,
            title:'',
            message:'',
            url:'',
            loaded:false,
        };
    }
    componentDidMount(){
        this.fetchData()
        EventEmitter.removeAllListeners("reloadCartlist");
        EventEmitter.on("reloadCartlist", (value)=>{
            this.fetchData()
        });
        EventEmitter.removeAllListeners("onExitCartlist");
        EventEmitter.on("onExitCartlist", (value)=>{
            this._drawer.close()
        });
        EventEmitter.removeAllListeners("redirectToFaturah");
        EventEmitter.on("redirectToFaturah", (value)=>{
            routes.myfaturah({ uri : value.uri, order_id : value.order_id, callback: this.callBackFitura, cartIdList:this.state.cartIdList})
        });

        EventEmitter.removeAllListeners("proceedToGuestCheckoutCart");
        EventEmitter.on("proceedToGuestCheckoutCart", (value)=>{
            console.log("proceedToGuestCheckoutCart", value);
            // this.order(value)
            this.getItems(value)
            // this.setState({
            //     visibleModal:true,
            // })
        });
    }
    callBackFitura() {
        console.log("Callback from faturah")
    }
    componentWillMount() {
        routes.refresh({ left: this._renderLeftButton, right: this._renderRightButton,});
    }
    _renderLeftButton = () => {
         return(
             <Feather name="menu" size={20} onPress={()=>this.openControlPanel()} color="#fff" style={{ padding : 10,paddingTop: Platform.OS === 'ios' ? 20 : 10}}/>
         );
     };
     _renderRightButton = () => {
        return(
            <View style={{ width: 40}}/>
        );
    };

    getItems (delivery_address_id){
        if (this.state.SetToList !== null) {
            var Items = this.state.SetToList,
            length = Items.length,
            organization,
            Select =[],
            user,
            i;

            var today = new Date();
            var nextDay = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

            currentdate= today.getFullYear() +'-'+ parseInt(today.getMonth()+1) + '-'+ today.getDate() + ' '+  today.toLocaleTimeString() ;
            nextdate= nextDay.getFullYear() +'-'+ parseInt(nextDay.getMonth()+1) + '-'+ nextDay.getDate() + ' '+  nextDay.toLocaleTimeString() ;

            for (i = 0; i < length; i++) {
                organization = Items[i];
                Select.push ({
                            "product_id": organization.product_id,
                            "size": organization.size,
                            "quantity": organization.quantity,
                            "delivery_address_id": delivery_address_id,
                            "vendor_id":organization.vendor_id,
                            "price":organization.price,
                            "delivery_datetime": currentdate,
                            "order_date": nextdate
                        })
            }
            this.addToOrder(Select)
            .done()
        }
        
    }

    async addToOrder(value){
        try {
            const { u_id, country } = this.props;
            let formData = new FormData();
            formData.append('u_id', String(u_id));
            formData.append('country', String(country));
            formData.append('order_detail', JSON.stringify(value));
            formData.append('amount', String(this.state.subtotalamount));
            const config = {
                   method: 'POST',
                   headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data;',
                   },
                   body: formData,
              }
              console.log("Request addToOrder:=",config)
            fetch(Utils.gurl('addToOrder'), config)
            .then((response) => response.json())
            .then((responseData) => {
                console.log("Response addToOrder:=",responseData)
            if(responseData.status){
                this.removeLoader
                // console.log("calling my Fatureh")
                    var data = ({
                        uri : responseData.data.url,
                        order_id : responseData.data.order_id,
                    })
                    // routes.pop()
                    // EventEmitter.emit("redirectToFaturah",data)
                    routes.myfaturah({ uri : responseData.data.url, order_id : responseData.data.order_id, callback: this.callBackFitura, cartIdList:this.state.cartIdList})
                //   routes.myfaturah({ uri : responseData.data.url, order_id : responseData.data.order_id, callback: this.removeLoader})
                }
                else {
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

    // async getKey() {
    //     try {
    //         const value = await AsyncStorage.getItem('data');
    //         var response = JSON.parse(value);
    //         this.setState({
    //             u_id: response.userdetail.u_id ,
    //             country: response.userdetail.country ,
    //             user_type: response.userdetail.user_type
    //         });
    //     } catch (error) {
    //         console.log("Error retrieving data" + error);
    //     }
    // }

    // addtoWishlist(product_id){
    //     const {u_id, country, user_type } = this.state;
    //     let formData = new FormData();
    //     formData.append('u_id', String(u_id));
    //     formData.append('country', String(country));
    //     formData.append('product_id', String(product_id));
    //     const config = {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'multipart/form-data;',
    //             },
    //             body: formData,
    //         }
    //     fetch(Utils.gurl('addToWishlist'), config)
    //     .then((response) => response.json())
    //     .then((responseData) => {
    //         MessageBarManager.showAlert({
    //             message: responseData.data.message,
    //             alertType: 'alert',
    //             stylesheetWarning : { backgroundColor : '#ff9c00', strokeColor : '#fff' },
    //             animationType: 'SlideFromLeft',
    //             title:''
    //         })
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     })
    //     .done();
    // }
    fetchData(){
        const {u_id, country, lang ,deviceId } = this.props;
        // deviceId = "fc898d3fb74399eb";
        // console.warn("deviceId", deviceId);
        // console.warn("country", country);
        let formData = new FormData();
        // formData.append('u_id', String(u_id));
        if (u_id) {
            formData.append('u_id', String(u_id));
        }
        formData.append('country', String(country));
        formData.append('device_uid', String(deviceId));
        console.log(formData);

        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        console.log("Request cartList:=",config)
        fetch(Utils.gurl('cartList'), config)
        .then((response) => response.json())
        .then((responseData) => {
            // console.warn(responseData);
            console.log("Response cartList:=",responseData)
            var Items = responseData.data,
                length = Items.length,
                organization,
                Select =[],
                user,
                i;
            var today = new Date();
            var nextDay = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
            currentdate= today.getFullYear() +'-'+ parseInt(today.getMonth()+1) + '-'+ today.getDate() + ' '+  today.toLocaleTimeString() ;
            nextdate= nextDay.getFullYear() +'-'+ parseInt(nextDay.getMonth()+1) + '-'+ nextDay.getDate() + ' '+  nextDay.toLocaleTimeString() ;
            for (i = 0; i < length; i++) {
                organization = Items[i];
                Select.push ({
                    "product_id": organization.product_id,
                    "size": organization.size,
                    "quantity": organization.quantity,
                    "cart_id" : organization.cart_id,
                    "price":organization.price,
                    "delivery_datetime": currentdate,
                    "order_date": nextdate
                })
            }
            if(responseData.status){
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(responseData.data),
                    ShopingItems : Select,
                    SetToList : responseData.data,
                    itemcount : responseData.itemcount,
                    totalamount : responseData.totalamount,
                    subtotalamount : responseData.subtotalamount,
                    refreshing : false,
                    status : responseData.status
                });
                let res = responseData.data;
                let cartIdList = [];
                for (var i = 0; i < res.length; i++) {
                    cartIdList.push(res[i].cart_id);
                }

                this.setState({
                    cartIdList:cartIdList,
                    loaded: true,
                });
            }else {
                this.setState({
                    status : responseData.status,
                    loaded: true,
                })
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .done();
    }
    validate(){
        const { ShopingItems} = this.state;
        const { lang, country, u_id, deviceId } = this.props,
        align = (lang === 'ar') ?  'right': 'left';

        if (!ShopingItems.length)
        {
            MessageBarManager.showAlert({
                message: I18n.t('cart.pleaseselectitems', { locale: lang }),
                title:'',
                alertType: 'extra',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }

        var isOutOfStock = false
        for (var i=0; i < this.state.SetToList.length ; i++) {
            var cartData = this.state.SetToList[i]
            if (cartData.is_out_of_stock === '1') {
                isOutOfStock = true
                break
            }
        }

        if (isOutOfStock == true) {
            MessageBarManager.showAlert({
                message: I18n.t('cart.removeOutOfStockProduct', { locale: lang }),
                title:'',
                alertType: 'extra',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }

            return true;
    }
    getSize(size){
        this.setState({size});
    }
    getColor(color){
        this.setState({color});
    }
    procedToCheckout(){
        let {lang, u_id} = this.props
        // if (u_id === undefined ){
        //     this.setState({
        //         nologin: true
        //     })
        // }else{
            if (this.validate()) {
                if (this.props.isGuest == '1') {
                    routes.newaddress({isFromEdit:false})
                }
                else {
                    routes.AddressLists({
                        order_detail : this.state.ShopingItems,
                        SetToList :this.state.SetToList,
                        totalAmount : this.state.subtotalamount,
                        cartIdList:this.state.cartIdList
                    })
                }
            }
        // }
    }
    renderFooter(itemcount, totalamount, subtotalamount){
        let {lang} = this.props,
        direction = (lang === 'ar') ? 'row-reverse' :'row',
        align = (lang === 'ar') ?  'right': 'left',
        position = (lang === 'ar') ?  'left': 'right';
        return(
            <View style={{ flexDirection : "column"}}>
                <View style={{
                        flexDirection : direction,
                        justifyContent: "space-between",
                        alignItems:'center',
                        padding : 5,
                        flex : 0}
                    }>
                    <Text style={{ textAlign: align}}>{I18n.t('cart.items', { locale: lang })}({itemcount})</Text>
                    {/*<Text style={{textAlign: align}}> KWD {totalamount}</Text>*/}
                </View>
                <View style={{
                        flexDirection : direction,
                        justifyContent: "space-between",
                        alignItems:'center',
                        padding : 5,
                        flex : 0}
                    }>
                    <Text style={{ color : "#87cefa", textAlign: align}} >{I18n.t('cart.crtsubtotal', { locale: lang })}</Text>
                    <Text style={{ color : "#87cefa", textAlign: align}}> KWD {subtotalamount}</Text>
                </View>
                {/* <MaterialDialog
                    title="You are not login Now"
                    visible={this.state.nologin}
                    onOk={() => this.setState({ nologin: false },()=>routes.loginPage())}
                    onCancel={() => this.setState({ nologin: false })}>
                    <Text style={styles.dialogText}>
                        To checkout your cart please Login or SignUp
                    </Text>
                </MaterialDialog> */}

            </View>
        )
    }
    noItemFound(){
        const {lang} = this.props;
        let side = lang === "ar" ? "right" : "left";
        return (
            <Drawer
                ref={(ref) => this._drawer = ref}
                type="overlay"
                content={<Menu closeDrawer={()=> this.closeControlPanel()} />}
                tapToClose={true}
                openDrawerOffset={0.2}
                panCloseMask={0.2}
                closedDrawerOffset={0}
                styles={drawerStyles}
                tweenHandler={(ratio) => ({
                    main: { opacity:(2-ratio)/2 }
                })}
                side= {side}
                >
                <View style={{flex: 1}}>
                    <View style={{height: Platform.OS === 'ios' ? 60 : 54,alignItems: 'center', backgroundColor: "#a9d5d1", justifyContent: 'space-between', flexDirection: lang === "ar" ? "row-reverse" : "row"}}>
                        {this._renderLeftButton()}
                        <Text style={{ color: "#fff", fontWeight: 'bold', fontSize: 15, paddingTop: Platform.OS === 'ios' ? 10 : 0, marginLeft: Platform.OS === 'ios' ? 0 : 0}}>{I18n.t('cart.carttitle', { locale: lang })}</Text>
                        {this._renderRightButton()}
                    </View>
                    <View style={{ flexDirection:'column', justifyContent:'center', alignItems:'center', flex:1}}>
                        <Text> {I18n.t('cart.noitem', { locale: lang })} </Text>
                    </View>
                </View>
            </Drawer>
        );
    }

    loadingView(){
        const {lang} = this.props;
        let side = lang === "ar" ? "right" : "left";
        return (
            <Drawer
                ref={(ref) => this._drawer = ref}
                type="overlay"
                content={<Menu closeDrawer={()=> this.closeControlPanel()} />}
                tapToClose={true}
                openDrawerOffset={0.2}
                panCloseMask={0.2}
                closedDrawerOffset={0}
                styles={drawerStyles}
                tweenHandler={(ratio) => ({
                    main: { opacity:(2-ratio)/2 }
                })}
                side= {side}
                >
                <View style={{flex: 1}}>
                    <View style={{height: Platform.OS === 'ios' ? 60 : 54,alignItems: 'center', backgroundColor: "#a9d5d1", justifyContent: 'space-between', flexDirection: lang === "ar" ? "row-reverse" : "row"}}>
                        {this._renderLeftButton()}
                        <Text style={{ color: "#fff", fontWeight: 'bold', fontSize: 15, paddingTop: Platform.OS === 'ios' ? 10 : 0, marginLeft: Platform.OS === 'ios' ? 0 : 0}}>{I18n.t('cart.carttitle', { locale: lang })}</Text>
                        {this._renderRightButton()}
                    </View>
                    <View style={{ flexDirection:'column', justifyContent:'center', alignItems:'center', flex:1}}>
                    <ActivityIndicator
                        // style={[styles.centering]}
                        color="#a9d5d1"
                        size="large"/>
                    </View>
                </View>
            </Drawer>
        );
    }
    closeControlPanel = () => {
        this._drawer.close()
    };
    openControlPanel = () => {
        this._drawer.open()
    };
    render() {
        

        const { itemcount, totalamount, subtotalamount } = this.state;
        const { lang } = this.props;
        let shareOptions = {
            title: this.state.title,
            message: this.state.message,
            url: this.state.url,
            subject: "Share Link" //  for email
        };

        if (!this.state.loaded) {
            return this.loadingView();
        }

        let side = lang === "ar" ? "right" : "left";
        let listView = (<View></View>);
            listView = (
                <ListView
                contentContainerStyle={styles.container}
                dataSource={this.state.dataSource}
                renderRow={this.renderData.bind(this)}
                enableEmptySections={true}
                automaticallyAdjustContentInsets={false}
                showsVerticalScrollIndicator={false}
                />
            );

        if (!this.state.status) {
            return this.noItemFound();
        }
        return (
                <View style={{flex: 1, flexDirection: 'column'}}>
                    <Drawer
                        ref={(ref) => this._drawer = ref}
                        type="overlay"
                        content={<Menu closeDrawer={()=> this.closeControlPanel()} />}
                        tapToClose={true}
                        openDrawerOffset={0.2}
                        panCloseMask={0.2}
                        closedDrawerOffset={0}
                        styles={drawerStyles}
                        tweenHandler={(ratio) => ({
                            main: { opacity:(2-ratio)/2 }
                        })}
                        side={side}
                        >
                        <View style={{height: Platform.OS === 'ios' ? 60 : 54,alignItems: 'center', backgroundColor: "#a9d5d1", justifyContent: 'space-between', flexDirection: lang === "ar" ? "row-reverse" : "row"}}>
                            {this._renderLeftButton()}
                            <Text style={{ color: "#fff", fontWeight: 'bold', fontSize: 15, paddingTop: Platform.OS === 'ios' ? 10 : 0, marginLeft: Platform.OS === 'ios' ? 0 : 0}}>{I18n.t('cart.carttitle', { locale: lang })}</Text>
                            {this._renderRightButton()}
                        </View>
                        {listView}
                        {this.renderFooter(itemcount, totalamount, subtotalamount)}
                        <View style={{ flexDirection : (lang == 'ar')? "row-reverse" :"row", justifyContent : 'space-around'}}>
                            <TouchableHighlight
                                underlayColor ={"#fff"}
                                style={[styles.shoping]}
                                onPress={()=>routes.homePage()}>
                                <Text style={{ color :'#fff'}}>{I18n.t('cart.shoping', { locale: lang })}</Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                underlayColor ={"#fff"}
                                style={[styles.checkout]}
                                onPress={()=> this.procedToCheckout()}>
                                <Text style={{ color : '#fff'}}>{I18n.t('cart.checkout', { locale: lang })}</Text>
                            </TouchableHighlight>
                        </View>
                </Drawer>
                <ShareSheet visible={this.state.visible} onCancel={this.onCancel.bind(this)}>
                        <Button iconSrc={{ uri: TWITTER_ICON }}
                            onPress={()=>{
                                this.onCancel();
                                setTimeout(() => {
                                    Share.shareSingle(Object.assign(shareOptions, {
                                        "social": "twitter"
                                    }));
                                },300);
                            }}>Twitter
                        </Button>
                        <Button iconSrc={{ uri: FACEBOOK_ICON }}
                            onPress={()=>{
                                this.onCancel();
                                setTimeout(() => {
                                    Share.shareSingle(Object.assign(shareOptions, {
                                        "social": "facebook"
                                    }));
                                },300);
                            }}>Facebook
                        </Button>
                        <Button iconSrc={{ uri: WHATSAPP_ICON }}
                            onPress={()=>{
                                this.onCancel();
                                setTimeout(() => {
                                    Share.shareSingle(Object.assign(shareOptions, {
                                        "social": "whatsapp"
                                    }));
                                },300);
                            }}>Whatsapp
                        </Button>
                        <Button iconSrc={{ uri: GOOGLE_PLUS_ICON }}
                            onPress={()=>{
                                this.onCancel();
                                setTimeout(() => {
                                    Share.shareSingle(Object.assign(shareOptions, {
                                        "social": "googleplus"
                                    }));
                                },300);
                            }}>Google +
                        </Button>
                        <Button iconSrc={{ uri: EMAIL_ICON }}
                            onPress={()=>{
                                this.onCancel();
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
                                this.onCancel();
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
                                this.onCancel();
                                setTimeout(() => {
                                    Share.open(shareOptions)
                                },300);
                            }}>More
                        </Button>
                    </ShareSheet>
                    <Modal isVisible={this.state.visibleModal}>
                        <View style={{alignItems : 'center', padding:10}}>
                            <CirclesLoader />
                        </View>
                    </Modal>
        </View>
        );
    }
    renderData( data, rowData: string, sectionID: number, rowID: number, index) {
        console.log("Cart Data:=",data)
        const { lang, country, u_id, deviceId } = this.props;
        let direction = (lang === 'ar') ? 'row-reverse' :'row',
        align = (lang === 'ar') ?  'right': 'left',
        product_name = (lang == 'ar')? data.product_name_in_arabic : data.product_name,
        short_description = (lang == 'ar')? data.short_description_in_arabic : data.short_description,
        size = (lang == 'ar')? data.size_in_arabic : data.size,
        price = (lang == 'ar')? data.price_in_arabic : data.price,
        special_price = (lang == 'ar')? data.special_price_in_arabic : data.special_price;

        let color = data.special_price ? '#a9d5d1' : '#000';
        let textDecorationLine = data.special_price > 0 ? 'line-through' : 'none';
        return (
            <View style={{
                    flexDirection: 'column',
                    marginTop : 2,
                    borderWidth : StyleSheet.hairlineWidth,
                    borderColor : "#ccc",
                    borderRadius : 5,
                    marginTop:5,
                    // backgroundColor:'red'
                }}>
                <SelectItem product_id={data.product_id}
                    u_id={u_id}
                    cart_id={data.cart_id}
                    country={country}
                    callback={this.fetchData.bind(this)}
                    size_arr={data.size_arr}
                    lang={lang}
                    cartIdList = {this.state.cartIdList}
                    deviceId={deviceId}>
                <View style={{
                        flexDirection: direction,
                        backgroundColor : "transparent",
                    }}>
                    <View style={{
                        flexDirection: 'column',
                        justifyContent : 'space-between',
                        backgroundColor:'#fff',
                        width:'100%',
                        paddingRight:5,
                        }}>
                        <View style={{ flexDirection:direction , backgroundColor : "#fff", justifyContent : 'space-between', alignItems : 'center'}}>
                            <Image style={[styles.thumb, {margin: 10}]}
                                source={{ uri : data.productImages[0] ? data.productImages[0].image : null}}/>
                            <View style={{flexDirection : 'column'}}>
                                <Text style={{ fontSize:18, marginTop: 10, color:'#696969', marginBottom:5, textAlign: align}}>{product_name}</Text>
                                <Text style={{ fontSize:15, color:'#696969', marginBottom:5, textAlign: align}}>{short_description}</Text>
                                {data.is_out_of_stock === '1' ? 
                                    <View style={{ flexDirection :direction,  width:width/1.5}}>
                                        <Text style={{paddingRight : 10, textAlign: align, alignSelf: 'center', fontSize:15, color:'red'}}>{I18n.t('cart.productOutOfStock', { locale: lang })}</Text>
                                    </View>
                                    :                             
                                    <View style={{ flexDirection :direction,  width:width/1.5}}>
                                        <Text style={{paddingRight : 10, textAlign: align, alignSelf: 'center', fontSize:15}}>{I18n.t('cart.quantity', { locale: lang })} </Text>
                                            <Text style={{paddingRight : 10, textAlign: align, alignSelf: 'center'}}> : </Text>
                                        <Countmanager
                                            quantity={data.quantity}
                                            u_id={u_id}
                                            product_id={data.product_id}
                                            updatetype={"1"}
                                            country={country}
                                            deviceId={deviceId}
                                            callback={this.fetchData.bind(this)}
                                            />
                                    </View>
                                }
                                
                                <View style={{ flexDirection : direction ,justifyContent: 'flex-start', marginTop:5}}>
                                    <Text style={{ fontSize:15, color:'#696969', marginBottom:5, textAlign: align}}>{I18n.t('cart.size', { locale: lang })}</Text>
                                    <Text style={{ fontSize:15, color:'#696969', marginBottom:5, textAlign: align}}> : </Text>
                                    <Text style={{ fontSize:15, color:'#696969', paddingRight: 5,marginBottom:5, textAlign:align}}>{size}</Text>
                                </View>
                                <View style={{ flexDirection : direction ,justifyContent: 'flex-start', marginTop:5}}>
                                    <Text>{I18n.t('cart.availableQuantity', { locale: lang })}</Text>
                                    <Text> : </Text>
                                    <Text>{data.remaning_quantity}</Text>
                                </View>
                                <View style={{ flexDirection : direction, justifyContent:"space-between", marginTop:5}}>
                                    {data.special_price > 0 ? <Text style={{ fontWeight:"bold", color:'#696969', marginBottom:5, textAlign: align}}>{data.special_price} KWD</Text> : undefined} 
                                    <Text style={{ fontWeight:"bold", fontSize:15, color: color, textDecorationLine: textDecorationLine, textAlign: align}}>{data.price} KWD</Text>
                                </View>
                                <View style={{ flexDirection : direction, marginTop:5, marginBottom:5}}>
                                    <Text style={{ fontSize:15, color:'#fbcdc5', marginBottom:5,textAlign: align}}>{I18n.t('cart.subtotal', { locale: lang })}</Text>
                                    <Text style={{ fontSize:15, color:'#fbcdc5', marginBottom:5,textAlign: align}}> : </Text>
                                    <Text style={{ fontSize:15, color:'#696969', marginBottom:5, textAlign: align}}>{data.special_price > 0 ? data.quantity*data.special_price : data.quantity*data.price}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                {/* <Footer  product_id={data.product_id}
                    u_id={u_id}
                    cart_id={data.cart_id}
                    country={country}
                    callback={this.fetchData.bind(this)}
                    size_arr={data.size_arr}
                    lang={lang}
                    cartIdList = {this.state.cartIdList}
                    deviceId={deviceId}/> */}
                <View style={[styles.bottom, {flexDirection: (lang === 'ar') ? 'row-reverse' : 'row'}]}>
                        <TouchableOpacity style={[styles.wishbutton, {flexDirection: (lang === 'ar') ? 'row-reverse' : 'row', justifyContent: "center"}]} onPress={this.onOpen.bind(this,data)}>
                            <SimpleLineIcons name="share-alt" size={20} color="#a9d5d1"/>
                            <Text style={{ left : 5, paddingVertical:5}}>{I18n.t('wishlist.shareItem', { locale: lang })}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.wishbutton, {flexDirection: (lang === 'ar') ? 'row-reverse' : 'row', justifyContent: "center"}]}
                            onPress={()=>this.addtoWishlist(data.cart_id, data.product_id, data)}>
                            {/* <Image source={require('../../images/cart_icon.png')} style={{ width:"10%", height : "100%"}}/> */}
                            <Ionicons name={'md-heart'} size={20} color="#a9d5d1" style={{ alignSelf: 'center'}}/>
                            <Text style={{ left :5, paddingVertical:5}}>{I18n.t('cart.moveToWishlist', { locale: lang })}</Text>
                        </TouchableOpacity>
                    </View>

                </SelectItem>
            </View>
        )
    }
    onOpen(data) {
        console.log("OPEN")
        // this.setState({visible:true});
        console.log("share Data:=",data)
        let {lang} = this.props

        this.setState({
            visible:true,
            title: lang === 'ar' ? data.product_name_in_arabic : data.product_name,
            message: lang === 'ar' ? data.short_description_in_arabic : data.short_description,
            url: data.productImages[0] ? data.productImages[0].image : ""
        });
    }
    onCancel() {
        console.log("CANCEL")
        this.setState({visible:false});
    }

    // addtoWishlist (cart_id,product_id, data){
    //     console.log("data:=",data)
    //     return;
    //     const {u_id, country, deviceId, lang} = this.props;
    //     let un_id= (u_id === undefined) ? '' : u_id,
    //     align = (lang === 'ar') ?  'right': 'left';
    //     let formData = new FormData();
    //     formData.append('u_id', String(un_id));
    //     formData.append('country', String(country));
    //     formData.append('product_id', String(product_id));
    //     formData.append('device_uid', String(deviceId));
    //     formData.append('quantity',String(data.quantity));
    //     formData.append('size',String(data.size));
    //     const config = {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'multipart/form-data;',
    //             },
    //             body: formData,
    //         }
    //         fetch(Utils.gurl('addToWishlist'), config)
    //         .then((response) => response.json())
    //         .then((responseData) => {
    //             if(responseData.status){
    //                 MessageBarManager.showAlert({
    //                     message: I18n.t('home.wishlistmsg1', { locale: lang }),
    //                     alertType: 'extra',
    //                     title:'',
    //                     titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
    //                     messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
    //                     // stylesheetWarning : {{ backgroundColor : '#FFC0CB'}}
    //                 })
    //             }
    //         })
    //         .then(()=>this.removeFromCartGloabl(cart_id,product_id))
    //         .catch((error) => {
    //             console.log(error);
    //         })
    //         .done();
    // }

    addtoWishlist (cart_id,product_id, data){
        console.log("data:=",data)
        // return;
        const {u_id, country, deviceId, lang} = this.props;
        let un_id= (u_id === undefined) ? '' : u_id,
        align = (lang === 'ar') ?  'right': 'left';
        let formData = new FormData();
        formData.append('u_id', String(un_id));
        formData.append('country', String(country));
        formData.append('product_id', String(product_id));
        formData.append('device_uid', String(deviceId));
        formData.append('quantity',String(data.quantity));
        formData.append('size',String(data.size));
        const config = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data;',
                },
                body: formData,
            }
            fetch(Utils.gurl('moveToWishlist'), config)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.status){
                    EventEmitter.emit('reloadProductsFromWhishlist')
                    MessageBarManager.showAlert({
                        message: I18n.t('home.wishlistmsg1', { locale: lang }),
                        alertType: 'extra',
                        title:'',
                        titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                        messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
                        // stylesheetWarning : {{ backgroundColor : '#FFC0CB'}}
                    })
                }
            })
            .then(()=>this.removeFromCartGloabl(cart_id,product_id))
            .catch((error) => {
                console.log(error);
            })
            .done();
    }

    removeFromCartGloabl(cart_id, product_id){
        const {u_id, country, user_type ,deviceId, lang} = this.props;
        align = (lang === 'ar') ?  'right': 'left';
        let formData = new FormData();
        // formData.append('u_id', String(u_id));
        if (u_id) {
            formData.append('u_id', String(u_id));
        }
        formData.append('country', String(country));
        formData.append('product_id', String(product_id));
        formData.append('cart_id', String(cart_id));
        formData.append('device_uid', String(deviceId));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        fetch(Utils.gurl('removeFromCart'), config)
        .then((response) => response.json())
        .then((responseData) => {
            // MessageBarManager.showAlert({
            //     message: I18n.t('cart.removeitem', { locale: lang }),
            //     title:'',
            //     alertType: 'extra',
            //     titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
            //     messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            // })
        })
        .then(()=>this.fetchData())
        .catch((error) => {
            console.log(error);
        })
        .done();
    }
}
class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            size : '',
            color : 'blue',
            selectSize : false,
            SHORT_LIST : ['0'],
            // showFare : false,
            // fleatFaresdata : ""
        };
    }
    openDialog(product_id){
        this.setState({
            selectSize : true,
            product_id : product_id
        })
    }
    changeSize(result){
        console.log("result:=",result)
        const {u_id, country, user_type ,deviceId, lang} = this.props;
        align = (lang === 'ar') ?  'right': 'left';
        if (result.selectedItem === 'undefined') {
            MessageBarManager.showAlert({
                message: I18n.t('productdetail.sizeerr', { locale: lang }),
                title:'',
                alertType: 'extra',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
        }
        else {
            this.setState({
                selectSize: false,
                size: result.selectedItem.label
            });
            this.editCart(result.selectedItem.label)
        }
    }
    componentDidMount(){
        var data =this.props.size_arr,
        length = data.length,
        sizeList= []
        for(var i=0; i < length; i++) {
            order = data[i];
            // console.warn(order);
            sizeof = order.size;
            sizeList.push(sizeof);
        }
        console.log("sizeList:=",sizeList)
        // console.warn(sizeList);
        this.setState({
            SHORT_LIST: sizeList,
        })
    }
    // showPrice = ()=> {
    //     this.setState({
    //         showFare: !this.state.showFare
    //     });
        // !this.state.fleatFaresdata ?
        // this.fleetCompanyFilter() : undefined
    // }
    // fleetCompanyFilter(){
    //     let order_id = "119",
    //     pickUp_latitude = "23.011863",
    //     pickUp_longitude = "72.576027",
    //     min_price = "0",
    //     max_price = "50000";
    //     api.fleetCompanyFilter(order_id, pickUp_latitude, pickUp_longitude, min_price, max_price)
    //     .then((responseData)=> {
    //         if(responseData.response.status){
    //             this.setState({
    //                 fleatFaresdata: responseData.response.data[0].price,
    //             });
    //         }
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     })
    //     .done();
    // }
    removeFromCart(cart_id, product_id){
        const {u_id, country, user_type ,deviceId, lang} = this.props;
        align = (lang === 'ar') ?  'right': 'left';
        let formData = new FormData();
        // formData.append('u_id', String(u_id));
        if (u_id) {
            formData.append('u_id', String(u_id));
        }
        formData.append('country', String(country));
        formData.append('product_id', String(product_id));
        formData.append('cart_id', String(cart_id));
        formData.append('device_uid', String(deviceId));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        fetch(Utils.gurl('removeFromCart'), config)
        .then((response) => response.json())
        .then((responseData) => {
            console.log("removeFromCart Response:=",responseData)
            if (responseData.status) {
                MessageBarManager.showAlert({
                    message: I18n.t('cart.removeitem', { locale: lang }),
                    title:'',
                    alertType: 'extra',
                    titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                    messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
                })
            }   
            else {
                MessageBarManager.showAlert({
                    message: responseData.data.message,
                    title:'',
                    alertType: 'extra',
                    titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                    messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
                })
            }
        })
        .then(()=>this.props.callback())
        .catch((error) => {
            console.log(error);
        })
        .done();
    }
    editCart(size){
        const { color } = this.state;
        const {u_id, country, cart_id , lang} = this.props,
        align = (lang === 'ar') ?  'right': 'left';
        let formData = new FormData();
        // formData.append('u_id', String(u_id));
        if (u_id) {
            formData.append('u_id', String(u_id));
        }
        formData.append('size', String(size));
        formData.append('color', String(color));
        formData.append('cart_id', String(cart_id));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        console.log("editCart Request:=",config)
        fetch(Utils.gurl('editCart'), config)
        .then((response) => response.json())
        .then((responseData) => {
            console.log("editCart responseData:=",responseData)
            if(responseData.status) {
                MessageBarManager.showAlert({
                    message: I18n.t('cart.cartUpdate', { locale: lang }),
                    title:'',
                    alertType: 'extra',
                    titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                    messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
                })
            }else{
                MessageBarManager.showAlert({
                    message: I18n.t('cart.somethingwentswrong', { locale: lang }),
                    title:'',
                    alertType: 'extra',
                    titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                    messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
                })
            }
        })
        .then(()=>this.props.callback())
        .catch((error) => {
            console.log(error);
        })
        .done();
    }
    render(){
        let {product_id,cart_id , lang} = this.props
        let {SHORT_LIST, showFare , fleatFaresdata} = this.state
        let direction = (lang === 'ar') ? 'row-reverse' :'row',
        align = (lang === 'ar') ?  'right': 'left';
        return(
            <View style={{backgroundColor: "transparent"}}>
            <View style={[styles.bottom, {flexDirection: direction}]}>
                <TouchableOpacity
                    onPress={()=> this.removeFromCart( cart_id, product_id)}
                    style={[styles.wishbutton, {flexDirection : direction, justifyContent: "center", padding:10}]}>
                    <Entypo name="cross" size={20} color="#a9d5d1"/>
                    <Text style={{ left : 5}}>{I18n.t('cart.remove', { locale: lang })}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.wishbutton, {flexDirection : direction, justifyContent: "center"}]}
                    onPress={()=>this.openDialog(product_id)}>
                    <Entypo name="edit" size={20} color="#a9d5d1"/>
                    <Text style={{ left :5}}>{I18n.t('cart.edit', { locale: lang })}</Text>
                </TouchableOpacity>
                <SinglePickerMaterialDialog
                    title={I18n.t('cart.selectsize', { locale: lang })}
                    items={SHORT_LIST.map((row, index) => ({ value: index, label: row }))}
                    visible={this.state.selectSize}
                    selectedItem={this.state.singlePickerSelectedItem}
                    onCancel={() => this.setState({ selectSize: false })}
                    onOk={result => this.changeSize(result)}
                    cancelLabel={I18n.t('cart.cancel', { locale: lang })}
                    okLabel={I18n.t('cart.ok', { locale: lang })}
                    />
            </View>
        </View>

        )
    }
}

class SelectItem extends Component{
    constructor(props) {
        super(props);
        this.state = {
            size : '',
            color : 'blue',
            selectSize : false,
            SHORT_LIST : ['0']
        };
    }
    componentDidMount(){
        var data =this.props.size_arr,
        length = data.length,
        sizeList= [];
        for(var i=0; i < length; i++) {
            order = data[i];
            sizeof = order.size;
            sizeList.push(sizeof);
        }
        this.setState({
            SHORT_LIST: sizeList,
        })
    }
    validate(){
        // const { color} = this.state;
        // if (!color.length)
        // {
            // MessageBarManager.showAlert({
            //     message: "Please Select Color",
            //     alertType: 'alert',
            //     title:''
            // })
        //     return false
        // }
        return true;
    }
    editWishlist(size){
        const { color, } = this.state;
        const {wishlist_id, u_id, country, product_id, deviceId } = this.props;
        const { lang } = this.props,
        align = (lang === 'ar') ?  'right': 'left';

        let formData = new FormData();
        // formData.append('u_id', String(u_id));
        if (u_id) {
            formData.append('u_id', String(u_id));
        }
        // formData.append('country', String(country));
        // formData.append('device_uid', String(deviceId));
        // formData.append('product_id', String(product_id));
        formData.append('wishlist_id', String(wishlist_id));
        formData.append('size', String(size));
        formData.append('color', String(color));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        }
        if (this.validate()) {
            fetch(Utils.gurl('editWishlist'), config)
            .then((response) => response.json())
            .then((responseData) => {
                MessageBarManager.showAlert({
                        message: I18n.t('wishlist.changewishlistalert', { locale: lang }),
                        title:'',
                        alertType: 'extra',
                        titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                        messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
                    })

            })
            .then(()=>this.props.callback())
            .catch((error) => {
              console.log(error);
            })
            .done();
        }
    }
    removeWishlist(){
        const {u_id, country, product_id, deviceId } = this.props;
        let formData = new FormData();
        // formData.append('u_id', String(u_id));
        if (u_id) {
            formData.append('u_id', String(u_id));
        }
        formData.append('country', String(country));
        formData.append('product_id', String(product_id));
        formData.append('device_uid', String(deviceId));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        fetch(Utils.gurl('removeFromWishlist'), config)
        .then((response) => response.json())
        .then((responseData) => {
            if (responseData.status) {
                this.props.callback()
            }
        })
        .then(()=>this.props.callback())
        .catch((error) => {
          console.log(error);
        })
        .done();
    }
    changeSize(result){
        console.log("result:=",result)
        if (result.selectedItem === undefined) {
            const {u_id, country, user_type ,deviceId, lang} = this.props;
            align = (lang === 'ar') ?  'right': 'left';

            MessageBarManager.showAlert({
                message: 'Please select size',
                title:'',
                alertType: 'extra',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
        }
        else {
            this.setState({
                selectSize: false,
                size: result.selectedItem.label
            });
            this.editCart(result.selectedItem.label)
        }
    }


    removeFromCart(cart_id, product_id){
        const {u_id, country, user_type ,deviceId, lang} = this.props;
        align = (lang === 'ar') ?  'right': 'left';
        let formData = new FormData();
        // formData.append('u_id', String(u_id));
        if (u_id) {
            formData.append('u_id', String(u_id));
        }
        formData.append('country', String(country));
        formData.append('product_id', String(product_id));
        formData.append('cart_id', String(cart_id));
        formData.append('device_uid', String(deviceId));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        console.log("removeFromCart Request:=",config)
        fetch(Utils.gurl('removeFromCart'), config)
        .then((response) => response.json())
        .then((responseData) => {
            console.log("removeFromCart Response:=",responseData)
            if (responseData.status) {
                MessageBarManager.showAlert({
                    message: I18n.t('cart.removeitem', { locale: lang }),
                    title:'',
                    alertType: 'extra',
                    titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                    messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
                })
            }   
            else {
                MessageBarManager.showAlert({
                    message: responseData.data.message,
                    title:'',
                    alertType: 'extra',
                    titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                    messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
                })
            }
        })
        .then(()=>this.props.callback())
        .catch((error) => {
            console.log(error);
        })
        .done();
    }
    editCart(size){
        const { color } = this.state;
        const {u_id, country, cart_id , lang} = this.props,
        align = (lang === 'ar') ?  'right': 'left';
        let formData = new FormData();
        // formData.append('u_id', String(u_id));
        if (u_id) {
            formData.append('u_id', String(u_id));
        }
        formData.append('size', String(size));
        formData.append('color', String(color));
        formData.append('cart_id', String(cart_id));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        console.log("editCart Request:=",config)
        fetch(Utils.gurl('editCart'), config)
        .then((response) => response.json())
        .then((responseData) => {
            console.log("editCart responseData:=",responseData)
            if(responseData.status) {
                MessageBarManager.showAlert({
                    message: I18n.t('cart.cartUpdate', { locale: lang }),
                    title:'',
                    alertType: 'extra',
                    titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                    messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
                })
            }else{
                MessageBarManager.showAlert({
                    message: I18n.t('cart.somethingwentswrong', { locale: lang }),
                    title:'',
                    alertType: 'extra',
                    titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                    messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
                })
            }
        })
        .then(()=>this.props.callback())
        .catch((error) => {
            console.log(error);
        })
        .done();
    }

    render(){
        const {lang }  = this.props;
        let { SHORT_LIST } = this.state;
        let swipeBtns = [{
            text: I18n.t('wishlist.edit', { locale: lang }),
            backgroundColor: '#a9d5d1',
            underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
            onPress: () => {
                this.setState({
                    selectSize : true
                })
            }},{
                text: I18n.t('wishlist.delete', { locale: lang }),
                backgroundColor: '#f53d3d',
                underlayColor: 'rgba(0, 0, 0, 1)',
                onPress: () => {this.removeFromCart(this.props.cart_id,this.props.product_id)}
            }];
        return(
            <Swipeout
                right={swipeBtns}
                autoClose={true}
                backgroundColor= 'transparent'>
                {this.props.children}
                <SinglePickerMaterialDialog
                    title={I18n.t('wishlist.selectsize', { locale: lang })}
                    items={SHORT_LIST.map((row, index) => ({ value: index, label: row }))}
                    visible={this.state.selectSize}
                    selectedItem={this.state.singlePickerSelectedItem}
                    onCancel={() => this.setState({ selectSize: false })}
                    onOk={result => this.changeSize(result)}
                    cancelLabel={I18n.t('wishlist.cancel', { locale: lang })}
                    okLabel={I18n.t('wishlist.ok', { locale: lang })}
                    />
            </Swipeout>
        )
    }
}

const styles = StyleSheet.create ({
    container: {
        flexDirection: 'column',
        padding : 10
    },
    row: {
        flexDirection: 'row',
        marginTop : 1
    },
    qtybutton: {
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: 'center',
        borderWidth : StyleSheet.hairlineWidth,
        borderColor : "#ccc",
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    wishbutton :{
        alignItems : 'center',
        width : width/2-10,
        borderWidth : StyleSheet.hairlineWidth,
        borderColor : "#ccc",
        padding : 5
    },
    thumb: {
        width   : '20%',
        height  :'50%' ,
        resizeMode: 'center'
    },
    textQue :{
        flex: 1,
        fontSize: 18,
        fontWeight: '400',
        left : 5
    },
    centering: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    bottom : {
        borderBottomLeftRadius : 10,
        borderBottomRightRadius : 10,
        justifyContent : 'space-around',
        backgroundColor : "#fff"
    },
    headline: {
        paddingTop : 10,
        paddingBottom : 10,
        marginLeft : 15,
        fontSize    : 15,
        color       : "#000",
        fontWeight  : 'bold'
    },
    detail: {
        padding : 10,
        backgroundColor : '#fff',
        minHeight : 500,
        fontWeight : 'bold'
    },
    shoping : {
        width : width/2,
        backgroundColor : "#fbcdc5",
        alignItems : 'center',
        padding : 10
    },
    checkout : {
        width : width/2,
        backgroundColor : "#a9d5d1",
        alignItems : 'center',
        padding : 10
     }
})
const drawerStyles = {
    drawer: {
        backgroundColor:'#fff',
        shadowColor: '#000000',
        shadowOpacity: 0.8,
        shadowRadius: 3
    },
    main: {
        // paddingLeft: 3,
        backgroundColor:'transparent'
    },
}

//  twitter icon
const TWITTER_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAABvFBMVEUAAAAA//8AnuwAnOsAneoAm+oAm+oAm+oAm+oAm+kAnuwAmf8An+0AqtUAku0AnesAm+oAm+oAnesAqv8An+oAnuoAneoAnOkAmOoAm+oAm+oAn98AnOoAm+oAm+oAmuoAm+oAmekAnOsAm+sAmeYAnusAm+oAnOoAme0AnOoAnesAp+0Av/8Am+oAm+sAmuoAn+oAm+oAnOoAgP8Am+sAm+oAmuoAm+oAmusAmucAnOwAm+oAmusAm+oAm+oAm+kAmusAougAnOsAmukAn+wAm+sAnesAmeoAnekAmewAm+oAnOkAl+cAm+oAm+oAmukAn+sAmukAn+0Am+oAmOoAmesAm+oAm+oAm+kAme4AmesAm+oAjuMAmusAmuwAm+kAm+oAmuoAsesAm+0Am+oAneoAm+wAmusAm+oAm+oAm+gAnewAm+oAle0Am+oAm+oAmeYAmeoAmukAoOcAmuoAm+oAm+wAmuoAneoAnOkAgP8Am+oAm+oAn+8An+wAmusAnuwAs+YAmegAm+oAm+oAm+oAmuwAm+oAm+kAnesAmuoAmukAm+sAnukAnusAm+oAmuoAnOsAmukAqv9m+G5fAAAAlHRSTlMAAUSj3/v625IuNwVVBg6Z//J1Axhft5ol9ZEIrP7P8eIjZJcKdOU+RoO0HQTjtblK3VUCM/dg/a8rXesm9vSkTAtnaJ/gom5GKGNdINz4U1hRRdc+gPDm+R5L0wnQnUXzVg04uoVSW6HuIZGFHd7WFDxHK7P8eIbFsQRhrhBQtJAKN0prnKLvjBowjn8igenQfkQGdD8A7wAAAXRJREFUSMdjYBgFo2AUDCXAyMTMwsrGzsEJ5nBx41HKw4smwMfPKgAGgkLCIqJi4nj0SkhKoRotLSMAA7Jy8gIKing0KwkIKKsgC6gKIAM1dREN3Jo1gSq0tBF8HV1kvax6+moG+DULGBoZw/gmAqjA1Ay/s4HA3MISyrdC1WtthC9ebGwhquzsHRxBfCdUzc74Y9UFrtDVzd3D0wtVszd+zT6+KKr9UDX749UbEBgULIAbhODVHCoQFo5bb0QkXs1RAvhAtDFezTGx+DTHEchD8Ql4NCcSyoGJYTj1siQRzL/JKeY4NKcSzvxp6RmSWPVmZhHWnI3L1TlEFDu5edj15hcQU2gVqmHTa1pEXJFXXFKKqbmM2ALTuLC8Ak1vZRXRxa1xtS6q3ppaYrXG1NWjai1taCRCG6dJU3NLqy+ak10DGImx07LNFCOk2js6iXVyVzcLai7s6SWlbnIs6rOIbi8ViOifIDNx0uTRynoUjIIRAgALIFStaR5YjgAAAABJRU5ErkJggg==";

//  facebook icon
const FACEBOOK_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAYFBMVEUAAAAAQIAAWpwAX5kAX5gAX5gAX5gAXJwAXpgAWZ8AX5gAXaIAX5gAXpkAVaoAX5gAXJsAX5gAX5gAYJkAYJkAXpoAX5gAX5gAX5kAXpcAX5kAX5gAX5gAX5YAXpoAYJijtTrqAAAAIHRSTlMABFis4vv/JL0o4QvSegbnQPx8UHWwj4OUgo7Px061qCrcMv8AAAB0SURBVEjH7dK3DoAwDEVRqum9BwL//5dIscQEEjFiCPhubziTbVkc98dsx/V8UGnbIIQjXRvFQMZJCnScAR3nxQNcIqrqRqWHW8Qd6cY94oGER8STMVioZsQLLnEXw1mMr5OqFdGGS378wxgzZvwO5jiz2wFnjxABOufdfQAAAABJRU5ErkJggg==";

//  whatsapp icon
const WHATSAPP_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAACzVBMVEUAAAAArQAArgAArwAAsAAAsAAAsAAAsAAAsAAAsAAAsAAAsAAArwAAtgAAgAAAsAAArwAAsAAAsAAAsAAAsAAAsgAArwAAsAAAsAAAsAAAsQAAsAAAswAAqgAArQAAsAAAsAAArwAArwAAsAAAsQAArgAAtgAAsQAAuAAAtAAArwAAsgAAsAAArAAA/wAAsQAAsAAAsAAAsAAAzAAArwAAsAAAswAAsAAAsAAArQAAqgAAsAAAsQAAsAAAsAAAsAAAqgAAsQAAsAAAsAAArwAAtAAAvwAAsAAAuwAAsQAAsAAAsAAAswAAqgAAswAAsQAAswAAsgAAsAAArgAAsAAAsAAAtwAAswAAsAAAuQAAvwAArwAAsQAAsQAAswAAuQAAsAAAsAAArgAAsAAArgAArAAAsAAArgAArgAAsAAAswAArwAAsAAAsQAArQAArwAArwAAsQAAsAAAsQAAsQAAqgAAsAAAsAAAsAAAtAAAsAAAsQAAsAAAsAAAsAAArgAAsAAAsQAAqgAAsAAAsQAAsAAAswAArwAAsgAAsgAAsgAApQAArQAAuAAAsAAArwAAugAArwAAtQAArwAAsAAArgAAsAAAsgAAqgAAsAAAsgAAsAAAzAAAsQAArwAAswAAsAAArwAArgAAtwAAsAAArwAAsAAArwAArwAArwAAqgAAsQAAsAAAsQAAnwAAsgAArgAAsgAArwAAsAAArwAArgAAtAAArwAArwAArQAAsAAArwAArwAArwAAsAAAsAAAtAAAsAAAswAAsgAAtAAArQAAtgAAsQAAsQAAsAAAswAAsQAAsQAAuAAAsAAArwAAmQAAsgAAsQAAsgAAsAAAsgAAsAAArwAAqgAArwAArwAAsgAAsQAAsQAArQAAtAAAsQAAsQAAsgAAswAAsQAAsgAAsQAArwAAsQAAsAAArQAAuQAAsAAAsQAArQCMtzPzAAAA73RSTlMAGV+dyen6/vbfvIhJBwJEoO//1oQhpfz98Or0eQZX5ve5dkckEw4XL1WM0LsuAX35pC0FVuQ5etFEDHg+dPufFTHZKjOnBNcPDce3Hg827H9q6yax5y5y7B0I0HyjhgvGfkjlFjTVTNSVgG9X3UvNMHmbj4weXlG+QfNl4ayiL+3BA+KrYaBDxLWBER8k4yAazBi28k/BKyrg2mQKl4YUipCYNdR92FBT2hhfPd8I1nVMys7AcSKfoyJqIxBGSh0shzLMepwjLsJUG1zhErmTBU+2RtvGsmYJQIDN69BREUuz65OCklJwpvhdFq5BHA9KmUcAAALeSURBVEjH7Zb5Q0xRFMdDNZZU861EyUxk7IRSDY0piSJLiSwJpUTM2MlS2bdERskSWbLva8qWNVv2new7f4Pz3sw09eq9GT8395dz7jnzeXc5554zFhbmYR41bNSqXcfSylpUt179BjYN/4u0tbMXwzAcHJ1MZ50aObNQ4yYurlrcpambics2k9DPpe7NW3i0lLVq3aZtOwZv38EUtmMnWtazcxeDpauXJdHe3UxgfYj19atslHenK/DuYRT2VwA9lVXMAYF08F5G2CBPoHdwNQ6PPoBlX0E2JBToF0JKcP8wjmvAQGCQIDwYCI8gqRziHDmU4xsGRA0XYEeMBEYx0Yqm6x3NccaMAcYKwOOA2DiS45kkiedmZQIwQSBTE4GJjJzEplUSN4qTgSn8MVYBakaZysLTuP7pwAxeeKYUYltGmcWwrnZc/2xgDi88FwjVvoxkQDSvij9Cgfm8sBewQKstJNivil/uAikvTLuN1mopqUCanOtftBgiXjgJWKJTl9Khl9lyI20lsPJyYIX+4lcSvYpN8tVr9P50BdbywhlSROlXW7eejm2fSQfdoEnUPe6NQBZ/nH2BbP1kUw6tvXnL1m0kNLnbGdMOII8/w3YCPuWTXbuZaEtEbMLsYTI+H9jLD+8D9svKZwfcDQX0IM0PAYfl/PCRo8CxCsc4fkLHnqRPup0CHIXe82l6VmcqvlGbs7FA8rkC0s8DqYVCcBFV3YTKprALFy8x8nI4cEWwkhRTJGXVegquAiqlIHwNuF6t44YD7f6mcNG+BZSQvJ3OSeo7dwFxiXDhDVAg516Q/32NuDTbYH3w8BEFW/LYSNWmCvLkqbbJSZ89V78gU9zLVypm/rrYWKtJ04X1DfsBUWT820ANawjPLTLWatTWbELavyt7/8G5Qn/++KnQeJP7DFH+l69l7CbU376rrH4oXHOySn/+MqW7/s77U6mHx/zNyAw2/8Myjxo4/gFbtKaSEfjiiQAAAABJRU5ErkJggg==";

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
export default connect(mapStateToProps)(Shopingcart);
