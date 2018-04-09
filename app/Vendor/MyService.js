import React, { Component } from 'react';
import {
    StyleSheet,
    ActivityIndicator,
    ListView,
    Text,
    View,
    Image,
    Platform,
    Dimensions,
    TouchableOpacity,
    AsyncStorage,
    TextInput
} from 'react-native';
import {Actions as routes} from "react-native-router-flux";
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import Utils from 'app/common/Utils';
import {connect} from 'react-redux';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import api from "app/Api/api";
import EventEmitter from "react-native-eventemitter";
const { width, height } = Dimensions.get('window')

class MyService extends Component {
   constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource : new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2 }),
            u_id : null,
            country : null,
            text: ''
        }
        this.arrayholder = [] ;
    }
    componentDidMount(){
        this.setState({
            dataSource: this.props.dataSource,
            isLoading : this.props.isLoading
        });
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            dataSource: nextProps.dataSource,
            isLoading : nextProps.isLoading
        });
    }
    componentWillMount() {
        routes.refresh({ right: this._renderRightButton, left: this._renderLeftButton , hideNavBar : true});
    }
    _renderLeftButton = () => {
         return(
             <Text style={{color : '#fff'}}></Text>
         );
     };
    _renderRightButton = () => {
        return(
            <Text style={{color : '#fff'}}></Text>
        );
    };
    ListViewItemSeparator = () => {
        return (
            <View
              style={{
                height: StyleSheet.hairlineWidth,
                width: "100%",
              }}
            />
        );
    }
    noItemFound(){
        const { lang} = this.props;
        return (
            <View style={{ justifyContent:'center', alignItems:'center'}}>
                <Text>{I18n.t('home.noitem', { locale: lang })}</Text>
            </View>
        );
    }

    Description (product_name, productImages ,short_description, detail_description, price ,special_price){
        routes.vendordesc(
            {
                title: product_name,
                product_name : product_name,
                productImages : productImages,
                short_description : short_description,
                detail_description : detail_description,
                price : price,
                special_price : special_price,
            }
        )
    }
    render() {
        const { lang } =this.props,
        direction = lang == 'ar'? 'row-reverse': 'row',
        textline = lang == 'ar'? 'right': 'left';
        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, paddingTop: 20}}>
                  <ActivityIndicator />
                </View>
            );
        }
        let listView = (<View></View>);
            listView = (
               <ListView
                enableEmptySections={true}
                automaticallyAdjustContentInsets={false}
                showsVerticalScrollIndicator={false}
                dataSource={this.state.dataSource}
                renderSeparator= {this.ListViewItemSeparator}
                renderRow={this.renderData.bind(this)}/>
            );
            let data = (this.state.dataSource.getRowCount() < 1) ? this.noItemFound() :listView
        return (
        <View style={{paddingBottom : 53, backgroundColor: 'rgba(248,248,248,1)'}}>
            {data}
        </View>
        );
    }
    renderData(data: string, sectionID: number, rowID: number, index) {
        const { lang} = this.props;
        let direction = (lang === 'ar') ? 'row-reverse' :'row',
        align = (lang === 'ar') ?  'right': 'left',
        textline = lang == 'ar'? 'right': 'left',
        service_name = (lang == 'ar')? data.service_name_in_arabic : data.service_name,
        short_description = (lang == 'ar')? data.short_description_in_arabic : data.short_description,
        detail_description = (lang == 'ar')? data.detail_description_in_arabic : data.detail_description,
        price = (lang == 'ar')? data.price_in_arabic : data.price,
        special_price = (lang == 'ar')? data.special_price_in_arabic : data.special_price;

        let color = data.special_price ? '#a9d5d1' : '#000';
        let textDecorationLine = data.special_price ? 'line-through' : 'none';
        return (
            <View style={{
                    width : width-30,
                    flexDirection: 'column' ,
                    marginTop : 2,
                    borderWidth : 1,
                    borderColor : "#ccc",
                    borderRadius : 5
                }}>
                <Header service_type= {data.service_type} lang={lang}/>
                <TouchableOpacity style={{
                        flexDirection: direction,
                        backgroundColor : "#fff",
                        borderBottomWidth : 1,
                        borderColor : "#ccc",
                    }}
                    onPress={()=>routes.editservice({
                        u_id : this.state.u_id,
                        country : this.state.country,
                        service_id: data.service_id,
                        service_type:data.service_type,
                        service_name: data.service_name,
                        service_name_in_arabic: data.service_name_in_arabic,
                        detail_description: data.detail_description,
                        short_description_in_arabic: data.short_description_in_arabic,
                        short_description: data.short_description,
                        detail_description_in_arabic: data.detail_description_in_arabic,
                        price: price,
                        special_price: special_price,
                        is_active: data.is_active,
                        is_weekend:data.is_weekend,
                        serviceImages: data.serviceImages
                    })}>

                    <Image style={[styles.thumb, {margin: 10}]}
                        resizeMode={"stretch"}
                        source={{ uri : data.serviceImages[0] ? data.serviceImages[0].image : null}}
                        />
                    <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                        <Text style={{ color:'#222',fontWeight :'bold', marginTop: 10, textAlign: textline}} > {service_name}</Text>
                            <View style={{ flexDirection : "column", justifyContent : 'space-between'}}>
                            <View style={{ flexDirection : direction}}>
                                <View style={{ flexDirection : direction}}>
                                    <Text style={{color:"#a9d5d1", fontSize: 12, textAlign: textline}}> {I18n.t('vendorservice.price', { locale: lang })}</Text>
                                    <Text style={{color:"#a9d5d1", fontSize: 12, textAlign: textline, alignSelf: 'center'}}> :</Text>
                                    <Text style={{ color: '#696969', fontSize: 10, alignSelf: 'center'}}>{price} KWD</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection : direction}}>
                                <View style={{ flexDirection : direction}}>
                                    <Text style={{color:"#a9d5d1", fontSize: 12, textAlign: textline}}> {I18n.t('vendorservice.spprice', { locale: lang })}</Text>
                                    <Text style={{color:"#a9d5d1", fontSize: 12, textAlign: textline}}> :</Text>
                                        <Text style={{color : '#696969', fontSize: 10,  alignSelf: 'center'}} >{data.special_price} KWD</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection : direction}}>
                                <View style={{ flexDirection : direction}}>
                                    <Text style={{color : '#696969', fontSize: 10}} >{I18n.t('vendorservice.status', { locale: lang })}</Text>
                                    <Text style={{color : '#696969', fontSize: 10}} >:</Text>
                                    <Text style={{color : '#696969', fontSize: 10,  alignSelf: 'center'}} >{data.is_approved}</Text>
                               </View>
                            </View>

                        </View>

                    </View>
                </TouchableOpacity>
                <Footer calllback={()=>this.Description(data.service_name, data.serviceImages ,
                    data.short_description, data.detail_description, data.price ,data.special_price)}
                    is_active = {data.is_active}
                    service_id= {data.service_id}
                    calldata = {()=>this.fetchData()}
                    lang={lang}/>
            </View>
        );
    }
}

