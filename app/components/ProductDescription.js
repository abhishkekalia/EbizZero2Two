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
  Button,
  ListView,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import {Actions as routes} from "react-native-router-flux";
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';

import { BubblesLoader } from 'react-native-indicator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Utils from 'app/common/Utils';
import Slider from './slider'
import DatePicker from 'react-native-datepicker';
import AllItem from './AllItem';
import Share, {ShareSheet} from 'react-native-share';
import {CirclesLoader} from 'react-native-indicator';
import {
  MaterialDialog,
  MultiPickerMaterialDialog,
  SinglePickerMaterialDialog,
} from 'react-native-material-dialog';
import { material } from 'react-native-typography';

const {width,height} = Dimensions.get('window');

const buttons = [
    {
      text: 'button one',
      action: () => console.log('pressed button one'),
    }, 
    {
      text: 'button two',
      action: () => console.log('pressed button two')            
    }
];

export default class ProductDescription extends Component {
    constructor (props) { 
        super(props); 
        this.state = { 
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }), 
            imgList : [] ,
            data : [],
            count : '1',
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
            addressStatus :false,
            Size : [],
            selectColor: false,
            sizeindex : null
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
        .catch((error) => {
          console.log(error);
        })       
        .done();
    }
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
        
        fetch(Utils.gurl('productDetail'), config) 
        .then((response) => response.json())
        .then((responseData) => {
            var Items = responseData.data.productImages,
            length = Items.length,
            organization,
            Select =[],
            user,
            i;

        for (i = 0; i < length; i++) {
            organization = Items[i];
            Select.push (organization.image)                 
        }
            if(responseData.status){ 
                this.setState({ 
                    imgList : Select,
                    data : responseData.data,
                    Size : responseData.data.size,
                    status : true
                });
            }
        })
        .catch((error) => {
          console.log(error);
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
        })
        .catch((error) => {
          console.log(error);
        })       
        .done();
        
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
       let titleColor = this.state.size ? '#a9d5d1' : '#ccc';

        let color = this.state.data.special_price ? '#a9d5d1' : '#000';
        let textDecorationLine = this.state.data.special_price ? 'line-through' : 'none';
        let colorOffer = this.state.data.special_price ? 'orange' : '#fff';
        if (!this.state.status) {
            return this.renderLoading();
        }
        // if (!this.state.addressStatus) {
        //     return this.noItemFound();
        // }
        const renderedButtons =  this.state.Size.map((b, i) => {
            return <Button  
            color = {this.state.sizeindex === i ? '#a9d5d1' : '#ccc'} 
            key={b.size} 
            title={b.size} 
            onPress={()=>this.setState({ 
                size: b.size,
                sizeindex : i
            })}/>;
        });  
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
                <View style={{ height : height/2}}>
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
                        <Text style={{ padding : 10, color : '#696969', fontSize:15}}>{this.state.data.product_name}</Text>
                        <Vendor 
                        vendor_id= {this.state.data.vendor_id}
                        u_id={this.state.u_id}
                        country={this.state.country}
                        />
                        <View style={{flexDirection: 'row', justifyContent:'space-between', marginBottom : 10}}>
                            <Text style={{color : '#a9d5d1', fontWeight:'bold' }}>  {this.state.data.special_price} KWD</Text>
                            <Text style={{color: color, textDecorationLine: textDecorationLine, fontWeight:'bold'}}>{this.state.data.price} KWD</Text>
                        </View>
                        <View style={{ flexDirection : 'row'}}>
                            <TouchableOpacity style={styles.button} onPress={this.onOpen.bind(this)}>
                            <Text style={{ color:'#fff'}}>Buy It Now</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.buttonCart,{ flexDirection:'row', justifyContent:'center'}]} onPress={()=> this.addtoCart()}>
                            <Ionicons name="md-basket" size={25} color="#fff" />
                            <Text style={{ color:'#fff'}}>Add To Cart</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                        <View style={{flexDirection:"row", padding : 10, alignItems:'center',height:40}}>
                        <Icon 
                        name="select-all"
                        size={25}
                        color="#FFCC7D" 
                        />
                        <Text style={{color:'#a9d5d1'}}>Select Size </Text>
                        </View>
                        <View style={{flexDirection : 'row', justifyContent: 'space-around'}}>
                             {renderedButtons}
                        </View>
                        <View style={{flexDirection : 'row',alignItems:'center', justifyContent:'space-around'}}>
                            <TouchableOpacity 
                            style={{ borderWidth: StyleSheet.hairlineWidth, borderColor:'#a9d5d1', padding : 10, borderRadius: 10}}
                            onPress={() => this.setState({ selectColor: true })}>
                                <Text>Select Color</Text>
                            </TouchableOpacity>
                            <View style={{backgroundColor: this.state.color ? this.state.color.toString() : '#fff', width:25, height:25}} />
                            <View style={{
                            flexDirection: 'row', 
                            justifyContent: 'center', 
                            // alignItems: 'center',
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
                            </View>
                        </View>
                        <View style={{ borderColor :"#ccc", borderWidth:0.5, paddingLeft : 20, paddingRight:20}}>
                            <Text style={{ height : 30 }}> Product Information</Text>
                            <View style={{ width : width/4, borderWidth:StyleSheet.hairlineWidth, borderColor:'#FFCC7D'}}/>
                            <Text> {this.state.data.short_description}
                            </Text>
                            <Text> {this.state.data.detail_description}
                            </Text>
                            
                        </View>
                        <Text style={{padding:10}}>more Product by ZeroToTwo</Text>
                        <AllItem product_category={this.state.data.product_category}/>
                    </View>

                </View>
        <SinglePickerMaterialDialog
          title={'Select Color'}
          items={SHORT_LIST.map((row, index) => ({ value: index, label: row }))}
          visible={this.state.selectColor}
          selectedItem={this.state.singlePickerSelectedItem}
          onCancel={() => this.setState({ selectColor: false })}
          onOk={result => {
            this.setState({ selectColor: false });
            this.setState({ color: result.selectedItem.label });
          }}
        />
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
         if (!this.state.addressStatus) {
            return this.noItemFound();
        }

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
const SHORT_LIST = ['red', 'yellow', 'pink'];

class Vendor extends Component{
    constructor(props){
        super(props);
        this.state = {
            vendor_id : [],
            isLoading : true
        }
    }

    componentDidMount(){
        this.fetchData();
    }

    search = (nameKey, myArray)=>{ 
        for (var i = 0; i < myArray.length; i++) { 
            if (myArray[i].u_id === nameKey) { 
                return myArray[i].ShopName;
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
        fetch(Utils.gurl('listOfAllShop'), config) 
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.status){
                this.setState({
                vendor_id: responseData.data,
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
    let product_id = this.props.vendor_id
    let product = this.state.vendor_id

    let resultObject = this.search(product_id, product);

    return (
        <Text style={styles.category}>{ this.state.vendor_id ? resultObject: undefined}
        </Text>
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
        padding: 10,
        alignItems: 'center',
        borderWidth : 1,
        borderColor : "#ccc",
        shadowOpacity: 0.2,
        shadowRadius: 2,
        // shadowOffset:{width:2,height:4}
    },
    text: {
        color: '#a9d5d1',
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
        backgroundColor: '#fbcdc5',
        alignItems: 'center',
    },
    buttonCart: {
        width: width/2,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#a9d5d1',
        alignItems: 'center',
    },
    category:{
        color :'#696969',
        fontSize : 12,
        left : 10,
        marginBottom : 10
    }

}