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

} from 'react-native';
import {Actions as routes} from "react-native-router-flux";
import Utils from 'app/common/Utils';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import {connect} from 'react-redux';
import I18n from 'react-native-i18n';

 const { width, height } = Dimensions.get('window')

class MyProduct extends Component {
   constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataSource : new ListView.DataSource({   rowHasChanged: (row1, row2) => row1 !== row2 }),
            u_id : null,
            country : null
        }
    }

    GetItem (flower_name) {
        alert(flower_name);
    }

    componentDidMount(){
        this.getKey()
        .then( ()=>this.fetchData())
    }
    componentWillMount() {
        routes.refresh({ right: this._renderRightButton });
    }
    _renderRightButton = () => {
        return null
    };
    async getKey() {
        try {
            const value = await AsyncStorage.getItem('data');
            var response = JSON.parse(value);
            this.setState({
                u_id: response.userdetail.u_id ,
                country: response.userdetail.country
            });
        } catch (error) {
            console.log("Error retrieving data" + error);
        }
    }
    fetchData(){
        const {u_id, country } = this.state;
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
        fetch(Utils.gurl('productList'), config)
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.status){
                this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseData.data),
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
    ListViewItemSeparator = () => {
        return (
            <View
              style={{
                height: .5,
                width: "100%",
              }}
            />
        );
    }

    Description (product_name, productImages ,short_description, detail_description, price ,special_price){
        routes.vendordesc({
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
        const { lang } =this.props,
        direction = lang == 'ar'? 'row-reverse': 'row',
        textline = lang == 'ar'? 'right': 'left';

        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, paddingTop: 20, justifyContent: 'center'}}>
                  <ActivityIndicator size="large" />
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
        return (
        <View style={{paddingBottom : 53}}>
            {listView}
        </View>
        );
    }
    renderData(data: string, sectionID: number, rowID: number, index) {
                let color = data.special_price ? '#a9d5d1' : '#000';
        let textDecorationLine = data.special_price ? 'line-through' : 'none';
        const { lang } =this.props,
        direction = lang == 'ar'? 'row-reverse': 'row',
        textline = lang == 'ar'? 'right': 'left';
        return (
            <View style={{
            width : width-30,
            flexDirection: 'column' ,
            marginTop : 2,
            borderWidth : 1,
            borderColor : "#ccc",
            borderRadius : 5,
            overflow: 'hidden'
        }}>
                <Header
                product_category= {data.product_category}
                u_id={this.state.u_id}
                country={this.state.country}
                lang={lang}
                />
                <TouchableOpacity style={{
                flexDirection: direction,
                backgroundColor : "#fff",
                borderBottomWidth : StyleSheet.hairlineWidth,
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
                    price: data.price,
                    special_price: data.special_price,
                    quantity: data.quantity,
                    size: data.size,
                    discount: data.discount,
                    final_price: data.final_price,
                    is_feature: data.is_feature,
                    productImages: data.productImages
                })}
                >
                    <Image style={[styles.thumb, {margin: 10}]}
                    resizeMode={"stretch"}
                    source={{ uri : data.productImages[0] ? data.productImages[0].image : null}}
                    />
                    <View style={{flexDirection: 'column', justifyContent : 'space-between'}}>
                        <Text style={ { color:'#222',fontWeight :'bold', marginTop: 10, textAlign: textline}} >  {data.product_name} </Text>
                        <Text style={{ fontSize : 12, color : '#222',  textAlign: textline}} > {data.short_description} </Text>
                        <View style={{ flexDirection : direction}}>
                            <Text style={{color:"#a9d5d1", fontSize: 12, textAlign: textline}}> {I18n.t('vendorproducts.quantity', { locale: lang })}</Text>
                            <Text style={{color:"#a9d5d1", fontSize: 12, textAlign: textline}}> :</Text>
                            <Text style={{color:"#a9d5d1", fontSize: 12, textAlign: textline}}> {data.quantity} </Text>
                        </View>
                        <View style={{ flexDirection : "column", justifyContent : 'space-between'}}>
                            <View style={{ flexDirection : direction}}>
                                <Text style={{color : '#fbcdc5', fontSize:12, textAlign: textline}} >{I18n.t('vendorproducts.price', { locale: lang })} </Text>
                                <Text style={{color : '#fbcdc5', fontSize:12, textAlign: textline}} >: </Text>
                                <Text style={{ color: '#222', fontSize:12,  textAlign: textline}}> {data.price} KWD</Text>
                            </View>
                            <View style={{ flexDirection : direction}}>
                                <Text style={{color : '#fbcdc5', fontSize:12, textAlign: textline}}>{I18n.t('vendorproducts.special_price', { locale: lang })}</Text>
                                <Text style={{color : '#fbcdc5', fontSize:12, textAlign: textline}}>:</Text>
                            <Text style={{ color: '#222', fontSize:12, textAlign: textline}}> {data.special_price} KWD</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection : direction}}>
                            <Text style={{color : '#fbcdc5', fontSize:12, textAlign: textline}}>{I18n.t('vendorproducts.status', { locale: lang })}</Text>
                            <Text style={{color : '#fbcdc5', fontSize:12, textAlign: textline}}>:</Text>
                           <Text style={{color: '#222',fontSize:12, textAlign: textline}}>{data.is_approved ? I18n.t('vendorproducts.aproved', { locale: lang }) : I18n.t('vendorproducts.pending', { locale: lang })} </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <Footer calllback={()=>this.Description(data.product_name, data.productImages ,
                    data.short_description, data.detail_description, data.price ,data.special_price)}
                    u_id={this.state.u_id}
                    country={this.state.country}
                    is_active = {data.is_active}
                    product_id= {data.product_id}
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
        fetch(Utils.gurl('getFilterMenu'), config)
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.status){
                this.setState({
                product_category: responseData.data.category,
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
    let product_id = this.props.product_category
    let product = this.state.product_category
    let resultObject = this.search(product_id, product);

    const { lang } =this.props,
    direction = lang == 'ar'? 'row-reverse': 'row',
    textline = lang == 'ar'? 'right': 'left';
    return (
      <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor:'#ccc', flexDirection: direction}}>
          <Text style={{ color : '#fbcdc5', padding: 10, textAlign: textline}}>{I18n.t('vendorproducts.categories', { locale: lang })}</Text>
              <Text style={{ color : '#fbcdc5', alignSelf: 'center'}}>:</Text>
        <Text style={{padding: 10, color:"#222", textAlign: textline}}>{ this.state.product_category ? resultObject: undefined}
        </Text>
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
    productActiveDeactive(product_id, approv_code){
        const {u_id, country } = this.props;
        let formData = new FormData();
        formData.append('u_id', String(u_id));
        formData.append('country', String(country));
        formData.append('product_id', String(product_id));
        formData.append('active_flag', String(approv_code));

        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
            }
        fetch(Utils.gurl('productActiveDeactive'), config)
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.status){
                this.props.calldata();
            }
            else{
                this.props.calldata();
            }
        })
        .catch((error) => {
            MessageBarManager.showAlert({
            message: "error while update data",
            alertType: 'warning',
            title:''
            })
        })
        .done();
    }
