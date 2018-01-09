import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Image,
  View
} from 'react-native';
import Swiper from 'react-native-swiper';
import { BubblesLoader } from 'react-native-indicator';
import Utils from 'app/common/Utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MessageBarManager } from 'react-native-message-bar';

const {width,height} = Dimensions.get('window');

const Slide = props => { 
    let heartType
    if (props.is_wishlist === '0') 
        heartType = 'ios-heart-outline'; 
    else 
        heartType = 'ios-heart' ;        
    return ( 
        <View style={[styles.slide]}>
          <Image onLoad={props.loadHandle.bind(null, props.i)} 
                resizeMode={'stretch'}
 
            style={styles.image} 
            source={{uri: props.uri}} />
            <Ionicons 
                style={{ 
                    left : width-50, 
                    position : 'absolute' ,
                    top : 20
                }} 
            name={heartType}
            size={30} 
            color="#a9d5d1" 
            onPress={()=>props.callback()}
            />
            {
              !props.loaded && <View style={styles.loadingView}> 
              <BubblesLoader 
                color= {'#6a5acd'} 
                size={40} 
                dotRadius={10} />
            </View>
        }
        </View>
    )
}
export default class Slider extends Component<{}> {
    constructor (props) { 
        super(props); 
        this.state = { 
            data : [],
            loadQueue: [0, 0, 0, 0],
            is_wishlist : this.props.wishlist
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
    changeLabel(){
        let wish
        if (this.state.is_wishlist === '0') 
            wish = '1'; 
        else 
        wish = '0'; 
            this.setState({
            is_wishlist : wish
        }
        ,()=>{this.updateState()}
        )
    }
    updateState(){
        let toggleWishList  
        if(this.state.is_wishlist === '0') { 
            this.addtoWishlist() 
        } else { 
            this.removeToWishlist()
        }
    }
    addtoWishlist ( ){
        const {u_id, country, product_id } = this.props;

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
           if(responseData.status){
                MessageBarManager.showAlert({ 
                    message: responseData.data.message, 
                    alertType: 'alert', 
                })
            }
        })
        .then(()=>this.props.updateState())
    .done();

    }
    removeToWishlist (){
        const {u_id, country, product_id } = this.props;

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
        fetch(Utils.gurl('removeFromWishlist'), config) 
        .then((response) => response.json())
        .then((responseData) => {
            MessageBarManager.showAlert({ 
            message: responseData.data.message, 
            alertType: 'alert', 
            })
        })
        .then(()=>this.props.updateState())
        .done();
    }

    render() {

    return (
        <View style={styles.container}>
            <Swiper loadMinimal loadMinimalSize={1} style={styles.wrapper} loop={false}>
                {
                this.props.imgList.map((item, i) => <Slide
                      loadHandle={this.loadHandle}
                      loaded={!!this.state.loadQueue[i]}
                      data ={this.props.data}
                      updateState={this.props.updateState}
                      u_id ={this.props.u_id}
                      country ={this.props.country}
                      is_wishlist= {this.state.is_wishlist}
                      callback = {this.changeLabel.bind(this)}
                      uri={item}
                      i={i}
                      key={i} />
                    )
                }
            </Swiper>
        </View>
    );
  }
}

const styles = StyleSheet.create({ 
    container: { 
        flex: 1
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
      width : '100%',
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
});