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
        .then(()=>this.props.fetchData())
        .catch((error) => {
          console.log(error);
        })       
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
                        left : width/2-33, 
                        position : 'absolute',
                        width : 25,
                        height :50,
                        backgroundColor : 'transparent'
                    }}
                    >
                        <Ionicons  
                        name={heartType} 
                        size={25} 
                        color="#a9d5d1" 
                        />
                    </TouchableOpacity>

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
        countryIcon: {
        // borderRightWidth: 1, 
        // borderColor: '#CCC',
        width : 40,
        height:40,
        padding :10
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
    }
})