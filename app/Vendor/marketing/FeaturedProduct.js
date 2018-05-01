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
    Switch
} from 'react-native';
import {Actions as routes} from "react-native-router-flux";
import Utils from 'app/common/Utils';
import I18n from 'react-native-i18n';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
const { width, height } = Dimensions.get('window')

export default class FeaturedProduct extends Component {
   constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource : new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2 }),
            dataSourceService : new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
            u_id : null,
            country : null,
            status : false
        }

    }
    GetItem (flower_name) {
        alert(flower_name);
    }
  componentWillReceiveProps(nextProps){
    this.setState({
        status : nextProps.status,
        isLoading : !nextProps.status,
        dataSource: this.state.dataSource.cloneWithRows(nextProps.data),
        dataSourceService: this.state.dataSourceService.cloneWithRows(nextProps.featureService)
    })
  }

    // componentDidMount(){
    //     this.getKey()
    //     .then( ()=>render())
    // }
    componentWillMount() {
        routes.refresh({ right: this._renderRightButton });
    }
    _renderRightButton = () => {
        return null
    };

    ListViewItemSeparator = () => {
        return (
            <View
              style={{
                height: .5,
                width: "100%",
                backgroundColor: "#CCC",
              }}
            />
        );
    }
    noItemFound(){
        const { lang} = this.props
        return (
            <View style={{ flex:1,  justifyContent:'center', alignItems:'center', marginVertical:10}}>
                <Text>{I18n.t('venderprofile.noFeatureItem', { locale: lang })}</Text>
            </View>
        );
    }
    render() {
        const { lang} = this.props,
        direction = lang == 'ar'? 'row-reverse': 'row',
        align = lang == 'ar'? 'flex-end': 'flex-start',
        textline = lang == 'ar'? 'right': 'left';
        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, paddingTop: 20}}>
                  <ActivityIndicator />
                </View>
            );
        }
        if (this.state.dataSource.getRowCount() === 0 && this.state.dataSourceService.getRowCount() === 0) {
            return this.noItemFound();
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

        let listViewService = (<View></View>);
        listViewService = (
               <ListView
                enableEmptySections={true}
                automaticallyAdjustContentInsets={false}
                showsVerticalScrollIndicator={false}
                dataSource={this.state.dataSourceService}
                renderSeparator= {this.ListViewItemSeparator}
                renderRow={this.renderDataService.bind(this)}/>
            );
            console.log("direction:= lang",direction, lang)
        return (
            
            <View style={{paddingBottom : 53}}>
                <Text style={{
                    fontWeight:'bold',
                    marginVertical: 5,
                    textAlign: textline,
                }}> {I18n.t('venderprofile.featuredProductTabCaption', { locale: lang })} :</Text>
                {listView}
                {/* Uncomment After Uploading on Appstore */}
                
                {this.props.featureService.length > 0 ?
                    <Text style={{
                        fontWeight:'bold',
                        marginVertical: 5,
                        textAlign: textline,
                    }}> {I18n.t('venderprofile.featuredServiceTabCaption', { locale: lang })} :</Text>
                    : undefined}
                {listViewService}
                
            </View>
        );
    }
    renderData(data: string, sectionID: number, rowID: number, index) {
        let color = data.special_price ? '#a9d5d1' : '#000';
        let textDecorationLine = data.special_price ? 'line-through' : 'none';
        const { lang, u_id, country} = this.props,
        direction = lang == 'ar'? 'row-reverse': 'row',
        align = lang == 'ar'? 'flex-end': 'flex-start',
        textline = lang == 'ar'? 'right': 'left',
        product_name = (lang == 'ar')? data.product_name_in_arabic : data.product_name,
        short_description = (lang == 'ar')? data.short_description_in_arabic : data.short_description,
        detail_description = (lang == 'ar')? data.detail_description_in_arabic : data.detail_description,
        price = (lang == 'ar')? data.price_in_arabic : data.price,
        special_price = (lang == 'ar')? data.special_price_in_arabic : data.special_price;
        return (
            <View style={{
                    width : width-30,
                    flexDirection: 'column' ,
                    marginTop : 2,
                    borderWidth : 1,
                    borderColor : "#ccc",
                    borderRadius : 5,
                    overflow:'hidden',
                    marginTop:5,
                }}>
                <Header product_id= {data.product_id} lang={lang}/>
                <TouchableOpacity style={{
                        flexDirection: direction,
                        backgroundColor : "#fff",
                        borderBottomWidth : 1,
                        borderColor : "#ccc",
                    }}
                    onPress={()=>routes.editproduct({
                        u_id : this.state.u_id,
                        country : this.state.country,
                        product_id: data.product_id,
                        product_category:data.product_category,
                        product_name: data.product_name,
                        detail_description: data.detail_description,
                        short_description: data.short_description,
                        product_name_in_arabic: data.product_name_in_arabic,
                        short_description_in_arabic: data.short_description_in_arabic,
                        detail_description_in_arabic: data.detail_description_in_arabic,
                        price: data.price,
                        special_price: data.special_price,
                        quantity: data.quantity,
                        size: data.size,
                        discount: data.discount,
                        final_price: data.final_price,
                        is_feature: data.is_feature,
                        productImages: data.productImages,
                        is_from_featureList: true,
                    })}>
                    <Image style={[styles.thumb, {margin: 10}]}
                        resizeMode={"stretch"}
                        source={{ uri : data.productImages[0] ? data.productImages[0].image : null}}
                        />
                    <View style={{flexDirection: 'column',}}>
                        <Text style={[styles.row, { color:'#000',fontWeight :'bold', textAlign: textline, marginTop:5}]} >{product_name}</Text>
                        <Text style={{ fontSize : 12, color : '#ccc', textAlign: textline, marginTop:5}} >{short_description} </Text>
                        <View style={{ flexDirection:direction, marginTop:5}}>
                            <Text style={[styles.row, { color:'#fbcdc5',fontWeight :'bold'}]} >{I18n.t('venderprofile.quantity', { locale: lang })}</Text>
                            <Text style={[styles.row, { color:'#fbcdc5',fontWeight :'bold'}]} > : </Text>
                            <Text style={[styles.row, { color:'#bbb',fontWeight :'bold'}]} >{data.quantity}</Text>
                        </View>
                        <View style={{ flexDirection : direction, justifyContent : 'space-between', marginBottom:10}}>
                            <View style={{ flexDirection : direction, marginTop:5}}>
                                <Text style={{color : '#fbcdc5', textAlign: textline}} >{I18n.t('venderprofile.price', { locale: lang })}</Text>
                                <Text style={{color : '#fbcdc5',textAlign: textline}} > : </Text>
                                <Text>{data.special_price}</Text>
                                <Text style={{ color: color, textDecorationLine: textDecorationLine, textAlign: textline}}> {data.price}</Text>
                            </View>
                            <Text style={{color : '#ccc', marginTop:5}} > KWD</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <Footer
                    inserted_date = {data.inserted_date} product_id = {data.product_id} u_id={u_id} country={country} lang={lang} is_feature = {data.is_feature}/>
            </View>
        );
    }

    renderDataService(data: string, sectionID: number, rowID: number, index) {
        console.log("renderDataService:=",data)
        let color = data.special_price ? '#a9d5d1' : '#000';
        let textDecorationLine = data.special_price ? 'line-through' : 'none';
        const { lang, u_id, country} = this.props,
        direction = lang == 'ar'? 'row-reverse': 'row',
        align = lang == 'ar'? 'flex-end': 'flex-start',
        textline = lang == 'ar'? 'right': 'left',
        product_name = (lang == 'ar')? data.service_name_in_arabic : data.service_name,
        short_description = (lang == 'ar')? data.short_description_in_arabic : data.short_description,
        detail_description = (lang == 'ar')? data.detail_description_in_arabic : ("detail_description" in data ? data.detail_description : "") ,
        price = (lang == 'ar')? data.price_in_arabic : data.price,
        special_price = (lang == 'ar')? data.special_price_in_arabic : data.special_price;
        return (
            <View style={{
                    width : width-30,
                    flexDirection: 'column' ,
                    marginTop : 2,
                    borderWidth : 1,
                    borderColor : "#ccc",
                    borderRadius : 5,
                    overflow:'hidden',
                    marginTop:5,
                }}>
                <HeaderService service_id= {data.service_id} lang={lang}/>
                <TouchableOpacity style={{
                        flexDirection: direction,
                        backgroundColor : "#fff",
                        borderBottomWidth : 1,
                        borderColor : "#ccc",
                    }}
                    onPress={()=>routes.editservice({
                        u_id : this.state.u_id,
                        country : this.state.country,
                        // product_id: data.product_id,
                        // product_category:data.product_category,
                        // product_name: data.product_name,
                        // detail_description: data.detail_description,
                        // short_description: data.short_description,
                        // product_name_in_arabic: data.product_name_in_arabic,
                        // short_description_in_arabic: data.short_description_in_arabic,
                        // detail_description_in_arabic: data.detail_description_in_arabic,
                        // price: data.price,
                        // special_price: data.special_price,
                        // quantity: data.quantity,
                        // size: data.size,
                        // discount: data.discount,
                        // final_price: data.final_price,
                        // is_feature: data.is_feature,
                        // productImages: data.productImages
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
                        serviceImages: data.serviceImages,
                        is_from_featureList: true,
                    })}>
                    <Image style={[styles.thumb, {margin: 10}]}
                        resizeMode={"stretch"}
                        source={{ uri : data.serviceImage.length > 0 ? data.serviceImage[0].image : ""}}
                        />
                    <View style={{flexDirection: 'column',}}>
                        <Text style={[styles.row, { color:'#000',fontWeight :'bold', textAlign: textline, marginTop:5}]} >{product_name}</Text>
                        <Text style={{ fontSize : 12, color : '#ccc', textAlign: textline, marginTop:5}} >{short_description} </Text>
                        <Text style={{ fontSize : 12, color : '#ccc', textAlign: textline, marginTop:5}} >{detail_description} </Text>
                        {/* <View style={{ flexDirection:direction, marginTop:5}}>
                            <Text style={[styles.row, { color:'#fbcdc5',fontWeight :'bold'}]} >{I18n.t('venderprofile.quantity', { locale: lang })}</Text>
                            <Text style={[styles.row, { color:'#fbcdc5',fontWeight :'bold'}]} > : </Text>
                            <Text style={[styles.row, { color:'#bbb',fontWeight :'bold'}]} >{data.quantity}</Text>
                        </View> */}
                        <View style={{ flexDirection : direction, justifyContent : 'space-between', marginBottom:10}}>
                            <View style={{ flexDirection : direction, marginTop:5}}>
                                <Text style={{color : '#fbcdc5', textAlign: textline}} >{I18n.t('venderprofile.price', { locale: lang })}</Text>
                                <Text style={{color : '#fbcdc5',textAlign: textline}} > : </Text>
                                <Text>{data.special_price}</Text>
                                <Text style={{ color: color, textDecorationLine: textDecorationLine, textAlign: textline}}> {data.price}</Text>
                            </View>
                            <Text style={{color : '#ccc', marginTop:5}} > KWD</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <FooterService
                    inserted_date = {data.inserted_date} service_id = {data.service_id} u_id={u_id} country={country} lang={lang} is_feature = {data.is_feature}/>
            </View>
        );
    }
}

