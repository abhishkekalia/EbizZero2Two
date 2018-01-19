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
  ListView,
  ActivityIndicator
} from 'react-native';
import {Actions as routes} from "react-native-router-flux";
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';

import { BubblesLoader } from 'react-native-indicator';
import Ionicons from 'react-native-vector-icons/MaterialIcons';
import {Button} from "app/common/components";
import Utils from 'app/common/Utils';
import Slider from './slider'
import DatePicker from 'react-native-datepicker';
import AllItem from './AllItem';
import Share, {ShareSheet} from 'react-native-share';
import {CirclesLoader} from 'react-native-indicator';

const {width,height} = Dimensions.get('window');

export default class ProductDescription extends Component {
    constructor (props) { 
        super(props); 
        this.state = { 
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }), 
            imgList : [] ,
            data : [],
            count : '1',
            date_in: new Date(), 
            date_out:new Date(),
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
            addressStatus :false

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
        const { size, count, color} = this.state; 

        if (!size.length)
        {
            MessageBarManager.showAlert({
                message: "Please Select Size",
                alertType: 'alert',
            })
            return false
        }
        if (!color.length)
        {
            MessageBarManager.showAlert({
                message: "Please Select Color",
                alertType: 'alert',
            })
            return false
        }
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
        const {u_id, country, user_type } = this.state;
        if (this.validate()) {

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
                })
                routes.shopingCart()
        }else{
            MessageBarManager.showAlert({ 
                message: responseData.data.message, 
                alertType: 'alert', 
                stylesheetWarning : { backgroundColor : '#87cefa', strokeColor : '#fff' },
            })
        }
        })
        .done(); }
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
            if(responseData.status){ 
                this.setState({ 
                    imgList: responseData.data.productImages,
                    data : responseData.data,
                    status : true
                });
            }
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
        }).done();
    }

    sizechart(){
        console.warn("size chart");
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
                    })
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
        }}/>
        );
    }
    noItemFound(){
        return (
            <View style={{ flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                <Text>You have no Added Address </Text>
                <TouchableOpacity onPress={()=>routes.newaddress()}><Text>Add From here</Text></TouchableOpacity>
               </View> );
    }

    render () {
        const { date_in, count } = this.state;
        let color = this.state.data.special_price ? '#a9d5d1' : '#000';
        let textDecorationLine = this.state.data.special_price ? 'line-through' : 'none';
        let colorOffer = this.state.data.special_price ? 'orange' : '#fff';
        if (!this.state.status) {
            return this.renderLoading();
        }
        if (!this.state.addressStatus) {
            return this.noItemFound();
        }  
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
                <View style={{ height : height/1.5}}>
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
                    justifyContent: 'space-between'}}>

                    <View>
                        <Text style={{ padding : 10, color : '#000'}}>{this.state.data.product_name}</Text>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{  color : '#a9d5d1', paddingLeft : 10}}>Price</Text>
                            <Text style={{color : '#ccc', }}> KWD {this.state.data.special_price}</Text>
                            <Text style={{color: color, textDecorationLine: textDecorationLine, left : 5}}>{this.state.data.price}</Text>
                            <Text style={{color: colorOffer, left : 10}}>{this.state.data.discount} %OFF </Text>
                        </View>
                        <View style={{ flexDirection : 'row'}}>
                            <TouchableOpacity style={styles.button} onPress={this.onOpen.bind(this)}>
                            <Text>Buy It Now</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonCart} onPress={()=> this.addtoCart()}>
                            <Text>Add To Cart</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Picker 
                            style={{
                                borderWidth : 1,
                                borderColor : '#ccc',
                                alignSelf: 'stretch',
                                color: 'black',
                                padding : 10
                            }}
                            mode="dropdown"
                            selectedValue={this.state.size}
                            onValueChange={(itemValue, itemIndex) => this.setState({size: itemValue})}>
                                <Picker.Item label="Select Size" value="" />
                                <Picker.Item label="Small" value="small" />
                                <Picker.Item label="Medium" value="medium" />
                                <Picker.Item label="Large" value="large" />
                            </Picker>
                            <Picker 
                            mode="dropdown"
                            style={{
                                borderWidth : 1,
                                borderColor : '#ccc',
                                alignSelf: 'stretch',
                                color: 'black',
                                padding : 10
                            }}
                            selectedValue={this.state.color}
                            onValueChange={(itemValue, itemIndex) => this.setState({color: itemValue})}>
                                <Picker.Item label="Select color" value="" />
                                <Picker.Item label="Red" value="red" />
                                <Picker.Item label="Yellow" value="yellow" />
                                <Picker.Item label="Pink" value="pink" />
                            </Picker>
                        </View>

                        <View style={{
                            flexDirection: 'row', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            padding :10
                        }}>
                        <TouchableOpacity  style={styles.qtybutton} onPress= {()=> this.decrement()}> 
                            <Text style={styles.text}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtybutton}>{count}</Text>
                        <TouchableOpacity  style={styles.qtybutton} onPress={()=> this.setState({count: parseInt(this.state.count)+1})}> 
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
                            <Text style={{ height : 30 , textAlign : 'center'}}> Product info & care</Text>
                            <Text> {this.state.data.short_description}
                            </Text>
                            <Text> {this.state.data.detail_description}
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
                        <AllItem product_category={this.state.data.product_category}/>
                    </View>

                </View>

           
            </ScrollView>
                 <ShareSheet visible={this.state.visible} onCancel={this.onCancel.bind(this)}>
                {listView}
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
        return (
                <TouchableOpacity style={{ flexDirection: 'row' ,padding : 10}} onPress= {()=>this.order(data.address_id)}>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={{ width: width-125, flexDirection: 'row' , justifyContent: 'space-between'}}>    
                            <Text style={{ fontSize: 15}}>{data.full_name}</Text>
                        </View>
                        <Text style={{ fontSize : 10}}>{data.mobile_number}</Text>
                        <Text style={{fontSize:12}}>
                        {[data.address_line1 ," ", data.address_line2 , " ", data.landmark," ", data.town, " ",data.city, " ", data.state, "(", data.pincode ,")"]}
                        </Text>
                    </View>
                </TouchableOpacity>
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

    contentContainer: { 
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