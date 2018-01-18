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
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { MessageBarManager } from 'react-native-message-bar';
import  Countmanager  from './Countmanager';
import {Actions as routes} from "react-native-router-flux";

const { width, height } = Dimensions.get('window');

const ShopingcartItems = [{
    "product_id": "47",
    "size": "medium",
    "quantity": "1",
    "delivery_address_id": "31",
    "vendor_id":"4",
    "price":"2600",
    "delivery_datetime": "2017-12-29 02:02:56",
    "order_date": "2017-12-28 08:44:04"
}]
export default class Shopingcart extends Component {
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
            color: '', 
            u_id: null,
            user_type : null,
            country : null,
            status : false
        };
        // this.ShopingItems = [];

    } 
    componentDidMount(){
        this.getKey()
        .then(()=>this.fetchData())
        .done()
        
        // var o = {"0":"1","1":"2","2":"3","3":"abhi"};
        // var arr = Object.keys(o).map(function(k) { return o[k] });
        // console.warn(arr)
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
            // alert(responseData.data.message);

            MessageBarManager.showAlert({ 
                message: responseData.data.message, 
                alertType: 'alert', 
        stylesheetWarning : { backgroundColor : '#ff9c00', strokeColor : '#fff' },
        animationType: 'SlideFromLeft',
    })

        //     this.setState({
        //     data: responseData.data
        // });
        }).done();
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
                            "delivery_address_id": "29",
                            "vendor_id":"4",
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
        .done();
    }

    removeFromCart(cart_id, product_id){
    const { size, color,  } = this.state; 
        const {u_id, country, user_type } = this.state;

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
            })
        })
        .then(()=>this.fetchData())
        .done();
    }

    viewNote(rowData) {
    } 
    validate(){
        const { ShopingItems} = this.state; 

        if (!ShopingItems.length)
        {
            MessageBarManager.showAlert({
                message: "Please Select Items For Your Cart",
                alertType: 'alert',
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
        return(
        <View 
                style={{ 
                    flexDirection : "column", 
                }}> 
                <View 
                    style={{ 
                        flexDirection : "row", 
                        justifyContent: "space-between", 
                        alignItems:'center', 
                        padding : 5, 
                        flex : 0}}> 
                <Text>Items({itemcount})</Text>
                <Text> $ {totalamount}</Text>
                </View>
                <View 
                    style={{ 
                        flexDirection : "row", 
                        justifyContent: "space-between", 
                        alignItems:'center',
                        padding : 5, 
                        flex : 0}}> 
                <Text style={{ color : "#87cefa"}} >Cart SubTotal</Text>
                <Text style={{ color : "#87cefa"}}> $ {subtotalamount}</Text>
                </View>
            </View>

            
        )
    }
    noItemFound(){
        return (
            <View style={{ flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                <Text> No Item added to your cart </Text>
               </View> );
    }

    render() {
        const { itemcount, totalamount, subtotalamount } = this.state;
        
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

        <View style={{ flexDirection : 'row', justifyContent : 'space-around'}}>
                <TouchableHighlight 
                underlayColor ={"#fff"} 
                style={[styles.shoping]} 
                onPress={()=>routes.homePage()}>
                <Text style={{ color :'#fff'}}>Continoue Shoping</Text>
                </TouchableHighlight>
                <TouchableHighlight 
                underlayColor ={"#fff"} 
                style={[styles.checkout]} 
                onPress={()=> this.procedToCheckout()}>
                <Text style={{ color : '#fff'}}>Proced to Checkout</Text>
                </TouchableHighlight>
            </View>
        </View>
        );
    }
    renderData( data, rowData: string, sectionID: number, rowID: number, index) {

        let color = data.special_price ? '#a9d5d1' : '#000';
        let textDecorationLine = data.special_price ? 'line-through' : 'none';
    
        return (
            <View style={{ 
            flexDirection: 'column',
            marginTop : 2, 
            borderWidth : 0.5, 
            borderColor : "#ccc", 
            borderRadius : 5}}>
                <View style={{ 
                flexDirection: 'row', 
                backgroundColor : "transparent"}}>
                            
                    <View style={{flexDirection: 'column', justifyContent : 'space-between'}}>
                        <View style={{ flexDirection: 'row' , backgroundColor : "#fff", justifyContent : 'space-around', alignItems : 'center'}}>

                            <Image style={[styles.thumb, {margin: 10}]} 
                            source={{ uri : data.productImages[0] ? data.productImages[0].image : null}}/>
                        <View>
                            <TouchableHighlight
                            underlayColor='transparent'
                            onPress={this.viewNote.bind(this, data)} 
                            style={styles.row} >        
                                <Text > {data.product_name} </Text>
                            </TouchableHighlight>

                            <View style={{ flexDirection : "row"}}>
                                <Text style={{paddingRight : 10}}> Quentity : </Text>
                                    <Countmanager  
                                    quantity={data.quantity} 
                                    u_id={this.state.u_id} 
                                    product_id={data.product_id} 
                                    updatetype={"1"} 
                                    country={this.state.country} 
                                    callback={this.fetchData.bind(this)}
                                    />

                            </View>
                            <View style={{ flexDirection : "row", justifyContent:"space-between"}}>
                            <View style={{ flexDirection : "row"}}>
                                <Text >PRICE : </Text>
                                <Text> {data.special_price} </Text>
                                <Text style={{fontSize:15, color: color, textDecorationLine: textDecorationLine}}> {data.price} </Text>
                            </View>
                                <Text> KWD</Text>
                            </View>
                            <SelectItem size={data.size} color={data.color} getsize={this.getSize.bind(this)} getcolor={this.getColor.bind(this)} />

                        </View>
                    </View>
                </View>
               
            </View>
             
                <View style={styles.bottom}>
                    <TouchableOpacity 
                    onPress={()=> this.removeFromCart(data.cart_id, data.product_id)}
                    style={[styles.wishbutton, {flexDirection : 'row', justifyContent: "center"}]}>
                        <Entypo name="cross" size={20} color="#a9d5d1"/>
                        <Text style={{ left : 5}}>Remove</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.wishbutton, {flexDirection : 'row', justifyContent: "center"}]} 
                        onPress={()=> this.addtoWishlist(data.product_id)}
                        >
                        <Entypo name="heart-outlined" size={20} color="#a9d5d1"/> 
                        <Text style={{ left :5}}>Add To wishlist</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
class SelectItem extends Component{
        constructor(props) { 
        super(props); 
        this.state = { 
            size: this.props.size, 
            color: this.props.color, 
        }; 
    }
    
    render(){
        return(
        <View style={{ flexDirection:'row'}}> 
            <View style={{width: width/3, justifyContent : 'center'}}> 
            <Text style={{ fontSize : 13, color: '#a9d5d1'}}>Size : {this.state.size} </Text>
                <Picker
                mode="dropdown"

                selectedValue={this.state.size}
                onValueChange={(itemValue, itemIndex) => this.setState({size: itemValue})}>
                    <Picker.Item label="Select Size" value="" />
                    <Picker.Item label="Small" value="small" />
                    <Picker.Item label="Medium" value="medium" />
                    <Picker.Item label="Large" value="large" />
                </Picker>
            </View>
            <View style={{width: width/3, justifyContent : 'center'}}>
                        <Text style={{ fontSize : 13, color: '#a9d5d1'}}> Color : {this.state.color} </Text>
 
                <Picker 
                mode="dropdown"
                selectedValue={this.state.color} 
                onValueChange={(itemValue, itemIndex) => this.setState({color: itemValue})}>
                    <Picker.Item label="Select color" value="" />
                    <Picker.Item label="Red" value="red" />
                    <Picker.Item label="Yellow" value="yellow" />
                    <Picker.Item label="Pink" value="pink" />
                </Picker>
            </View>
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
        borderWidth : 1,
        borderColor : "#ccc",
        shadowOpacity: 0.2,
        shadowRadius: 2,
        // shadowOffset:{width:2,height:4}
    },

    wishbutton :{
        alignItems : 'center', 
        width : width/2-10,
        // borderBottomLeftRadius : 10, 
        // borderBottomRightRadius : 10, 
        borderWidth : 0.5, 
        borderColor : "#ccc",
        padding : 5

    },

    thumb: {
        width   : width/5,
        height  :width/4 ,
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
        flexDirection : 'row',
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
        backgroundColor : "#f53d3d",
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