class Header extends Component{
  render() {
      const { lang} = this.props,
      direction = lang == 'ar'? 'row-reverse': 'row',
      textline = lang == 'ar'? 'right': 'left';

    return (
      <View style={[
          styles.row, {
                borderBottomWidth: 0.5,
                borderColor:'#ccc',
                flexDirection: direction,
                paddingVertical:10,
              }]}>
          <Text style={{ color : '#fbcdc5', paddingLeft: 10, textAlign: textline}}>{I18n.t('venderprofile.productid', { locale: lang })}</Text>
          <Text style={{ color : '#fbcdc5', paddingLeft: 10,  textAlign: textline}}>: </Text>
          <Text style={[styles.welcome]}>{this.props.product_id }</Text>
      </View>
    );
  }
}

class HeaderService extends Component{
    render() {
        const { lang} = this.props,
        direction = lang == 'ar'? 'row-reverse': 'row',
        textline = lang == 'ar'? 'right': 'left';
  
      return (
        <View style={[
            styles.row, {
                  borderBottomWidth: 0.5,
                  borderColor:'#ccc',
                  flexDirection: direction,
                  paddingVertical:10,
                }]}>
            <Text style={{ color : '#fbcdc5', paddingLeft: 10, textAlign: textline}}>{I18n.t('venderprofile.serviceId', { locale: lang })}</Text>
            <Text style={{ color : '#fbcdc5', paddingLeft: 10,  textAlign: textline}}>: </Text>
            <Text style={[styles.welcome]}>{this.props.service_id }</Text>
        </View>
      );
    }
  }

