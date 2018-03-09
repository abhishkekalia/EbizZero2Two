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
    ActivityIndicator,
    Image
} from 'react-native';
const { width, height } = Dimensions.get('window');
import Utils from 'app/common/Utils';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EventEmitter from "react-native-eventemitter";
import I18n from 'react-native-i18n'

export default class Editwish extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_wishlist : this.props.is_wishlist
        };
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
            this.removeToWishlist()
        } else {
            this.addtoWishlist()
        }
    }
    addtoWishlist ( ){
        const {u_id, country, product_id, deviceId, lang} = this.props;
        let un_id= (u_id === undefined) ? '' : u_id,
        align = (lang === 'ar') ?  'right': 'left';
        let formData = new FormData();
        formData.append('u_id', String(un_id));
        formData.append('country', String(country));
        formData.append('product_id', String(product_id));
        formData.append('device_uid', String(deviceId));
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
                        message: I18n.t('home.wishlistmsg1', { locale: lang }),
                        alertType: 'extra',
                        title:'',
                        titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                        messageStyle: { color: 'white', fontSize: 16 , textAlign:align},
                    })
                }
            })
            .then(()=>this.props.fetchData())
            .catch((error) => {
                console.log(error);
            })
            .done();
        }
    removeToWishlist (){
        const {u_id, country, product_id, deviceId,lang} = this.props;
        let un_id= (u_id === undefined) ? '' : u_id,
        align = (lang === 'ar') ?  'right': 'left';
        let formData = new FormData();
        formData.append('u_id', String(un_id));
        formData.append('country', String(country));
        formData.append('product_id', String(product_id));
        formData.append('device_uid', String(deviceId));
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
                message: I18n.t('home.wishlistmsg2', { locale: lang }),
                alertType: 'extra',
                title:'',
                titleStyle: {color: 'white', fontSize: 18, fontWeight: 'bold' },
                messageStyle: { color: 'red', fontSize: 16 , textAlign:align},
            })
        })
        .then(()=>this.props.fetchData())
        .catch((error) => {
            console.log(error);
        })
        .done();
    }
    render(){
        let heartType
        if (this.state.is_wishlist === '0')
        heartType = 'md-heart-outline';
        else
        heartType = 'md-heart' ;
        return(
            <TouchableOpacity
                onPress={()=>this.changeLabel() }
                style={{
                    left : width/2-50,
                    position : 'absolute',
                    zIndex: 1,
                    width : 50,
                    height :50,
                    backgroundColor : 'transparent'}
                }>
                <Ionicons
                    name={heartType}
                    size={25}
                    color="#a9d5d1"
                    style={{ alignSelf: 'center'}}
                    />
            </TouchableOpacity>
        )
    }
}