class Header extends Component{
    constructor(props){
        super(props);
        this.state = {
            isLoading : true
        }
    }
    render() {
        const { lang } =this.props,
        direction = lang == 'ar'? 'row-reverse': 'row',
        textline = lang == 'ar'? 'right': 'left';
        return (
            <View style={[styles.row, { borderBottomWidth: 0.5, borderColor:'#ccc', flexDirection: direction}]}>
                <View style={{ flexDirection : direction, height: 40}}>
                    <Text style={{color:"#fbcdc5", fontSize: 12, textAlign: textline, alignSelf: 'center'}}> {I18n.t('vendorservice.categories', { locale: lang })}</Text>
                    <Text style={{color:"#a9d5d1", fontSize: 12, textAlign: textline ,  alignSelf: 'center'}}> :</Text>
                    <Text style={{ color:"#222", fontSize: 12,textAlign: textline, alignSelf: 'center'}}>{ this.props.service_type ? this.props.service_type: undefined} </Text>
                </View>
            </View>
        );
    }
}

class Footer extends Component{
    constructor(props){
        super(props);
        this.state = {
            is_active : this.props.is_active
        }
    }
    serviceActiveDeactive(service_id, approv_code){
        api.UpdateServiceStatus(service_id, approv_code)
        .then((responseData) => {
            if(responseData.response.status){
                EventEmitter.emit("serviceList")
            }else{
                EventEmitter.emit("serviceList")
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .done();
    }
    componentWillReceiveProps(){
        this.setState({
            is_active : this.props.is_active
        })
    }
    render(){
        const { lang } =this.props,
        direction = lang == 'ar'? 'row-reverse': 'row',
        textline = lang == 'ar'? 'right': 'left';
        let approved
        let approv_code
        if(this.state.is_active === '1'){
            approved = I18n.t('vendorservice.deactivate', { locale: lang });
            approv_code = '0'
        }else {
            approved = I18n.t('vendorservice.activate', { locale: lang });
            approv_code = '1'
        }
        return(
            <View style={[styles.bottom, {flexDirection: direction}]}>
                <TouchableOpacity
                    style={[styles.lowerButton,{ backgroundColor : '#a9d5d1'}]}
                    onPress={this.props.calllback}>
                    <Text style={{ color :'#fff', fontSize: 12}}>{I18n.t('vendorservice.previewbtn', { locale: lang })}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.lowerButton, { backgroundColor : '#fbcdc5'}]}
                    onPress={()=>this.serviceActiveDeactive(this.props.service_id, approv_code)}>
                    <Text style={{ color :'#fff', fontSize : 12, textAlign: textline}}>{approved}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        padding : 10
    },
    row: {
        marginTop : 1
    },
    qtybutton: {
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: 'center',
        borderWidth : 0.5,
        borderColor : "#ccc",
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
        countryIcon: {
        width : 40,
        height:40,
        padding :10
    },
    lowerButton :{
        // alignItems : 'center',
        borderWidth : 0.5,
        borderColor : "#ccc",
        padding : 5,
        borderRadius : 5
    },
    thumb: {
        width   : "20%",
        height  :width/5 ,
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
        justifyContent : 'space-between',
        backgroundColor : "transparent",
        padding : 5
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
    TextInputStyleClass:{
        height: 40,
        backgroundColor : "transparent"
    }
});
function mapStateToProps(state) {
    return {
        lang: state.auth.lang,
        country: state.auth.country,
        u_id: state.identity.u_id,
        deviceId: state.auth.deviceId,
    }
}
export default connect(mapStateToProps)(MyService);
