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



export default class Countmanager extends Component {
	constructor(props) { 
        super(props); 
        this.state = { 
            Quentity : parseInt(this.props.quantity),
            loaded: true,

        }; 
    }

    updateQuantity(){
        const { Quentity } = this.state;
        const { u_id, product_id , updatetype, country} = this.props;

        this.setState({ loaded : false })
        
        let formData = new FormData();
        formData.append('u_id', String(u_id));
        formData.append('product_id', String(product_id));
        formData.append('quantity', String(Quentity));
        formData.append('updatetype', String(updatetype));  
        formData.append('country', String(country));

        const config = { 
            method: 'POST', 
            headers: { 
                'Accept': 'application/json', 
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        } 

        fetch(Utils.gurl('updateQuantity'), config) 
        .then((response) => response.json())
        .then((responseData) => {
            MessageBarManager.showAlert({ 
                    message: responseData.data.message, 
                    alertType: 'alert', 
                    stylesheetWarning : { backgroundColor : '#a9d5d1', strokeColor : '#fff' },
                })
        })
        .then( ()=> this.setState({
            loaded : true
        }))
        .done();
    }
    decrement () {
 	if(this.state.Quentity > 1) 
            this.setState({Quentity : this.state.Quentity-1})  
            this.updateQuantity();
    } 
    increment(){
        this.setState({Quentity: this.state.Quentity+1 })
        this.updateQuantity();

    }
    renderLoadingView() {
        return (
            <ActivityIndicator  
            style={[styles.centering]}
            color="#a9d5d1" 
            size="small"/>
            );
    }
	render(){ 
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
		return(
			<View style={{ flexDirection: 'row'}}>
			<TouchableOpacity 
			style={styles.qtybutton} 
			onPress= {()=> this.decrement()}
            // onPress={(Quentity)=> this.setState({Quentity : this.state.Quentity-1})}
            >
			<Text style={{color: '#a9d5d1'}}> - </Text>
			 </TouchableOpacity>
			 <Text style={[styles.qtybutton]}> {this.state.Quentity} </Text>
            <TouchableOpacity 
               style={styles.qtybutton} 
            onPress= {()=> this.increment()}>
            <Text style={{color: '#a9d5d1'}}> +</Text>
            </TouchableOpacity>			
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
