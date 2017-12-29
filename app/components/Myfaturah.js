import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  WebView
} from 'react-native';
import {Actions as routes} from "react-native-router-flux";
import Utils from 'app/common/Utils';

var BASEURL = 'http://solutiontrackers.com/dev-a/zerototwo/demo.php';

export default class Myfaturah extends Component { 
    constructor(props) {
        super(props);
        this.getKey= this.getKey.bind(this);
        this.state = {
            loading: false,
            u_id: '',
            country : '',
        }; 
    } 
    componentDidMount(){
        this.getKey()
        .done()
     }
    
    async getKey() {
        try { 
            const value = await AsyncStorage.getItem('data'); 
            var response = JSON.parse(value);  
            this.setState({ 
                u_id: response.userdetail.u_id ,
                country: response.userdetail.country 
            }); 
        } catch (error) {
            console.log("Error retrieving data" + error);
        }
    } 

    _renderLoadingIndicator = () => { 
        if (this.state.loading) { 
            return ( 
                <View style={styles.loadingOverlay}> 
                    <Text> LOADING...</Text>
                </View>
            ); 
        } else { 
            return null;
        }
    }

    _onNavigationStateChange = (navState) => {
        this.setState({ loading: navState.loading }); 

        if (navState.url.indexOf(BASEURL) != -1) {
            let status = navState.url.split("?")[1];
            let statusId = navState.url.split("?")[2]; 
            let id = statusId.split("=")[1];
            this.orderPayment(status, id)
        }
    }

    orderPayment(status, id){
        const {u_id, country} = this.state;
        let formData = new FormData();
        formData.append('u_id', String(u_id));
        formData.append('country', String(country));  
        formData.append('order_id', String(this.props.order_id));  
        formData.append('payment_id', String(country));  
        formData.append('payment_status', String(status));  
        formData.append('amount', String(5));  

        const config = { 
            method: 'POST', 
            headers: { 
                'Accept': 'application/json', 
                'Content-Type': 'multipart/form-data;',
            },
            body: formData,
        } 
        fetch(Utils.gurl('orderPayment'), config) 
        .then((response) => response.json())
        .then((responseData) => {
            routes.homePage();
        }).done();
    }

    render() {
        // console.warn(this.props.uri);
        return (
            <View style={styles.container}>
                <WebView
                ref="webview"
                source={{uri:this.props.uri}}
                onNavigationStateChange={this._onNavigationStateChange}
                javaScriptEnabled = {true}
                domStorageEnabled = {true}
                injectedJavaScript = {this.state.cookie}
                startInLoadingState={false}/>
                {this._renderLoadingIndicator()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingOverlay: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'rgba(255,255,255,0.7)',
    position:'absolute',
    top:0,
    left:0,
    bottom:0,
    right:0
  }
});