class Footer extends Component{
    constructor(props){
        super(props);
        this.state = {
            toggled : false,
            is_feature : this.props.is_feature
        }
    }
    manageFeature(){
        const {u_id, country, product_id} = this.props;
        const {is_feature} = this.state;
        if(is_feature === "2"){
            this.setState({ is_feature : "1" })

            let form = new FormData();
        	form.append('u_id', String(u_id));
        	form.append('country', String(country));
            form.append('product_id',String(product_id));
            form.append('amount',"10");
            const config = {
           	    method: 'POST',
           	    headers: {
           	        'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data;'
                },
                body: form,
            }
            console.log("addToFeature Request:=",config)
            fetch(Utils.gurl('addToFeature'), config)
            .then((response) => response.json())
            .then((responseData) => {
                console.log("addToFeature Response:=",responseData)
                if(responseData.status){
                    let feature_id = responseData.data.feature_id;
                    let url = responseData.data.url;
                    routes.myfeaturefaturah({ uri : responseData.data.url, feature_id : responseData.data.feature_id, amout:10})
                }else{
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .done();
        }else if(is_feature == "1"){
            this.setState({ is_feature : "2" })
            let form = new FormData();
        	form.append('u_id', String(u_id));
        	form.append('country', String(country));
            form.append('product_id',String(product_id));
            const config = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data;'
                },
                body: form,
            }
            console.log("removeFromFeature Request:=",config)
            fetch(Utils.gurl('removeFromFeature'), config)
            .then((response) => response.json())
            .then((responseData) => {
                console.log("removeFromFeature Request:=",responseData)
                if(responseData.status){
                    MessageBarManager.showAlert({
                        message: I18n.t('venderprofile.productremovefeature', { locale: lang }),
                        alertType: 'alert',
                        title:''
                    })
                }else{
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .done();
        }
    }
    render(){
        const { is_feature } = this.state;
        const { lang, u_id, country, product_id } = this.props,
        direction = lang == 'ar'? 'row-reverse': 'row',
        textline = lang == 'ar'? 'right': 'left';
         let data = is_feature === "2" ? false : true
        return(
            <View style={[styles.bottom, {flexDirection: direction}]}>
                <Switch
                    // onTintColor="#00ff00"
                    thumbTintColor="#fff"
                    tintColor="#000"
                    onValueChange={ ()=> this.manageFeature()}
                    // onValueChange={ () => this.setState({ toggled: !this.state.toggled })}
                    value={data} />
                <View style={{flexDirection: direction}}>
                    <Text style={{ color :'#fbcdc5', fontSize : 12, alignSelf: 'center'}}>{I18n.t('venderprofile.displaydt', { locale: lang })}</Text>
                    <Text style={{ color :'#fbcdc5', fontSize : 12, alignSelf: 'center'}}> : </Text>
                    <Text style={{ color :'#000', fontSize : 12, alignSelf: 'center'}}>{this.props.inserted_date}</Text>
                </View>
            </View>
        )
    }
}

class FooterService extends Component{
    constructor(props){
        super(props);
        this.state = {
            toggled : false,
            is_feature : this.props.is_feature
        }
    }
    manageFeature(){
        const {u_id, country, service_id} = this.props;
        const {is_feature} = this.state;
        console.log("manageFeature from service",is_feature)
        if(is_feature === "2"){
            this.setState({ is_feature : "1" })

            let form = new FormData();
        	form.append('u_id', String(u_id));
        	form.append('country', String(country));
            form.append('service_id',String(service_id));
            form.append('amount',"10");
            const config = {
           	    method: 'POST',
           	    headers: {
           	        'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data;'
                },
                body: form,
            }
            console.log("Request addToFeatureService:=",config)
            fetch(Utils.gurl('addToFeatureService'), config)
            .then((response) => response.json())
            .then((responseData) => {
                console.log("Response addToFeatureService:=",responseData)
                if(responseData.status){
                    let feature_id = responseData.data.feature_id;
                    let url = responseData.data.url;
                    routes.myfeaturefaturah({ uri : responseData.data.url, feature_id : responseData.data.feature_id, amout:10})
                }else{
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .done();
        }else if(is_feature == "1"){
            this.setState({ is_feature : "2" })
            let form = new FormData();
        	form.append('u_id', String(u_id));
        	form.append('country', String(country));
            form.append('service_id',String(service_id));
            const config = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data;'
                },
                body: form,
            }
            console.log("Request removeFromFeatureService:=",config)
            fetch(Utils.gurl('removeFromFeatureService'), config)
            .then((response) => response.json())
            .then((responseData) => {
                console.log("Response removeFromFeatureService:=",responseData)
                if(responseData.status){
                    MessageBarManager.showAlert({
                        message: I18n.t('venderprofile.productremovefeature', { locale: lang }),
                        alertType: 'alert',
                        title:''
                    })
                }else{
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .done();
        }
    }
    render(){
        const { is_feature } = this.state;
        const { lang, u_id, country, product_id } = this.props,
        direction = lang == 'ar'? 'row-reverse': 'row',
        textline = lang == 'ar'? 'right': 'left';
         let data = is_feature === "2" ? false : true
        return(
            <View style={[styles.bottom, {flexDirection: direction}]}>
                <Switch
                    // onTintColor="#00ff00"
                    thumbTintColor="#fff"
                    tintColor="#000"
                    onValueChange={ ()=> this.manageFeature()}
                    // onValueChange={ () => this.setState({ toggled: !this.state.toggled })}
                    value={data} />
                <View style={{flexDirection: direction}}>
                    <Text style={{ color :'#fbcdc5', fontSize : 12, alignSelf: 'center'}}>{I18n.t('venderprofile.displaydt', { locale: lang })}</Text>
                    <Text style={{ color :'#fbcdc5', fontSize : 12, alignSelf: 'center'}}> : </Text>
                    <Text style={{ color :'#000', fontSize : 12, alignSelf: 'center'}}>{this.props.inserted_date}</Text>
                </View>
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
        flexDirection : 'row',
        justifyContent : 'space-between',
        backgroundColor : "#fff",
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
    }
});
