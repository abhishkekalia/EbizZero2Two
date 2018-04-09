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
    Image ,
    RefreshControl,
    ActivityIndicator,
    Picker,
    Clipboard,
    ToastAndroid,
    AlertIOS,
    Platform,
} from 'react-native';
import {connect} from 'react-redux';
import I18n from 'react-native-i18n'
import Feather from 'react-native-vector-icons/Feather';
import Swipeout from 'react-native-swipeout';
import Utils from 'app/common/Utils';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import { Actions } from 'react-native-router-flux';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import  Countmanager  from './Countmanager';
import {
    SinglePickerMaterialDialog,
} from 'react-native-material-dialog';
import { material } from 'react-native-typography';
import Share, {ShareSheet, Button} from 'react-native-share';
import EventEmitter from "react-native-eventemitter";
import Drawer from 'react-native-drawer';
import Menu from '../menu/MenuContainer';

const { width, height } = Dimensions.get('window');

class WishList extends Component {
    constructor(props) {
        super(props);
        this.fetchData = this.fetchData.bind(this);
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            status : false,
            u_id: null,
            country : null,
            loaded: false,
            toggle : false,
            refreshing: false,
            color: 'blue',
            visible: false,
        };
    }
    componentDidMount(){
        this.fetchData()
        EventEmitter.removeAllListeners("reloadWishlist");
        EventEmitter.on("reloadWishlist", (value)=>{
            console.log("reloadWishlist")
            this.fetchData()
        });
    }
    _renderLeftButton = () => {
         return(
             <Feather name="menu" size={20} onPress={()=>this.openControlPanel()} color="#fff" style={{ padding : 10, paddingTop: Platform.OS === 'ios' ? 20 : 10}}/>
         );
     };
   _renderRightButton = () => {
        return(
            <Text style={{color : '#fff'}}></Text>
        );
    };
    refreshfromCount(){
        this.fetchData()
    }
    onCancel() {
        console.log("CANCEL")
        this.setState({visible:false});
    }
    onOpen() {
        console.log("OPEN")
        this.setState({visible:true});
    }
    fetchData(){
        const {u_id, country, deviceId } = this.props;
        // console.warn(this.props.country);
        // console.warn(this.props.deviceId);

        let formData = new FormData();
        formData.append('device_uid', String(deviceId));
        formData.append('country', String(country));
        console.log(formData);
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        fetch(Utils.gurl('wishlist'), config)
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.status){
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(responseData.data),
                    status : responseData.status,
                    refreshing : false,
                    loaded : true
                });
            }else {
                this.setState({
                    status : responseData.status,
                    refreshing : false,
                    loaded : true
                })
            }
        })
        .catch((error) => {
          console.log(error);
        })
        .done();
    }
    validate(size){
        const { lang } = this.props,
        align = (lang === 'ar') ?  'right': 'left';
        if (!size.length)
        {
            MessageBarManager.showAlert({
                message: I18n.t('wishlist.pleaseselectitems', { locale: lang }),
                title:'',
                alertType: 'extra',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
            })
            return false
        }
        return true;
    }
    addtoCart(count, product_id, size){
        const { color} = this.state,
        {u_id, country, deviceId, lang} = this.props;
        align = (lang === 'ar') ?  'right': 'left';
        let formData = new FormData();
        // formData.append('u_id', String(u_id));
        formData.append('country', String(country));
        formData.append('product_id', String(product_id));
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
        if (this.validate(size)) {
            fetch(Utils.gurl('addTocart'), config)
            .then((response) => response.json())
            .then((responseData) => {
                if(responseData.status){
                    MessageBarManager.showAlert({
                        message: I18n.t('wishlist.productadded', { locale: lang }),
                        alertType: 'extra',
                        title:'',
                        titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                        messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
                    })
                }else {
                    MessageBarManager.showAlert({
                        message: I18n.t('wishlist.somedatamissing', { locale: lang }),
                        alertType: 'extra',
                        title:'',
                        titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                        messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
                    })
                }
            })
            .then(()=>this.removeWishlist(product_id))
            .catch((error) => {
              console.log(error);
            })
            .done();
        }
    }
    removeWishlist(product_id){
        let {country, u_id, deviceId, lang} = this.props;
        let formData = new FormData();
        // formData.append('u_id', String(u_id));
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
                console.log(responseData);
            }
        })
        .then(()=> this.fetchData())
        .catch((error) => {
          console.log(error);
        })
        .done();
    }
    updateState = () => {
        this.setState({
            Quentity: !this.state.Quentity
        });
    }
    noItemFound() {
        const {lang} = this.props,
        side = lang === "ar" ? "right" : "left";
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
                side={side}
                >
                <View style={{flex: 1}}>
                    <View style={{height: Platform.OS === 'ios' ? 60 : 54,alignItems: 'center', backgroundColor: "#a9d5d1", justifyContent: 'space-between', flexDirection: lang === "ar" ? "row-reverse" : "row"}}>
                        {this._renderLeftButton()}
                        <Text style={{ color: "#fff", fontWeight: 'bold', fontSize: 15, paddingTop: Platform.OS === 'ios' ? 10 : 0, marginLeft: Platform.OS === 'ios' ? -35 : 0}}>{I18n.t('wishlist.wishlistTitle', { locale: lang })}</Text>
                        {this._renderRightButton()}
                    </View>
                    <View style={{ flexDirection:'column', justifyContent:'center', alignItems:'center', flex:1}}>
                        <Text> {I18n.t('wishlist.noitem', { locale: lang })} </Text>
                    </View>
                </View>
            </Drawer>
        );
    }
    getSize(size){
        this.setState({size});
    }
    getColor(color){
        this.setState({color});
    }
    renderLoadingView() {
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
                closedDrawerOffset={-3}
                styles={drawerStyles}
                tweenHandler={(ratio) => ({
                    main: { opacity:(2-ratio)/2 }
                })}
                side= {side}
                >
                <View style={{flex: 1}}>
                    <View style={{height: Platform.OS === 'ios' ? 60 : 54,alignItems: 'center', backgroundColor: "#a9d5d1", justifyContent: 'space-between', flexDirection: lang === "ar" ? "row-reverse" : "row"}}>
                        {this._renderLeftButton()}
                        <Text style={{ color: "#fff", fontWeight: 'bold', fontSize: 15, paddingTop: Platform.OS === 'ios' ? 10 : 0, marginLeft: Platform.OS === 'ios' ? -35 : 0}}>{I18n.t('wishlist.wishlistTitle', { locale: lang })}</Text>
                        {this._renderRightButton()}
                    </View>
                    <ActivityIndicator
                        style={[styles.centering]}
                        color="#a9d5d1"
                        size="large"/>
                </View>
            </Drawer>
        );
    }
    render() {
        const { lang } = this.props;
        let side = lang === "ar" ? "right" : "left";
        let shareOptions = {
            title: "React Native",
            message: "Hola mundo",
            url: "http://facebook.github.io/react-native/",
            subject: "Share Link" //  for email
        };

        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        if (!this.state.status) {
            return this.noItemFound();
        }
        let listView = (<View></View>);
        listView = (
            <ListView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.fetchData} />
                }
                contentContainerStyle={styles.container}
                dataSource={this.state.dataSource}
                renderRow={this.renderData.bind(this)}
                enableEmptySections={true}
                automaticallyAdjustContentInsets={false}
                showsVerticalScrollIndicator={false}
                />
        );
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
                <View style={{flex :1}}>
                    <View style={{height: Platform.OS === 'ios' ? 60 : 54,alignItems: 'center', backgroundColor: "#a9d5d1", justifyContent: 'space-between', flexDirection: lang === "ar" ? "row-reverse" : "row"}}>
                        {this._renderLeftButton()}
                        <Text style={{ color: "#fff", fontWeight: 'bold', fontSize: 15, paddingTop: Platform.OS === 'ios' ? 10 : 0, marginLeft: Platform.OS === 'ios' ? -35 : 0}}>{I18n.t('wishlist.wishlistTitle', { locale: lang })}</Text>
                        {this._renderRightButton()}
                    </View>
                    <ScrollView>
                        {listView}
                    </ScrollView>
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
                </View>
            </Drawer>
        );
    }
    renderData( data, rowData: string, sectionID: number, rowID: number, index) {
        let {country, u_id, deviceId, lang} = this.props,
        direction = (lang === 'ar') ? 'row-reverse' :'row',
        align = (lang == 'ar')? 'right': 'left';

        let color = data.special_price ? '#a9d5d1' : '#000';
        let textDecorationLine = data.special_price ? 'line-through' : 'none',
        product_name = (lang == 'ar')? data.product_name_in_arabic : data.product_name,
        short_description = (lang == 'ar')? data.short_description_in_arabic : data.short_description,
        detail_description = (lang == 'ar')? data.detail_description_in_arabic : data.detail_description,
        price = (lang == 'ar')? data.price_in_arabic : data.price,
        size = (lang == 'ar')? data.size_in_arabic : data.size,
        special_price = (lang == 'ar')? data.special_price_in_arabic : data.special_price;

        return (
            <View style={{
                    flexDirection: 'column-reverse' ,
                    marginTop : 2,
                    borderWidth : 0.5,
                    borderColor : "#ccc",
                    borderRadius : 5}
                }>
                <SelectItem product_id={data.product_id} u_id={u_id} deviceId= {deviceId} country={country} callback={this.refreshfromCount.bind(this)} size_arr={data.size_arr} lang={lang}>
                    <View style={{
                            flexDirection: direction,
                            backgroundColor : "#fff", alignItems : 'center'}
                        }>
                        <Image style={[styles.thumb]}
                            source={{ uri : data.productImages[0] ? data.productImages[0].image : null}}
                            />
                        <View style={{flexDirection: 'column', justifyContent : 'space-between', marginLeft: 10}}>
                            <TouchableOpacity onPress={()=>Actions.deascriptionPage({
                                    title: data.product_name,
                                    product_id : data.product_id})
                                }>
                                <Text style={{fontSize: 13, color: '#696969', marginTop: 10, marginBottom:5 ,textAlign:align}} > {product_name} </Text>
                            </TouchableOpacity>
                            <Text style={{ fontSize : 10, color : '#696969',bottom:5, textAlign:align}} > {short_description} </Text>
                            <View style={{ flexDirection: direction}}>
                                <Text style={{fontSize: 13 ,alignSelf: 'center'}}> {I18n.t('wishlist.quantity', { locale: lang })}  </Text>
                                <Text style={{fontSize: 13 ,alignSelf: 'center'}}> : </Text>
                                <Countmanager
                                quantity={data.quantity}
                                u_id={this.props.u_id}
                                product_id={data.product_id}
                                updatetype={"0"}
                                country={this.props.country}
                                deviceId={deviceId}
                                callback={this.refreshfromCount.bind(this)}
                                />
                            </View>
                            <View style={{ flexDirection: direction}}>
                                <Text style={{fontSize :12}}>{I18n.t('wishlist.sizelbl', { locale: lang })} </Text>
                                <Text style={{fontSize :12}}> : </Text>
                                <Text style={{fontSize:12}}> {size}</Text>
                            </View>
                            <View style={{ flexDirection: direction, justifyContent:"space-between"}}>
                            <View style={{ flexDirection: direction}}>
                                <Text style={{fontWeight :'bold'}}> {special_price} </Text>
                                <Text style={{fontWeight:'bold'}}> KWD</Text>
                            </View>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.bottom, {flexDirection: (lang === 'ar') ? 'row-reverse' : 'row'}]}>
                        <TouchableOpacity style={[styles.wishbutton, {flexDirection: (lang === 'ar') ? 'row-reverse' : 'row', justifyContent: "center"}]} onPress={this.onOpen.bind(this)}>
                            <SimpleLineIcons name="share-alt" size={20} color="#a9d5d1"/>
                            <Text style={{ left : 5}}>{I18n.t('wishlist.share', { locale: lang })}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.wishbutton, {flexDirection: (lang === 'ar') ? 'row-reverse' : 'row', justifyContent: "center"}]}
                            onPress={()=>this.addtoCart(data.quantity, data.product_id, data.size)}>
                            <Image source={require('../../images/cart_icon.png')} style={{ width:"10%", height : "100%"}}/>
                            <Text style={{ left :5}}>{I18n.t('wishlist.movetocart', { locale: lang })}</Text>
                        </TouchableOpacity>
                    </View>
                </SelectItem>
            </View>
        )
    }
    closeControlPanel = () => {
        this._drawer.close()
    };
    openControlPanel = () => {
        this._drawer.open()
    };
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
        const { color} = this.state;
        if (!color.length)
        {
            MessageBarManager.showAlert({
                message: "Please Select Color",
                alertType: 'alert',
                title:''
            })
            return false
        }
        return true;
    }
    editWishlist(size){
        const { color, } = this.state;
        const {u_id, country, product_id } = this.props;
        const { lang } = this.props,
        align = (lang === 'ar') ?  'right': 'left';

        let formData = new FormData();
        formData.append('u_id', String(u_id));
        formData.append('country', String(country));
        formData.append('product_id', String(product_id));
        formData.append('size', String(size));
        formData.append('color', String(color));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
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
        formData.append('u_id', String(u_id));
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
        this.setState({
            selectSize: false,
            size: result.selectedItem.label
        });
        this.editWishlist(result.selectedItem.label)
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
                underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
                onPress: () => {this.removeWishlist()}
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
        borderWidth : 1,
        borderColor : "#ccc",
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
        countryIcon: {
        width : 40,
        height:40,
        padding :10
    },
    wishbutton :{
        alignItems : 'center',
        width : width/2-10,
        borderWidth : 0.5,
        borderColor : "#ccc",
        padding : 5
    },
    thumb: {
      resizeMode: 'center',
        width   : '20%',
        height  :'50%' ,
        marginLeft : 10
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
    }
}
export default connect(mapStateToProps)(WishList);
