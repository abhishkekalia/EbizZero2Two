import React, { Component} from 'react';
import {
    ListView,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Dimensions,
    Text,
    View,
    TextInput,
    AsyncStorage,
    StatusBar,
    Clipboard,
    ToastAndroid,
    RefreshControl,
    ActivityIndicator,
    AlertIOS,
    Image,
    Platform
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import IconBadge from 'react-native-icon-badge';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Utils from 'app/common/Utils';
import GetMarketing from './GetMarketingad';
import ModalPicker from './modalpicker';
import Service from './Service';
import CheckBox from 'app/common/CheckBox';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import Editwish from './wish/Editwish'
import Modal from 'react-native-modal';
import Share, {ShareSheet, Button} from 'react-native-share';
import Feather from 'react-native-vector-icons/Feather';
import ModalWrapper from 'react-native-modal-wrapper';
import {connect} from 'react-redux';
import I18n from 'react-native-i18n'
import Drawer from 'react-native-drawer';
import Menu from './menu/MenuContainer';
import EventEmitter from "react-native-eventemitter";
const { width, height } = Dimensions.get('window')
let index = 0;

class MainView extends Component {
    constructor(props) {
        super(props);
        this.state={
            arrProductList:[],
            arrServiceList:[],
            dataSource: new ListView.DataSource({   rowHasChanged: (row1, row2) => row1 !== row2 }),
            dataSource2: new ListView.DataSource({  rowHasChanged: (row1, row2) => row1 !== row2 }),
            serviceArrayStatus : false,
            status : false,
            textInputValue: '',
            shoperId : '',
            data : [],
            dataArray: [],
            rows: [],
            serviceArray: [],
            servicerows: [],
            isService: false,
            isModalVisible: false,
            isLoading: true,
            u_id: null,
            user_type : null,
            country : null,
            loaded: false,
            toggle : false,
            refreshing: false,
            visible: false,
            product_id : '',
            product_name : '',
            url : '',
            arrSelectedCategory : [],
            isFilterProduct : true,
            arrSelectedGender :[],
            arrSelectedType :[],
        }
    }
    componentDidMount(){
        this.loadData()
        .then( ()=>this.fetchData())
        .then( ()=> this.fetchService())
        .then( ()=>this.loadServiceData())
        .done();
        EventEmitter.removeAllListeners("applyCategoryFilter");
        EventEmitter.on("applyCategoryFilter", (value)=>{
            if (value.selCategory.length > 0) {
                this.setState({
                    arrProductList:[],
                    dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
                    loaded:false,
                    arrSelectedCategory:value.selCategory,
                    arrSelectedGender:value.selGender,
                    arrSelectedType:value.selType,
                    isFilterProduct : true
                })
                this.filterByCategory(value.selCategory,value.selGender)
            } else {
                this.fetchData()
                this.setState({
                    arrSelectedCategory:value.selCategory,
                    arrSelectedGender:value.selGender,
                    arrSelectedType:value.selType,
                })
                // this.filterByCategory(value.selCategory,value.selGender)
            }
        });
        EventEmitter.removeAllListeners("reloadProducts");
        EventEmitter.on("reloadProducts", (value)=>{
            // this.fetchData()
        });

        EventEmitter.removeAllListeners("reloadProductsFromWhishlist");
        EventEmitter.on("reloadProductsFromWhishlist", (value)=>{
            this._onRefresh()
            this.fetchData()
        });
    }
    componentWillMount() {
        Actions.refresh({ right: this._renderRightButton, left: this._renderLeftButton});
    }
    _renderLeftButton = () => {
        return(
            <Feather name="menu" size={20} onPress={()=>this.openControlPanel()} color="#fff" style={{ padding : 10, paddingTop: Platform.OS === 'ios' ? 20 : 10}}/>
        );
    };
    _renderRightButton = () => {
        return(
            <Feather name="filter" size={20} onPress={()=> Actions.filterBar({selectedRows:this.state.arrSelectedCategory, selGender:this.state.arrSelectedGender, selType:this.state.arrSelectedType})} color="#fff" style={{ padding : 10, marginTop:Platform.OS === 'ios' ? 10 : 0}}/>
        );
    };
    closeControlPanel = () => {
        this._drawer.close()
    };
    openControlPanel = () => {
        this._drawer.open()
    };
    onCancel() {
        console.log("CANCEL")
        this.setState({visible:false});
    }
    onOpen(product_name, product_id, url) {
        this.setState({
            visible:true,
            product_name : product_name,
            product_id : product_id,
            url : url
        });
    }
    _onRefresh() {
        this.setState({
            refreshing: true,
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
            arrProductList:[],
        });
        this.fetchData();
    }
    modal = () => this.setState({
        isModalVisible: !this.state.isModalVisible
    })
    filterbyShop = () => {
        console.log("this.state.rows:=",this.state.rows)
        if (this.state.rows.length == 0) {
            this.state.isModalVisible = !this.state.isModalVisible
            this.state.isFilterProduct = true
            this.fetchData()
            return
        }
        this.setState({
            isModalVisible: !this.state.isModalVisible,
            loaded : false,
            isFilterProduct : true
        },this.fetchDataByShop())
    }
    fetchDataByShop(){
        console.log("fetchDataByShop: called")
        const { rows } = this.state;
        const {u_id, country, deviceId } = this.props;
        let un_id= (u_id === undefined) ? '' : u_id;
        let formData = new FormData();
        formData.append('u_id', String(un_id));
        formData.append('country', String(country));
        formData.append('vendor_id', String(rows));
        formData.append('device_uid', String(deviceId));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        fetch(Utils.gurl('filterByShop'), config)
        .then((response) => response.json())
        .then((responseData) => {
            var arrTmp = responseData.data
            console.log("arrTmp:=",arrTmp.length)
            var merge = []

                if (this.state.arrSelectedType.length == 0 || this.state.arrSelectedType.length == 2) {
                    if (this.state.arrServiceList.length > 0) {
                        if (arrTmp.length > 0) {
                            merge = arrTmp.concat(this.state.arrServiceList)
                        }
                        else {
                            merge = []
                        }
                    }
                }
                else {
                    if (this.state.arrSelectedType[0] == 1) {
                        if (arrTmp.length > 0) {
                            merge = arrTmp
                        }
                    }
                    else {
                        if (this.state.arrServiceList.length > 0) {
                            merge = this.state.arrServiceList
                        }
                    }
                }
                // if (this.state.arrServiceList.length > 0) {
                //     merge = arrTmp.concat(this.state.arrServiceList)
                // }
                console.log("arrTmp:=",arrTmp)

            console.log("merge:=",merge)
            this.state.arrProductList = responseData.data
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(merge),
                arrProductList: responseData.data,
                status : responseData.status,
                loaded: true,
                refreshing: false
            });
        })
        .catch((error) => {
            console.log(error);
        })
        .done();
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
                        <Image source={require('../images/login_img.png')} style={{height: 25, width: '20%', alignSelf: 'center', marginTop:Platform.OS === 'ios' ? 10 : 0}}
                            resizeMode = 'contain'
                            resizeMethod = 'resize'/>
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
    blur() {
        const {dataSource } = this.state;
        dataSource && dataSource.blur();
    }
    focus() {
        const {dataSource } = this.state;
        dataSource && dataSource.focus();
    }
    async loadData (){
        try {
            const {u_id, country, deviceId } = this.props;
            let formData = new FormData();
            // formData.append('u_id', String(user_type));
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
                console.log("responseData.data:=",responseData.data)
                this.setState({
                    dataArray: responseData.data,
                });
            })
            .catch((error) => {
                console.log(error);
            })
            .done();
        } catch (error) {
            console.log("Error retrieving data" + error);
        }
    }
    onClick(data) {
        data.checked = !data.checked;
        data.checked ? this.check(data) : this.unCheck(data)
    }
    check (data){
        console.log("this.state.rows:=",this.state.rows)
        var newStateArray = this.state.rows.slice();
        console.log("newStateArray:=",newStateArray)
        newStateArray.push(data.u_id);
        this.setState({
            rows: newStateArray,
        });
    }
    unCheck(data){
        var newStateArray = this.state.rows.slice();
        var index = newStateArray.indexOf(data.u_id);
        if (index > -1) {
            newStateArray.splice(index, 1);
        }
        this.setState({
            rows: newStateArray
        });
    }
    renderView() {
        if (!this.state.dataArray || this.state.dataArray.length === 0)return;
        var len = this.state.dataArray.length;
        var views = [];
        for (var i = 0, l = len - 2; i < l; i += 2) {
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {this.renderCheckBox(this.state.dataArray[i])}
                        {this.renderCheckBox(this.state.dataArray[i + 1])}
                    </View>
                </View>
            )
        }
        views.push(
            <View key={len - 1}>
                <View style={styles.item}>
                    {len % 2 === 0 ? this.renderCheckBox(this.state.dataArray[len - 2]) : null}
                    {this.renderCheckBox(this.state.dataArray[len - 1])}
                </View>
            </View>
        )
        return views;
    }
    renderCheckBox(data) {
        const { lang } = this.props;
        var leftText = data.ShopName;
        var icon_name = data.icon_name;
        return (
            <CheckBox
                style={{borderTopWidth : StyleSheet.hairlineWidth, borderColor : '#ccc', width : width-50}}
                leftTextStyle = {{padding:10}}
                onClick={()=>this.onClick(data)}
                isChecked={data.checked}
                leftText={leftText}
                lang={lang}
            />
        );
    }
    fetchData(){
        console.log("fetchData: called")
        const {u_id, country, deviceId, isGuest } = this.props;
        let formData = new FormData();
        console.log("u_id:=",u_id)
        console.log("isGuest:=",isGuest)
        if (u_id) {
            formData.append('u_id', String(u_id));
        }
        formData.append('country', String(country));
        formData.append('device_uid', String(deviceId));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        console.log("config:=",config)
        fetch(Utils.gurl('allProductItemList'), config)
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.status){
                var arrTmp = responseData.data
                var merge = []
                if (this.state.arrSelectedType.length == 0 || this.state.arrSelectedType.length == 2) {
                    if (this.state.arrServiceList.length > 0) {
                        if (arrTmp.length > 0) {
                            merge = arrTmp.concat(this.state.arrServiceList)
                        }
                        else {
                            merge = []
                        }
                    }
                }
                else {
                    if (this.state.arrSelectedType[0] == 1) {
                        if (arrTmp.length > 0) {
                            merge = arrTmp
                        }
                    }
                    else {
                        if (this.state.arrServiceList.length > 0) {
                            merge = this.state.arrServiceList
                        }
                    }
                }
                // if (this.state.arrServiceList.length > 0) {
                //     merge = arrTmp.concat(this.state.arrServiceList)
                // }
                console.log("arrTmp:=",arrTmp)
                console.log("merge:=",merge)
                this.state.arrProductList = responseData.data
                this.setState({
                    arrProductList:responseData.data,
                    dataSource: this.state.dataSource.cloneWithRows(merge),
                    status : responseData.status,
                    loaded: true,
                    refreshing: false
                });
            }else {
                this.setState({
                    status : responseData.status,
                    loaded: true,
                    refreshing: false
                })
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .done();
    }
    fetchService(){
        const {u_id, country} = this.props;
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
        fetch(Utils.gurl('serviceList'), config)
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.status){
                var arrTmp = responseData.data
                var merge = []
                if (this.state.arrSelectedType.length == 0 || this.state.arrSelectedType.length == 2) {
                    if (this.state.arrProductList.length > 0) {
                        if (arrTmp.length > 0) {
                            merge = arrTmp.concat(this.state.arrProductList)
                        }
                        else {
                            merge = []
                        }
                    }
                }
                else {
                    if (this.state.arrSelectedType[0] == 1) {
                        if (this.state.arrProductList.length > 0) {
                            merge = this.state.arrProductList
                        }
                    }
                    else {
                        if (arrTmp.length > 0) {
                            merge = arrTmp
                        }
                    }
                }
                // if (this.state.arrProductList.length > 0) {
                //     merge = arrTmp.concat(this.state.arrProductList)
                // }
                console.log("arrTmp:=",arrTmp)
                console.log("merge:=",merge)
                this.setState({
                    arrServiceList: responseData.data,
                    // dataSource2: this.state.dataSource2.cloneWithRows(arrTmp),
                    dataSource: this.state.dataSource.cloneWithRows(merge),
                    isLoading : false
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
    filterByCategory(selectedCategory,selectedGender){
        const {u_id, user_type,rows , arrSelectedType} = this.state;
        const { deviceId, country } = this.props;
        let ds = new ListView.DataSource({   rowHasChanged: (row1, row2) => row1 !== row2 });
        var venderIds = this.state.rows.slice();
        if(venderIds.length == 0) {
            for (var i = 0; i < this.state.dataArray.length; i++) {
                venderIds.push(parseInt(this.state.dataArray[i].u_id,10))
            }
        }
        var selCat = [];
        for (var i = 0; i < selectedCategory.length; i++) {
            selCat.push(parseInt(selectedCategory[i],10))
        }
        var selGen = [];
        for (var i = 0; i < selectedGender.length; i++) {
            selGen.push(parseInt(selectedGender[i],10))
        }
        let type_ids = 1;
        let formData = new FormData();
        formData.append('country', String(country));
        formData.append('category_id',selCat.toString());
        formData.append('vendor_id', venderIds.toString());
        formData.append('type_id', String(type_ids));
        formData.append('device_uid', String(deviceId));
        formData.append('gender',String(selGen));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        fetch(Utils.gurl('filterProducts'), config)
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.status){
                var arrTmp = responseData.data.product
                var merge = []
                if (this.state.arrSelectedType.length == 0 || this.state.arrSelectedType.length == 2) {
                    if (this.state.arrServiceList.length > 0) {
                        if (arrTmp.length > 0) {
                            merge = arrTmp.concat(this.state.arrServiceList)
                        }
                    }
                }
                else {
                    if (this.state.arrSelectedType[0] == 1) {
                        if (arrTmp.length > 0) {
                            merge = arrTmp
                        }
                    }
                    else {
                        if (this.state.arrServiceList.length > 0) {
                            merge = this.state.arrServiceList
                        }
                    }
                }
                // if (this.state.arrServiceList.length > 0) {
                //     merge = arrTmp.concat(this.state.arrServiceList)
                // }
                console.log("arrTmp:=",arrTmp)
                console.log("merge:=",merge)
                this.state.arrProductList = responseData.data.product
                this.setState({
                    dataSource: ds.cloneWithRows(merge),
                    arrProductList: responseData.data.product,
                    status : responseData.status,
                    loaded: true,
                    refreshing: false
                });
            }else {
                this.setState({
                    status : responseData.status,
                    loaded: true,
                    refreshing: false
                })
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .done();
    }
    Description( service_id, product_name, productImages , short_description, detail_description, price ,special_price){
        Actions.vendordesc({
            is_user : true,
            service_id : service_id,
            title: product_name,
            product_name : product_name,
            productImages : productImages,
            short_description : short_description,
            detail_description : detail_description,
            price : price,
            special_price : special_price,
        })
    }
    render() {
        const {u_id, country, deviceId ,lang} = this.props;
        console.log("isGuest:=",this.props.isGuest)
        console.log("country:=",this.props.country)
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        if (!this.state.status) {
            return this.noItemFound();
        }
        let side = lang === "ar" ? "right" : "left";
        return (
            <View style={{ flex: 1, backgroundColor: '#f9f9f9'}}>
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
                    <View style={{height: Platform.OS === 'ios' ? 60 : 54,alignItems: 'center', backgroundColor: "#a9d5d1", justifyContent: 'space-between', flexDirection: lang === "ar" ? "row-reverse" : "row"}}>
                        {this._renderLeftButton()}
                        <Image source={require('../images/login_img.png')} style={{height: 25, width: '20%', alignSelf: 'center', marginTop:Platform.OS === 'ios' ? 10 : 0}}
                            resizeMode = 'contain'
                            resizeMethod = 'resize'/>
                        {this._renderRightButton()}
                    </View>
                    {this.renderFilterOptions()}
                    <StatusBar
                        hidden={false}
                        backgroundColor="#a9d5d1"
                        barStyle="light-content"/>
                    <GetMarketing deviceId={deviceId } country={country} u_id={u_id} lang={lang}/>
                    <ScrollView
                        contentContainerStyle={{backgroundColor : 'transparent', paddingBottom: Platform.OS === 'ios' ? 0 : 0}}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="always">
                        { this.renderListData()}
                        {this.renderAllShopViews()}
                        {this.renderAllServiceViews()}
                    </ScrollView>
                    {this.renderShareSheet()}
                </Drawer>
            </View>
        );
    }
    renderShareSheet() {
        let shareOptions = {
            title: this.state.product_name,
            message: this.state.product_id,
            url: this.state.url,
            subject: "Share Link" //  for email
        };
        return(
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
                <View style={{marginBottom: 150}}/>
            </ShareSheet>
        );
    }
    renderListData(){
        const { lang} = this.props;
        let direction = (lang === 'ar') ? 'row-reverse' :'row',
        align = (lang == 'ar')? 'right': 'left';
        let side = lang === "ar" ? "right" : "left";

        let listView = (<View></View>);
        listView = (
            <ListView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)} />
                }
                contentContainerStyle={styles.list}
                dataSource={this.state.dataSource}
                renderRow={ this.renderData.bind(this)}
                enableEmptySections={true}
                automaticallyAdjustContentInsets={false}
                showsVerticalScrollIndicator={false}
                />
        );
        // let serviceListview = (<View></View>);
        // serviceListview = (
        //     <ListView
        //         refreshControl={
        //             <RefreshControl
        //                 refreshing={this.state.refreshing}
        //                 onRefresh={this._onRefresh.bind(this)} />
        //         }
        //         contentContainerStyle={styles.list}
        //         dataSource={this.state.dataSource2}
        //         renderRow={ this.renderService.bind(this)}
        //         enableEmptySections={true}
        //         automaticallyAdjustContentInsets={false}
        //         showsVerticalScrollIndicator={false}
        //         />
        // );

        return(
            <View style={{ marginBottom: 0}}>
                {/* {
                    Platform.OS === 'ios' ?
                    <Text style={{  textAlign: align, fontWeight : 'bold', margin : 10}}>{I18n.t('home.allitem', { locale: lang })}</Text>
                    :
                    <Text style={{  textAlign: align, fontWeight : 'bold', fontFamily :"halvetica", margin : 10}}>{I18n.t('home.allitem', { locale: lang })}</Text>
                } */}
                <View>
                    {listView}
                </View>
            </View>
        );

        if (this.state.arrSelectedType.length == 1) {
            if (this.state.arrSelectedType[0] == 1) {
                return(
                    <View style={{ marginBottom: 0}}>
                        {/* {
                            Platform.OS === 'ios' ?
                            <Text style={{  textAlign: align, fontWeight : 'bold', margin : 10}}>{I18n.t('home.allitem', { locale: lang })}</Text>
                            :
                            <Text style={{  textAlign: align, fontWeight : 'bold', fontFamily :"halvetica", margin : 10}}>{I18n.t('home.allitem', { locale: lang })}</Text>
                        } */}
                        <View>
                            {listView}
                        </View>
                    </View>
                );
                // console.log("product product product")
            } else {
                // console.log("service service service")
                return(
                    <View style={{ marginBottom: 0}}>
                        {/* {
                            Platform.OS === 'ios' ?
                            <Text style={{  textAlign: align, fontWeight : 'bold', margin : 10}}>{I18n.t('home.allservice', { locale: lang })}</Text>
                            :
                            <Text style={{  textAlign: align, fontWeight : 'bold', fontFamily :"halvetica", margin : 10}}>{I18n.t('home.allservice', { locale: lang })}</Text>
                        } */}
                        <View>
                            {serviceListview}
                        </View>
                    </View>
                );
            }
        }
        else if (this.state.arrSelectedType.length == 0 || this.state.arrSelectedType.length == 2) {
            return(
                this.state.isFilterProduct ?
                <View style={{ marginBottom: 0}}>
                    {/* {
                        Platform.OS === 'ios' ?
                        <Text style={{  textAlign: align, fontWeight : 'bold', margin : 10}}>{I18n.t('home.allitem', { locale: lang })}</Text>
                        :
                        <Text style={{  textAlign: align, fontWeight : 'bold', fontFamily :"halvetica", margin : 10}}>{I18n.t('home.allitem', { locale: lang })}</Text>
                    } */}
                    <View>
                        {listView}
                    </View>
                    {/* {
                        Platform.OS === 'ios' ?
                        <Text style={{  textAlign: align, fontWeight : 'bold', margin : 10}}>{I18n.t('home.allservice', { locale: lang })}</Text>
                        :
                        <Text style={{  textAlign: align, fontWeight : 'bold', fontFamily :"halvetica", margin : 10}}>{I18n.t('home.allservice', { locale: lang })}</Text>
                    } */}
                    <View>
                        {serviceListview}
                    </View>
                </View>
                :
                <View style={{ marginBottom: 0}}>
                    {/* {
                        Platform.OS === 'ios' ?
                        <Text style={{  textAlign: align, fontWeight : 'bold', margin : 10}}>{I18n.t('home.allservice', { locale: lang })}</Text>
                        :
                        <Text style={{  textAlign: align, fontWeight : 'bold', fontFamily :"halvetica", margin : 10}}>{I18n.t('home.allservice', { locale: lang })}</Text>
                    } */}
                    <View>
                        {serviceListview}
                    </View>
                    {/* {
                        Platform.OS === 'ios' ?
                        <Text style={{  textAlign: align, fontWeight : 'bold', margin : 10}}>{I18n.t('home.allitem', { locale: lang })}</Text>
                        :
                        <Text style={{  textAlign: align, fontWeight : 'bold', fontFamily :"halvetica", margin : 10}}>{I18n.t('home.allitem', { locale: lang })}</Text>
                    } */}
                    <View>
                        {listView}
                    </View>
                </View>
            );
        }
    }
    renderService(data, rowData: string, sectionID: number, rowID: number, index) {
        let color = data.special_price ? '#C5C8C9' : '#000';
        let textDecorationLine = data.special_price ? 'line-through' : 'none';
        const { lang} = this.props;
        let direction = (lang === 'ar') ? 'row-reverse' :'row',
        align = (lang === 'ar') ?  'right': 'left',
        service_name = (lang == 'ar')? data.service_name_in_arabic : data.service_name,
        short_description = (lang == 'ar')? data.short_description_in_arabic : data.short_description,
        detail_description = (lang == 'ar')? data.detail_description_in_arabic : data.detail_description,
        price = (lang == 'ar')? data.price_in_arabic : data.price,
        special_price = (lang == 'ar')? data.special_price_in_arabic : data.special_price;
        return (
            <View style={styles.row} >
                <View style={{flexDirection: direction, justifyContent: "center"}}>
                    <TouchableOpacity
                        onPress={()=> this.Description(data.service_id, service_name, data.serviceImages, short_description, detail_description, price ,special_price)}>
                        <LoadImage productImages={ data.productImages ? data.productImages : data.serviceImages} special_price={special_price}/>
                    </TouchableOpacity>
                </View>
                <View style={{ padding :15}}>
                    <TouchableOpacity  style={styles.name}
                        // onPress={()=>Actions.deascriptionPage({ product_id : data.product_id, is_wishlist : data.is_wishlist })}
                        >
                        <Text style={{fontSize : 15, color :'#989898' ,textAlign:align }}>{service_name}</Text>
                    </TouchableOpacity>
                    {/* <Text style={[styles.description, {textAlign:align }]}>{short_description}</Text> */}
                </View>
            </View>
        );
    }
    renderFilterOptions() {
        const { lang} = this.props;
        let direction = (lang === 'ar') ? 'row-reverse' :'row',
        align = (lang === 'ar') ?  'right': 'left';
        return(
            <View style={{ flexDirection : direction}}>
                <View style={ {
                        flex : 0.5,
                        height : 40,
                        justifyContent : "space-around",
                        backgroundColor : '#fff',
                        padding : 2}
                    }>
                    <TouchableOpacity onPress={this.modal} style={[styles.allshop, {flexDirection : direction}]} >
                        <Text style={{textAlign: align}}>{I18n.t('home.allshop', { locale: lang })}</Text>
                        <Ionicons name="md-arrow-dropdown" size={20} color="#a9d5d1" />
                    </TouchableOpacity>
                </View>
                <View style={{ flex : 0.5,
                        height : 40,
                        justifyContent : "space-around",
                        backgroundColor : '#fff',
                        padding : 2}
                    }>
                    <TouchableOpacity onPress={this.Service} style={[styles.allshop, {flexDirection : direction}]}>
                        <Text style={{textAlign: align}}>{I18n.t('home.services', { locale: lang })}</Text>
                        <Ionicons name="md-arrow-dropdown" size={20} color="#a9d5d1"/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    renderAllShopViews() {
        const { lang} = this.props;
        let direction = (lang === 'ar') ? 'row-reverse' :'row',
        align = (lang === 'ar') ?  'right': 'left',
        position = (lang === 'ar') ?  'left': 'right';
        return(
            <ModalWrapper
                containerStyle={{ flexDirection: direction, justifyContent: 'flex-end' }}
                onRequestClose={() => this.setState({ isModalVisible: false })}
                position={position}
                style={styles.sidebar}
                shouldAnimateOnRequestClose={true}
                visible={this.state.isModalVisible}>
                <View style={{height: Platform.OS === 'ios' ? 60 : 54,flexDirection : direction ,alignItems:'center',justifyContent : 'space-between',backgroundColor:'#a9d5d1'}}>
                    <Text>{null}</Text>
                    <Text style={Platform.OS === 'ios' ?  {fontSize:15, color:'#fff',marginTop:10 } : {fontSize:15, color:'#fff' }}>{I18n.t('home.shop', { locale: lang })}</Text>
                    <TouchableOpacity underlayColor ={"#fff"} onPress={()=>this.filterbyShop()} >
                        <Text style={Platform.OS === 'ios' ? {color:'#fff', marginTop:10,marginRight:10, textAlign: align} : {color:'#fff',marginLeft:10, marginRight:10, textAlign: align}}>{I18n.t('home.done', { locale: lang })}</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}>
                    {/* <TouchableOpacity onPress={this.onClickAllShop.bind(this)} style={{ flexDirection:(lang === 'ar') ? 'row' :'row-reverse', justifyContent:(lang === 'ar') ? 'space-between': 'flex-end', alignItems:'center'}}> */}
                        {/* <Text style={{ padding : 10}}>{I18n.t('home.allshop', { locale: lang })}</Text> */}
                        {!this.checkShopStatusSelected() ?
                            // undefined
                            <CheckBox
                                style={{borderTopWidth : 0, borderColor : '#ccc', width : width-50}}
                                leftTextStyle = {{padding:10, paddingLeft:10, fontWeight:'bold'}}
                                onClick={()=>this.onClickAllShop()}
                                isChecked={false}
                                leftText={I18n.t('home.allshop', { locale: lang })}
                                lang={lang}
                            />
                            // <Ionicons name="ios-uncheckmark" size={30} color="green"  style={(lang === 'ar') ?{ paddingRight : 10}: { paddingLeft : 10,}}/>
                            :
                            // <Ionicons name="ios-checkmark" size={30} color="green"  style={(lang === 'ar') ?{ paddingRight : 10}: { paddingLeft : 10,}}/>
                            <CheckBox
                                style={{borderTopWidth : StyleSheet.hairlineWidth, borderColor : '#ccc', width : width-50}}
                                leftTextStyle = {{padding:10, paddingLeft:10, fontWeight:'bold'}}
                                onClick={()=>this.onClickAllShop()}
                                isChecked={true}
                                leftText={I18n.t('home.allshop', { locale: lang })}
                                lang={lang}
                            />

            //                 <CheckBox
            //   label={rowdata.CategoryName}
            //   checked={rowdata.checkStatus}
            //   // onChange={(checked) => this.onValueChangeCheckBox(rowdata,checked)}
            //   onChange={(checked) => this.onValueChangeCheckBox(rowdata,checked,sectionID,rowID)}
            //   containerStyle={{
            //     width:DEVICE_WIDTH-20,
            //     height:40,
            //     // backgroundColor:'red'
            //   }}
            // />
                        }
                    {/* </TouchableOpacity> */}
                    {this.renderView()}
                </ScrollView>
            </ModalWrapper>
        );
    }

    checkShopStatusSelected() {
        var isTrue = true
        for (j = 0; j < this.state.dataArray.length; j++) {
            var isInnerTrue = false
            for (i = 0; i < this.state.rows.length; i++) {
                if (this.state.dataArray[j].u_id == this.state.rows[i]) {
                    isInnerTrue = true
                }
            }
            if (isInnerTrue == false) {
                isTrue = false
                break
            }
        }
        console.log("isTrue:=",isTrue)
        return isTrue
    }

    onClickAllShop() {
        console.log("onClickAllShop clicked")
        console.log("this.state.dataArray:=",this.state.dataArray)
        console.log("this.state.rows:=",this.state.rows)
        if (this.state.rows.length == this.state.dataArray.length) {
            var dataBackUp = []
            for (i = 0; i < this.state.dataArray.length; i++) {
                this.state.dataArray[i].checked = false
            }
            console.log("false:=",this.state.dataArray)
            dataBackUp = this.state.dataArray.slice()
            this.setState({
                rows:[],
                dataArray:[]
            })

            var that = this;
            setTimeout(function() {
                that.reloadShop(dataBackUp)
            }, 50);
        }
        else {
            var arr = []
            for (i = 0; i < this.state.dataArray.length; i++) {
                arr.push(this.state.dataArray[i].u_id)
                this.state.dataArray[i].checked = true
            }
            console.log("arr:=",arr)
            var dataBackUp = []
            dataBackUp = this.state.dataArray.slice()
            this.setState({
                rows:arr,
                dataArray:[]
            })

            var that = this;
            setTimeout(function() {
                that.reloadShop(dataBackUp)
            }, 50);
        }
    }

    reloadShop(data) {
        console.log("data:=",data)
        this.setState({
            dataArray:data
        })
    }

    renderAllServiceViews() {
        const { lang} = this.props;
        let direction = (lang === 'ar') ? 'row-reverse' :'row',
        align = (lang === 'ar') ?  'right': 'left',
        position = (lang === 'ar') ?  'left': 'right';
        return(
            <ModalWrapper
                containerStyle={{ flexDirection: direction, justifyContent: 'flex-end' }}
                onRequestClose={() => this.setState({ isService: false })}
                position={position}
                style={styles.sidebar}
                shouldAnimateOnRequestClose={true}
                visible={this.state.isService}>
                <View style={{ height:Platform.OS === 'ios' ? 60 : 54, flexDirection : direction, alignItems:'center', justifyContent : 'space-between', backgroundColor:'#a9d5d1'}}>
                    <Text>{null}</Text>
                    <Text style={Platform.OS === 'ios' ?  {fontSize:15, color:'#fff',marginTop:10, textAlign: align} : {fontSize:15, color:'#fff',textAlign: align }}>{I18n.t('home.service', { locale: lang })}</Text>
                    <TouchableOpacity underlayColor ={"#fff"} onPress={()=>this.filterbyService()} >
                        <Text style={Platform.OS === 'ios' ? {color:'#fff', marginTop:10, marginRight:10 ,textAlign: align} : {color:'#fff', marginRight:10,  marginLeft:10, textAlign: align}}>{I18n.t('home.done', { locale: lang })}</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    {/* <TouchableOpacity onPress={this.onClickAllService.bind(this)} style={{ flexDirection:(lang === 'ar') ? 'row' :'row-reverse', justifyContent:(lang === 'ar') ? 'space-between': 'flex-end', alignItems:'center'}}> */}
                        {/* <Text style={{ padding : 10, textAlign: align}}>{I18n.t('home.allservice', { locale: lang })}</Text> */}
                            {!this.checkServiceStatusSelected() ?
                                // undefined
                                <CheckBox
                                    style={{borderTopWidth : 0, borderColor : '#ccc', width : width-50}}
                                    leftTextStyle = {{padding:10, paddingLeft:10, fontWeight:'bold'}}
                                    onClick={()=>this.onClickAllService()}
                                    isChecked={false}
                                    leftText={I18n.t('home.allservice', { locale: lang })}
                                    lang={lang}
                                />
                                :
                                // <Ionicons name="ios-checkmark" size={30} color="green"  style={(lang === 'ar') ?{ paddingRight : 10}: { paddingLeft : 10}}/>
                                <CheckBox
                                    style={{borderTopWidth : 0, borderColor : '#ccc', width : width-50}}
                                    leftTextStyle = {{padding:10, paddingLeft:10, fontWeight:'bold'}}
                                    onClick={()=>this.onClickAllService()}
                                    isChecked={true}
                                    leftText={I18n.t('home.allservice', { locale: lang })}
                                    lang={lang}
                                />
                            }
                    {/* </TouchableOpacity> */}
                    {console.log("countinue")}
                    {this.renderServiceView()}
                </ScrollView>
            </ModalWrapper>
        )
    }

    checkServiceStatusSelected() {
        var isTrue = true
        for (j = 0; j < this.state.serviceArray.length; j++) {
            var isInnerTrue = false
            for (i = 0; i < this.state.servicerows.length; i++) {
                if (this.state.serviceArray[j].service_id == this.state.servicerows[i]) {
                    isInnerTrue = true
                }
            }
            if (isInnerTrue == false) {
                isTrue = false
                break
            }
        }
        console.log("isTrue:=",isTrue)
        return isTrue
    }

    onClickAllService() {
        console.log("onClickAllService clicked")
        console.log("this.state.serviceArray:=",this.state.serviceArray)
        console.log("this.state.rows:=",this.state.servicerows)
        if (this.state.servicerows.length == this.state.serviceArray.length) {
            var dataBackUp = []
            for (i = 0; i < this.state.serviceArray.length; i++) {
                this.state.serviceArray[i].checked = false
            }
            console.log("false:=",this.state.serviceArray)
            dataBackUp = this.state.serviceArray.slice()
            this.setState({
                servicerows:[],
                serviceArray:[]
            })

            var that = this;
            setTimeout(function() {
                that.reloadService(dataBackUp)
            }, 50);
        }
        else {
            var arr = []
            for (i = 0; i < this.state.serviceArray.length; i++) {
                arr.push(this.state.serviceArray[i].service_id)
                this.state.serviceArray[i].checked = true
            }
            console.log("arr:=",arr)
            var dataBackUp = []
            dataBackUp = this.state.serviceArray.slice()
            this.setState({
                servicerows:arr,
                serviceArray:[]
            })

            var that = this;
            setTimeout(function() {
                that.reloadService(dataBackUp)
            }, 50);
        }
    }

    reloadService(data) {
        console.log("data:=",data)
        this.setState({
            serviceArray:data
        })
    }


       // service  filter
    Service = () => this.setState({ isService: !this.state.isService })
    loadServiceData (){
        const {u_id, country} = this.props;
        let formData = new FormData();
        if (u_id) {
            formData.append('u_id', String(u_id));
        }
        // formData.append('u_id', String(u_id));
        formData.append('country', String(country));
        // formData.append('u_id', String(user_type));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        }
        fetch(Utils.gurl('serviceList'), config)
        .then((response) => response.json())
        .then((responseData) => {
            this.setState({
                serviceArray: responseData.data,
                serviceArrayStatus : responseData.status
            });
        })
        .catch((error) => {
            console.log(error);
        })
        .done();
    }
    filterbyService () {
        console.log("filterbyService filterbyService filterbyService", this.state.servicerows.length )
        if (this.state.servicerows.length == 0) {
            this.state.isService = !this.state.isService
            this.state.isFilterProduct = false
            this.fetchService()
            return
        }
        this.setState({
            isService: !this.state.isService,
            loaded : false,
            isFilterProduct : false
        },this.fetchDataByService())
    }
    fetchDataByService (){
        const {
            user_type, servicerows } = this.state;
        const { u_id, country} = this.props;
        let formData = new FormData();
        formData.append('service_id', servicerows.toString());
        formData.append('country', String(country));
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
            }
            console.log("request filterByService:=",config)
        fetch(Utils.gurl('filterByService'), config)
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.status){
                var arrTmp = responseData.data
                var merge = []
                if (this.state.arrSelectedType.length == 0 || this.state.arrSelectedType.length == 2) {
                    if (this.state.arrProductList.length > 0) {
                        if (arrTmp.length > 0) {
                            merge = arrTmp.concat(this.state.arrProductList)
                        }
                    }
                }
                else {
                    if (this.state.arrSelectedType[0] == 1) {
                        if (this.state.arrProductList.length > 0) {
                            merge = this.state.arrProductList
                        }
                    }
                    else {
                        if (arrTmp.length > 0) {
                            merge = arrTmp
                        }
                    }
                }

                console.log("arrTmp:=",arrTmp)
                console.log("merge:=",merge)
                this.setState({
                    arrServiceList: responseData.data,
                    // dataSource2: this.state.dataSource2.cloneWithRows(arrTmp),
                    dataSource: this.state.dataSource.cloneWithRows(merge),
                    status : responseData.status,
                    loaded: true,
                    refreshing: false
                });
            } else {
                console.log("status false")
                this.setState({
                    isLoading : false,
                    status : responseData.status,
                    loaded: true,
                    refreshing: false
                })
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .done();
    }
    onServiceClick(data) {
        data.checked = !data.checked;
        data.checked ? this.checkService(data) : this.unCheckService(data)
        let msg=data.checked? 'you checked ':'you unchecked '
    }
    checkService (data){
        console.log("this.state.rows:=",this.state.servicerows)
        var newStateArray = this.state.servicerows.slice();
        console.log("newStateArray:=",newStateArray)

        newStateArray.push(data.service_id);
        this.setState({
            servicerows: newStateArray,
        });
    }
    unCheckService(data){
        var newStateArray = this.state.servicerows.slice();
        var index = newStateArray.indexOf(data.service_id);
        console.log("index:=",index)
        if (index > -1) {
            newStateArray.splice(index, 1);
        }
        this.setState({
            servicerows: newStateArray
        });
    }
    cancelService(){
        this.setState({
            isService : !this.state.isService
        })
    }
    renderServiceView() {
        if (!this.state.serviceArray || this.state.serviceArray.length === 0)return;
        var len = this.state.serviceArray.length;
        var views = [];
        for (var i = 0, l = len - 2; i < l; i += 2) {
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {this.renderServiceChec(this.state.serviceArray[i])}
                        {this.renderServiceChec(this.state.serviceArray[i + 1])}
                    </View>
                </View>
            )
        }
        views.push(
            <View key={len - 1}>
                <View style={styles.item}>
                    {len % 2 === 0 ? this.renderServiceChec(this.state.serviceArray[len - 2]) : null}
                    {this.renderServiceChec(this.state.serviceArray[len - 1])}
                </View>
            </View>
        )
        return views;
    }
    noServiceFound(){
        return (
            <View style={{ flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                <Text> {I18n.t('home.noitem', { locale: lang })}</Text>
            </View>
        );
    }
    renderServiceChec(data) {
        const { lang } = this.props;
        if (!this.state.serviceArrayStatus) {
            return this.noServiceFound();
        }
        var leftText = data.service_name;
        return (
            <CheckBox
                style={{borderTopWidth : StyleSheet.hairlineWidth, borderColor : '#ccc', width : width-50}}
                leftTextStyle = {{padding:10}}
                onClick={()=>this.onServiceClick(data)}
                isChecked={data.checked}
                leftText={leftText}
                lang={lang}
                />
        );
    }
    moveToDesc(title, product_id, is_wishlist){
        Actions.deascriptionPage({
            title: title,
            product_id : product_id ,
            is_wishlist : is_wishlist,
            updateState : this._onRefresh.bind(this)
        })
    }
    noItemFound(){
        const { lang , deviceId, country, u_id} = this.props,
        align = (lang === 'ar') ?  'right': 'left',
        side = (lang === 'ar') ?  'right': 'left';
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
                        <Image source={require('../images/login_img.png')} style={{height: 25, width: '20%', alignSelf: 'center', marginTop:Platform.OS === 'ios' ? 10 : 0}}
                            resizeMode = 'contain'
                            resizeMethod = 'resize'/>
                        {this._renderRightButton()}
                    </View>
                    <View style={{ flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                        {this.renderFilterOptions()}
                        {this.renderAllShopViews()}
                        {this.renderAllServiceViews()}
                        <Text style={{marginTop:10, textAlign: align}}>{I18n.t('home.noitem', { locale: lang })}</Text>
                    </View>
                </View>
            </Drawer>
        );
    }
// Service filter complete here
    renderData(data, rowData: string, sectionID: number, rowID: number, index) {
        console.log("data:=",data,"rowData:=",rowData)

        if ("product_id" in data) {
            const { lang , deviceId, country, u_id} = this.props;
            let color = data.special_price ? '#696969' : '#000';
            let textDecorationLine = data.special_price ? 'line-through' : 'none';
            let url =  data.productImages[0] ? data.productImages[0].image : "null";
            let direction = (lang === 'ar') ? 'row-reverse' :'row',
            align = (lang === 'ar') ?  'right': 'left',
            product_name = (lang == 'ar')? data.product_name_in_arabic : data.product_name,
            short_description = (lang == 'ar')? data.short_description_in_arabic : data.short_description,
            detail_description = (lang == 'ar')? data.detail_description_in_arabic : data.detail_description,
            price = (lang == 'ar')? data.price_in_arabic : data.price,
            special_price = (lang == 'ar')? data.special_price_in_arabic : data.special_price;
            return (
                <View style={styles.row} >
                    <View style={{flexDirection: direction , justifyContent: "center"}}>
                        <TouchableOpacity
                        onPress={()=> this.moveToDesc(product_name, data.product_id, data.is_wishlist)}>
                            <LoadImage productImages={data.productImages} special_price={special_price}/>
                        </TouchableOpacity>
                        <EvilIcons style={{ position : 'absolute', left : 5, top:5, alignSelf: 'flex-start', backgroundColor : 'transparent'}}
                            name="share-google"
                            size={25}
                            color="#a9d5d1"
                            onPress={()=>this.onOpen(product_name, data.product_id , url )}/>
                        <Editwish
                            u_id={u_id}
                            country={country}
                            is_wishlist={data.is_wishlist}
                            product_id={data.product_id}
                            fetchData={()=> this.state.data.length() > 0 ? this.fetchDataByShop() : this.fetchData()}
                            deviceId={deviceId}
                            lang={lang}/>
                    </View>
                    <View style={{ padding :10}}>
                        <TouchableOpacity  style={styles.name}
                        onPress={()=> this.moveToDesc(product_name, data.product_id, data.is_wishlist)}
                        >
                        <Text style={{fontSize : 15, color :'#989898', textAlign: align }}>{product_name}</Text>
                        </TouchableOpacity>
                        {/* <View style={{ marginTop : 10}}>
                            <Header
                            product_category= {data.product_category}
                            u_id={u_id}
                            country={country}
                            lang={lang}/>
                        </View> */}
                    </View>
                </View>
            );
        }
        else {
            let color = data.special_price ? '#C5C8C9' : '#000';
            let textDecorationLine = data.special_price ? 'line-through' : 'none';
            const { lang} = this.props;
            let direction = (lang === 'ar') ? 'row-reverse' :'row',
            align = (lang === 'ar') ?  'right': 'left',
            service_name = (lang == 'ar')? data.service_name_in_arabic : data.service_name,
            short_description = (lang == 'ar')? data.short_description_in_arabic : data.short_description,
            detail_description = (lang == 'ar')? data.detail_description_in_arabic : data.detail_description,
            price = (lang == 'ar')? data.price_in_arabic : data.price,
            special_price = (lang == 'ar')? data.special_price_in_arabic : data.special_price;
            return (
                <View style={styles.row} >
                    <View style={{flexDirection: direction, justifyContent: "center"}}>
                        <TouchableOpacity
                            onPress={()=> this.Description(data.service_id, service_name, data.serviceImages, short_description, detail_description, price ,special_price)}>
                            <LoadImage productImages={ data.productImages ? data.productImages : data.serviceImages} special_price={special_price}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{ padding :15}}>
                        <TouchableOpacity  style={styles.name}
                            // onPress={()=>Actions.deascriptionPage({ product_id : data.product_id, is_wishlist : data.is_wishlist })}
                            >
                            <Text style={{fontSize : 15, color :'#989898' ,textAlign:align }}>{service_name}</Text>
                        </TouchableOpacity>
                        {/* <Text style={[styles.description, {textAlign:align }]}>{short_description}</Text> */}
                    </View>
                </View>
            );
        }


    }
}
class Header extends Component{
    constructor(props){
        super(props);
        this.state = {
            product_category : [],
            isLoading : true
        }
    }
    componentDidMount(){
        this.fetchData();
    }
    search = (nameKey, myArray)=>{
        for (var i = 0; i < myArray.length; i++) {
            if (myArray[i].category_id === nameKey) {
                return myArray[i].category_name;
            }
        }
    }
    fetchData(){
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
        fetch(Utils.gurl('getFilterMenu'), config)
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.status){
                this.setState({
                    product_category: responseData.data.category,
                });
            }else{
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
        const { lang } = this.props;
        let product_id = this.props.product_category;
        let product = this.state.product_category
        let resultObject = this.search(product_id, product);
        return (
            <Text style={[styles.category, {textAlign:(lang === 'ar') ?  'right': 'left'}]}>
                { this.state.product_category ? resultObject: undefined}
            </Text>
        );
    }
}
var styles = StyleSheet.create({
    contentContainer: {
        paddingVertical: 10
    },
    container: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    list: {
        // borderWidth: 1,
        // borderColor: '#CCC',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    centering: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    name : {
        marginTop : 5
    },
    description : {
        marginTop : 15,
        fontSize : 15
    },
    special_price : {
        fontSize : 10,
        fontWeight : 'bold',
        color : '#989898'
    },
    footer : {
        width : width/2-20,
        alignItems : 'center',
        padding : 10,
        borderTopWidth : 0.5,
        borderColor :'#ccc',
        borderLeftWidth : 0.5
    },
    allshop :{
        flex:1,
        justifyContent : "space-around",
        borderWidth : StyleSheet.hairlineWidth,
        borderColor: "#ccc",
        alignItems: 'center'
    },

    row: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        width : width/2 -6,
        // padding: 5,
        margin: 3,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius : 5,
    },
    button: {
        width: width/2,
        marginBottom: 10,
        padding: 10,
        alignItems: 'center',
        borderWidth : 0.5,
        borderColor : '#CCC'
    },

    thumb: {
        width: width/2-10,
        height: height/3,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        // resizeMode : 'center',
        top : StyleSheet.hairlineWidth
    },

    text: {
        flex: 1,
        marginTop: 5,
        fontWeight: 'bold'
    },
    category:{
        color :'#000',
        fontSize : 15
    },
    sidebar :{width:'80%'}
});
const drawerStyles = {
  drawer: { backgroundColor:'#fff', shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
  main: {
      // paddingLeft: 3,
      backgroundColor:'transparent'
  },
}

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


const REACT_ICON = 'data:image/png;base64,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"Twitter"OioloT5whi8OytnuNckdjcN1xsNf5GJJZUcvUx4Z4kiY/2bM4y7GSQD89o6lr/76/ADieX0z6KAMvpyX+bHDzw9XaGQLbvg79kztflQ0112js3DsFKbmPEiepTOHqe0fAQNQLKs73z4njUnk+WMPgJApx5SpLzgu4d9Pqo/SUBlHPzeLovhcCDkqAQQqK1C/p8/9IcRHuUmaVrs8QvUwrFMuMYcpsaDG4BhZA554KxepLw+w6ItV+NKNQ02yNAE8bOInSrNQpjyHVAjim7y8ASaPuBJwyuQRIkqMayrtwTALI5HCwJQpGlJNDF4uivLc6V0LUgA7QwgzaRenKSB4RJ6TeFw7LqvwD65qnWXFp6kEYhtmrrJUWcUDftwKY4NlyP1VYAWen1gcWo5w3YImMFiSLYxeVlnCpTEc5MeAHsGrFD8DVMKyicCecMe7VqTyfcwW4cpaM/esDPbhquC41XfUL4JKAJ5C5fSwNUqxe3ziv0PTeCvLkufelMLD9/XpB70fAtpZHlIx5CApa0oqY6d6t4A+aUxuwMIaDceHJ4MBPTTSTh129gHSDK8cL8QGMowk+NaK4RDsYNpnMqqEhmbQryYQyJdBHhpTNq7AqWy9TAjfx8flBVE1cxZJUdr+EiX0Rkj9QoGePAYfQWBTIPNKPvoUxojQj4zYJSbBWMS0yld1bagMQIgs/n6kwBT8EUiju1ugwl8BHoWhiiUwa3W1wuY8Z0rjNUAvBW4PXv39hvOypILcuYvSCDuKchfJ6NdGY8SuohLG2fXssDheO/i3gqKOYUILSZjGo8MPsfMlyMj2yVK4lZuN93oih0pdMnLmL+uUoahQdbNRMY7Inzu8LnHOaVcDCGkfyWMlkACXvXis0B89DUqXpnFwSy4fUb29SaO291bWSkTZGZlo12MBs1y/oqJqnSAx5pjbQQGtdnVw84doAMFSmZV1T0Vk3p20rmvw/yMTRiKqgMsl0EtC+um0R2D+uKGE6FnxW0MtogZevyywEVG5MEHsIBrSr0s31T8clrGL4kFE3TgfXhYcBYCKG+Ykin0SzjNO9ubp3JanUbKEwvyDzEVhR9GvMjQRe4tFweulk7q4u1ClpX4rvmUNKec01WczxfsX5KlOrM86w0CQRlhCcQmaLiX5SxxeRKWPA1XszwNBZjak5bdqGPg/fvQrpVYwtWAUq2Lx4hHSJY0Nz+3hnsx5iKwEoBVROEbWSDxCcyJ/SmfdhxG7ifPqnkI5turfSoE/0K5p2lMcrIG5Filmclgy7a01Qrerm+q8ycu6bPtvpKMN2R9M10WfvDjuuFhlN7dsbNd1wbpdRyVvXdYsd5b1gZDqTE58oB+fe6TOEFGJ+h1YssppvApU9R2oUidDb8dJn/iQKOsVZhDlKoZVm7X30HgvKkAhRk/8RAlBfmdYAxsuLSMznKyZdsIDTHwcFspGUvLSBE9bK/rQADvepX+0K09glFX/WGZJa/aBe06QT5EDfedOqRTnHWbOmeB5cQQw1S5IPSLetEJsC05cTf0S6u1WSwnX1xH8OzyLH/NNgN+u1bmJmEuUMGFlm7SkwhVlcb89bCsIIU0yBQphlulhOpARXTu/TkmWxqo1l9BMcy3caObJEQODIFDRITVuEyiyWuBxJH+yR7POQr3qrt3qrt3qrt3qrt3qrt3qrt3rrQ+3/ATxSgu3z5tTfAAAAAElFTkSuQmCC';

class LoadImage extends Component {
    constructor(props) {
        super(props);
        this.state={
            loaded: false
        }
    }
    render(){
        var imgUrl =  this.props.productImages[0] ? this.props.productImages[0].image : "null"

        return (
            imgUrl == "null" ?
            <IconBadge
                MainElement={
                    <Image style={[styles.thumb, { alignSelf: 'center',}]}
                        resizeMode = "center"
                        resizeMethod = 'resize'
                        source={require('../images/no-image.jpg')}
                        onLoadEnd={() => { this.setState({ loaded: true }); }}
                        />
                }
                BadgeElement={
                    <Text style={{color:'#FFFFFF'}}>{this.props.special_price} KWD</Text>
                }
                IconBadgeStyle={
                    {
                        opacity: 0.5,
                        top:height/3-20,
                        left : width/4,
                        borderRadius: null,
                        backgroundColor: '#000'
                    }
                }
                Hidden={this.state.BadgeCount==0}
                />
            :
            <IconBadge
                MainElement={
                    <Image style={[styles.thumb, { alignSelf: 'center',}]}
                        resizeMode="stretch"
                        resizeMethod="resize"
                        // resizeMode = {"contain"}
                        // resizeMethod = 'resize'
                        source={this.state.loaded ? { uri : this.props.productImages[0] ? this.props.productImages[0].image : "" }: require('../images/marketing_img_active.png')}
                        onLoadEnd={() => { this.setState({ loaded: true }); }}
                        />
                }
                BadgeElement={
                    <Text style={{color:'#FFFFFF'}}>{this.props.special_price} KWD</Text>
                }
                IconBadgeStyle={
                    {
                        opacity: 0.5,
                        top:height/3-20,
                        left : width/4,
                        borderRadius: null,
                        backgroundColor: '#000'
                    }
                }
                Hidden={this.state.BadgeCount==0}
                />
        )
    }
}
function mapStateToProps(state) {
    return {
        lang: state.auth.lang,
        country: state.auth.country,
        u_id: state.identity.u_id,
        deviceId: state.auth.deviceId,
        isGuest: state.auth.isGuest,
    }
}
export default connect(mapStateToProps)(MainView);
