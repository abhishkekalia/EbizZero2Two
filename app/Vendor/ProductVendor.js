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
import Slideshow from './Slideshow';
import DatePicker from 'react-native-datepicker';

const {width,height} = Dimensions.get('window');

export default class ProductVendor extends Component {
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

    }

    


    sizechart(){
        console.warn("size chart");
    }
    buyNow(){
        routes.AddressLists();
    }
    onSubmit () {

    }
    
    render () { 
        const { date_in, count } = this.state;
        let color = this.props.special_price ? '#a9d5d1' : '#000';
        let textDecorationLine = this.props.special_price ? 'line-through' : 'none';
        // let colorOffer = this.state.data.special_price ? 'orange' : '#fff';
        return ( 
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
        )
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