// componentWillReceiveProps(is_approved){
//     this.setState({
//         is_approved : this.props.is_approved
//     })
// }

    render(){
         let approved
        let approv_code
        if(this.props.is_active === '1'){
            approved = I18n.t('vendorproducts.deactivate', { locale: lang });
            approv_code = '0'
        }else {
            approved = I18n.t('vendorproducts.activate', { locale: lang });
            approv_code = '1'
        }
        const { lang } =this.props,
        direction = lang == 'ar'? 'row-reverse': 'row',
        textline = lang == 'ar'? 'right': 'left';
        return(
        <View style={[styles.bottom, { flexDirection: direction}]}>
                    <TouchableOpacity
                    style={[styles.lowerButton,{ backgroundColor : '#a9d5d1'}]}
                    onPress={this.props.calllback}>
                        <Text style={{ color :'#fff', fontSize: 12, textAlign: textline}}>{I18n.t('vendorproducts.preview', { locale: lang })}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.lowerButton, { backgroundColor : '#fbcdc5'}]}
                    onPress={()=>this.productActiveDeactive(this.props.product_id, approv_code)}>
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
        flexDirection: 'row',
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
    }
});

function mapStateToProps(state) {
    return {
        lang: state.auth.lang,
    }
}
export default connect(mapStateToProps)(MyProduct);
