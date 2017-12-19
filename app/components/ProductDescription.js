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
  Picker
} from 'react-native';
import {Actions as routes} from "react-native-router-flux";
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { BubblesLoader } from 'react-native-indicator';
import Ionicons from 'react-native-vector-icons/MaterialIcons';
import {Button} from "app/common/components";
import Utils from 'app/common/Utils';
import Slider from './slider'
import DatePicker from 'react-native-datepicker';
import AllItem from './AllItem';

const {width,height} = Dimensions.get('window');

export default class ProductDescription extends Component {
    constructor (props) { 
        super(props); 
        this.state = { 
            imgList : [] ,
            data : [],
            count : 1,
            date_in: new Date(), 
            date_out:new Date(),
            address : '',
            u_id: null,
            country : null,
            user_type: null,
            size: '', 
            color: '', 
            quantity:'',

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
        .done()
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
    addtoCart(){
    const { size, color, count } = this.state; 
        const {u_id, country, user_type } = this.state;
        let formData = new FormData();
        formData.append('u_id', String(u_id));
        formData.append('country', String(country)); 
        formData.append('product_id', String(this.props.product_id)); 
        formData.append('size', String(size)); 
        formData.append('color', String(color)); 
        formData.append('quantity', String(count)); 

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
                message: responseData.data.message, 
                alertType: 'alert', 
                stylesheetWarning : { backgroundColor : '#87cefa', strokeColor : '#fff' },
                // animationType: 'SlideFromLeft',
            })
            routes.shopingCart()
        }else{
            MessageBarManager.showAlert({ 
                message: responseData.data.message, 
                alertType: 'alert', 
                stylesheetWarning : { backgroundColor : '#87cefa', strokeColor : '#fff' },
                // animationType: 'SlideFromLeft',
            })
        }
        })
        .done();
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
        
        fetch(Utils.gurl('productDetailView'), config) 
        .then((response) => response.json())
        .then((responseData) => {
            this.setState({ 
                imgList: responseData.data.productImages,
                data : responseData.data
        });
        })
        .done();
    }

    sizechart(){
        console.warn("size chart");
    }
    buyNow(){
routes.addressbook()
    }
    onSubmit () {

    }
    
    render () { 
        const { date_in, count } = this.state;
        let color = this.state.data.special_price ? '#C5C8C9' : '#000';
        let textDecorationLine = this.state.data.special_price ? 'line-through' : 'none';
        let colorOffer = this.state.data.special_price ? 'orange' : '#fff';

        return ( 
            <ScrollView 
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}>
                <View style={{ height : height/1.5}}>
                <Slider imgList={this.state.imgList}/>
                </View>

                <View style={{ 
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between'}}>

                    <View>
                        <Text style={{ padding : 10}}>{this.state.data.product_name}</Text>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{color : 'skyblue', paddingLeft : 10}}>AED {this.state.data.special_price}</Text>
                            <Text style={{color: color, textDecorationLine: textDecorationLine, left : 20}}>AED {this.state.data.price}</Text>
                            <Text style={{color: colorOffer, left : 30}}>({this.state.data.discount} %OFF )</Text>
                        </View>
                        <View style={{ flexDirection : 'row'}}>
                            <TouchableOpacity style={styles.button} onPress={()=>this.buyNow()}>
                            <Text>Buy It Now</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonCart} onPress={()=> this.addtoCart()}>
                            <Text>Add To Cart</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                        <View style={{ justifyContent:'space-between', height: 40, backgroundColor:'#ccc', flexDirection:"row" ,alignItems: 'center' }}>
                            <Picker
                            style={{width: width/1.5,backgroundColor: '#ccc'}}
                            mode="dropdown"
                            selectedValue={this.state.size}
                            onValueChange={(itemValue, itemIndex) => this.setState({size: itemValue})}>
                                <Picker.Item label="Select Size" value="" />
                                <Picker.Item label="Small" value="small" />
                                <Picker.Item label="Medium" value="medium" />
                                <Picker.Item label="Large" value="large" />
                            </Picker>
                            <Icon
                            name="chevron-down" 
                            size={21} 
                            color="#ff8c00" 
                            style={styles.countryIcon}/>
                            </View>
                            <View style={{ justifyContent:'space-between', height: 40, backgroundColor:'#ccc', flexDirection:"row" ,alignItems: 'center' }}>
                            <Picker 
                            mode="dropdown"
                            style={{width: width/1.5,backgroundColor: '#ccc'}}
                            selectedValue={this.state.color}
                            onValueChange={(itemValue, itemIndex) => this.setState({color: itemValue})}>
                                <Picker.Item label="Select color" value="" />
                                <Picker.Item label="Red" value="red" />
                                <Picker.Item label="Yellow" value="yellow" />
                                <Picker.Item label="Pink" value="pink" />
                            </Picker>
                            <Icon
                            name="chevron-down" 
                            size={21} 
                            color="#ff8c00" 
                            style={styles.countryIcon}/>
                            </View>
                        </View>

                        <View style={{
                            flexDirection: 'row', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            padding :10
                        }}>
                        <TouchableOpacity  style={styles.qtybutton} onPress={()=> this.setState({count: count-1})}> 
                            <Text style={styles.text}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtybutton}>{count}</Text>
                        <TouchableOpacity  style={styles.qtybutton} onPress={()=> this.setState({count: count+1})}> 
                            <Text style={styles.text}>+</Text>
                        </TouchableOpacity>
                        </View>
                    <View style= {{ flexDirection :"row", justifyContent: "space-between", padding : 5}}>
                        <Ionicons name ="date-range" size={25} style={{ padding :5}} color="#87cefa"/>
                        <DatePicker
                            style ={{ width : width-50}}
                            date={this.state.date_in}
                            mode="date"
                            placeholder="hello"
                            format="YYYY-MM-DD"
                            minDate="2016-05-01"
                            maxDate={date_in}
                            showIcon={false}
                            customStyles={{
                                dateInput: {
                                    width : width, 
                                    borderWidth : 0.5, 
                                    borderColor: "#ccc", 
                                    alignItems : 'flex-start',
                                },
                            }}
                        onDateChange={(date_in) => {this.setState({date_in: date_in});}}/>
                        </View>
                        
                        <View style= {{ flexDirection :"row", justifyContent: "space-between", padding : 5}}>
                            <Ionicons name ="place" size={25} style={{ padding :5}} color="#87cefa"/>
                            <TextInput style={{ height: 40 ,  width : width-50 ,borderWidth : 0.5, borderColor: "#ccc"}}
                                placeholder="Delivery Address"
                                underlineColorAndroid = 'transparent'
                                value={this.state.address} />
                        </View>
                        <View style={{ borderColor :"#ccc", borderWidth:0.5, paddingLeft : 20, paddingRight:20}}>
                            <Text style={{ height : 40 }}> Product info & care</Text>
                            <Text> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                                consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                                proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 
                            </Text>
                            <View style={{ flexDirection: 'column', paddingTop : 10}}>
                                <View style={{ flexDirection: 'row'}}>
                                <Text style={ styles.description}>Fabric</Text><Text>Cotton</Text>
                                </View>
                                <View style={{ flexDirection: 'row'}}>
                                <Text style={ styles.description}>Length</Text><Text>Cotton</Text>
                                </View>
                                <View style={{ flexDirection: 'row'}}>
                                <Text style={ styles.description}>Sleeves</Text><Text>Cotton</Text>
                                </View>
                                <View style={{ flexDirection: 'row'}}>
                                <Text style={ styles.description}>Neck</Text><Text>Cotton</Text>
                                </View>
                                <View style={{ flexDirection: 'row'}}>
                                <Text style={ styles.description}>Fit</Text><Text>Cotton</Text>
                                </View>
                                <View style={{ flexDirection: 'row'}}>
                                <Text style={ styles.description}>Wash</Text><Text>Cotton</Text>
                                </View>
                                <View style={{ flexDirection: 'row'}}>
                                <Text style={ styles.description}>Color</Text><Text>Cotton</Text>
                                </View>
                                <View style={{ flexDirection: 'row'}}>
                                <Text style={ styles.description}>Sku</Text><Text>Cotton</Text>
                                </View>
                            </View>
                        </View>
                        <Text style={{padding:10}}>more Product by ZeroToTwo</Text>
                        <AllItem/>
                    </View>
                    
                </View>
            </ScrollView>
        )
    }
}
const styles = {
    contentContainer: { 
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
        // shadowOffset:{width:2,height:4}
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
        width: width/2,
        marginBottom: 10,
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
    }
}
