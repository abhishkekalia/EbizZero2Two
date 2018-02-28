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
    Picker
} from 'react-native';
import Utils from 'app/common/Utils';
import {connect} from 'react-redux';
import I18n from 'react-native-i18n'
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { MessageBarManager } from 'react-native-message-bar';
import  Countmanager  from './Countmanager';
import {Actions as routes} from "react-native-router-flux";
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';
import { material } from 'react-native-typography';
import EventEmitter from "react-native-eventemitter";

const { width, height } = Dimensions.get('window');

// const SHORT_LIST = ['Small', 'Medium', 'Large'];

class Shopingcart extends Component {
    constructor(props) {
        super(props);
        this.getKey = this.getKey.bind(this);
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
            u_id: null,
            product_id : '',
            user_type : null,
            selectSize : false,
            country : null,
            status : false
        };

    }
    componentDidMount(){
        this.getKey()
        .then(()=>this.fetchData())
        .done()

        EventEmitter.removeAllListeners("reloadCartlist");
        EventEmitter.on("reloadCartlist", (value)=>{
            console.log("reloadCartlist", value);
            this.fetchData()
        });

        EventEmitter.removeAllListeners("redirectToFaturah");
        EventEmitter.on("redirectToFaturah", (value)=>{
            console.log("redirectToFaturah", value);

            routes.myfaturah({ uri : value.uri, order_id : value.order_id, callback: this.callBackFitura})
        });
    }

    callBackFitura() {
        console.log("Callback from fitura")
    }

    componentWillMount() {
        routes.refresh({ left: this._renderLeftButton, right: this._renderRightButton,});
    }
    _renderLeftButton = () => {
         return(
             <Feather name="menu" size={20} onPress={()=> routes.drawerOpen()} color="#fff" style={{ padding : 10}}/>
         );
     };

   _renderRightButton = () => {
        return(
            <Text style={{color : '#fff'}}></Text>
        );
    };

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

    addtoWishlist(product_id){
        const {u_id, country, user_type } = this.state;

        let formData = new FormData();
        formData.append('u_id', String(u_id));
        formData.append('country', String(country));
        formData.append('product_id', String(product_id));
        const config = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data;',
                },
                body: formData,
            }
        fetch(Utils.gurl('addToWishlist'), config)
        .then((response) => response.json())
        .then((responseData) => {
            MessageBarManager.showAlert({
                message: responseData.data.message,
                alertType: 'alert',
                stylesheetWarning : { backgroundColor : '#ff9c00', strokeColor : '#fff' },
                animationType: 'SlideFromLeft',
                title:''
            })
        })
        .catch((error) => {
          console.log(error);
        })
        .done();
    }

    fetchData(){
        const {u_id, country, user_type } = this.state;

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
        fetch(Utils.gurl('cartList'), config)
        .then((response) => response.json())
        .then((responseData) => {
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
            }else {
                this.setState({
                    status : responseData.status
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

        if (!ShopingItems.length)
        {
            MessageBarManager.showAlert({
                message: "Please Select Items For Your Cart",
                alertType: 'alert',
                title:''
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
        if (this.validate()) {
            routes.AddressLists({
                order_detail : this.state.ShopingItems,
                SetToList :this.state.SetToList,
                totalAmount : this.state.subtotalamount
            })
        }
    }

    renderFooter(itemcount, totalamount, subtotalamount){
        const {lang} = this.props;
        return(
        <View
                style={{
                    flexDirection : "column",
                }}>
                <View
                    style={{
                        flexDirection : (lang == 'ar')? "row-reverse" :"row",
                        justifyContent: "space-between",
                        alignItems:'center',
                        padding : 5,
                        flex : 0}}>
                <Text style={{ textAlign: (lang == 'ar')? "right" : "left"}}>{I18n.t('cart.items', { locale: lang })}({itemcount})</Text>
                <Text style={{textAlign: (lang == 'ar')? "right" : "left"}}> KWD {totalamount}</Text>
                </View>
                <View
                    style={{
                        flexDirection : (lang == 'ar')? "row-reverse" :"row",
                        justifyContent: "space-between",
                        alignItems:'center',
                        padding : 5,
                        flex : 0}}>
                <Text style={{ color : "#87cefa", textAlign: (lang == 'ar')? "right" : "left"}} >{I18n.t('cart.crtsubtotal', { locale: lang })}</Text>
                <Text style={{ color : "#87cefa", textAlign: (lang == 'ar')? "right" : "left"}}> KWD {subtotalamount}</Text>
                </View>
            </View>


        )
    }
    noItemFound(){
        const {lang} = this.props;
        return (
            <View style={{ flexDirection:'column', justifyContent:'center', alignItems:'center', alignContent:'center',flex:1}}>
                <Text> {I18n.t('cart.noitem', { locale: lang })} </Text>
               </View> );
    }


    render() {
        const { itemcount, totalamount, subtotalamount } = this.state;
        const { lang } = this.props;

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
        </View>
        );
    }
    renderData( data, rowData: string, sectionID: number, rowID: number, index) {
        const{ lang}= this.props;
        let color = data.special_price ? '#a9d5d1' : '#000';
        let textDecorationLine = data.special_price ? 'line-through' : 'none';
        return (
            <View style={{
            flexDirection: 'column',
            marginTop : 2,
            borderWidth : StyleSheet.hairlineWidth,
            borderColor : "#ccc",
            borderRadius : 5}}>
                <View style={{
                flexDirection: 'row',
                backgroundColor : "transparent"}}>

                    <View style={{flexDirection: 'column', justifyContent : 'space-between'}}>
                        <View style={{ flexDirection:(lang == 'ar')? "row-reverse" :"row" , backgroundColor : "#fff", justifyContent : 'space-between', alignItems : 'center'}}>

                            <Image style={[styles.thumb, {margin: 10}]}
                            source={{ uri : data.productImages[0] ? data.productImages[0].image : null}}/>
                        <View style={{flexDirection : 'column'}}>
                                <Text style={{ fontSize:15, color:'#696969', marginBottom:5, textAlign: (lang == 'ar')? "right":"left"}}> {data.product_name} </Text>
                                <Text style={{ fontSize:10, color:'#696969', marginBottom:5, textAlign: (lang == 'ar')? "right":"left"}}> {data.short_description} </Text>

                            <View style={{ flexDirection :(lang == 'ar')?"row-reverse" :"row",  width:width/1.5}}>
                                <Text style={{paddingRight : 10, textAlign: (lang == 'ar')? "right":"left", alignSelf: 'center'}}> {I18n.t('cart.quantity', { locale: lang })} </Text>
                                    <Countmanager
                                    quantity={data.quantity}
                                    u_id={this.state.u_id}
                                    product_id={data.product_id}
                                    updatetype={"1"}
                                    country={this.state.country}
                                    callback={this.fetchData.bind(this)}
                                    />
                            </View>
                            <View style={{ flexDirection : (lang === 'ar') ?  'row-reverse': 'row',justifyContent: 'flex-start'}}>
                                <Text style={{ fontSize:13, color:'#696969', marginBottom:5, textAlign:(lang === 'ar') ?  'right': 'left'}}>{I18n.t('cart.size', { locale: lang })}</Text>
                                <Text style={{ fontSize:13, color:'#696969', paddingRight: 5,marginBottom:5, textAlign:(lang === 'ar') ?  'right': 'left'}}>{data.size}</Text>
                            </View>
                            <View style={{ flexDirection : (lang === 'ar') ?  'row-reverse': 'row', justifyContent:"space-between"}}>
                                <Text style={{ fontWeight:"bold", color:'#696969', marginBottom:5, textAlign:(lang === 'ar') ?  'right': 'left'}}> {data.special_price} KWD</Text>
                                <Text style={{ fontWeight:"bold", fontSize:15, color: color, textDecorationLine: textDecorationLine, textAlign:(lang === 'ar') ?  'right': 'left'}}> {data.price} KWD</Text>
                            </View>
                            <View style={{ flexDirection : (lang === 'ar') ?  'row-reverse': 'row'}}>
                                <Text style={{ fontSize:13, color:'#696969', marginBottom:5,textAlign:(lang === 'ar') ?  'right': 'left'}}>{I18n.t('cart.subtotal', { locale: lang })}</Text>
                                <Text style={{ fontSize:13, color:'#696969', marginBottom:5, textAlign:(lang === 'ar') ?  'right': 'left'}}>{ data.quantity*data.special_price}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <Footer  product_id={data.product_id}
                u_id={this.state.u_id}
                cart_id={data.cart_id}
                country={this.state.country}
                callback={this.fetchData.bind(this)}
                size_arr={data.size_arr}
                lang={lang}/>
            </View>
        )
    }
}
class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
        size : '',
        color : 'blue',
        selectSize : false,
        SHORT_LIST : ['0']
    };
  }
  openDialog(product_id){
      this.setState({
          selectSize : true,
          product_id : product_id
      })
  }
  changeSize(result){
      this.setState({
          selectSize: false,
          size: result.selectedItem.label
      });
      this.editWishlist(result.selectedItem.label)
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
            // console.warn(sizeList);
            this.setState({
              SHORT_LIST: sizeList,
            })
  }

  removeFromCart(cart_id, product_id){
      const {u_id, country, user_type } = this.props;

      let formData = new FormData();
      formData.append('u_id', String(u_id));
      formData.append('country', String(country));
      formData.append('product_id', String(product_id));
      formData.append('cart_id', String(cart_id));

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

          MessageBarManager.showAlert({
              message: responseData.data.message,
              alertType: 'alert',
              stylesheetWarning : { backgroundColor : '#87cefa', strokeColor : '#fff' },
              title:''
          })
      })
      .then(()=>this.props.callback)
      .catch((error) => {
        console.log(error);
      })
      .done();
  }
  editWishlist(size){
    const { color } = this.state;
      const {u_id, country, product_id } = this.props;

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
          fetch(Utils.gurl('editWishlist'), config)
          .then((response) => response.json())
          .then((responseData) => {
              MessageBarManager.showAlert({
                      message: responseData.data.message,
                      alertType: 'alert',
                      stylesheetWarning : { backgroundColor : '#87cefa', strokeColor : '#fff' },
                      title:''
                  })
          })
          .then(()=>this.props.callback())
          .catch((error) => {
            console.log(error);
          })
          .done();
  }

  render(){
      const{lang} =this.props;
    let {product_id,cart_id } = this.props
    let {SHORT_LIST } = this.state
    return(
      <View style={[styles.bottom, {flexDirection: (lang === 'ar') ?  'row-reverse': 'row'}]}>
          <TouchableOpacity
          onPress={()=> this.removeFromCart( cart_id, product_id)}
          style={[styles.wishbutton, {flexDirection : (lang === 'ar') ?  'row-reverse': 'row', justifyContent: "center"}]}>
              <Entypo name="cross" size={20} color="#a9d5d1"/>
              <Text style={{ left : 5}}>{I18n.t('cart.remove', { locale: lang })}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.wishbutton, {flexDirection : (lang === 'ar') ?  'row-reverse': 'row', justifyContent: "center"}]}
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

    )
  }
}
const styles = StyleSheet.create ({
    container: {
        // flex: 1,
        flexDirection: 'column',
        // justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: '#ccc',
        padding : 10

    },

    row: {
        flexDirection: 'row',
        // justifyContent: 'center',
        // padding: 10,
        // backgroundColor: '#F6F6F6',
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
        // shadowOffset:{width:2,height:4}
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

function mapStateToProps(state) {
    return {
        lang: state.auth.lang,
    }
}
export default connect(mapStateToProps)(Shopingcart);
