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
  ListView,
  Picker,
  Button
} from 'react-native';
import {Actions as routes} from "react-native-router-flux";
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';

import { BubblesLoader } from 'react-native-indicator';
import Ionicons from 'react-native-vector-icons/MaterialIcons';
import Utils from 'app/common/Utils';
import Slideshow from './Slideshow';
import DatePicker from 'react-native-datepicker';
import Share, {ShareSheet} from 'react-native-share';
import {CirclesLoader} from 'react-native-indicator';

const {width,height} = Dimensions.get('window');

export default class ProductVendor extends Component {
    constructor (props) { 
        super(props); 
        this.state = {
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),  
            imgList : [] ,
            data : [],
            count : 1,
            date_in: '', //new Date(), 
            date_out:new Date(),
            address : '',
            u_id: null,
            country : null,
            user_type: null,
            size: '', 
            color: '', 
            quantity:'',
            service_provider_id : ''
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
    onCancel() {
    console.log("CANCEL")
    this.setState({visible:false});
  }
  onOpen() {
        if(this.validate()) { 
            console.log("OPEN")
            this.setState({visible:true});
      }
  }

    componentDidMount(){
        // console.warn(this.props.productImages[0].image);
        var Items = this.props.productImages,
            length = Items.length,
            organization,
            Select =[],
            user,
            i;

        for (i = 0; i < length; i++) {
            organization = Items[i];
            Select.push ({
                        // "title": organization.image_id,
                        "url": organization.image,
                    })                 
        }
                // console.warn(Select);

        this.setState({ imgList : Select});
        this.getKey()
        .then( ()=>this.fetchAddress())
        .then( ()=>this.serviceDetail())
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

    removeLoader = () => this.setState({ 
        visibleModal : false,
    })
    serviceDetail(){ 
        const {u_id, country } = this.state; 
        let formData = new FormData();
        formData.append('u_id', String(u_id));
        formData.append('country', String(country)); 
        formData.append('service_id', String(this.props.service_id)); 

        const config = { 
            method: 'POST', 
            headers: { 
                'Accept': 'application/json', 
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
            }
        fetch(Utils.gurl('serviceDetail'), config) 
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.status){
                this.setState({
                service_provider_id : responseData.data.u_id
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
    sizechart(){
        console.warn("size chart");
    }
    validate(){
        const { date_in } = this.state;
            if (!date_in.length){
                MessageBarManager.showAlert({
                    message: "Plese Select Booking Date",
                    alertType: 'warning',
                })      
            return false
            } 
            return true

    } 

    buyNow(){
        routes.AddressLists();
    }
    order (delivery_address_id){
        const{ data , size, color, count  } = this.state;
            var Select =[];
            
        var today = new Date();

        currentdate= today.getFullYear() +'-'+ parseInt(today.getMonth()+1) + '-'+ today.getDate() + ' '+  today.toLocaleTimeString() ;

            this.addToOrder(delivery_address_id)
            .then(()=>this.setState({ 
                visible:false,
                visibleModal: true,
            }))
            .done()
    }
    async addToOrder(value){
        const { u_id, country, date_in, service_provider_id} = this.state; 
        
        currentdate = date_in + ' '+ new Date().toLocaleTimeString();

        try { 
            let formData = new FormData();
            formData.append('u_id', String(u_id));
            formData.append('country', String(country));
            formData.append('service_id', String(this.props.service_id));
            formData.append('service_datetime', String(currentdate));
            formData.append('address_id', String(value));
            formData.append('service_provider_id', String(service_provider_id));
            formData.append('amount', String(this.props.special_price));

            const config = { 
                   method: 'POST', 
                   headers: { 
                        'Accept': 'application/json', 
                        'Content-Type': 'multipart/form-data;',
                   },
                   body: formData,
              }
            fetch(Utils.gurl('bookService'), config)  
            .then((response) => response.json())
            .then((responseData) => {
 
            if(responseData.status){
              routes.bookmyservice({ 
                uri : responseData.data.url, 
                service_id : this.props.service_id, 
                price : this.props.special_price,
                callback: this.removeLoader
            })
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
        let color = this.props.special_price ? '#a9d5d1' : '#000';
        let textDecorationLine = this.props.special_price ? 'line-through' : 'none';

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
                <SlideshowTest imgList={this.state.imgList}/>
                </View>

                <View style={{ 
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    }}>

                    <View >
                        <Text style={{ padding : 10, color:"#000"}}>{this.props.product_name}</Text>
                            <View style={{ flexDirection : "row"}}>
                            <Text style={{color : '#f53d3d'}} >Price : </Text>
                            <Text> {this.props.special_price} </Text>
                            <Text style={{ color: color, textDecorationLine: textDecorationLine}}> {this.props.price} </Text>
                                <Text style={{color : '#ccc'}} >KWD</Text>
                        </View>

                {this.props.is_user ?  
                    <View style={{ borderColor :"#ccc", borderWidth:1, paddingTop : 10}}>
                        <Button onPress={this.onOpen.bind(this)}
                        title= "Book Now"
                        color="#a9d5d1"
                        />                      
                    <View style= {{ flexDirection :"row", justifyContent: "space-between", padding : 5}}>
                        <Ionicons name ="date-range" size={25} style={{ padding :5}} color="#87cefa"/>
                        <DatePicker
                            style ={{ width : width-50}}
                            date={this.state.date_in}
                            mode="date"
                            format="YYYY-MM-DD"
                            minDate="2017-01-20"
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
                        </View>

                        : undefined }
                        
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

class SlideshowTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: 1,
            interval: null,
        };
    }

    componentWillMount() {
        this.setState({
          interval: setInterval(() => {
            this.setState({
              position: this.state.position ===this.props.imgList.length ? 0 : this.state.position + 1
            });
          }, 2000)
        });
    }

    componentWillUnmount() { 
        clearInterval(this.state.interval);
    }

    render() { 
        return (
        <Slideshow 
        height ={height - 200}
        dataSource={this.props.imgList}
        position={this.state.position}
        onPositionChanged={position => this.setState({ position })} />
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
    qtybutton: {
        width : 40,
        height : 40,
        padding: 10,
        alignItems: 'center',
        borderWidth : 1,
        borderColor : "#87cefa",
        shadowOpacity: 0.2,
        shadowRadius: 2,
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
        margin: 10,
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